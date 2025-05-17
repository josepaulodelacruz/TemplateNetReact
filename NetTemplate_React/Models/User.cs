using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Diagnostics;
using System.Linq;

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

        public static List<UserPermission> AttachedPermissionInUser(DataTable dt)
        {
            List<UserPermission> permissions = new List<UserPermission>();

            if (dt == null || dt.Rows.Count == 0) return permissions;

            //error when creating new user no permission when loggin in
            permissions = dt.Rows.Cast<DataRow>()
                .GroupBy(row => new
                {
                    id = row["id"].ToString(),
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
