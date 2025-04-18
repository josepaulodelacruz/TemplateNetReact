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

namespace NetTemplate_React.Middleware
{
    // Middleware class to log API requests
    // Middleware class to log API requests
    public class APILoggerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;
        private readonly string _connectionString; // Connection string for the database
        private readonly string _tableName; // Name of the table to log to

        // Constructor for the middleware, injects dependencies
        public APILoggerMiddleware(RequestDelegate next, ILoggerFactory loggerFactory, IConfiguration configuration)
        {
            _next = next;
            _logger = loggerFactory.CreateLogger<APILoggerMiddleware>();
            // Use IConfiguration to get the connection string.  This is the preferred way.
            _connectionString = configuration.GetConnectionString("DEV"); //Make sure you have this in appsettings.json
            _tableName = configuration.GetValue<string>("APILogger:TableName") ?? "APILogs"; //Gets the table name from config
        }

        // Method to handle each HTTP request
        public async Task Invoke(HttpContext context)
        {
            // Check if logging is enabled (optional, based on a configuration)
            if (!IsLoggingEnabled())
            {
                await _next(context); // Skip logging if not enabled
                return;
            }

            var stopwatch = Stopwatch.StartNew(); // Start timer to measure duration
            string requestBody = await ReadRequestBody(context.Request); // Read the request body
            DateTime startTime = DateTime.UtcNow; // Record the start time
            string userId = GetUserId(context); // Get User ID

            // Prepare log message for the start of the request
            var logStartEntry = new LogEntry
            {
                Timestamp = startTime,
                EventType = "RequestStart",
                Message = $"Request started: {context.Request.Method} {context.Request.Path}",
                RequestPath = context.Request.Path,
                RequestMethod = context.Request.Method,
                Body = requestBody,
                UserId = userId
            };

            // Log the start of the request to the database
            await LogToDatabase(logStartEntry);

            // Store the start time in the context for later use
            context.Items["RequestStartTime"] = startTime;
            context.Items["UserId"] = userId; //Store userId

            try
            {
                // Call the next middleware in the pipeline
                await _next(context);
            }
            finally
            {
                stopwatch.Stop(); // Stop the timer
                DateTime endTime = DateTime.UtcNow;
                // Calculate the duration of the request
                TimeSpan duration = stopwatch.Elapsed;
                userId = (string)context.Items["UserId"]; //Retrieve userId
                // Get the start time from the context
                startTime = (DateTime)context.Items["RequestStartTime"];

                string responseBody = null; 

                // Prepare log message for the end of the request
                var logEndEntry = new LogEntry
                {
                    Timestamp = endTime,
                    EventType = "RequestEnd",
                    Message = $"Request ended: {context.Request.Method} {context.Request.Path} in {duration.TotalMilliseconds}ms. Status Code: {context.Response.StatusCode}",
                    RequestPath = context.Request.Path,
                    RequestMethod = context.Request.Method,
                    Body = responseBody, 
                    ResponseStatusCode = context.Response.StatusCode,
                    Duration = (long)duration.TotalMilliseconds,
                    UserId = userId
                };
                // Log the end of the request to the database
                await LogToDatabase(logEndEntry);
            }
        }

        private async Task<string> ReadResponseBody(HttpResponse response)
        {
            // Check if response.Body is null
            if (response.Body == null)
            {
                return null;
            }

            // Check if the response body is readable
            if (!response.Body.CanRead)
            {
                _logger.LogWarning("Response body is not readable.");
                return null;
            }

            response.Body.Seek(0, SeekOrigin.Begin);
            string text = await new System.IO.StreamReader(response.Body, Encoding.UTF8, true, 1024, true).ReadToEndAsync();
            response.Body.Seek(0, SeekOrigin.Begin);
            return string.IsNullOrEmpty(text) ? null : text;
        }



        // Helper method to read the request body
        private async Task<string> ReadRequestBody(HttpRequest request)
        {
            // Ensure the request body can be read multiple times
            request.EnableRewind();

            // Read the request body
            using (var reader = new System.IO.StreamReader(request.Body, Encoding.UTF8, true, 1024, true))
            {
                string body = await reader.ReadToEndAsync();
                // Reset the position of the stream to allow for further processing
                request.Body.Position = 0;
                return body;
            }
        }

        // Helper method to log to the database
        private async Task LogToDatabase(LogEntry logEntry)
        {
            // Use a try-catch block to handle database connection errors
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync(); // Open the database connection asynchronously

                    // SQL query to insert log data into the specified table
                    string sql = $"INSERT INTO {_tableName} (Timestamp, EventType, Message, RequestPath, RequestMethod, Body, ResponseStatusCode, Duration, UserId) " +
                                 "VALUES (@Timestamp, @EventType, @Message, @RequestPath, @RequestMethod, @Body, @ResponseStatusCode, @Duration, @UserId)";

                    using (SqlCommand command = new SqlCommand(sql, connection))
                    {
                        // Add parameters to the SQL command to prevent SQL injection
                        command.Parameters.AddWithValue("@Timestamp", logEntry.Timestamp);
                        command.Parameters.AddWithValue("@EventType", logEntry.EventType);
                        command.Parameters.AddWithValue("@Message", logEntry.Message);
                        command.Parameters.AddWithValue("@RequestPath", logEntry.RequestPath);
                        command.Parameters.AddWithValue("@RequestMethod", logEntry.RequestMethod);
                        command.Parameters.AddWithValue("@Body", logEntry.Body ?? (object)DBNull.Value); // Handle nulls
                        command.Parameters.AddWithValue("@ResponseStatusCode", logEntry.ResponseStatusCode ?? (object)DBNull.Value); // Handle nulls
                        command.Parameters.AddWithValue("@Duration", logEntry.Duration ?? (object)DBNull.Value);
                        command.Parameters.AddWithValue("@UserId", logEntry.UserId ?? (object)DBNull.Value);

                        await command.ExecuteNonQueryAsync(); // Execute the query asynchronously
                    }
                }
            }
            catch (Exception ex)
            {
                // Log any database errors
                _logger.LogError($"Error logging to database: {ex.Message}");
                // IMPORTANT:  Do NOT re-throw the exception here.  The middleware should not interrupt the request flow
                // if the logging fails.  Logging failures should be isolated.
            }
        }

        // Helper method to check if logging is enabled (optional, based on configuration)
        private bool IsLoggingEnabled()
        {
            // Example: Check for an "EnableAPILogging" key in the configuration
            //  return _configuration.GetValue<bool>("EnableAPILogging");
            // Or, you could have a section:
            // "APILogger": {
            //    "Enabled": true,
            // }
            // return _configuration.GetValue<bool>("APILogger:Enabled");

            // For this example, we'll just return true.  You should replace this with your actual configuration check.
            return true;
        }

        private string GetUserId(HttpContext context)
        {
            //Default return
            string userId = null;

            //Try to get user ID from claims.  This is the most common way to get the user's ID.
            if (context.User?.Identity != null && context.User.Identity.IsAuthenticated)
            {
                //Common claim types are NameIdentifier, Sid, and sometimes UserID.
                userId = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    userId = context.User.FindFirst(System.Security.Claims.ClaimTypes.Sid)?.Value;
                if (string.IsNullOrEmpty(userId))
                    userId = context.User.FindFirst("UserID")?.Value; // Fallback to "UserID" claim
            }

            //If claims don't work, try to get it from the request headers.  This is less common, and less secure.
            if (string.IsNullOrEmpty(userId))
            {
                userId = context.Request.Headers["UserId"]; // Or "X-User-Id", "Authorization", etc.
                if (string.IsNullOrEmpty(userId))
                    userId = context.Request.Headers["X-User-Id"];
            }
            //If still null, try the query string
            if (string.IsNullOrEmpty(userId))
                userId = context.Request.Query["userId"];

            return userId;
        }
    }

    // Extension method to add the middleware to the application pipeline
    public static class APILoggerMiddlewareExtensions
    {
        public static IApplicationBuilder UseAPILogger(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<APILoggerMiddleware>();
        }
    }

    // Class to represent the log data
    public class LogEntry
    {
        public DateTime Timestamp { get; set; }
        public string EventType { get; set; } // "RequestStart" or "RequestEnd"
        public string Message { get; set; }
        public string RequestPath { get; set; }
        public string RequestMethod { get; set; }
        public string Body { get; set; }
        public int? ResponseStatusCode { get; set; } // Make it nullable
        public long? Duration { get; set; }
        public string UserId { get; set; }
    }
}
