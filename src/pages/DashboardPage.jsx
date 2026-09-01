import { useAuth } from '../contexts/AuthContext';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import ParentDashboard from '../components/dashboard/ParentDashboard';
import TeacherDashboard from '../components/dashboard/TeacherDashboard';
import { ROLES } from '../utils/constants';

export default function DashboardPage() {
  const { role } = useAuth();

  if (role === ROLES.PARENT) {
    return <ParentDashboard />;
  }

  if (role === ROLES.TEACHER || role === ROLES.CLASS_TEACHER) {
    return <TeacherDashboard />;
  }

  return <StudentDashboard />;
}
