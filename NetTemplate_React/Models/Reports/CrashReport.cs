using Microsoft.AspNetCore.Http;
using System;
using System.Buffers.Text;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography.Xml;
using System.Text.Json.Serialization;

namespace NetTemplate_React.Models.Reports
{
    public class CrashReport
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("when")]
        public DateTime When { get; set; }

        [JsonPropertyName("where")]
        public string Where { get; set; } = string.Empty;

        [JsonPropertyName("what")]
        public string What { get; set; } = string.Empty;

        [JsonPropertyName("severity_level")]
        public string SeverityLevel { get; set; } = string.Empty;

        [JsonPropertyName("created_by")]
        public string CreatedBy { get; set; } = string.Empty;

        [JsonPropertyName("lin_id")]
        public int LinId { get; set; }

        [JsonPropertyName("stack_trace")]
        public string StackTrace { get; set; } = string.Empty;

        [JsonPropertyName("browser")]
        public string Browser { get; set; } = string.Empty;

        [JsonPropertyName("os")]
        public string Os { get; set; } = string.Empty;

        [JsonPropertyName("user_agent")]
        public string UserAgent { get; set; } = string.Empty;

        [JsonPropertyName("scenario")]
        public string Scenario { get; set; } = string.Empty;

        [JsonPropertyName("details")]
        public string Details { get; set; } = string.Empty;

        // Ignore this property during JSON serialization
        [JsonIgnore]
        public List<IFormFile> Images { get; set; } = new List<IFormFile>();

        [JsonPropertyName("image_bins")]
        public List<string> ImageBins { get; set; } = new List<string>();

        [JsonPropertyName("image_cover")]
        public string ImageCover { get; set; } = string.Empty;

        [JsonPropertyName("log_id")]
        public int LogId { get; set; }

        [JsonPropertyName("total_count")]
        public int TotalCount { get; set; }

        [JsonPropertyName("current_page")]
        public int CurrentPage { get; set; }

        [JsonPropertyName("total_pages")]
        public int TotalPages { get; set; }

        /// <summary>
        /// Transforms a DataTable to a list of CrashReport objects
        /// </summary>
        /// <param name="dataTable">DataTable containing crash report data</param>
        /// <returns>List of CrashReport objects</returns>
        public static List<CrashReport> TransformCrashReport(DataTable dataTable)
        {
            if (dataTable == null || dataTable.Rows.Count == 0)
                return new List<CrashReport>();

            var crashReports = new List<CrashReport>();

            try
            {
                foreach (DataRow row in dataTable.Rows)
                {
                    var crashReport = new CrashReport
                    {
                        Id = GetValue<int>(row, "main_id"),
                        When = GetValue<DateTime>(row, "when"),
                        Where = GetValue<string>(row, "where") ?? string.Empty,
                        What = GetValue<string>(row, "what") ?? string.Empty,
                        SeverityLevel = GetValue<string>(row, "severity_level") ?? string.Empty,
                        CreatedBy = GetValue<string>(row, "created_by") ?? string.Empty,
                        LinId = GetValue<int>(row, "lin_id"),
                        StackTrace = GetValue<string>(row, "stack_trace") ?? string.Empty,
                        Browser = GetValue<string>(row, "browser") ?? string.Empty,
                        Os = GetValue<string>(row, "os") ?? string.Empty,
                        UserAgent = GetValue<string>(row, "user_agent") ?? string.Empty,
                        Scenario = GetValue<string>(row, "scenario") ?? string.Empty,
                        Details = GetValue<string>(row, "details") ?? string.Empty,
                        Images = new List<IFormFile>(),
                        TotalCount = GetValue<int>(row, "totalcount"),
                        CurrentPage = GetValue<int>(row, "currentpage"),
                        TotalPages = GetValue<int>(row, "totalpages"),
                        ImageCover = GetValue<string>(row, "img") ?? string.Empty,
                        LogId = GetValue<int>(row, "log_id"),
                        ImageBins = new List<string>()
                    };

                    crashReports.Add(crashReport);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in TransformCrashReport: {ex.Message}");
                throw; // Re-throw to maintain error visibility
            }

            return crashReports;
        }

        /// <summary>
        /// Group crash reports by ID and collect all images into ImageBins array
        /// </summary>
        /// <param name="dataTable">DataTable containing crash report data with images</param>
        /// <returns>List of CrashReport objects with consolidated images</returns>
        public static List<CrashReport> TransformCrashReportWithImage(DataTable dataTable)
        {
            if (dataTable == null || dataTable.Rows.Count == 0)
                return new List<CrashReport>();

            var crashReportsDict = new Dictionary<int, CrashReport>();

            try
            {
                foreach (DataRow row in dataTable.Rows)
                {
                    var id = GetValue<int>(row, "id");

                    if (!crashReportsDict.ContainsKey(id))
                    {
                        // Create new crash report with all properties and empty ImageBins
                        crashReportsDict[id] = new CrashReport
                        {
                            Id = id,
                            When = GetValue<DateTime>(row, "when"),
                            Where = GetValue<string>(row, "where") ?? string.Empty,
                            What = GetValue<string>(row, "what") ?? string.Empty,
                            SeverityLevel = GetValue<string>(row, "severity_level") ?? string.Empty,
                            CreatedBy = GetValue<string>(row, "created_by") ?? string.Empty,
                            LinId = GetValue<int>(row, "lin_id"),
                            StackTrace = GetValue<string>(row, "stack_trace") ?? string.Empty,
                            Browser = GetValue<string>(row, "browser") ?? string.Empty,
                            Os = GetValue<string>(row, "os") ?? string.Empty,
                            UserAgent = GetValue<string>(row, "user_agent") ?? string.Empty,
                            Scenario = GetValue<string>(row, "scenario") ?? string.Empty,
                            Details = GetValue<string>(row, "details") ?? string.Empty,
                            Images = new List<IFormFile>(),
                            TotalCount = GetValue<int>(row, "totalcount"),
                            CurrentPage = GetValue<int>(row, "currentpage"),
                            TotalPages = GetValue<int>(row, "totalpages"),
                            ImageCover = string.Empty, // Will be set to first image if available
                            LogId = GetValue<int>(row, "log_id"),
                            ImageBins = new List<string>()
                        };
                    }

                    // Add image to the ImageBins array if it exists and isn't already added
                    var imageValue = GetValue<string>(row, "img");
                    if (!string.IsNullOrEmpty(imageValue) && !crashReportsDict[id].ImageBins.Contains(imageValue))
                    {
                        crashReportsDict[id].ImageBins.Add(imageValue);
                        
                        // Set the first image as cover image if not already set
                        if (string.IsNullOrEmpty(crashReportsDict[id].ImageCover))
                        {
                            crashReportsDict[id].ImageCover = imageValue;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in TransformCrashReportWithImage: {ex.Message}");
                throw; // Re-throw to maintain error visibility
            }

            return crashReportsDict.Values.ToList();
        }

        /// <summary>
        /// Generic method to safely extract values from DataRow
        /// </summary>
        /// <typeparam name="T">Type to convert to</typeparam>
        /// <param name="row">DataRow containing the data</param>
        /// <param name="columnName">Column name to extract</param>
        /// <param name="defaultValue">Default value if column doesn't exist or is null</param>
        /// <returns>Converted value or default</returns>
        private static T GetValue<T>(DataRow row, string columnName, T defaultValue = default(T))
        {
            try
            {
                if (row?.Table?.Columns?.Contains(columnName) == true && row[columnName] != DBNull.Value && row[columnName] != null)
                {
                    var value = row[columnName];

                    if (typeof(T) == typeof(string))
                        return (T)(object)value.ToString();

                    if (typeof(T) == typeof(int))
                        return (T)(object)Convert.ToInt32(value);

                    if (typeof(T) == typeof(DateTime))
                        return (T)(object)Convert.ToDateTime(value);

                    if (typeof(T) == typeof(bool))
                        return (T)(object)Convert.ToBoolean(value);

                    if (typeof(T) == typeof(decimal))
                        return (T)(object)Convert.ToDecimal(value);

                    return (T)Convert.ChangeType(value, typeof(T));
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error converting column '{columnName}' to type {typeof(T).Name}: {ex.Message}");
            }

            return defaultValue;
        }
    }

    public class CrashReportIMG
    {
        [JsonPropertyName("image")]
        public string Image { get; set; } = string.Empty;
    }

    public class Metrics
    {
        [JsonPropertyName("crash_counts")]
        public CrashCounts CrashCounts { get; set; } = new CrashCounts();

        [JsonPropertyName("line_charts")]
        public List<LineChart> LineCharts { get; set; } = new List<LineChart>();

        /// <summary>
        /// Transforms DataTable to Metrics object
        /// </summary>
        /// <param name="dataTable">DataTable containing metrics data</param>
        /// <returns>Metrics object</returns>
        public static Metrics TransformCrashReportMetrics(DataTable dataTable)
        {
            if (dataTable == null || dataTable.Rows.Count == 0)
                return new Metrics();

            var metrics = new Metrics();
            var lineChartDict = new Dictionary<DateTime, LineChart>();
            bool crashCountsSet = false;

            try
            {
                foreach (DataRow row in dataTable.Rows)
                {
                    var date = GetValue<DateTime>(row, "CrashDate");
                    
                    // Only add unique dates to line chart
                    if (!lineChartDict.ContainsKey(date))
                    {
                        lineChartDict[date] = new LineChart
                        {
                            Date = date,
                            DailyCrashes = GetValue<int>(row, "DailyCrashes"),
                            DailyAffectedUsers = GetValue<int>(row, "DailyAffectedUsers"),
                            DailyCriticalCrashes = GetValue<int>(row, "DailyCriticalCrashes"),
                            CumulativeCrashes = GetValue<int>(row, "CumulativeCrashes"),
                            CumulativeAffectedUsers = GetValue<int>(row, "CumulativeAffectedUsers"),
                            CumulativeCriticalCrashes = GetValue<int>(row, "CumulativeCriticalCrashes") // Fixed typo
                        };
                    }

                    // Set crash counts only once (assuming same values across all rows)
                    if (!crashCountsSet)
                    {
                        metrics.CrashCounts = new CrashCounts
                        {
                            TotalCrashes = GetValue<int>(row, "totalCrashes"),
                            AffectedUser = GetValue<int>(row, "affectedUsers"),
                            CriticalSystemFailures = GetValue<int>(row, "criticalSystemFailures"),
                            CrashFreeSessions = GetValue<int>(row, "crashFreeSessions"),
                            CrashesPercentChange = GetValue<decimal>(row, "crashesPercentChange"),
                            UsersPercentChange = GetValue<decimal>(row, "usersPercentChange"),
                            CriticalFailuresPercentChange = GetValue<decimal>(row, "criticalFailuresPercentChange"),
                            CrashesFreeSessionsPercentChange = GetValue<decimal>(row, "crashFreeSessionsPercentChange")
                        };
                        crashCountsSet = true;
                    }
                }

                metrics.LineCharts = lineChartDict.Values.OrderBy(x => x.Date).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in TransformCrashReportMetrics: {ex.Message}");
                throw; // Re-throw to maintain error visibility
            }

            return metrics;
        }

        /// <summary>
        /// Generic method to safely extract values from DataRow
        /// </summary>
        /// <typeparam name="T">Type to convert to</typeparam>
        /// <param name="row">DataRow containing the data</param>
        /// <param name="columnName">Column name to extract</param>
        /// <param name="defaultValue">Default value if column doesn't exist or is null</param>
        /// <returns>Converted value or default</returns>
        private static T GetValue<T>(DataRow row, string columnName, T defaultValue = default(T))
        {
            try
            {
                if (row?.Table?.Columns?.Contains(columnName) == true && row[columnName] != DBNull.Value && row[columnName] != null)
                {
                    var value = row[columnName];

                    if (typeof(T) == typeof(string))
                        return (T)(object)value.ToString();

                    if (typeof(T) == typeof(int))
                        return (T)(object)Convert.ToInt32(value);

                    if (typeof(T) == typeof(DateTime))
                        return (T)(object)Convert.ToDateTime(value);

                    if (typeof(T) == typeof(bool))
                        return (T)(object)Convert.ToBoolean(value);

                    if (typeof(T) == typeof(decimal))
                        return (T)(object)Convert.ToDecimal(value);

                    return (T)Convert.ChangeType(value, typeof(T));
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error converting column '{columnName}' to type {typeof(T).Name}: {ex.Message}");
            }

            return defaultValue;
        }
    }

    public class LineChart
    {
        [JsonPropertyName("date")]
        public DateTime Date { get; set; }

        [JsonPropertyName("daily_crashes")]
        public int DailyCrashes { get; set; }

        [JsonPropertyName("daily_affected_users")]
        public int DailyAffectedUsers { get; set; }

        [JsonPropertyName("daily_critical_crashes")]
        public int DailyCriticalCrashes { get; set; }

        [JsonPropertyName("cumulative_crashes")]
        public int CumulativeCrashes { get; set; }

        [JsonPropertyName("cumulative_affected_users")]
        public int CumulativeAffectedUsers { get; set; }

        [JsonPropertyName("cumulative_critical_crashes")]
        public int CumulativeCriticalCrashes { get; set; }
    }

    public class CrashCounts
    {
        [JsonPropertyName("total_crashes")]
        public int TotalCrashes { get; set; }

        [JsonPropertyName("affected_users")]
        public int AffectedUser { get; set; }

        [JsonPropertyName("critical_system_failures")]
        public int CriticalSystemFailures { get; set; }

        [JsonPropertyName("crash_free_sessions")]
        public int CrashFreeSessions { get; set; }

        [JsonPropertyName("crashes_percent_change")]
        public decimal CrashesPercentChange { get; set; }

        [JsonPropertyName("users_percent_change")]
        public decimal UsersPercentChange { get; set; }

        [JsonPropertyName("critical_failures_percent_change")]
        public decimal CriticalFailuresPercentChange { get; set; }

        [JsonPropertyName("crashes_free_sessions_percent_change")] // Fixed typo in property name
        public decimal CrashesFreeSessionsPercentChange { get; set; }
    }
}
