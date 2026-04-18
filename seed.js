// seed.js — run once to populate demo data
const bcrypt = require('bcryptjs');
const { db, insert, findOne } = require('./db/database');

async function seed() {
  console.log('🌱 Seeding demo data...');

  // Helper: insert only if not exists
  const maybeInsert = async (col, query, doc) => {
    const existing = await findOne(col, query);
    if (!existing) await insert(col, doc);
  };

  // ── Demo teacher ──────────────────────────────────────────────────────────
  await maybeInsert(db.users, { email: 'teacher@vhembe.edu.za' }, {
    name: 'Ms. Livhuwani Mudau',
    email: 'teacher@vhembe.edu.za',
    password: await bcrypt.hash('teacher123', 10),
    role: 'teacher',
    track: null,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    lastActive: new Date().toISOString(),
  });

  // ── Demo students ─────────────────────────────────────────────────────────
  const students = [
    { name: 'Thabo Nedzamba', email: 'thabo@demo.com', track: 'juniors', daysAgo: 5 },
    { name: 'Yvonne Tshivhase', email: 'yvonne@demo.com', track: 'juniors', daysAgo: 2 },
    { name: 'Rendani Maphaha', email: 'rendani@demo.com', track: 'secondary', daysAgo: 1 },
    { name: 'Khuliso Netshituni', email: 'khuliso@demo.com', track: 'secondary', daysAgo: 3 },
    { name: 'Mashudu Ravhura', email: 'mashudu@demo.com', track: 'adults', daysAgo: 0 },
    { name: 'Vhahangwele Ramadwa', email: 'vhaha@demo.com', track: 'adults', daysAgo: 7 },
    { name: 'Tshifhiwa Mutepfa', email: 'tshifhiwa@demo.com', track: 'juniors', daysAgo: 14 },
    { name: 'Murendeni Managa', email: 'murendeni@demo.com', track: 'secondary', daysAgo: 4 },
  ];

  const hash = await bcrypt.hash('student123', 10);
  const insertedStudents = [];

  for (const s of students) {
    let user = await findOne(db.users, { email: s.email });
    if (!user) {
      user = await insert(db.users, {
        name: s.name, email: s.email, password: hash, role: 'student',
        track: s.track, classCode: 'DEMO01',
        createdAt: new Date(Date.now() - s.daysAgo * 86400000 * 2).toISOString(),
        lastActive: new Date(Date.now() - s.daysAgo * 86400000).toISOString(),
      });
    }
    insertedStudents.push({ ...s, _id: user._id });
  }

  // ── Demo progress ─────────────────────────────────────────────────────────
  const progressData = [
    // Thabo — juniors, completed 2/3 modules well
    { userId: insertedStudents[0]._id, moduleId: 'j1', score: 4, total: 4, pct: 100, completed: true },
    { userId: insertedStudents[0]._id, moduleId: 'j2', score: 3, total: 4, pct: 75, completed: true },
    // Yvonne — juniors, one module attempted, low score
    { userId: insertedStudents[1]._id, moduleId: 'j1', score: 2, total: 4, pct: 50, completed: false },
    // Rendani — secondary, completed all with good scores
    { userId: insertedStudents[2]._id, moduleId: 's1', score: 4, total: 4, pct: 100, completed: true },
    { userId: insertedStudents[2]._id, moduleId: 's2', score: 3, total: 4, pct: 75, completed: true },
    { userId: insertedStudents[2]._id, moduleId: 's3', score: 4, total: 4, pct: 100, completed: true },
    // Khuliso — secondary, mid progress
    { userId: insertedStudents[3]._id, moduleId: 's1', score: 3, total: 4, pct: 75, completed: true },
    { userId: insertedStudents[3]._id, moduleId: 's2', score: 2, total: 4, pct: 50, completed: false },
    // Mashudu — adults, completed 2 modules
    { userId: insertedStudents[4]._id, moduleId: 'a1', score: 4, total: 4, pct: 100, completed: true },
    { userId: insertedStudents[4]._id, moduleId: 'a2', score: 3, total: 4, pct: 75, completed: true },
    // Vhahangwele — adults, low engagement
    { userId: insertedStudents[5]._id, moduleId: 'a1', score: 2, total: 4, pct: 50, completed: false },
    // Murendeni — secondary, one module
    { userId: insertedStudents[7]._id, moduleId: 's1', score: 3, total: 4, pct: 75, completed: true },
  ];

  for (const p of progressData) {
    const existing = await findOne(db.progress, { userId: p.userId, moduleId: p.moduleId });
    if (!existing) {
      await insert(db.progress, { ...p, completedAt: new Date().toISOString(), quizAnswers: [] });
    }
  }

  // ── Demo exam results ─────────────────────────────────────────────────────
  const examData = [
    { userId: insertedStudents[2]._id, score: 10, total: 12, pct: 83, passed: true, attempt: 1, track: 'secondary' },
    { userId: insertedStudents[4]._id, score: 9, total: 12, pct: 75, passed: true, attempt: 2, track: 'adults' },
    { userId: insertedStudents[0]._id, score: 7, total: 12, pct: 58, passed: false, attempt: 1, track: 'juniors' },
    { userId: insertedStudents[3]._id, score: 6, total: 12, pct: 50, passed: false, attempt: 1, track: 'secondary' },
  ];

  for (const e of examData) {
    const existing = await findOne(db.examResults, { userId: e.userId });
    if (!existing) {
      await insert(db.examResults, { ...e, answers: {}, submittedAt: new Date().toISOString() });
    }
  }

  // ── Demo class ────────────────────────────────────────────────────────────
  const teacher = await findOne(db.users, { email: 'teacher@vhembe.edu.za' });
  if (teacher) {
    await maybeInsert(db.classes, { code: 'DEMO01' }, {
      name: 'Grade 10 Digital Literacy — Thohoyandou High',
      track: 'secondary', code: 'DEMO01',
      teacherId: teacher._id,
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    });
  }

  console.log('✅ Seed complete!');
  console.log('\n📋 Demo accounts:');
  console.log('   Teacher  → teacher@vhembe.edu.za / teacher123');
  console.log('   Student  → thabo@demo.com / student123');
  console.log('   Student  → rendani@demo.com / student123');
  console.log('   Student  → mashudu@demo.com / student123');
  console.log('\n   Teacher registration code: VHEMBE2026\n');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
