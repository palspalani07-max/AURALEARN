import { useState } from 'react';
import UploadZone from '../components/upload/UploadZone';
import ProcessingStatus from '../components/upload/ProcessingStatus';
import MaterialReady from '../components/upload/MaterialReady';
import { parseFile } from '../utils/fileParser';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';

export default function UploadPage() {
  const [status, setStatus] = useState('idle'); // idle | processing | ready
  const [step, setStep] = useState(0);
  const [fileName, setFileName] = useState('');
  const [processedMaterial, setProcessedMaterial] = useState(null);

  const handleFilesSelected = async (files) => {
    const file = files[0];
    if (!file) return;

    setFileName(file.name);
    setStatus('processing');
    setStep(0);

    // Step 0: Extract text
    const parsedData = await parseFile(file);
    setStep(1);

    // Step 1: Chunking simulation
    await new Promise((r) => setTimeout(r, 800));
    setStep(2);

    // Step 2: Topic detection simulation
    await new Promise((r) => setTimeout(r, 800));
    setStep(3);

    // Step 3: Embeddings generation simulation
    await new Promise((r) => setTimeout(r, 800));

    setProcessedMaterial({
      title: file.name,
      wordCount: parsedData.wordCount,
      estimatedStudyTime: `${Math.max(15, Math.ceil(parsedData.wordCount / 100))} mins`,
      topics: [
        'Core Principles & Foundational Concepts',
        'Detailed Mechanics & Architectural Components',
        'Practical Applications & Problem Solving',
      ],
      concepts: [
        'Key Definition 1',
        'System Architecture Rule A',
        'Optimization & Trade-offs',
      ],
    });

    setStatus('ready');
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Upload Study Material</h1>
        <p className="page-subtitle">
          AI processes your documents to create personalized summaries, RAG doubts solver, quizzes & flashcards.
        </p>
      </div>

      {status === 'idle' && <UploadZone onFilesSelected={handleFilesSelected} />}
      {status === 'processing' && <ProcessingStatus step={step} fileName={fileName} />}
      {status === 'ready' && <MaterialReady material={processedMaterial} />}
    </div>
  );
}
