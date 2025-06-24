import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { routeArray } from '@/config/routes';
import { AuthContext } from '@/App';
const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  // Redirect to dashboard from root
  if (location.pathname === '/') {
    window.location.replace('/dashboard');
    return null;
  }

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Mobile Header */}
<header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 lg:hidden z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Menu" size={20} />
          </button>
          <h1 className="font-display font-bold text-xl text-primary">JobTracker Pro</h1>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-sm text-gray-600 hidden sm:block">
              {user.firstName} {user.lastName}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            icon="LogOut"
            onClick={logout}
            className="text-gray-600 hover:text-gray-800"
          >
            Logout
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
<aside className="hidden lg:flex w-60 bg-white border-r border-gray-200 flex-col z-40">
          <div className="flex-shrink-0 p-6 border-b border-gray-200 flex items-center justify-between">
            <h1 className="font-display font-bold text-xl text-primary">JobTracker Pro</h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-surface hover:text-primary'
                  }
                `}
              >
                <ApperIcon name={route.icon} size={20} />
                <span className="font-medium">{route.label}</span>
              </NavLink>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            {user && (
              <div className="mb-3 text-sm text-gray-600">
                {user.firstName} {user.lastName}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              icon="LogOut"
              onClick={logout}
              className="w-full justify-start"
            >
              Logout
            </Button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.aside
                initial="closed"
                animate="open"
                exit="closed"
                variants={sidebarVariants}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 lg:hidden flex flex-col"
              >
<div className="flex-shrink-0 p-6 border-b border-gray-200 flex items-center justify-between">
                  <h1 className="font-display font-bold text-xl text-primary">JobTracker Pro</h1>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {routeArray.map((route) => (
                    <NavLink
                      key={route.id}
                      to={route.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-primary text-white shadow-sm' 
                          : 'text-gray-600 hover:bg-surface hover:text-primary'
                        }
                      `}
                    >
                      <ApperIcon name={route.icon} size={20} />
                      <span className="font-medium">{route.label}</span>
                    </NavLink>
                  ))}
                </nav>
                
                <div className="p-4 border-t border-gray-200">
                  {user && (
                    <div className="mb-3 text-sm text-gray-600">
                      {user.firstName} {user.lastName}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    icon="LogOut"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full justify-start"
                  >
                    Logout
                  </Button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;