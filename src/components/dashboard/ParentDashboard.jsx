import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Clock, Brain, Target, Shield, AlertTriangle, CheckCircle,
  TrendingUp, Bell, Calendar, ChevronRight
} from 'lucide-react';
import { getScoreColor } from '../../utils/helpers';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './ParentDashboard.css';

const TREND_DATA = [
  { day: 'Mon', score: 70, hours: 1.5 },
  { day: 'Tue', score: 75, hours: 2.0 },
  { day: 'Wed', score: 72, hours: 1.2 },
  { day: 'Thu', score: 78, hours: 2.5 },
  { day: 'Fri', score: 82, hours: 2.2 },
  { day: 'Sat', score: 80, hours: 1.8 },
  { day: 'Sun', score: 85, hours: 2.4 },
];

const WEAK_TOPICS = [
  { topic: 'Normalization (DBMS)', score: 35, severity: 'High Risk' },
  { topic: 'SQL Joins (DBMS)', score: 42, severity: 'Needs Practice' },
  { topic: 'OSI Model (Networks)', score: 48, severity: 'Needs Practice' },
];

const GOALS_COMPLETED = [
  { id: 1, title: 'Completed DBMS Unit 2 Quiz', date: 'Yesterday' },
  { id: 2, title: 'Maintained 15-day Study Streak', date: 'Today' },
  { id: 3, title: 'Achieved 85% in Networks Review', date: '3 days ago' },
];

export default function ParentDashboard() {
  const { user } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [examReminders, setExamReminders] = useState(true);

  const studentName = 'Alex Johnson';
  const overallScore = 78;
  const examReadiness = 65;
  const totalStudyHours = 13.6;

  return (
    <div className="page-content">
      {/* Header */}
      <div className="parent-banner animate-fade-in-up">
        <div className="parent-banner-info">
          <div className="badge badge-primary mb-2">Linked Student Account</div>
          <h1 className="page-title">Progress Monitor: {studentName}</h1>
          <p className="page-subtitle">High-level insights into learning consistency, scores, and exam readiness.</p>
        </div>
        <div className="parent-privacy-badge">
          <Shield size={16} /> Privacy-scoped View
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="dashboard-grid mt-6">
        <div className="card animate-fade-in-up delay-1">
          <div className="stat-card">
            <div className="stat-icon purple"><Brain size={22} /></div>
            <div>
              <div className="stat-value">{overallScore}/100</div>
              <div className="stat-label">Knowledge Score</div>
              <div className="stat-delta up"><TrendingUp size={12} /> +3 pts this week</div>
            </div>
          </div>
        </div>

        <div className="card animate-fade-in-up delay-2">
          <div className="stat-card">
            <div className="stat-icon coral"><Clock size={22} /></div>
            <div>
              <div className="stat-value">{totalStudyHours} hrs</div>
              <div className="stat-label">Study Time (This Week)</div>
              <div className="stat-delta up"><TrendingUp size={12} /> +1.4 hrs vs last week</div>
            </div>
          </div>
        </div>

        <div className="card animate-fade-in-up delay-3">
          <div className="stat-card">
            <div className="stat-icon green"><Target size={22} /></div>
            <div>
              <div className="stat-value">{examReadiness}%</div>
              <div className="stat-label">Exam Readiness</div>
              <div className="stat-delta up"><TrendingUp size={12} /> DBMS Final in 12 days</div>
            </div>
          </div>
        </div>

        <div className="card animate-fade-in-up delay-4">
          <div className="stat-card">
            <div className="stat-icon amber"><Calendar size={22} /></div>
            <div>
              <div className="stat-value">15 Days</div>
              <div className="stat-label">Active Streak</div>
              <div className="stat-delta up">Consistent Learner</div>
            </div>
          </div>
        </div>

        {/* Learning Trend Chart */}
        <div className="card span-2 animate-fade-in-up delay-3">
          <div className="card-header">
            <div>
              <h3 className="card-title">Weekly Score & Consistency</h3>
              <p className="card-subtitle">Daily score trajectory over time</p>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={TREND_DATA}>
                <defs>
                  <linearGradient id="parentTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary-400)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--primary-400)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="var(--primary-600)" strokeWidth={2.5} fill="url(#parentTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic-level Weak Areas */}
        <div className="card span-2 animate-fade-in-up delay-4">
          <div className="card-header">
            <div>
              <h3 className="card-title">Weak Topics Summary</h3>
              <p className="card-subtitle">Topic-level areas where student needs support</p>
            </div>
          </div>
          <div className="weak-topics">
            {WEAK_TOPICS.map((item, i) => (
              <div key={i} className="weak-topic-item">
                <div className="weak-topic-info">
                  <AlertTriangle size={18} style={{ color: getScoreColor(item.score) }} />
                  <div>
                    <h4 className="weak-topic-name">{item.topic}</h4>
                    <span className="text-xs text-secondary">{item.severity}</span>
                  </div>
                </div>
                <div className="badge badge-warning">{item.score}% Mastery</div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals Completed */}
        <div className="card span-2 animate-fade-in-up delay-5">
          <div className="card-header">
            <div>
              <h3 className="card-title">Completed Milestones</h3>
              <p className="card-subtitle">Recent accomplishments and completed goals</p>
            </div>
          </div>
          <div className="mistake-list">
            {GOALS_COMPLETED.map(g => (
              <div key={g.id} className="mistake-item">
                <CheckCircle size={18} className="text-success" />
                <div className="mistake-info">
                  <p className="mistake-question">{g.title}</p>
                  <span className="text-xs text-tertiary">{g.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="card span-2 animate-fade-in-up delay-5">
          <div className="card-header">
            <div>
              <h3 className="card-title">Notification Preferences</h3>
              <p className="card-subtitle">Control alerts regarding study activity and exams</p>
            </div>
          </div>
          <div className="parent-settings-list">
            <div className="parent-setting-item">
              <div>
                <h4 className="font-semibold text-sm">Low Activity Alerts</h4>
                <p className="text-xs text-secondary">Notify if inactive for more than 2 consecutive days</p>
              </div>
              <div className={`toggle ${emailAlerts ? 'active' : ''}`} onClick={() => setEmailAlerts(!emailAlerts)} />
            </div>
            <div className="parent-setting-item mt-4">
              <div>
                <h4 className="font-semibold text-sm">Upcoming Exam Alerts</h4>
                <p className="text-xs text-secondary">Receive updates 10 days before scheduled exams</p>
              </div>
              <div className={`toggle ${examReminders ? 'active' : ''}`} onClick={() => setExamReminders(!examReminders)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
