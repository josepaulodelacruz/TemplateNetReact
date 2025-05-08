using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.IO;
using NetTemplate_React.Middleware;
using NetTemplate_React.Services;
using NetTemplate_React.Services.Setup;

namespace NetTemplate_React
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            // Other service registrations
            services.AddJwtTokenValidation(Configuration);
            services.AddMvc();

            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
                
            });

            services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder => builder.WithOrigins("http://localhost:5173") //add front end url if deployed
                    .AllowAnyHeader()
                    .AllowAnyMethod());
            });

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            var conString = Configuration.GetConnectionString("DEV");

            //injected services
            services.AddScoped<IAuthService, AuthService>(options => new AuthService(conString: conString, configuration: Configuration));

            //setups
            services.AddScoped<IModuleItemService, ModuleItemService>(options => new ModuleItemService(conString: conString, configuration: Configuration));
            services.AddScoped<IUserService, UserService>(options => new UserService(conString: conString, configuration: Configuration));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            // Path to React build folder
            ///important build the front-end first before publishing the .net project
            var clientAppDist = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp/FrontEnd", "dist"); 

            // Serve static files (CSS, JS, images) from React build
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(clientAppDist),
                RequestPath = ""
            });

            // Serve index.html for any unmatched routes (React Router will handle frontend routing)
            app.Use(async (context, next) =>
            {
                await next();

                if (context.Response.StatusCode == 404 &&
                    !Path.HasExtension(context.Request.Path.Value) &&
                    !context.Request.Path.Value.StartsWith("/api"))
                {
                    context.Response.StatusCode = 200;
                    await context.Response.SendFileAsync(Path.Combine(clientAppDist, "index.html"));
                }
            });

            app.UseAuthentication();

            // Optional: Custom token validation middleware
            app.UseMiddleware<TokenValidationMiddleware>();


            // Use MVC for API controllers
            app.UseCookiePolicy();

            app.UseAPILogger();


            app.UseCors("AllowSpecificOrigin");

            app.UseMvc();
        }
    }
}
