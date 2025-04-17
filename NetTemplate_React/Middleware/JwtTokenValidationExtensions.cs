using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Threading.Tasks;
using System;

namespace NetTemplate_React.Middleware
{
    public static class JwtTokenValidationExtensions
    {
        public static IServiceCollection AddJwtTokenValidation(this IServiceCollection services, IConfiguration configuration)
        {
            // Get JWT settings from configuration
            var jwtSettings = configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"];
            var issuer = jwtSettings["Issuer"];
            var audience = jwtSettings["Audience"];

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = issuer,
                    ValidAudience = audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                    ClockSkew = TimeSpan.Zero // Optional: reduces the default 5 min tolerance for token expiration
                };

                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = context =>
                    {
                        // Additional custom validation can be performed here if needed
                        // For example, check if the user still exists in your database
                        return Task.CompletedTask;
                    },
                    OnAuthenticationFailed = context =>
                    {
                        if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                        {
                            context.Response.Headers.Add("Token-Expired", "true");
                        }
                        return Task.CompletedTask;
                    }
                };
            });

            return services;
        }
    }

    // Custom middleware for token validation
    public class TokenValidationMiddleware
    {
        private readonly RequestDelegate _next;

        public TokenValidationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            // The JWT authentication middleware will already have validated the token
            // This middleware can add additional logic if needed

            if (!context.User.Identity.IsAuthenticated)
            {
                // Optional: Custom handling for unauthenticated requests
                if (!IsPathAllowedWithoutAuth(context.Request.Path))
                {
                    context.Response.StatusCode = 401; // Unauthorized
                    return;
                }
            }

            // Continue processing the request
            await _next(context);
        }

        private bool IsPathAllowedWithoutAuth(string path)
        {
            // Define paths that don't require authentication
            var allowedPaths = new[] { "/" }; //allowed front end to have no authentication validation

            foreach (var allowedPath in allowedPaths)
            {
                if (path.StartsWith(allowedPath, StringComparison.OrdinalIgnoreCase))
                {
                    return true;
                }
            }

            return false;
        }
    }
}
