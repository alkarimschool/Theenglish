import {
  Level,
  Category,
  Topic,
  LearningMaterial,
  Question,
  StudentProfile,
  StudentAttempt,
  User,
  DashboardStats,
  StudentSummaryReport,
} from '../types';

let currentUserRole: string = 'student';
let currentUserLevels: string[] = [];

export function setApiAuthContext(role: string, assignedLevelIds: string[]) {
  currentUserRole = role;
  currentUserLevels = assignedLevelIds || [];
}

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'x-user-role': currentUserRole,
    'x-user-levels': JSON.stringify(currentUserLevels),
  };
};

export const api = {
  // Auth
  login: async (username: string, password: string): Promise<{ success: boolean; user: User }> => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  // Levels & Categories
  getLevels: async (): Promise<Level[]> => {
    const res = await fetch('/api/levels', { headers: getHeaders() });
    return res.json();
  },

  updateLevel: async (id: string, updates: Partial<Level>): Promise<Level> => {
    const res = await fetch(`/api/levels/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Gagal memperbarui nama kelas');
    return res.json();
  },

  syncLevelsFromStudents: async (): Promise<{ success: boolean; message: string; updatedCount: number; levels: Level[] }> => {
    const res = await fetch('/api/levels/sync-from-students', {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Gagal menyinkronkan nama kelas dari data siswa');
    return res.json();
  },

  getCategories: async (levelId?: string): Promise<Category[]> => {
    const url = levelId ? `/api/categories?levelId=${encodeURIComponent(levelId)}` : '/api/categories';
    const res = await fetch(url, { headers: getHeaders() });
    return res.json();
  },

  // Topics
  getTopics: async (filters?: { levelId?: string; categoryId?: string }): Promise<Topic[]> => {
    const params = new URLSearchParams();
    if (filters?.levelId) params.set('levelId', filters.levelId);
    if (filters?.categoryId) params.set('categoryId', filters.categoryId);
    const res = await fetch(`/api/topics?${params.toString()}`, { headers: getHeaders() });
    return res.json();
  },

  getTopicById: async (id: string): Promise<Topic> => {
    const res = await fetch(`/api/topics/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Topic not found');
    return res.json();
  },

  createTopic: async (data: Partial<Topic>): Promise<Topic> => {
    const res = await fetch('/api/topics', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create topic');
    }
    return res.json();
  },

  updateTopic: async (id: string, updates: Partial<Topic>): Promise<Topic> => {
    const res = await fetch(`/api/topics/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update topic');
    return res.json();
  },

  duplicateTopic: async (
    id: string,
    payload: string | { newTitle?: string; newTheme?: string; targetLevelId?: string }
  ): Promise<Topic> => {
    const body = typeof payload === 'string' ? { newTitle: payload } : payload;
    const res = await fetch(`/api/topics/${id}/duplicate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Failed to duplicate topic');
    return res.json();
  },

  deleteTopic: async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/topics/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.ok;
  },

  // Learning Materials
  getLearningMaterial: async (topicId: string): Promise<LearningMaterial> => {
    const res = await fetch(`/api/learning-materials/${topicId}`, { headers: getHeaders() });
    return res.json();
  },

  getMaterial: async (topicId: string): Promise<LearningMaterial> => {
    const res = await fetch(`/api/learning-materials/${topicId}`, { headers: getHeaders() });
    return res.json();
  },

  updateLearningMaterial: async (topicId: string, data: Partial<LearningMaterial>): Promise<LearningMaterial> => {
    const res = await fetch(`/api/learning-materials/${topicId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateMaterial: async (topicId: string, data: Partial<LearningMaterial>): Promise<LearningMaterial> => {
    const res = await fetch(`/api/learning-materials/${topicId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Questions
  getQuestions: async (filters?: { topicId?: string; levelId?: string; categoryId?: string; search?: string }): Promise<Question[]> => {
    const params = new URLSearchParams();
    if (filters?.topicId) params.set('topicId', filters.topicId);
    if (filters?.levelId) params.set('levelId', filters.levelId);
    if (filters?.categoryId) params.set('categoryId', filters.categoryId);
    if (filters?.search) params.set('search', filters.search);
    const res = await fetch(`/api/questions?${params.toString()}`, { headers: getHeaders() });
    return res.json();
  },

  createQuestion: async (q: Partial<Question>): Promise<Question> => {
    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(q),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create question');
    }
    return res.json();
  },

  updateQuestion: async (id: string, q: Partial<Question>): Promise<Question> => {
    const res = await fetch(`/api/questions/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(q),
    });
    return res.json();
  },

  deleteQuestion: async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/questions/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.ok;
  },

  bulkDeleteQuestions: async (ids: string[]): Promise<number> => {
    const res = await fetch('/api/questions/bulk-delete', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ ids }),
    });
    const data = await res.json();
    return data.deletedCount || 0;
  },

  bulkMoveQuestions: async (ids: string[], targetTopicId: string, targetLevelId?: string, targetCategoryId?: string): Promise<number> => {
    const res = await fetch('/api/questions/bulk-move', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ ids, targetTopicId, targetLevelId, targetCategoryId }),
    });
    const data = await res.json();
    return data.movedCount || 0;
  },

  bulkImportQuestions: async (
    items: Array<{
      questionText: string;
      optionA: string;
      optionB: string;
      optionC: string;
      optionD: string;
      correctAnswer: 'A' | 'B' | 'C' | 'D';
      explanation?: string;
    }>,
    topicId: string,
    levelId: string,
    categoryId: string
  ): Promise<{ count: number; questions: Question[] }> => {
    const res = await fetch('/api/questions/bulk-import', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ items, topicId, levelId, categoryId }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Bulk import failed');
    }
    return res.json();
  },

  // Students & Attempts
  bulkImportStudents: async (
    students: Array<{ name: string; className: string; levelId?: string }>,
    defaultLevelId?: string
  ): Promise<{ success: boolean; count: number; createdCount: number; updatedCount: number; students: StudentProfile[] }> => {
    const res = await fetch('/api/students/bulk-import', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ students, defaultLevelId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Gagal mengimpor data siswa');
    }
    return res.json();
  },

  createStudent: async (data: { name: string; className: string; levelId?: string }): Promise<StudentProfile> => {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Gagal menambahkan siswa baru');
    }
    return res.json();
  },

  startStudentSession: async (name: string, className: string, levelId: string): Promise<StudentProfile> => {
    const res = await fetch('/api/students/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, className, levelId }),
    });
    if (!res.ok) throw new Error('Failed to start student session');
    return res.json();
  },

  getStudents: async (filters?: { levelId?: string; className?: string }): Promise<StudentProfile[]> => {
    const params = new URLSearchParams();
    if (filters?.levelId) params.set('levelId', filters.levelId);
    if (filters?.className) params.set('className', filters.className);
    const res = await fetch(`/api/students?${params.toString()}`, { headers: getHeaders() });
    return res.json();
  },

  getStudentDetail: async (id: string): Promise<{ student: StudentProfile; attempts: StudentAttempt[] }> => {
    const res = await fetch(`/api/students/${id}`, { headers: getHeaders() });
    return res.json();
  },

  deleteStudent: async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/students/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Gagal menghapus data siswa');
    }
    return true;
  },

  bulkDeleteStudents: async (ids: string[]): Promise<number> => {
    const res = await fetch('/api/students/bulk-delete', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Gagal menghapus data siswa terpilih');
    }
    const data = await res.json();
    return data.deletedCount || 0;
  },

  submitAttempt: async (payload: {
    studentId?: string;
    studentName: string;
    className: string;
    levelId: string;
    categoryId: string;
    topicId: string;
    topicTitle?: string;
    startedAt?: string;
    totalQuestions?: number;
    timeElapsedSec?: number;
    answers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  }): Promise<StudentAttempt> => {
    const res = await fetch('/api/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to submit exercise attempt');
    const data = await res.json();
    return data.attempt || data;
  },

  getAttempts: async (filters?: {
    studentId?: string;
    levelId?: string;
    categoryId?: string;
    topicId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<StudentAttempt[]> => {
    const params = new URLSearchParams();
    if (filters?.studentId) params.set('studentId', filters.studentId);
    if (filters?.levelId) params.set('levelId', filters.levelId);
    if (filters?.categoryId) params.set('categoryId', filters.categoryId);
    if (filters?.topicId) params.set('topicId', filters.topicId);
    if (filters?.startDate) params.set('startDate', filters.startDate);
    if (filters?.endDate) params.set('endDate', filters.endDate);
    const res = await fetch(`/api/attempts?${params.toString()}`, { headers: getHeaders() });
    return res.json();
  },

  // Teachers (Admin)
  getTeachers: async (): Promise<User[]> => {
    const res = await fetch('/api/teachers', { headers: getHeaders() });
    return res.json();
  },

  createTeacher: async (data: Partial<User>): Promise<User> => {
    const res = await fetch('/api/teachers', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create teacher');
    }
    return res.json();
  },

  updateTeacher: async (id: string, updates: Partial<User>): Promise<User> => {
    const res = await fetch(`/api/teachers/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update teacher');
    return res.json();
  },

  deleteTeacher: async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/teachers/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Gagal menghapus akun guru');
    }
    return true;
  },

  // Reports
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await fetch('/api/reports/dashboard', { headers: getHeaders() });
    return res.json();
  },

  getStudentSummaryReports: async (filters?: { levelId?: string; startDate?: string; endDate?: string } | string): Promise<StudentSummaryReport[]> => {
    const params = new URLSearchParams();
    if (typeof filters === 'string') {
      params.set('levelId', filters);
    } else if (filters) {
      if (filters.levelId) params.set('levelId', filters.levelId);
      if (filters.startDate) params.set('startDate', filters.startDate);
      if (filters.endDate) params.set('endDate', filters.endDate);
    }
    const query = params.toString();
    const url = query ? `/api/reports/students?${query}` : '/api/reports/students';
    const res = await fetch(url, { headers: getHeaders() });
    return res.json();
  },

  getStudentProgress: async (filters?: { levelId?: string; startDate?: string; endDate?: string } | string): Promise<StudentSummaryReport[]> => {
    const params = new URLSearchParams();
    if (typeof filters === 'string') {
      params.set('levelId', filters);
    } else if (filters) {
      if (filters.levelId) params.set('levelId', filters.levelId);
      if (filters.startDate) params.set('startDate', filters.startDate);
      if (filters.endDate) params.set('endDate', filters.endDate);
    }
    const query = params.toString();
    const url = query ? `/api/reports/students?${query}` : '/api/reports/students';
    const res = await fetch(url, { headers: getHeaders() });
    return res.json();
  },

  resetDatabase: async (): Promise<boolean> => {
    const res = await fetch('/api/db/reset', {
      method: 'POST',
      headers: getHeaders(),
    });
    return res.ok;
  },
};
