namespace Backend.Models;

public class CsvColumnAnalysis
{
    public string ColumnName { get; set; } = string.Empty;
    public int TotalValues { get; set; }
    public int NullOrEmptyCount { get; set; }
    public HashSet<string> DistinctValues { get; set; } = new();
    public Dictionary<Type, int> TypeSuccesses { get; set; } = new();
    
    public Type InferredType { get; set; } = typeof(string);
    public bool IsNullable { get; set; }
    public double ConfidenceScore { get; set; }
}

