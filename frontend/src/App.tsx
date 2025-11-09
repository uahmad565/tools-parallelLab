import { useState, useEffect } from 'react';
import FileUploader from './components/FileUploader';
import ConfigurationPanel from './components/ConfigurationPanel';
import SchemaPreview from './components/SchemaPreview';
import { analyzeCsv } from './api';
import { SchemaGenerationResult, SchemaGenerationOptions } from './types';
import { useSignalR } from './hooks/useSignalR';
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingPhase, setProcessingPhase] = useState<'uploading' | 'processing'>('uploading');
  const [result, setResult] = useState<SchemaGenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { connection, isConnected, progress: signalRProgress, startConnection, stopConnection, resetProgress, connectionId } = useSignalR();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);
  };

  const estimateProcessingTime = (fileSize: number): number => {
    // Estimate based on file size
    // Small files: ~0.5s, Large files: ~3s
    const sizeMB = fileSize / (1024 * 1024);
    if (sizeMB < 50) return 1;
    if (sizeMB < 500) return 2;
    return 3;
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setUploadProgress(0);
    setProcessingPhase('uploading');
    resetProgress();

    try {
      // Start SignalR connection and get connectionId
      await startConnection();
      
      // Wait a moment to ensure connection is fully established
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get the connectionId after connection is established
      const currentConnectionId = connection?.connectionId;
      
      console.log('SignalR Connection ID:', currentConnectionId);
      
      const result = await analyzeCsv(file, options, (progress) => {
        setUploadProgress(progress);
        if (progress === 100) {
          setProcessingPhase('processing');
        }
      }, currentConnectionId);
      
      setResult(result);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'An error occurred');
    } finally {
      setLoading(false);
      setUploadProgress(0);
      await stopConnection();
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
                {loading ? (
                  processingPhase === 'uploading' 
                    ? `Uploading... ${uploadProgress}%` 
                    : signalRProgress.message || 'Processing...'
                ) : 'Generate Schema'}
              </button>
              
              {loading && (
                <div className="progress-info">
                  <div className="phase-info">
                    {processingPhase === 'uploading' ? (
                      <>📤 Uploading file to server...</>
                    ) : (
                      <>⚙️ {signalRProgress.message || 'Processing...'}</>
                    )}
                  </div>
                  
                  {processingPhase === 'uploading' && (
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  )}
                  
                  {processingPhase === 'processing' && (
                    <>
                      <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${signalRProgress.percentage}%` }}></div>
                      </div>
                      <div className="processing-details">
                        <span className="percentage">{signalRProgress.percentage}%</span>
                        <span className="status">{signalRProgress.message}</span>
                      </div>
                    </>
                  )}
                </div>
              )}
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

