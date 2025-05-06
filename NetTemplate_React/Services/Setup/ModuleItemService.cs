using Microsoft.Extensions.Configuration;
using NetTemplate_React.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.IO.Pipelines;
using System.Security.Cryptography.Xml;
using System.Threading.Tasks;

namespace NetTemplate_React.Services.Setup
{
    public interface IModuleItemService
    {
        Task<Response> GetModules(string id = null);

        Task<Response> AddModuleItem(ModuleItem moduleItem);

        Task<Response> EditModuleItem(int id, ModuleItem  moduleItem);

        Task<Response> DeleteModuleItem(int id);
    }

    public class ModuleItemService : IModuleItemService
    {
        private readonly string _conString; 
        private readonly IConfiguration _configuration;

        public ModuleItemService(string conString, IConfiguration configuration)
        {
            _conString = conString;
            _configuration = configuration;
        }
        public async Task<Response> GetModules(string id = null)
        {
            //string commandText = "SELECT * FROM ModuleItems WHERE @ID IS NULL OR ID = @ID";
            string commandText =
                "SELECT " +
                    "main.[ID], " +
                    "main.[NAME], " +
                    "main.[PARENT_ID], " +
                    "sec.[NAME] AS [PARENT_NAME] " +
                "FROM [dbo].[ModuleItems] main " +
                "LEFT JOIN [dbo].[ModuleItems] sec ON main.[PARENT_ID] = sec.[ID] " +
                "WHERE @ID IS NULL OR main.[ID] = @ID";
            try
            {
                List<ModuleItem> ModuleItems = new List<ModuleItem>();
                using (SqlConnection con = new SqlConnection(_conString))
                {
                    await con.OpenAsync();


                    using (SqlCommand cmd = new SqlCommand(commandText, con))
                    {
                        cmd.Parameters.AddWithValue("@ID", (object) id ?? DBNull.Value);

                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while(await reader.ReadAsync())
                            {
                                ModuleItems.Add(new ModuleItem()
                                {
                                    Id = int.Parse(reader["ID"].ToString()),
                                    Name = reader["NAME"].ToString(),
                                    ParentId = reader.IsDBNull(reader.GetOrdinal("PARENT_ID")) ? (string)null : reader["PARENT_ID"].ToString(),
                                    ParentName = reader.IsDBNull(reader.GetOrdinal("PARENT_NAME")) ? null : reader["PARENT_NAME"].ToString(),
                                });
                            }
                        }
                    }

                    //throw error if no module id is found
                    if(id != null && ModuleItems.Count == 0)
                    {
                        return new Response(
                            success: false,
                            debugScript: commandText,
                            message: "No module found",
                            body: null
                        );
                    }

                    return new Response(
                        success: true,
                        debugScript: commandText,
                        message: "Successfully fetch module items",
                        body: ModuleItems
                    );
                }

            }
            catch (SqlException ex)
            {
                return new Response(
                    success: false,
                    debugScript: commandText,
                    message: ex.Message,
                    body: null
                );
            }
            catch (Exception ex)
            {
                return new Response(
                    success: false,
                    debugScript: commandText,
                    message: ex.Message,
                    body: null
                );
            }
        }

        public async Task<Response> AddModuleItem(ModuleItem item)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_conString))
                {
                    await con.OpenAsync();
                    string commandText = "INSERT INTO ModuleItems([NAME], [PARENT_NAME], [PARENT_ID]) VALUES(@name, @parent_name, @parent_id)";

                    using (SqlCommand cmd = new SqlCommand(commandText, con))
                    {
                        cmd.Parameters.Add(new SqlParameter("@name", SqlDbType.NVarChar) { Value = item.Name });
                        cmd.Parameters.Add(new SqlParameter("@parent_name", SqlDbType.NVarChar) { Value = (object)item.ParentName ?? DBNull.Value });
                        cmd.Parameters.Add(new SqlParameter("@parent_id", SqlDbType.Int) { Value =  (object)item.ParentId ?? DBNull.Value});

                        await cmd.ExecuteNonQueryAsync();
                    }

                    return new Response(
                        success: true,
                        debugScript: commandText,
                        message: "Successfully added new module",
                        body: item
                    );
                }
            }
            catch (SqlException ex)
            {
                if (ex.Number == 2627)
                {
                    return new Response(
                        success: false,
                        debugScript: ex.Message,
                        message: "Module name already exist.",
                        body: null
                    );
                } // SQL Error Code for UNIQUE constraint violation

                return new Response(
                    success: false,
                    debugScript: ex.Message,
                    message: $"SQL Error: {ex.Message}",
                    body: null
                );
            }
            catch (Exception ex)
            {
                return new Response(
                    success: false,
                    debugScript: ex.Message,
                    message: $"Unexpected Error: {ex.Message}",
                    body: null
                );
            }
        }

        public async Task<Response> EditModuleItem(int id, ModuleItem  moduleItem)
        {
            string commandText = "UPDATE ModuleItems \n" +
                "SET " +
                "    NAME = @NAME" +
                ",   PARENT_ID = @PARENT_ID" +
                ",   PARENT_NAME = @PARENT_NAME \n" +
                "WHERE ID = @ID";

            try
            {
                using (SqlConnection con = new SqlConnection(_conString))
                {
                    await con.OpenAsync();

                    using (SqlCommand cmd = new SqlCommand(commandText, con))
                    {
                        cmd.Parameters.AddWithValue("@NAME", moduleItem.Name);
                        cmd.Parameters.Add(new SqlParameter("@parent_name", SqlDbType.NVarChar) { Value = (object)moduleItem.ParentName ?? DBNull.Value });
                        cmd.Parameters.Add(new SqlParameter("@parent_id", SqlDbType.Int) { Value =  (object)moduleItem.ParentId ?? DBNull.Value});
                        cmd.Parameters.AddWithValue("@ID", id);

                        await cmd.ExecuteNonQueryAsync();
                    }
                }

                return new Response(
                    success: true,
                    debugScript: commandText,
                    message: "Successfully Update module item.",
                    body: null
                );

            } 
            catch (SqlException ex)
            {
                return new Response(
                    success: false,
                    debugScript: commandText,
                    message: ex.Message,
                    body: null
                );
            }
            catch (Exception ex)
            {
                return new Response(
                    success: false,
                    debugScript: commandText,
                    message: ex.Message,
                    body: null
                );
            }
        }


        public async Task<Response> DeleteModuleItem(int id)
        {
            string commandText = "DELETE FROM ModuleItems WHERE ID = @ID";
            try
            {
                using (SqlConnection con = new SqlConnection(_conString))
                {
                    await con.OpenAsync();

                    using (SqlCommand cmd = new SqlCommand(commandText, con))
                    {
                        cmd.Parameters.AddWithValue("@ID", id);

                        await cmd.ExecuteNonQueryAsync();
                    }
                }

                return new Response(
                    success: true,
                    debugScript: commandText,
                    message: "Successfully deleted module item",
                    body: null
                );
            } 
            catch (SqlException ex)
            {
                return new Response(
                    success: false,
                    debugScript: commandText,
                    message: ex.Message,
                    body: null
                );
            } 
            catch (Exception ex)
            {
                return new Response(
                    success: false,
                    debugScript: commandText,
                    message: ex.Message,
                    body: null
                );
            }
        }

    }
}
