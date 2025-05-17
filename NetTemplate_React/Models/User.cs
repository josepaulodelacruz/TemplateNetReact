using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography.Xml;

namespace NetTemplate_React.Models
{
    public class User
    {

        [JsonProperty("id")]
        public int Id { get; set; }

        [Required]
        [JsonProperty("username")]
        public string Username { get; set; }

        [Required]
        [JsonProperty("password")]
        public string Password { get; set; }

        [JsonProperty("created_at")]
        public DateTime CreatedAt { get; set; }

        [JsonProperty("role")]
        public string Role { get; set; }

        [JsonProperty("token")]
        public string Token { get; set; }

        [JsonProperty("session_date")]
        public DateTime? SessionDate { get; set; }

        [JsonProperty("is_active")]
        public bool IsActive { get; set; }

        [JsonProperty("permissions")]
        public List<UserPermission> Permissions = new List<UserPermission>(); 

        public static User TransformUser(DataTable dt)
        {
            User user = new User();

            if (dt != null && dt.Rows.Count > 0)
            {
                var userData = dt.Rows.Cast<DataRow>()
                    .GroupBy(row => new
                    {
                        Id = int.Parse(row["ID"].ToString()),
                        Username = row["USERNAME"].ToString(),
                        CreatedAt = Convert.ToDateTime(row["CREATED_AT"].ToString()),
                        IsActive = Convert.ToInt32(row["IS_ACTIVE"]) == 1
                    })
                    .Select(group => new User()
                    {
                        Id = group.Key.Id,
                        Username = group.Key.Username,
                        CreatedAt = group.Key.CreatedAt,
                        IsActive = group.Key.IsActive,
                        Permissions = group.Any(row => row["p_id"] != DBNull.Value) ?
                        group.Select(row => new UserPermission()
                        {
                            Id = row["p_id"].ToString(),
                            Name = row["NAME"].ToString(),
                            UserId = row["USER_ID"].ToString(),
                            ModuleId = int.Parse(row["MODULE_ID"].ToString()),
                            Create = Convert.ToInt32(row["CREATE"]) == 1,
                            Read = Convert.ToInt32(row["READ"]) == 1,
                            Update = Convert.ToInt32(row["UPDATE"]) == 1,
                            Delete = Convert.ToInt32(row["Delete"]) == 1
                        }).ToList() : new List<UserPermission>(),
                    }).FirstOrDefault(); // Assuming you want to transform the first distinct user

                if (userData != null)
                {
                    user = userData;
                }
            }

            return user;
        }

        public static List<UserPermission> AttachedPermissionInUser(DataTable dt)
        {
            List<UserPermission> permissions = new List<UserPermission>();

            var a = dt?.Rows.Cast<DataRow>().FirstOrDefault(row => !row.IsNull("p_id"));
           
            if (a == null) return permissions; 

            permissions = dt.Rows.Cast<DataRow>()
                .GroupBy(row => new
                {
                    id = row["p_id"].ToString(),
                    user_id = row["USER_ID"].ToString(),
                    module_id = int.Parse(row["MODULE_ID"].ToString()),
                    name = row["name"].ToString(),
                })
                .Select(group => new UserPermission()
                {
                    Id = group.Key.id,
                    Name = group.Key.name,
                    ModuleId = group.Key.module_id,
                    UserId = group.Key.user_id,
                    Create = group.Any(row => Convert.ToInt32(row["CREATE"]) == 1),
                    Read = group.Any(row => Convert.ToInt32(row["READ"]) == 1),
                    Update = group.Any(row => Convert.ToInt32(row["UPDATE"]) == 1),
                    Delete = group.Any(row => Convert.ToInt32(row["DELETE"]) == 1),
                }).ToList();

            Debug.WriteLine(permissions.Count);

            return permissions;
        }
    }
}
