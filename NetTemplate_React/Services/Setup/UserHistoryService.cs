using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NetTemplate_React.Models;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace NetTemplate_React.Services.Setup
{
    public interface IUserHistoryService
    {
        Task<Response> GetHistoryByUserId(int id, int page);

    }

    public class UserHistoryService : IUserHistoryService
    {
        private readonly string _conString;
        private ILogger _logger;
        public UserHistoryService(string conString, ILoggerFactory logger)
        {
            _conString = conString;
            _logger = logger.CreateLogger<UserHistoryService>();
        }
        
        public async Task<Response> GetHistoryByUserId(int id, int page)
        {
            string commandText = "[dbo].[NSP_APILogs]";

            DataTable dataTable = new DataTable();

            try
            {
                using (SqlConnection con = new SqlConnection(_conString))
                {
                    await con.OpenAsync();
                    using (SqlCommand cmd = new SqlCommand(commandText.ToString(), con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@FLAG", "GET USER LOGS BY ID");
                        cmd.Parameters.AddWithValue("@PageNumber", page);
                        cmd.Parameters.AddWithValue("@PageSize", 10); //default 10 per page
                        cmd.Parameters.AddWithValue("@UserId", id);

                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            dataTable.Load(reader);
                        }
                    }
                }

                return new Response(
                    success: true,
                    debugScript: commandText.ToString(),
                    message: "Succesfully fetch user logs",
                    body: dataTable
                );

            } catch (SqlException Ex)
            {
                _logger.LogError(Ex, "SqlException error");
                return new Response(
                    success: false,
                    debugScript: commandText.ToString(),
                    message: Ex.Message,
                    body: null
                );
            } catch (Exception Ex)
            {
                _logger.LogError(Ex, "SqlException error");
                return new Response(
                    success: false,
                    debugScript: commandText.ToString(),
                    message: Ex.Message,
                    body: null
                );
            }
        }
    }
}
