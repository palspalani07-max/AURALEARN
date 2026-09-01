import { useNavigate } from 'react';
import {
  FileText, Zap, Brain, MessageCircleQuestion, Layers,
  Clock, Sparkles, BookOpen, ChevronRight
} from 'lucide-react';
import './MaterialReady.css';

export default function MaterialReady({ material }) {
  const navigate = useNavigate();

  const title = material?.title || 'DBMS Unit 3 - Normalization.pdf';
  const studyTime = material?.estimatedStudyTime || '45 mins';
  const topics = material?.topics || [
    'Database Normalization (1NF to 3NF)',
    'Functional Dependencies',
    'Boyce-Codd Normal Form (BCNF)',
    'Decomposition & Lossless Join',
  ];
  const concepts = material?.concepts || [
    '1NF: Atomic values only',
    '2NF: No partial dependency on primary key',
    '3NF: No transitive dependency',
    'Super Keys & Candidate Keys',
  ];

  return (
    <div className="card material-ready-card animate-scale-in">
      <div className="material-ready-header">
        <div className="badge badge-success mb-2">
          <Sparkles size={14} /> Ready for Study
        </div>
        <h2 className="material-ready-title">{title}</h2>
        <div className="material-ready-meta">
          <span className="flex items-center gap-1 text-sm text-secondary">
            <Clock size={16} /> Estimated Study Time: <strong>{studyTime}</strong>
          </span>
          <span className="flex items-center gap-1 text-sm text-secondary">
            <BookOpen size={16} /> {topics.length} Detected Topics
          </span>
        </div>
      </div>

      <div className="material-ready-grid mt-6">
        {/* Detected Topics */}
        <div className="material-box">
          <h4 className="font-semibold text-sm mb-3">Detected Topics</h4>
          <ul className="material-list">
            {topics.map((t, i) => (
              <li key={i} className="material-list-item">
                <span className="dot" /> {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Key Concepts */}
        <div className="material-box">
          <h4 className="font-semibold text-sm mb-3">Key Concepts</h4>
          <ul className="material-list">
            {concepts.map((c, i) => (
              <li key={i} className="material-list-item">
                <span className="dot dot-accent" /> {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="material-actions mt-8">
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/summaries', { state: { material } })}
        >
          <FileText size={18} /> View Summary
        </button>

        <button
          className="btn btn-secondary btn-lg"
          onClick={() => navigate('/doubts', { state: { material } })}
        >
          <MessageCircleQuestion size={18} /> Ask a Doubt
        </button>

        <button
          className="btn btn-secondary btn-lg"
          onClick={() => navigate('/quiz', { state: { material } })}
        >
          <Brain size={18} /> Take Quiz
        </button>

        <button
          className="btn btn-secondary btn-lg"
          onClick={() => navigate('/flashcards', { state: { material } })}
        >
          <Layers size={18} /> Flashcards
        </button>
      </div>
    </div>
  );
}
