import { useState } from 'react';
import FileUploader from './components/FileUploader';
import ConfigurationPanel from './components/ConfigurationPanel';
import SchemaPreview from './components/SchemaPreview';
import { analyzeCsv } from './api';
import { SchemaGenerationResult, SchemaGenerationOptions } from './types';
import './App.css';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [options, setOptions] = useState<SchemaGenerationOptions>({
    className: 'CsvData',
    namespaceName: 'GeneratedModels',
    useRecords: false,
    includeDataAnnotations: true,
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<SchemaGenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await analyzeCsv(file, options, (progress) => {
        setProgress(progress);
      });
      setResult(result);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📊 CSV to C# Schema Generator</h1>
        <p>Upload your CSV file and get a perfect C# class schema instantly</p>
      </header>

      <div className="app-content">
        <div className="left-panel">
          <FileUploader onFileSelect={handleFileSelect} />
          
          {file && (
            <>
              <ConfigurationPanel options={options} onChange={setOptions} />
              
              <button
                className="analyze-btn"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? `Analyzing... ${progress}%` : 'Generate Schema'}
              </button>
            </>
          )}

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        <div className="right-panel">
          {result && (
            <SchemaPreview result={result} fileName={file?.name || 'file.csv'} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

