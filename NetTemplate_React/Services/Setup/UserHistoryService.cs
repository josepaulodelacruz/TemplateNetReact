using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NetTemplate_React.Models;
using System;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System.Diagnostics;

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

            List<UserHistory> histories = new List<UserHistory>();
            var dataTable = new DataTable();

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
                            while (await reader.ReadAsync())
                            {
                                UserHistory history = new UserHistory
                                {
                                    Id = reader.GetInt32("id"),
                                    RequestMethod = reader.GetString("RequestMethod"),
                                    RequestPath = reader.GetString("RequestPath"),
                                    ResponseStatusCode = reader.GetInt32("ResponseStatusCode"),
                                    Body = reader.GetString("Body"),
                                    Timestamp = reader.GetDateTime("Timestamp"),
                                    TotalPages = reader.GetDouble("TotalPages"),
                                    Duration = reader.GetInt64("Duration")
                                };
                                histories.Add(history);
                            }

                        }

                    }
                }

                return new Response(
                    success: true,
                    debugScript: commandText.ToString(),
                    message: "Succesfully fetch user logs",
                    body: histories 
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


}
