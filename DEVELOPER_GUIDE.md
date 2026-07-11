# CareerOS — Developer Documentation Guide

Welcome to the CareerOS developer documentation. This document details the structure, state management patterns, UI components, and engineering best practices of the hackathon prototype ecosystem.

---

## 1. Directory Structure

```
careeros/
├── app/                  # Next.js App Router (v14/15) Layouts & Pages
│   ├── page.tsx          # Root controller: authenticates, handles navigation/global states
│   ├── layout.tsx        # HTML wrapper, sets fonts and context providers
│   ├── globals.css       # Tailwind directives & theme configuration
│   ├── login/
│   │   └── page.tsx      # Sign-in UI & credentials validator
│   └── signup/
│       └── page.tsx      # Registration handler (Candidate or Recruiter roles)
├── components/           # Core view modules
│   ├── LandingPage.tsx   # Marketing entry point, features teaser assessments
│   ├── Header.tsx        # Common banner navigation (branding & sandbox bypass commands)
│   ├── CandidateWorkspace.tsx # Candidate Dashboard (Learning, Profile, Roadmap, Job Discover)
│   ├── RecruiterWorkspace.tsx # Recruiter Dashboard (Sourcing, Posting, Syllabus shaping)
│   └── SharedMarketplace.tsx  # Aggregated activity feeds and talent/job feeds
├── lib/                  # Helper modules & static data
│   ├── types.ts          # Core TypeScript interface typings
│   ├── mockData.ts       # Starter seed data arrays (Courses, Jobs, Candidates, Requests)
│   ├── supabase.js       # Client connection pool builder
│   └── supabase.d.ts     # TypeScript bypass headers
└── package.json          # Node dependency mappings and build targets
```

---

## 2. Architecture & State Management Flow

CareerOS operates primarily as a **State-Synchronized Client App (Single-Page App simulation)** wrapper around local storage caches and Supabase connection indicators.

```
                  ┌───────────────────────────────┐
                  │          App Router           │
                  │          (app/page.tsx)       │
                  │      Manages Global States    │
                  └──────────────┬────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│CandidateWorkspace│   │RecruiterWorkspace│   │SharedMarketplace │
│(Candidate views) │   │ (Recruiter views)│   │  (Shared Feed)   │
└──────────────────┘   └──────────────────┘   └──────────────────┘
```

### State Synchronization Patterns
- **Local Storage Sync**: On component mount (`app/page.tsx`), the global arrays (`courses`, `candidates`, `jobs`, `courseRequests`, `appliedJobIds`) are hydrated from browser `localStorage` or fall back to defaults in `lib/mockData.ts`.
- **Prop Drilling**: All state alteration triggers (e.g. `onEnroll`, `onCompleteCourse`, `onApplyJob`, `onPostJob`, `onApproveCourse`) are drilled down from the parent controller (`page.tsx`) down into individual workspace pages. This ensures data modifications are synchronized in real-time across candidate, recruiter, and marketplace workspaces.

---

## 3. Core Component Walkthrough

### CandidateWorkspace.tsx
- Manages the Candidate dashboard view. Divided into 4 primary views via local `activeTab` states:
  - **Learning Academy**: Enrolls in syllabi, completes slides, answers assessments.
  - **Roadmaps / My Path**: Interactive visual SVG canvas drawing nodes and dependencies.
  - **Verified Portfolio**: Profile visualization, project submission builders, and skills badges.
  - **Discover Jobs**: Job vacancies index, search queries, matching algorithm scoring.
- Handles custom viewport dimension hooks to correctly scale the SVG node maps.

### RecruiterWorkspace.tsx
- Manages the Recruiter dashboard view:
  - **Talent Roster**: Algorithmic fit analysis overlay (Venn comparison of job requirements vs candidate skill tags).
  - **Post Job**: Submission logic mapping vacancies onto the shared market.
  - **Curriculum Tab**: Shaping the upstream talent pool via curriculum signaling.

### SharedMarketplace.tsx
- Renders an aggregated real-time feed tracking all learning completions, application counts, and job posting signals.

---

## 4. Coding & UI Best Practices

To maintain code cleanliness, reliability, and visual consistency, all modifications must align with the following rules:

### A. TypeScript Type Safety
- **Strict Interfaces**: Avoid `any` types. Define all extensions within `lib/types.ts`.
- **Null Safety**: Always check array bounds and presence before accessing properties (e.g. `jobs[0]?.id` rather than `jobs[0].id`).

### B. Component & Hook Isolation
- **Prevent Unnecessary Re-renders**: Wrap callbacks passed down as props in `useCallback`.
- **Inline SVG Drawing**: Use absolute calculations based on dimensions, and clear dynamic class flags to show locked vs active states.

### C. Aesthetic Consistency (Hackathon Grade)
- **Glassmorphism Theme**: Slate base (`bg-slate-950`), custom backdrop-blur layers (`backdrop-blur-md`), and gradient boundaries (`from-indigo-600 to-violet-600`).
- **Clean Animations**: Utilize CSS keyframes for custom glows, blurs, and beacons to keep page rendering lightweight. Avoid adding heavy dynamic layout libraries.
- **Visual Feedback**: Every interaction (correct answer, successful job apply, streak extension) should provide instant feedback using icons, color shifts, or spring transitions.
