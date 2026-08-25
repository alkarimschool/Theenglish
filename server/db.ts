import fs from 'fs';
import path from 'path';
import {
  Level,
  Category,
  User,
  Topic,
  LearningMaterial,
  Question,
  StudentProfile,
  StudentAttempt,
  DashboardStats,
  StudentSummaryReport,
} from '../src/types';
import { generateSeedData } from './seedData';

interface DatabaseSchema {
  levels: Level[];
  categories: Category[];
  users: User[];
  topics: Topic[];
  learning_materials: LearningMaterial[];
  questions: Question[];
  students: StudentProfile[];
  attempts: StudentAttempt[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'alkarim_db.json');

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadOrInit();
  }

  private loadOrInit(): DatabaseSchema {
    const seed = generateSeedData();
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.levels) && Array.isArray(parsed.questions)) {
          // Ensure all 14 levels are present in database and keep display names updated
          seed.levels.forEach((sl) => {
            const existing = parsed.levels.find((l: Level) => l.id === sl.id);
            if (!existing) {
              parsed.levels.push(sl);
            } else {
              existing.name = existing.name || sl.name;
              existing.grade = existing.grade || sl.grade;
              existing.description = existing.description || sl.description;
            }
          });

          // Ensure each level has at least initial seed topics & questions if empty
          const existingTopicLevelIds = new Set((parsed.topics || []).map((t: Topic) => t.levelId));
          seed.topics.forEach((st) => {
            if (!existingTopicLevelIds.has(st.levelId) || !parsed.topics.some((t: Topic) => t.id === st.id)) {
              if (!parsed.topics.some((t: Topic) => t.id === st.id)) {
                parsed.topics.push(st);
              }
              const stMat = seed.materials.find((m) => m.topicId === st.id);
              if (stMat && !parsed.learning_materials.some((m: LearningMaterial) => m.topicId === st.id)) {
                parsed.learning_materials.push(stMat);
              }
              const stQuestions = seed.questions.filter((q) => q.topicId === st.id);
              stQuestions.forEach((sq) => {
                if (!parsed.questions.some((q: Question) => q.id === sq.id)) {
                  parsed.questions.push(sq);
                }
              });
            }
          });

          this.saveData(parsed);
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Error reading db file, re-initializing with seed data:', err);
    }

    const initial: DatabaseSchema = {
      levels: seed.levels,
      categories: seed.categories,
      users: seed.users,
      topics: seed.topics,
      learning_materials: seed.materials,
      questions: seed.questions,
      students: seed.students,
      attempts: seed.attempts,
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save database to disk:', err);
    }
  }

  public resetToSeed() {
    const seed = generateSeedData();
    this.data = {
      levels: seed.levels,
      categories: seed.categories,
      users: seed.users,
      topics: seed.topics,
      learning_materials: seed.materials,
      questions: seed.questions,
      students: seed.students,
      attempts: seed.attempts,
    };
    this.saveData();
    return this.data;
  }

  public reloadFromDisk(): DatabaseSchema {
    this.data = this.loadOrInit();
    return this.data;
  }

  // --- USERS & AUTH ---
  public getUsers() {
    return this.data.users;
  }

  public getUserById(idOrUsername: string) {
    return this.data.users.find((u) => u.id === idOrUsername || u.username === idOrUsername);
  }

  public getUserByUsername(username: string) {
    const uName = (username || '').toLowerCase();
    return this.data.users.find((u) => (u.username || '').toLowerCase() === uName);
  }

  public createUser(userData: Omit<User, 'id' | 'createdAt'>) {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.saveData();
    return newUser;
  }

  public updateUser(idOrUsername: string, updates: Partial<User>) {
    const idx = this.data.users.findIndex((u) => u.id === idOrUsername || u.username === idOrUsername);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.saveData();
    return this.data.users[idx];
  }

  public deleteUser(idOrUsername: string) {
    const idx = this.data.users.findIndex((u) => u.id === idOrUsername || u.username === idOrUsername);
    if (idx === -1) return false;
    this.data.users.splice(idx, 1);
    this.saveData();
    return true;
  }

  // --- LEVELS & CATEGORIES ---
  public getLevels() {
    return [...this.data.levels].sort((a, b) => a.order - b.order);
  }

  public getLevelById(id: string) {
    return this.data.levels.find((l) => l.id === id);
  }

  public updateLevel(id: string, updates: Partial<Level>) {
    const idx = this.data.levels.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    this.data.levels[idx] = {
      ...this.data.levels[idx],
      ...updates,
    };
    this.saveData();
    return this.data.levels[idx];
  }

  public syncLevelsFromStudents() {
    let updatedCount = 0;
    const levelClassMap: Record<string, Set<string>> = {};

    (this.data.students || []).forEach((st) => {
      if (st.levelId && st.className) {
        if (!levelClassMap[st.levelId]) {
          levelClassMap[st.levelId] = new Set();
        }
        levelClassMap[st.levelId].add(st.className.trim());
      }
    });

    this.data.levels.forEach((lvl) => {
      const classes = levelClassMap[lvl.id];
      if (classes && classes.size > 0) {
        const classList = Array.from(classes);
        const primaryClassName = classList.join(', ');
        if (lvl.name !== primaryClassName) {
          lvl.name = primaryClassName;
          lvl.grade = classList[0];
          updatedCount++;
        }
      }
    });

    if (updatedCount > 0) {
      this.saveData();
    }

    return { levels: this.getLevels(), updatedCount };
  }

  public getCategories() {
    return [...this.data.categories].sort((a, b) => a.order - b.order);
  }

  public getCategoryById(id: string) {
    return this.data.categories.find((c) => c.id === id);
  }

  // --- TOPICS ---
  public getTopics(filters?: { levelId?: string; categoryId?: string; userLevelIds?: string[] }) {
    let list = this.data.topics;
    if (filters?.userLevelIds && filters.userLevelIds.length > 0) {
      list = list.filter((t) => filters.userLevelIds!.includes(t.levelId));
    }
    if (filters?.levelId) {
      list = list.filter((t) => t.levelId === filters.levelId);
    }
    if (filters?.categoryId) {
      list = list.filter((t) => t.categoryId === filters.categoryId);
    }

    return list.map((t) => {
      const qCount = this.data.questions.filter((q) => q.topicId === t.id).length;
      return { ...t, questionCount: qCount };
    });
  }

  public getTopicById(id: string) {
    const topic = this.data.topics.find((t) => t.id === id);
    if (!topic) return null;
    const qCount = this.data.questions.filter((q) => q.topicId === topic.id).length;
    return { ...topic, questionCount: qCount };
  }

  public createTopic(topicData: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = `topic-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newTopic: Topic = {
      ...topicData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.topics.push(newTopic);

    // Also initialize an empty learning material record for this topic
    const newMat: LearningMaterial = {
      id: `mat-${id}`,
      topicId: id,
      summary: `Materi pembelajaran untuk ${topicData.title}`,
      contentMarkdown: `### ${topicData.title}\n\nMasukkan materi penjelasan lengkap di sini...`,
      vocabularyList: [],
      dialogueSamples: [],
      keyPoints: ['Pahami konsep utama', 'Perhatikan contoh penggunaan'],
      tips: ['Latihlah pengucapan dengan suara lantang'],
      updatedAt: new Date().toISOString(),
    };
    this.data.learning_materials.push(newMat);

    this.saveData();
    return newTopic;
  }

  public updateTopic(id: string, updates: Partial<Topic>) {
    const idx = this.data.topics.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.data.topics[idx] = {
      ...this.data.topics[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveData();
    return this.data.topics[idx];
  }

  public duplicateTopic(topicId: string, newTitle?: string, newTheme?: string, targetLevelId?: string) {
    const sourceTopic = this.getTopicById(topicId);
    if (!sourceTopic) return null;

    const sourceMaterial = this.getLearningMaterialByTopicId(topicId);
    const sourceQuestions = this.getQuestions({ topicId });

    const newId = `topic-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const duplicatedTopic: Topic = {
      ...sourceTopic,
      id: newId,
      levelId: targetLevelId || sourceTopic.levelId,
      title: newTitle || `${sourceTopic.title} (Copy)`,
      theme: newTheme || sourceTopic.theme,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.topics.push(duplicatedTopic);

    if (sourceMaterial) {
      const duplicatedMaterial: LearningMaterial = {
        ...sourceMaterial,
        id: `mat-${newId}`,
        topicId: newId,
        updatedAt: new Date().toISOString(),
      };
      this.data.learning_materials.push(duplicatedMaterial);
    }

    // Duplicate all questions
    sourceQuestions.forEach((q, idx) => {
      this.data.questions.push({
        ...q,
        id: `q-${newId}-${idx + 1}`,
        topicId: newId,
        levelId: duplicatedTopic.levelId,
        createdAt: new Date().toISOString(),
      });
    });

    this.saveData();
    return duplicatedTopic;
  }

  public deleteTopic(id: string) {
    const idx = this.data.topics.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    this.data.topics.splice(idx, 1);
    this.data.learning_materials = this.data.learning_materials.filter((m) => m.topicId !== id);
    this.data.questions = this.data.questions.filter((q) => q.topicId !== id);
    this.saveData();
    return true;
  }

  // --- LEARNING MATERIALS ---
  public getLearningMaterialByTopicId(topicId: string) {
    let mat = this.data.learning_materials.find((m) => m.topicId === topicId);
    if (!mat) {
      // Create fallback if missing
      mat = {
        id: `mat-${topicId}`,
        topicId,
        summary: 'Materi pembelajaran mandiri.',
        contentMarkdown: 'Materi belum diisi oleh guru.',
        vocabularyList: [],
        dialogueSamples: [],
        keyPoints: [],
        tips: [],
        updatedAt: new Date().toISOString(),
      };
      this.data.learning_materials.push(mat);
      this.saveData();
    }
    return mat;
  }

  public updateLearningMaterial(topicId: string, updates: Partial<LearningMaterial>) {
    let idx = this.data.learning_materials.findIndex((m) => m.topicId === topicId);
    if (idx === -1) {
      const newMat: LearningMaterial = {
        id: `mat-${topicId}`,
        topicId,
        summary: updates.summary || '',
        contentMarkdown: updates.contentMarkdown || '',
        vocabularyList: updates.vocabularyList || [],
        dialogueSamples: updates.dialogueSamples || [],
        keyPoints: updates.keyPoints || [],
        tips: updates.tips || [],
        audioNotes: updates.audioNotes,
        imageUrl: updates.imageUrl,
        videoUrl: updates.videoUrl,
        updatedAt: new Date().toISOString(),
      };
      this.data.learning_materials.push(newMat);
      idx = this.data.learning_materials.length - 1;
    } else {
      this.data.learning_materials[idx] = {
        ...this.data.learning_materials[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }
    this.saveData();
    return this.data.learning_materials[idx];
  }

  // --- QUESTIONS & BANK SOAL ---
  public getQuestions(filters?: { topicId?: string; levelId?: string; categoryId?: string; userLevelIds?: string[]; search?: string }) {
    let list = this.data.questions;
    if (filters?.userLevelIds && filters.userLevelIds.length > 0) {
      list = list.filter((q) => filters.userLevelIds!.includes(q.levelId));
    }
    if (filters?.topicId) {
      list = list.filter((q) => q.topicId === filters.topicId);
    }
    if (filters?.levelId) {
      list = list.filter((q) => q.levelId === filters.levelId);
    }
    if (filters?.categoryId) {
      list = list.filter((q) => q.categoryId === filters.categoryId);
    }
    if (filters?.search) {
      const qLower = filters.search.toLowerCase();
      list = list.filter((q) => (q.questionText || '').toLowerCase().includes(qLower) || (q.explanation || '').toLowerCase().includes(qLower));
    }
    return list.sort((a, b) => a.questionNumber - b.questionNumber);
  }

  public getQuestionById(id: string) {
    return this.data.questions.find((q) => q.id === id);
  }

  public createQuestion(qData: Omit<Question, 'id' | 'createdAt'>) {
    const newQ: Question = {
      ...qData,
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.questions.push(newQ);
    this.saveData();
    return newQ;
  }

  public updateQuestion(id: string, updates: Partial<Question>) {
    const idx = this.data.questions.findIndex((q) => q.id === id);
    if (idx === -1) return null;
    this.data.questions[idx] = { ...this.data.questions[idx], ...updates };
    this.saveData();
    return this.data.questions[idx];
  }

  public deleteQuestion(id: string) {
    const idx = this.data.questions.findIndex((q) => q.id === id);
    if (idx === -1) return false;
    this.data.questions.splice(idx, 1);
    this.saveData();
    return true;
  }

  public bulkDeleteQuestions(ids: string[]) {
    const set = new Set(ids);
    const beforeCount = this.data.questions.length;
    this.data.questions = this.data.questions.filter((q) => !set.has(q.id));
    this.saveData();
    return beforeCount - this.data.questions.length;
  }

  public bulkMoveQuestions(ids: string[], targetTopicId: string, targetLevelId?: string, targetCategoryId?: string) {
    const topic = this.getTopicById(targetTopicId);
    if (!topic) return 0;
    const set = new Set(ids);
    let updated = 0;
    this.data.questions.forEach((q) => {
      if (set.has(q.id)) {
        q.topicId = targetTopicId;
        q.levelId = targetLevelId || topic.levelId;
        q.categoryId = targetCategoryId || topic.categoryId;
        updated++;
      }
    });
    this.saveData();
    return updated;
  }

  public bulkImportQuestions(
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
  ) {
    const existing = this.getQuestions({ topicId });
    let startNumber = existing.length + 1;
    const createdList: Question[] = [];

    items.forEach((item) => {
      const q: Question = {
        id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        topicId,
        levelId,
        categoryId,
        questionNumber: startNumber++,
        questionText: item.questionText,
        optionA: item.optionA,
        optionB: item.optionB,
        optionC: item.optionC,
        optionD: item.optionD,
        correctAnswer: item.correctAnswer || 'A',
        explanation: item.explanation || 'Jawaban yang tepat adalah opsi ' + item.correctAnswer,
        createdAt: new Date().toISOString(),
      };
      this.data.questions.push(q);
      createdList.push(q);
    });

    this.saveData();
    return createdList;
  }

  // --- STUDENTS & ATTEMPTS ---
  public detectLevelFromClassName(className: string, defaultLevelId: string = 'sd-4'): string {
    const c = (className || '').toUpperCase().trim();
    if (!c) return defaultLevelId;

    if (c.includes('TK A') || c === 'TKA') return 'tk-a';
    if (c.includes('TK B') || c === 'TKB' || c.includes('TK')) return 'tk-b';

    // SMA (10, 11, 12)
    if (c.includes('SMA 10') || c.includes('KELAS 10') || c.includes('KLAS 10') || c.includes('X ') || c.endsWith('X') || c.includes('10')) return 'sma-10';
    if (c.includes('SMA 11') || c.includes('KELAS 11') || c.includes('KLAS 11') || c.includes('XI ') || c.endsWith('XI') || c.includes('11')) return 'sma-11';
    if (c.includes('SMA 12') || c.includes('KELAS 12') || c.includes('KLAS 12') || c.includes('XII ') || c.endsWith('XII') || c.includes('12')) return 'sma-12';

    // SMP (7, 8, 9)
    if (c.includes('SMP 7') || c.includes('KELAS 7') || c.includes('KLAS 7') || c.includes('VII ') || c.endsWith('VII') || c.includes('7')) return 'smp-7';
    if (c.includes('SMP 8') || c.includes('KELAS 8') || c.includes('KLAS 8') || c.includes('VIII ') || c.endsWith('VIII') || c.includes('8')) return 'smp-8';
    if (c.includes('SMP 9') || c.includes('KELAS 9') || c.includes('KLAS 9') || c.includes('IX ') || c.endsWith('IX') || c.includes('9')) return 'smp-9';

    // SD (1, 2, 3, 4, 5, 6)
    if (c.includes('SD 1') || c.includes('KELAS 1') || c.includes('KLAS 1') || c.includes('1 ') || c.endsWith('1')) return 'sd-1';
    if (c.includes('SD 2') || c.includes('KELAS 2') || c.includes('KLAS 2') || c.includes('2 ') || c.endsWith('2')) return 'sd-2';
    if (c.includes('SD 3') || c.includes('KELAS 3') || c.includes('KLAS 3') || c.includes('3 ') || c.endsWith('3')) return 'sd-3';
    if (c.includes('SD 4') || c.includes('KELAS 4') || c.includes('KLAS 4') || c.includes('4 ') || c.endsWith('4')) return 'sd-4';
    if (c.includes('SD 5') || c.includes('KELAS 5') || c.includes('KLAS 5') || c.includes('5 ') || c.endsWith('5')) return 'sd-5';
    if (c.includes('SD 6') || c.includes('KELAS 6') || c.includes('KLAS 6') || c.includes('6 ') || c.endsWith('6')) return 'sd-6';

    return defaultLevelId;
  }

  public bulkRegisterStudents(
    students: Array<{ name: string; className: string; levelId?: string }>,
    defaultLevelId: string = 'sd-4'
  ): { count: number; createdCount: number; updatedCount: number; students: StudentProfile[] } {
    let createdCount = 0;
    let updatedCount = 0;
    const processedList: StudentProfile[] = [];

    students.forEach((item) => {
      const trimmedName = (item.name || '').trim();
      const trimmedClass = (item.className || '').trim();
      if (!trimmedName || !trimmedClass) return;

      const targetLevelId = item.levelId || this.detectLevelFromClassName(trimmedClass, defaultLevelId);

      let existing = this.data.students.find(
        (s) =>
          (s.name || '').toLowerCase() === trimmedName.toLowerCase() &&
          (s.className || '').toLowerCase() === trimmedClass.toLowerCase()
      );

      if (!existing) {
        // Also check by name only if in same level
        existing = this.data.students.find(
          (s) => (s.name || '').toLowerCase() === trimmedName.toLowerCase() && s.levelId === targetLevelId
        );
      }

      if (existing) {
        existing.className = trimmedClass;
        existing.levelId = targetLevelId;
        existing.lastActive = new Date().toISOString();
        updatedCount++;
        processedList.push(existing);
      } else {
        const newStudent: StudentProfile = {
          id: `std-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: trimmedName,
          className: trimmedClass,
          levelId: targetLevelId,
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
        };
        this.data.students.push(newStudent);
        createdCount++;
        processedList.push(newStudent);
      }
    });

    this.saveData();
    return {
      count: processedList.length,
      createdCount,
      updatedCount,
      students: processedList,
    };
  }

  public registerOrGetStudent(name: string, className: string, levelId: string) {
    const trimmedName = (name || '').trim();
    const trimmedClass = (className || '').trim();
    let student = this.data.students.find(
      (s) => (s.name || '').toLowerCase() === trimmedName.toLowerCase() && (s.className || '').toLowerCase() === trimmedClass.toLowerCase()
    );

    if (!student) {
      student = {
        id: `std-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: trimmedName,
        className: trimmedClass,
        levelId,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };
      this.data.students.push(student);
    } else {
      student.levelId = levelId;
      student.lastActive = new Date().toISOString();
    }

    this.saveData();
    return student;
  }

  public getStudents(filters?: { levelId?: string; className?: string; userLevelIds?: string[] }) {
    let list = this.data.students;
    if (filters?.userLevelIds && filters.userLevelIds.length > 0) {
      list = list.filter((s) => filters.userLevelIds!.includes(s.levelId));
    }
    if (filters?.levelId) {
      list = list.filter((s) => s.levelId === filters.levelId);
    }
    if (filters?.className) {
      const cLower = filters.className.toLowerCase();
      list = list.filter((s) => (s.className || '').toLowerCase() === cLower);
    }
    return list.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());
  }

  public getStudentById(id: string) {
    return this.data.students.find((s) => s.id === id);
  }

  public deleteStudent(idOrName: string) {
    const term = (idOrName || '').trim().toLowerCase();
    const student = this.data.students.find(
      (s) => s.id === idOrName || (s.name || '').toLowerCase() === term
    );
    if (!student) {
      // Fallback: Check if there are attempts with this studentId or name
      const hasAttempts = this.data.attempts.some(
        (a) => a.studentId === idOrName || (a.studentName || '').toLowerCase() === term
      );
      if (hasAttempts) {
        this.data.attempts = this.data.attempts.filter(
          (a) => a.studentId !== idOrName && (a.studentName || '').toLowerCase() !== term
        );
        this.saveData();
        return true;
      }
      return false;
    }

    const studentId = student.id;
    const studentNameLower = (student.name || '').toLowerCase();

    // Remove student profile
    this.data.students = this.data.students.filter((s) => s.id !== studentId);

    // Also remove all attempts belonging to this student
    this.data.attempts = this.data.attempts.filter(
      (a) => a.studentId !== studentId && (a.studentName || '').toLowerCase() !== studentNameLower
    );

    this.saveData();
    return true;
  }

  public bulkDeleteStudents(ids: string[]) {
    const set = new Set(ids.map((i) => i.toLowerCase()));
    const studentsToDelete = this.data.students.filter(
      (s) => set.has(s.id.toLowerCase()) || set.has((s.name || '').toLowerCase())
    );
    const idsToDelete = new Set(studentsToDelete.map((s) => s.id.toLowerCase()));
    const namesToDelete = new Set(studentsToDelete.map((s) => (s.name || '').toLowerCase()));

    // Also add the raw IDs passed in just in case
    ids.forEach((id) => idsToDelete.add(id.toLowerCase()));

    this.data.students = this.data.students.filter((s) => !idsToDelete.has(s.id.toLowerCase()));
    this.data.attempts = this.data.attempts.filter(
      (a) =>
        !idsToDelete.has((a.studentId || '').toLowerCase()) &&
        !namesToDelete.has((a.studentName || '').toLowerCase())
    );

    this.saveData();
    return studentsToDelete.length || ids.length;
  }

  public saveAttempt(attemptData: Omit<StudentAttempt, 'id' | 'completedAt'>) {
    const attempt: StudentAttempt = {
      ...attemptData,
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      completedAt: new Date().toISOString(),
    };
    this.data.attempts.push(attempt);

    // Update student profile lastActive
    const student = this.data.students.find((s) => s.id === attemptData.studentId);
    if (student) {
      student.lastActive = new Date().toISOString();
    }

    this.saveData();
    return attempt;
  }

  public getAttempts(filters?: {
    studentId?: string;
    levelId?: string;
    categoryId?: string;
    topicId?: string;
    userLevelIds?: string[];
    startDate?: string;
    endDate?: string;
  }) {
    let list = this.data.attempts;
    if (filters?.userLevelIds && filters.userLevelIds.length > 0) {
      list = list.filter((a) => filters.userLevelIds!.includes(a.levelId));
    }
    if (filters?.studentId) {
      list = list.filter((a) => a.studentId === filters.studentId);
    }
    if (filters?.levelId) {
      list = list.filter((a) => a.levelId === filters.levelId);
    }
    if (filters?.categoryId) {
      list = list.filter((a) => a.categoryId === filters.categoryId);
    }
    if (filters?.topicId) {
      list = list.filter((a) => a.topicId === filters.topicId);
    }
    if (filters?.startDate) {
      const start = new Date(filters.startDate);
      start.setHours(0, 0, 0, 0);
      list = list.filter((a) => new Date(a.completedAt || a.startedAt) >= start);
    }
    if (filters?.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      list = list.filter((a) => new Date(a.completedAt || a.startedAt) <= end);
    }
    return list.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  }

  // --- REPORTING & SUMMARY DATA ---
  public getStudentSummaryReports(filters?: {
    levelId?: string;
    userLevelIds?: string[];
    startDate?: string;
    endDate?: string;
  }): StudentSummaryReport[] {
    const students = this.getStudents(filters);
    return students.map((std) => {
      let attempts = this.data.attempts.filter((a) => a.studentId === std.id);
      if (filters?.startDate) {
        const start = new Date(filters.startDate);
        start.setHours(0, 0, 0, 0);
        attempts = attempts.filter((a) => new Date(a.completedAt || a.startedAt) >= start);
      }
      if (filters?.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        attempts = attempts.filter((a) => new Date(a.completedAt || a.startedAt) <= end);
      }
      const totalAttempts = attempts.length;
      const averageScore = totalAttempts > 0 ? Math.round(attempts.reduce((acc, a) => acc + a.score, 0) / totalAttempts) : 0;

      const calcCatAvg = (catId: string) => {
        const catAttempts = attempts.filter((a) => a.categoryId === catId);
        if (catAttempts.length === 0) return null;
        return Math.round(catAttempts.reduce((acc, a) => acc + a.score, 0) / catAttempts.length);
      };

      const vocabAvg = calcCatAvg('vocabulary') ?? calcCatAvg('vocab');

      return {
        id: std.id,
        name: std.name,
        studentId: std.id,
        studentName: std.name,
        className: std.className,
        levelId: std.levelId,
        totalAttempts,
        averageScore,
        categoryScores: {
          vocabulary: vocabAvg,
          vocab: vocabAvg,
          dialogue: calcCatAvg('dialogue'),
          expression: calcCatAvg('expression'),
          speech: calcCatAvg('speech'),
          grammar: calcCatAvg('grammar'),
        },
        lastActive: std.lastActive,
      };
    });
  }

  public getDashboardStats(userLevelIds?: string[]): DashboardStats {
    let filteredTopics = this.data.topics;
    let filteredQuestions = this.data.questions;
    let filteredAttempts = this.data.attempts;
    let filteredStudents = this.data.students;

    if (userLevelIds && userLevelIds.length > 0) {
      filteredTopics = filteredTopics.filter((t) => userLevelIds.includes(t.levelId));
      filteredQuestions = filteredQuestions.filter((q) => userLevelIds.includes(q.levelId));
      filteredAttempts = filteredAttempts.filter((a) => userLevelIds.includes(a.levelId));
      filteredStudents = filteredStudents.filter((s) => userLevelIds.includes(s.levelId));
    }

    const totalTeachers = this.data.users.filter((u) => u.role === 'teacher').length;
    const totalStudents = filteredStudents.length;
    const totalTopics = filteredTopics.length;
    const totalQuestions = filteredQuestions.length;
    const totalAttempts = filteredAttempts.length;
    const averageScore =
      totalAttempts > 0 ? Math.round(filteredAttempts.reduce((acc, a) => acc + a.score, 0) / totalAttempts) : 0;

    // Completion rate
    const passedCount = filteredAttempts.filter((a) => a.score >= 75).length;
    const completionRate = totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0;

    // Top and lowest topics
    const topicStats: Record<string, { title: string; count: number; totalScore: number }> = {};
    filteredAttempts.forEach((a) => {
      if (!topicStats[a.topicId]) {
        topicStats[a.topicId] = { title: a.topicTitle || 'Topic', count: 0, totalScore: 0 };
      }
      topicStats[a.topicId].count++;
      topicStats[a.topicId].totalScore += a.score;
    });

    const topicList = Object.entries(topicStats).map(([topicId, val]) => ({
      topicId,
      title: val.title,
      count: val.count,
      avgScore: Math.round(val.totalScore / val.count),
    }));

    const topTopics = [...topicList].sort((a, b) => b.avgScore - a.avgScore).slice(0, 5);
    const lowestTopics = [...topicList].sort((a, b) => a.avgScore - b.avgScore).slice(0, 5);

    return {
      totalTeachers,
      totalStudents,
      totalTopics,
      totalQuestions,
      totalAttempts,
      averageScore,
      completionRate,
      recentAttempts: filteredAttempts.slice(0, 8),
      topTopics,
      lowestTopics,
    };
  }
}

export const db = new DatabaseManager();
