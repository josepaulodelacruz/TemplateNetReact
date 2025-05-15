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

        Task<Response> SavePermission(List<UserPermission> permissions);
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
                                    Id = reader.IsDBNull(reader.GetOrdinal("ID")) ? null : reader["ID"].ToString(),
                                    ModuleId = reader.GetInt32(reader.GetOrdinal("MODULE_ID")),
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

        public async Task<Response> SavePermission(List<UserPermission> permissions)
        {
            var dtPermissions = new DataTable();
            dtPermissions.Columns.Add("ID");
            dtPermissions.Columns.Add("USER_ID");
            dtPermissions.Columns.Add("MODULE_ID");
            dtPermissions.Columns.Add("CREATE");
            dtPermissions.Columns.Add("READ");
            dtPermissions.Columns.Add("UPDATE");
            dtPermissions.Columns.Add("DELETE");

            foreach (UserPermission permission in permissions)
            {
                dtPermissions.Rows.Add(new object[]
                {
                    permission.Id,
                    permission.UserId, 
                    permission.ModuleId, 
                    permission.Create, 
                    permission.Read, 
                    permission.Update, 
                    permission.Delete,
                });
            }
            string commandText = "[dbo].[NSP_UserPermission]";
            try
            {
                using (SqlConnection con = new SqlConnection(_conString))
                {
                    await con.OpenAsync();

                    

                    using (SqlCommand cmd = new SqlCommand(commandText, con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@FLAG", "SAVE PERMISSIONS");
                        cmd.Parameters.AddWithValue("@USER_PERMISSION", dtPermissions);

                        await cmd.ExecuteNonQueryAsync();
                    }
                }

                return new Response(
                    success: true,
                    debugScript: commandText,
                    message: "Successfully save user permission",
                    body: dtPermissions 
                );

            } 
            catch (SqlException Ex)
            {
                return new Response(
                    success: false,
                    message: Ex.Message,
                    debugScript: commandText,
                    body: null
                );
            }
            catch (Exception Ex)
            {
                return new Response(
                    success: false,
                    message: Ex.Message,
                    debugScript: commandText,
                    body: null
                );
            }

        }

    }
}
