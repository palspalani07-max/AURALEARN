import { useState } from 'react';
import {
  Mic, MicOff, Video as VideoIcon, VideoOff, Monitor,
  PhoneOff, MessageSquare, FileText, CheckCircle2, Send
} from 'lucide-react';
import './VideoRoom.css';

export default function VideoRoom({ session, onEndCall }) {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Teacher', text: 'Hello! I see your doubt regarding 3NF decomposition.' },
  ]);
  const [input, setInput] = useState('');
  const [callEnded, setCallEnded] = useState(false);
  const [teacherNote, setTeacherNote] = useState('');
  const [resolved, setResolved] = useState(true);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'Me', text: input.trim() }]);
    setInput('');
  };

  const handleLeave = () => {
    setCallEnded(true);
  };

  const handleSubmitSummary = (e) => {
    e.preventDefault();
    if (onEndCall) onEndCall({ teacherNote, resolved });
  };

  if (callEnded) {
    return (
      <div className="card call-summary-card animate-scale-in">
        <h3 className="card-title">Live Call Ended</h3>
        <p className="card-subtitle">Log notes and mark doubt resolution state</p>

        <form onSubmit={handleSubmitSummary} className="mt-6 flex flex-col gap-4">
          <div className="input-group">
            <label className="input-label">Teacher Session Notes</label>
            <textarea
              className="input textarea"
              rows={3}
              placeholder="e.g. Explained lossless join condition for 3NF decomposition..."
              value={teacherNote}
              onChange={(e) => setTeacherNote(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="resolvedCheck"
              checked={resolved}
              onChange={(e) => setResolved(e.target.checked)}
            />
            <label htmlFor="resolvedCheck" className="font-semibold text-sm">
              Mark doubt as resolved in student history
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-lg mt-4">
            <CheckCircle2 size={18} /> Save & Log Session
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="card video-room-card animate-scale-in">
      <div className="video-room-grid">
        {/* Main Video & Material Area */}
        <div className="video-main-area">
          {/* Video Streams */}
          <div className="video-streams-grid">
            <div className="video-box remote-video">
              {cameraOn ? (
                <div className="video-placeholder">
                  <div className="avatar avatar-xl">T</div>
                  <span className="video-name-tag">Dr. Priya Sharma (Teacher)</span>
                </div>
              ) : (
                <div className="video-off-placeholder">Camera Off</div>
              )}
            </div>

            <div className="video-box local-video">
              <div className="video-placeholder">
                <div className="avatar avatar-lg">S</div>
                <span className="video-name-tag">You</span>
              </div>
            </div>
          </div>

          {/* Attached Document Viewer */}
          <div className="video-document-panel mt-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-primary-600" />
              <span className="font-semibold text-sm">Attached Material: DBMS Unit 3 - Normalization.pdf</span>
            </div>
            <div className="doc-preview-box">
              <p className="text-xs text-secondary">
                Page 4 - 3NF Lossless Join Condition: Decomposition R1, R2 must satisfy (R1 ∩ R2) → R1 or (R1 ∩ R2) → R2.
              </p>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="video-controls-bar mt-4">
            <button
              className={`btn btn-icon-lg ${micOn ? 'btn-secondary' : 'btn-danger'}`}
              onClick={() => setMicOn(!micOn)}
            >
              {micOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            <button
              className={`btn btn-icon-lg ${cameraOn ? 'btn-secondary' : 'btn-danger'}`}
              onClick={() => setCameraOn(!cameraOn)}
            >
              {cameraOn ? <VideoIcon size={20} /> : <VideoOff size={20} />}
            </button>

            <button
              className={`btn btn-icon-lg ${screenSharing ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setScreenSharing(!screenSharing)}
            >
              <Monitor size={20} />
            </button>

            <button
              className={`btn btn-icon-lg ${chatOpen ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setChatOpen(!chatOpen)}
            >
              <MessageSquare size={20} />
            </button>

            <button className="btn btn-danger btn-icon-lg" onClick={handleLeave}>
              <PhoneOff size={20} />
            </button>
          </div>
        </div>

        {/* Side Chat */}
        {chatOpen && (
          <div className="video-side-chat">
            <h4 className="font-semibold text-sm mb-3">Live Call Chat</h4>
            <div className="video-chat-messages">
              {messages.map((m) => (
                <div key={m.id} className="video-chat-msg">
                  <span className="font-semibold text-xs text-primary-700">{m.sender}:</span>
                  <p className="text-xs">{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2 mt-3">
              <input
                type="text"
                className="input input-sm"
                placeholder="Type in call chat..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm"><Send size={14} /></button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
