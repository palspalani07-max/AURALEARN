import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Clock, Brain, BookOpen, Target, Flame, TrendingUp,
  Calendar, AlertTriangle, ChevronRight, Zap, Award,
  BarChart3, CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { getScoreColor, formatTime, daysUntil, getSeverityLabel } from '../../utils/helpers';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './StudentDashboard.css';

// Demo data
const WEEKLY_DATA = [
  { day: 'Mon', score: 65, time: 45 },
  { day: 'Tue', score: 72, time: 60 },
  { day: 'Wed', score: 68, time: 35 },
  { day: 'Thu', score: 78, time: 90 },
  { day: 'Fri', score: 82, time: 75 },
  { day: 'Sat', score: 76, time: 50 },
  { day: 'Sun', score: 85, time: 80 },
];

const WEAK_TOPICS = [
  { name: 'Normalization', score: 35, subject: 'DBMS' },
  { name: 'SQL Joins', score: 42, subject: 'DBMS' },
  { name: 'OSI Model', score: 48, subject: 'Networks' },
];

const ADAPTIVE_PLAN = [
  { id: 1, topic: 'Normalization (1NF-3NF)', subject: 'DBMS', minutes: 25, severity: 0.85, type: 'review', completed: false },
  { id: 2, topic: 'SQL Joins Practice', subject: 'DBMS', minutes: 20, severity: 0.65, type: 'quiz', completed: false },
  { id: 3, topic: 'ER Diagrams', subject: 'DBMS', minutes: 15, severity: 0.3, type: 'review', completed: true },
  { id: 4, topic: 'OSI Model Layers', subject: 'Networks', minutes: 20, severity: 0.72, type: 'flashcards', completed: false },
  { id: 5, topic: 'TCP/IP Protocol', subject: 'Networks', minutes: 15, severity: 0.4, type: 'summary', completed: false },
];

const HEATMAP_DATA = [
  ['Normalization', 'SQL', 'ER Diagram', 'Transactions', 'Indexing'],
  [35, 42, 78, 55, 62],
];

const RECENT_MISTAKES = [
  { id: 1, question: 'What is the difference between 2NF and 3NF?', topic: 'Normalization', date: '2026-08-31' },
  { id: 2, question: 'Explain INNER JOIN vs LEFT JOIN', topic: 'SQL Joins', date: '2026-08-30' },
  { id: 3, question: 'Which layer handles routing?', topic: 'OSI Model', date: '2026-08-29' },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const knowledgeScore = 78;
  const dailyGoal = 72;
  const studyTime = 135; // minutes today
  const questionsToday = 34;
  const topicsCompleted = 5;
  const streak = 15;
  const examDate = '2026-09-13';
  const examDays = daysUntil(examDate);

  return (
    <div className="page-content">
      {/* Welcome Banner */}
      <div className="welcome-banner animate-fade-in-up">
        <div className="welcome-text">
          <h1 className="page-title">
            Good afternoon, {user?.full_name?.split(' ')[0] || 'Student'} 👋
          </h1>
          <p className="page-subtitle">
            You've completed {dailyGoal}% of today's goal. Keep it up!
          </p>
        </div>
        <div className="welcome-streak">
          <Flame size={24} className="welcome-streak-icon" />
          <div>
            <span className="welcome-streak-count">{streak}</span>
            <span className="welcome-streak-label">day streak</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="dashboard-grid mt-6">
        <div className="card animate-fade-in-up delay-1">
          <div className="stat-card">
            <div className="stat-icon purple"><Clock size={22} /></div>
            <div>
              <div className="stat-value">{formatTime(studyTime * 60)}</div>
              <div className="stat-label">Study Time</div>
              <div className="stat-delta up"><ArrowUpRight size={12} /> 12% vs yesterday</div>
            </div>
          </div>
        </div>

        <div className="card animate-fade-in-up delay-2">
          <div className="stat-card">
            <div className="stat-icon coral"><Brain size={22} /></div>
            <div>
              <div className="stat-value">{questionsToday}</div>
              <div className="stat-label">Questions Today</div>
              <div className="stat-delta up"><ArrowUpRight size={12} /> 8 more than avg</div>
            </div>
          </div>
        </div>

        <div className="card animate-fade-in-up delay-3">
          <div className="stat-card">
            <div className="stat-icon green"><BookOpen size={22} /></div>
            <div>
              <div className="stat-value">{topicsCompleted}</div>
              <div className="stat-label">Topics Covered</div>
              <div className="stat-delta up"><ArrowUpRight size={12} /> 2 new today</div>
            </div>
          </div>
        </div>

        <div className="card animate-fade-in-up delay-4">
          <div className="stat-card">
            <div className="stat-icon amber"><Target size={22} /></div>
            <div>
              <div className="stat-value">{dailyGoal}%</div>
              <div className="stat-label">Daily Goal</div>
              <div className="stat-delta up"><ArrowUpRight size={12} /> On track</div>
            </div>
          </div>
        </div>

        {/* Knowledge Score */}
        <div className="card span-2 animate-fade-in-up delay-3">
          <div className="card-header">
            <div>
              <h3 className="card-title">Knowledge Score</h3>
              <p className="card-subtitle">Based on accuracy, coverage, recency & confidence</p>
            </div>
            <div className="badge badge-primary"><TrendingUp size={12} /> +3 this week</div>
          </div>
          <div className="knowledge-score-container">
            <div className="knowledge-ring">
              <svg viewBox="0 0 120 120" className="knowledge-ring-svg">
                <circle cx="60" cy="60" r="52" className="knowledge-ring-bg" />
                <circle
                  cx="60" cy="60" r="52"
                  className="knowledge-ring-fill"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 52}`,
                    strokeDashoffset: `${2 * Math.PI * 52 * (1 - knowledgeScore / 100)}`,
                    stroke: getScoreColor(knowledgeScore),
                  }}
                />
              </svg>
              <div className="knowledge-ring-text">
                <span className="knowledge-ring-value">{knowledgeScore}</span>
                <span className="knowledge-ring-label">/ 100</span>
              </div>
            </div>
            <div className="knowledge-breakdown">
              <div className="knowledge-metric">
                <span className="knowledge-metric-label">Accuracy</span>
                <div className="knowledge-metric-bar">
                  <div className="knowledge-metric-fill" style={{ width: '82%', background: 'var(--success-400)' }} />
                </div>
                <span className="knowledge-metric-value">82%</span>
              </div>
              <div className="knowledge-metric">
                <span className="knowledge-metric-label">Coverage</span>
                <div className="knowledge-metric-bar">
                  <div className="knowledge-metric-fill" style={{ width: '68%', background: 'var(--primary-400)' }} />
                </div>
                <span className="knowledge-metric-value">68%</span>
              </div>
              <div className="knowledge-metric">
                <span className="knowledge-metric-label">Recency</span>
                <div className="knowledge-metric-bar">
                  <div className="knowledge-metric-fill" style={{ width: '75%', background: 'var(--accent-400)' }} />
                </div>
                <span className="knowledge-metric-value">75%</span>
              </div>
              <div className="knowledge-metric">
                <span className="knowledge-metric-label">Confidence</span>
                <div className="knowledge-metric-bar">
                  <div className="knowledge-metric-fill" style={{ width: '71%', background: 'var(--warning-400)' }} />
                </div>
                <span className="knowledge-metric-value">71%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Countdown */}
        <div className="card span-2 animate-fade-in-up delay-4">
          <div className="card-header">
            <div>
              <h3 className="card-title">Exam Countdown</h3>
              <p className="card-subtitle">Upcoming exams and readiness</p>
            </div>
            <button className="btn btn-secondary btn-sm">
              <Calendar size={14} /> Add Exam
            </button>
          </div>
          <div className="exam-countdown">
            <div className="exam-card exam-card--urgent">
              <div className="exam-card-left">
                <div className="exam-days-badge">
                  <span className="exam-days-number">{examDays}</span>
                  <span className="exam-days-label">days</span>
                </div>
              </div>
              <div className="exam-card-info">
                <h4 className="exam-name">DBMS Final Exam</h4>
                <p className="exam-date">September 13, 2026</p>
                <div className="exam-readiness">
                  <span className="text-sm text-secondary">Readiness:</span>
                  <div className="exam-readiness-bar">
                    <div className="exam-readiness-fill" style={{ width: '65%' }} />
                  </div>
                  <span className="font-semibold" style={{ color: getScoreColor(65) }}>65%</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-tertiary" />
            </div>
            <div className="exam-card">
              <div className="exam-card-left">
                <div className="exam-days-badge exam-days-badge--safe">
                  <span className="exam-days-number">28</span>
                  <span className="exam-days-label">days</span>
                </div>
              </div>
              <div className="exam-card-info">
                <h4 className="exam-name">Computer Networks Mid-term</h4>
                <p className="exam-date">September 29, 2026</p>
                <div className="exam-readiness">
                  <span className="text-sm text-secondary">Readiness:</span>
                  <div className="exam-readiness-bar">
                    <div className="exam-readiness-fill" style={{ width: '42%' }} />
                  </div>
                  <span className="font-semibold" style={{ color: getScoreColor(42) }}>42%</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-tertiary" />
            </div>
          </div>
        </div>

        {/* Today's Adaptive Plan */}
        <div className="card span-2 animate-fade-in-up delay-5">
          <div className="card-header">
            <div>
              <h3 className="card-title">Today's Adaptive Plan</h3>
              <p className="card-subtitle">Personalized study blocks based on your performance</p>
            </div>
            <div className="badge badge-neutral">
              <Zap size={12} /> Auto-updated
            </div>
          </div>
          <div className="adaptive-plan">
            {ADAPTIVE_PLAN.map((block, i) => {
              const severity = getSeverityLabel(block.severity);
              return (
                <div
                  key={block.id}
                  className={`plan-block ${block.completed ? 'completed' : ''}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="plan-block-order">{i + 1}</div>
                  <div className="plan-block-info">
                    <div className="plan-block-header">
                      <h4 className="plan-block-topic">{block.topic}</h4>
                      <span className={`badge badge-${severity.color}`}>{severity.label}</span>
                    </div>
                    <div className="plan-block-meta">
                      <span className="badge badge-neutral">{block.subject}</span>
                      <span className="text-sm text-secondary">{block.minutes} min</span>
                      <span className="badge badge-primary">{block.type}</span>
                    </div>
                  </div>
                  <div className="plan-block-action">
                    {block.completed ? (
                      <CheckCircle2 size={22} className="text-success" />
                    ) : (
                      <button className="btn btn-primary btn-sm">Start</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weak Topics */}
        <div className="card span-2 animate-fade-in-up delay-5">
          <div className="card-header">
            <div>
              <h3 className="card-title">Weak Topics</h3>
              <p className="card-subtitle">Focus areas based on quiz performance</p>
            </div>
            <button className="btn btn-ghost btn-sm">View All <ChevronRight size={14} /></button>
          </div>
          <div className="weak-topics">
            {WEAK_TOPICS.map((topic, i) => (
              <div key={i} className="weak-topic-item">
                <div className="weak-topic-info">
                  <AlertTriangle size={16} style={{ color: getScoreColor(topic.score) }} />
                  <div>
                    <h4 className="weak-topic-name">{topic.name}</h4>
                    <span className="text-xs text-secondary">{topic.subject}</span>
                  </div>
                </div>
                <div className="weak-topic-score">
                  <div className="weak-topic-bar">
                    <div
                      className="weak-topic-bar-fill"
                      style={{ width: `${topic.score}%`, background: getScoreColor(topic.score) }}
                    />
                  </div>
                  <span className="font-semibold text-sm" style={{ color: getScoreColor(topic.score) }}>
                    {topic.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Heatmap */}
          <div className="topic-heatmap mt-6">
            <h4 className="text-sm font-semibold mb-4">Topic Performance Heatmap</h4>
            <div className="heatmap-grid">
              {HEATMAP_DATA[0].map((topic, i) => (
                <div key={i} className="heatmap-cell" title={`${topic}: ${HEATMAP_DATA[1][i]}%`}>
                  <div
                    className="heatmap-cell-fill"
                    style={{ background: getScoreColor(HEATMAP_DATA[1][i]), opacity: 0.15 + (HEATMAP_DATA[1][i] / 100) * 0.85 }}
                  />
                  <span className="heatmap-cell-label">{topic}</span>
                  <span className="heatmap-cell-value">{HEATMAP_DATA[1][i]}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Trend */}
        <div className="card span-2 animate-fade-in-up delay-6">
          <div className="card-header">
            <div>
              <h3 className="card-title">Weekly Progress</h3>
              <p className="card-subtitle">Score and study time trends</p>
            </div>
            <div className="tabs">
              <button className={`tab ${selectedPeriod === 'week' ? 'active' : ''}`} onClick={() => setSelectedPeriod('week')}>Week</button>
              <button className={`tab ${selectedPeriod === 'month' ? 'active' : ''}`} onClick={() => setSelectedPeriod('month')}>Month</button>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={WEEKLY_DATA}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary-400)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--primary-400)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    fontSize: '13px',
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="var(--primary-500)" strokeWidth={2.5} fill="url(#scoreGradient)" dot={{ r: 4, fill: 'var(--primary-500)', strokeWidth: 2, stroke: 'white' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mistake Bank */}
        <div className="card span-2 animate-fade-in-up delay-6">
          <div className="card-header">
            <div>
              <h3 className="card-title">Recent Mistakes</h3>
              <p className="card-subtitle">Review and learn from past errors</p>
            </div>
            <button className="btn btn-ghost btn-sm">View All <ChevronRight size={14} /></button>
          </div>
          <div className="mistake-list">
            {RECENT_MISTAKES.map((mistake) => (
              <div key={mistake.id} className="mistake-item">
                <XCircle size={18} className="text-danger" />
                <div className="mistake-info">
                  <p className="mistake-question">{mistake.question}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="badge badge-neutral">{mistake.topic}</span>
                    <span className="text-xs text-tertiary">{mistake.date}</span>
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm">Review</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
