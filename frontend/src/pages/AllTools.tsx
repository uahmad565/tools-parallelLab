import { Link } from 'react-router-dom';
import AdSense from '../components/AdSense';
import Seo from '../components/Seo';
import './AllTools.css';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  status: 'active' | 'coming-soon';
  features: string[];
}

const tools: Tool[] = [
  {
    id: 'azure-practice-simulators',
    name: 'Azure Practice Simulators',
    description: 'Dedicated AZ-305 and AZ-700 practice routes with instant answer feedback, rationale review, and topic-based score summaries.',
    icon: '🧠',
    route: '/practice-simulators',
    status: 'active',
    features: [
      'AZ-305 architecture practice',
      'AZ-700 networking practice',
      'Question-by-question feedback',
      'Topic score breakdowns',
      'Role-based landing pages',
      'No login required'
    ]
  },
  {
    id: 'csv-to-csharp',
    name: 'CSV to C# Schema Generator',
    description: 'Transform massive CSV files into perfectly typed C# classes instantly. Supports files up to 5GB with smart sampling and real-time progress tracking.',
    icon: '📊',
    route: '/csv-to-csharp',
    status: 'active',
    features: [
      'Smart type inference (8+ types)',
      'Handles files up to 5GB',
      'Real-time SignalR progress',
      'Data annotations support',
      'C# Records & nullable types',
      '95%+ accuracy with confidence scoring'
    ]
  },
  {
    id: 'auth-flows-learning',
    name: 'Auth Flows Learning Studio',
    description: 'Interactive visual walkthroughs for password login, OAuth 2.0, OpenID Connect, and client credentials with clear step-by-step explanations.',
    icon: '🔐',
    route: '/auth-flows-learning',
    status: 'active',
    features: [
      'Password and OAuth flow comparison',
      'OpenID Connect identity walkthrough',
      'Client credentials machine-to-machine flow',
      'Animated request direction cues',
      'Token purpose breakdowns',
      'No login required'
    ]
  },
  {
    id: 'json-to-typescript',
    name: 'JSON to TypeScript',
    description: 'Generate TypeScript interfaces from JSON objects with support for nested types, arrays, and unions.',
    icon: '📄',
    route: '/json-to-typescript',
    status: 'coming-soon',
    features: [
      'Nested type detection',
      'Array and union types',
      'Optional fields',
      'Type aliases'
    ]
  },
  {
    id: 'sql-to-entity',
    name: 'SQL Table to Entity',
    description: 'Convert database schemas to Entity Framework Core models with navigation properties and relationships.',
    icon: '🗄️',
    route: '/sql-to-entity',
    status: 'coming-soon',
    features: [
      'Foreign key detection',
      'Navigation properties',
      'Data annotations',
      'Fluent API configuration'
    ]
  },
  {
    id: 'api-mock',
    name: 'API Mock Generator',
    description: 'Create mock REST APIs from OpenAPI/Swagger specifications with realistic data generation.',
    icon: '🔄',
    route: '/api-mock',
    status: 'coming-soon',
    features: [
      'OpenAPI 3.0 support',
      'Realistic mock data',
      'Custom response rules',
      'Export as JSON server'
    ]
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester Pro',
    description: 'Visual regex builder with real-time testing, match highlighting, and plain English explanations.',
    icon: '🎨',
    route: '/regex-tester',
    status: 'coming-soon',
    features: [
      'Visual regex builder',
      'Match highlighting',
      'Performance analysis',
      'Library of common patterns'
    ]
  },
  {
    id: 'base64-tools',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings with support for files, images, and binary data.',
    icon: '🔐',
    route: '/base64-tools',
    status: 'coming-soon',
    features: [
      'Text encoding/decoding',
      'File support',
      'Image preview',
      'URL-safe encoding'
    ]
  }
];

function AllTools() {
  return (
    <div className="all-tools-page">
      <Seo
        title="All Tools | Parallel Lab Tools"
        description="Explore developer utilities and exam practice features from Parallel Lab Tools, including CSV to C# generation and Azure practice simulators."
        path="/tools"
        keywords="developer tools, Azure practice simulators, CSV to C#, productivity tools"
      />

      <div className="tools-header">
        <h1>🛠️ All Tools</h1>
        <p>Professional productivity tools for modern software engineers</p>
      </div>

      <div className="tools-grid">
        {tools.map((tool) => (
          <div key={tool.id} className={`tool-card ${tool.status}`}>
            {tool.status === 'coming-soon' && (
              <div className="coming-soon-badge">Coming Soon</div>
            )}
            
            <div className="tool-icon">{tool.icon}</div>
            
            <h2 className="tool-name">{tool.name}</h2>
            
            <p className="tool-description">{tool.description}</p>
            
            <div className="tool-features">
              <h4>Key Features:</h4>
              <ul>
                {tool.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
            
            {tool.status === 'active' ? (
              <Link to={tool.route} className="tool-button active-button">
                Launch Tool →
              </Link>
            ) : (
              <button className="tool-button disabled-button" disabled>
                Coming Soon
              </button>
            )}
          </div>
        ))}
      </div>

      <AdSense format="horizontal" className="tools-ad" />

      <div className="tools-footer">
        <div className="footer-suggestions">
          <h3>Have a tool idea?</h3>
          <p>We're always looking to add more productivity tools. Share your suggestions!</p>
          <a href="mailto:uahmad565565@gmail.com" className="cta-button">
            Suggest a Tool
          </a>
        </div>
      </div>
    </div>
  );
}

export default AllTools;


