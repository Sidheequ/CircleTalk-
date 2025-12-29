import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { LogOut, Settings, User, Moon, Sun, MessageSquare } from 'lucide-react';
import logoDark from '../assets/CT logo.png';
import logoLight from '../assets/CT logo black.png';

const NavBar = () => {
  const { logout, authUser } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <nav className="navbar glass">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src={theme === 'dark' ? logoDark : logoLight} alt="CircleTalk Logo" className="logo-img" />
          {/* <span className="logo-text">CircleTalk</span> */}
        </Link>

        <div className="nav-actions">
          <button className="nav-btn theme-toggle" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {authUser && (
            <>
              <Link to="/settings" className="nav-btn" title="Settings">
                <Settings size={20} />
              </Link>
              <Link to="/profile" className="nav-btn profile-btn" title="Profile">
                {authUser.profilePic ? (
                  <img src={authUser.profilePic} alt="Profile" className="nav-avatar" />
                ) : (
                  <User size={20} />
                )}
              </Link>
              <button className="nav-btn logout-btn" onClick={logout} title="Logout">
                <LogOut size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;