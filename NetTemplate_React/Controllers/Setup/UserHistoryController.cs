using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NetTemplate_React.Models;
using NetTemplate_React.Services.Setup;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NetTemplate_React.Controllers.Setup
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserHistoryController : ControllerBase
    {
        private readonly IUserHistoryService _service;

        public UserHistoryController(IUserHistoryService service)
        {
            _service = service;
        }


        // GET: api/<UserHistoryController>
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int id,[FromQuery] int page = 1)
        {
            var response = await _service.GetHistoryByUserId(id, page);

            if(!response.Success)
            {
                return new BadRequestObjectResult(response);
            }

            return new OkObjectResult(response);
        }

        // GET api/<UserHistoryController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<UserHistoryController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<UserHistoryController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<UserHistoryController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
