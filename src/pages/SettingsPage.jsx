import { useAuth } from '../contexts/AuthContext';
import { User, Shield, Key, Bell, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  const { user, role } = useAuth();

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Account Settings</h1>
        <p className="page-subtitle">Manage profile settings, security, and notification preferences.</p>
      </div>

      <div className="dashboard-grid">
        <div className="card span-2 animate-fade-in-up">
          <h3 className="card-title mb-4 flex items-center gap-2">
            <User size={18} /> Profile Information
          </h3>
          <div className="flex flex-col gap-4">
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input type="text" className="input" defaultValue={user?.full_name || 'Alex Johnson'} />
            </div>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input type="email" className="input" defaultValue={user?.email || 'alex@demo.com'} />
            </div>
            <div className="input-group">
              <label className="input-label">Registration Number</label>
              <input type="text" className="input" defaultValue={user?.registration_number || 'STU001'} disabled />
            </div>
            <button className="btn btn-primary w-full mt-2">Save Profile Changes</button>
          </div>
        </div>

        <div className="card span-2 animate-fade-in-up delay-1">
          <h3 className="card-title mb-4 flex items-center gap-2">
            <Shield size={18} /> Role & Roster Access
          </h3>
          <div className="p-4 bg-neutral-100 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-secondary">Assigned Role:</span>
              <span className="badge badge-primary">{role?.replace('_', ' ')}</span>
            </div>
            <p className="text-xs text-tertiary">
              Roles are stored in a dedicated database table (never on the profile) to prevent self-promotion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
