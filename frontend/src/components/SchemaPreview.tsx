import { SchemaGenerationResult } from '../types';
import './SchemaPreview.css';

interface SchemaPreviewProps {
  result: SchemaGenerationResult;
  fileName: string;
}

function SchemaPreview({ result, fileName }: SchemaPreviewProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.generatedCode);
      alert('Code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([result.generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace('.csv', '.cs');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="schema-preview">
      <div className="preview-header">
        <div className="preview-title">
          <h3>✨ Generated C# Schema</h3>
          <div className="stats">
            <span className="stat">
              <strong>{result.totalRows.toLocaleString()}</strong> rows
            </span>
            <span className="stat">
              <strong>{result.analyzedRows.toLocaleString()}</strong> analyzed
            </span>
            <span className="stat">
              <strong>{result.processingTimeMs.toFixed(0)}ms</strong> processing time
            </span>
          </div>
        </div>
        <div className="preview-actions">
          <button className="action-btn" onClick={handleCopy} title="Copy to clipboard">
            📋 Copy
          </button>
          <button className="action-btn" onClick={handleDownload} title="Download as .cs file">
            💾 Download
          </button>
        </div>
      </div>

      <div className="column-info">
        <h4>Column Analysis ({result.columns.length} columns)</h4>
        <div className="columns-grid">
          {result.columns.map((col, idx) => (
            <div key={idx} className="column-card">
              <div className="column-name">{col.columnName}</div>
              <div className="column-type">
                {col.inferredType}{col.isNullable ? '?' : ''}
              </div>
              <div className="column-meta">
                <span className="confidence" title="Type inference confidence">
                  {(col.confidenceScore * 100).toFixed(0)}% confidence
                </span>
                <span className="distinct" title="Distinct values">
                  {col.distinctValues} distinct
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="code-container">
        <pre>
          <code className="csharp">{result.generatedCode}</code>
        </pre>
      </div>
    </div>
  );
}

export default SchemaPreview;

