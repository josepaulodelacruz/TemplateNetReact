using Microsoft.Extensions.Logging;
using NetTemplate_React.Models;
using NetTemplate_React.Models.Reports;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;

namespace NetTemplate_React.Services.Reports
{

    public interface ICrashReportService
    {
        Task<Response> GetCrashReport(int page = 1);

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

        public async Task<Response> GetCrashReport(int page = 1)
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
