using Microsoft.AspNetCore.Mvc;
using NetTemplate_React.Models;
using NetTemplate_React.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NetTemplate_React.Controllers.Auth
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;

        public AuthController(IAuthService service) 
        {
            _service = service;
        }

        // GET: api/<AuthController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            Models.Response response = await _service.Test();
            return new OkObjectResult(response);
        }

        [HttpPost()]
        [Route("Register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            Models.Response response = await _service.Register(user);
            return new OkObjectResult(response);
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] User user)
        {
            Models.Response response = await _service.Login(user);

            if(!response.Success)
            {
                return new BadRequestObjectResult(response);
            }

            await _service.GenerateSession((User)response.Body); //generate new session

            return new OkObjectResult(response);
        }

    }

}
