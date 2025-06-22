using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NetTemplate_React.Middleware;
using NetTemplate_React.Services;
using NetTemplate_React.Services.Reports;
using NetTemplate_React.Services.Setup;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Configure services
var services = builder.Services;
var configuration = builder.Configuration;

// JWT Token Validation (you'll need to implement this extension method)
services.AddJwtTokenValidation(configuration);

// Add MVC/Controllers
services.AddControllers();

// Configure Cookie Policy
services.Configure<CookiePolicyOptions>(options =>
{
    // This lambda determines whether user consent for non-essential cookies is needed for a given request.
    options.CheckConsentNeeded = context => true;
    options.MinimumSameSitePolicy = SameSiteMode.None;
});

// Configure CORS
services.AddCors(options =>
{
    string[] allowedOrigins = new[]
    {
        "http://localhost:5173",
        "http://localhost:4173",
    };

    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins(allowedOrigins) // add front end url if deployed
        .AllowAnyHeader()
        .AllowAnyMethod());
});

// Database connection setup
bool isLive = bool.Parse(configuration.GetConnectionString("ISLive") ?? "false");
var conString = !isLive ? configuration.GetConnectionString("DEV") : configuration.GetConnectionString("PROD");

// Register scoped services
services.AddScoped<IAuthService, AuthService>(options => 
    new AuthService(conString: conString, configuration: configuration));

// Setup services
services.AddScoped<IModuleItemService, ModuleItemService>(options => 
    new ModuleItemService(conString: conString, configuration: configuration));
services.AddScoped<IUserService, UserService>(options => 
    new UserService(conString: conString, configuration: configuration));
services.AddScoped<IUserPermissionService, UserPermissionService>(options => 
    new UserPermissionService(conString: conString, config: configuration));
services.AddScoped<IUserHistoryService, UserHistoryService>(options => 
    new UserHistoryService(conString: conString, logger: new LoggerFactory()));

// Reports
services.AddScoped<ICrashReportService, CrashReportService>(options => 
    new CrashReportService(conString: conString, logger: new LoggerFactory()));

// Add authentication and authorization
services.AddAuthentication();
services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
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
// Important: build the front-end first before publishing the .net project
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
app.UseAuthorization();

// Custom token validation middleware
app.UseMiddleware<TokenValidationMiddleware>();

// Use cookie policy
app.UseCookiePolicy();

// Custom logger middleware
app.UseLoggerMIddleware();

// Use CORS
app.UseCors("AllowSpecificOrigin");

// Map controllers
app.MapControllers();

app.Run();
