using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Buffers.Text;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Security.Cryptography.Xml;

namespace NetTemplate_React.Models.Reports
{
    public class CrashReport
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("when")]
        public string When { get; set; }

        [JsonProperty("where")]
        public string Where { get; set; }

        [JsonProperty("what")]
        public string What { get; set; }

        [JsonProperty("severity_level")]
        public string SeverityLevel { get; set; }

        [JsonProperty("created_by")]
        public int CreatedBy { get; set; }

        [JsonProperty("lin_id")]
        public int LinId { get; set; }

        [JsonProperty("stack_trace")]
        public string StackTrace { get; set; }

        [JsonProperty("browser")]
        public string Browser { get; set; }

        [JsonProperty("os")]
        public string Os { get; set; }

        [JsonProperty("user_agent")]
        public string UserAgent { get; set; }

        [JsonProperty("scenario")]
        public string Scenario { get; set; }

        [JsonProperty("details")]
        public string Details { get; set; }

        public List<IFormFile> Images { get; set; }

        [JsonProperty("image_cover")]
        public string ImageCover { get; set; }

        [JsonProperty("total_count")]
        public int TotalCount { get; set; }

        [JsonProperty("current_page")]
        public int CurrentPage { get; set; }

        [JsonProperty("total_pages")]
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

            foreach (DataRow row in dataTable.Rows)
            {
                var crashReport = new CrashReport
                {
                    Id = GetValue<int>(row, "id"),
                    When = GetValue<string>(row, "when"),
                    Where = GetValue<string>(row, "where"),
                    What = GetValue<string>(row, "what"),
                    SeverityLevel = GetValue<string>(row, "severity_level"),
                    CreatedBy = GetValue<int>(row, "created_by"),
                    LinId = GetValue<int>(row, "lin_id"),
                    StackTrace = GetValue<string>(row, "stack_trace"),
                    Browser = GetValue<string>(row, "browser"),
                    Os = GetValue<string>(row, "os"),
                    UserAgent = GetValue<string>(row, "user_agent"),
                    Scenario = GetValue<string>(row, "scenario"),
                    Details = GetValue<string>(row, "details"),
                    Images = null,
                    TotalCount = GetValue<int>(row, "totalcount"),
                    CurrentPage = GetValue<int>(row, "currentpage"),
                    TotalPages = GetValue<int>(row, "totalpages"),
                    ImageCover = GetValue<string>(row, "img"),
                };

                crashReports.Add(crashReport);
            }

            return crashReports;
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
                if (row.Table.Columns.Contains(columnName) && row[columnName] != DBNull.Value)
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

                    return (T)Convert.ChangeType(value, typeof(T));
                }
            }
            catch (Exception ex)
            {
                // Log exception if needed
                Console.WriteLine($"Error converting column '{columnName}': {ex.Message}");
            }

            return defaultValue;
        }

    }

    public class CrashReportIMG
    {
        [JsonProperty("image")]
        public string Image { get; set; }
    }
}
