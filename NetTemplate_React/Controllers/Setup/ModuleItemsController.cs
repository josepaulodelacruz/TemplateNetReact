using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetTemplate_React.Models;
using NetTemplate_React.Services.Setup;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NetTemplate_React.Controllers.Setup
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class ModuleItemsController : ControllerBase
    {
        private IModuleItemService _service;

        public ModuleItemsController(IModuleItemService service)
        {
            _service = service;
        }

        // GET: api/<ModuleItemsController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var response = await _service.GetModules();

            if(!response.Success) return new BadRequestObjectResult(response);

            return new OkObjectResult(response);
        }

        // GET api/<ModuleItemsController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var response = await _service.GetModules(id);

            if(!response.Success) return new BadRequestObjectResult(response);

            return new OkObjectResult(response);
        }

        // POST api/<ModuleItemsController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ModuleItem body)
        {
            var response = await _service.AddModuleItem(body);

            if (!response.Success) return new BadRequestObjectResult(response);

            return new OkObjectResult(response);
        }

        // PUT api/<ModuleItemsController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ModuleItem body)
        {
            var response = await _service.EditModuleItem(id, body);

            if (!response.Success) return new BadRequestObjectResult(response);

            return new OkObjectResult(response);
        }

        // DELETE api/<ModuleItemsController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _service.DeleteModuleItem(id);

            if (!response.Success) return new BadRequestObjectResult(response);

            return new OkObjectResult(response);
        }
    }
}
