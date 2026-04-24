# platform_education

A full-stack AI-powered course platform where users can sign up, log in, and access a personalized dashboard of courses. Users can generate new courses on any topic using AI — the platform automatically creates a structured Google Doc, stores it in Supabase, and adds it to the user's dashboard.

---

## Features

- User authentication (signup, login, logout)
- Input validation handled server-side (email format, password strength, password match)
- Personalized course dashboard per user
- 3 default courses assigned to every new user
- AI-generated courses via Gemini — cached in the database to avoid redundant LLM calls
- Anti-duplication logic — won't reassign a course the user already has
- Google Docs integration — generated courses are saved as formatted documents
- Skeleton loading states and error fallback on the dashboard

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Frontend | HTML, CSS, JavaScript |
| Automation / Backend | Fusion AI |
| Database | Supabase (PostgreSQL) |
| AI | Google Gemini (via Fusion AI Agent node) |
| Documents | Google Docs API |
| Auth | Custom (bcrypt hashing + Supabase) |

---

## Project Structure

```
platform_education/
├── pages/
│   ├── login.html          # Login & signup page
│   └── dashboard.html      # User course dashboard
├── styles/
│   ├── login.css
│   └── dashboard.css
├── scripts/
│   ├── login.js            # Auth logic (login, signup)
│   └── dashboard.js        # Dashboard logic (fetch courses, generate)
├── workflows/

│   └── platform_education  # Fusion AI signup, login and  generation courses pipelines
└── README.md
```

---

## Database Setup

Run the following SQL in your Supabase SQL Editor to set up the required tables.

### 1. accounts_database
```sql
CREATE TABLE accounts_database (
  id       BIGSERIAL PRIMARY KEY,
  email    TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);
```

### 2. courses
```sql
CREATE TABLE courses (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  tag         TEXT,
  icon        TEXT,
  tag_color   TEXT,
  tag_bg      TEXT,
  drive_link  TEXT,
  is_default  BOOLEAN DEFAULT false
);
```

### 3. user_courses
```sql
CREATE TABLE user_courses (
  id        BIGSERIAL PRIMARY KEY,
  user_id   BIGINT NOT NULL REFERENCES accounts_database(id),
  course_id BIGINT NOT NULL REFERENCES courses(id)
);
```

### 4. Default courses
```sql
INSERT INTO courses (title, description, tag, icon, tag_color, tag_bg, drive_link, is_default)
VALUES
  ('Agentic AI', 'Understand how autonomous AI agents are built, how they plan, use tools, and execute multi-step tasks without human intervention.', 'AI', '🤖', '#2B4FFF', '#EEF2FF', '', true),
  ('Physical AI & IoT', 'Explore how AI integrates with physical systems — sensors, actuators, embedded devices, and real-time data pipelines.', 'IoT', '⚙️', '#E07B00', '#FFF4E6', '', true),
  ('Python', 'Master Python from the ground up — syntax, data structures, OOP, file handling, and practical automation scripting.', 'Dev', '🐍', '#B8860B', '#FFFBEE', '', true);
```

---

## Fusion AI Setup

1. Import the workflow JSON files from the `workflows/` folder into your Fusion AI instance
2. Configure the following credentials in each pipeline:
   - **Supabase / PostgreSQL** — your Supabase connection string
   - **Google OAuth** — ClientId, ClientSecret, RefreshToken (for Google Docs)
   - **Google Gemini** — API key in the Google LLM node
3. Update the webhook URLs in `scripts/login.js` and `scripts/dashboard.js` to match your Fusion AI webhook URLs

---

## Frontend Setup

1. Clone the repository
2. Open `pages/login.html` with a local server (e.g. VS Code Live Server)
3. Make sure the webhook URLs in `login.js` and `dashboard.js` point to your Fusion AI instance

---

## Environment Notes

- The frontend uses [corsproxy.io](https://corsproxy.io) to bypass CORS restrictions when calling Fusion AI webhooks locally
- In production, you should configure CORS directly on your backend instead of relying on a proxy

---

## Author

Built with Fusion AI, Supabase, and Google APIs.
