import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import Dashboard from '../../components/Dashboard/Dashboard';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Default to open on desktop, closed on mobile
    return window.innerWidth > 1024;
  });

  useEffect(() => {
    const handleResize = () => {
      // Auto-open sidebar on desktop, keep state on mobile
      if (window.innerWidth > 1024) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Dashboard />
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;

