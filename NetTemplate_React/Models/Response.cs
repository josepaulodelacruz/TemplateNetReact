using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Runtime.InteropServices;
using System.Xml.Linq;

namespace NetTemplate_React.Models
{
    public class Response
    {
        [JsonProperty("success")]
        public bool Success { get; set; }

        [JsonProperty("debug_script")]
        [Required(ErrorMessage = "For debugging purposes, put the SQL script here or SP used for easier tracing.")]
        public string DebugScript { get; }

        [JsonProperty("message")]
        [Required(ErrorMessage = "Message is required.")]
        public string Message { get; }

        [JsonProperty("body")]
        [Required(ErrorMessage = "Body cannot be null.")]
        public dynamic Body { get; }

        // Enforce required values via constructor
        public Response(bool success, string debugScript, string message, dynamic body)
        {
            Success = success;
            DebugScript = !string.IsNullOrWhiteSpace(debugScript)
                ? debugScript
                : throw new ArgumentNullException(nameof(debugScript), "DebugScript must be provided. For tracing purposes");

            Message = message;

            Body = body;
        }

        // Optional: Deconstruct method for tuple-based extraction
        public void Deconstruct(out bool success, out string debugScript, out string message, out dynamic body)
        {
            success = Success;
            debugScript = DebugScript;
            message = Message;
            body = Body;
        }
    }
}
