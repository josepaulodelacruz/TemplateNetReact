using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetTemplate_React.Models.Reports;
using NetTemplate_React.Services.Reports;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NetTemplate_React.Controllers.Reports
{
    [Route("api/Reports/[controller]")]
    [Authorize]
    [ApiController]
    public class CrashReportController : ControllerBase
    {
        private ICrashReportService _service;

        public CrashReportController(ICrashReportService service)
        {
            _service = service;
        }


        // GET: api/<CrashReportController>
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int page = 1)
        {
            var response = await _service.GetCrashReport(page);

            if (!response.Success) return new BadRequestObjectResult(response);

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

            var response = await _service.CreateReport(body, _imagesBin);

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
