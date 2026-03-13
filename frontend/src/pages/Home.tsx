import { Link } from 'react-router-dom';
import AdSense from '../components/AdSense';
import Seo from '../components/Seo';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <Seo
        title="Parallel Lab Tools | Developer Utilities and Azure Practice Simulators"
        description="Parallel Lab Tools offers developer productivity tools and Azure practice simulators, including CSV to C# generation plus AZ-305 and AZ-700 mock assessments."
        path="/"
        keywords="developer tools, CSV to C#, Azure practice simulator, AZ-305, AZ-700"
      />

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-logo">🔨</div>
          <h1 className="hero-title">Parallel Lab Tools</h1>
          <p className="hero-subtitle">Forging Productivity Tools for Modern Software Engineers</p>
          <div className="hero-actions">
            <Link to="/tools" className="hero-btn primary">
              Explore Tools
            </Link>
            <Link to="/csv-to-csharp" className="hero-btn secondary">
              Try CSV to C#
            </Link>
            <Link to="/practice-simulators" className="hero-btn secondary">
              Practice AZ Exams
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <h2>Why Developers Choose Parallel Lab Tools</h2>
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
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>Exam-Focused Practice</h3>
              <p>Dedicated AZ-305 and AZ-700 simulator routes with instant feedback and topic summaries</p>
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

      <section className="featured-tool-section">
        <div className="featured-container">
          <div className="featured-badge">New Feature</div>
          <h2>🧭 Azure Practice Simulators</h2>
          <p className="featured-description">
            Study Azure architecture and networking with dedicated AZ-305 and AZ-700 practice routes that keep
            explanations, answer checks, and topic scorecards in one flow.
          </p>
          <div className="featured-stats">
            <div className="stat-item">
              <div className="stat-value">2</div>
              <div className="stat-label">Exam Routes</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">291</div>
              <div className="stat-label">Question Pool</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">1</div>
              <div className="stat-label">Answer Loop</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">6+</div>
              <div className="stat-label">Topic Buckets</div>
            </div>
          </div>
          <Link to="/practice-simulators" className="featured-button">
            Explore Simulators →
          </Link>
        </div>
      </section>

      <AdSense format="horizontal" className="home-ad-bottom" />

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


