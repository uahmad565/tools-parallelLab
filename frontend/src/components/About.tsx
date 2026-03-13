import './About.css';
import Seo from './Seo';

function About() {
  return (
    <div className="about-container">
      <Seo
        title="About Parallel Lab Tools"
        description="Learn about Parallel Lab Tools, including developer utilities and Azure practice simulator features."
        path="/about"
        keywords="about Parallel Lab Tools, Azure practice simulators, developer tools"
      />

      <div className="about-hero">
        <div className="logo-container">
          <span className="logo-icon">🔨</span>
          <h1 className="brand-name">ParallelLabTools</h1>
        </div>
        <p className="tagline">Forging Productivity Tools for Modern Software Engineers</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>🎯 Our Mission</h2>
          <p>
            Parallel Lab Tools is dedicated to creating powerful, efficient tools that save developers time 
            and eliminate repetitive tasks. We believe every minute saved on mundane work is a minute 
            gained for innovation and creativity.
          </p>
        </section>

        <section className="about-section">
          <h2>🛠️ Current Tools</h2>
          <div className="tools-grid">
            <div className="tool-card">
              <div className="tool-icon">📊</div>
              <h3>CSV to C# Schema Generator</h3>
              <p>
                Transform massive CSV files into perfectly typed C# classes instantly. 
                Supports files up to 5GB with smart sampling and real-time progress tracking.
              </p>
              <ul className="tool-features">
                <li>✅ Smart type inference (8+ types)</li>
                <li>✅ Handles multi-GB files</li>
                <li>✅ Real-time SignalR progress</li>
                <li>✅ Data annotations support</li>
                <li>✅ Records & nullable types</li>
              </ul>
            </div>

            <div className="tool-card">
              <div className="tool-icon">🧠</div>
              <h3>Azure Practice Simulators</h3>
              <p>
                Study AZ-305 and AZ-700 with dedicated practice routes, instant answer validation,
                rationale review, and topic-based performance summaries.
              </p>
              <ul className="tool-features">
                <li>✅ AZ-305 architecture practice</li>
                <li>✅ AZ-700 networking practice</li>
                <li>✅ Question-by-question feedback</li>
                <li>✅ Topic scorecards</li>
                <li>✅ No registration required</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>💡 Why Parallel Lab Tools?</h2>
          <div className="features-grid">
            <div className="feature-box">
              <h3>⚡ Lightning Fast</h3>
              <p>Optimized algorithms process millions of rows in seconds</p>
            </div>
            <div className="feature-box">
              <h3>🎯 Developer-Focused</h3>
              <p>Built by developers, for developers. We understand your workflow</p>
            </div>
            <div className="feature-box">
              <h3>🔓 Free & Open</h3>
              <p>All tools are free to use with no registration required</p>
            </div>
            <div className="feature-box">
              <h3>🚀 Modern Tech</h3>
              <p>Powered by React, .NET Core, SignalR, and containerized for reliability</p>
            </div>
            <div className="feature-box">
              <h3>🔒 Privacy First</h3>
              <p>Your data is processed in real-time and never stored</p>
            </div>
            <div className="feature-box">
              <h3>📈 Always Improving</h3>
              <p>Continuously updated with new features and optimizations</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>🔮 Coming Soon</h2>
          <div className="roadmap">
            <div className="roadmap-item">
              <span className="roadmap-icon">📄</span>
              <div>
                <h4>JSON to TypeScript</h4>
                <p>Generate TypeScript interfaces from JSON with nested types</p>
              </div>
            </div>
            <div className="roadmap-item">
              <span className="roadmap-icon">🗄️</span>
              <div>
                <h4>SQL Table to Entity</h4>
                <p>Convert database schemas to Entity Framework models</p>
              </div>
            </div>
            <div className="roadmap-item">
              <span className="roadmap-icon">🔄</span>
              <div>
                <h4>API Mock Generator</h4>
                <p>Create mock APIs from OpenAPI/Swagger specs</p>
              </div>
            </div>
            <div className="roadmap-item">
              <span className="roadmap-icon">🎨</span>
              <div>
                <h4>Regex Tester Pro</h4>
                <p>Visual regex builder with real-time testing and explanations</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section tech-section">
          <h2>⚙️ Technology Stack</h2>
          <div className="tech-stack">
            <div className="tech-category">
              <h4>Frontend</h4>
              <ul>
                <li>React 18</li>
                <li>TypeScript</li>
                <li>Vite</li>
                <li>SignalR Client</li>
              </ul>
            </div>
            <div className="tech-category">
              <h4>Backend</h4>
              <ul>
                <li>ASP.NET Core 9.0</li>
                <li>C# 12</li>
                <li>SignalR</li>
                <li>CsvHelper</li>
              </ul>
            </div>
            <div className="tech-category">
              <h4>Infrastructure</h4>
              <ul>
                <li>Docker (Linux)</li>
                <li>Multi-stage builds</li>
                <li>WebSocket support</li>
                <li>CORS configured</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="about-section contact-section">
          <h2>📬 Contact & Contribute</h2>
          <div className="contact-content">
            <div className="contact-box">
              <h3>💌 Feedback & Suggestions</h3>
              <p>
                Have ideas for new tools? Found a bug? We'd love to hear from you!
              </p>
              <a href="mailto:hello@devtoolsmith.dev" className="contact-link">
                hello@devtoolsmith.dev
              </a>
            </div>

            <div className="contact-box">
              <h3>🐛 Report Issues</h3>
              <p>
                Encountered a problem? Let us know so we can fix it quickly.
              </p>
              <a href="mailto:support@devtoolsmith.dev" className="contact-link">
                support@devtoolsmith.dev
              </a>
            </div>

            <div className="contact-box">
              <h3>💼 Partnership</h3>
              <p>
                Interested in collaboration or enterprise solutions?
              </p>
              <a href="mailto:partnerships@devtoolsmith.dev" className="contact-link">
                partnerships@devtoolsmith.dev
              </a>
            </div>

            <div className="contact-box">
              <h3>🤝 Contribute</h3>
              <p>
                Want to contribute code or ideas? We welcome open-source contributions!
              </p>
              <a href="https://github.com/devtoolsmith" className="contact-link" target="_blank" rel="noopener noreferrer">
                GitHub Repository
              </a>
            </div>
          </div>
        </section>

        <section className="about-section stats-section">
          <h2>📊 Stats</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-number">5GB</div>
              <div className="stat-label">Max File Size</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">~2s</div>
              <div className="stat-label">Processing Time</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">8+</div>
              <div className="stat-label">Type Detection</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">95%+</div>
              <div className="stat-label">Accuracy</div>
            </div>
          </div>
        </section>

        <section className="about-section footer-section">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="logo-icon">🔨</span>
              <span className="brand-name-small">ParallelLabTools</span>
            </div>
            <p className="footer-tagline">
              Crafting Tools that Make Developers' Lives Easier
            </p>
            <p className="footer-copyright">
              © 2024 Parallel Lab Tools. Built with ❤️ for the developer community.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;

