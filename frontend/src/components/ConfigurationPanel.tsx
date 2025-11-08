import { SchemaGenerationOptions } from '../types';
import './ConfigurationPanel.css';

interface ConfigurationPanelProps {
  options: SchemaGenerationOptions;
  onChange: (options: SchemaGenerationOptions) => void;
}

function ConfigurationPanel({ options, onChange }: ConfigurationPanelProps) {
  const handleChange = (key: keyof SchemaGenerationOptions, value: any) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="config-panel">
      <h3>⚙️ Configuration</h3>
      
      <div className="form-group">
        <label htmlFor="className">Class Name</label>
        <input
          id="className"
          type="text"
          value={options.className || ''}
          onChange={(e) => handleChange('className', e.target.value)}
          placeholder="CsvData"
        />
      </div>

      <div className="form-group">
        <label htmlFor="namespace">Namespace</label>
        <input
          id="namespace"
          type="text"
          value={options.namespaceName || ''}
          onChange={(e) => handleChange('namespaceName', e.target.value)}
          placeholder="GeneratedModels"
        />
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={options.useRecords || false}
            onChange={(e) => handleChange('useRecords', e.target.checked)}
          />
          <span>Use Records (C# 9+)</span>
        </label>
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={options.includeDataAnnotations ?? true}
            onChange={(e) => handleChange('includeDataAnnotations', e.target.checked)}
          />
          <span>Include Data Annotations</span>
        </label>
      </div>
    </div>
  );
}

export default ConfigurationPanel;

