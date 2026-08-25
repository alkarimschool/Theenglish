export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  password?: string;
  email?: string;
  nip?: string;
  assignedLevelIds: string[]; // for teachers, e.g. ['smp-7']
  isActive: boolean;
  status?: 'active' | 'inactive';
  createdAt: string;
}

export interface Level {
  id: string;
  name: string; // e.g. "Jenjang TK", "Jenjang SD", "Jenjang SMP", "Jenjang SMA"
  grade: string; // e.g. "TK", "SD", "SMP", "SMA"
  schoolType: 'TK' | 'SD' | 'SMP' | 'SMA';
  educationLevel?: 'TK' | 'SD' | 'SMP' | 'SMA';
  numericGrade: number; // 0 for TK, 1-6 for SD, 7-9 for SMP, 10-12 for SMA
  description: string;
  iconName: string;
  color: string;
  order: number;
  classes?: string[]; // Mapped class names for this level
}

export interface Category {
  id: string; // 'expression' | 'vocabulary' | 'dialogue' | 'speech' | 'grammar'
  name: string;
  description: string;
  iconName: string;
  color: string;
  order: number;
}

export interface VocabularyItem {
  id: string;
  word: string;
  phonetic?: string;
  partOfSpeech?: string; // verb, noun, adj, etc.
  meaning: string;
  example: string;
  exampleTranslation?: string;
}

export interface DialogueTurn {
  id: string;
  speaker: string;
  text: string;
  translation: string;
}

export type DialogueItem = DialogueTurn;

export interface LearningMaterial {
  id: string;
  topicId: string;
  summary: string;
  contentMarkdown: string;
  vocabularyList: VocabularyItem[];
  dialogueSamples: DialogueTurn[];
  keyPoints: string[];
  tips: string[];
  audioNotes?: string;
  imageUrl?: string;
  videoUrl?: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  levelId: string;
  categoryId: string;
  title: string;
  theme: string;
  description: string;
  order?: number;
  isPublished: boolean;
  isLocked?: boolean;
  lockMessage?: string;
  questionCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Question {
  id: string;
  topicId: string;
  levelId: string;
  categoryId: string;
  questionNumber?: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  createdAt?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  className: string;
  levelId: string;
  createdAt: string;
  lastActive: string;
}

export interface StudentAnswer {
  questionId: string;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  isCorrect: boolean;
}

export interface StudentAttempt {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  levelId: string;
  categoryId: string;
  topicId: string;
  topicTitle: string;
  startedAt: string;
  completedAt: string;
  totalQuestions: number;
  score: number;
  percentage?: number;
  correctCount: number;
  incorrectCount: number;
  timeElapsedSec?: number;
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>; // questionId -> selectedOption
}

export interface StudentCategoryProgress {
  categoryId: string;
  categoryName: string;
  completedTopics: number;
  totalTopics: number;
  averageScore: number;
}

export interface StudentSummaryReport {
  studentId: string;
  studentName: string;
  className: string;
  levelId: string;
  totalAttempts: number;
  averageScore: number;
  categoryScores: {
    vocabulary?: number | null;
    dialogue?: number | null;
    expression?: number | null;
    speech?: number | null;
    grammar?: number | null;
    [key: string]: number | null | undefined;
  };
  lastActive: string;
}

export type StudentProgress = StudentSummaryReport;

export interface DashboardStats {
  totalTeachers: number;
  totalStudents: number;
  totalTopics: number;
  totalQuestions: number;
  totalAttempts: number;
  averageScore: number;
  completionRate: number;
  recentAttempts: StudentAttempt[];
  topTopics: { topicId: string; title: string; count: number; avgScore: number }[];
  lowestTopics: { topicId: string; title: string; count: number; avgScore: number }[];
}
