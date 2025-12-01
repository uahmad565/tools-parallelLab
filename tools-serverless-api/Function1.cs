using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace tools_serverless_api;

public class Function1
{
    private readonly IConfiguration _config;
    private readonly ILogger<Function1> _logger;

    public Function1(ILogger<Function1> logger, IConfiguration configuration)
    {
        this._config = configuration;
        _logger = logger;
    }

    [Function("Function1")]
    public IActionResult Run([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequest req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request.");
        string str = "";
        try
        {
            str += "\n " + req.HttpContext.Connection.RemoteIpAddress?.ToString();
            str = _config["apikey"] ?? "Not Found";
        }
        catch (System.Exception ex)
        {
            _logger.LogError($"Error retrieving configuration: {ex.Message}");
            str = "Error retrieving configuration";
        }
        return new OkObjectResult("Welcome to Azure Functions! endpoint working/ " + str);
    }
}