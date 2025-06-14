using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetTemplate_React.Models;
using NetTemplate_React.Services.Setup;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NetTemplate_React.Controllers.Setup
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;

        public UserController(IUserService service)
        {
            _service = service;
        }

        // GET: api/<UserController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var response = await _service.GetUsers();

            if (!response.Success && response.IsCrash)
                return StatusCode(500, response);
            else if (!response.Success)
                return new BadRequestObjectResult(response);

            return new OkObjectResult(response);
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id = null)
        {
            if (id.Contains("null")) return BadRequest("id must not be null");

            var response = await _service.GetUsers(id);

            if (!response.Success) return new BadRequestObjectResult(response);

            return new OkObjectResult(response);

        }

        //PUT api/<UserController/5
        [HttpPut("change-status/{id}")]
        public async Task<IActionResult> ChangeUserStatus(int id, [FromQuery] bool is_active)
        {
            var response = await _service.ChangeUserStatus(id, is_active);

            if (!response.Success) new BadRequestObjectResult(response);

            return Ok(response);
        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }

}

