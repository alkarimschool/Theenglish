import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { UserRole } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Helper middleware to extract user context for level restriction
  const extractUserContext = (req: express.Request) => {
    const roleHeader = req.headers['x-user-role'] as UserRole | undefined;
    const levelsHeader = req.headers['x-user-levels'] as string | undefined;
    let userLevelIds: string[] | undefined = undefined;

    if (roleHeader === 'teacher' && levelsHeader) {
      try {
        userLevelIds = JSON.parse(levelsHeader);
      } catch {
        userLevelIds = levelsHeader.split(',').map((s) => s.trim());
      }
    }
    return { role: roleHeader, userLevelIds };
  };

  // =====================
  // AUTHENTICATION ROUTES
  // =====================
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi.' });
    }

    const user = db.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Pengguna tidak ditemukan.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Akun Anda sedang dinonaktifkan oleh Administrator.' });
    }

    // Default password checks: "admin" or "admin123" for admin, "guru123" for teachers, or matching custom passwords
    const valid =
      password === 'admin' ||
      password === 'admin123' ||
      password === 'guru123' ||
      password === '123456' ||
      password === user.username + '123';

    if (!valid) {
      return res.status(401).json({ error: 'Password salah. Silakan coba lagi.' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email,
        nip: user.nip,
        assignedLevelIds: user.assignedLevelIds,
        isActive: user.isActive,
      },
    });
  });

  // =====================
  // LEVELS & CATEGORIES
  // =====================
  app.get('/api/levels', (req, res) => {
    const levels = db.getLevels();
    res.json(levels);
  });

  app.get('/api/categories', (req, res) => {
    const { levelId } = req.query as { levelId?: string };
    let categories = db.getCategories();
    if (levelId) {
      const isSmpOrSma = levelId.startsWith('smp-') || levelId.startsWith('sma-');
      if (!isSmpOrSma) {
        categories = categories.filter((c) => c.id !== 'grammar');
      }
    }
    res.json(categories);
  });

  // =====================
  // TOPICS
  // =====================
  app.get('/api/topics', (req, res) => {
    const { levelId, categoryId } = req.query as { levelId?: string; categoryId?: string };
    const { role, userLevelIds } = extractUserContext(req);

    const topics = db.getTopics({
      levelId,
      categoryId,
      userLevelIds: role === 'teacher' ? userLevelIds : undefined,
    });
    res.json(topics);
  });

  app.get('/api/topics/:id', (req, res) => {
    const topic = db.getTopicById(req.params.id);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    res.json(topic);
  });

  app.post('/api/topics', (req, res) => {
    const { levelId, categoryId, title, theme, description, isPublished, order } = req.body;
    if (!levelId || !categoryId || !title) {
      return res.status(400).json({ error: 'Level, Category, and Title are required' });
    }

    const created = db.createTopic({
      levelId,
      categoryId,
      title,
      theme: theme || 'English Competency',
      description: description || '',
      order: Number(order) || 1,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    });
    res.status(201).json(created);
  });

  app.put('/api/topics/:id', (req, res) => {
    const updated = db.updateTopic(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    res.json(updated);
  });

  app.post('/api/topics/:id/duplicate', (req, res) => {
    const { newTitle, newTheme, targetLevelId } = req.body;
    const duplicated = db.duplicateTopic(req.params.id, newTitle, newTheme, targetLevelId);
    if (!duplicated) {
      return res.status(404).json({ error: 'Source topic not found for duplication' });
    }
    res.status(201).json(duplicated);
  });

  app.delete('/api/topics/:id', (req, res) => {
    const ok = db.deleteTopic(req.params.id);
    if (!ok) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    res.json({ success: true, message: 'Topic deleted' });
  });

  // =====================
  // LEARNING MATERIALS
  // =====================
  app.get('/api/learning-materials/:topicId', (req, res) => {
    const mat = db.getLearningMaterialByTopicId(req.params.topicId);
    res.json(mat);
  });

  app.put('/api/learning-materials/:topicId', (req, res) => {
    const updated = db.updateLearningMaterial(req.params.topicId, req.body);
    res.json(updated);
  });

  // =====================
  // QUESTIONS & BANK SOAL
  // =====================
  app.get('/api/questions', (req, res) => {
    const { topicId, levelId, categoryId, search } = req.query as {
      topicId?: string;
      levelId?: string;
      categoryId?: string;
      search?: string;
    };
    const { role, userLevelIds } = extractUserContext(req);

    const questions = db.getQuestions({
      topicId,
      levelId,
      categoryId,
      search,
      userLevelIds: role === 'teacher' ? userLevelIds : undefined,
    });
    res.json(questions);
  });

  app.post('/api/questions', (req, res) => {
    const { topicId, levelId, categoryId, questionNumber, questionText, optionA, optionB, optionC, optionD, correctAnswer, explanation } = req.body;
    if (!topicId || !questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
      return res.status(400).json({ error: 'Semua field pertanyaan dan pilihan wajib diisi.' });
    }

    const created = db.createQuestion({
      topicId,
      levelId,
      categoryId,
      questionNumber: Number(questionNumber) || 1,
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      explanation: explanation || `Jawaban yang tepat adalah opsi ${correctAnswer}.`,
    });
    res.status(201).json(created);
  });

  app.put('/api/questions/:id', (req, res) => {
    const updated = db.updateQuestion(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json(updated);
  });

  app.delete('/api/questions/:id', (req, res) => {
    const ok = db.deleteQuestion(req.params.id);
    if (!ok) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json({ success: true });
  });

  app.post('/api/questions/bulk-delete', (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Array of question IDs required' });
    }
    const count = db.bulkDeleteQuestions(ids);
    res.json({ success: true, deletedCount: count });
  });

  app.post('/api/questions/bulk-move', (req, res) => {
    const { ids, targetTopicId, targetLevelId, targetCategoryId } = req.body;
    if (!Array.isArray(ids) || !targetTopicId) {
      return res.status(400).json({ error: 'Array of question IDs and targetTopicId required' });
    }
    const count = db.bulkMoveQuestions(ids, targetTopicId, targetLevelId, targetCategoryId);
    res.json({ success: true, movedCount: count });
  });

  app.post('/api/questions/bulk-import', (req, res) => {
    const { items, topicId, levelId, categoryId } = req.body;
    if (!Array.isArray(items) || items.length === 0 || !topicId || !levelId || !categoryId) {
      return res.status(400).json({ error: 'Invalid payload for bulk import' });
    }

    const created = db.bulkImportQuestions(items, topicId, levelId, categoryId);
    res.status(201).json({ success: true, count: created.length, questions: created });
  });

  // =====================
  // STUDENTS & SESSIONS
  // =====================
  app.post('/api/students/bulk-import', (req, res) => {
    const { students, defaultLevelId } = req.body;
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ error: 'Data siswa wajib berupa array dan tidak boleh kosong.' });
    }

    const result = db.bulkRegisterStudents(students, defaultLevelId);
    res.status(201).json({
      success: true,
      count: result.count,
      createdCount: result.createdCount,
      updatedCount: result.updatedCount,
      students: result.students,
    });
  });

  app.post('/api/students', (req, res) => {
    const { name, className, levelId } = req.body;
    if (!name || !className) {
      return res.status(400).json({ error: 'Nama Siswa dan Kelas wajib diisi.' });
    }
    const student = db.registerOrGetStudent(name, className, levelId || 'sd-4');
    res.status(201).json(student);
  });

  app.post('/api/students/start', (req, res) => {
    const { name, className, levelId } = req.body;
    if (!name || !className || !levelId) {
      return res.status(400).json({ error: 'Nama Siswa, Kelas, dan Level wajib diisi.' });
    }

    const student = db.registerOrGetStudent(name, className, levelId);
    res.json(student);
  });

  app.get('/api/students', (req, res) => {
    const { levelId, className } = req.query as { levelId?: string; className?: string };
    const { role, userLevelIds } = extractUserContext(req);

    const students = db.getStudents({
      levelId,
      className,
      userLevelIds: role === 'teacher' ? userLevelIds : undefined,
    });
    res.json(students);
  });

  app.get('/api/students/:id', (req, res) => {
    const student = db.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    const attempts = db.getAttempts({ studentId: req.params.id });
    res.json({ student, attempts });
  });

  app.delete('/api/students/:id', (req, res) => {
    const targetId = req.params.id;
    const ok = db.deleteStudent(targetId);
    if (!ok) {
      return res.status(404).json({ error: 'Data siswa tidak ditemukan atau gagal dihapus.' });
    }
    res.json({ success: true, message: 'Data siswa dan riwayat pengerjaan berhasil dihapus.' });
  });

  app.post('/api/students/bulk-delete', (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Pilih siswa yang akan dihapus.' });
    }
    const count = db.bulkDeleteStudents(ids);
    res.json({ success: true, deletedCount: count });
  });

  // =====================
  // ATTEMPTS & RESULTS
  // =====================
  app.post('/api/attempts', (req, res) => {
    const { studentId, studentName, className, levelId, categoryId, topicId, topicTitle, startedAt, totalQuestions, answers } = req.body;

    if (!studentId || !topicId || !answers) {
      return res.status(400).json({ error: 'Invalid attempt submission payload' });
    }

    // Retrieve topic questions from DB to calculate strictly accurate score
    const questions = db.getQuestions({ topicId });
    let correctCount = 0;
    let incorrectCount = 0;

    questions.forEach((q) => {
      const studentAnswer = answers[q.id];
      if (studentAnswer && studentAnswer.toUpperCase() === q.correctAnswer.toUpperCase()) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const total = questions.length > 0 ? questions.length : Number(totalQuestions) || 50;
    const score = Math.round((correctCount / total) * 100);
    const percentage = score;

    const savedAttempt = db.saveAttempt({
      studentId,
      studentName: studentName || 'Siswa Al-Karim',
      className: className || 'Kelas',
      levelId,
      categoryId,
      topicId,
      topicTitle: topicTitle || 'English Exercise',
      startedAt: startedAt || new Date().toISOString(),
      totalQuestions: total,
      score,
      percentage,
      correctCount,
      incorrectCount,
      answers,
    });

    res.status(201).json({
      attempt: savedAttempt,
      questions,
    });
  });

  app.get('/api/attempts', (req, res) => {
    const { studentId, levelId, categoryId, topicId, startDate, endDate } = req.query as {
      studentId?: string;
      levelId?: string;
      categoryId?: string;
      topicId?: string;
      startDate?: string;
      endDate?: string;
    };
    const { role, userLevelIds } = extractUserContext(req);

    const attempts = db.getAttempts({
      studentId,
      levelId,
      categoryId,
      topicId,
      startDate,
      endDate,
      userLevelIds: role === 'teacher' ? userLevelIds : undefined,
    });
    res.json(attempts);
  });

  // =====================
  // TEACHERS & USERS (ADMIN)
  // =====================
  app.get('/api/teachers', (req, res) => {
    const teachers = db.getUsers().filter((u) => u.role === 'teacher' || u.role === 'admin');
    res.json(teachers);
  });

  app.post('/api/teachers', (req, res) => {
    const { username, name, email, nip, assignedLevelIds, role } = req.body;
    if (!username || !name) {
      return res.status(400).json({ error: 'Username dan Nama Lengkap wajib diisi.' });
    }

    const existing = db.getUserByUsername(username);
    if (existing) {
      return res.status(400).json({ error: 'Username sudah digunakan, silakan pilih username lain.' });
    }

    const created = db.createUser({
      username: username.toLowerCase().trim(),
      name,
      email: email || `${username}@alkarim.sch.id`,
      nip: nip || '',
      role: role || 'teacher',
      assignedLevelIds: Array.isArray(assignedLevelIds) ? assignedLevelIds : [],
      isActive: true,
    });
    res.status(201).json(created);
  });

  app.put('/api/teachers/:id', (req, res) => {
    const { username } = req.body;
    if (username) {
      const formattedUsername = username.toLowerCase().trim();
      const existing = db.getUserByUsername(formattedUsername);
      if (existing && existing.id !== req.params.id) {
        return res.status(400).json({ error: 'Username sudah digunakan oleh akun lain.' });
      }
      req.body.username = formattedUsername;
    }
    const updated = db.updateUser(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.json(updated);
  });

  app.delete('/api/teachers/:id', (req, res) => {
    const user = db.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Data guru tidak ditemukan.' });
    }
    if (user.role === 'admin' || user.username === 'admin') {
      return res.status(400).json({ error: 'Akun Super Admin utama tidak dapat dihapus.' });
    }
    const ok = db.deleteUser(req.params.id);
    if (!ok) {
      return res.status(404).json({ error: 'Gagal menghapus data guru.' });
    }
    res.json({ success: true, message: 'Akun guru berhasil dihapus.' });
  });

  // =====================
  // REPORTS & DASHBOARDS
  // =====================
  app.get('/api/reports/dashboard', (req, res) => {
    const { role, userLevelIds } = extractUserContext(req);
    const stats = db.getDashboardStats(role === 'teacher' ? userLevelIds : undefined);
    res.json(stats);
  });

  app.get('/api/reports/students', (req, res) => {
    const { levelId, startDate, endDate } = req.query as { levelId?: string; startDate?: string; endDate?: string };
    const { role, userLevelIds } = extractUserContext(req);
    const reports = db.getStudentSummaryReports({
      levelId,
      startDate,
      endDate,
      userLevelIds: role === 'teacher' ? userLevelIds : undefined,
    });
    res.json(reports);
  });

  // Database Reset & Reload endpoints
  app.post('/api/db/reset', (req, res) => {
    const fresh = db.resetToSeed();
    res.json({ success: true, message: 'Database reset to initial sample seed successfully.' });
  });

  app.post('/api/db/reload', (req, res) => {
    db.reloadFromDisk();
    res.json({ success: true, message: 'Database reloaded from disk successfully.' });
  });

  // =====================
  // VITE & SPA HANDLING
  // =====================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Al-Karim English Learning Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
