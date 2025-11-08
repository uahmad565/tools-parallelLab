using Backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
//builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

// Configure CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:5193")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
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
//app.MapOpenApi();
app.Run();
