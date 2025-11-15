import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AllTools from './pages/AllTools';
import CsvToCSharp from './pages/CsvToCSharp';
import About from './components/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<AllTools />} />
            <Route path="/csv-to-csharp" element={<CsvToCSharp />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <div className="footer-content">
            <p>© 2024 DevToolsmith - Forging Tools for Developers</p>
            <div className="footer-links">
              <a href="/privacy">Privacy Policy</a>
              <span className="separator">•</span>
              <a href="/about">About</a>
              <span className="separator">•</span>
              <a href="mailto:hello@devtoolsmith.dev">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

