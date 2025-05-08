using Microsoft.Extensions.Configuration;
using NetTemplate_React.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace NetTemplate_React.Services.Setup
{
    public interface IUserService
    {
        Task<Response> GetUsers();
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

        public async Task<Response> GetUsers()
        {
            string commandText = "SELECT [ID],[USERNAME],[ROLE] FROM USERS";
            
            List<User> Users = new List<User>();
            try
            {
                using (SqlConnection con = new SqlConnection(_conString))
                {
                    await con.OpenAsync();

                    using (SqlCommand cmd = new SqlCommand(commandText, con))
                    {
                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var user = new User()
                                {
                                    Id = int.Parse(reader["ID"].ToString()),
                                    Username = reader["USERNAME"].ToString(),
                                    Role = reader["ROLE"].ToString(),
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
