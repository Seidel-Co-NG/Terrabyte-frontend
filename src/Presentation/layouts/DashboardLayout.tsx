import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import { useAuthStore } from '../../core/stores/auth.store';

const DashboardLayout = () => {
  const { isAuthenticated, user, isHydrated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Wait for hydration to complete before checking authentication
  // This prevents redirects on page refresh
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[var(--text-primary)]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user && !user.has_transaction_pin) {
    return <Navigate to="/set-transaction-pin" replace />;
  }

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)]">
     
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Outlet />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[998] lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}
    </div>
  );
};

export default DashboardLayout;
