import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatFileSize, getFileExtension } from '../../utils/helpers';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '../../utils/constants';
import './UploadZone.css';

export default function UploadZone({ onFilesSelected }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    setError(null);
    const fileList = Array.from(files);
    const validFiles = [];

    for (const file of fileList) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File ${file.name} exceeds 50MB limit.`);
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="upload-zone-container">
      <div
        className={`upload-dropzone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.pptx,.docx"
          className="upload-input-hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="upload-icon-circle">
          <Upload size={32} />
        </div>
        <h3 className="upload-title">Drag & drop your study materials</h3>
        <p className="upload-subtitle">
          Supports <strong>PDF, TXT, PPTX, DOCX</strong> up to 50MB each
        </p>
        <button type="button" className="btn btn-primary mt-4">
          Browse Files
        </button>
      </div>

      {error && (
        <div className="upload-error-alert mt-4">
          <AlertCircle size={16} /> {error}
        </div>
      )}
    </div>
  );
}
