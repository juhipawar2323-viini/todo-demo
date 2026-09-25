import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CheckSquare, LogOut, User as UserIcon } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to={isAuthenticated ? '/todos' : '/login'} className="brand-link" id="brand-logo-link">
          <div className="brand-icon-wrapper">
            <CheckSquare size={20} strokeWidth={2.5} />
          </div>
          <span className="brand-title">TaskMaster</span>
          <span className="brand-badge">Supabase MVC</span>
        </Link>

        <nav className="nav-actions">
          {isAuthenticated && user ? (
            <>
              <div className="user-badge" title={user.email} id="user-profile-badge">
                <div className="user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={14} />}
                </div>
                <span>{user.name || user.email}</span>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleLogout}
                id="logout-btn"
                title="Log out of your account"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm" id="nav-login-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register-link">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
