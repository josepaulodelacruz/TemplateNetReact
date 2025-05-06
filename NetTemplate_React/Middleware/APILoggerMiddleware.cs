using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Http.Internal;
using System.Security.Claims;
using System.IO;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IO;

namespace NetTemplate_React.Middleware
{
    // Middleware class to log API requests
    public class APILoggerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;
        private readonly string _connectionString;
        private readonly string _tableName;
        private readonly RecyclableMemoryStreamManager _recyclableMemoryStreamManager;
        private readonly int _maxBodyLength;

        public APILoggerMiddleware(RequestDelegate next, ILoggerFactory loggerFactory, IConfiguration configuration)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
            _logger = loggerFactory?.CreateLogger<APILoggerMiddleware>() ?? throw new ArgumentNullException(nameof(loggerFactory));
            _connectionString = configuration.GetConnectionString("DEV") ?? throw new InvalidOperationException("Connection string 'DEV' not found in configuration");
            _tableName = configuration.GetValue<string>("APILogger:TableName") ?? "APILogs";
            _recyclableMemoryStreamManager = new RecyclableMemoryStreamManager();
            _maxBodyLength = configuration.GetValue<int>("APILogger:MaxBodyLength", 1500);
        }

        public async Task Invoke(HttpContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            if (!IsLoggingEnabled())
            {
                await _next(context).ConfigureAwait(false);
                return;
            }

            var stopwatch = Stopwatch.StartNew();
            DateTime startTime = DateTime.UtcNow;
            string userId = GetUserId(context);

            // Store values in context items for later use
            context.Items["RequestStartTime"] = startTime;
            context.Items["UserId"] = userId;

            // Read request body - only if needed and within size limits
            string requestBody = null;
            if (ShouldCaptureRequestBody(context.Request))
            {
                requestBody = await ReadRequestBodyAsync(context.Request).ConfigureAwait(false);
            }

            // Log request start (fire and forget to avoid delaying the request)
            // In .NET 2.1, we'll use Task.Factory.StartNew instead of Task.Run for better compatibility
            var requestStartTask = Task.Factory.StartNew(async () =>
            {
                try
                {
                    var logStartEntry = new LogEntry
                    {
                        Timestamp = startTime,
                        EventType = "RequestStart",
                        Message = $"Request started: {context.Request.Method} {context.Request.Path}",
                        RequestPath = context.Request.Path,
                        RequestMethod = context.Request.Method,
                        Body = TruncateIfNeeded(requestBody),
                        UserId = userId
                    };

                    await LogToDatabaseAsync(logStartEntry).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error logging request start");
                }
            }).Unwrap(); // Important to unwrap the nested Task from the async lambda

            // Get original response body stream
            var originalBodyStream = context.Response.Body;

            // Use memory stream only if we need to capture the response
            if (ShouldCaptureResponseBody(context.Request))
            {
                using (var responseBody = _recyclableMemoryStreamManager.GetStream())
                {
                    try
                    {
                        // Replace response body with memory stream
                        context.Response.Body = responseBody;

                        // Call next middleware
                        await _next(context).ConfigureAwait(false);

                        // Capture response body
                        string responseBodyContent = await ReadResponseBodyAsync(context.Response).ConfigureAwait(false);

                        // Log request completion (fire and forget)
                        stopwatch.Stop();
                        DateTime endTime = DateTime.UtcNow;
                        TimeSpan duration = stopwatch.Elapsed;

                        var requestEndTask = Task.Factory.StartNew(async () =>
                        {
                            try
                            {
                                var logEndEntry = new LogEntry
                                {
                                    Timestamp = endTime,
                                    EventType = "RequestEnd",
                                    Message = $"Request ended: {context.Request.Method} {context.Request.Path} in {duration.TotalMilliseconds}ms. Status Code: {context.Response.StatusCode}",
                                    RequestPath = context.Request.Path,
                                    RequestMethod = context.Request.Method,
                                    Body = TruncateIfNeeded(responseBodyContent),
                                    ResponseStatusCode = context.Response.StatusCode,
                                    Duration = (long)duration.TotalMilliseconds,
                                    UserId = userId
                                };

                                await LogToDatabaseAsync(logEndEntry).ConfigureAwait(false);
                            }
                            catch (Exception ex)
                            {
                                _logger.LogError(ex, "Error logging request end");
                            }
                        }).Unwrap();

                        // Copy response to original stream
                        responseBody.Position = 0;
                        await responseBody.CopyToAsync(originalBodyStream).ConfigureAwait(false);
                    }
                    finally
                    {
                        // Always restore original response body
                        context.Response.Body = originalBodyStream;
                    }
                }
            }
            else
            {
                // If we're not capturing the response, just call next and log the completion
                try
                {
                    await _next(context).ConfigureAwait(false);
                }
                finally
                {
                    stopwatch.Stop();
                    DateTime endTime = DateTime.UtcNow;
                    TimeSpan duration = stopwatch.Elapsed;

                    var requestEndTask = Task.Factory.StartNew(async () =>
                    {
                        try
                        {
                            var logEndEntry = new LogEntry
                            {
                                Timestamp = endTime,
                                EventType = "RequestEnd",
                                Message = $"Request ended: {context.Request.Method} {context.Request.Path} in {duration.TotalMilliseconds}ms. Status Code: {context.Response.StatusCode}",
                                RequestPath = context.Request.Path,
                                RequestMethod = context.Request.Method,
                                ResponseStatusCode = context.Response.StatusCode,
                                Duration = (long)duration.TotalMilliseconds,
                                UserId = userId
                            };

                            await LogToDatabaseAsync(logEndEntry).ConfigureAwait(false);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "Error logging request end");
                        }
                    }).Unwrap();
                }
            }
        }

        private bool ShouldCaptureRequestBody(HttpRequest request)
        {
            // Implement logic to determine if this request body should be captured
            // For example, don't capture file uploads or form posts
            if (request.ContentLength.HasValue && request.ContentLength.Value > _maxBodyLength)
                return false;

            string contentType = request.ContentType?.ToLower() ?? string.Empty;

            if (contentType.StartsWith("multipart/form-data") ||
                contentType.StartsWith("application/octet-stream"))
                return false;

            return true;
        }

        private bool ShouldCaptureResponseBody(HttpRequest request)
        {
            // Implement logic to determine if the response for this request should be captured
            // For example, don't capture responses for file downloads
            string path = request.Path.ToString().ToLower();

            // Don't capture files or static content
            if (path.Contains("/api/files/") ||
                path.Contains("/static/") ||
                path.EndsWith(".jpg") ||
                path.EndsWith(".pdf") ||
                path.EndsWith(".png"))
                return false;

            return true;
        }

        private string TruncateIfNeeded(string content)
        {
            if (string.IsNullOrEmpty(content))
                return content;

            return content.Length <= _maxBodyLength
                ? content
                : content.Substring(0, _maxBodyLength) + "... [truncated]";
        }

        private async Task<string> ReadResponseBodyAsync(HttpResponse response)
        {
            if (response.Body == null || !response.Body.CanRead)
            {
                return null;
            }

            response.Body.Position = 0;

            // Use a reasonable buffer size
            using (var reader = new StreamReader(
                response.Body,
                Encoding.UTF8,
                detectEncodingFromByteOrderMarks: false,
                bufferSize: 4096,
                leaveOpen: true))
            {
                var body = await reader.ReadToEndAsync().ConfigureAwait(false);
                response.Body.Position = 0;

                return string.IsNullOrEmpty(body) ? null : body;
            }
        }

        private async Task<string> ReadRequestBodyAsync(HttpRequest request)
        {
            // In .NET Core 2.1, use EnableBuffering() instead of EnableRewind()
            EnableRequestBuffering(request);

            using (var reader = new StreamReader(
                request.Body,
                Encoding.UTF8,
                detectEncodingFromByteOrderMarks: false,
                bufferSize: 4096,
                leaveOpen: true))
            {
                var body = await reader.ReadToEndAsync().ConfigureAwait(false);

                // Reset position
                request.Body.Position = 0;

                return body;
            }
        }

        // Helper method to enable request buffering (compatible with .NET Core 2.1)
        private void EnableRequestBuffering(HttpRequest request)
        {
            // .NET Core 2.1 does not have EnableBuffering extension method
            // so we need to check if the stream supports seeking and if not, wrap it
            if (request.Body.CanSeek)
            {
                request.Body.Position = 0;
            }
            else
            {
                // Create a new memory stream to replace the request body
                var memoryStream = _recyclableMemoryStreamManager.GetStream();

                // Copy the original stream to the memory stream
                request.Body.CopyToAsync(memoryStream).GetAwaiter().GetResult();

                // Reset the position of the memory stream
                memoryStream.Position = 0;

                // Replace the request body with the memory stream
                request.Body = memoryStream;
            }
        }

        private async Task LogToDatabaseAsync(LogEntry logEntry)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync().ConfigureAwait(false);

                    string sql = $@"
                    INSERT INTO {_tableName} 
                    (Timestamp, EventType, Message, RequestPath, RequestMethod, Body, ResponseStatusCode, Duration, UserId) 
                    VALUES 
                    (@Timestamp, @EventType, @Message, @RequestPath, @RequestMethod, @Body, @ResponseStatusCode, @Duration, @UserId)";

                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Timestamp", logEntry.Timestamp);
                        command.Parameters.AddWithValue("@EventType", logEntry.EventType);
                        command.Parameters.AddWithValue("@Message", (object)logEntry.Message ?? DBNull.Value);
                        command.Parameters.AddWithValue("@RequestPath", (object)logEntry.RequestPath ?? DBNull.Value);
                        command.Parameters.AddWithValue("@RequestMethod", (object)logEntry.RequestMethod ?? DBNull.Value);
                        command.Parameters.AddWithValue("@Body", (object)logEntry.Body ?? DBNull.Value);
                        command.Parameters.AddWithValue("@ResponseStatusCode", (object)logEntry.ResponseStatusCode ?? DBNull.Value);
                        command.Parameters.AddWithValue("@Duration", (object)logEntry.Duration ?? DBNull.Value);
                        command.Parameters.AddWithValue("@UserId", (object)logEntry.UserId ?? DBNull.Value);

                        await command.ExecuteNonQueryAsync().ConfigureAwait(false);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging to database");
            }
        }

        private bool IsLoggingEnabled()
        {
            // Implement your configuration check
            return true;
        }

        private string GetUserId(HttpContext context)
        {
            if (context.User?.Identity != null && context.User.Identity.IsAuthenticated)
            {
                string userId = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (!string.IsNullOrEmpty(userId))
                    return userId;

                userId = context.User.FindFirst(System.Security.Claims.ClaimTypes.Sid)?.Value;
                if (!string.IsNullOrEmpty(userId))
                    return userId;

                userId = context.User.FindFirst("UserID")?.Value;
                if (!string.IsNullOrEmpty(userId))
                    return userId;
            }

            string headerUserId = context.Request.Headers["UserId"];
            if (!string.IsNullOrEmpty(headerUserId))
                return headerUserId;

            headerUserId = context.Request.Headers["X-User-Id"];
            if (!string.IsNullOrEmpty(headerUserId))
                return headerUserId;

            return context.Request.Query["userId"];
        }
    }

    public static class APILoggerMiddlewareExtensions
    {
        public static IApplicationBuilder UseAPILogger(this IApplicationBuilder builder)
        {
            if (builder == null)
                throw new ArgumentNullException(nameof(builder));

            return builder.UseMiddleware<APILoggerMiddleware>();
        }

        public static IServiceCollection AddAPILogger(this IServiceCollection services)
        {
            if (services == null)
                throw new ArgumentNullException(nameof(services));

            services.AddSingleton<RecyclableMemoryStreamManager>();
            return services;
        }
    }

    public class LogEntry
    {
        public DateTime Timestamp { get; set; }
        public string EventType { get; set; }
        public string Message { get; set; }
        public string RequestPath { get; set; }
        public string RequestMethod { get; set; }
        public string Body { get; set; }
        public int? ResponseStatusCode { get; set; }
        public long? Duration { get; set; }
        public string UserId { get; set; }
    }
}
