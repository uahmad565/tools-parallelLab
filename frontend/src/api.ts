import axios from 'axios';
import { SchemaGenerationResult, SchemaGenerationOptions } from './types';
import { config } from './config';

export const analyzeCsv = async (
  file: File,
  options: SchemaGenerationOptions,
  onProgress?: (progress: number) => void,
  connectionId?: string
): Promise<SchemaGenerationResult> => {
  const formData = new FormData();
  formData.append('file', file);
  
  if (options.className) {
    formData.append('className', options.className);
  }
  if (options.namespaceName) {
    formData.append('namespaceName', options.namespaceName);
  }
  formData.append('useRecords', String(options.useRecords || false));
  formData.append('includeDataAnnotations', String(options.includeDataAnnotations ?? true));
  
  if (connectionId) {
    formData.append('connectionId', connectionId);
  }

  const response = await axios.post<SchemaGenerationResult>(
    `${config.apiBaseUrl}/api/csv/analyze`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    }
  );

  return response.data;
};

