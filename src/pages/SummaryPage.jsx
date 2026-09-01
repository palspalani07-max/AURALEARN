import SummaryView from '../components/study/SummaryView';

export default function SummaryPage() {
  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">AI Document Summaries</h1>
        <p className="page-subtitle">Multi-mode summaries generated strictly from uploaded material.</p>
      </div>
      <SummaryView />
    </div>
  );
}
