# COLLEGE LOG — BUILD PROMPT

Build a personal college management web app called **College Log**.

The user is a beginner in web development. Keep the code simple, readable, and maintainable.

## 1. PRODUCT GOAL

College Log solves one problem:

> I often receive college assignments through WhatsApp, forget them, and miss deadlines.

The app must make it extremely easy to:

* record assignments
* track deadlines
* store assignment context
* track checklist items
* mark assignments as completed
* review completed assignments
* view weekly class schedule
* store course notes

This is a personal utility, NOT a productivity platform.

---

# 2. PRODUCT PRINCIPLES

Priorities:

1. Simple
2. Fast
3. Mobile-first
4. Minimal
5. Clear
6. Reliable

Do NOT add:

* AI features
* chatbot
* gamification
* streaks
* productivity scores
* analytics dashboard
* social features
* unnecessary animations
* excessive cards
* complicated calendar features
* notifications/reminders
* unnecessary dependencies

Do not invent features that are not specified here.

---

# 3. LANGUAGE

All user-facing UI must be in **Bahasa Indonesia**.

Examples:

* Tasks → Tugas
* Schedule → Jadwal
* Notes → Catatan
* Courses → Mata Kuliah
* Completed → Selesai
* In Progress → Sedang Dikerjakan
* To Do → Belum Dikerjakan
* Add Task → Tambah Tugas
* Save → Simpan
* Delete → Hapus

Developer code may use English naming.

---

# 4. UI / UX

Design **mobile-first**.

The user mostly uses a smartphone.

Mobile must have:

* bottom navigation
* large touch targets
* simple layouts
* readable text
* fast task creation
* no horizontal scrolling

Desktop should be responsive and clean.

Visual style:

* minimal dark
* near-black background
* slightly lighter surfaces
* subtle borders
* white/off-white text
* muted gray secondary text
* one restrained accent color

Avoid:

* gradients
* neon
* glow
* glassmorphism
* excessive shadows
* excessive rounded cards
* decorative illustrations
* excessive icons
* excessive emoji
* flashy animations

The interface should feel like a quiet utility app.

---

# 5. NAVIGATION

Primary navigation:

* Tugas
* Jadwal
* Catatan

Mata Kuliah can be accessed from the app but does not need to be a primary bottom-navigation item.

Mobile:

`Tugas | Jadwal | Catatan`

Default page:

**Tugas**

Do NOT create a statistics-heavy dashboard.

---

# 6. TUGAS

Task list is the main screen.

Group active tasks by date:

* Hari Ini
* Besok
* Mendatang
* Terlambat

Example:

```text
Hari Ini

□ Tugas Matematika Diskrit
  Matematika Diskrit · Hari ini

Besok

□ Laporan Algoritma
  Algoritma Pemrograman · Besok
```

Completed tasks should not clutter the active list.

---

# 7. TASK DATA

Each task contains:

* id
* user_id
* title
* course_id
* assigned_date
* deadline
* context
* status
* completed_date
* created_at
* updated_at

Status:

* `todo`
* `in_progress`
* `completed`

Do not create more statuses.

---

# 8. CHECKLIST

A task can contain checklist items.

Each item:

* id
* task_id
* title
* completed
* order

Example:

```text
Tugas Website

☑ Struktur HTML
☑ Navbar
□ CSS
□ Responsive
□ Testing
□ Submit
```

Keep checklist functionality simple.

---

# 9. TAMBAH TUGAS

Main action:

`+ Tambah Tugas`

Required:

* Nama tugas
* Mata kuliah
* Tanggal diberikan
* Deadline
* Konteks/instruksi

Optional:

* checklist
* lampiran
* tautan

Dosen should be automatically determined from the selected mata kuliah whenever possible.

Task creation should be quick.

Do not create a huge form.

---

# 10. DETAIL TUGAS

Task detail must show:

* Nama tugas
* Mata kuliah
* Dosen
* Diberikan
* Deadline
* Status
* Konteks
* Checklist
* Tanggal selesai, if completed
* Optional attachments/links

Example:

```text
Tugas Sorting

Algoritma Pemrograman
Dr. Budi Santoso

Diberikan
22 September 2026

Deadline
29 September 2026

Konteks
Buat program sorting menggunakan C++.

Checklist
☑ Bubble Sort
☑ Selection Sort
□ Insertion Sort
□ Testing

Status
Sedang Dikerjakan
```

---

# 11. RIWAYAT TUGAS

Completed tasks must remain accessible.

Show:

* nama tugas
* mata kuliah
* dosen
* deadline
* tanggal selesai

Example:

```text
September 2026

✓ Program Sorting
  Algoritma Pemrograman
  Selesai 29 Sep

✓ Makalah Pancasila
  Pancasila
  Selesai 25 Sep
```

Do not add productivity scoring or rankings.

---

# 12. MATA KULIAH

Each course contains:

* id
* user_id
* name
* code
* credits
* lecturer_id

Opening a course shows:

* tugas aktif
* tugas selesai
* catatan
* jadwal

Keep this simple.

---

# 13. DOSEN

Each lecturer contains:

* id
* user_id
* name
* optional contact

A course can have one lecturer.

When creating a task, selecting a course should automatically use its lecturer.

---

# 14. JADWAL

Only support a recurring weekly schedule.

Each schedule entry:

* id
* user_id
* course_id
* day_of_week
* start_time
* end_time
* room

Example:

```text
Senin

08:00–09:40
Matematika Dasar
Ruang 204

13:00–15:30
Algoritma Pemrograman
Lab 2
```

Do NOT build a full calendar/event-management system.

---

# 15. CATATAN

Notes are associated with mata kuliah.

Each note:

* id
* user_id
* course_id
* title
* content
* created_at
* updated_at

Use **Markdown** for note content.

Keep the editor simple.

Do NOT build a Notion clone.

Do NOT add:

* AI summaries
* flashcard generation
* quiz generation
* AI writing assistant

---

# 16. SEARCH

Support simple search for:

Tasks:

* nama tugas
* mata kuliah
* dosen

Notes:

* judul
* isi catatan

Filters:

* aktif
* selesai
* terlambat
* mata kuliah

Do not build advanced search.

---

# 17. AUTHENTICATION

Authentication is required.

User-facing authentication must use ONLY:

* Username
* Password

The user must NOT be asked for:

* email
* phone number
* Google account

Pages:

* Masuk
* Daftar

Signup:

```text
Username
Password
Konfirmasi Password

[ Buat Akun ]
```

Login:

```text
Username
Password

[ Masuk ]
```

### Supabase constraint

Supabase Auth normally uses email/phone identities.

Do not expose this implementation detail to the user.

Use a secure internal identity strategy so the visible authentication experience remains username + password.

The internal identity must never appear in the UI.

Do NOT store plaintext passwords.

Use Supabase Auth or another secure password hashing/authentication mechanism.

Use Supabase RLS so users can only access their own data.

Every user-owned table must contain `user_id`.

Do NOT make the database publicly readable/writable.

For V1, password recovery is not required because the user does not provide an email.

---

# 18. DATABASE

Use Supabase PostgreSQL.

Tables:

```text
users/auth
lecturers
courses
tasks
checklist_items
notes
schedule
```

Every user-owned record must contain:

`user_id`

Use foreign keys where appropriate.

Enable Row Level Security.

Users must only be able to:

* read their own data
* create their own data
* update their own data
* delete their own data

---

# 19. ARCHITECTURE

Do not couple UI components directly to Supabase queries.

Use a small data-access/repository layer.

Example:

```text
UI
 ↓
Repository / Data Access
 ↓
Supabase
```

Components should use functions such as:

```text
getTasks()
createTask()
updateTask()
deleteTask()
getCourses()
createCourse()
getNotes()
...
```

This keeps the UI independent from the database implementation.

Do not create unnecessary architecture beyond this.

---

# 20. TECHNOLOGY

Use:

* Next.js
* TypeScript
* Tailwind CSS
* Supabase
* Vercel-ready structure

Use shadcn/ui ONLY when it provides meaningful value for an interactive component, such as:

* Dialog
* Select
* Dropdown
* Date Picker

Use normal Tailwind/HTML for simple elements.

Do NOT install or generate unnecessary shadcn components.

Do NOT add other libraries unless there is a clear reason.

---

# 21. DEVELOPMENT RULES

Work incrementally.

Do NOT build everything in one giant operation.

Do not rewrite unrelated code.

Do not add unrequested features.

Do not replace the stack without a strong reason.

Prefer simple code over clever code.

Avoid premature abstractions.

Keep components reasonably small.

Keep naming clear.

---

# 22. DEVELOPMENT ORDER

## Phase 1 — Foundation

Build:

* Next.js setup
* TypeScript
* Tailwind
* dark theme
* mobile-first layout
* bottom navigation
* Bahasa Indonesia UI
* basic routing
* basic repository interfaces/types

## Phase 2 — Tugas

Build:

* task list
* tambah tugas
* edit
* delete
* detail tugas
* status
* deadline
* assigned date
* checklist
* completed date

Use mock data through the repository layer if Supabase data is not ready.

## Phase 3 — Mata Kuliah + Dosen

Build:

* course management
* lecturer management
* course-task relationship

## Phase 4 — Riwayat

Build:

* completed task history
* search
* filters

## Phase 5 — Jadwal

Build:

* recurring weekly schedule
* course relationship

## Phase 6 — Catatan

Build:

* notes
* Markdown
* search

## Phase 7 — Supabase

Connect the repository implementations to Supabase.

Add:

* authentication
* database
* RLS
* user-specific data

Do NOT rewrite the UI architecture when adding Supabase.

## Phase 8 — Polish

Improve:

* mobile UX
* accessibility
* loading states
* error states
* empty states
* performance
* consistency

Do not add new major features during polish.

---

# 23. IMPORTANT: AGENT BEHAVIOR

When starting:

1. Inspect the existing project.
2. Check installed dependencies.
3. Do not recreate an existing project unnecessarily.
4. Follow the current stack if it already matches the requirements.
5. Explain the intended structure briefly.
6. Implement only the current phase.
7. Stop after the current phase is complete.

After significant changes, report:

* files changed
* what changed
* important implementation decisions
* how to test the result

Do not dump huge explanations.

Do not ask unnecessary questions.

When a requirement is ambiguous, choose the simplest reasonable implementation and continue.

---

# 24. DEFINITION OF SUCCESS

College Log succeeds when the user can:

1. Open the app on a phone.
2. Add a task in a few seconds.
3. See today's deadlines immediately.
4. Open a task and understand its full context.
5. Check off task items.
6. Mark the task completed.
7. Find the completed task later.
8. Check today's class schedule.
9. Open course notes.
10. Log in with only username + password.

The application should feel like a simple personal tool that the user actually wants to open every day.

---

# 25. FIRST ACTION

Do NOT build the entire application now.

Start with **Phase 1 only**.

First inspect the project, then create the foundation and mobile-first UI.

Do not implement tasks, notes, schedule, or database features yet unless required for the Phase 1 foundation.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
