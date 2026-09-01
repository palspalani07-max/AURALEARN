import { useState, useEffect } from 'react';
import { SUMMARY_MODES } from '../../utils/constants';
import { generateSummary } from '../../services/ai';
import { FileText, Copy, Download, Bookmark, Sparkles, Zap, GraduationCap, Star, Smile, Check } from 'lucide-react';
import './SummaryView.css';

export default function SummaryView({ materialTitle = 'DBMS Unit 3 - Normalization.pdf' }) {
  const [activeMode, setActiveMode] = useState('quick');
  const [summaryContent, setSummaryContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadSummary() {
      setLoading(true);
      const res = await generateSummary({ mode: activeMode, title: materialTitle });
      setSummaryContent(res);
      setLoading(false);
    }
    loadSummary();
  }, [activeMode, materialTitle]);

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getModeIcon = (modeId) => {
    switch (modeId) {
      case 'quick': return <Zap size={16} />;
      case 'detailed': return <FileText size={16} />;
      case 'exam_revision': return <GraduationCap size={16} />;
      case 'important_points': return <Star size={16} />;
      case 'simplified': return <Smile size={16} />;
      default: return <Sparkles size={16} />;
    }
  };

  return (
    <div className="card animate-fade-in-up">
      <div className="summary-header">
        <div>
          <div className="badge badge-primary mb-2">AI Summary Engine</div>
          <h2 className="card-title">{materialTitle}</h2>
          <p className="card-subtitle">Generated strictly from your uploaded document context</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button className="btn btn-secondary btn-sm">
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="summary-tabs mt-6">
        {Object.values(SUMMARY_MODES).map((mode) => (
          <button
            key={mode.id}
            className={`summary-tab ${activeMode === mode.id ? 'active' : ''}`}
            onClick={() => setActiveMode(mode.id)}
          >
            {getModeIcon(mode.id)}
            <span>{mode.label}</span>
          </button>
        ))}
      </div>

      {/* Summary Content Body */}
      <div className="summary-body mt-6">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <span className="spinner spinner-lg text-accent" />
          </div>
        ) : (
          <div className="summary-markdown">
            {summaryContent.split('\n').map((line, idx) => {
              if (line.startsWith('### ')) return <h3 key={idx} className="summary-h3">{line.replace('### ', '')}</h3>;
              if (line.startsWith('#### ')) return <h4 key={idx} className="summary-h4">{line.replace('#### ', '')}</h4>;
              if (line.startsWith('- ') || line.startsWith('• ')) return <li key={idx} className="summary-li">{line.replace(/^[-•]\s*/, '')}</li>;
              if (line.trim() === '') return <div key={idx} className="h-3" />;
              return <p key={idx} className="summary-p">{line}</p>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
