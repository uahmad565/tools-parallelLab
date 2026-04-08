import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AllTools from './pages/AllTools';
import CsvToCSharp from './pages/CsvToCSharp';
import PracticeSimulators from './pages/PracticeSimulators';
import ExamSimulatorPage from './pages/ExamSimulatorPage';
import About from './components/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AuthFlowsLearning from './pages/AuthFlowsLearning';
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
            <Route path="/practice-simulators" element={<PracticeSimulators />} />
            <Route path="/auth-flows-learning" element={<AuthFlowsLearning />} />
            <Route path="/az-305-practice-simulator" element={<ExamSimulatorPage examKey="az-305" />} />
            <Route path="/az-700-practice-simulator" element={<ExamSimulatorPage examKey="az-700" />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <div className="footer-content">
            <p>© 2024 Parallel Lab Tools - Forging Tools for Developers</p>
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

