using System.Globalization;
using CsvHelper;
using CsvHelper.Configuration;
using Backend.Models;

namespace Backend.Services;

public class CsvParserService
{
    private readonly TypeInferenceService _typeInference;
    private const int SmallFileThreshold = 10000;

    public CsvParserService(TypeInferenceService typeInference)
    {
        _typeInference = typeInference;
    }

    public async Task<Dictionary<string, CsvColumnAnalysis>> AnalyzeCsvAsync(
        Stream csvStream, 
        SchemaGenerationOptions options,
        IProgress<int>? progress = null)
    {
        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = true,
            MissingFieldFound = null,
            BadDataFound = null
        };

        using var reader = new StreamReader(csvStream);
        using var csv = new CsvReader(reader, config);

        // Read header
        await csv.ReadAsync();
        csv.ReadHeader();
        var headers = csv.HeaderRecord ?? Array.Empty<string>();

        // Initialize column analysis
        var columnAnalyses = headers.ToDictionary(
            h => h,
            h => new CsvColumnAnalysis { ColumnName = h }
        );

        // Count total rows (quick pass)
        var totalRows = await CountRowsAsync(csvStream);
        csvStream.Position = 0; // Reset stream

        // Reinitialize reader after counting
        using var reader2 = new StreamReader(csvStream);
        using var csv2 = new CsvReader(reader2, config);
        
        await csv2.ReadAsync();
        csv2.ReadHeader();

        // Determine sampling strategy
        bool useSmartSampling = totalRows > SmallFileThreshold;
        int rowsToAnalyze = useSmartSampling 
            ? Math.Min(options.MaxRowsToAnalyze, totalRows) 
            : totalRows;

        int samplingInterval = useSmartSampling 
            ? Math.Max(1, totalRows / rowsToAnalyze) 
            : 1;

        int currentRow = 0;
        int analyzedRows = 0;

        // Analyze rows
        while (await csv2.ReadAsync())
        {
            currentRow++;

            // Smart sampling logic
            bool shouldAnalyze = !useSmartSampling || 
                                 currentRow <= 5000 || // Always analyze first 5000
                                 currentRow % samplingInterval == 0 || // Sample every Nth row
                                 currentRow > (totalRows - 1000); // Always analyze last 1000

            if (shouldAnalyze)
            {
                foreach (var header in headers)
                {
                    var value = csv2.GetField(header) ?? string.Empty;
                    _typeInference.AnalyzeValue(value, columnAnalyses[header]);
                }
                analyzedRows++;
            }

            // Report progress
            if (currentRow % 1000 == 0)
            {
                var progressPercent = (int)((double)currentRow / totalRows * 100);
                progress?.Report(progressPercent);
            }

            // Safety limit
            if (analyzedRows >= rowsToAnalyze)
                break;
        }

        // Infer types for all columns
        foreach (var analysis in columnAnalyses.Values)
        {
            _typeInference.InferType(analysis);
        }

        progress?.Report(100);

        return columnAnalyses;
    }

    private async Task<int> CountRowsAsync(Stream stream)
    {
        stream.Position = 0;
        using var reader = new StreamReader(stream, leaveOpen: true);
        
        int count = -1; // Don't count header
        while (await reader.ReadLineAsync() != null)
        {
            count++;
        }

        return Math.Max(0, count);
    }
}

