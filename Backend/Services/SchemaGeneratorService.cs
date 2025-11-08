using System.Text;
using System.Text.RegularExpressions;
using Backend.Models;

namespace Backend.Services;

public class SchemaGeneratorService
{
    private readonly TypeInferenceService _typeInference;

    public SchemaGeneratorService(TypeInferenceService typeInference)
    {
        _typeInference = typeInference;
    }

    public string GenerateSchema(
        Dictionary<string, CsvColumnAnalysis> columnAnalyses,
        SchemaGenerationOptions options)
    {
        var sb = new StringBuilder();

        // Add usings
        sb.AppendLine("using System;");
        if (options.IncludeDataAnnotations)
        {
            sb.AppendLine("using System.ComponentModel.DataAnnotations;");
        }
        sb.AppendLine();

        // Add namespace
        sb.AppendLine($"namespace {options.Namespace};");
        sb.AppendLine();

        // Add class/record declaration
        var typeKeyword = options.UseRecords ? "record" : "class";
        sb.AppendLine($"public {typeKeyword} {options.ClassName}");
        sb.AppendLine("{");

        // Generate properties
        foreach (var kvp in columnAnalyses)
        {
            var columnName = kvp.Key;
            var analysis = kvp.Value;
            
            var propertyName = ToPascalCase(columnName);
            var csharpType = _typeInference.GetCSharpTypeName(analysis.InferredType, analysis.IsNullable);

            // Add XML documentation comment
            sb.AppendLine($"    /// <summary>");
            sb.AppendLine($"    /// Column: {columnName}");
            sb.AppendLine($"    /// Type: {csharpType} (Confidence: {analysis.ConfidenceScore:P0})");
            sb.AppendLine($"    /// Distinct Values: {analysis.DistinctValues.Count}");
            sb.AppendLine($"    /// </summary>");

            // Add data annotations if enabled
            if (options.IncludeDataAnnotations)
            {
                // Add Required attribute if not nullable
                if (!analysis.IsNullable && analysis.InferredType == typeof(string))
                {
                    sb.AppendLine($"    [Required]");
                }

                // Add Display attribute with original column name
                if (propertyName != columnName)
                {
                    sb.AppendLine($"    [Display(Name = \"{columnName}\")]");
                }
            }

            // Add property
            if (options.UseRecords)
            {
                // Record properties are immutable by default
                sb.AppendLine($"    public {csharpType} {propertyName} {{ get; init; }}");
            }
            else
            {
                // Regular class with get/set
                sb.AppendLine($"    public {csharpType} {propertyName} {{ get; set; }}");
            }

            sb.AppendLine();
        }

        sb.AppendLine("}");

        return sb.ToString();
    }

    private string ToPascalCase(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return "Property";

        // Remove special characters and split by various delimiters
        var words = Regex.Split(input, @"[^a-zA-Z0-9]+")
            .Where(w => !string.IsNullOrWhiteSpace(w))
            .Select(w => char.ToUpper(w[0]) + w.Substring(1).ToLower());

        var result = string.Join("", words);

        // Ensure it starts with a letter
        if (string.IsNullOrEmpty(result) || !char.IsLetter(result[0]))
        {
            result = "Property" + result;
        }

        return result;
    }
}

