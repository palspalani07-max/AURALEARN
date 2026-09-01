import { useState, useEffect } from 'react';
import { CONFIDENCE_LEVELS, QUIZ_SCOPES, DIFFICULTY_LEVELS } from '../../utils/constants';
import { generateQuizQuestions } from '../../services/ai';
import QuizResults from './QuizResults';
import { Brain, Clock, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import './QuizEngine.css';

export default function QuizEngine({ documentTitle = 'DBMS Unit 3 - Normalization.pdf' }) {
  const [phase, setPhase] = useState('setup'); // setup | quiz | results
  const [scope, setScope] = useState(QUIZ_SCOPES.WHOLE_DOCUMENT);
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS.MEDIUM);
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [confidenceRatings, setConfidenceRatings] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resultsData, setResultsData] = useState(null);

  // Timer
  useEffect(() => {
    let timer;
    if (phase === 'quiz') {
      timer = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [phase]);

  const handleStartQuiz = async () => {
    setLoading(true);
    const generated = await generateQuizQuestions({ scope, difficulty, count });
    setQuestions(generated);
    setCurrentIndex(0);
    setUserAnswers({});
    setConfidenceRatings({});
    setElapsedSeconds(0);
    setStartTime(Date.now());
    setLoading(false);
    setPhase('quiz');
  };

  const handleSelectAnswer = (questionId, answer) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSelectConfidence = (questionId, rating) => {
    setConfidenceRatings((prev) => ({ ...prev, [questionId]: rating }));
  };

  const handleFinishQuiz = () => {
    // Calculate results breakdown
    let correctCount = 0;
    let confidentCorrect = 0;
    let hesitantCorrect = 0;
    let confidentWrong = 0;

    questions.forEach((q) => {
      const userAns = userAnswers[q.id];
      const isCorrect = userAns === q.correct_answer;
      const confidence = confidenceRatings[q.id] || 3;

      if (isCorrect) {
        correctCount++;
        if (confidence >= 4) confidentCorrect++;
        else hesitantCorrect++;
      } else {
        if (confidence >= 4) confidentWrong++;
      }
    });

    const accuracy = Math.round((correctCount / questions.length) * 100);
    const score = Math.round((correctCount / questions.length) * 100);

    setResultsData({
      score,
      accuracy,
      totalQuestions: questions.length,
      correctCount,
      avgResponseTime: Math.round(elapsedSeconds / questions.length),
      answersChangedCount: 1, // demo tracked value
      confidentCorrect,
      hesitantCorrect,
      confidentWrong,
      delta: '+5%',
      questions,
      userAnswers,
      confidenceRatings,
    });

    setPhase('results');
  };

  if (phase === 'results') {
    return <QuizResults results={resultsData} onRetake={() => setPhase('setup')} />;
  }

  if (phase === 'setup') {
    return (
      <div className="card quiz-setup-card animate-fade-in-up">
        <div className="card-header">
          <div>
            <div className="badge badge-primary mb-1">AI Quiz Generator</div>
            <h2 className="card-title">Generate Custom Quiz</h2>
            <p className="card-subtitle">Scope, difficulty and confidence calibration</p>
          </div>
        </div>

        <div className="dashboard-grid mt-6">
          <div className="input-group span-2">
            <label className="input-label">Quiz Scope</label>
            <select className="input select" value={scope} onChange={(e) => setScope(e.target.value)}>
              <option value={QUIZ_SCOPES.WHOLE_DOCUMENT}>Whole Document ({documentTitle})</option>
              <option value={QUIZ_SCOPES.TOPIC}>Specific Topic</option>
              <option value={QUIZ_SCOPES.WEAK_TOPICS}>My Weak Topics</option>
              <option value={QUIZ_SCOPES.PAST_MISTAKES}>Past Mistakes</option>
            </select>
          </div>

          <div className="input-group span-2">
            <label className="input-label">Difficulty Level</label>
            <select className="input select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value={DIFFICULTY_LEVELS.EASY}>Easy</option>
              <option value={DIFFICULTY_LEVELS.MEDIUM}>Medium</option>
              <option value={DIFFICULTY_LEVELS.HARD}>Hard</option>
            </select>
          </div>

          <div className="input-group span-2">
            <label className="input-label">Number of Questions</label>
            <div className="flex gap-2">
              {[5, 10, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`btn ${count === num ? 'btn-primary' : 'btn-secondary'} flex-1`}
                  onClick={() => setCount(num)}
                >
                  {num} Questions
                </button>
              ))}
            </div>
          </div>
        </div>

        <button className="btn btn-primary btn-lg w-full mt-8" onClick={handleStartQuiz} disabled={loading}>
          {loading ? <span className="spinner spinner-sm" /> : <Brain size={18} />}
          {loading ? 'Generating Questions...' : 'Start Quiz Now'}
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="card quiz-taking-card animate-fade-in-up">
      {/* Quiz Top Bar */}
      <div className="quiz-top-bar">
        <div className="quiz-progress-text">
          Question {currentIndex + 1} of {questions.length}
        </div>
        <div className="quiz-timer">
          <Clock size={16} /> {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {/* Question Header */}
      <div className="question-card mt-6">
        <h3 className="question-text">{currentQ.question_text}</h3>

        {/* Question Options */}
        {currentQ.type === 'mcq' || currentQ.type === 'true_false' ? (
          <div className="options-grid mt-4">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                className={`option-btn ${userAnswers[currentQ.id] === opt ? 'selected' : ''}`}
                onClick={() => handleSelectAnswer(currentQ.id, opt)}
              >
                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                <span className="option-text">{opt}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="input-group mt-4">
            <input
              type="text"
              className="input"
              placeholder="Type your answer here..."
              value={userAnswers[currentQ.id] || ''}
              onChange={(e) => handleSelectAnswer(currentQ.id, e.target.value)}
            />
          </div>
        )}

        {/* Confidence Selector */}
        <div className="confidence-section mt-8">
          <label className="input-label mb-2">Rate your confidence for this question:</label>
          <div className="confidence-buttons">
            {CONFIDENCE_LEVELS.map((c) => (
              <button
                key={c.value}
                type="button"
                className={`confidence-btn ${confidenceRatings[currentQ.id] === c.value ? 'active' : ''}`}
                onClick={() => handleSelectConfidence(currentQ.id, c.value)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="quiz-footer mt-8">
        <button
          className="btn btn-secondary"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((i) => i - 1)}
        >
          <ArrowLeft size={16} /> Previous
        </button>

        {isLast ? (
          <button className="btn btn-primary" onClick={handleFinishQuiz}>
            <CheckCircle2 size={16} /> Finish & Submit Quiz
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => setCurrentIndex((i) => i + 1)}>
            Next Question <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
