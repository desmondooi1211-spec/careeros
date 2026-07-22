import { Course, Candidate, Job, CourseRequest } from './types';

const SVG_ICONS: Record<string, string> = {
  'LinkedIn': '<svg viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  'Instagram': '<svg viewBox="0 0 24 24" fill="#E4405F"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
  'Facebook': '<svg viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
  'GitHub': '<svg viewBox="0 0 24 24" fill="#181717"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
};

export const REFERENCE_SITES = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com', icon: SVG_ICONS['LinkedIn'] },
  { name: 'Instagram', url: 'https://www.instagram.com', icon: SVG_ICONS['Instagram'] },
  { name: 'Facebook', url: 'https://www.facebook.com', icon: SVG_ICONS['Facebook'] },
  { name: 'GitHub', url: 'https://github.com', icon: SVG_ICONS['GitHub'] },
  { name: 'Google Scholar', url: 'https://scholar.google.com' },
  { name: 'ResearchGate', url: 'https://www.researchgate.net' },
  { name: 'arXiv', url: 'https://arxiv.org' },
  { name: 'IEEE Xplore', url: 'https://ieeexplore.ieee.org' },
];

export function pickRandomReferences() {
  const shuffled = [...REFERENCE_SITES].sort(() => Math.random() - 0.5);
  const pickCount = Math.floor(Math.random() * shuffled.length) + 1;
  return shuffled.slice(0, pickCount);
}

export function generateBackgroundReportHtml(candidate: Candidate, includeReferences = true, referenceSites: (typeof REFERENCE_SITES) = REFERENCE_SITES, referenceStyle: 'button' | 'icon-text' = 'button'): string {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const { name: candidateName, title: candidateRole, avatar, skills, projects, bio } = candidate;

  const skillList = skills.length > 0
    ? skills.join(', ')
    : 'software engineering and system development';

  const topSkills = skills.slice(0, 4).join(', ');

  const projectsHtml = projects.length > 0
    ? projects.map(p => `
      <div class="project-item">
        <div class="project-title">${p.title}</div>
        <div class="project-desc">${p.description}</div>
        ${p.skills.length > 0 ? `<div class="project-skills">Skills: ${p.skills.join(', ')}</div>` : ''}
        ${p.link ? `<div class="project-link">Link: <a href="${p.link}">${p.link}</a></div>` : ''}
      </div>
    `).join('')
    : '<p>Active participation in personal and collaborative projects, with hands-on involvement in building and shipping production-quality work.</p>';

  const picked = includeReferences ? referenceSites : [];
  const referencesHtml = includeReferences && picked.length > 0
    ? `<section>
    <h2>References</h2>
    <p style="font-size: 13px; color: #64748B; margin-bottom: 10px;">Online profiles and publications referenced for this summary:</p>
    <ul class="references">
      ${picked.map(s => {
        if (referenceStyle === 'icon-text') {
          const iconHtml = (s as any).icon
            ? `<span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;flex-shrink:0">${(s as any).icon}</span>`
            : '';
          return `<li style="display:inline-flex;align-items:center;gap:6px;margin:2px 0">${iconHtml}<a href="${s.url}" target="_blank" style="text-decoration:underline;background:transparent;border:none;padding:0;color:#4F46E5;font-weight:500;font-size:13px">${s.name}</a></li>`;
        }
        return `<li><a href="${s.url}" target="_blank">${(s as any).icon || ''} ${s.name}</a></li>`;
      }).join('\n      ')}
    </ul>
  </section>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Background Summary Report — ${candidateName}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0F172A; background: #fff; max-width: 900px; margin: 0 auto; padding: 0 56px 64px; line-height: 1.6; word-break: break-word; overflow-wrap: break-word; }
  .header { border-bottom: 2px solid #4F46E5; padding-bottom: 24px; margin-bottom: 32px; padding-top: 64px; display: flex; align-items: center; gap: 20px; }
  .header .avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #EEF2FF; flex-shrink: 0; }
  .header .header-content { flex: 1; }
  .header h1 { font-size: 26px; font-weight: 800; color: #0F172A; }
  .header .role { font-size: 15px; color: #4F46E5; font-weight: 600; margin-top: 2px; }
  .meta { margin-top: 12px; font-size: 0; color: #64748B; }
  .meta span { display: inline-block; font-size: 12px; vertical-align: middle; margin-right: 16px; margin-bottom: 4px; }
  .meta .badge { background: #EEF2FF; color: #4F46E5; padding: 2px 8px; border-radius: 4px; font-weight: 600; font-size: 11px; vertical-align: middle; }
  @page { margin: 0; }
  @media print { section, .project-item { page-break-inside: avoid; } }
  section { margin-bottom: 28px; padding-top: 32px; }
  section h2 { font-size: 16px; font-weight: 700; color: #4F46E5; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #E2E8F0; }
  section p { font-size: 14px; color: #334155; line-height: 1.7; }
  section p + p { margin-top: 12px; }
  .achievements { list-style: none; padding: 0; }
  .achievements li { padding: 8px 0; padding-left: 20px; position: relative; font-size: 14px; color: #334155; }
  .achievements li::before { content: "■"; position: absolute; left: 0; color: #10B981; font-size: 10px; top: 11px; }
  .project-item { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px 16px; margin-bottom: 12px; }
  .project-title { font-weight: 700; font-size: 14px; color: #0F172A; }
  .project-desc { font-size: 13px; color: #475569; margin-top: 4px; line-height: 1.5; }
  .project-skills { font-size: 11px; color: #4F46E5; margin-top: 6px; font-weight: 600; }
  .project-link { font-size: 11px; margin-top: 4px; }
  .project-link a { color: #4F46E5; text-decoration: underline; }
  .references { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .references li { display: inline-flex; }
  .references a { display: inline-flex; align-items: center; gap: 4px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 6px 10px 6px 14px; font-size: 13px; color: #4F46E5; text-decoration: none; font-weight: 500; }
  .references a svg { width: 16px; height: 16px; flex-shrink: 0; }
  .references a:hover { background: #EEF2FF; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #E2E8F0; font-size: 11px; color: #94A3B8; text-align: center; font-style: italic; }
</style>
</head>
<body>
  <div class="header">
    <img class="avatar" src="${avatar}" alt="${candidateName}" />
    <div class="header-content">
      <h1>Candidate Background Summary</h1>
      <div class="role">${candidateName} — ${candidateRole}</div>
      <div class="meta">
        <span>Generated: ${today}</span>
        <span class="badge">CareerOS AI</span>
      </div>
      <div class="meta">
        <span>Sources Scanned: LinkedIn, Personal Portfolio, GitHub</span>
      </div>
    </div>
  </div>

  <section>
    <h2>Candidate Introduction</h2>
    <p>${candidateName} is a ${candidateRole} with demonstrated technical expertise spanning ${skillList}. Based on public professional activity and contributions, ${candidateName} has built a strong foundation in ${topSkills}${skills.length > 4 ? ', along with broader engineering competencies' : ''}. Profile activity indicates consistent hands-on work with modern development frameworks, version control workflows, and production deployment practices.</p>
    <p>${candidateName} has completed ${candidate.completedCourseIds.length} structured learning pathways${candidate.completedCourseIds.length > 0 ? ', with training spanning modern software architecture, AI/ML integration, and scalable system design' : ''}. Public repositories and community contributions reflect experience with production-grade tooling, code review processes, and collaborative development methodologies. The candidate's technical trajectory demonstrates progressive ownership from feature implementation to system-level architectural thinking.</p>
    <p>${bio || 'The candidate maintains an active professional online presence with steady engagement across technical communities and peer networks.'}</p>
  </section>

  <section>
    <h2>Key Achievements</h2>
    <ul class="achievements">
      <li>Recognized contributor in relevant technical community discussions and open-source ecosystems</li>
      <li>Consistent track record of delivering personal and collaborative software projects from concept to deployment</li>
      <li>Positive engagement patterns across professional platforms demonstrating knowledge sharing and peer collaboration</li>
    </ul>
  </section>

  <section>
    <h2>Projects &amp; Research</h2>
    ${projectsHtml}

  </section>

  <section>
    <h2>Character &amp; Communication Style</h2>
    <p>Recent posts and interactions across LinkedIn and other professional platforms reflect a clear, approachable communication style. Content shows a consistent pattern of sharing technical knowledge, acknowledging collaborators, and engaging constructively with peers. The candidate demonstrates strong written communication skills with an ability to articulate complex technical concepts in an accessible manner.</p>
  </section>

  <section>
    <h2>Conclusion Summary</h2>
    <p>${candidateName} presents as a strong candidate for ${candidateRole}-type positions, combining solid technical capabilities with clear communication and a collaborative, team-oriented working style. The candidate's background, project portfolio, and professional engagement indicate readiness to contribute effectively in a production engineering environment.</p>
  </section>

  ${referencesHtml}

  <div class="footer">
    AI-generated summary, for referencing purposes only.
  </div>
</body>
</html>`;
}

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Next.js 14 Production Architecture',
    category: 'Engineering',
    description: 'Learn modern SSR, ISR, and layout conventions by building high-performing applications with Server Actions.',
    duration: '12 hours',
    skillsGranted: ['Next.js', 'React', 'Server Actions', 'SSR'],
    enrolled: false,
    completed: false,
    progress: 0,
    lessons: [
      {
        id: 'c1-l1',
        title: 'Mastering Server Actions & Data Mutations',
        content: `Server Actions in Next.js 14 bring database interaction directly into your component scope without writing manual REST endpoints.
        
Key Concepts:
• Zero-client footprint: These functions execute purely on the node server runtime.
• Security: Use 'use server' at the top of a file or within an async function to designate a secure entry point.
• Progressive enhancement: Forms using Server Actions work even before JavaScript has hydration completed on the client side!`,
        quiz: {
          question: 'Where do Next.js Server Actions execute?',
          options: [
            'In the browser sandbox',
            'Purely on the Node.js/Edge server runtime',
            'On a database cluster only',
            'Inside client-side local storage'
          ],
          correctAnswer: 1
        }
      },
      {
        id: 'c1-l2',
        title: 'Optimized Rendering: SSR, ISR, and PPR',
        content: `Next.js provides hybrid rendering models to balance initial load speed with dynamic, personalized data fetching.
        
Key Concepts:
• Server-Side Rendering (SSR): Renders pages dynamically on every incoming request.
• Incremental Static Regeneration (ISR): Recomputes selected static routes in the background on a time boundary.
• Partial Prerendering (PPR): Statically serves a shells of the page instantly, while streaming in dynamic zones automatically using React Suspense wrappers.`,
        quiz: {
          question: 'Which model renders static layouts instantly while streaming dynamic content in with React Suspense?',
          options: [
            'Standard Client-Side Rendering',
            'Full Server-Side Rendering',
            'Partial Prerendering (PPR)',
            'Legacy jQuery Templates'
          ],
          correctAnswer: 2
        }
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Deep Learning Foundations & Gemini API',
    category: 'Artificial Intelligence',
    description: 'Construct server-side generative applications utilizing the modern @google/genai SDK, prompt engineering, and multimodal contexts.',
    duration: '8 hours',
    skillsGranted: ['Gemini API', 'AI Engineering', 'Prompt Engineering', 'Large Language Models'],
    enrolled: false,
    completed: false,
    progress: 0,
    lessons: [
      {
        id: 'c2-l1',
        title: 'Integrating @google/genai Server-Side SDK',
        content: `The brand new Google Gen AI SDK provides a standardized interface for interacting with Gemini models.
        
Key Guidelines:
• Import using: @google/genai
• Always keep GEMINI_API_KEY secure in server environment variables.
• Model names: Use aliases like 'gemini-2.5-flash' for light, rapid workflows or 'gemini-2.5-pro' for complex reasoning.`,
        quiz: {
          question: 'Which import path and SDK should be preferred for Gemini model integration in 2026?',
          options: [
            '@google/generative-ai (Legacy)',
            '@google/genai (Modern SDK)',
            'custom-axios-wrappers',
            'langchain-adapters-only'
          ],
          correctAnswer: 1
        }
      },
      {
        id: 'c2-l2',
        title: 'Designing Perfect Prompt Architectures',
        content: `Prompt engineering shapes the deterministic responses of Large Language Models.
        
Key Strategies:
• System Instructions: Force a role or persona at the root configuration level.
• Few-Shot Examples: Give concrete input/output pairings inside the message thread.
• Structured JSON: Enforce response formats using JSON schemas inside configuration parameters.`,
        quiz: {
          question: 'What is the most robust method for forcing Gemini to output strict JSON conforming to types?',
          options: [
            'Capitalizing "PLEASE OUTPUT JSON" in current prompts',
            'Configuring schema validations using responseSchema in model configurations',
            'Running regular expressions manually on raw text output',
            'Asking user to parse the JSON themselves'
          ],
          correctAnswer: 1
        }
      }
    ]
  },
  {
    id: 'course-3',
    title: 'Figma Design Systems at Scale',
    category: 'Design',
    description: 'Master structural components, variant sets, auto layout 5.0, variables, and code translation for engineering collaboration.',
    duration: '10 hours',
    skillsGranted: ['Design Systems', 'Figma', 'UI/UX', 'Typography'],
    enrolled: false,
    completed: false,
    progress: 0,
    lessons: [
      {
        id: 'c3-l1',
        title: 'Tokens, Variables, and Semantic Color Systems',
        content: `A scalable design system is held together by variables and design tokens that translate properties directly between components and code.
        
Key Concepts:
• Primitive Tokens: Define raw values (e.g., #0F172A).
• Semantic Tokens: Map to roles (e.g., --color-bg-primary -> gray-900).
• Component Tokens: Constrain variables to single elements (e.g., --button-bg-hover -> active-blue).`,
        quiz: {
          question: 'Which token type refers to the logical purpose of a style (like background-primary) rather than a raw HEX code?',
          options: [
            'Primitive Token',
            'Semantic Token',
            'Local Variable Component Override',
            'Viewport Breakpoint Token'
          ],
          correctAnswer: 1
        }
      }
    ]
  },
  {
    id: 'course-4',
    title: 'Product-Led Growth (PLG) Strategy',
    category: 'Product',
    description: 'Transform self-service funnels, viral mechanisms, and engagement loops into quantitative retention engines.',
    duration: '6 hours',
    skillsGranted: ['PLG', 'Funnel Analytics', 'User Retention', 'A/B Testing'],
    enrolled: false,
    completed: false,
    progress: 0,
    lessons: [
      {
        id: 'c4-l1',
        title: 'Designing the "Aha!" Moment & Quick Time-to-Value',
        content: `Product-Led Growth shifts buyer vetting from sales pitches to hands-on usage.
        
Key Focuses:
• Time-To-Value (TTV): The latency between signup and first value realization.
• Aha! Moment: The cognitive click where the user understands the exact solution value.
• Friction Removal: Decoupling sign-up from credit cards or security gates.`,
        quiz: {
          question: 'What does "TTV" denote in product onboarding context?',
          options: [
            'Total Terminal Value',
            'Transit Team Volume',
            'Time-To-Value',
            'Total Task Velocity'
          ],
          correctAnswer: 2
        }
      }
    ]
  },
  {
    id: 'course-5',
    title: 'Docker & Kubernetes Core Orchestration',
    category: 'Engineering',
    description: 'Learn containerization, service meshes, configmaps, and ingress policies for high availability.',
    duration: '14 hours',
    skillsGranted: ['Docker', 'Kubernetes', 'Scalability', 'CI/CD'],
    enrolled: false,
    completed: false,
    progress: 0,
    lessons: [
      {
        id: 'c5-l1',
        title: 'Multi-stage Docker Layouts for Production',
        content: `Docker container images should be optimized, lightweight, and carry zero development source baggage.
        
Best Practices:
• Use multi-stage builds. Compile code in a base node image; copy only build output into a minimal runtime image.
• Prefer Alpine-based distributions to reduce vulnerability vectors.
• Bind servers to host 0.0.0.0 and port 3000 inside containers for Cloud Run gateways.`,
        quiz: {
          question: 'Why do we use multi-stage Docker builds?',
          options: [
            'To write multiple separate coding files in parallel',
            'To isolate the compilation steps and maintain clean, ultra-slim production runtime images',
            'To host the database and static assets in one file',
            'To deploy to multiple clouds concurrently'
          ],
          correctAnswer: 1
        }
      }
    ]
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'candidate-current',
    name: 'Khor Ming Yao',
    title: 'Associate Full-Stack Developer',
    bio: 'Self-taught engineer focusing on React applications and backend services. Eager to transition to high-impact software design teams.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    email: 'alex.carter@example.com',
    completedCourseIds: [],
    skills: ['React', 'TypeScript', 'Next.js', 'Docker', 'Tailwind', 'Node.js', 'SQL', 'Git', 'REST APIs', 'HTML5/CSS3'],
    skillLevels: {
      'React': 'Pro',
      'TypeScript': 'Pro',
      'Next.js': 'Intermediate',
      'Docker': 'Intermediate',
      'Tailwind': 'Pro',
      'Node.js': 'Intermediate',
      'SQL': 'Intermediate',
      'Git': 'Pro',
      'REST APIs': 'Pro',
      'HTML5/CSS3': 'Pro'
    },
    projects: [
      {
        id: 'user-p1',
        title: 'GitScribe - AI Commit Generator',
        description: 'React client extension using native LLMs to generate high-fidelity semantic comments from unstaged file edits.',
        skills: ['React', 'Prompt Engineering', 'TypeScript'],
        link: 'https://github.com/developer/git-scribe'
      }
    ],
    status: 'Open for Offers',
    isCurrentUser: true,
    followedJobIds: ['job-1', 'job-2']
  },
  {
    id: 'candidate-1',
    name: 'Meera Patel',
    title: 'AI Engineering Specialist',
    bio: 'Passionate builder of natural language tools. Moving from basic web engineering to LLM deployment and prompt architectures.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    email: 'meera.patel@example.com',
    completedCourseIds: ['course-2'],
    skills: ['Gemini API', 'AI Engineering', 'Prompt Engineering', 'Large Language Models'],
    skillLevels: {
      'Gemini API': 'Intermediate',
      'AI Engineering': 'Pro',
      'Prompt Engineering': 'Intermediate',
      'Large Language Models': 'Pro'
    },
    projects: [
      {
        id: 'p1-1',
        title: 'VectorSearch Wiki',
        description: 'Engineered a semantic search index matching Wikipedia abstracts to vector space coordinates in real-time.',
        skills: ['AI Engineering', 'Large Language Models']
      }
    ],
    status: 'Interviewing',
    followedJobIds: []
  },
  {
    id: 'candidate-2',
    name: 'Marcus Vance',
    title: 'Frontend Designer & Engineer',
    bio: 'Blending aesthetic rigor with deep component architectures. Expert in custom animations and design tokens.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    email: 'marcus.v@example.com',
    completedCourseIds: ['course-3', 'course-1'],
    skills: ['Design Systems', 'Figma', 'UI/UX', 'Typography', 'Next.js', 'React', 'Server Actions', 'SSR'],
    skillLevels: {
      'Design Systems': 'Pro',
      'Figma': 'Intermediate',
      'UI/UX': 'Intermediate',
      'Typography': 'Beginner',
      'Next.js': 'Intermediate',
      'React': 'Pro',
      'Server Actions': 'Intermediate',
      'SSR': 'Beginner'
    },
    projects: [
      {
        id: 'p2-1',
        title: 'Spectra - Fluid Design Library',
        description: 'Constructed an open-source animation ecosystem with perfect, hardware-accelerated spring-based curves.',
        skills: ['React', 'UI/UX']
      }
    ],
    status: 'Active',
    followedJobIds: []
  },
  {
    id: 'candidate-3',
    name: 'Sarah Jenkins',
    title: 'Growth Product Manager',
    bio: 'Spearheading product design backed by core operational frameworks. Experience running scalable self-service client funnels.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    email: 'sjenkins@example.com',
    completedCourseIds: ['course-4'],
    skills: ['PLG', 'Funnel Analytics', 'User Retention', 'A/B Testing'],
    skillLevels: {
      'PLG': 'Pro',
      'Funnel Analytics': 'Intermediate',
      'User Retention': 'Intermediate',
      'A/B Testing': 'Beginner'
    },
    projects: [],
    status: 'Open for Offers',
    followedJobIds: []
  },
  // job-1: Full-Stack Developer (Brainwave AI) — 1 more needed
  {
    id: 'candidate-4',
    name: 'Elena Vasquez',
    title: 'Full-Stack Engineer',
    bio: 'Shipping production React + Node.js apps for five years. Passionate about clean APIs and seamless server-side rendering with Next.js.',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=200',
    email: 'elena.v@example.com',
    completedCourseIds: ['course-1'],
    skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'REST APIs', 'SSR', 'SQL'],
    skillLevels: { 'React': 'Pro', 'Next.js': 'Pro', 'Node.js': 'Intermediate', 'TypeScript': 'Pro', 'REST APIs': 'Pro', 'SSR': 'Intermediate', 'SQL': 'Beginner' },
    projects: [{ id: 'p4-1', title: 'PulseBoard', description: 'Real-time analytics dashboard built on Next.js 14 with live server-sent events.', skills: ['Next.js', 'React'] }],
    status: 'Open for Offers',
    followedJobIds: ['job-1']
  },

  // job-2: Senior Frontend Architect (Veloce) — 1 more needed
  {
    id: 'candidate-5',
    name: 'Carlos Reyes',
    title: 'Frontend Architect',
    bio: 'Obsessed with micro-frontend patterns and design systems. Built scalable component ecosystems for fintech and SaaS at scale.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    email: 'carlos.r@example.com',
    completedCourseIds: ['course-1', 'course-3'],
    skills: ['React', 'TypeScript', 'Micro-Frontends', 'HTML5/CSS3', 'Next.js', 'State Management', 'SSR', 'Server Actions', 'Tailwind'],
    skillLevels: { 'React': 'Pro', 'TypeScript': 'Pro', 'Micro-Frontends': 'Pro', 'HTML5/CSS3': 'Pro', 'Next.js': 'Intermediate', 'State Management': 'Pro', 'SSR': 'Intermediate', 'Server Actions': 'Beginner', 'Tailwind': 'Intermediate' },
    projects: [{ id: 'p5-1', title: 'Nexus UI', description: 'Enterprise micro-frontend shell using Module Federation and custom design tokens.', skills: ['Micro-Frontends', 'React'] }],
    status: 'Interviewing',
    followedJobIds: ['job-2']
  },

  // job-3: Systems & Reliability Architect (Nebula Stream) — 8 more needed
  {
    id: 'candidate-6',
    name: 'Raj Patel',
    title: 'DevOps & Cloud Engineer',
    bio: 'Kubernetes cluster operator running multi-region deployments for high-traffic APIs. Specializes in cost-efficient container orchestration.',
    avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200',
    email: 'raj.p@example.com',
    completedCourseIds: ['course-2'],
    skills: ['Kubernetes', 'Go', 'AWS', 'Gemini API', 'AI Engineering'],
    skillLevels: { 'Kubernetes': 'Pro', 'Go': 'Pro', 'AWS': 'Pro', 'Gemini API': 'Beginner', 'AI Engineering': 'Beginner' },
    projects: [{ id: 'p6-1', title: 'K8s Auto-Scaler', description: 'Custom HPA controller that dynamically scales pods based on queue depth metrics.', skills: ['Kubernetes', 'Go'] }],
    status: 'Open for Offers',
    followedJobIds: ['job-3']
  },
  {
    id: 'candidate-7',
    name: 'Aisha Mohammed',
    title: 'Site Reliability Engineer',
    bio: 'SRE focused on keeping distributed systems at five-nines uptime. Deep experience with observability stacks and incident response playbooks.',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200',
    email: 'aisha.m@example.com',
    completedCourseIds: ['course-1'],
    skills: ['Terraform', 'GCP', 'Site Reliability', 'Next.js', 'React'],
    skillLevels: { 'Terraform': 'Pro', 'GCP': 'Pro', 'Site Reliability': 'Pro', 'Next.js': 'Intermediate', 'React': 'Intermediate' },
    projects: [],
    status: 'Active',
    followedJobIds: ['job-3']
  },
  {
    id: 'candidate-8',
    name: 'Sophie Chen',
    title: 'Infrastructure Architect',
    bio: 'Designed hybrid cloud infrastructures for Fortune 500 clients. Advocates for infrastructure-as-code and GitOps deployment pipelines.',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200',
    email: 'sophie.c@example.com',
    completedCourseIds: ['course-4'],
    skills: ['Docker', 'Ansible', 'Azure', 'PLG', 'Funnel Analytics'],
    skillLevels: { 'Docker': 'Pro', 'Ansible': 'Pro', 'Azure': 'Intermediate', 'PLG': 'Beginner', 'Funnel Analytics': 'Beginner' },
    projects: [{ id: 'p8-1', title: 'TerraStack', description: 'Open-source Terraform modules for zero-downtime blue-green deployments on AWS EKS.', skills: ['Terraform', 'Docker'] }],
    status: 'Open for Offers',
    followedJobIds: ['job-3']
  },
  {
    id: 'candidate-9',
    name: 'Priya Nair',
    title: 'Cloud Platform Engineer',
    bio: 'Builds resilient microservice platforms on Kubernetes with automated chaos engineering to validate fault tolerance before production release.',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=200',
    email: 'priya.n@example.com',
    completedCourseIds: ['course-3'],
    skills: ['Rust', 'WebAssembly', 'Micro-Frontends', 'Design Systems'],
    skillLevels: { 'Rust': 'Pro', 'WebAssembly': 'Intermediate', 'Micro-Frontends': 'Beginner', 'Design Systems': 'Intermediate' },
    projects: [],
    status: 'Interviewing',
    followedJobIds: ['job-3']
  },
  {
    id: 'candidate-10',
    name: 'Jordan Williams',
    title: 'Backend & Systems Engineer',
    bio: 'Writes high-throughput Node.js services deployed on containerized fleets. Strong grasp of distributed tracing and service mesh architectures.',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=200',
    email: 'jordan.w@example.com',
    completedCourseIds: ['course-2'],
    skills: ['Python', 'Django', 'PostgreSQL', 'Large Language Models', 'Prompt Engineering'],
    skillLevels: { 'Python': 'Pro', 'Django': 'Pro', 'PostgreSQL': 'Pro', 'Large Language Models': 'Intermediate', 'Prompt Engineering': 'Intermediate' },
    projects: [{ id: 'p10-1', title: 'Tracewire', description: 'Lightweight distributed tracing SDK for Node.js microservices with zero-overhead sampling.', skills: ['Python', 'PostgreSQL'] }],
    status: 'Active',
    followedJobIds: ['job-3']
  },
  {
    id: 'candidate-11',
    name: 'Kevin Zhang',
    title: 'Platform Reliability Engineer',
    bio: 'Passionate about runbook automation and proactive capacity planning. Runs on-call rotations for global streaming platforms with 50M+ users.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    email: 'kevin.z@example.com',
    completedCourseIds: [],
    skills: ['Kubernetes', 'CI/CD', 'Docker', 'Scalability', 'Performance Optimization', 'SQL'],
    skillLevels: { 'Kubernetes': 'Pro', 'CI/CD': 'Pro', 'Docker': 'Intermediate', 'Scalability': 'Pro', 'Performance Optimization': 'Intermediate', 'SQL': 'Beginner' },
    projects: [],
    status: 'Open for Offers',
    followedJobIds: ['job-3']
  },
  {
    id: 'candidate-12',
    name: 'Tom Bradley',
    title: 'DevOps Lead',
    bio: 'Led migration of a legacy monolith to 40+ containerized microservices. Expert in pipeline automation, secrets management, and release gating.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    email: 'tom.b@example.com',
    completedCourseIds: [],
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Node.js', 'TypeScript', 'REST APIs'],
    skillLevels: { 'Docker': 'Pro', 'Kubernetes': 'Intermediate', 'CI/CD': 'Pro', 'Node.js': 'Intermediate', 'TypeScript': 'Intermediate', 'REST APIs': 'Intermediate' },
    projects: [{ id: 'p12-1', title: 'PipelineZero', description: 'Self-healing CI/CD pipeline with automatic rollback on error-rate threshold breach.', skills: ['CI/CD', 'Docker'] }],
    status: 'Active',
    followedJobIds: ['job-3']
  },
  {
    id: 'candidate-13',
    name: 'Daniel Lee',
    title: 'Cloud Infrastructure Engineer',
    bio: 'Certified Kubernetes administrator specializing in multi-cloud federation and cost optimization strategies for large engineering orgs.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    email: 'daniel.l@example.com',
    completedCourseIds: [],
    skills: ['Kubernetes', 'CI/CD', 'Docker', 'SQL', 'Node.js', 'Scalability'],
    skillLevels: { 'Kubernetes': 'Pro', 'CI/CD': 'Intermediate', 'Docker': 'Pro', 'SQL': 'Intermediate', 'Node.js': 'Beginner', 'Scalability': 'Intermediate' },
    projects: [],
    status: 'Open for Offers',
    followedJobIds: ['job-3']
  },

  // job-4: Product Innovation Specialist (Linear Labs) — 11 more needed
  {
    id: 'candidate-14',
    name: 'James Okafor',
    title: 'Growth Product Manager',
    bio: 'Drives self-serve product-led growth at B2B SaaS companies. Known for cutting activation time from 14 days to 48 hours through smart onboarding funnels.',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200',
    email: 'james.o@example.com',
    completedCourseIds: ['course-4'],
    skills: ['PLG', 'A/B Testing', 'User Retention', 'Funnel Analytics'],
    skillLevels: { 'PLG': 'Pro', 'A/B Testing': 'Pro', 'User Retention': 'Intermediate', 'Funnel Analytics': 'Intermediate' },
    projects: [{ id: 'p14-1', title: 'ActivateIQ', description: 'In-app onboarding engine that adapts journey steps based on user persona segmentation.', skills: ['PLG', 'Funnel Analytics'] }],
    status: 'Interviewing',
    followedJobIds: ['job-4']
  },
  {
    id: 'candidate-15',
    name: 'Nina Kowalski',
    title: 'Product-Led Growth Strategist',
    bio: 'Converted two enterprise tools into PLG-first products, reducing CAC by 40% within the first quarter of self-serve launch.',
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=200',
    email: 'nina.k@example.com',
    completedCourseIds: [],
    skills: ['UX Research', 'Figma', 'Prototyping', 'User Interviews'],
    skillLevels: { 'UX Research': 'Pro', 'Figma': 'Intermediate', 'Prototyping': 'Pro', 'User Interviews': 'Pro' },
    projects: [],
    status: 'Open for Offers',
    followedJobIds: ['job-4']
  },
  {
    id: 'candidate-16',
    name: 'Michael Torres',
    title: 'Retention & Growth PM',
    bio: 'Builds churn prediction models and personalised re-engagement workflows. Grew 90-day retention rates from 42% to 71% at a Series B startup.',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
    email: 'michael.t@example.com',
    completedCourseIds: [],
    skills: ['User Retention', 'A/B Testing', 'Funnel Analytics', 'PLG'],
    skillLevels: { 'User Retention': 'Pro', 'A/B Testing': 'Pro', 'Funnel Analytics': 'Intermediate', 'PLG': 'Beginner' },
    projects: [{ id: 'p16-1', title: 'RetainOS', description: 'Churn scoring pipeline using behavioural signals to trigger automated win-back campaigns.', skills: ['User Retention', 'Funnel Analytics'] }],
    status: 'Active',
    followedJobIds: ['job-4']
  },
  {
    id: 'candidate-17',
    name: 'Alex Kim',
    title: 'Experimentation Analyst',
    bio: 'Runs hundreds of A/B tests annually across web and mobile surfaces. Expert at statistical significance, novelty effects, and experiment design.',
    avatar: 'https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?auto=format&fit=crop&q=80&w=200',
    email: 'alex.k@example.com',
    completedCourseIds: [],
    skills: ['SQL', 'Tableau', 'Python', 'Data Visualization'],
    skillLevels: { 'SQL': 'Pro', 'Tableau': 'Pro', 'Python': 'Intermediate', 'Data Visualization': 'Pro' },
    projects: [],
    status: 'Open for Offers',
    followedJobIds: ['job-4']
  },
  {
    id: 'candidate-18',
    name: 'Lisa Park',
    title: 'Growth & Analytics Lead',
    bio: 'Wired multi-touch attribution across paid and organic channels for a $200M ARR SaaS company. Turns data into acquisition playbooks.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    email: 'lisa.p@example.com',
    completedCourseIds: ['course-4'],
    skills: ['Funnel Analytics', 'A/B Testing', 'PLG', 'User Retention'],
    skillLevels: { 'Funnel Analytics': 'Pro', 'A/B Testing': 'Intermediate', 'PLG': 'Intermediate', 'User Retention': 'Pro' },
    projects: [{ id: 'p18-1', title: 'FunnelLens', description: 'Attribution dashboard unifying paid, organic, and referral conversion touchpoints.', skills: ['Funnel Analytics', 'PLG'] }],
    status: 'Interviewing',
    followedJobIds: ['job-4']
  },
  {
    id: 'candidate-19',
    name: 'Maria Santos',
    title: 'Product Growth Manager',
    bio: 'Designed viral referral loops and in-app upgrade prompts that drove 3x expansion revenue for a developer tooling startup.',
    avatar: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&q=80&w=200',
    email: 'maria.s@example.com',
    completedCourseIds: [],
    skills: ['Copywriting', 'SEO', 'Content Strategy', 'Social Media'],
    skillLevels: { 'Copywriting': 'Pro', 'SEO': 'Pro', 'Content Strategy': 'Intermediate', 'Social Media': 'Intermediate' },
    projects: [],
    status: 'Active',
    followedJobIds: ['job-4']
  },
  {
    id: 'candidate-20',
    name: 'Emma Wilson',
    title: 'Customer Success Manager',
    bio: 'Dedicated to ensuring clients achieve their goals. Handles enterprise accounts and conducts quarterly business reviews to drive renewals and upsells.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    email: 'emma.w@example.com',
    completedCourseIds: [],
    skills: ['Zendesk', 'Customer Success', 'Onboarding', 'Account Management'],
    skillLevels: { 'Zendesk': 'Pro', 'Customer Success': 'Pro', 'Onboarding': 'Intermediate', 'Account Management': 'Beginner' },
    projects: [],
    status: 'Open for Offers',
    followedJobIds: ['job-4']
  },
  {
    id: 'candidate-21',
    name: 'Rachel Green',
    title: 'Visual Designer',
    bio: 'Specializes in creating stunning brand identities, marketing assets, and social media graphics that capture attention and drive engagement.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    email: 'rachel.g@example.com',
    completedCourseIds: [],
    skills: ['Adobe Creative Suite', 'Illustrator', 'Branding', 'Typography'],
    skillLevels: { 'Adobe Creative Suite': 'Pro', 'Illustrator': 'Pro', 'Branding': 'Intermediate', 'Typography': 'Intermediate' },
    projects: [{ id: 'p21-1', title: 'BrandRevive', description: 'Complete brand overhaul and visual identity refresh for a series B fintech startup.', skills: ['Branding', 'Illustrator'] }],
    status: 'Active',
    followedJobIds: ['job-4']
  },
  {
    id: 'candidate-22',
    name: 'Ben Carter',
    title: 'Account Executive',
    bio: 'Top-performing sales closer with a track record of exceeding $1M quotas. Expert at navigating complex enterprise procurement processes.',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=200',
    email: 'ben.c@example.com',
    completedCourseIds: [],
    skills: ['B2B Sales', 'Salesforce', 'Negotiation', 'Cold Calling'],
    skillLevels: { 'B2B Sales': 'Pro', 'Salesforce': 'Pro', 'Negotiation': 'Intermediate', 'Cold Calling': 'Beginner' },
    projects: [],
    status: 'Open for Offers',
    followedJobIds: ['job-4']
  },
  {
    id: 'candidate-23',
    name: 'Olivia Brooks',
    title: 'Operations Manager',
    bio: 'Streamlines internal processes and supply chains. Focused on resource allocation, vendor negotiation, and reducing operational bloat.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    email: 'olivia.b@example.com',
    completedCourseIds: [],
    skills: ['Operations', 'Supply Chain', 'Vendor Management', 'Logistics'],
    skillLevels: { 'Operations': 'Pro', 'Supply Chain': 'Intermediate', 'Vendor Management': 'Intermediate', 'Logistics': 'Pro' },
    projects: [{ id: 'p23-1', title: 'LeanOps', description: 'Implemented a lean inventory system that reduced overhead costs by 15% across three warehouses.', skills: ['Operations', 'Logistics'] }],
    status: 'Interviewing',
    followedJobIds: ['job-4']
  },
  {
    id: 'candidate-24',
    name: 'Zoe Nguyen',
    title: 'HR & Talent Partner',
    bio: 'Builds culture and scales teams. Specialized in talent acquisition, employee relations, and crafting competitive compensation packages.',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=200',
    email: 'zoe.n@example.com',
    completedCourseIds: [],
    skills: ['Talent Acquisition', 'Employee Relations', 'HRIS', 'Interviewing'],
    skillLevels: { 'Talent Acquisition': 'Pro', 'Employee Relations': 'Pro', 'HRIS': 'Intermediate', 'Interviewing': 'Beginner' },
    projects: [],
    status: 'Active',
    followedJobIds: ['job-4']
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Full-Stack Developer (Generative Products)',
    company: 'Brainwave AI',
    logo: '⚡',
    description: 'Looking for a full-stack generalist to bridge client experience with advanced AI backends. You will implement features using Gemini API interfaces and next-generation UI models.',
    skillsNeeded: [
      'HTML5/CSS3',
      'React',
      'TypeScript',
      'SQL',
      'Tailwind',
      'Next.js',
      'State Management',
      'Node.js',
      'Docker',
      'Micro-Frontends',
      'SSR',
      'Server Actions',
      'REST APIs',
      'Kubernetes',
      'Performance Optimization',
      'GraphQL',
      'Testing/Vitest',
      'Scalability',
      'CI/CD',
      'Prompt Engineering',
      'Gemini API'
    ],
    salary: '$120k – $155k',
    type: 'Full-time',
    location: 'Remote (US/Canada)',
    datePosted: '2 days ago',
    applicantsCount: 4
  },
  {
    id: 'job-2',
    title: 'Senior Frontend Architect',
    company: 'Veloce Platforms',
    logo: '▲',
    description: 'Help us drive our flagship micro-frontend frameworks into Next.js 14 serverless configurations. Deep knowledge of static streaming, hydrate caching, and server actions required.',
    skillsNeeded: [
      'HTML5/CSS3',
      'React',
      'TypeScript',
      'SQL',
      'Tailwind',
      'Next.js',
      'State Management',
      'Node.js',
      'Docker',
      'Micro-Frontends',
      'SSR',
      'Server Actions',
      'REST APIs',
      'Kubernetes',
      'Performance Optimization',
      'GraphQL',
      'Testing/Vitest',
      'Scalability',
      'CI/CD',
      'Prompt Engineering',
      'Gemini API'
    ],
    salary: '$140k – $180k',
    type: 'Full-time',
    location: 'New York, NY (Hybrid)',
    datePosted: 'Just now',
    applicantsCount: 0
  },
  {
    id: 'job-3',
    title: 'Systems & Reliability Architect',
    company: 'Nebula Stream',
    logo: '🪐',
    description: 'We need engineers capable of running robust global deployments. Experience shaping service load policies, Multi-region Docker layouts, and complex Kubernetes schedules is key.',
    skillsNeeded: [
      'HTML5/CSS3',
      'React',
      'TypeScript',
      'SQL',
      'Tailwind',
      'Next.js',
      'State Management',
      'Node.js',
      'Docker',
      'Micro-Frontends',
      'SSR',
      'Server Actions',
      'REST APIs',
      'Kubernetes',
      'Performance Optimization',
      'GraphQL',
      'Testing/Vitest',
      'Scalability',
      'CI/CD',
      'Prompt Engineering',
      'Gemini API'
    ],
    salary: '$160k – $210k',
    type: 'Full-time',
    location: 'Remote',
    datePosted: '3 days ago',
    applicantsCount: 9
  },
  {
    id: 'job-4',
    title: 'Product Innovation Specialist',
    company: 'Linear Labs',
    logo: '⚙️',
    description: 'Manage growth cycles focusing strictly on client conversion metrics. You will take charge of our telemetry, identify product activation barriers, and spearhead self-service conversion loops.',
    skillsNeeded: [
      'A/B Testing',
      'User Retention',
      'Funnel Analytics',
      'PLG'
    ],
    salary: '$115k – $145k',
    type: 'Contract',
    location: 'San Francisco, CA',
    datePosted: '5 days ago',
    applicantsCount: 12
  }
];

export const INITIAL_REQUESTS: CourseRequest[] = [
  {
    id: 'request-1',
    title: 'Rust Safe Systems & WebAssembly Compilation',
    description: 'Recruiters are seeing a severe lack of candidates comfortable with WebAssembly memory targets and rust safety structures. This course should cover Cargo configurations, compiler targets, and web bindings.',
    notes: 'We have 3 open Senior WebAssembly roles and none of the web candidates we find have any real proof of high-availability Rust code.',
    skillsWanted: ['Rust', 'WebAssembly', 'Memory Safety'],
    recruiterName: 'Elena Rostova',
    company: 'Veloce Platforms',
    status: 'Pending',
    dateRequested: '1 day ago'
  },
  {
    id: 'request-2',
    title: 'Advanced System Design & Distributed Databases',
    description: 'We require verification that candidates understand database indexing, CAP theorem applications, sharding structures, and replication loops.',
    notes: 'Approved as a critical core need for candidate upskilling. This course will yield "System Design" and "Databases" micro-badges.',
    skillsWanted: ['System Design', 'NoSQL', 'CAP Theorem'],
    recruiterName: 'Sarah Jenkins (Hiring Tech Lead)',
    company: 'Brainwave AI',
    status: 'Approved',
    dateRequested: '3 days ago'
  }
];
