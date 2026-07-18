import { Course, Candidate, Job, CourseRequest } from './types';

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
    name: 'Alex Carter',
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
    followedJobIds: []
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
