import { Outlet } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function AppShell() {
  const { sidebarCollapsed, isMobile } = useTheme();

  return (
    <div className="app-layout">
      <Header />
      <Sidebar />
      <main className={`app-main ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Outlet />
      </main>
      {isMobile && <MobileNav />}
    </div>
  );
}
