export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  CLASS_TEACHER: 'class_teacher',
  PARENT: 'parent',
};

export const SUMMARY_MODES = {
  QUICK: { id: 'quick', label: 'Quick', icon: 'Zap', desc: 'Key points in 2-3 paragraphs' },
  DETAILED: { id: 'detailed', label: 'Detailed', icon: 'FileText', desc: 'Comprehensive summary with all sections' },
  EXAM_REVISION: { id: 'exam_revision', label: 'Exam Revision Notes', icon: 'GraduationCap', desc: 'Structured for last-minute revision' },
  IMPORTANT_POINTS: { id: 'important_points', label: 'Important Points', icon: 'Star', desc: 'Bullet-point highlights' },
  SIMPLIFIED: { id: 'simplified', label: 'Simplified', icon: 'Smile', desc: 'Easy-to-understand language' },
};

export const QUIZ_TYPES = {
  MCQ: 'mcq',
  SHORT_ANSWER: 'short_answer',
  TRUE_FALSE: 'true_false',
  FILL_BLANK: 'fill_blank',
};

export const QUIZ_SCOPES = {
  WHOLE_DOCUMENT: 'whole_document',
  TOPIC: 'topic',
  WEAK_TOPICS: 'weak_topics',
  PAST_MISTAKES: 'past_mistakes',
};

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

export const ANSWER_STYLES = {
  SIMPLE: 'simple',
  DETAILED: 'detailed',
  EXAMPLE: 'example',
  EXAM_ORIENTED: 'exam_oriented',
};

export const CONFIDENCE_LEVELS = [
  { value: 1, label: 'Very Unsure', color: 'var(--danger-400)' },
  { value: 2, label: 'Unsure', color: 'var(--warning-400)' },
  { value: 3, label: 'Neutral', color: 'var(--neutral-400)' },
  { value: 4, label: 'Confident', color: 'var(--success-400)' },
  { value: 5, label: 'Very Confident', color: 'var(--success-600)' },
];

export const ACCEPTED_FILE_TYPES = {
  'application/pdf': '.pdf',
  'text/plain': '.txt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const LIVE_REQUEST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const NAV_ITEMS = {
  [ROLES.STUDENT]: [
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/upload', label: 'Upload', icon: 'Upload' },
    { path: '/summaries', label: 'Summaries', icon: 'FileText' },
    { path: '/doubts', label: 'Ask Doubt', icon: 'MessageCircleQuestion' },
    { path: '/quiz', label: 'Quiz', icon: 'Brain' },
    { path: '/flashcards', label: 'Flashcards', icon: 'Layers' },
    { path: '/exam-prep', label: 'Exam Prep', icon: 'GraduationCap' },
    { path: '/live', label: 'Live Help', icon: 'Video' },
  ],
  [ROLES.TEACHER]: [
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/class', label: 'My Class', icon: 'Users' },
    { path: '/roster', label: 'Roster', icon: 'ClipboardList' },
    { path: '/assignments', label: 'Assignments', icon: 'BookOpen' },
    { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
    { path: '/live', label: 'Live Requests', icon: 'Video' },
  ],
  [ROLES.CLASS_TEACHER]: [
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/class', label: 'My Class', icon: 'Users' },
    { path: '/roster', label: 'Roster', icon: 'ClipboardList' },
    { path: '/assignments', label: 'Assignments', icon: 'BookOpen' },
    { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
    { path: '/live', label: 'Live Requests', icon: 'Video' },
  ],
  [ROLES.PARENT]: [
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/progress', label: 'Progress', icon: 'TrendingUp' },
    { path: '/reports', label: 'Reports', icon: 'FileText' },
    { path: '/settings', label: 'Settings', icon: 'Settings' },
  ],
};
