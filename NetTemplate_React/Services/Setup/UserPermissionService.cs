using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.Configuration;
using NetTemplate_React.Models;
using System;
using System.Collections.Generic;
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
            List<UserPermission> permission = new List<UserPermission>();
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
                        cmd.Parameters.AddWithValue("@USER_ID", (object)id ?? DBNull.Value);

                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                permission.Add(new UserPermission()
                                {
                                    Id = int.Parse(reader["ID"].ToString()),
                                    Name = reader["Name"].ToString(),
                                    UserId = reader.IsDBNull(reader.GetOrdinal("USER_ID")) ? null : reader["USER_ID"].ToString(),
                                    Create = reader.GetInt32(reader.GetOrdinal("CREATE")) == 1,
                                    Read = reader.GetInt32(reader.GetOrdinal("Read")) == 1,
                                    Update = reader.GetInt32(reader.GetOrdinal("Update")) == 1,
                                    Delete = reader.GetInt32(reader.GetOrdinal("Delete")) == 1,
                                });
                            }
                        }

                    }
                }

                return new Response(
                    success: true,
                    debugScript: commandText,
                    message: "Successfully fetch permissions",
                    body: permission 
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
