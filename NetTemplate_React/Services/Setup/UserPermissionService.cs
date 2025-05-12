using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.Configuration;
using NetTemplate_React.Models;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace NetTemplate_React.Services.Setup
{
    public interface IUserPermissionService
    {
        Task<Response> GetPermission(string id = null);

    }

    public class UserPermissionService : IUserPermissionService
    {
        private readonly string _conString;
        private readonly IConfiguration _config; 

        public UserPermissionService(string conString, IConfiguration config)
        {
            _conString = conString;
            _config = config;
        }

        public async Task<Response> GetPermission(string id = null)
        {
            DataTable dataTable = new DataTable();
            string commandText = "[dbo].[NSP_UserPermission]";
            try
            {
                using (SqlConnection con = new SqlConnection(_conString))
                {
                    await con.OpenAsync(); 

                    using (SqlCommand cmd = new SqlCommand(commandText, con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@FLAG", "GET PERMISSION");
                        cmd.Parameters.AddWithValue("@USER_ID", id);

                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            dataTable.Load(reader);
                        }
                    }
                }

                return new Response(
                    success: true,
                    debugScript: commandText,
                    message: "Successfully fetch permissions",
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
