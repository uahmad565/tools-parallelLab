namespace Backend.Models;

public class SchemaGenerationOptions
{
    public string ClassName { get; set; } = "CsvData";
    public string Namespace { get; set; } = "GeneratedModels";
    public bool UseNullableReferenceTypes { get; set; } = true;
    public bool UseRecords { get; set; } = false;
    public bool IncludeDataAnnotations { get; set; } = true;
    public int MaxRowsToAnalyze { get; set; } = 10000; // For smart sampling
}

