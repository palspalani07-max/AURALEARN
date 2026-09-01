import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import './LoginForm.css';

export default function ClaimAccount() {
  const { claimAccount, claimRegNo, error, loading, setError } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClaim = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    await claimAccount({ fullName: fullName.trim(), email: email.trim(), password });
  };

  return (
    <div className="login-container">
      <div className="login-card animate-scale-in">
        <div className="login-header">
          <div className="login-logo">
            <span className="login-logo-icon">✦</span>
          </div>
          <h1 className="login-title">Welcome!</h1>
          <p className="login-subtitle">
            Set up your account for <strong>{claimRegNo}</strong>
          </p>
        </div>

        <div className="claim-info">
          <div className="badge badge-success">Registration number found on class roster</div>
        </div>

        <form className="login-form" onSubmit={handleClaim}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input
              type="text"
              className="input"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              className="input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Create Password</label>
            <div className="login-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <div className="input-group">
            <label className="input-label">Confirm Password</label>
            <input
              type="password"
              className="input"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
            disabled={loading}
          >
            {loading ? <span className="spinner spinner-sm" /> : <UserPlus size={18} />}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      </div>

      <div className="login-bg">
        <div className="login-bg-circle login-bg-circle--1" />
        <div className="login-bg-circle login-bg-circle--2" />
        <div className="login-bg-circle login-bg-circle--3" />
      </div>
    </div>
  );
}
