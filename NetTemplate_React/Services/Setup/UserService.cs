using Microsoft.Extensions.Configuration;
using NetTemplate_React.Models;
using System;
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
            string commandText = "";
            try
            {

                using (SqlConnection con = new SqlConnection(_conString))
                {
                    using (SqlCommand cmd = new SqlCommand(commandText, con))
                    {
                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {

                            }
                        }
                    }

                }
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
