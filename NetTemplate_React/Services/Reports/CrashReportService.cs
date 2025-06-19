using Microsoft.Extensions.Logging;
using NetTemplate_React.Models;
using NetTemplate_React.Models.Reports;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetTemplate_React.Services.Reports
{

    public interface ICrashReportService
    {
        Task<Response> GetLogs(string id);
        Task<Response> GetMetrics(string fitlerType);

        Task<Response> GetCrashReport(int page = 1, string filter = "");

        Task<Response> GetCrashReportById(string id);

        Task<Response> CreateReport(CrashReport body, List<byte[]> imagebins, int createdBy);

    }

    public class CrashReportService : ICrashReportService
    {

        private readonly string _conString;
        private ILogger _logger;

        public CrashReportService(string conString, ILoggerFactory logger)
        {
            _conString = conString;
            _logger = logger.CreateLogger<CrashReportService>();
        }

        public async Task<Response> GetLogs(string logId = null)
        {
            string commandText = "[dbo].[NSP_CrashReport]";
            var dataTable = new DataTable();

            using (SqlConnection con = new SqlConnection(_conString))
            {
                await con.OpenAsync();

                using (SqlCommand cmd = new SqlCommand(commandText, con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@FLAG", "GET LOG");
                    cmd.Parameters.AddWithValue("@LOG_ID", logId);

                    try
                    {
                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            dataTable.Load(reader); 
                        }

                        if (dataTable.Rows.Count == 0) throw new Exception("No logs found");

                        return new Response(
                                success: true,
                                debugScript: commandText,
                                message: "Successfully fetch backend logs",
                                body: dataTable
                            );
                    } 
                    catch (SqlException Ex)
                    {
                        return new Response(
                            success: false,
                            debugScript: commandText,
                            message: Ex.Message,
                            body: null
                        )
                        {
                            IsCrash = true
                        };
                    }
                    catch (Exception Ex)
                    {
                        return new Response(
                            success: false,
                            debugScript: commandText,
                            message: Ex.Message,
                            body: null
                        );
                    }

                }
            }
        }

        public async Task<Response> GetMetrics(string filterType)
        {
            string commandText = "[dbo].[NSP_CrashReport]";
            var dataTable = new DataTable();

            using (SqlConnection con = new SqlConnection(_conString))
            {
                await con.OpenAsync();

                using (SqlCommand cmd = new SqlCommand(commandText, con))
                {
                    try
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@FLAG", "GET METRICS");
                        cmd.Parameters.AddWithValue("@FilterType", filterType);

                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            dataTable.Load(reader);
                        }

                        Models.Reports.Metrics metrics = new Metrics().TransformCrashReportMetrics(dataTable);

                        return new Response(
                            success: true,
                            debugScript: commandText,
                            message: "Successfully fetch crash report metrics",
                            body: metrics 
                        );

                    } 
                    catch (SqlException Ex)
                    {
                        return new Response(
                            success: false,
                            debugScript: commandText,
                            message: Ex.Message,
                            body: Ex.StackTrace
                        )
                        {
                            IsCrash = true
                        };
                    } 
                    catch (Exception Ex)
                    {
                        return new Response(
                            success: false,
                            debugScript: commandText,
                            message: Ex.Message,
                            body: null
                        );
                    }
                }
            }
        }

        public async Task<Response> GetCrashReport(int page = 1, string filter = "")
        {
            
            var commandText = "[dbo].[NSP_CrashReport]";
            using (SqlConnection con = new SqlConnection(_conString))
            {
                await con.OpenAsync();

                using (SqlCommand cmd = new SqlCommand(commandText, con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@FLAG", "GET REPORTS");
                    cmd.Parameters.AddWithValue("@PageNumber", page);
                    cmd.Parameters.AddWithValue("@F_Severity", String.IsNullOrEmpty(filter) ? null : filter);

                    try
                    {
                        List<CrashReport> reports = new List<CrashReport>();
                        var dataTable = new DataTable();
                        using(SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            dataTable.Load(reader);
                        }

                        reports = CrashReport.TransformCrashReport(dataTable);

                        return new Response(
                            success: true,
                            debugScript: commandText,
                            message: "Successfully fetch reports",
                            body: reports
                        );
                    }
                    catch (SqlException Ex) 
                    {
                        return new Response(
                            success: false,
                            debugScript: commandText,
                            message: Ex.Message,
                            body: Ex.StackTrace
                        );
                    }
                    catch (Exception Ex)
                    {
                        return new Response(
                            success: false,
                            debugScript: commandText.ToString(),
                            message: Ex.Message,
                            body: Ex.StackTrace
                        );
                    }
                }
            }
        }

        public async Task<Response> GetCrashReportById(string id)
        {
            string commandText = "[dbo].[NSP_CrashReport]";
            var dataTable = new DataTable();

            using (SqlConnection con = new SqlConnection(_conString))
            {
                await con.OpenAsync();

                using (SqlCommand cmd = new SqlCommand(commandText, con))
                {
                    try
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@FLAG", "GET REPORT BY ID");
                        cmd.Parameters.AddWithValue("@REPORT_ID", id);

                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            dataTable.Load(reader);
                        }

                        List<CrashReport> report = CrashReport.TransformCrashReportWithImage(dataTable); 

                        return new Response(
                            success: true,
                            debugScript: commandText,
                            message: "Successfully fetch report.",
                            body: report.Count > 0 ? report[0] : null
                        );
                    } 
                    catch (SqlException Ex)
                    {
                        return new Response(
                            success: false,
                            debugScript: commandText,
                            message: Ex.Message,
                            body: Ex.StackTrace
                        )
                        {
                            IsCrash = true
                        };
                    }
                    catch (Exception Ex)
                    {
                        return new Response(
                            success: false,
                            debugScript: commandText,
                            message: Ex.Message,
                            body: Ex.StackTrace 
                        );
                    }

                }
            }


        }

        public async Task<Response> CreateReport(CrashReport body, List<byte[]> imageBins, int createdBy) 
        {
            string commandText = "[dbo].[NSP_CrashReport]";

            var dt = new DataTable();

            dt.Columns.Add("IMG", typeof(string)); // Specify the column type

            foreach (var imageBytes in imageBins)
            {
                if (imageBytes != null && imageBytes.Length > 0)
                {
                    string base64String = Convert.ToBase64String(imageBytes);
                    dt.Rows.Add(base64String);
                }
            }

            using (SqlConnection con = new SqlConnection(_conString))
            {
                await con.OpenAsync();

                using (SqlCommand cmd = new SqlCommand(commandText, con))
                {
                    try
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@FLAG", "CREATE CRASH REPORT");
                        cmd.Parameters.AddWithValue("@WHEN", body.When);
                        cmd.Parameters.AddWithValue("@WHERE", body.Where);
                        cmd.Parameters.AddWithValue("@WHAT", body.What);
                        cmd.Parameters.AddWithValue("@SEVERITY", body.SeverityLevel);
                        cmd.Parameters.AddWithValue("@CREATED_BY", createdBy);
                        cmd.Parameters.AddWithValue("@STACK_TRACE", body.StackTrace);
                        cmd.Parameters.AddWithValue("@OS", body.Os);
                        cmd.Parameters.AddWithValue("@BROWSER", body.Browser);
                        cmd.Parameters.AddWithValue("@USER_AGENT", body.UserAgent);
                        cmd.Parameters.AddWithValue("@EMAIL", "testingemail");
                        cmd.Parameters.AddWithValue("@SCENARIO", body.Scenario);
                        cmd.Parameters.AddWithValue("@DETAILS", body.Details);
                        cmd.Parameters.AddWithValue("@LOG_ID", body.LogId);
                        cmd.Parameters.AddWithValue("@IMG_TABLE", dt);

                        await cmd.ExecuteNonQueryAsync();

                        return new Response(
                            success: true,
                            debugScript: commandText,
                            message: "Successfully Create a Bug Splat Report.",
                            body: null
                        );
                        
                    } 
                    catch (SqlException Ex)
                    {
                        return new Response(
                            success: false,
                            debugScript: commandText,
                            message: Ex.Message,
                            body: null
                        );
                    }
                    catch (Exception Ex)
                    {
                        return new Response(
                            success: false,
                            debugScript: commandText,
                            message: Ex.Message,
                            body: null
                        );
                    }

                }
            }
        
        }
    }
}
