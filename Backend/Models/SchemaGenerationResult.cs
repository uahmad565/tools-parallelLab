namespace Backend.Models;

public class SchemaGenerationResult
{
    public string GeneratedCode { get; set; } = string.Empty;
    public string ClassMapCode { get; set; } = string.Empty;
    public int TotalRows { get; set; }
    public int AnalyzedRows { get; set; }
    public List<ColumnInfo> Columns { get; set; } = new();
    public double ProcessingTimeMs { get; set; }
}

public class ColumnInfo
{
    public string ColumnName { get; set; } = string.Empty;
    public string PropertyName { get; set; } = string.Empty;
    public string InferredType { get; set; } = string.Empty;
    public bool IsNullable { get; set; }
    public double ConfidenceScore { get; set; }
    public int DistinctValues { get; set; }
}

