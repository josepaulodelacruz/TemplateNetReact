using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace NetTemplate_React.Models
{
    public class ModuleItem
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [Required]
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("parent_id")]
        public string ParentId { get; set; }

        [JsonPropertyName("parent_name")]
        public string ParentName { get; set; }
    }
}
