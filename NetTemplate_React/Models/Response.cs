﻿using System;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Runtime.InteropServices;
using System.Text.Json.Serialization;
using System.Xml.Linq;

namespace NetTemplate_React.Models
{
    public class Response
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonPropertyName("debug_script")]
        [Required(ErrorMessage = "For debugging purposes, put the SQL script here or SP used for easier tracing.")]
        public string DebugScript { get; }

        [JsonPropertyName("message")]
        [Required(ErrorMessage = "Message is required.")]
        public string Message { get; }

        [JsonPropertyName("body")]
        [Required(ErrorMessage = "Body cannot be null.")]
        public dynamic Body { get; }

        [JsonIgnore]
        public bool IsCrash { get; set; }

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
