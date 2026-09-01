import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import RosterManager from '../teacher/RosterManager';
import {
  Users, BookOpen, Brain, AlertTriangle, FileUp, Plus,
  BarChart3, TrendingDown, ChevronRight, CheckCircle2
} from 'lucide-react';
import { getScoreColor } from '../../utils/helpers';
import './TeacherDashboard.css';

const STUDENT_LIST = [
  { id: 1, regNo: 'STU001', name: 'Alex Johnson', score: 78, streak: 15, active: '10m ago', atRisk: false },
  { id: 2, regNo: 'STU002', name: 'Sarah Williams', score: 85, streak: 12, active: '1h ago', atRisk: false },
  { id: 3, regNo: 'STU003', name: 'Michael Brown', score: 42, streak: 2, active: '3d ago', atRisk: true, riskReason: 'Low activity & weak quiz score' },
  { id: 4, regNo: 'STU004', name: 'Emily Davis', score: 91, streak: 21, active: '5m ago', atRisk: false },
];

const CLASS_TOPICS = [
  { name: 'Normalization', avgScore: 45, weakStudents: 12 },
  { name: 'SQL Joins', avgScore: 58, weakStudents: 8 },
  { name: 'ER Diagrams', avgScore: 82, weakStudents: 2 },
  { name: 'Transactions', avgScore: 64, weakStudents: 6 },
];

export default function TeacherDashboard() {
  const { user, isClassTeacher } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // overview | roster | assignment

  return (
    <div className="page-content">
      {/* Header */}
      <div className="teacher-header animate-fade-in-up">
        <div>
          <div className="badge badge-primary mb-2">
            {isClassTeacher ? 'Class Teacher Dashboard' : 'Subject Teacher Dashboard'}
          </div>
          <h1 className="page-title">Class Performance & Insights</h1>
          <p className="page-subtitle">Class CS-3A · DBMS & Computer Networks</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={() => setActiveTab('assignment')}>
            <Plus size={16} /> Create Assignment
          </button>
          <button className="btn btn-primary">
            <FileUp size={16} /> Upload Material to Class
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs mt-6">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Class Overview</button>
        <button className={`tab ${activeTab === 'roster' ? 'active' : ''}`} onClick={() => setActiveTab('roster')}>Roster & Access</button>
        <button className={`tab ${activeTab === 'assignment' ? 'active' : ''}`} onClick={() => setActiveTab('assignment')}>Assignments & Quizzes</button>
      </div>

      {activeTab === 'roster' ? (
        <div className="mt-6">
          <RosterManager />
        </div>
      ) : activeTab === 'assignment' ? (
        <div className="card mt-6 animate-fade-in-up">
          <h3 className="card-title mb-4">Generate Quiz / Assignment for Class</h3>
          <div className="dashboard-grid">
            <div className="input-group">
              <label className="input-label">Assignment Title</label>
              <input type="text" className="input" placeholder="e.g. DBMS Unit 3 Quiz" />
            </div>
            <div className="input-group">
              <label className="input-label">Subject</label>
              <select className="input select">
                <option>Database Management Systems</option>
                <option>Computer Networks</option>
              </select>
            </div>
            <div className="input-group span-2">
              <label className="input-label">Scope / Material</label>
              <select className="input select">
                <option>DBMS Unit 3 - Normalization & Joins.pdf</option>
                <option>Networks Unit 1 - OSI Layers.pdf</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary mt-6"><Brain size={16} /> Auto-Generate & Publish Quiz</button>
        </div>
      ) : (
        <div className="dashboard-grid mt-6">
          {/* Class Summary Stats */}
          <div className="card animate-fade-in-up delay-1">
            <div className="stat-card">
              <div className="stat-icon purple"><Users size={22} /></div>
              <div>
                <div className="stat-value">32</div>
                <div className="stat-label">Total Students</div>
                <div className="stat-delta up">30 claimed accounts</div>
              </div>
            </div>
          </div>

          <div className="card animate-fade-in-up delay-2">
            <div className="stat-card">
              <div className="stat-icon green"><Brain size={22} /></div>
              <div>
                <div className="stat-value">74/100</div>
                <div className="stat-label">Class Knowledge Avg</div>
                <div className="stat-delta up">+4 pts vs last week</div>
              </div>
            </div>
          </div>

          <div className="card animate-fade-in-up delay-3">
            <div className="stat-card">
              <div className="stat-icon amber"><AlertTriangle size={22} /></div>
              <div>
                <div className="stat-value">3</div>
                <div className="stat-label">At-Risk Students</div>
                <div className="stat-delta down"><TrendingDown size={12} /> Requires attention</div>
              </div>
            </div>
          </div>

          <div className="card animate-fade-in-up delay-4">
            <div className="stat-card">
              <div className="stat-icon coral"><BookOpen size={22} /></div>
              <div>
                <div className="stat-value">18</div>
                <div className="stat-label">Class Materials Shared</div>
                <div className="stat-delta up">2 new this week</div>
              </div>
            </div>
          </div>

          {/* At-Risk Indicators */}
          <div className="card span-2 animate-fade-in-up delay-3">
            <div className="card-header">
              <div>
                <h3 className="card-title">At-Risk Student Alerts</h3>
                <p className="card-subtitle">Students falling behind class milestones</p>
              </div>
            </div>
            <div className="mistake-list">
              {STUDENT_LIST.filter(s => s.atRisk).map(student => (
                <div key={student.id} className="mistake-item">
                  <AlertTriangle size={20} className="text-danger flex-shrink-0" />
                  <div className="mistake-info">
                    <p className="font-semibold text-sm">{student.name} ({student.regNo})</p>
                    <p className="text-xs text-danger">{student.riskReason}</p>
                  </div>
                  <button className="btn btn-secondary btn-sm">Message Student</button>
                </div>
              ))}
            </div>
          </div>

          {/* Class Weak-Topic Heatmap */}
          <div className="card span-2 animate-fade-in-up delay-4">
            <div className="card-header">
              <div>
                <h3 className="card-title">Topic-wise Class Performance</h3>
                <p className="card-subtitle">Aggregated accuracy per topic across the class</p>
              </div>
            </div>
            <div className="weak-topics">
              {CLASS_TOPICS.map((topic, i) => (
                <div key={i} className="weak-topic-item">
                  <div className="weak-topic-info">
                    <div>
                      <h4 className="weak-topic-name">{topic.name}</h4>
                      <span className="text-xs text-secondary">{topic.weakStudents} students struggling</span>
                    </div>
                  </div>
                  <div className="weak-topic-score">
                    <div className="weak-topic-bar">
                      <div className="weak-topic-bar-fill" style={{ width: `${topic.avgScore}%`, background: getScoreColor(topic.avgScore) }} />
                    </div>
                    <span className="font-semibold text-sm" style={{ color: getScoreColor(topic.avgScore) }}>
                      {topic.avgScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Progress Table */}
          <div className="card span-4 animate-fade-in-up delay-5">
            <div className="card-header">
              <div>
                <h3 className="card-title">Class Student Roster & Progress</h3>
                <p className="card-subtitle">Scoped visibility for class & subject teachers</p>
              </div>
            </div>
            <div className="roster-table-container">
              <table className="roster-table">
                <thead>
                  <tr>
                    <th>Reg No</th>
                    <th>Student Name</th>
                    <th>Knowledge Score</th>
                    <th>Active Streak</th>
                    <th>Last Active</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {STUDENT_LIST.map(student => (
                    <tr key={student.id}>
                      <td className="font-semibold">{student.regNo}</td>
                      <td>{student.name}</td>
                      <td>
                        <span className="font-semibold" style={{ color: getScoreColor(student.score) }}>
                          {student.score}/100
                        </span>
                      </td>
                      <td>{student.streak} days</td>
                      <td className="text-secondary text-sm">{student.active}</td>
                      <td>
                        <button className="btn btn-ghost btn-sm">View Details <ChevronRight size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
