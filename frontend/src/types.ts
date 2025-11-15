export interface ColumnInfo {
  columnName: string;
  propertyName: string;
  inferredType: string;
  isNullable: boolean;
  confidenceScore: number;
  distinctValues: number;
}

export interface SchemaGenerationResult {
  generatedCode: string;
  classMapCode: string;
  totalRows: number;
  analyzedRows: number;
  columns: ColumnInfo[];
  processingTimeMs: number;
}

export interface SchemaGenerationOptions {
  className?: string;
  namespaceName?: string;
  useRecords?: boolean;
  includeDataAnnotations?: boolean;
}

