import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { NAV_ITEMS } from '../../utils/constants';
import * as Icons from 'lucide-react';
import './MobileNav.css';

export default function MobileNav() {
  const { role } = useAuth();

  const navItems = (NAV_ITEMS[role] || []).slice(0, 5); // Max 5 items for bottom nav

  const getIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent size={20} /> : <Icons.Circle size={20} />;
  };

  return (
    <nav className="mobile-nav hide-desktop">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `mobile-nav__item ${isActive ? 'active' : ''}`}
        >
          <span className="mobile-nav__icon">{getIcon(item.icon)}</span>
          <span className="mobile-nav__label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
