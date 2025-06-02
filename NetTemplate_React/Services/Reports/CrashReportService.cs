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

        Task<Response> CreateReport();

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

        public async Task<Response> CreateReport() 
        {
            string commandText = "[dbo].[NSP_CrashReport] "; 
            using (SqlConnection con = new SqlConnection(_conString))
            {
                await con.OpenAsync();

                var transaction = con.BeginTransaction();

                using (SqlCommand cmd = new SqlCommand(commandText, con))
                {
                    try
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@FLAG", "CREATE CRASH REPORT");

                        await cmd.ExecuteNonQueryAsync();
                        transaction.Commit();

                        return new Response(
                            success: true,
                            debugScript: commandText,
                            message: "Successfully Create a Bug Splat Report.",
                            body: null
                        );
                        
                    } 
                    catch (SqlException Ex)
                    {
                        transaction.Rollback();
                        return new Response(
                            success: false,
                            debugScript: commandText,
                            message: Ex.Message,
                            body: null
                        );
                    }
                    catch (Exception Ex)
                    {
                        transaction.Rollback();
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
