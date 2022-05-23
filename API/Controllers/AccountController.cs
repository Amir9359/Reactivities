using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly TokenService _tokenService;

        public AccountController(UserManager<AppUser> userManager,
         SignInManager<AppUser> signInManager, TokenService tokenService )
        {
            _signInManager = signInManager;
            _tokenService = tokenService;
            _userManager = userManager;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(loginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if(user == null ) return Unauthorized();

            var result =await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password , false);
            if(result.Succeeded )
            {
             return CreateUsreObject(user);
            }
            return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if(await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
            {
                return BadRequest("Email Taken!");
            }
            if(await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
            {
                return BadRequest("Username Taken!");
            }

            var user =new AppUser 
            {
                UserName = registerDto.Username,
                Email = registerDto.Email, 
                DisplayName = registerDto.DisplayName
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if(result.Succeeded)
            {
             return CreateUsreObject(user);
            }

            return BadRequest("Problem Registering User");
        }
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetCurentUser()
        {
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            return  CreateUsreObject(user);
        }

        private UserDto CreateUsreObject(AppUser user)
        {
                return new UserDto 
                {
                    DisplayName = user.DisplayName,
                    Image= null,
                    Username = user.UserName,
                    Token = _tokenService.CreateToken(user)
                };
        }
    }
}