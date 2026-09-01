import { useState } from 'react';
import { Video, Check, X, Clock, FileText, User } from 'lucide-react';
import './RequestQueue.css';

const INITIAL_REQUESTS = [
  {
    id: 'req-1',
    studentName: 'Alex Johnson',
    regNo: 'STU001',
    topic: 'Normalization 3NF Decomposition',
    question: 'How do we check for loss-less join in 3NF decomposition?',
    document: 'DBMS Unit 3 - Normalization.pdf',
    time: '2 mins ago',
    status: 'pending',
  },
  {
    id: 'req-2',
    studentName: 'Sarah Williams',
    regNo: 'STU002',
    topic: 'OSI Transport Layer',
    question: 'Difference between TCP 3-way handshake and UDP connectionless model',
    document: 'Networks Unit 1.pdf',
    time: '15 mins ago',
    status: 'pending',
  },
];

export default function RequestQueue({ onAcceptCall }) {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  const handleAccept = (req) => {
    setRequests(requests.map(r => r.id === req.id ? { ...r, status: 'accepted' } : r));
    if (onAcceptCall) {
      onAcceptCall(req);
    }
  };

  const handleDecline = (id) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'declined' } : r));
  };

  return (
    <div className="card animate-fade-in-up">
      <div className="card-header">
        <div>
          <div className="badge badge-primary mb-1">Teacher Live Queue</div>
          <h3 className="card-title">Incoming Student Live Doubt Calls</h3>
          <p className="card-subtitle">Calls from students in your assigned classes & subjects (100% Free)</p>
        </div>
      </div>

      <div className="live-requests-list mt-6">
        {requests.filter(r => r.status === 'pending').length === 0 ? (
          <div className="p-8 text-center text-secondary">
            No pending live doubt call requests right now.
          </div>
        ) : (
          requests.filter(r => r.status === 'pending').map((req) => (
            <div key={req.id} className="live-request-card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-primary-600" />
                    <span className="font-semibold">{req.studentName} ({req.regNo})</span>
                    <span className="badge badge-warning flex items-center gap-1">
                      <Clock size={12} /> {req.time}
                    </span>
                  </div>
                  <h4 className="font-semibold text-base mt-2">{req.topic}</h4>
                  <p className="text-sm text-secondary mt-1">"{req.question}"</p>
                  <span className="text-xs text-tertiary flex items-center gap-1 mt-2">
                    <FileText size={12} /> Attached: {req.document}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button className="btn btn-secondary text-danger" onClick={() => handleDecline(req.id)}>
                    <X size={16} /> Decline
                  </button>
                  <button className="btn btn-primary" onClick={() => handleAccept(req)}>
                    <Video size={16} /> Accept & Join Call
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
