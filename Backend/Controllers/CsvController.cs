using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;
using Backend.Models;
using Backend.Services;
using Backend.Hubs;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CsvController : ControllerBase
{
    private readonly CsvParserService _csvParser;
    private readonly SchemaGeneratorService _schemaGenerator;
    private readonly ILogger<CsvController> _logger;
    private readonly IHubContext<ProgressHub> _hubContext;

    public CsvController(
        CsvParserService csvParser,
        SchemaGeneratorService schemaGenerator,
        ILogger<CsvController> logger,
        IHubContext<ProgressHub> hubContext)
    {
        _csvParser = csvParser;
        _schemaGenerator = schemaGenerator;
        _logger = logger;
        _hubContext = hubContext;
    }

    [HttpPost("analyze")]
    [RequestSizeLimit(5_368_709_120)] // 5 GB
    [RequestFormLimits(MultipartBodyLengthLimit = 5_368_709_120)]
    public async Task<IActionResult> AnalyzeCsv(
        IFormFile file,
        [FromForm] string? className = null,
        [FromForm] string? namespaceName = null,
        [FromForm] bool useRecords = false,
        [FromForm] bool includeDataAnnotations = true,
        [FromForm] string? connectionId = null)
    {
        try
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { error = "No file uploaded" });
            }

            if (!file.FileName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new { error = "File must be a CSV" });
            }

            // Progress callback for SignalR
            Func<string, int, Task>? progressCallback = null;
            if (!string.IsNullOrEmpty(connectionId))
            {
                progressCallback = async (message, percentage) =>
                {
                    await _hubContext.Clients.Client(connectionId)
                        .SendAsync("ReceiveProgress", message, percentage);
                };
                
                await progressCallback("Starting CSV analysis...", 0);
            }

            var stopwatch = Stopwatch.StartNew();

            var options = new SchemaGenerationOptions
            {
                ClassName = className ?? "CsvData",
                Namespace = namespaceName ?? "GeneratedModels",
                UseRecords = useRecords,
                IncludeDataAnnotations = includeDataAnnotations,
                MaxRowsToAnalyze = 10000
            };

            // Analyze CSV
            Dictionary<string, CsvColumnAnalysis> columnAnalyses;
            
            await using (var stream = file.OpenReadStream())
            {
                columnAnalyses = await _csvParser.AnalyzeCsvAsync(stream, options, null, progressCallback);
            }

            // Count total rows
            int totalRows = 0;
            await using (var stream = file.OpenReadStream())
            {
                using var reader = new StreamReader(stream);
                totalRows = -1; // Don't count header
                while (await reader.ReadLineAsync() != null)
                    totalRows++;
                totalRows = Math.Max(0, totalRows);
            }

            // Generate schema
            if (progressCallback != null)
                await progressCallback("Generating C# schema code...", 90);
            
            var generatedCode = _schemaGenerator.GenerateSchema(columnAnalyses, options);
            
            if (progressCallback != null)
                await progressCallback("Schema generation complete!", 100);

            stopwatch.Stop();

            var result = new SchemaGenerationResult
            {
                GeneratedCode = generatedCode,
                TotalRows = totalRows,
                AnalyzedRows = columnAnalyses.Values.FirstOrDefault()?.TotalValues ?? 0,
                ProcessingTimeMs = stopwatch.Elapsed.TotalMilliseconds,
                Columns = columnAnalyses.Values.Select(a => new ColumnInfo
                {
                    ColumnName = a.ColumnName,
                    PropertyName = ToPascalCase(a.ColumnName),
                    InferredType = a.InferredType.Name,
                    IsNullable = a.IsNullable,
                    ConfidenceScore = a.ConfidenceScore,
                    DistinctValues = a.DistinctValues.Count
                }).ToList()
            };

            _logger.LogInformation(
                "Analyzed CSV: {FileName}, Rows: {TotalRows}, Time: {Time}ms",
                file.FileName, totalRows, result.ProcessingTimeMs);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing CSV");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    private string ToPascalCase(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return "Property";

        var words = System.Text.RegularExpressions.Regex.Split(input, @"[^a-zA-Z0-9]+")
            .Where(w => !string.IsNullOrWhiteSpace(w))
            .Select(w => char.ToUpper(w[0]) + w.Substring(1).ToLower());

        var result = string.Join("", words);

        if (string.IsNullOrEmpty(result) || !char.IsLetter(result[0]))
            result = "Property" + result;

        return result;
    }
}

