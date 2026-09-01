import { CheckCircle2, Loader2, Sparkles, FileText, Database } from 'lucide-react';
import './ProcessingStatus.css';

export default function ProcessingStatus({ step, fileName }) {
  const steps = [
    { id: 'extract', label: 'Extracting text & page structures' },
    { id: 'chunk', label: 'Chunking document into semantic blocks' },
    { id: 'topics', label: 'Detecting topics & key concepts' },
    { id: 'vector', label: 'Generating vector embeddings & indexing' },
  ];

  return (
    <div className="card processing-card animate-scale-in">
      <div className="processing-header">
        <div className="processing-icon">
          <Sparkles size={28} className="animate-spin-slow" />
        </div>
        <div>
          <h3 className="card-title">Processing {fileName || 'Material'}</h3>
          <p className="card-subtitle">AI is building your study companion index...</p>
        </div>
      </div>

      <div className="processing-steps mt-6">
        {steps.map((s, index) => {
          const isDone = index < step;
          const isCurrent = index === step;

          return (
            <div key={s.id} className={`processing-step ${isDone ? 'done' : isCurrent ? 'current' : ''}`}>
              <div className="step-indicator">
                {isDone ? (
                  <CheckCircle2 size={20} className="text-success" />
                ) : isCurrent ? (
                  <Loader2 size={20} className="spinner text-accent" />
                ) : (
                  <div className="step-number">{index + 1}</div>
                )}
              </div>
              <span className="step-label">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
