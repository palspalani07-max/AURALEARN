import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getInitials } from '../../utils/helpers';
import {
  Menu, Bell, Search, Flame, ChevronDown, LogOut,
  Settings, User, X
} from 'lucide-react';
import './Header.css';

export default function Header() {
  const { user, role, logout } = useAuth();
  const { toggleSidebar, isMobile } = useTheme();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const streak = 15; // TODO: compute from study_sessions
  const notifications = [
    { id: 1, text: 'Quiz results ready: DBMS Unit 3', time: '5m ago', unread: true },
    { id: 2, text: 'New study plan generated', time: '1h ago', unread: true },
    { id: 3, text: 'Exam in 5 days: Computer Networks', time: '3h ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn btn-ghost btn-icon" onClick={toggleSidebar} aria-label="Toggle menu">
          <Menu size={20} />
        </button>

        <div className="header__brand" onClick={() => navigate('/dashboard')}>
          <div className="header__logo">
            <span className="header__logo-icon">✦</span>
          </div>
          <span className="header__app-name">AURALEARN</span>
        </div>

        {!isMobile && (
          <div className={`header__search ${searchOpen ? 'open' : ''}`}>
            <Search size={16} className="header__search-icon" />
            <input
              type="text"
              placeholder="Search topics, documents..."
              className="header__search-input"
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setSearchOpen(false)}
            />
            <kbd className="header__search-kbd">⌘K</kbd>
          </div>
        )}
      </div>

      <div className="header__right">
        {isMobile && (
          <button className="btn-ghost btn-icon" aria-label="Search">
            <Search size={20} />
          </button>
        )}

        <div className="header__streak" title={`${streak} day streak!`}>
          <Flame size={18} className="header__streak-icon" />
          <span className="header__streak-count">{streak}</span>
        </div>

        <div className="header__notif-wrapper" ref={notifRef}>
          <button
            className="btn-ghost btn-icon header__notif-btn"
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="header__notif-badge">{unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <div className="header__dropdown header__notif-dropdown animate-slide-up">
              <div className="header__dropdown-header">
                <span className="font-semibold">Notifications</span>
                <button className="btn-ghost btn-sm text-accent">Mark all read</button>
              </div>
              <div className="header__notif-list">
                {notifications.map(n => (
                  <div key={n.id} className={`header__notif-item ${n.unread ? 'unread' : ''}`}>
                    <div className="header__notif-dot" />
                    <div className="header__notif-content">
                      <p className="header__notif-text">{n.text}</p>
                      <span className="header__notif-time">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="header__dropdown-footer btn-ghost w-full">
                View all notifications
              </button>
            </div>
          )}
        </div>

        <div className="header__profile-wrapper" ref={profileRef}>
          <button
            className="header__profile-btn"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="avatar avatar-sm">
              {getInitials(user?.full_name)}
            </div>
            {!isMobile && (
              <>
                <div className="header__profile-info">
                  <span className="header__profile-name">{user?.full_name || 'User'}</span>
                  <span className="header__profile-role">{role?.replace('_', ' ')}</span>
                </div>
                <ChevronDown size={14} className={`header__chevron ${profileOpen ? 'open' : ''}`} />
              </>
            )}
          </button>

          {profileOpen && (
            <div className="header__dropdown header__profile-dropdown animate-slide-up">
              <div className="header__dropdown-user">
                <div className="avatar">{getInitials(user?.full_name)}</div>
                <div>
                  <p className="font-semibold">{user?.full_name}</p>
                  <p className="text-sm text-secondary">{user?.email}</p>
                  <span className="badge badge-primary mt-2">{role?.replace('_', ' ')}</span>
                </div>
              </div>
              <div className="divider" />
              <button className="header__dropdown-item" onClick={() => { navigate('/settings'); setProfileOpen(false); }}>
                <User size={16} /> Profile
              </button>
              <button className="header__dropdown-item" onClick={() => { navigate('/settings'); setProfileOpen(false); }}>
                <Settings size={16} /> Settings
              </button>
              <div className="divider" />
              <button className="header__dropdown-item header__dropdown-item--danger" onClick={handleLogout}>
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
