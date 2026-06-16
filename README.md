# EduPulse — School Administration & Staff Performance Evaluation Platform

A full-stack web application for K–12 school administrators to manage staff, track classroom observations, conduct performance reviews, set goals, and generate AI-powered coaching summaries.

Built as a take-home prototype for the Dynamic Active Software Developer Internship.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Frontend | React 18, Tailwind CSS |
| Backend | Next.js API Routes (serverless) |
| Database | Supabase (PostgreSQL) |
| ORM / DB Client | Supabase JavaScript SDK |
| AI | Groq API (LLaMA 3.3 70B) |
| Charts | Recharts |
| Icons | Lucide React |
| Deployment | Vercel (recommended) |

---

## Features

### Dashboard
- Live stat cards showing total staff, observations, completed reviews, and active goals — all fetched from the database in parallel using `Promise.all`
- Bar chart showing monthly observation and review activity (2025–2026 academic year)
- Donut chart showing review completion rate
- Recent performance reviews table with status and overall score

### Staff Directory
- View all staff members with department, role, email, and phone
- Client-side search/filter by name or department
- Click any staff member to open a detail panel

### Classroom Observations
- Log classroom observations with teacher (dropdown from staff), department (auto-filled), date, subject, duration, rating, and notes
- Full list view of all observations sorted by date

### Performance Reviews
- Create reviews with scores across three dimensions: Teaching Quality, Communication, and Professionalism
- Overall score auto-calculated as the average of the three dimensions
- Detail panel shows score breakdown bars and reviewer comments
- **AI Coaching Summary** — click "Generate" on any review to get a Groq LLaMA-powered coaching summary with strengths and growth recommendations

### Goal Tracking
- Set goals for staff with deadline, status (On Track / At Risk / Completed), and initial progress
- Live-editable progress bar — typing a new percentage instantly updates the UI and persists to the database via PATCH
- Summary cards show counts by status

### Notes
- Color-coded sticky note grid for quick documentation
- Add and delete notes with instant database sync

### Settings
- Profile form (name, email, school, role, phone)
- Notification preference toggles

---

## Project Structure

```
eduplus/
├── app/
│   ├── layout.js              # Root layout with Sidebar
│   ├── page.js                # Redirects to /dashboard
│   ├── globals.css
│   ├── components/
│   │   ├── Sidebar.js         # Navigation sidebar
│   │   └── Header.js          # Page header with admin info
│   ├── dashboard/page.js
│   ├── staff/page.js
│   ├── observations/page.js
│   ├── reviews/page.js
│   ├── notes/page.js
│   ├── goals/page.js
│   ├── settings/page.js
│   └── api/
│       ├── staff/route.js        # GET, POST
│       ├── observations/route.js # GET, POST
│       ├── reviews/route.js      # GET, POST
│       ├── notes/route.js        # GET, POST, DELETE
│       ├── goals/route.js        # GET, POST, PATCH
│       └── ai/
│           └── summary/route.js  # POST — Groq AI coaching summary
├── lib/
│   └── supabase.js            # Supabase client
├── .env.local                 # Environment variables (not committed)
└── package.json
```

---

## Database Schema

All tables live in Supabase (PostgreSQL). Row Level Security is disabled for this prototype (no auth system).

### `staff`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| name | text | |
| dept | text | Department |
| role | text | e.g. "Math Teacher" |
| email | text | |
| phone | text | |
| created_at | timestamptz | Auto |

### `observations`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| teacher | text | Staff name |
| dept | text | Auto-filled from staff |
| date | date | |
| subject | text | |
| duration | text | e.g. "45 min" |
| rating | text | e.g. "Excellent" |
| notes | text | |
| created_at | timestamptz | Auto |

### `reviews`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| teacher | text | |
| dept | text | |
| period | text | e.g. "Spring 2026" |
| teaching | integer | Score 0–100 |
| communication | integer | Score 0–100 |
| professionalism | integer | Score 0–100 |
| overall | integer | Average of the three scores |
| status | text | "Completed" / "In Progress" / "Pending" |
| comments | text | |
| created_at | timestamptz | Auto |

### `notes`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| content | text | |
| color | text | Tailwind color class |
| created_at | timestamptz | Auto |

### `goals`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| teacher | text | |
| dept | text | |
| goal | text | Goal description |
| deadline | date | |
| progress | integer | 0–100 |
| status | text | "On Track" / "At Risk" / "Completed" |
| created_at | timestamptz | Auto |

---

## API Routes

All routes return JSON. No authentication required (prototype scope).

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/staff` | List all staff |
| POST | `/api/staff` | Add a staff member |
| GET | `/api/observations` | List all observations |
| POST | `/api/observations` | Log a new observation |
| GET | `/api/reviews` | List all performance reviews |
| POST | `/api/reviews` | Create a new review |
| GET | `/api/notes` | List all notes |
| POST | `/api/notes` | Create a note |
| DELETE | `/api/notes` | Delete a note by `{ id }` in body |
| GET | `/api/goals` | List all goals |
| POST | `/api/goals` | Create a new goal |
| PATCH | `/api/goals` | Update goal progress by `{ id, progress }` |
| POST | `/api/ai/summary` | Generate AI coaching summary via Groq |

---

## AI Integration

The AI feature uses the **Groq API** with the `llama-3.3-70b-versatile` model.

**How it works:**
1. Admin navigates to a performance review and clicks "Generate" in the AI Coaching Summary panel
2. The frontend sends the full review data (teacher, department, period, all three scores, comments) to `/api/ai/summary`
3. The API route constructs a structured prompt and calls Groq's chat completion endpoint
4. The model returns a 3-paragraph coaching summary: overall assessment, key strengths, and actionable growth recommendations
5. The summary is displayed inline in the review detail panel

**Why Groq:** Sub-second inference latency on open-source LLaMA models, with a free tier that's sufficient for a prototype.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

- **Supabase credentials**: Found in your Supabase project under Settings → API
- **Groq API key**: Get a free key at [console.groq.com](https://console.groq.com)

---

## Local Setup

```bash
# Clone the repo
git clone https://github.com/your-username/eduplus.git
cd eduplus

# Install dependencies
npm install

# Add environment variables
cp .env.local.example .env.local
# Fill in your Supabase and Groq credentials

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/dashboard`.

---

## Key Engineering Decisions

**Next.js API Routes as backend** — Instead of a separate Node/Express server, all backend logic lives in `app/api/*/route.js` files. This keeps the codebase in one repo, simplifies deployment, and is idiomatic for modern Next.js.

**Supabase over raw SQL** — The Supabase JS SDK abstracts connection pooling and query building, reducing backend boilerplate to a few lines per route.

**Client-side search** — Staff search filters a local array rather than hitting the API on every keystroke. This is appropriate for the data size and avoids unnecessary round-trips.

**Staff dropdown with auto-fill** — Observation, review, and goal forms fetch staff from the database and auto-populate the department when a teacher is selected. This enforces data consistency across tables without a foreign key join.

**Parallel data fetching** — The dashboard uses `Promise.all` to fetch from all four APIs simultaneously, cutting load time compared to sequential awaits.

**Optimistic UI for goal progress** — Progress bar updates immediately on input change, then the PATCH fires in the background. This makes the UI feel instant.

---

## Author

Soham Shah — built for the Dynamic Active Software Developer Internship take-home project.
