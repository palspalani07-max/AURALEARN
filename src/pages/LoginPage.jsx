import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import ClaimAccount from '../components/auth/ClaimAccount';

export default function LoginPage() {
  const { claimMode } = useAuth();
  return claimMode ? <ClaimAccount /> : <LoginForm />;
}
