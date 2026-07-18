import type { SyllabusNode, SyllabusSlide, SyllabusQuiz } from './types';

// Default syllabus path for job-1: Full-Stack Developer (Generative Products) at Brainwave AI
export const defaultFullStackSyllabus: SyllabusNode[] = [
  {
    id: 'web-foundations',
    name: 'Web Foundations (HTML5 & CSS3)',
    description: 'Master HTML5 semantic structures, CSS layout models (Flexbox, Grid), and responsive viewport configurations.',
    x: 80,
    y: 220,
    prerequisites: [],
    slides: [
      {
        id: 'wf-s1',
        title: 'Semantic HTML5',
        type: 'intro',
        content: 'Semantic HTML introduces meaning to the web page rather than just presentation. Tags like <header>, <nav>, <main>, <section>, and <footer> explain their purpose to both browser engines and screen readers.'
      },
      {
        id: 'wf-s2',
        title: 'Modern CSS Layouts (Grid & Flexbox)',
        type: 'concept',
        content: 'Flexbox is designed for one-dimensional layouts (a row or a column), whereas Grid is optimized for two-dimensional grids (rows and columns simultaneously). Combining them allows creating highly complex responsive frames.'
      }
    ],
    quiz: {
      question: 'Which CSS property defines a two-dimensional grid layout?',
      options: ['display: flex', 'display: grid', 'display: block', 'display: inline'],
      correctOptionIndex: 1
    },
    evaluationQuestions: [
      'Write a responsive navigation layout utilizing Flexbox rules.',
      'Explain how a browser parses semantic tags differently than raw div elements.'
    ]
  },
  {
    id: 'ts-essentials',
    name: 'TypeScript Essentials',
    description: 'Master static typing, generic interfaces, utility types, and strict compilation checks.',
    x: 260,
    y: 130,
    prerequisites: ['web-foundations'],
    slides: [
      {
        id: 'ts-s1',
        title: 'Why Static Typing?',
        type: 'intro',
        content: 'TypeScript compiles to clean JavaScript but adds a static type layer. This catches bugs at compilation time, provides auto-completion in editors, and documents parameters explicitly.'
      },
      {
        id: 'ts-s2',
        title: 'Generics & Reusability',
        type: 'concept',
        content: 'Generics let functions, interfaces, or classes handle variable type parameters. Instead of typing something as "any", generic constraints preserve absolute type safety.'
      }
    ],
    quiz: {
      question: 'What keyword constraints generic types to contain specific fields?',
      options: ['extends', 'implements', 'as', 'keyof'],
      correctOptionIndex: 0
    },
    evaluationQuestions: [
      'Write a generic interface APIResponse<T> mapping custom data payloads.',
      'Discuss the difference between unknown and any type declarations.'
    ]
  },
  {
    id: 'tailwind-styling',
    name: 'Tailwind CSS Styling',
    description: 'Construct sleek UI layouts using responsive class utilities, dark mode modifiers, and glassmorphic designs.',
    x: 260,
    y: 310,
    prerequisites: ['web-foundations'],
    slides: [
      {
        id: 'tw-s1',
        title: 'Utility-First Styles',
        type: 'intro',
        content: 'Tailwind CSS works by scanning files for classes and building a static stylesheet. This keeps the output bundle extremely small and avoids styling collisions.'
      },
      {
        id: 'tw-s2',
        title: 'Designing Glassmorphism',
        type: 'concept',
        content: 'We combine backdrop-blur filters, thin semi-transparent white borders, and dark backgrounds with lower opacity (e.g. bg-slate-900/60) to render premium glossy cards.'
      }
    ],
    quiz: {
      question: 'What Tailwind class maps to the CSS backdrop-filter blur rule?',
      options: ['blur-md', 'backdrop-blur-md', 'filter-blur', 'bg-blur'],
      correctOptionIndex: 1
    },
    evaluationQuestions: [
      'Create a custom button variant using Tailwind utilities, with hover transition triggers.',
      'How does Tailwind CSS eliminate unused utility definitions during production compilation?'
    ]
  },
  {
    id: 'react-19-core',
    name: 'React 19 Foundations',
    description: 'Master state management, component lifecycle, ref triggers, and the new build-time React Compiler.',
    x: 440,
    y: 130,
    prerequisites: ['ts-essentials'],
    slides: [
      {
        id: 'r19-s1',
        title: 'React 19 Compiler',
        type: 'intro',
        content: 'React 19 introduces the React Compiler, which automatically memoizes values. Developers no longer need to write useMemo or useCallback hooks to prevent extra child rendering cycles.'
      },
      {
        id: 'r19-s2',
        title: 'React Actions & Transitions',
        type: 'concept',
        content: 'Actions automate managing pending indicators, success, and error states when triggering async operations (like network updates) from form elements.'
      }
    ],
    quiz: {
      question: 'Which hook simplifies tracking form actions pending states in React 19?',
      options: ['useFormState', 'useActionState', 'useTransitionState', 'useAsyncEffect'],
      correctOptionIndex: 1
    },
    evaluationQuestions: [
      'Explain how the React Compiler optimizes re-rendering paths.',
      'Demonstrate a form submission component utilizing the new useActionState hook.'
    ]
  },
  {
    id: 'nextjs-router',
    name: 'Next.js App Router',
    description: 'Build React Server Components (RSC), handle nested layouts, streaming suspended elements, and page routing.',
    x: 620,
    y: 130,
    prerequisites: ['react-19-core'],
    slides: [
      {
        id: 'nx-s1',
        title: 'React Server Components',
        type: 'intro',
        content: 'Next.js routes render Server Components by default. Data fetching runs directly on the server, outputting HTML to the client and reducing bundle sizes.'
      },
      {
        id: 'nx-s2',
        title: 'Layout Preservation',
        type: 'concept',
        content: 'layout.tsx defines persistent headers/footers. During client transitions, layout states are preserved, and only page.tsx components swap out.'
      }
    ],
    quiz: {
      question: 'Which Next.js file preserves sub-route states during page navigation?',
      options: ['page.tsx', 'layout.tsx', 'route.ts', 'template.tsx'],
      correctOptionIndex: 1
    },
    evaluationQuestions: [
      'Explain data fetching advantages in a React Server Component (RSC) compared to client-side useEffect queries.',
      'How does streaming with Suspense improve initial page layouts and Largest Contentful Paint (LCP) metrics?'
    ]
  },
  {
    id: 'server-actions',
    name: 'Server Actions & SSR',
    description: 'Learn secure server-side form mutations, cache revalidation, and server-side rendering (SSR) data flows.',
    x: 800,
    y: 130,
    prerequisites: ['nextjs-router'],
    slides: [
      {
        id: 'sa-s1',
        title: 'Server Actions',
        type: 'intro',
        content: 'Server Actions are async functions declared with "use server". They execute on the server but can be invoked directly from client components as simple callbacks.'
      },
      {
        id: 'sa-s2',
        title: 'Data Revalidation',
        type: 'concept',
        content: 'After completing a database update in a Server Action, we call revalidatePath or revalidateTag to purge Next.js server caches and fetch fresh layouts.'
      }
    ],
    quiz: {
      question: 'Which command purges client routing caches in Next.js Server Actions?',
      options: ['router.refresh()', 'revalidatePath()', 'cache.clear()', 'db.update()'],
      correctOptionIndex: 1
    },
    evaluationQuestions: [
      'How do Server Actions maintain CSRF security protections?',
      'Write a Server Action database update that triggers a page revalidation.'
    ]
  },
  {
    id: 'postgres-sql',
    name: 'Database Design & SQL',
    description: 'Understand relation mapping, database indexes, and database query executions using PostgreSQL.',
    x: 440,
    y: 310,
    prerequisites: ['tailwind-styling'],
    slides: [
      {
        id: 'db-s1',
        title: 'Relational Database Design',
        type: 'intro',
        content: 'PostgreSQL organizes structured records into tables, mapping relations via primary/foreign keys. This ensures data consistency (ACID properties).'
      },
      {
        id: 'db-s2',
        title: 'Indexes and Performance',
        type: 'concept',
        content: 'Database indexes speed up search lookups. B-Tree indexes on query columns prevent full table scans but add minimal write overhead.'
      }
    ],
    quiz: {
      question: 'Which index type is the default index created by PostgreSQL?',
      options: ['Hash Index', 'B-Tree Index', 'GIN Index', 'GiST Index'],
      correctOptionIndex: 1
    },
    evaluationQuestions: [
      'Design a one-to-many relationship schema for Jobs and Applicants.',
      'Explain the performance impact of creating indexes on columns that undergo frequent updates.'
    ]
  },
  {
    id: 'docker-containers',
    name: 'Docker Containers',
    description: 'Virtualize backend runtime packages, optimize multi-stage Dockerfiles, and configure containers.',
    x: 620,
    y: 310,
    prerequisites: ['postgres-sql'],
    slides: [
      {
        id: 'doc-s1',
        title: 'What is a Container?',
        type: 'intro',
        content: 'Docker virtualizes applications inside containers. Containers bundle the code, system tools, libraries, and settings, running identically on any machine.'
      },
      {
        id: 'doc-s2',
        title: 'Multi-Stage Dockerfiles',
        type: 'concept',
        content: 'Multi-stage builds split compilation tasks. We build code in a full Node environment, then copy compiled js assets into a light Alpine container, trimming sizes.'
      }
    ],
    quiz: {
      question: 'What is the benefit of a multi-stage Dockerfile?',
      options: [
        'To speed up download speeds',
        'To keep production images slim by discarding compilation tools',
        'To run multiple servers on one container',
        'To bypass container firewall checks'
      ],
      correctOptionIndex: 1
    },
    evaluationQuestions: [
      'Write a multi-stage Dockerfile for a React Vite build.',
      'Describe how Docker layer caching optimizes docker image builds.'
    ]
  },
  {
    id: 'deployment-cicd',
    name: 'CI/CD & Cloud Deployment',
    description: 'Automate GitHub pipeline verification, build testing hooks, and deploy containers securely.',
    x: 980,
    y: 220,
    prerequisites: ['server-actions', 'docker-containers'],
    slides: [
      {
        id: 'cd-s1',
        title: 'Automated Pipelines',
        type: 'intro',
        content: 'CI/CD processes automatically test, build, and deploy new features on every git branch merge, ensuring regression protection.'
      },
      {
        id: 'cd-s2',
        title: 'Cloud Run & Edge Deployments',
        type: 'concept',
        content: 'We deploy containerized backends to serverless gateways like Google Cloud Run. Edge frameworks deploy static headers globally near user request locations.'
      }
    ],
    quiz: {
      question: 'What does the CD segment of CI/CD denote?',
      options: ['Continuous Delivery / Deployment', 'Containerized Database', 'Client Distribution', 'Compilation Diagnostics'],
      correctOptionIndex: 0
    },
    evaluationQuestions: [
      'Design a GitHub Actions workflow that executes vitest tests on pull request branches.',
      'Explain how rolling container deployments prevent service downtime.'
    ]
  }
];

// Helper to generate dynamic skill nodes based on recruiter's input
export function generateSyllabusForJob(
  title: string,
  competencies: string[]
): SyllabusNode[] {
  const allCompetencies = [...competencies];
  if (allCompetencies.length < 5) {
    allCompetencies.push('Systems Design', 'Testing & QA', 'Deployment');
  }

  const nodes: SyllabusNode[] = [];
  const spacingX = 170;
  
  allCompetencies.forEach((comp, index) => {
    const id = comp.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + index;
    const name = comp.trim();
    
    const layer = index;
    const x = 100 + layer * spacingX;
    
    let y = 220;
    if (index > 0) {
      if (index % 3 === 1) y = 130;
      if (index % 3 === 2) y = 310;
    }

    const prerequisites: string[] = [];
    if (index > 0) {
      const prevNode = nodes[index - 1];
      prerequisites.push(prevNode.id);
      
      if (index > 2 && index % 2 === 0) {
        prerequisites.push(nodes[index - 3].id);
      }
    }

    const slides: SyllabusSlide[] = [
      {
        id: `${id}-slide-1`,
        title: `Introduction to ${name}`,
        type: 'intro',
        content: `Welcome to the ${name} training syllabus. This module has been synthesized specifically for the ${title} position. You will explore core concepts, standards, and practical application patterns needed for this role.`
      },
      {
        id: `${id}-slide-2`,
        title: `${name} Core Concepts`,
        type: 'concept',
        content: `Understanding the design patterns and architectural limitations of ${name}. Effective developers must grasp how ${name} coordinates resources, manages memory lifecycle, and interfaces with adjacent technology layers.`
      },
      {
        id: `${id}-slide-3`,
        title: `Implementing ${name}`,
        type: 'code',
        content: `Below is a basic implementation sample utilizing standard configurations and optimal execution methods.`,
        codeSnippet: `// Sample implementation of ${name}
import { initialize } from '${id}-core';

export async function handleRequest(request: Request) {
  const service = initialize({
    debug: false,
    timeoutMs: 5000
  });
  
  try {
    const result = await service.process(request.body);
    return Response.json({ success: true, payload: result });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}`
      }
    ];

    const quiz: SyllabusQuiz = {
      question: `What is a primary engineering design consideration when deploying ${name}?`,
      options: [
        'Optimizing memory allocation and throughput overhead',
        'Applying standard styling templates to the database model',
        'Configuring user email validations directly in the library',
        'No major design factors exist'
      ],
      correctOptionIndex: 0
    };

    const evaluationQuestions = [
      `Write a short description on how you would configure ${name} to support high throughput and vertical scaling.`,
      `Detail a scenario where you debugged a memory leak or layout issue when utilizing ${name}.`
    ];

    nodes.push({
      id,
      name,
      description: `Synthesized course covering ${name} specifications, implementation patterns, and testing metrics.`,
      x,
      y,
      prerequisites,
      slides,
      quiz,
      evaluationQuestions
    });
  });

  return nodes;
}
