export function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

export function daysUntil(dateStr) {
  const target = new Date(dateStr);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / 86400000);
}

export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function getScoreColor(score) {
  if (score >= 80) return 'var(--success-500)';
  if (score >= 60) return 'var(--warning-500)';
  if (score >= 40) return 'var(--accent-500)';
  return 'var(--danger-500)';
}

export function getSeverityLabel(severity) {
  if (severity >= 0.7) return { label: 'High', color: 'danger' };
  if (severity >= 0.4) return { label: 'Medium', color: 'warning' };
  return { label: 'Low', color: 'success' };
}

export function calculateKnowledgeScore({ accuracy, coverage, recency, calibration }) {
  const w = { accuracy: 0.35, coverage: 0.25, recency: 0.2, calibration: 0.2 };
  return Math.round(
    (accuracy || 0) * w.accuracy +
    (coverage || 0) * w.coverage +
    (recency || 0) * w.recency +
    (calibration || 0) * w.calibration
  );
}

export function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase();
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}
