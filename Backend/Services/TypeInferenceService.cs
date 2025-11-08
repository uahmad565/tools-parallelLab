using System.Globalization;
using Backend.Models;

namespace Backend.Services;

public class TypeInferenceService
{
    private static readonly Type[] TypeHierarchy = 
    {
        typeof(bool),
        typeof(int),
        typeof(long),
        typeof(decimal),
        typeof(double),
        typeof(DateTime),
        typeof(Guid),
        typeof(string)
    };

    public Type InferType(CsvColumnAnalysis analysis)
    {
        if (analysis.TotalValues == 0)
            return typeof(string);

        // If all values are null/empty, default to nullable string
        if (analysis.NullOrEmptyCount == analysis.TotalValues)
        {
            analysis.IsNullable = true;
            return typeof(string);
        }

        // Calculate confidence and find best type
        var bestType = typeof(string);
        var highestSuccessRate = 0.0;

        foreach (var type in TypeHierarchy)
        {
            if (analysis.TypeSuccesses.TryGetValue(type, out var successCount))
            {
                var nonNullCount = analysis.TotalValues - analysis.NullOrEmptyCount;
                var successRate = (double)successCount / nonNullCount;

                if (successRate > highestSuccessRate)
                {
                    highestSuccessRate = successRate;
                    bestType = type;
                }
            }
        }

        // Set confidence score
        analysis.ConfidenceScore = highestSuccessRate;
        
        // If confidence is high enough (>= 95%), use that type
        if (highestSuccessRate >= 0.95)
        {
            analysis.InferredType = bestType;
        }
        else
        {
            // Fall back to string for low confidence
            analysis.InferredType = typeof(string);
            analysis.ConfidenceScore = 1.0;
        }

        // Determine nullability
        analysis.IsNullable = analysis.NullOrEmptyCount > 0;

        return analysis.InferredType;
    }

    public void AnalyzeValue(string value, CsvColumnAnalysis analysis)
    {
        analysis.TotalValues++;

        // Track distinct values (limit to avoid memory issues)
        if (analysis.DistinctValues.Count < 1000)
        {
            analysis.DistinctValues.Add(value);
        }

        if (string.IsNullOrWhiteSpace(value))
        {
            analysis.NullOrEmptyCount++;
            return;
        }

        // Try parsing in type hierarchy order
        if (TryParseBool(value))
            IncrementTypeSuccess(analysis, typeof(bool));
        
        if (int.TryParse(value, out _))
            IncrementTypeSuccess(analysis, typeof(int));
        
        if (long.TryParse(value, out _))
            IncrementTypeSuccess(analysis, typeof(long));
        
        if (decimal.TryParse(value, NumberStyles.Number, CultureInfo.InvariantCulture, out _))
            IncrementTypeSuccess(analysis, typeof(decimal));
        
        if (double.TryParse(value, NumberStyles.Float | NumberStyles.AllowThousands, CultureInfo.InvariantCulture, out _))
            IncrementTypeSuccess(analysis, typeof(double));
        
        if (TryParseDateTime(value))
            IncrementTypeSuccess(analysis, typeof(DateTime));
        
        if (Guid.TryParse(value, out _))
            IncrementTypeSuccess(analysis, typeof(Guid));

        // String always succeeds
        IncrementTypeSuccess(analysis, typeof(string));
    }

    private bool TryParseBool(string value)
    {
        var lower = value.ToLowerInvariant().Trim();
        return lower is "true" or "false" or "yes" or "no" or "1" or "0" or "y" or "n";
    }

    private bool TryParseDateTime(string value)
    {
        // Try common date formats
        return DateTime.TryParse(value, CultureInfo.InvariantCulture, DateTimeStyles.None, out _) ||
               DateTime.TryParseExact(value, new[] 
               { 
                   "yyyy-MM-dd", 
                   "MM/dd/yyyy", 
                   "dd/MM/yyyy",
                   "yyyy-MM-dd HH:mm:ss",
                   "MM/dd/yyyy HH:mm:ss"
               }, CultureInfo.InvariantCulture, DateTimeStyles.None, out _);
    }

    private void IncrementTypeSuccess(CsvColumnAnalysis analysis, Type type)
    {
        if (!analysis.TypeSuccesses.ContainsKey(type))
        {
            analysis.TypeSuccesses[type] = 0;
        }
        analysis.TypeSuccesses[type]++;
    }

    public string GetCSharpTypeName(Type type, bool isNullable)
    {
        var typeName = type.Name switch
        {
            "Boolean" => "bool",
            "Int32" => "int",
            "Int64" => "long",
            "Decimal" => "decimal",
            "Double" => "double",
            "DateTime" => "DateTime",
            "Guid" => "Guid",
            "String" => "string",
            _ => type.Name
        };

        // Add nullable modifier for value types
        if (isNullable && type.IsValueType)
        {
            typeName += "?";
        }

        return typeName;
    }
}

