using Microsoft.Extensions.Configuration;
using NetTemplate_React.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace NetTemplate_React.Services.Setup
{
    public interface IUserService
    {
        Task<Response> GetUsers(string id = null);
    }

    public class UserService : IUserService
    {
        private readonly string _conString;
        private readonly IConfiguration _configuration;

        public UserService(string conString, IConfiguration configuration)
        {
            _conString = conString;
            _configuration = configuration; 
        }

        public async Task<Response> GetUsers(string id = null)
        {
            //string commandText = "SELECT [ID],[USERNAME],[ROLE] FROM USERS WHERE @ID IS NULL OR ID = @ID";
            string commandText = "SELECT " +
                "usr.*," +
                "latest.[SESSION_DATE] " +
                "FROM [dbo].[USERS] usr " +
                "OUTER APPLY (" +
                    "SELECT TOP 1 ss.[SESSION_DATE] FROM [dbo].[UserSessions] ss WHERE ss.[USER_ID] = usr.[ID] " +
                    "ORDER BY ss.[SESSION_DATE] DESC" +
                ") latest " +
                "WHERE @ID IS NULL OR usr.ID = @ID";
            
            List<User> Users = new List<User>();
            try
            {
                using (SqlConnection con = new SqlConnection(_conString))
                {
                    await con.OpenAsync();

                    using (SqlCommand cmd = new SqlCommand(commandText, con))
                    {
                        cmd.Parameters.AddWithValue("@ID", (object)id ?? DBNull.Value);

                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                User user = new User()
                                {
                                    Id = int.Parse(reader["ID"].ToString()),
                                    Username = reader["USERNAME"].ToString(),
                                    Role = reader["ROLE"].ToString(),
                                    SessionDate = reader.IsDBNull(reader.GetOrdinal("SESSION_DATE"))
                                        ? (DateTime?)null
                                        : reader.GetDateTime(reader.GetOrdinal("SESSION_DATE")),
                                    IsActive = reader.GetBoolean(reader.GetOrdinal("IS_ACTIVE"))
                                };
                                Users.Add(user);
                            }
                        }
                    }
                }

                return new Response(
                    success: true,
                    debugScript: commandText,
                    message: "Successfully fetch users",
                    body: Users
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
