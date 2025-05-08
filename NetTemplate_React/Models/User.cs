using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;

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


    }
}
