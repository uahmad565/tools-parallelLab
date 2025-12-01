using System.Net;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;

namespace Backend.Middleware;

public static class RateLimitPolicy
{
    public static string GetClientIdentifier(HttpContext context)
    {
        // Extract IP address (handles Azure App Service load balancer)
        var ipAddress = GetClientIpAddress(context);
        
        // Get User-Agent header
        var userAgent = context.Request.Headers["User-Agent"].ToString();
        
        // If User-Agent is empty, use a default value
        if (string.IsNullOrWhiteSpace(userAgent))
        {
            userAgent = "Unknown";
        }
        
        // Combine IP and User-Agent to create unique identifier
        return $"{ipAddress}:{userAgent}";
    }
    
    private static string GetClientIpAddress(HttpContext context)
    {
        // Check for X-Forwarded-For header (Azure App Service behind load balancer)
        var forwardedFor = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(forwardedFor))
        {
            // X-Forwarded-For can contain multiple IPs, take the first one
            var ips = forwardedFor.Split(',', StringSplitOptions.RemoveEmptyEntries);
            if (ips.Length > 0)
            {
                return ips[0].Trim();
            }
        }
        
        // Check for X-Real-IP header (alternative proxy header)
        var realIp = context.Request.Headers["X-Real-IP"].FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(realIp))
        {
            return realIp.Trim();
        }
        
        // Fallback to connection remote IP address
        var remoteIp = context.Connection.RemoteIpAddress;
        if (remoteIp != null)
        {
            // Handle IPv6 mapped to IPv4
            if (remoteIp.IsIPv4MappedToIPv6)
            {
                return remoteIp.MapToIPv4().ToString();
            }
            return remoteIp.ToString();
        }
        
        // Last resort: return localhost
        return "127.0.0.1";
    }
    
    public static void ConfigureRateLimitPolicy(IServiceCollection services, IConfiguration configuration)
    {
        var permitLimit = configuration.GetValue<int>("RateLimiting:PermitLimit", 10);
        var window = TimeSpan.FromSeconds(configuration.GetValue<int>("RateLimiting:Window", 60));
        var queueLimit = configuration.GetValue<int>("RateLimiting:QueueLimit", 0);
        
        services.AddRateLimiter(options =>
        {
            options.AddPolicy("ApiRateLimitPolicy", context =>
            {
                var identifier = GetClientIdentifier(context);
                return RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: identifier,
                    factory: partition => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = permitLimit,
                        Window = window,
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = queueLimit
                    });
            });
            
            // Configure global rate limit response
            options.OnRejected = async (context, cancellationToken) =>
            {
                double retryAfterSeconds = window.TotalSeconds;
                
                if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
                {
                    retryAfterSeconds = retryAfter.TotalSeconds;
                    context.HttpContext.Response.Headers.RetryAfter = 
                        ((int)retryAfterSeconds).ToString();
                }
                
                context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                context.HttpContext.Response.ContentType = "application/json";
                
                // Add rate limit headers
                context.HttpContext.Response.Headers["X-RateLimit-Limit"] = permitLimit.ToString();
                context.HttpContext.Response.Headers["X-RateLimit-Window"] = ((int)window.TotalSeconds).ToString();
                
                var response = new
                {
                    error = "Too many requests. Please try again later.",
                    retryAfter = retryAfterSeconds
                };
                
                await context.HttpContext.Response.WriteAsJsonAsync(response, cancellationToken);
            };
        });
    }
}

