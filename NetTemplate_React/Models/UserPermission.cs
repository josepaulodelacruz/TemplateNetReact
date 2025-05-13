using Newtonsoft.Json;

namespace NetTemplate_React.Models
{
    public class UserPermission
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("user_id")]
        public string UserId { get; set; }

        [JsonProperty("create")]
        public bool Create { get; set; } = false;

        [JsonProperty("read")]
        public bool Read { get; set; } = false;

        [JsonProperty("update")]
        public bool Update { get; set; } = false;

        [JsonProperty("delete")]
        public bool Delete { get; set; } = false;

    }
}
