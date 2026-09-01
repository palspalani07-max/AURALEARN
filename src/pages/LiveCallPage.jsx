import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import RequestQueue from '../components/live/RequestQueue';
import VideoRoom from '../components/live/VideoRoom';
import { Video, CheckCircle2, FileText, User } from 'lucide-react';

export default function LiveCallPage() {
  const { isTeacher } = useAuth();
  const [activeSession, setActiveSession] = useState(null);
  const [studentRequested, setStudentRequested] = useState(false);

  const handleAcceptCall = (req) => {
    setActiveSession(req);
  };

  const handleStudentRequest = (e) => {
    e.preventDefault();
    setStudentRequested(true);
  };

  if (activeSession) {
    return (
      <div className="page-content">
        <VideoRoom session={activeSession} onEndCall={() => setActiveSession(null)} />
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Live Doubt Session</h1>
        <p className="page-subtitle">Free browser video + audio calls with class teachers (WebRTC enabled).</p>
      </div>

      {isTeacher ? (
        <RequestQueue onAcceptCall={handleAcceptCall} />
      ) : (
        <div className="card max-w-xl mx-auto animate-fade-in-up">
          <div className="card-header">
            <div>
              <div className="badge badge-primary mb-1">100% Free - No Paywall</div>
              <h3 className="card-title">Ask a Teacher Live</h3>
              <p className="card-subtitle">Connect directly with subject & class teachers</p>
            </div>
          </div>

          {studentRequested ? (
            <div className="p-6 text-center">
              <span className="spinner spinner-lg text-accent mb-4 mx-auto block" />
              <h4 className="font-semibold text-lg">Request Sent to Class Teachers</h4>
              <p className="text-sm text-secondary mt-1">
                Waiting for Dr. Priya Sharma to accept call... You will be connected automatically.
              </p>
              <button
                className="btn btn-secondary mt-6"
                onClick={() => handleAcceptCall({ id: 'demo', topic: 'DBMS 3NF' })}
              >
                (Demo Simulation) Join Call Now
              </button>
            </div>
          ) : (
            <form onSubmit={handleStudentRequest} className="mt-4 flex flex-col gap-4">
              <div className="input-group">
                <label className="input-label">Topic / Subject</label>
                <input type="text" className="input" defaultValue="Database Normalization (3NF)" />
              </div>

              <div className="input-group">
                <label className="input-label">Doubt Question</label>
                <textarea
                  className="input textarea"
                  rows={3}
                  defaultValue="How do we check for loss-less join in 3NF decomposition?"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Attached Document Reference</label>
                <input type="text" className="input" defaultValue="DBMS Unit 3 - Normalization.pdf" readOnly />
              </div>

              <button type="submit" className="btn btn-primary btn-lg mt-4">
                <Video size={18} /> Request Live Video Call
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
