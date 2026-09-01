import { useState } from 'react';
import { ANSWER_STYLES } from '../../utils/constants';
import { answerDoubt } from '../../services/ai';
import {
  Send, Bot, User, FileText, Sparkles, Video,
  BookOpen, CornerDownRight
} from 'lucide-react';
import './DoubtChat.css';

export default function DoubtChat({ documentTitle = 'DBMS Unit 3 - Normalization.pdf', onRaiseLiveCall }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Hello! I'm your RAG Doubt Assistant. Ask any question regarding **${documentTitle}**. All responses are strictly grounded in your uploaded material.`,
      source: `Based on: ${documentTitle}`,
    },
  ]);
  const [input, setInput] = useState('');
  const [style, setStyle] = useState(ANSWER_STYLES.SIMPLE);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const res = await answerDoubt({ question: userMsg.text, style, contextDocument: documentTitle });

    const botMsg = {
      id: Date.now() + 1,
      sender: 'bot',
      text: res.answer,
      source: res.source,
    };

    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="card doubt-chat-card animate-fade-in-up">
      <div className="card-header">
        <div>
          <div className="badge badge-primary mb-1">RAG Doubt Solver</div>
          <h3 className="card-title">Ask a Doubt</h3>
          <p className="card-subtitle flex items-center gap-1">
            <FileText size={14} /> Grounded in <strong>{documentTitle}</strong>
          </p>
        </div>

        {/* Answer Style Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-secondary font-medium">Style:</span>
          <select
            className="input select select-sm"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            <option value={ANSWER_STYLES.SIMPLE}>Simple</option>
            <option value={ANSWER_STYLES.DETAILED}>Detailed</option>
            <option value={ANSWER_STYLES.EXAMPLE}>With Example</option>
            <option value={ANSWER_STYLES.EXAM_ORIENTED}>Exam-oriented</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="chat-messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-message chat-message--${msg.sender}`}>
            <div className="chat-avatar">
              {msg.sender === 'bot' ? <Bot size={18} /> : <User size={18} />}
            </div>
            <div className="chat-bubble">
              <div className="chat-text">{msg.text}</div>
              {msg.source && (
                <div className="chat-source">
                  <BookOpen size={12} /> {msg.source}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-message chat-message--bot">
            <div className="chat-avatar"><Bot size={18} /></div>
            <div className="chat-bubble flex items-center gap-2">
              <span className="spinner spinner-sm" /> Retrieval over chunks...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form className="chat-input-form mt-4" onSubmit={handleSend}>
        <input
          type="text"
          className="input chat-input"
          placeholder="Ask a question about this material..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          <Send size={16} /> Ask AI
        </button>

        {onRaiseLiveCall && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onRaiseLiveCall({ question: input || 'Need explanation on DBMS Normalization' })}
            title="Escalate to a live video/audio call with your class teacher"
          >
            <Video size={16} className="text-accent" /> Ask Teacher Live
          </button>
        )}
      </form>
    </div>
  );
}
