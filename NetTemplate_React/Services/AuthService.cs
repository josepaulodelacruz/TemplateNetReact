using Microsoft.AspNetCore.Mvc;
using NetTemplate_React.Models;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;

namespace NetTemplate_React.Services
{
    public interface IAuthService
    {
        Task<Response> Test();

        Task<Response> Register(User user);

        Task<Response> Login(User user);

    }

    public class AuthService : IAuthService
    {
        private readonly string _conString; 

        public AuthService (string conString) 
        {
            _conString = conString;
        }

        public async Task<Response> Test()
        {
            try
            {
                var dataTable = new DataTable();
                using (SqlConnection con = new SqlConnection(_conString))
                {
                    await con.OpenAsync();

                    string commandText =
                        "Select" +
                        "*" +
                        "FROM USERS"; // Adjust column names as needed

                    using (SqlCommand cmd = new SqlCommand(commandText, con))
                    {
                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            dataTable.Load(reader);
                        }
                    }

                    var response = new Response(
                         success: true,
                         debugScript: commandText,
                         message: "Success",
                         body: dataTable
                     );

                    return response;
                }
            } catch (Exception ex)
            {
                return new Response
                    (
                        success: false,
                        debugScript: "ERROR",
                        message: ex.Message,
                        body: null
                    );
            }
        }

        public async Task<Response> Register(Models.User user)
        {
            var commandText = "INSERT INTO Users ([USERNAME], [PASSWORD]) VALUES (@username, @password)";

            try
            {
                using (SqlConnection con = new SqlConnection(_conString))
                {
                    await con.OpenAsync();

                    using (SqlCommand cmd = new SqlCommand(commandText, con))
                    {
                        cmd.Parameters.AddWithValue("@username", user.Username);
                        cmd.Parameters.AddWithValue("@password", user.Password); // Consider hashing passwords before inserting

                        int rowsAffected = await cmd.ExecuteNonQueryAsync();

                        if (rowsAffected > 0)
                        {
                            return new Response(
                                success: true,
                                debugScript: commandText,
                                message: "User registered successfully.",
                                body: new { Username = user.Username }
                            );
                        }
                        else
                        {
                            return new Response(
                                success: false,
                                debugScript: commandText,
                                message: "User registration failed.",
                                body: null
                            );
                        }
                    }
                }
            }
            catch (SqlException ex)
            {

                if (ex.Number == 2627) // SQL Error Code for UNIQUE constraint violation
                {
                    return new Response(
                        success: false,
                        debugScript: commandText,
                        message: "Duplicate entry detected: The username already exists.",
                        body: null
                    );
                }

                return new Response(
                    success: false,
                    debugScript: commandText,
                    message: $"SQL Error: {ex.Message}",
                    body: null
                );
            }
            catch (Exception ex)
            {
                return new Response(
                    success: false,
                    debugScript: commandText,
                    message: $"Error: {ex.Message}",
                    body: null
                );
            }
        }

        public async Task<Response> Login(Models.User user)
        {
            var dataTable = new DataTable();
            var commandText = "SELECT * FROM USERS WHERE [USERNAME] = @username";
            try
            {
                using (SqlConnection con = new SqlConnection(_conString))
                {
                    await con.OpenAsync();
                    using (SqlCommand cmd = new SqlCommand(commandText, con))
                    {
                        cmd.Parameters.AddWithValue("@username", user.Username);
                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            dataTable.Load(reader);
                        }
                        if (dataTable.Rows.Count == 0)
                        {
                            throw new Exception("Invalid Username or Password");
                        }

                        string storedHashedPassword = dataTable.Rows[0]["PASSWORD"].ToString();

                        // Trim the stored password to remove any whitespace that might be causing issues
                        storedHashedPassword = storedHashedPassword.Trim();

                        // Add proper debugging to see exact values
                        Debug.WriteLine($"User input password: {user.Password}");
                        Debug.WriteLine($"Stored hashed password: {storedHashedPassword}");

                        // Verify hashed password using BCrypt
                        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(user.Password, storedHashedPassword);
                        Debug.WriteLine($"Password valid: {isPasswordValid}");

                        if (!isPasswordValid) throw new Exception("Invalid Username or Password");

                        return new Response(
                            success: true,
                            debugScript: commandText,
                            message: "Successfully Logged in",
                            body: dataTable
                        );
                    }
                }
            }
            catch (SqlException ex)
            {
                return new Response(
                    success: false,
                    debugScript: commandText,
                    message: $"SQL Error: {ex.Message}",
                    body: null
                );
            }
            catch (Exception ex)
            {
                return new Response(
                    success: false,
                    debugScript: commandText,
                    message: $"Error: {ex.Message}",
                    body: null
                );
            }
        }

    }
}
