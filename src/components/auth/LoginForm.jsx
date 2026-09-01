import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, Eye, EyeOff, UserPlus, Users } from 'lucide-react';
import './LoginForm.css';

export default function LoginForm() {
  const { login, parentJoin, error, loading, setError } = useAuth();
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState('login'); // login | parent
  const [parentCode, setParentCode] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!regNo.trim() || !password.trim()) {
      setError('Please enter your registration number and password.');
      return;
    }
    await login(regNo, password);
  };

  const handleParentJoin = async (e) => {
    e.preventDefault();
    if (!parentCode.trim()) {
      setError('Please enter your parent access code.');
      return;
    }
    await parentJoin(parentCode);
  };

  return (
    <div className="login-container">
      <div className="login-card animate-scale-in">
        <div className="login-header">
          <div className="login-logo">
            <span className="login-logo-icon">✦</span>
          </div>
          <h1 className="login-title">AURALEARN</h1>
          <p className="login-subtitle">AI-Powered Adaptive Study Companion</p>
        </div>

        <div className="login-tabs">
          <button
            className={`login-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(null); }}
          >
            <LogIn size={16} /> Student / Teacher
          </button>
          <button
            className={`login-tab ${mode === 'parent' ? 'active' : ''}`}
            onClick={() => { setMode('parent'); setError(null); }}
          >
            <Users size={16} /> Parent
          </button>
        </div>

        {mode === 'login' ? (
          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label">Registration Number</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. STU001"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="login-password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={loading}
            >
              {loading ? <span className="spinner spinner-sm" /> : <LogIn size={18} />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="login-help">
              <p className="text-sm text-secondary text-center">
                First time? Enter your registration number — if it's on the class roster, you'll be asked to set up your account.
              </p>
            </div>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleParentJoin}>
            <div className="input-group">
              <label className="input-label">Parent Access Code</label>
              <input
                type="text"
                className="input"
                placeholder="Enter the code shared by the school"
                value={parentCode}
                onChange={(e) => setParentCode(e.target.value)}
                autoFocus
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={loading}
            >
              <UserPlus size={18} /> Join as Parent
            </button>

            <div className="login-help">
              <p className="text-sm text-secondary text-center">
                Your child's teacher will provide you with a unique access code to view their progress.
              </p>
            </div>
          </form>
        )}

        <div className="login-demo">
          <p className="text-xs text-tertiary text-center">Demo accounts: STU001 / demo123 · TCH001 / demo123 · PAR001 code: PARENT-ALEX-001</p>
        </div>
      </div>

      <div className="login-bg">
        <div className="login-bg-circle login-bg-circle--1" />
        <div className="login-bg-circle login-bg-circle--2" />
        <div className="login-bg-circle login-bg-circle--3" />
      </div>
    </div>
  );
}
