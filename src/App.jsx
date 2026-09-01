import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AppShell from './components/layout/AppShell';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import SummaryPage from './pages/SummaryPage';
import DoubtPage from './pages/DoubtPage';
import QuizPage from './pages/QuizPage';
import FlashcardsPage from './pages/FlashcardsPage';
import LiveCallPage from './pages/LiveCallPage';
import ExamPrepPage from './pages/ExamPrepPage';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="spinner spinner-lg text-accent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/summaries" element={<SummaryPage />} />
              <Route path="/doubts" element={<DoubtPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/flashcards" element={<FlashcardsPage />} />
              <Route path="/live" element={<LiveCallPage />} />
              <Route path="/exam-prep" element={<ExamPrepPage />} />
              <Route path="/class" element={<DashboardPage />} />
              <Route path="/roster" element={<DashboardPage />} />
              <Route path="/assignments" element={<DashboardPage />} />
              <Route path="/analytics" element={<DashboardPage />} />
              <Route path="/progress" element={<DashboardPage />} />
              <Route path="/reports" element={<DashboardPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
