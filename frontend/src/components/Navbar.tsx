import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

type NavItem = {
  description: string;
  label: string;
  matchPaths: string[];
  to: string;
};

type NavGroup = {
  id: string;
  items: NavItem[];
  label: string;
};

const standaloneLinks = [
  {
    label: 'About',
    to: '/about',
    matchPaths: ['/about'],
  },
  {
    label: 'Privacy',
    to: '/privacy',
    matchPaths: ['/privacy'],
  },
] as const;

const navGroups: NavGroup[] = [
  {
    id: 'tools',
    label: 'Tools',
    items: [
      {
        label: 'All Tools',
        to: '/tools',
        matchPaths: ['/tools'],
        description: 'Browse the full Parallel Lab Tools catalog.',
      },
      {
        label: 'CSV to C#',
        to: '/csv-to-csharp',
        matchPaths: ['/csv-to-csharp'],
        description: 'Generate typed C# models from large CSV files.',
      },
    ],
  },
  {
    id: 'learning',
    label: 'Learning',
    items: [
      {
        label: 'Auth Flows',
        to: '/auth-flows-learning',
        matchPaths: ['/auth-flows-learning'],
        description: 'Visual walkthroughs for OAuth, OIDC, and password login.',
      },
      {
        label: 'Practice Exams',
        to: '/practice-simulators',
        matchPaths: ['/practice-simulators', '/az-305-practice-simulator', '/az-700-practice-simulator'],
        description: 'Dedicated Azure practice routes with answer feedback.',
      },
    ],
  },
];

function Navbar() {
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);

  useEffect(() => {
    setOpenGroupId(null);
  }, [location.pathname]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenGroupId(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenGroupId(null);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isItemActive = (paths: string[]) => paths.includes(location.pathname);
  const isGroupActive = (group: NavGroup) => group.items.some((item) => isItemActive(item.matchPaths));

  const toggleGroup = (groupId: string) => {
    setOpenGroupId((current) => (current === groupId ? null : groupId));
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-logo">🔨</span>
          <span className="brand-name">ParallelLabTools</span>
        </Link>

        <div className="navbar-menu" ref={navRef}>
          {navGroups.map((group) => {
            const groupActive = isGroupActive(group);
            const isOpen = openGroupId === group.id;

            return (
              <div
                key={group.id}
                className={`nav-dropdown ${groupActive ? 'active' : ''} ${isOpen ? 'open' : ''}`}
                onMouseEnter={() => setOpenGroupId(group.id)}
                onMouseLeave={() => setOpenGroupId((current) => (current === group.id ? null : current))}
              >
                <button
                  type="button"
                  className="nav-dropdown-trigger"
                  aria-expanded={isOpen}
                  aria-haspopup="menu"
                  onClick={() => toggleGroup(group.id)}
                >
                  <span>{group.label}</span>
                  <span className="nav-dropdown-chevron" aria-hidden="true">
                    ▾
                  </span>
                </button>

                <div className="nav-dropdown-menu" role="menu">
                  {group.items.map((item) => {
                    const itemActive = isItemActive(item.matchPaths);

                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        role="menuitem"
                        className={`nav-dropdown-item ${itemActive ? 'active' : ''}`}
                        onClick={() => setOpenGroupId(null)}
                      >
                        <span className="nav-dropdown-item-title">{item.label}</span>
                        <span className="nav-dropdown-item-description">{item.description}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="navbar-links">
            {standaloneLinks.map((item) => {
              const itemActive = isItemActive([...item.matchPaths]);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`nav-link ${itemActive ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
