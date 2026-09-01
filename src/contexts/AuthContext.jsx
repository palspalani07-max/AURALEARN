import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { ROLES } from '../utils/constants';

const AuthContext = createContext(null);

// Demo data for development without Supabase connection
const DEMO_USERS = {
  'STU001': { id: 'demo-student-1', registration_number: 'STU001', full_name: 'Alex Johnson', email: 'alex@demo.com', role: ROLES.STUDENT, class_id: 'class-1', password: 'demo123' },
  'STU002': { id: 'demo-student-2', registration_number: 'STU002', full_name: 'Sarah Williams', email: 'sarah@demo.com', role: ROLES.STUDENT, class_id: 'class-1', password: 'demo123' },
  'TCH001': { id: 'demo-teacher-1', registration_number: 'TCH001', full_name: 'Dr. Priya Sharma', email: 'priya@demo.com', role: ROLES.CLASS_TEACHER, class_id: 'class-1', password: 'demo123' },
  'TCH002': { id: 'demo-teacher-2', registration_number: 'TCH002', full_name: 'Prof. Raj Kumar', email: 'raj@demo.com', role: ROLES.TEACHER, class_id: 'class-1', password: 'demo123' },
  'PAR001': { id: 'demo-parent-1', registration_number: 'PAR001', full_name: 'David Johnson', email: 'david@demo.com', role: ROLES.PARENT, linked_student: 'demo-student-1', password: 'demo123' },
};

// Unclaimed roster entries for first-login claim flow
const UNCLAIMED_ROSTER = {
  'STU003': { registration_number: 'STU003', class_id: 'class-1', status: 'unclaimed' },
  'STU004': { registration_number: 'STU004', class_id: 'class-1', status: 'unclaimed' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claimMode, setClaimMode] = useState(false);
  const [claimRegNo, setClaimRegNo] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const stored = localStorage.getItem('auralearn_session');
    if (stored) {
      try {
        const session = JSON.parse(stored);
        setUser(session.user);
        setRole(session.role);
      } catch (e) {
        localStorage.removeItem('auralearn_session');
      }
    }
    setLoading(false);
  }, []);

  // Login with registration number
  const login = useCallback(async (registrationNumber, password) => {
    setError(null);
    setLoading(true);

    try {
      const regNo = registrationNumber.trim().toUpperCase();

      // Check if it's a demo user
      const demoUser = DEMO_USERS[regNo];
      if (demoUser) {
        if (demoUser.password === password) {
          const session = { user: demoUser, role: demoUser.role };
          setUser(demoUser);
          setRole(demoUser.role);
          localStorage.setItem('auralearn_session', JSON.stringify(session));
          setLoading(false);
          return { success: true };
        } else {
          setLoading(false);
          setError('Invalid credentials. Please try again.');
          return { success: false, error: 'Invalid credentials' };
        }
      }

      // Check unclaimed roster
      const unclaimed = UNCLAIMED_ROSTER[regNo];
      if (unclaimed) {
        setClaimMode(true);
        setClaimRegNo(regNo);
        setLoading(false);
        return { success: false, needsClaim: true };
      }

      // Try Supabase auth
      try {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: `${regNo.toLowerCase()}@auralearn.app`,
          password,
        });

        if (authError) throw authError;

        // Fetch user profile and role
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        const userData = { ...profile, role: userRole?.role };
        setUser(userData);
        setRole(userRole?.role);
        localStorage.setItem('auralearn_session', JSON.stringify({ user: userData, role: userRole?.role }));
        setLoading(false);
        return { success: true };
      } catch {
        setLoading(false);
        setError('Invalid registration number or password.');
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (err) {
      setLoading(false);
      setError('An unexpected error occurred. Please try again.');
      return { success: false, error: err.message };
    }
  }, []);

  // Claim account (first-login for unclaimed roster entry)
  const claimAccount = useCallback(async ({ fullName, email, password }) => {
    setError(null);
    setLoading(true);

    try {
      const regNo = claimRegNo;

      // In demo mode, create the account locally
      const newUser = {
        id: `demo-${regNo.toLowerCase()}`,
        registration_number: regNo,
        full_name: fullName,
        email,
        role: ROLES.STUDENT,
        class_id: UNCLAIMED_ROSTER[regNo]?.class_id || 'class-1',
      };

      // Mark as claimed
      if (UNCLAIMED_ROSTER[regNo]) {
        UNCLAIMED_ROSTER[regNo].status = 'claimed';
      }

      // Add to demo users
      DEMO_USERS[regNo] = { ...newUser, password };

      const session = { user: newUser, role: ROLES.STUDENT };
      setUser(newUser);
      setRole(ROLES.STUDENT);
      setClaimMode(false);
      setClaimRegNo(null);
      localStorage.setItem('auralearn_session', JSON.stringify(session));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      setError('Failed to create account. Please try again.');
      return { success: false, error: err.message };
    }
  }, [claimRegNo]);

  // Parent join by code
  const parentJoin = useCallback(async (joinCode) => {
    setError(null);
    // In demo, just log in as the demo parent
    const parentUser = DEMO_USERS['PAR001'];
    if (joinCode === 'PARENT-ALEX-001' || joinCode.length >= 4) {
      const session = { user: parentUser, role: ROLES.PARENT };
      setUser(parentUser);
      setRole(ROLES.PARENT);
      localStorage.setItem('auralearn_session', JSON.stringify(session));
      return { success: true };
    }
    setError('Invalid parent code.');
    return { success: false };
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore Supabase errors in demo mode
    }
    setUser(null);
    setRole(null);
    setClaimMode(false);
    setClaimRegNo(null);
    localStorage.removeItem('auralearn_session');
  }, []);

  const value = {
    user,
    role,
    loading,
    error,
    claimMode,
    claimRegNo,
    login,
    claimAccount,
    parentJoin,
    logout,
    setError,
    isStudent: role === ROLES.STUDENT,
    isTeacher: role === ROLES.TEACHER || role === ROLES.CLASS_TEACHER,
    isClassTeacher: role === ROLES.CLASS_TEACHER,
    isParent: role === ROLES.PARENT,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
