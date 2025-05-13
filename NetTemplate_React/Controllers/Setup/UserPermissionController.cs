using Microsoft.AspNetCore.Mvc;
using NetTemplate_React.Services.Setup;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NetTemplate_React.Controllers.Setup
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserPermissionController : ControllerBase
    {

        private readonly IUserPermissionService _service;

        public UserPermissionController(IUserPermissionService service)
        {
            _service = service;
        }

        // GET api/<UserPermissionController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id = null)
        {
            var response = await _service.GetPermission(id);

            if (!response.Success) return new BadRequestObjectResult(response);

            return new OkObjectResult(response);
        }

        // POST api/<UserPermissionController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<UserPermissionController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<UserPermissionController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
