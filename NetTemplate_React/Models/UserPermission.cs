using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Text.Json.Serialization;

namespace NetTemplate_React.Models
{
    [JsonObject(NamingStrategyType = typeof(SnakeCaseNamingStrategy))]
    public class UserPermission
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("module_id")]
        public int ModuleId { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("user_id")]
        public string UserId { get; set; }

        [JsonPropertyName("create")]
        public bool Create { get; set; } = false;

        [JsonPropertyName("read")]
        public bool Read { get; set; } = false;

        [JsonPropertyName("update")]
        public bool Update { get; set; } = false;

        [JsonPropertyName("delete")]
        public bool Delete { get; set; } = false;

    }
}
