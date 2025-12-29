import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { User, Mail, Lock, Eye, EyeOff, Loader2, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';
import logoDark from '../assets/CT logo.png';
import logoLight from '../assets/CT logo black.png';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    profilePic: '',
  });

  const { signup, isSigningUp } = useAuthStore();
  const { theme } = useThemeStore();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Image = reader.result;
      setFormData({ ...formData, profilePic: base64Image });
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="auth-container animate-fade">
      <div className="auth-card glass">
        <div className="auth-header">
          <div className="auth-logo-wrapper">
            <img src={theme === 'dark' ? logoDark : logoLight} alt="Logo" className="auth-logo" />
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join the CircleTalk community today</p>
        </div>

        <div className="signup-avatar-section">
          <div className="signup-avatar-wrapper">
            <img
              src={formData.profilePic || '/avatar.png'}
              alt="Avatar Preview"
              className="signup-avatar-preview"
            />
            <label htmlFor="avatar-upload" className="signup-avatar-upload-btn">
              <Camera size={18} />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isSigningUp}
              />
            </label>
          </div>
          <p className="signup-avatar-hint text-xs mt-2 opacity-60">Upload a profile picture (optional)</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-with-icon">
              <User className="input-icon" size={20} />
              <input
                type="text"
                className="auth-input"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={isSigningUp}>
            {isSigningUp ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;