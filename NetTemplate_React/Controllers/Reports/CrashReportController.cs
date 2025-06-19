using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetTemplate_React.Models.Reports;
using NetTemplate_React.Services.Reports;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using System.Security.Claims;
using NetTemplate_React.Models;
using Microsoft.Extensions.Logging;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NetTemplate_React.Controllers.Reports
{
    [Route("api/Reports/[controller]")]
    [Authorize]
    [ApiController]
    public class CrashReportController : ControllerBase
    {
        private ICrashReportService _service;
        private ILogger<CrashReportController> _logger;

        public CrashReportController(ICrashReportService service, ILogger<CrashReportController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet("Test")]
        public async Task<IActionResult> Get()
        {
            var response = new Response(
                    success: false,
                    message: "FAILED",
                    debugScript: "TESTING ONLY",
                    body: null
                );
            return StatusCode(500, response);
        }

        [HttpGet("Logs")]
        public async Task<IActionResult> GetLogs([FromQuery] string id)
        {
            _logger.LogInformation("==================================GET LOGS ============================================");
            var response = await _service.GetLogs(id);

            if (!response.Success && response.IsCrash) return StatusCode(500, response);
            else if (!response.Success) return new BadRequestObjectResult(response);
            _logger.LogInformation("==================================END GET LOGS ============================================");

            return new OkObjectResult(response);
        }

        [HttpGet("metrics")]
        public async Task<IActionResult> GetMetrics([FromQuery] string filterDate = "")
        {
            _logger.LogInformation("====================================== GET METRICS ====================================");
            _logger.LogInformation(filterDate);
            Debug.WriteLine(filterDate);

            var response = await _service.GetMetrics(filterDate);

            if (!response.Success && response.IsCrash) return StatusCode(500, response);
            else if (!response.Success) return new BadRequestObjectResult(response);

            return new OkObjectResult(response);
        }

        // GET: api/<CrashReportController>
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int page = 1, [FromQuery] string filter = "")
        {
            var response = await _service.GetCrashReport(page, filter);

            if (!response.Success) return new BadRequestObjectResult(response);

            return new OkObjectResult(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var response = await _service.GetCrashReportById(id);

            if(!response.Success && response.IsCrash)
                return StatusCode(500, response);
            else if (!response.Success)
                return new BadRequestObjectResult(response);

            return new OkObjectResult(response);
        }

        // POST api/<CrashReportController>
        [HttpPost]
        public async Task<IActionResult> Post([FromForm] CrashReport body)
        {
            List<byte[]> _imagesBin = new List<byte[]>();
            if (body.Images != null && body.Images.Count > 0)
            {
                foreach (var item in body.Images)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await item.CopyToAsync(memoryStream);
                        _imagesBin.Add(memoryStream.ToArray());
                    }
                }
            }

            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int createdBy = int.Parse(userId);

            var response = await _service.CreateReport(body, _imagesBin, createdBy);

            if (!response.Success) return new BadRequestObjectResult(response);

            return new OkObjectResult(response);

        }

        // PUT api/<CrashReportController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<CrashReportController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        
    }
}
