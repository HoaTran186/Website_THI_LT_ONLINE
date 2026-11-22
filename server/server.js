import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Path to data and images
const DATA_FILE = path.join(__dirname, '..', 'data', 'questions.json');
const IMAGES_DIR = path.join(__dirname, '..', 'data', 'images');
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist');

// Serve static question images
app.use('/images', express.static(IMAGES_DIR));

// Serve static frontend build if available (Production / Render)
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
}

// Load questions into memory
let questions = [];
try {
  const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
  questions = JSON.parse(rawData);
  console.log(`Loaded ${questions.length} questions successfully.`);
} catch (error) {
  console.error('Error loading questions.json:', error);
}

// Exam configurations by license rank according to new regulations:
// Hạng B: 30 câu (20 phút, đạt 27/30)
// Hạng C1: 35 câu (22 phút, đạt 32/35)
// Hạng C: 40 câu (24 phút, đạt 36/40)
const EXAM_CONFIGS = {
  'B': { 
    name: 'Hạng B (B số sàn và B tự động)', 
    total: 30, 
    duration: 20 * 60, 
    passScore: 27, 
    criticalCount: 1,
    dist: { 1: 7, 2: 1, 3: 2, 4: 1, 5: 9, 6: 9 }
  },
  'C1': { 
    name: 'Hạng C1 (Xe tải 3.5 tấn đến 7.5 tấn)', 
    total: 35, 
    duration: 22 * 60, 
    passScore: 32, 
    criticalCount: 1,
    dist: { 1: 8, 2: 1, 3: 2, 4: 1, 5: 11, 6: 11 }
  },
  'C': { 
    name: 'Hạng C (Xe tải trên 7.5 tấn)', 
    total: 40, 
    duration: 24 * 60, 
    passScore: 36, 
    criticalCount: 1,
    dist: { 1: 9, 2: 1, 3: 3, 4: 1, 5: 12, 6: 13 }
  },
  'A1': { 
    name: 'Hạng A1 (Mô tô 2 bánh)', 
    total: 25, 
    duration: 19 * 60, 
    passScore: 21, 
    criticalCount: 1,
    dist: { 1: 8, 2: 1, 3: 1, 4: 0, 5: 7, 6: 7 }
  },
  'A': { 
    name: 'Hạng A (Mô tô phân khối lớn)', 
    total: 25, 
    duration: 19 * 60, 
    passScore: 23, 
    criticalCount: 1,
    dist: { 1: 8, 2: 1, 3: 1, 4: 0, 5: 7, 6: 7 }
  }
};

// Map SBD to Rank:
// 1 - 100: Hạng B
// 101 - 150: Hạng C1
// 151 - 200: Hạng C
export function getRankFromSBD(sbdNum) {
  if (sbdNum >= 1 && sbdNum <= 100) return 'B';
  if (sbdNum >= 101 && sbdNum <= 150) return 'C1';
  if (sbdNum >= 151 && sbdNum <= 200) return 'C';
  return 'B'; // default
}

// GET /api/candidate/:sbd
app.get('/api/candidate/:sbd', (req, res) => {
  const sbd = parseInt(req.params.sbd);
  if (isNaN(sbd) || sbd <= 0) {
    return res.status(400).json({ error: 'Số báo danh không hợp lệ' });
  }

  const rank = getRankFromSBD(sbd);
  const config = EXAM_CONFIGS[rank];

  res.json({
    sbd,
    name: `THÍ SINH SỐ ${sbd}`,
    rank,
    rankName: config.name,
    totalQuestions: config.total,
    durationMinutes: config.duration / 60,
    passScore: config.passScore,
    session: 'K88-2025',
    seat: `Máy số ${sbd <= 50 ? sbd : (sbd % 50) + 1}`,
    cccd: `079200${sbd.toString().padStart(6, '0')}`
  });
});

// GET /api/stats
app.get('/api/stats', (req, res) => {
  const chapters = {};
  let criticalCount = 0;
  let hasImageCount = 0;

  questions.forEach(q => {
    if (q.is_critical) criticalCount++;
    if (q.image) hasImageCount++;
    const ch = q.chapter;
    if (!chapters[ch]) {
      chapters[ch] = {
        chapter: ch,
        name: q.chapter_name,
        count: 0
      };
    }
    chapters[ch].count++;
  });

  res.json({
    total: questions.length,
    criticalCount,
    hasImageCount,
    chapters: Object.values(chapters),
    examConfigs: EXAM_CONFIGS
  });
});

// GET /api/questions
app.get('/api/questions', (req, res) => {
  const { chapter, critical, search, page = 1, limit = 50 } = req.query;
  let filtered = [...questions];

  if (chapter && chapter !== 'all') {
    filtered = filtered.filter(q => q.chapter === parseInt(chapter));
  }

  if (critical === 'true') {
    filtered = filtered.filter(q => q.is_critical);
  }

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(q => q.question.toLowerCase().includes(s) || q.id.toString() === s);
  }

  const p = parseInt(page);
  const l = parseInt(limit);
  const total = filtered.length;
  const start = (p - 1) * l;
  const data = filtered.slice(start, start + l);

  res.json({
    total,
    page: p,
    limit: l,
    totalPages: Math.ceil(total / l),
    data
  });
});

// GET /api/questions/:id
app.get('/api/questions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const question = questions.find(q => q.id === id);
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }
  res.json(question);
});

// Helper: Shuffle array
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// POST /api/exam/generate
app.post('/api/exam/generate', (req, res) => {
  const { rank = 'B', sbd } = req.body;
  const actualRank = sbd ? getRankFromSBD(parseInt(sbd)) : (EXAM_CONFIGS[rank] ? rank : 'B');
  const config = EXAM_CONFIGS[actualRank] || EXAM_CONFIGS['B'];

  const criticalPool = questions.filter(q => q.is_critical);
  const nonCriticalPool = questions.filter(q => !q.is_critical);

  // Group by chapter
  const byChapter = {};
  for (let c = 1; c <= 6; c++) {
    byChapter[c] = nonCriticalPool.filter(q => q.chapter === c);
  }

  const selected = [];
  const selectedIds = new Set();

  // 1. Pick 1 critical question
  const shuffledCritical = shuffle(criticalPool);
  for (let i = 0; i < (config.criticalCount || 1); i++) {
    const q = shuffledCritical[i];
    selected.push(q);
    selectedIds.add(q.id);
  }

  // 2. Select questions proportionally per chapter
  const dist = config.dist;
  for (const ch of [1, 2, 3, 4, 5, 6]) {
    const needed = dist[ch] || 0;
    const available = shuffle(byChapter[ch].filter(q => !selectedIds.has(q.id)));
    for (let i = 0; i < Math.min(needed, available.length); i++) {
      selected.push(available[i]);
      selectedIds.add(available[i].id);
    }
  }

  // Fill up if still less than total
  while (selected.length < config.total) {
    const remaining = nonCriticalPool.filter(q => !selectedIds.has(q.id));
    if (remaining.length === 0) break;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    selected.push(pick);
    selectedIds.add(pick.id);
  }

  // Trim to exact total
  const finalQuestions = selected.slice(0, config.total);

  res.json({
    examId: `EXAM-${actualRank}-${Date.now()}`,
    sbd: sbd || 2,
    candidateName: sbd ? `THÍ SINH SỐ ${sbd}` : 'THÍ SINH SỐ 2',
    rank: actualRank,
    rankName: config.name,
    totalQuestions: config.total,
    durationSeconds: config.duration,
    passScore: config.passScore,
    questions: finalQuestions.map((q, index) => ({
      index: index + 1,
      id: q.id,
      chapter: q.chapter,
      chapter_name: q.chapter_name,
      question: q.question,
      image: q.image ? `/images/${path.basename(q.image)}` : null,
      options: q.options,
      correct_option: q.correct_option,
      is_critical: q.is_critical,
      explanation: q.explanation
    }))
  });
});

// POST /api/exam/submit
app.post('/api/exam/submit', (req, res) => {
  const { rank = 'B', answers = {}, questionIds = [], sbd } = req.body;
  const config = EXAM_CONFIGS[rank] || EXAM_CONFIGS['B'];

  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;
  let failedDueToCritical = false;
  const details = [];

  questionIds.forEach((id, index) => {
    const q = questions.find(item => item.id === id);
    if (!q) return;

    const rawAnswer = answers[id];
    let userAnswers = [];
    if (Array.isArray(rawAnswer)) {
      userAnswers = rawAnswer;
    } else if (rawAnswer !== undefined && rawAnswer !== null) {
      userAnswers = [rawAnswer];
    }

    const isAttempted = userAnswers.length > 0;
    // Standard 600 questions rule: exactly 1 option is correct
    const isCorrect = userAnswers.length === 1 && userAnswers[0] === q.correct_option;

    if (!isAttempted) {
      unattemptedCount++;
    } else if (isCorrect) {
      correctCount++;
    } else {
      wrongCount++;
      if (q.is_critical) {
        failedDueToCritical = true;
      }
    }

    details.push({
      index: index + 1,
      id: q.id,
      question: q.question,
      image: q.image ? `/images/${path.basename(q.image)}` : null,
      options: q.options,
      correct_option: q.correct_option,
      user_answer: userAnswers,
      is_correct: isCorrect,
      is_critical: q.is_critical,
      explanation: q.explanation
    });
  });

  const passed = correctCount >= config.passScore && !failedDueToCritical;

  res.json({
    sbd: sbd || 2,
    rank,
    totalQuestions: questionIds.length,
    correctCount,
    wrongCount,
    unattemptedCount,
    passScore: config.passScore,
    passed,
    failedDueToCritical,
    details
  });
});

// SPA fallback for React router / frontend routes (Production / Render)
if (fs.existsSync(CLIENT_DIST)) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/images')) {
      return next();
    }
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
