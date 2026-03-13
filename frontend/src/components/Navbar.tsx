import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  const isActive = (...paths: string[]) => {
    return paths.includes(location.pathname) ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-logo">🔨</span>
          <span className="brand-name">ParallelLabTools</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/tools" className={`nav-item ${isActive('/tools')}`}>
            All Tools
          </Link>
          <Link
            to="/practice-simulators"
            className={`nav-item ${isActive('/practice-simulators', '/az-305-practice-simulator', '/az-700-practice-simulator')}`}
          >
            Practice Exams
          </Link>
          <Link to="/csv-to-csharp" className={`nav-item ${isActive('/csv-to-csharp')}`}>
            CSV to C#
          </Link>
          <Link to="/about" className={`nav-item ${isActive('/about')}`}>
            About
          </Link>
          <Link to="/privacy" className={`nav-item ${isActive('/privacy')}`}>
            Privacy
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


