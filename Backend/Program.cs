using Backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
//builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add SignalR for real-time progress updates
builder.Services.AddSignalR();

// Configure Kestrel for large file uploads (up to 5GB)
// With smart sampling, we can handle huge files because we only analyze ~10K rows
builder.Services.Configure<Microsoft.AspNetCore.Server.Kestrel.Core.KestrelServerOptions>(options =>
{
    options.Limits.MaxRequestBodySize = 5L * 1024L * 1024L * 1024L; // 5 GB
    options.Limits.RequestHeadersTimeout = TimeSpan.FromMinutes(15);
    options.Limits.KeepAliveTimeout = TimeSpan.FromMinutes(15);
});

// Configure form options for large file uploads
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 5L * 1024L * 1024L * 1024L; // 5 GB
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartHeadersLengthLimit = int.MaxValue;
});

// Register application services
builder.Services.AddScoped<TypeInferenceService>();
builder.Services.AddScoped<CsvParserService>();
builder.Services.AddScoped<SchemaGeneratorService>();

// Configure CORS for React frontend (with SignalR support)
// Allows frontend on host machine to connect to backend in Docker container
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins(
                    "http://localhost:5173",      // Vite dev server
                    "http://localhost:3000",      // Alternative React port
                    "http://localhost:5193",      // Backend (when not in Docker)
                    "http://host.docker.internal:5173"  // Frontend from Docker perspective
                  )
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // Required for SignalR
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();
app.MapHub<Backend.Hubs.ProgressHub>("/progressHub");
//app.MapOpenApi();
app.Run();
