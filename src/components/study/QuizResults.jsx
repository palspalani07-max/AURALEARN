import {
  Trophy, Target, Clock, RefreshCw, CheckCircle2,
  XCircle, AlertTriangle, ArrowUpRight, RotateCcw
} from 'lucide-react';
import { getScoreColor } from '../../utils/helpers';
import './QuizResults.css';

export default function QuizResults({ results, onRetake }) {
  if (!results) return null;

  const {
    score,
    accuracy,
    totalQuestions,
    correctCount,
    avgResponseTime,
    answersChangedCount,
    confidentCorrect,
    hesitantCorrect,
    confidentWrong,
    delta,
    questions,
    userAnswers,
  } = results;

  return (
    <div className="card quiz-results-card animate-scale-in">
      {/* Header */}
      <div className="results-header">
        <div className="results-trophy">
          <Trophy size={40} className="text-accent" />
        </div>
        <h2 className="results-title">Quiz Completed!</h2>
        <p className="results-subtitle">Here is your detailed accuracy & confidence calibration breakdown</p>
      </div>

      {/* Primary Score Ring & Summary Grid */}
      <div className="dashboard-grid mt-6">
        <div className="card text-center flex-col items-center justify-center p-6">
          <div className="results-score-value" style={{ color: getScoreColor(score) }}>
            {score}%
          </div>
          <div className="text-sm font-semibold text-secondary mt-1">Accuracy Score</div>
          <div className="badge badge-success mt-2">
            <ArrowUpRight size={12} /> {delta} vs previous attempt
          </div>
        </div>

        <div className="card p-6 flex flex-col justify-center gap-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-secondary flex items-center gap-1"><Target size={14} /> Correct Answers:</span>
            <span className="font-semibold">{correctCount} / {totalQuestions}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-secondary flex items-center gap-1"><Clock size={14} /> Avg Response Time:</span>
            <span className="font-semibold">{avgResponseTime} seconds</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-secondary flex items-center gap-1"><RefreshCw size={14} /> Answers Changed:</span>
            <span className="font-semibold">{answersChangedCount}</span>
          </div>
        </div>

        {/* Confidence Calibration Breakdown */}
        <div className="card span-2 p-6">
          <h4 className="font-semibold text-sm mb-4">Confidence Calibration Matrix</h4>
          <div className="calibration-grid">
            <div className="calibration-box calibration-box--confident-correct">
              <div className="calibration-count">{confidentCorrect}</div>
              <div className="calibration-label">Confident Correct</div>
              <span className="text-xs text-tertiary">High Mastery</span>
            </div>

            <div className="calibration-box calibration-box--hesitant-correct">
              <div className="calibration-count">{hesitantCorrect}</div>
              <div className="calibration-label">Hesitant Correct</div>
              <span className="text-xs text-tertiary">Lucky / Unsure</span>
            </div>

            <div className="calibration-box calibration-box--confident-wrong">
              <div className="calibration-count">{confidentWrong}</div>
              <div className="calibration-label">Confident Wrong</div>
              <span className="text-xs text-tertiary">Misconception Risk</span>
            </div>
          </div>
        </div>

        {/* Question Review List */}
        <div className="card span-2 p-6">
          <h4 className="font-semibold text-sm mb-4">Question Breakdown & Explanations</h4>
          <div className="results-review-list">
            {questions.map((q, idx) => {
              const userAns = userAnswers[q.id];
              const isCorrect = userAns === q.correct_answer;

              return (
                <div key={q.id} className="results-review-item">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 size={20} className="text-success flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle size={20} className="text-danger flex-shrink-0 mt-1" />
                    )}
                    <div>
                      <p className="font-semibold text-sm">{idx + 1}. {q.question_text}</p>
                      <p className="text-xs text-secondary mt-1">
                        Your answer: <strong>{userAns || 'No Answer'}</strong> | Correct: <strong className="text-success">{q.correct_answer}</strong>
                      </p>
                      <p className="text-xs text-tertiary mt-2 bg-neutral-100 p-2 rounded">
                        💡 {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex justify-center gap-4 mt-8">
        <button className="btn btn-secondary btn-lg" onClick={onRetake}>
          <RotateCcw size={18} /> Retake Quiz
        </button>
      </div>
    </div>
  );
}
