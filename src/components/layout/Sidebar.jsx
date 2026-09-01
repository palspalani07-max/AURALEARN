import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { NAV_ITEMS } from '../../utils/constants';
import * as Icons from 'lucide-react';
import { ChevronLeft } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  const { role } = useAuth();
  const { sidebarCollapsed, setSidebarCollapsed, mobileMenuOpen, closeMobileMenu, isMobile } = useTheme();
  const location = useLocation();

  const navItems = NAV_ITEMS[role] || NAV_ITEMS.student || [];

  const getIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent size={20} /> : <Icons.Circle size={20} />;
  };

  if (isMobile) {
    return (
      <>
        {mobileMenuOpen && (
          <div className="sidebar-backdrop" onClick={closeMobileMenu} />
        )}
        <aside className={`sidebar sidebar--mobile ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="sidebar__header">
            <span className="sidebar__title">Menu</span>
            <button className="btn-ghost btn-icon" onClick={closeMobileMenu}>
              <Icons.X size={20} />
            </button>
          </div>
          <nav className="sidebar__nav">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sidebar__item ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="sidebar__item-icon">{getIcon(item.icon)}</span>
                <span className="sidebar__item-label">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
      </>
    );
  }

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <nav className="sidebar__nav">
        {navItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar__item ${isActive ? 'active' : ''}`}
            title={sidebarCollapsed ? item.label : undefined}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <span className="sidebar__item-icon">{getIcon(item.icon)}</span>
            {!sidebarCollapsed && <span className="sidebar__item-label">{item.label}</span>}
            {!sidebarCollapsed && location.pathname === item.path && (
              <span className="sidebar__active-dot" />
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button
          className="sidebar__collapse-btn"
          onClick={() => setSidebarCollapsed(prev => !prev)}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft size={16} className={sidebarCollapsed ? 'rotated' : ''} />
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
