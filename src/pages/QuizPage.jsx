import QuizEngine from '../components/study/QuizEngine';

export default function QuizPage() {
  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">AI Quiz Generator</h1>
        <p className="page-subtitle">Test knowledge, capture per-question confidence, and recompute your adaptive plan.</p>
      </div>
      <QuizEngine />
    </div>
  );
}
