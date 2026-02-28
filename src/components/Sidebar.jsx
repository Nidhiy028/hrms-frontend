import { NavLink, useLocation } from 'react-router-dom';

const links = [
  { to: '/',            icon: '◈', label: 'Dashboard' },
  { to: '/employees',   icon: '⬡', label: 'Employees' },
  { to: '/attendance',  icon: '◷', label: 'Attendance' },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <div className="brand-icon">🏢</div>
          <span className="brand-name">HRMS Lite</span>
        </div>
        <div className="brand-sub">Admin Portal</div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main</div>
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              'nav-link' + (isActive && (to === '/' ? pathname === '/' : true) ? ' active' : '')
            }
            end={to === '/'}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        v1.0.0 · HRMS Lite
      </div>
    </aside>
  );
}
