# Vhembe Digital Literacy & Cybersafety Portal

A complete, production-ready learning portal for youth aged 9–25 in the Vhembe District, Limpopo.

## Features

- **3 age-track learning journeys** — Juniors (9–12), Secondary (13–18), Young Adults (19–25)
- **9 full modules** with expandable topic content and per-module quizzes
- **Progress persistence** — quiz scores and module completions saved per user
- **Final certification exam** — 12-question integrated assessment, auto-scored
- **Printable certificate** — issued on 70%+ pass
- **Teacher dashboard** — real-time analytics, student tracking, class management
- **JWT authentication** — secure sessions with httpOnly cookies
- **Rate limiting** — brute-force protection on auth endpoints
- **Mobile-first design** — works on any device

## Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Seed demo data (optional)
node seed.js

# 3. Start server
node server.js

# 4. Open in browser
open http://localhost:3000
```

## Demo Accounts

| Role    | Email                        | Password     |
|---------|------------------------------|--------------|
| Teacher | teacher@vhembe.edu.za        | teacher123   |
| Student | thabo@demo.com               | student123   |
| Student | rendani@demo.com             | student123   |
| Student | mashudu@demo.com             | student123   |

**Teacher registration code:** `VHEMBE2026`

## Deployment Options

### Option 1: Railway (Recommended — Free tier)

1. Push this folder to a GitHub repo
2. Go to railway.app → New Project → Deploy from GitHub
3. Set environment variable: `JWT_SECRET=your-random-secret-here`
4. Railway auto-detects Node.js and deploys

### Option 2: Render.com (Free tier)

1. Push to GitHub
2. render.com → New Web Service → Connect repo
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add env var: `JWT_SECRET=your-secret`

### Option 3: VPS / Ubuntu Server

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone / copy project
git clone <your-repo> /var/www/vhembe-portal
cd /var/www/vhembe-portal
npm install

# Set environment
export JWT_SECRET="your-very-long-random-secret-here"

# Run with PM2 (process manager)
npm install -g pm2
pm2 start server.js --name vhembe-portal
pm2 startup   # auto-restart on reboot
pm2 save

# Nginx reverse proxy (optional)
# Point nginx to localhost:3000
```

### Option 4: Heroku

```bash
heroku create vhembe-portal
heroku config:set JWT_SECRET=your-secret
git push heroku main
```

## Environment Variables

| Variable     | Default                        | Description                    |
|--------------|--------------------------------|--------------------------------|
| `PORT`       | `3000`                         | Server port                    |
| `JWT_SECRET` | `vhembe-portal-secret-2026`    | **Change in production!**      |

## Data Storage

The portal uses **NeDB** — a lightweight embedded database stored in the `data/` folder as plain files:
- `data/users.db` — user accounts
- `data/progress.db` — module quiz results
- `data/exams.db` — final exam results
- `data/classes.db` — teacher classes

**Backup:** Simply copy the `data/` folder regularly.

For larger scale (1000+ users), migrate to MongoDB by replacing the NeDB calls in `db/database.js`.

## Project Structure

```
vhembe-portal/
├── server.js              # Express app entry point
├── seed.js                # Demo data seeder
├── db/
│   ├── database.js        # NeDB setup + promise wrappers
│   └── courseData.js      # All course content, topics, quizzes
├── middleware/
│   └── auth.js            # JWT middleware
├── routes/
│   ├── auth.js            # Register / login / logout / me
│   ├── progress.js        # Module progress + exam submission
│   └── teacher.js         # Teacher dashboard APIs
└── public/
    ├── index.html         # SPA shell
    ├── css/main.css       # Full design system
    └── js/
        ├── app.js         # SPA router + boot
        ├── api.js         # API client
        ├── auth.js        # Login / register views
        ├── student.js     # Student portal (modules, quizzes, exam)
        └── teacher.js     # Teacher dashboard views
```

## Adding Content

All course content is in `db/courseData.js`. To add a new module:

```js
{
  id: 'j4',          // unique ID
  title: 'Online Safety for Kids',
  track: 'juniors',  // juniors | secondary | adults
  order: 4,
  duration: '20 min',
  difficulty: 'Beginner',
  intro: 'Module introduction text...',
  topics: [
    { title: 'Topic name', body: 'HTML content for the topic...' }
  ],
  quizzes: [
    { question: 'Question text?', options: ['A','B','C','D'], correct: 0 }
  ]
}
```

## Language / Localisation

All content text lives in `db/courseData.js`. To add TshiVenda or Xitsonga versions:
1. Duplicate the TRACKS array entries
2. Translate all `intro`, `topics.body`, `quizzes.question`, and `quizzes.options` fields
3. Add a language selector to the UI in `public/js/student.js`

## Security Notes

- Passwords are bcrypt-hashed (cost factor 10)
- JWT tokens expire after 7 days
- Auth endpoints are rate-limited (20 req / 15 min)
- Cookies are httpOnly + sameSite=lax
- **Change `JWT_SECRET`** before production deployment

## Support & Contact

Built for the Vhembe District Municipality and Limpopo Department of Education.
Aligned with POPIA, NCPF, and SA Connect Phase 2 objectives.
