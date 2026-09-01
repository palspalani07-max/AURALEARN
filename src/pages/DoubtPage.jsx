import { useNavigate } from 'react-router-dom';
import DoubtChat from '../components/study/DoubtChat';

export default function DoubtPage() {
  const navigate = useNavigate();

  const handleRaiseLiveCall = (questionDetails) => {
    navigate('/live', { state: { questionDetails } });
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">RAG Doubt Solver</h1>
        <p className="page-subtitle">Ask questions with exact citations over your personal study documents.</p>
      </div>
      <DoubtChat onRaiseLiveCall={handleRaiseLiveCall} />
    </div>
  );
}
