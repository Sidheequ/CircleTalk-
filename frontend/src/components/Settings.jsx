import React from "react";
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';
import { Sun, Moon, Palette, Bell, Shield, Info, ChevronLeft } from 'lucide-react';

const Settings = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="settings-page animate-fade">
      <div className="settings-container glass">
        <Link to="/" className="back-btn">
          <ChevronLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="settings-header">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Manage your experience</p>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <div className="section-header">
              <Palette size={20} />
              <h2 className="section-title">Appearance</h2>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Dark Mode</span>
                <span className="setting-description">Switch between light and dark themes</span>
              </div>
              <button className="theme-switch-btn" onClick={toggleTheme}>
                {theme === 'dark' ? <Moon size={22} /> : <Sun size={22} />}
                <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
              </button>
            </div>
          </div>

          <div className="settings-section">
            <div className="section-header">
              <Bell size={20} />
              <h2 className="section-title">Notifications</h2>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Push Notifications</span>
                <span className="setting-description">Get notified when you receive a message</span>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          <div className="settings-section">
            <div className="section-header">
              <Shield size={20} />
              <h2 className="section-title">Privacy & Security</h2>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Read Receipts</span>
                <span className="setting-description">Allow others to see when you've read messages</span>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          <div className="settings-section">
            <div className="section-header">
              <Info size={20} />
              <h2 className="section-title">About</h2>
            </div>
            <div className="setting-item no-border">
              <div className="setting-info">
                <span className="setting-label">Version</span>
                <span className="setting-description">CircleTalk v1.0.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;