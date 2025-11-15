import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-logo">🔨</div>
          <h1 className="hero-title">DevToolsmith</h1>
          <p className="hero-subtitle">Forging Productivity Tools for Modern Software Engineers</p>
          <div className="hero-actions">
            <Link to="/tools" className="hero-btn primary">
              Explore Tools
            </Link>
            <Link to="/csv-to-csharp" className="hero-btn secondary">
              Try CSV to C#
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <h2>Why Developers Choose DevToolsmith</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Process millions of rows in seconds with intelligent algorithms</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Privacy First</h3>
              <p>Your data is processed in real-time and never stored</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Modern Stack</h3>
              <p>Built with React, .NET Core, Docker, and SignalR</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔓</div>
              <h3>Free Forever</h3>
              <p>No registration, no payment, no strings attached</p>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-tool-section">
        <div className="featured-container">
          <div className="featured-badge">Featured Tool</div>
          <h2>📊 CSV to C# Schema Generator</h2>
          <p className="featured-description">
            Transform massive CSV files into perfectly typed C# classes instantly. 
            Smart sampling allows processing of files up to 5GB in just seconds.
          </p>
          <div className="featured-stats">
            <div className="stat-item">
              <div className="stat-value">5GB</div>
              <div className="stat-label">Max File Size</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">~2s</div>
              <div className="stat-label">Processing Time</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">95%+</div>
              <div className="stat-label">Accuracy</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">8+</div>
              <div className="stat-label">Type Detection</div>
            </div>
          </div>
          <Link to="/csv-to-csharp" className="featured-button">
            Launch Tool →
          </Link>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Boost Your Productivity?</h2>
          <p>Start using our tools today - no registration required</p>
          <Link to="/tools" className="cta-button">
            View All Tools
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;


