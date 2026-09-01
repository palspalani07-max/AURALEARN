import { Calendar, GraduationCap, Target, Clock } from 'lucide-react';
import { daysUntil, getScoreColor } from '../utils/helpers';

export default function ExamPrepPage() {
  const exams = [
    { title: 'DBMS Final Exam', date: '2026-09-13', readiness: 65, syllabus: 'Units 1-5' },
    { title: 'Computer Networks Mid-term', date: '2026-09-29', readiness: 42, syllabus: 'OSI & TCP/IP' },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Exam Readiness & Revision</h1>
        <p className="page-subtitle">Syllabus coverage, countdowns, and exam revision note generators.</p>
      </div>

      <div className="dashboard-grid">
        {exams.map((exam, idx) => (
          <div key={idx} className="card span-2 animate-fade-in-up">
            <div className="card-header">
              <div>
                <h3 className="card-title">{exam.title}</h3>
                <p className="card-subtitle">Syllabus: {exam.syllabus}</p>
              </div>
              <div className="badge badge-warning">{daysUntil(exam.date)} Days Left</div>
            </div>

            <div className="exam-readiness mt-4">
              <span className="text-sm text-secondary">Calculated Readiness:</span>
              <div className="exam-readiness-bar">
                <div className="exam-readiness-fill" style={{ width: `${exam.readiness}%`, background: getScoreColor(exam.readiness) }} />
              </div>
              <span className="font-bold text-sm" style={{ color: getScoreColor(exam.readiness) }}>
                {exam.readiness}%
              </span>
            </div>

            <button className="btn btn-primary w-full mt-6">
              <GraduationCap size={16} /> Launch Exam Revision Notes
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
