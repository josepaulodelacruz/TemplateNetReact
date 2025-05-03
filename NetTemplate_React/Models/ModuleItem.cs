using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace NetTemplate_React.Models
{
    public class ModuleItem
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [Required]
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("parent_id")]
        public string ParentId { get; set; }

        [JsonProperty("parent_name")]
        public string ParentName { get; set; }
    }
}
