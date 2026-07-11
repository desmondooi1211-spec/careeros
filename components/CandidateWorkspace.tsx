import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { 
  GraduationCap, 
  Award, 
  Briefcase, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  ExternalLink, 
  Clock, 
  Search, 
  ArrowRight, 
  Cpu, 
  Check, 
  ShieldCheck, 
  MapPin, 
  DollarSign, 
  Layers,
  Compass,
  List,
  GitBranch,
  X,
  Lock
} from 'lucide-react';
import { Course, Candidate, Job, Project, Lesson } from '@/lib/types';

export interface SkillNode {
  name: string;
  x: number;
  y: number;
  tier: number;
  description: string;
  prerequisites: string[];
  courseId?: string;
}

export const SKILL_TREES: Record<string, {
  title: string;
  description: string;
  nodes: SkillNode[];
}> = {
  'Full-Stack': {
    title: 'Full-Stack Developer',
    description: 'Master modular React architectures, serverless Next.js optimization, containerized orchestrations, and high-availability systems.',
    nodes: [
      { name: 'HTML5/CSS3', x: 100, y: 50, tier: 1, description: 'Hypertext markup and semantic layout formatting.', prerequisites: [] },
      { name: 'React', x: 100, y: 150, tier: 1, description: 'Declarative component-driven interfaces and reactivity model.', prerequisites: [] },
      { name: 'TypeScript', x: 100, y: 250, tier: 1, description: 'Statically typed superset of JavaScript.', prerequisites: [] },
      { name: 'SQL', x: 100, y: 350, tier: 1, description: 'Relational database querying and schemas.', prerequisites: [] },
      
      { name: 'Tailwind', x: 280, y: 50, tier: 2, description: 'Utility-first styling system and responsive design.', prerequisites: ['HTML5/CSS3'] },
      { name: 'Next.js', x: 280, y: 130, tier: 2, description: 'Server-Side Rendering, App Router, static optimizations, and edge runtimes.', prerequisites: ['React'], courseId: 'course-1' },
      { name: 'State Management', x: 280, y: 210, tier: 2, description: 'Global state orchestration, unidirectional flow, and store architectures.', prerequisites: ['React'] },
      { name: 'Node.js', x: 280, y: 290, tier: 2, description: 'Server-side JavaScript runtime.', prerequisites: ['TypeScript'] },
      { name: 'Docker', x: 280, y: 370, tier: 2, description: 'Container deployment structures, file packaging, and environments.', prerequisites: ['TypeScript'], courseId: 'course-5' },
      
      { name: 'Micro-Frontends', x: 460, y: 50, tier: 3, description: 'Decoupled frontend application chunks combined into a shell.', prerequisites: ['Next.js'] },
      { name: 'SSR', x: 460, y: 130, tier: 3, description: 'Server-Side Rendering strategies and dynamic hydrations.', prerequisites: ['Next.js'], courseId: 'course-1' },
      { name: 'Server Actions', x: 460, y: 210, tier: 3, description: 'Zero-API server-side database mutation scope.', prerequisites: ['Next.js'], courseId: 'course-1' },
      { name: 'REST APIs', x: 460, y: 290, tier: 3, description: 'HTTP RESTful service endpoint architectures.', prerequisites: ['Node.js', 'SQL'] },
      { name: 'Kubernetes', x: 460, y: 370, tier: 3, description: 'Container orchestration, scale triggers, and cluster networking.', prerequisites: ['Docker'], courseId: 'course-5' },
      
      { name: 'Performance Optimization', x: 640, y: 130, tier: 4, description: 'Hydration metrics, asset compression, and bundle size reduction.', prerequisites: ['SSR'] },
      { name: 'GraphQL', x: 640, y: 210, tier: 4, description: 'Declarative queries and type-safe schemas.', prerequisites: ['REST APIs'] },
      { name: 'Testing/Vitest', x: 640, y: 290, tier: 4, description: 'Component and integration test validation setups.', prerequisites: ['REST APIs'] },
      { name: 'Scalability', x: 640, y: 370, tier: 4, description: 'Traffic load balancing, caching loops, and cluster replication.', prerequisites: ['Kubernetes'], courseId: 'course-5' },
      { name: 'CI/CD', x: 640, y: 450, tier: 4, description: 'Automated test systems, compile validations, and instant pipelines.', prerequisites: ['Kubernetes'], courseId: 'course-5' },
      
      { name: 'Prompt Engineering', x: 820, y: 210, tier: 5, description: 'System constraints, personas, and structured JSON schemas.', prerequisites: ['GraphQL'], courseId: 'course-2' },
      { name: 'Gemini API', x: 820, y: 290, tier: 5, description: 'Google Developer SDK client initialization and streaming queries.', prerequisites: ['Prompt Engineering'], courseId: 'course-2' }
    ]
  },
  'AI Specialist': {
    title: 'AI Engineering Specialist',
    description: 'Unlock vector spaces, master large language models, refine structured prompts, and coordinate Gemini agents.',
    nodes: [
      { name: 'AI Fundamentals', x: 100, y: 400, tier: 1, description: 'Core principles of machine learning, statistical models, and pattern recognition.', prerequisites: [] },
      { name: 'Deep Learning', x: 260, y: 400, tier: 1, description: 'Understanding layers, activation functions, and backpropagation.', prerequisites: ['AI Fundamentals'] },
      { name: 'Neural Networks', x: 420, y: 400, tier: 2, description: 'Designing multi-layer perceptrons and understanding loss gradients.', prerequisites: ['Deep Learning'] },
      { name: 'Transformers', x: 580, y: 400, tier: 2, description: 'Attention mechanisms, positional encoding, and self-attention blocks.', prerequisites: ['Neural Networks'] },
      { name: 'Large Language Models', x: 780, y: 400, tier: 3, description: 'Context windows, transformer architectures, and weights.', prerequisites: ['Transformers'] },
      
      { name: 'Embeddings', x: 980, y: 250, tier: 3, description: 'Mapping words and documents into dense, high-dimensional vector spaces.', prerequisites: ['Large Language Models'] },
      { name: 'Data Chunking', x: 1140, y: 150, tier: 4, description: 'Segmenting large documents into context-window-friendly tokens.', prerequisites: ['Embeddings'] },
      { name: 'Vector Databases', x: 1140, y: 250, tier: 4, description: 'Indexing, storing, and querying high-dimensional vectors (Pinecone, Chroma).', prerequisites: ['Embeddings'] },
      { name: 'Semantic Search', x: 1300, y: 250, tier: 4, description: 'Cosine similarity matching and nearest neighbor algorithms.', prerequisites: ['Vector Databases'] },
      
      { name: 'Prompt Engineering', x: 980, y: 550, tier: 3, description: 'System constraints, personas, and structured JSON schemas.', prerequisites: ['Large Language Models'], courseId: 'course-2' },
      { name: 'Few-Shot Prompting', x: 1140, y: 500, tier: 4, description: 'Providing concrete input/output pairings inside the message thread.', prerequisites: ['Prompt Engineering'] },
      { name: 'Chain of Thought', x: 1140, y: 600, tier: 4, description: 'Forcing the model to output intermediate reasoning steps before answering.', prerequisites: ['Prompt Engineering'] },
      { name: 'Prompt Chaining', x: 1300, y: 550, tier: 4, description: 'Piping outputs from one prompt into the input of the next prompt.', prerequisites: ['Few-Shot Prompting', 'Chain of Thought'] },
      
      { name: 'RAG Systems', x: 1480, y: 250, tier: 5, description: 'Retrieval-Augmented Generation: merging semantic search with LLM generation.', prerequisites: ['Semantic Search', 'Prompt Engineering'] },
      { name: 'Gemini API', x: 1480, y: 550, tier: 5, description: 'Google Developer SDK client initialization and streaming queries.', prerequisites: ['Prompt Chaining'], courseId: 'course-2' },
      
      { name: 'Function Calling', x: 1680, y: 480, tier: 6, description: 'Providing tool schemas that models can execute deterministically.', prerequisites: ['Gemini API'] },
      { name: 'LangChain', x: 1680, y: 620, tier: 6, description: 'Orchestrating complex LLM pipelines, memory buffers, and output parsers.', prerequisites: ['Gemini API'] },
      { name: 'Agentic AI', x: 1880, y: 550, tier: 7, description: 'Autonomous loops, tool coordination, and multi-agent frameworks.', prerequisites: ['Function Calling', 'LangChain'], courseId: 'course-2' },
      
      { name: 'Model Fine-Tuning', x: 1480, y: 720, tier: 5, description: 'Adjusting model weights using PEFT or LoRA on domain-specific data.', prerequisites: ['Prompt Chaining'] },
      { name: 'LLMOps', x: 1680, y: 720, tier: 6, description: 'Deployment scaling, latency monitoring, and continuous evals.', prerequisites: ['Model Fine-Tuning'] }
    ]
  },
  'Product Designer': {
    title: 'Product Designer',
    description: 'Bridge semantic typography systems, interactive Auto-Layout layout hierarchies, and high-fidelity Figma components.',
    nodes: [
      { name: 'Typography', x: 120, y: 150, tier: 1, description: 'Font pairings, layout rhythms, line lengths, and weights.', prerequisites: [] },
      { name: 'UI/UX', x: 290, y: 150, tier: 2, description: 'User patterns, click maps, contrast, accessibility, and visual guidelines.', prerequisites: ['Typography'], courseId: 'course-3' },
      { name: 'Figma', x: 480, y: 80, tier: 3, description: 'Vector editing tools, components, variant properties, and styling grids.', prerequisites: ['UI/UX'], courseId: 'course-3' },
      { name: 'Design Systems', x: 480, y: 220, tier: 3, description: 'Dynamic primitive tokens, variable bindings, and code translations.', prerequisites: ['UI/UX'], courseId: 'course-3' }
    ]
  },
  'Product Manager': {
    title: 'Growth Product Manager',
    description: 'Refine self-service signups, construct custom telemetry funnels, run active A/B tests, and orchestrate PLG.',
    nodes: [
      { name: 'A/B Testing', x: 120, y: 150, tier: 1, description: 'Controlled variables, cohort analysis, and statistical significance.', prerequisites: [] },
      { name: 'User Retention', x: 290, y: 150, tier: 2, description: 'Cohort retention loops, activation events, and churn reductions.', prerequisites: ['A/B Testing'], courseId: 'course-4' },
      { name: 'Funnel Analytics', x: 480, y: 80, tier: 3, description: 'Click tracking, drop-off matrices, conversion boundaries, and tracking pixels.', prerequisites: ['User Retention'], courseId: 'course-4' },
      { name: 'PLG', x: 480, y: 220, tier: 3, description: 'Product-led growth, quick time-to-value, and viral activation loops.', prerequisites: ['User Retention'], courseId: 'course-4' }
    ]
  }
};

export const renderSkillIcon = (skill: string) => {
  switch (skill) {
    case 'TypeScript':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3h18v18H3z" />
          <path d="M14 17h2V9h-4M7 9h6M10 9v8" />
        </svg>
      );
    case 'HTML5/CSS3':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 5l1.5 14 8.5 3 8.5-3L22 5L12 2z" />
          <path d="M12 6v12M8 10h8" />
        </svg>
      );
    case 'Tailwind':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3c-1.2 0-2.4.6-3.2 1.6-1.8 2.2-1.4 5.4.8 7.2.8.6 1.8 1 2.8.8 1-.2 1.6-.8 2-1.6.4-.8.4-1.8 0-2.6-.4-.8-1.2-1.2-2.4-1.2h-.2" />
          <path d="M12 21c1.2 0 2.4-.6 3.2-1.6 1.8-2.2 1.4-5.4-.8-7.2-.8-.6-1.8-1-2.8-.8-1 .2-1.6.8-2 1.6-.4.8-.4 1.8 0 2.6.4.8 1.2 1.2 2.4 1.2h.2" />
        </svg>
      );
    case 'State Management':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z" />
          <path d="M10 7h4M10 17h4M7 10v4M17 10v4" strokeDasharray="2 2" />
        </svg>
      );
    case 'Node.js':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" />
          <path d="M12 22V12M3 7l9 5 9-5" />
        </svg>
      );
    case 'Testing/Vitest':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case 'REST APIs':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
          <rect x="14" y="16" width="7" height="5" rx="1" />
          <path d="M10 5.5h4M10 18.5h4M12 8v8" />
        </svg>
      );
    case 'GraphQL':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      );
    case 'SQL':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6" />
        </svg>
      );
    case 'Performance Optimization':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2M16 2a10 10 0 0 1 4 4" />
        </svg>
      );
    case 'Micro-Frontends':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M6 12v5M18 12v5" strokeDasharray="2 2" />
        </svg>
      );
    case 'React':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(0 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'Next.js':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 22h20L12 2z" />
          <path d="M12 8l4 8H8l4-8z" strokeWidth="1.5" />
        </svg>
      );
    case 'Docker':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="6" width="6" height="4" rx="1" />
          <rect x="14" y="6" width="6" height="4" rx="1" />
          <rect x="4" y="14" width="6" height="4" rx="1" />
          <rect x="14" y="14" width="6" height="4" rx="1" />
        </svg>
      );
    case 'Server Actions':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
    case 'SSR':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17.5 19A5.5 5.5 0 0 0 18 8.02a9 9 0 0 0-17.61 3.22A5.5 5.5 0 0 0 5.5 22h12a.5.5 0 0 0 0-1z" />
          <path d="M12 12v6M9 15l3 3 3-3" />
        </svg>
      );
    case 'Kubernetes':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13" />
        </svg>
      );
    case 'Scalability':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18" />
          <path d="M7 15l4-4 4 4 5-5M20 9h-4v4" />
        </svg>
      );
    case 'CI/CD':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4z" />
        </svg>
      );
    case 'Large Language Models':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <path d="M10 6.5h4M6.5 10v4M17.5 10v4M10 17.5h4" />
        </svg>
      );
    case 'Prompt Engineering':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 18V6h16v12H4zm8-6H6v2h6v-2zm6-4h-6v2h6V8z" />
        </svg>
      );
    case 'Gemini API':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3l3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6z" />
        </svg>
      );
    case 'AI Fundamentals':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 22h20L12 2z" />
          <circle cx="12" cy="14" r="3" />
        </svg>
      );
    case 'Deep Learning':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 12h16M4 6h16M4 18h16M8 6L16 12L8 18" />
        </svg>
      );
    case 'Neural Networks':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="4" cy="12" r="2" />
          <circle cx="12" cy="6" r="2" />
          <circle cx="12" cy="18" r="2" />
          <circle cx="20" cy="12" r="2" />
          <path d="M6 12l4-6M6 12l4 6M14 6l4 6M14 18l4-6M12 8v8" />
        </svg>
      );
    case 'Transformers':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 8l4 4-4 4M16 8l-4 4 4 4" />
        </svg>
      );
    case 'Embeddings':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
          <circle cx="12" cy="12" r="4" fill="currentColor" />
        </svg>
      );
    case 'Data Chunking':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16M10 6v12M14 6v12" />
        </svg>
      );
    case 'Vector Databases':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
          <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="8" cy="14" r="1" fill="currentColor" />
          <circle cx="16" cy="10" r="1" fill="currentColor" />
        </svg>
      );
    case 'Semantic Search':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="10" cy="10" r="6" />
          <path d="M21 21l-6-6" />
          <path d="M10 7v3l2 2" />
        </svg>
      );
    case 'Few-Shot Prompting':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 8h10M7 12h10M7 16h4" />
          <circle cx="18" cy="16" r="1" fill="currentColor" />
        </svg>
      );
    case 'Chain of Thought':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="8" cy="12" r="3" />
          <circle cx="16" cy="12" r="3" />
          <path d="M11 12h2" strokeDasharray="2 2" />
          <path d="M12 4v4M12 16v4" />
        </svg>
      );
    case 'Prompt Chaining':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
    case 'RAG Systems':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <path d="M14 14l-4 4-4-4" />
          <path d="M10 6.5h4" strokeDasharray="2 2" />
        </svg>
      );
    case 'Function Calling':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 4v16M4 12h16M6 6l12 12M6 18L18 6" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      );
    case 'LangChain':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 10h4v4H4zM16 10h4v4h-4zM8 12h8" />
          <path d="M12 4v4M12 16v4" strokeDasharray="2 2" />
        </svg>
      );
    case 'Agentic AI':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="5" width="14" height="14" rx="2" />
          <path d="M9 9h6v6H9zM9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" />
        </svg>
      );
    case 'Model Fine-Tuning':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case 'LLMOps':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case 'Typography':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7V4h16v3M9 20h6M12 4v16" />
        </svg>
      );
    case 'UI/UX':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case 'Figma':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 3a3 3 0 1 1 3 3v-3zM9 9a3 3 0 1 1 3 3v-3H9zm6 0a3 3 0 1 1-3-3v3h3zM9 15a3 3 0 1 1 3-3v3H9zm6 0a3 3 0 1 1-3 3v-3h3z" />
        </svg>
      );
    case 'Design Systems':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="8" y="2" width="8" height="6" rx="1" />
          <rect x="2" y="14" width="8" height="6" rx="1" />
          <rect x="14" y="14" width="8" height="6" rx="1" />
          <path d="M12 8v6M6 14v-3h12v3" />
        </svg>
      );
    case 'A/B Testing':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 3h12v3H6zM6 18h12v3H6zM10 6v12M14 6v12" />
        </svg>
      );
    case 'User Retention':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      );
    case 'Funnel Analytics':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 2h20l-8 11v7l-4 2v-9L2 2z" />
        </svg>
      );
    case 'PLG':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4.5 16.5c-1.5 1.5-2.5 3.5-2.5 5.5C4 22 6 21 7.5 19.5" />
          <path d="M12 12c-2.5 2.5-4 5.5-4.5 7.5.5.5 1.5.5 2 0 1-1 3.5-3 5.5-5.5L12 12z" />
          <path d="M12 12l5.5-5.5C19.5 4 22 2.5 22 2.5s-1.5 2.5-4 4.5L12 12z" />
        </svg>
      );
    default:
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
};

export const getPathConnections = (pathName: string) => {
  switch (pathName) {
    case 'Full-Stack':
      return [
        { from: 'HTML5/CSS3', to: 'Tailwind' },
        { from: 'React', to: 'Next.js' },
        { from: 'React', to: 'State Management' },
        { from: 'TypeScript', to: 'Node.js' },
        { from: 'TypeScript', to: 'Docker' },
        { from: 'SQL', to: 'REST APIs' },
        
        { from: 'Next.js', to: 'Micro-Frontends' },
        { from: 'Next.js', to: 'SSR' },
        { from: 'Next.js', to: 'Server Actions' },
        { from: 'Node.js', to: 'REST APIs' },
        { from: 'Docker', to: 'Kubernetes' },
        
        { from: 'SSR', to: 'Performance Optimization' },
        { from: 'REST APIs', to: 'GraphQL' },
        { from: 'REST APIs', to: 'Testing/Vitest' },
        { from: 'Kubernetes', to: 'Scalability' },
        { from: 'Kubernetes', to: 'CI/CD' },
        
        { from: 'GraphQL', to: 'Prompt Engineering' },
        { from: 'Prompt Engineering', to: 'Gemini API' }
      ];
    case 'AI Specialist':
      return [
        { from: 'AI Fundamentals', to: 'Deep Learning' },
        { from: 'Deep Learning', to: 'Neural Networks' },
        { from: 'Neural Networks', to: 'Transformers' },
        { from: 'Transformers', to: 'Large Language Models' },
        
        { from: 'Large Language Models', to: 'Embeddings' },
        { from: 'Embeddings', to: 'Vector Databases' },
        { from: 'Vector Databases', to: 'Semantic Search' },
        { from: 'Embeddings', to: 'Data Chunking' },
        
        { from: 'Large Language Models', to: 'Prompt Engineering' },
        { from: 'Prompt Engineering', to: 'Few-Shot Prompting' },
        { from: 'Prompt Engineering', to: 'Chain of Thought' },
        { from: 'Few-Shot Prompting', to: 'Prompt Chaining' },
        { from: 'Chain of Thought', to: 'Prompt Chaining' },
        
        { from: 'Semantic Search', to: 'RAG Systems' },
        { from: 'Prompt Engineering', to: 'RAG Systems' },
        
        { from: 'Prompt Chaining', to: 'Gemini API' },
        { from: 'Gemini API', to: 'Function Calling' },
        { from: 'Gemini API', to: 'LangChain' },
        { from: 'Function Calling', to: 'Agentic AI' },
        { from: 'LangChain', to: 'Agentic AI' },
        
        { from: 'Prompt Chaining', to: 'Model Fine-Tuning' },
        { from: 'Model Fine-Tuning', to: 'LLMOps' }
      ];
    case 'Product Designer':
      return [
        { from: 'Typography', to: 'UI/UX' },
        { from: 'UI/UX', to: 'Figma' },
        { from: 'UI/UX', to: 'Design Systems' }
      ];
    case 'Product Manager':
      return [
        { from: 'A/B Testing', to: 'User Retention' },
        { from: 'User Retention', to: 'Funnel Analytics' },
        { from: 'User Retention', to: 'PLG' }
      ];
    default:
      return [];
  }
};

export const PROFILE_SKILL_COORDINATES: Record<string, { x: number; y: number; category: string; description: string }> = {
  // Frontend/Web Path
  'HTML5/CSS3': { x: 80, y: 70, category: 'Engineering', description: 'Hypertext markup and semantic layout formatting.' },
  'Tailwind': { x: 220, y: 50, category: 'Design', description: 'Utility-first styling system and responsive design.' },
  'React': { x: 220, y: 110, category: 'Engineering', description: 'Declarative component-driven interfaces and reactivity.' },
  'TypeScript': { x: 360, y: 110, category: 'Engineering', description: 'Statically typed superset of Javascript.' },
  'Next.js': { x: 500, y: 110, category: 'Engineering', description: 'App Router, Server Components, and SSR optimizations.' },
  'Server Actions': { x: 640, y: 50, category: 'Engineering', description: 'Zero-API server-side database mutation scope.' },
  'SSR': { x: 640, y: 150, category: 'Engineering', description: 'Server-Side Rendering strategies and dynamic hydration.' },

  // Backend & Data
  'SQL': { x: 80, y: 220, category: 'Engineering', description: 'Relational database querying and schemas.' },
  'Node.js': { x: 220, y: 220, category: 'Engineering', description: 'Server-side Javascript runtime.' },
  'REST APIs': { x: 360, y: 220, category: 'Engineering', description: 'HTTP RESTful service endpoint architectures.' },

  // DevOps & Ops
  'Git': { x: 80, y: 335, category: 'Engineering', description: 'Distributed version control and branch coordination.' },
  'Docker': { x: 220, y: 335, category: 'Engineering', description: 'Container packaging, deployment environments, and isolation.' },
  'Kubernetes': { x: 360, y: 335, category: 'Engineering', description: 'Container orchestration, cluster scaling, and networking.' },
  'Scalability': { x: 500, y: 295, category: 'Engineering', description: 'Traffic load balancing, caching, and database replication.' },
  'CI/CD': { x: 500, y: 375, category: 'Engineering', description: 'Automated test systems and compilation pipelines.' },

  // AI Specialists
  'Large Language Models': { x: 220, y: 440, category: 'Artificial Intelligence', description: 'Context windows, transformer architectures, and weights.' },
  'Prompt Engineering': { x: 360, y: 440, category: 'Artificial Intelligence', description: 'Few-shot instructions, system constraints, and schemas.' },
  'Gemini API': { x: 500, y: 440, category: 'Artificial Intelligence', description: 'Google SDK model client integration and streaming queries.' },
  'AI Engineering': { x: 640, y: 440, category: 'Artificial Intelligence', description: 'Agent loops, function calling tools, and semantic indexers.' },

  // Product Design
  'Typography': { x: 80, y: 550, category: 'Design', description: 'Font pairings, rhythms, line lengths, and weights.' },
  'UI/UX': { x: 220, y: 550, category: 'Design', description: 'User patterns, click maps, visual layouts, and contrast.' },
  'Figma': { x: 360, y: 550, category: 'Design', description: 'Vector editing components, variants, and design grids.' },
  'Design Systems': { x: 500, y: 550, category: 'Design', description: 'Dynamic primitive tokens, variables, and code translations.' },

  // Product Growth
  'A/B Testing': { x: 80, y: 660, category: 'Product', description: 'Controlled variables, cohort analysis, and significance.' },
  'User Retention': { x: 220, y: 660, category: 'Product', description: 'Cohort retention loops and user activation events.' },
  'Funnel Analytics': { x: 360, y: 660, category: 'Product', description: 'Click tracking, conversion maps, and drop-off matrices.' },
  'PLG': { x: 500, y: 660, category: 'Product', description: 'Product-led growth, time-to-value, and viral onboarding loops.' }
};

export const PROFILE_SKILL_CONNECTIONS = [
  { from: 'HTML5/CSS3', to: 'React' },
  { from: 'HTML5/CSS3', to: 'Tailwind' },
  { from: 'React', to: 'TypeScript' },
  { from: 'TypeScript', to: 'Next.js' },
  { from: 'Next.js', to: 'Server Actions' },
  { from: 'Next.js', to: 'SSR' },
  { from: 'SQL', to: 'Node.js' },
  { from: 'Node.js', to: 'REST APIs' },
  { from: 'Git', to: 'Docker' },
  { from: 'Docker', to: 'Kubernetes' },
  { from: 'Kubernetes', to: 'Scalability' },
  { from: 'Kubernetes', to: 'CI/CD' },
  { from: 'Large Language Models', to: 'Prompt Engineering' },
  { from: 'Prompt Engineering', to: 'Gemini API' },
  { from: 'Prompt Engineering', to: 'AI Engineering' },
  { from: 'Typography', to: 'UI/UX' },
  { from: 'UI/UX', to: 'Figma' },
  { from: 'UI/UX', to: 'Design Systems' },
  { from: 'A/B Testing', to: 'User Retention' },
  { from: 'User Retention', to: 'Funnel Analytics' },
  { from: 'User Retention', to: 'PLG' }
];

export const GAME_DATA: Record<string, {
  title: string;
  scenario: string;
  correctSequence: string[];
  tips: string;
}> = {
  'DevOps': {
    title: 'Data Center Server Rack Assembly & Orchestration',
    scenario: 'You are setting up a secure container host node in a physical data center. Sort the steps in order of hardware mount, power, wire network, package container code, and finally deploy routing.',
    correctSequence: [
      "Mount raw server chassis in rack unit",
      "Cable redundant power lines (PDUs)",
      "Wire physical optical fiber rails to patch panel",
      "Define multi-stage Dockerfile",
      "Boot container image and verify cluster sync"
    ],
    tips: "Ensure physical hardware mounting and power delivery precede network cabling, which must precede compiling and running containers."
  },
  'AI': {
    title: 'Prompt Shield Context Guardrails',
    scenario: 'Arrange prompt instructions to secure an LLM model against indirect jailbreaks and context leaking. Sort from base rules, safety boundaries, training inputs, filtering filters, and output schemas.',
    correctSequence: [
      "Establish base System Instructions restricting model scope",
      "Add negative constraints prohibiting user system overrides",
      "Provide 3 few-shot examples showing rejected malicious inputs",
      "Parse inputs and run safety classification gates",
      "Enforce strict JSON schema validations on final outputs"
    ],
    tips: "Base system context shapes initial state; override guards must be defined before examples, which are followed by input checking and output structures."
  },
  'Design': {
    title: 'Design System Semantic Token Mapping',
    scenario: 'Sort these mappings from base primitives (colors/sizes) to logical component styling layers.',
    correctSequence: [
      "#0F172A (Primitive dark color) -> --color-bg-primary (Canvas bg)",
      "#4F46E5 (Primitive purple color) -> --color-accent (Action item hover)",
      "1.25rem / 1.75rem (Base typography sizes) -> --font-size-title (Header rhythm)",
      "0.375rem (Base border radius size) -> --radius-button (Interactive elements)",
      "#EF4444 (Primitive feedback color) -> --color-feedback-error (Alert boundaries)"
    ],
    tips: "Sort the design variables from background primitives down to specific action element accents, typography, radius parameters, and error alert indicators."
  },
  'Product': {
    title: 'Product Growth Cohort Optimization',
    scenario: 'Sequence user-onboarding flows to reduce friction and decrease Time-To-Value (TTV). Sort from top funnel discovery down to post-signup retention.',
    correctSequence: [
      "Run A/B testing on landing page headlines",
      "Remove credit-card prompt walls from signup",
      "Instantly display self-service templates (Aha! moment)",
      "Trigger contextual in-app notifications guiding first actions",
      "Deliver usage insight drip emails based on telemetry"
    ],
    tips: "Acquiring users on landing pages must happen before onboarding form simplification, followed by showing direct product value, guides, and finally follow-up emails."
  }
};

export const getJobSpecialization = (job: Job) => {
  const title = (job.title || '').toLowerCase();
  if (title.includes('full-stack') || title.includes('frontend') || title.includes('systems') || title.includes('reliability') || title.includes('devops')) {
    return 'Full-Stack';
  }
  if (title.includes('ai') || title.includes('machine learning') || title.includes('data scientist')) {
    return 'AI Specialist';
  }
  if (title.includes('designer') || title.includes('design') || title.includes('ui') || title.includes('ux')) {
    return 'Product Designer';
  }
  if (title.includes('product manager') || title.includes('pm') || title.includes('product innovation')) {
    return 'Product Manager';
  }
  
  // Fallback to skill-based
  const skillsNeeded = job.skillsNeeded || [];
  if (skillsNeeded.includes('Gemini API') || skillsNeeded.includes('AI Engineering') || skillsNeeded.includes('Large Language Models')) return 'AI Specialist';
  if (skillsNeeded.includes('Next.js') || skillsNeeded.includes('Server Actions') || skillsNeeded.includes('SSR')) return 'Full-Stack';
  if (skillsNeeded.includes('Figma') || skillsNeeded.includes('Design Systems') || skillsNeeded.includes('UI/UX')) return 'Product Designer';
  if (skillsNeeded.includes('PLG') || skillsNeeded.includes('User Retention') || skillsNeeded.includes('Funnel Analytics')) return 'Product Manager';
  
  return 'Full-Stack';
};

export const getNodeDepths = (nodes: SkillNode[]): Record<string, number> => {
  const depths: Record<string, number> = {};
  
  const getDepth = (name: string): number => {
    if (name in depths) return depths[name];
    const node = nodes.find(n => n.name === name);
    if (!node || !node.prerequisites || node.prerequisites.length === 0) {
      depths[name] = 0;
      return 0;
    }
    const prereqDepths = node.prerequisites.map(p => getDepth(p));
    const maxPrereqDepth = Math.max(...prereqDepths);
    depths[name] = maxPrereqDepth + 1;
    return depths[name];
  };

  nodes.forEach(node => {
    getDepth(node.name);
  });

  return depths;
};

export const getProfileNodeDepths = (): Record<string, number> => {
  const prerequisites: Record<string, string[]> = {};
  
  Object.keys(PROFILE_SKILL_COORDINATES).forEach(skillName => {
    prerequisites[skillName] = [];
  });
  
  PROFILE_SKILL_CONNECTIONS.forEach(conn => {
    if (prerequisites[conn.to]) {
      prerequisites[conn.to].push(conn.from);
    }
  });

  const depths: Record<string, number> = {};

  const getDepth = (name: string): number => {
    if (name in depths) return depths[name];
    const prereqs = prerequisites[name] || [];
    if (prereqs.length === 0) {
      depths[name] = 0;
      return 0;
    }
    const maxPrereqDepth = Math.max(...prereqs.map(p => getDepth(p)));
    depths[name] = maxPrereqDepth + 1;
    return depths[name];
  };

  Object.keys(PROFILE_SKILL_COORDINATES).forEach(name => {
    getDepth(name);
  });

  return depths;
};

export const getSkillsWithAncestors = (targetSkills: string[], nodes: SkillNode[]): string[] => {
  const visited = new Set<string>();

  const traverse = (skillName: string) => {
    if (visited.has(skillName)) return;
    visited.add(skillName);
    const node = nodes.find(n => n.name === skillName);
    if (node && node.prerequisites) {
      node.prerequisites.forEach(p => traverse(p));
    }
  };

  targetSkills.forEach(skill => traverse(skill));
  return Array.from(visited);
};

export const getProfileSkillsWithAncestors = (targetSkills: string[]): string[] => {
  const visited = new Set<string>();

  const prerequisites: Record<string, string[]> = {};
  PROFILE_SKILL_CONNECTIONS.forEach(conn => {
    if (!prerequisites[conn.to]) {
      prerequisites[conn.to] = [];
    }
    prerequisites[conn.to].push(conn.from);
  });

  const traverse = (skillName: string) => {
    if (visited.has(skillName)) return;
    visited.add(skillName);
    const prereqs = prerequisites[skillName] || [];
    prereqs.forEach(p => traverse(p));
  };

  targetSkills.forEach(skill => traverse(skill));
  return Array.from(visited);
};

interface CandidateWorkspaceProps {
  courses: Course[];
  candidate: Candidate;
  jobs: Job[];
  onEnroll: (courseId: string) => void;
  onCompleteCourse: (courseId: string) => void;
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onApplyJob: (jobId: string) => void;
  onUpdateStatus: (status: Candidate['status']) => void;
  appliedJobIds: string[];
  onUpdateTargetJob?: (jobId: string | undefined) => void;
  onUpdateSkillLevel?: (skill: string, newLevel: 'Beginner' | 'Intermediate' | 'Pro') => void;
  onFollowJob?: (jobId: string) => void;
  onUnfollowJob?: (jobId: string) => void;
  activeTab: 'learning' | 'profile' | 'opportunities' | 'roadmaps';
  setActiveTab: (tab: 'learning' | 'profile' | 'opportunities' | 'roadmaps') => void;
}

export default function CandidateWorkspace({
  courses,
  candidate,
  jobs,
  onEnroll,
  onCompleteCourse,
  onAddProject,
  onApplyJob,
  onUpdateStatus,
  appliedJobIds,
  onUpdateTargetJob,
  onUpdateSkillLevel,
  onFollowJob,
  onUnfollowJob,
  activeTab,
  setActiveTab
}: CandidateWorkspaceProps) {
  const [profileView, setProfileView] = useState<'list' | 'tree'>('tree');
  const [showCurrentProgress, setShowCurrentProgress] = useState(false);
  const [myPathView, setMyPathView] = useState<'hub' | 'detail'>('hub');
  const [profileHoveredSkill, setProfileHoveredSkill] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState('');
  const [showCertModal, setShowCertModal] = useState<Course | null>(null);

  // Gamified Skill Tree states
  const [selectedPath, setSelectedPath] = useState<'Full-Stack' | 'AI Specialist' | 'Product Designer' | 'Product Manager'>('Full-Stack');
  const [activeTargetJobId, setActiveTargetJobId] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [activeAssessmentSkill, setActiveAssessmentSkill] = useState<string | null>(null);
  const [assessmentStep, setAssessmentStep] = useState<number>(0);
  const [assessmentSequence, setAssessmentSequence] = useState<string[]>([]);
  const [assessmentSelectedMapping, setAssessmentSelectedMapping] = useState<Record<string, string>>({});
  const [assessmentQuizOption, setAssessmentQuizOption] = useState<number | null>(null);
  const [assessmentCompleted, setAssessmentCompleted] = useState<boolean>(false);
  const [assessmentResult, setAssessmentResult] = useState<{ success: boolean; score: number; level: 'Beginner' | 'Intermediate' | 'Pro' } | null>(null);

  // Search and filter for jobs
  const [jobSearch, setJobSearch] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('All');

  // Viewport dimensions state to calculate initial scale to fit the window dynamically
  const [viewportSize, setViewportSize] = useState({ width: 1000, height: 600 });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateDimensions = () => {
        const pathEl = document.getElementById('path-detail-tree-canvas');
        const profileEl = document.getElementById('profile-skill-tree-canvas');
        const el = pathEl || profileEl;
        if (el && el.clientWidth > 0 && el.clientHeight > 0) {
          setViewportSize({
            width: el.clientWidth,
            height: el.clientHeight
          });
        } else {
          const defaultHeight = activeTab === 'roadmaps' ? 600 : 500;
          setViewportSize({
            width: Math.max(window.innerWidth - 380, 600),
            height: defaultHeight
          });
        }
      };
      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      const timer = setTimeout(updateDimensions, 150);
      return () => {
        window.removeEventListener('resize', updateDimensions);
        clearTimeout(timer);
      };
    }
  }, [activeTab, profileView, myPathView, selectedPath, showCurrentProgress]);

  // Interactive project builder form state
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjSkills, setNewProjSkills] = useState('');
  const [newProjLink, setNewProjLink] = useState('');

  const getActiveJobForPath = () => {
    if (activeTargetJobId) {
      const job = jobs.find(j => j.id === activeTargetJobId);
      if (job && getJobSpecialization(job) === selectedPath) {
        return job;
      }
    }
    const followedJobsForPath = jobs.filter(j => 
      (candidate.followedJobIds || []).includes(j.id) && 
      getJobSpecialization(j) === selectedPath
    );
    return followedJobsForPath[0] || null;
  };

  // Helper methods for interactive skill tree progression
  const isUnlocked = (nodeName: string) => {
    return candidate.skills.includes(nodeName);
  };

  const isPrereqMet = (node: SkillNode) => {
    if (node.prerequisites.length === 0) return true;
    return node.prerequisites.every(p => candidate.skills.includes(p));
  };

  const getSkillLevel = (nodeName: string) => {
    if (!isUnlocked(nodeName)) return 'Locked';
    return candidate.skillLevels?.[nodeName] || 'Intermediate';
  };

  const startAssessment = (skillName: string) => {
    let category = 'DevOps';
    if (selectedPath === 'AI Specialist') category = 'AI';
    else if (selectedPath === 'Product Designer') category = 'Design';
    else if (selectedPath === 'Product Manager') category = 'Product';

    const baseGame = GAME_DATA[category];
    // Scramble the correct sequence
    const scrambled = [...baseGame.correctSequence].sort(() => Math.random() - 0.5);

    setActiveAssessmentSkill(skillName);
    setAssessmentStep(1);
    setAssessmentSequence(scrambled);
    setAssessmentCompleted(false);
    setAssessmentResult(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newSeq = [...assessmentSequence];
    if (direction === 'up' && index > 0) {
      const temp = newSeq[index - 1];
      newSeq[index - 1] = newSeq[index];
      newSeq[index] = temp;
    } else if (direction === 'down' && index < newSeq.length - 1) {
      const temp = newSeq[index + 1];
      newSeq[index + 1] = newSeq[index];
      newSeq[index] = temp;
    }
    setAssessmentSequence(newSeq);
  };

  // Course completion / progress handlers
  const handleStartCourse = (course: Course) => {
    onEnroll(course.id);
    setSelectedCourse(course);
    setCurrentLessonIndex(0);
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setQuizFeedback('');
  };

  const handleNextOrFinish = () => {
    if (!selectedCourse) return;
    const isLastLesson = currentLessonIndex === selectedCourse.lessons.length - 1;

    if (isLastLesson) {
      // Complete Course
      onCompleteCourse(selectedCourse.id);
      setShowCertModal(selectedCourse);
      setSelectedCourse(null);
    } else {
      setCurrentLessonIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setQuizSubmitted(false);
      setQuizFeedback('');
    }
  };

  const handleAnswerSelection = (index: number) => {
    if (quizSubmitted) return;
    setSelectedAnswer(index);
  };

  const handleVerifyQuiz = () => {
    if (!selectedCourse || selectedAnswer === null) return;
    const currentLesson = selectedCourse.lessons[currentLessonIndex];
    if (!currentLesson.quiz) return;

    setQuizSubmitted(true);
    if (selectedAnswer === currentLesson.quiz.correctAnswer) {
      setQuizFeedback('Correct! Verification node verified your understanding. Your skills are validated.');
    } else {
      setQuizFeedback(`Oops! That's incorrect. Review the lesson materials and try again.`);
    }
  };

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !newProjDesc.trim()) return;

    onAddProject({
      title: newProjTitle,
      description: newProjDesc,
      skills: newProjSkills.split(',').map(s => s.trim()).filter(s => s !== ''),
      link: newProjLink.trim() || undefined
    });

    // Reset Form
    setNewProjTitle('');
    setNewProjDesc('');
    setNewProjSkills('');
    setNewProjLink('');
    setIsAddingProject(false);
  };

  // Get list of all skills available in the ecosystem
  const allSkills = Array.from(new Set(courses.flatMap(c => c.skillsGranted)));

  // Calculate Match Score for a job listing
  const calculateMatchScore = (jobSkills: string[]) => {
    if (jobSkills.length === 0) return 100;
    const matched = jobSkills.filter(s => candidate.skills.includes(s));
    return Math.round((matched.length / jobSkills.length) * 100);
  };

  // Filtered jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(jobSearch.toLowerCase()) || 
                          job.company.toLowerCase().includes(jobSearch.toLowerCase()) ||
                          job.description.toLowerCase().includes(jobSearch.toLowerCase());
    
    const matchesSkill = selectedSkillFilter === 'All' || job.skillsNeeded.includes(selectedSkillFilter);
    return matchesSearch && matchesSkill;
  });

  return (
    <div className="space-y-8" id="candidate-workspace">
      {/* Workspace Sub-Header Navigation - Only shown on main Learning Academy tab */}
      {activeTab === 'learning' && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-4" id="candidate-subnav">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Welcome back, {candidate.name}</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified Candidate
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">Develop verified proof-of-ability and get matched immediately with hiring-ready pipelines.</p>
          </div>
        </div>
      )}

      {/* ACTIVE LEARNING MODAL / SUB-SCREEN (Immersive split-view) */}
      {selectedCourse && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: 15 }}
          className="bg-slate-950 text-slate-100 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
          id="course-terminal-view"
        >
          {/* Top Bar */}
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-mono tracking-wider border border-indigo-500/30">
                {selectedCourse.category.toUpperCase()}
              </span>
              <h2 className="text-base font-bold tracking-tight text-white">{selectedCourse.title}</h2>
            </div>
            <button 
              onClick={() => setSelectedCourse(null)}
              className="text-slate-400 hover:text-white transition-all text-sm font-mono hover:scale-105 bg-slate-800 px-2.5 py-1 rounded-md"
            >
              ESC [QUIT]
            </button>
          </div>

          {/* Stepper Status */}
          <div className="bg-slate-900/60 border-b border-slate-800 px-6 py-3 flex items-center gap-3 overflow-x-auto text-xs font-mono">
            {selectedCourse.lessons.map((les, idx) => (
              <div 
                key={les.id}
                className={`flex items-center gap-1.5 shrink-0 ${
                  idx === currentLessonIndex ? 'text-indigo-400' : idx < currentLessonIndex ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                {idx < currentLessonIndex ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${
                    idx === currentLessonIndex ? 'border-indigo-500 bg-indigo-505/20 text-white font-bold' : 'border-slate-700'
                  }`}>
                    {idx + 1}
                  </span>
                )}
                <span>{les.title}</span>
                {idx < selectedCourse.lessons.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-700" />}
              </div>
            ))}
          </div>

          {/* Immersive Terminal Split Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
            {/* Left: Material Study Guide */}
            <div className="col-span-7 p-6 sm:p-8 lg:border-r lg:border-slate-800 bg-slate-950 overflow-y-auto max-h-[600px] prose prose-invert prose-indigo">
              <div className="flex items-center text-[11px] font-mono text-indigo-400 mb-2 gap-1">
                <Clock className="w-3.5 h-3.5" /> <span>LESSON {currentLessonIndex + 1} OF {selectedCourse.lessons.length}</span>
              </div>
              <h3 className="text-xl font-extrabold text-white mb-4 tracking-tight">
                {selectedCourse.lessons[currentLessonIndex].title}
              </h3>
              
              {/* Splitting system for lesson text */}
              <div className="space-y-4 text-slate-300 text-sm leading-relaxed whitespace-pre-line" id="lesson-html-rendered">
                {selectedCourse.lessons[currentLessonIndex].content}
              </div>

              <div className="mt-8 bg-indigo-950/20 border border-indigo-500/10 p-4 rounded-xl text-xs flex gap-3 text-indigo-300">
                <Cpu className="w-5 h-5 text-indigo-400 shrink-0" />
                <p>
                  <strong>Automatic Evaluation:</strong> Completing this syllabus grants a cryptographic verification link to your candidate file instantly. Recruiters will observe this verification in search ranks.
                </p>
              </div>
            </div>

            {/* Right: Real-time Evaluation Station */}
            <div className="col-span-5 p-6 sm:p-8 bg-slate-900/40 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono text-emerald-400 tracking-wider">EVALUATION GATE</span>
                <h4 className="text-sm font-semibold text-white mt-1 mb-4">Prove Understanding to Unlock Dynamic Skills</h4>

                {selectedCourse.lessons[currentLessonIndex].quiz ? (
                  <div className="space-y-4" id="quiz-block">
                    <p className="text-sm text-slate-200 font-medium">
                      {selectedCourse.lessons[currentLessonIndex].quiz?.question}
                    </p>

                    <div className="space-y-2">
                      {selectedCourse.lessons[currentLessonIndex].quiz?.options.map((opt, idx) => (
                        <button
                          key={idx}
                          id={`quiz-opt-${idx}`}
                          onClick={() => handleAnswerSelection(idx)}
                          className={`w-full text-left p-3.5 text-xs rounded-xl border transition-all duration-200 block ${
                            selectedAnswer === idx
                              ? 'bg-indigo-600/20 border-indigo-500 text-white font-medium'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="font-mono text-[10px] text-slate-500 mt-0.5">[{idx + 1}]</span>
                            <span>{opt}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {quizSubmitted && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl text-xs border ${
                          selectedAnswer === selectedCourse.lessons[currentLessonIndex].quiz?.correctAnswer
                            ? 'bg-emerald-500/10 border-emerald-505/30 text-emerald-400'
                            : 'bg-rose-500/10 border-rose-505/30 text-rose-400'
                        }`}
                      >
                        {quizFeedback}
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-mono">This lesson contains study material only. Feel free to click proceed below!</p>
                )}
              </div>

              <div className="pt-6 border-t border-slate-800/80 mt-8 flex flex-col gap-2">
                {selectedCourse.lessons[currentLessonIndex].quiz && !quizSubmitted ? (
                  <button
                    onClick={handleVerifyQuiz}
                    disabled={selectedAnswer === null}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 ${
                      selectedAnswer === null
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-900/30'
                    }`}
                  >
                    <Check className="w-4 h-4" /> Verify Answer Now
                  </button>
                ) : (
                  <button
                    onClick={handleNextOrFinish}
                    disabled={selectedCourse.lessons[currentLessonIndex].quiz && selectedAnswer !== selectedCourse.lessons[currentLessonIndex].quiz?.correctAnswer}
                    className="w-full py-3.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-950/20"
                  >
                    <span>
                      {currentLessonIndex === selectedCourse.lessons.length - 1 
                        ? 'Graduate & Claim Verified Proof 🎓' 
                        : 'Proceed to Next Lesson'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <p className="text-[10px] text-center text-slate-500 mt-2">CareerOS secure learning consensus</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* GAME-STYLE ROADMAP TREES TAB PANEL */}
      {activeTab === 'roadmaps' && (
        <div className="space-y-6" id="tab-panels-roadmaps">
          <AnimatePresence mode="wait">
          {myPathView === 'hub' ? (
            /* HUB VIEW - SHOW ROLE CARDS */
            <motion.div
              key="hub-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="space-y-6" id="my-paths-hub"
            >
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-600 animate-pulse" />
                  <span>My Learning Paths</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select a career path or continue following a target job vacancy to unlock verified credentials.
                </p>
              </div>

              {/* Followed Job Path Cards (Multiple) */}
              <AnimatePresence>
              {(candidate.followedJobIds || []).map((followedId, fIdx) => {
                const targetJob = jobs.find(j => j.id === followedId);
                if (!targetJob) return null;

                const matchScore = calculateMatchScore(targetJob.skillsNeeded);
                const missingSkills = targetJob.skillsNeeded.filter(s => !candidate.skills.includes(s));
                const possessed = targetJob.skillsNeeded.filter(s => candidate.skills.includes(s)).length;
                const total = targetJob.skillsNeeded.length;
                const percentage = Math.round((possessed / (total || 1)) * 100);

                return (
                  <motion.div
                    key={followedId}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="bg-slate-50 rounded-2xl p-6 text-slate-900 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-slate-200 pointer-events-none">
                      <Award className="w-48 h-48" />
                    </div>

                    {/* Unfollow Button */}
                    <button
                      onClick={() => onUnfollowJob?.(followedId)}
                      className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-white/90 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 flex items-center justify-center transition-all duration-200 group cursor-pointer"
                      title="Unfollow this path"
                    >
                      <X className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 transition-colors" />
                    </button>

                    <div className="space-y-3 relative z-10 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold uppercase tracking-wider font-mono">
                          Following Path
                        </span>
                        <span className="text-[10px] text-emerald-600 font-mono font-bold">
                          {percentage}% COMPLETE
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">{targetJob.title}</h3>
                        <p className="text-xs text-slate-500 font-medium">At {targetJob.company} • {targetJob.location} • {targetJob.salary}</p>
                      </div>

                      <div className="space-y-1 max-w-md">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-650">
                          <span>Target Skills ({possessed} / {total})</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <motion.div className="bg-emerald-500 h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }} />
                        </div>
                      </div>

                      {missingSkills.length > 0 ? (
                        <p className="text-[11px] text-slate-550 font-mono">
                          Missing Skills: <span className="font-bold text-slate-800">{missingSkills.join(', ')}</span>
                        </p>
                      ) : (
                        <p className="text-[11px] text-emerald-600 font-mono font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Ready to Apply! 100% verified fit.
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 relative z-10 flex flex-row md:flex-col gap-2.5 w-full md:w-auto items-stretch md:items-end justify-between md:justify-center">
                      <div className="text-left md:text-right">
                        <span className="text-xs font-mono text-slate-500 uppercase font-semibold block">Match score</span>
                        <span className="text-3xl font-black text-emerald-600 leading-none">{matchScore}%</span>
                      </div>
                      <button
                        onClick={() => {
                          const spec = getJobSpecialization(targetJob);
                          setSelectedPath(spec as any);
                          setMyPathView('detail');
                          setActiveTargetJobId(targetJob.id);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Start Learning</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
              </AnimatePresence>

              {/* Specialization Path Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="specializations-hub-grid">
                {Object.keys(SKILL_TREES).map((key, cardIdx) => {
                  const path = SKILL_TREES[key];
                  const pathSkillsList = path.nodes.map(n => n.name);
                  
                  const getPathProgress = (skillsList: string[]) => {
                    const possessed = skillsList.filter(s => candidate.skills.includes(s)).length;
                    return {
                      possessed,
                      total: skillsList.length,
                      percentage: Math.round((possessed / (skillsList.length || 1)) * 100)
                    };
                  };
                  const progress = getPathProgress(pathSkillsList);

                  // Unified clean hover states for specialization cards
                  const gradients: Record<string, string> = {
                    'Full-Stack': 'hover:border-indigo-400/50 hover:bg-slate-50/40',
                    'AI Specialist': 'hover:border-emerald-400/50 hover:bg-slate-50/40',
                    'Product Designer': 'hover:border-indigo-400/50 hover:bg-slate-50/40',
                    'Product Manager': 'hover:border-indigo-400/50 hover:bg-slate-50/40'
                  };

                  const badges: Record<string, string> = {
                    'Full-Stack': 'bg-indigo-50 text-indigo-700',
                    'AI Specialist': 'bg-emerald-50 text-emerald-700',
                    'Product Designer': 'bg-pink-50 text-pink-700',
                    'Product Manager': 'bg-amber-50 text-amber-700'
                  };

                  return (
                    <motion.div 
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut", delay: 0.05 + cardIdx * 0.05 }}
                      className={`bg-white rounded-3xl border border-slate-150 p-6 flex flex-col justify-between gap-6 transition-all duration-200 hover:shadow-sm ${gradients[key]}`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider uppercase font-mono ${badges[key]}`}>
                            {key}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono font-bold">
                            {progress.percentage}% Complete
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base font-black text-slate-900 tracking-tight">{path.title}</h3>
                          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">{path.description}</p>
                        </div>

                        {/* Skill Tags list */}
                        <div className="flex flex-wrap gap-1">
                          {pathSkillsList.slice(0, 4).map(skill => (
                            <span key={skill} className={`text-[9.5px] font-semibold px-2 py-0.5 rounded border ${
                              candidate.skills.includes(skill) 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100 font-bold' 
                                : 'bg-slate-50 text-slate-400 border-slate-100'
                            }`}>
                              {skill}
                            </span>
                          ))}
                          {pathSkillsList.length > 4 && (
                            <span className="text-[9.5px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-500 border border-slate-150 rounded">
                              +{pathSkillsList.length - 4} more
                            </span>
                          )}
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-1">
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${progress.percentage}%` }} />
                          </div>
                        </div>
                      </div>

                      <button
                        id={`start-learning-btn-${key.replace(/\s+/g, '-')}`}
                        onClick={() => {
                          setSelectedPath(key as any);
                          setMyPathView('detail');
                        }}
                        className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <span>{progress.possessed > 0 ? 'Resume Learning' : 'Start Learning'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* DETAILED VIEW - INTERACTIVE PATH SKILL TREE */
            (() => {
              const activeJob = getActiveJobForPath();
              return (
                <motion.div
                  key="detail-view"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 p-3 sm:p-8 space-y-4 sm:space-y-6 shadow-sm" id="my-path-detail-view"
                >
                  <div className="flex flex-col border-b border-slate-100 pb-3 sm:pb-5 gap-3">
                    <div className="flex items-center justify-between w-full">
                      <button
                        id="back-to-paths-btn"
                        onClick={() => setMyPathView('hub')}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-all font-bold text-xs flex items-center gap-1 border border-slate-200 bg-white cursor-pointer"
                      >
                        <span>← Back to My Paths</span>
                      </button>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono shrink-0">
                        PATH ACTIVE
                      </span>
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                        {SKILL_TREES[selectedPath].title} Skill Tree{activeJob ? ` (${activeJob.title} at ${activeJob.company})` : ''}
                      </h2>
                    </div>
                  </div>

                  {/* Path description */}
                  <div className="p-2.5 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-105 text-[11px] sm:text-xs text-slate-600 leading-normal sm:leading-relaxed font-sans">
                    <strong>Current Track:</strong> {SKILL_TREES[selectedPath].description}
                  </div>

                  {/* Skill Tree Graph Box */}
                  {(() => {
                    const nodes = SKILL_TREES[selectedPath].nodes;
                    const maxX = nodes.length > 0 ? Math.max(...nodes.map(n => n.x)) : 800;
                    const maxY = nodes.length > 0 ? Math.max(...nodes.map(n => n.y)) : 600;
                    const canvasWidth = Math.max(maxX + 150, 800);
                    const canvasHeight = Math.max(maxY + 150, 600);

                    const padding = 60;
                    const scaleX = (viewportSize.width - padding) / canvasWidth;
                    const scaleY = (viewportSize.height - padding) / canvasHeight;
                    const idealScale = Math.min(scaleX, scaleY, 0.85);
                    const minScale = Math.min(idealScale * 0.5, 0.1);

                    return (
                      <div className="relative border border-slate-200 rounded-xl sm:rounded-2xl bg-slate-50 overflow-hidden shadow-inner select-none h-[380px] sm:h-[500px] md:h-[600px]" id="path-detail-tree-canvas">
                    <style>{`
                      @keyframes flow-particles-path {
                        0% { stroke-dashoffset: 24; }
                        100% { stroke-dashoffset: 0; }
                      }
                      .connector-flow-path {
                        stroke-dasharray: 6, 4;
                        animation: flow-particles-path 1.5s linear infinite;
                      }
                    `}</style>
                    <TransformWrapper
                      key={`${selectedPath}-${idealScale}`}
                      initialScale={idealScale}
                      minScale={minScale}
                      maxScale={2}
                      centerOnInit={true}
                      wheel={{ step: 0.1 }}
                    >
                      {({ zoomIn, zoomOut, resetTransform }) => (
                        <>
                          {/* Floating controls toolbar */}
                          <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 bg-white/90 backdrop-blur-md border border-slate-200 p-1.5 rounded-xl shadow-sm">
                            <button
                              type="button"
                              onClick={() => zoomIn()}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all font-bold text-sm cursor-pointer select-none"
                              title="Zoom In"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => zoomOut()}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all font-bold text-sm cursor-pointer select-none"
                              title="Zoom Out"
                            >
                              −
                            </button>
                            <button
                              type="button"
                              onClick={() => resetTransform()}
                              className="px-3 h-8 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all font-extrabold text-[10px] uppercase tracking-wider cursor-pointer select-none"
                              title="Fit to Window"
                            >
                              Fit
                            </button>
                          </div>

                          {/* Visual Legend Key Overlay */}
                          <div className="absolute bottom-4 left-4 z-30 bg-white/90 backdrop-blur-md border border-slate-200/85 p-3 rounded-xl shadow-sm space-y-2 text-[10px] text-slate-600 w-36">
                            <span className="font-bold text-slate-800 uppercase tracking-wider block border-b border-slate-100 pb-1.5 text-[9px]">Competency Level</span>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded bg-emerald-50 border border-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.2)] block" />
                                <span className="font-semibold text-slate-750">Verified Pro</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded bg-indigo-50 border border-indigo-500 shadow-[0_0_4px_rgba(99,102,241,0.2)] block" />
                                <span className="font-semibold text-slate-755">Intermediate</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded bg-cyan-50 border border-cyan-500 shadow-[0_0_4px_rgba(6,182,212,0.2)] block" />
                                <span className="font-semibold text-slate-750">Beginner</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-400">
                                <span className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-200 block" />
                                <span>Locked</span>
                              </div>
                            </div>
                          </div>

                          <TransformComponent wrapperStyle={{ width: "100%", height: "100%", cursor: "grab" }}>
                            <div className="relative" style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}>
                              {/* Background grid canvas effect */}
                              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ 
                                backgroundImage: 'radial-gradient(circle, #818cf8 1px, transparent 1px)', 
                                backgroundSize: '16px 16px' 
                              }} />

                              {/* SVG lines layer */}
                              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                <defs>
                                  <linearGradient id="glow-grad-path" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#6366f1" />
                                  </linearGradient>
                                </defs>

                                {(() => {
                                  const connections = getPathConnections(selectedPath);
                                  const depthsMap = getNodeDepths(nodes);
                                  const activeJob = getActiveJobForPath();
                                  const allTargetSkills = activeJob ? activeJob.skillsNeeded : [];
                                  const activeTargetSkills = getSkillsWithAncestors(allTargetSkills, nodes);

                                  return connections.map((conn, idx) => {
                                    const fromNode = nodes.find(n => n.name === conn.from);
                                    const toNode = nodes.find(n => n.name === conn.to);

                                    if (!fromNode || !toNode) return null;

                                    const startX = fromNode.x;
                                    const startY = fromNode.y;
                                    const endX = toNode.x;
                                    const endY = toNode.y;

                                    const d = `M ${startX} ${startY} C ${(startX + endX) / 2} ${startY}, ${(startX + endX) / 2} ${endY}, ${endX} ${endY}`;

                                    const fromUnlocked = candidate.skills.includes(fromNode.name);
                                    const toUnlocked = candidate.skills.includes(toNode.name);
                                    const isTargetActive = activeTargetSkills.includes(conn.from) && activeTargetSkills.includes(conn.to);

                                    const fromDepth = depthsMap[conn.from] ?? 0;
                                    const pathDelay = fromDepth * 0.4;
                                    const overlayDelay = fromDepth * 0.4 + 1.4;

                                    return (
                                      <g key={idx}>
                                        {/* Base guide line */}
                                        <path 
                                          d={d}
                                          fill="none"
                                          stroke="#e2e8f0"
                                          strokeWidth={1.5}
                                        />

                                        {/* Growing Trunk/Connection */}
                                        {(fromUnlocked && toUnlocked) && (
                                          <motion.path
                                            d={d}
                                            fill="none"
                                            stroke={
                                              isTargetActive ? '#4f46e5' : '#10b981'
                                            }
                                            strokeWidth={isTargetActive ? 3.0 : 2.5}
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1.5, ease: "easeInOut", delay: pathDelay }}
                                          />
                                        )}

                                        {/* Flowing energy particles overlay */}
                                        {fromUnlocked && toUnlocked && (
                                          <motion.path
                                            d={d}
                                            fill="none"
                                            stroke="#86efac"
                                            strokeWidth={1.2}
                                            className="connector-flow-path"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.8 }}
                                            transition={{ delay: overlayDelay, duration: 0.4 }}
                                          />
                                        )}
                                      </g>
                                    );
                                  });
                                })()}
                              </svg>

                              {/* Nodes layer */}
                              <div className="absolute inset-0 overflow-visible">
                                <div className="relative w-full h-full">
                                  {nodes.map((node, nodeIdx) => {
                                    const isUnlockedNode = candidate.skills.includes(node.name);
                                    const prereqMet = isPrereqMet(node);
                                    const mastery = getSkillLevel(node.name);
                                    const activeJob = getActiveJobForPath();
                                    const isTargetSkill = activeJob ? activeJob.skillsNeeded.includes(node.name) : false;

                                    const wrapperStyle = {
                                      position: 'absolute' as const,
                                      left: `${node.x}px`,
                                      top: `${node.y}px`,
                                      transform: 'translate(-50%, -50%)',
                                      zIndex: hoveredSkill === node.name ? 50 : 20,
                                      width: '56px',  // w-14 is 56px
                                      height: '56px'  // h-14 is 56px
                                    };

                                    let nodeClass = '';
                                    if (isUnlockedNode) {
                                      // "Lits up" in level color if completed
                                      if (mastery === 'Pro') {
                                        nodeClass = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-700 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2';
                                      } else if (mastery === 'Intermediate') {
                                        nodeClass = 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2';
                                      } else {
                                        nodeClass = 'bg-cyan-50 border-2 border-cyan-500 text-cyan-700 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2';
                                      }
                                      
                                    } else {
                                      // "Does NOT lit up" - remains dim, dark, gray background, border, text
                                      nodeClass = 'bg-slate-100 border border-slate-200 text-slate-400 opacity-60 cursor-pointer hover:opacity-90 hover:border-slate-350 focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2';
                                    }

                                    return (
                                      <div key={node.name} style={wrapperStyle}>
                                        <motion.div 
                                          initial={{ scale: 0, opacity: 0 }}
                                          animate={{ scale: 1, opacity: 1 }}
                                          transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.15 + nodeIdx * 0.06 }}
                                          onMouseEnter={() => setHoveredSkill(node.name)}
                                          onMouseLeave={() => setHoveredSkill(null)}
                                          onClick={() => setHoveredSkill(node.name)}
                                          tabIndex={0}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                              e.preventDefault();
                                              setHoveredSkill(hoveredSkill === node.name ? null : node.name);
                                            }
                                          }}
                                          onFocus={() => setHoveredSkill(node.name)}
                                          onBlur={() => setHoveredSkill(null)}
                                          className={`w-full h-full rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative group select-none focus:outline-none ${nodeClass}`}
                                        >
                                          {/* Grayscale and opacity filter on icon if locked */}
                                          <div className={isUnlockedNode ? "" : "filter grayscale opacity-30 contrast-75 brightness-75 transition-all duration-300"}>
                                            {renderSkillIcon(node.name)}
                                          </div>

                                          {/* Center Lock icon overlay for locked nodes */}
                                          {!isUnlockedNode && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-slate-50/20 rounded-2xl">
                                              <Lock className="w-4.5 h-4.5 text-slate-400 filter drop-shadow" />
                                            </div>
                                          )}

                                          <div className={`absolute -bottom-7 left-1/2 transform -translate-x-1/2 w-24 text-center text-[9px] font-bold tracking-tight font-sans transition-colors leading-tight ${
                                            isUnlockedNode ? 'text-slate-600 group-hover:text-slate-900 group-focus:text-slate-900' : 'text-slate-400'
                                          }`}>
                                            {node.name}
                                          </div>

                                          {/* Hover card details card tooltip */}
                                          <AnimatePresence>
                                            {hoveredSkill === node.name && (
                                              <motion.div 
                                                initial={{ opacity: 0, scale: 0.85, y: 5 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.85, y: 5 }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                className="absolute bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl text-left text-xs z-50 text-white space-y-3 pointer-events-auto"
                                                style={{ 
                                                  width: '260px', 
                                                  bottom: node.y < 120 ? 'auto' : '65px',
                                                  top: node.y < 120 ? '65px' : 'auto',
                                                  left: '50%', 
                                                  transform: 'translateX(-50%)' 
                                                }}
                                              >
                                                <div className="flex items-start justify-between">
                                                  <div>
                                                    <h4 className="font-extrabold text-sm tracking-tight text-white">{node.name}</h4>
                                                    <span className="text-[10px] font-semibold text-slate-400 font-mono">Tier {node.tier} • {node.prerequisites.length === 0 ? 'Core competency' : 'Specialized'}</span>
                                                  </div>
                                                  <span className={`px-2 py-0.5 rounded text-[9px] font-black font-mono border ${
                                                    mastery === 'Pro' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                                    mastery === 'Intermediate' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
                                                    mastery === 'Beginner' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' :
                                                    'bg-slate-955 text-slate-500 border-slate-800'
                                                  }`}>
                                                    {mastery.toUpperCase()}
                                                  </span>
                                                </div>

                                                <p className="text-slate-300 text-[11px] leading-relaxed font-sans">{node.description}</p>

                                                {node.prerequisites.length > 0 && (
                                                  <div className="text-[10px] text-slate-400 font-mono">
                                                    <strong>Requires:</strong> {node.prerequisites.join(', ')}
                                                  </div>
                                                )}

                                                <div className="pt-2 border-t border-slate-800 flex flex-col gap-1.5">
                                                  {isUnlockedNode ? (
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        startAssessment(node.name);
                                                      }}
                                                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded-lg text-[10px] text-center transition-all shadow-sm"
                                                    >
                                                      {mastery === 'Pro' ? 'Verify Level Again' : 'Challenge AI Sandbox (Level Up)'}
                                                    </button>
                                                  ) : prereqMet ? (
                                                    <div className="space-y-1.5">
                                                      {node.courseId ? (
                                                        (() => {
                                                          const relatedCourse = courses.find(c => c.id === node.courseId);
                                                          if (relatedCourse) {
                                                            return (
                                                              <button
                                                                onClick={(e) => {
                                                                  e.stopPropagation();
                                                                  setActiveTab('learning');
                                                                  handleStartCourse(relatedCourse);
                                                                }}
                                                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1.5 rounded-lg text-[10px] text-center transition-all"
                                                              >
                                                                Enroll: {relatedCourse.title} 🎓
                                                              </button>
                                                            );
                                                          }
                                                          return null;
                                                        })()
                                                      ) : (
                                                        <button
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            startAssessment(node.name);
                                                          }}
                                                          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1.5 rounded-lg text-[10px] text-center transition-all"
                                                        >
                                                          Run AI Assessment Sandbox
                                                        </button>
                                                      )}
                                                    </div>
                                                  ) : (
                                                    <div className="text-[10px] text-rose-400 font-semibold font-mono text-center bg-rose-500/10 p-1.5 rounded border border-rose-500/20">
                                                      🔒 Previous nodes locked
                                                    </div>
                                                  )}
                                                </div>
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        </motion.div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </TransformComponent>
                        </>
                      )}
                    </TransformWrapper>
                  </div>
                );
              })()}
                </motion.div>
              );
            })()
          )}
          </AnimatePresence>
        </div>
      )}

      {/* GAME-STYLE INTERACTIVE AI SANDBOX ASSESSMENT MODAL */}
      <AnimatePresence>
        {activeAssessmentSkill && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4" id="ai-sandbox-modal">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-750 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Console Top */}
              <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800 font-mono text-xs">
                <div className="flex items-center space-x-2.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold tracking-wider">CAREEROS SECURE EVALUATION SYSTEM // {activeAssessmentSkill.toUpperCase()}</span>
                </div>
                <button
                  onClick={() => setActiveAssessmentSkill(null)}
                  className="text-slate-500 hover:text-white transition-all font-bold hover:scale-105"
                >
                  [QUIT]
                </button>
              </div>

              {/* Step 1: Game Description / Scenario */}
              {assessmentStep === 1 && (
                (() => {
                  let category = 'DevOps';
                  if (selectedPath === 'AI Specialist') category = 'AI';
                  else if (selectedPath === 'Product Designer') category = 'Design';
                  else if (selectedPath === 'Product Manager') category = 'Product';

                  const game = GAME_DATA[category];

                  return (
                    <div className="p-6 space-y-6 overflow-y-auto">
                      <div className="space-y-2">
                        <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider font-mono">Consensus Sandbox Challenge</span>
                        <h3 className="text-lg font-black text-white">{game.title}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{game.scenario}</p>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 leading-relaxed">
                        <p className="font-bold text-white mb-1">🤖 AI Sandbox Guidelines:</p>
                        <p>1. We will present you with 5 core procedures in scrambled order.</p>
                        <p>2. Arrange them in the correct sequence to build the target pipeline architecture.</p>
                        <p>3. Submit to the AI evaluator nodes to grade your master level (Pro, Intermediate, Beginner).</p>
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex gap-2">
                        <button
                          onClick={() => setAssessmentStep(2)}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs text-center transition-all shadow-md"
                        >
                          Initialize Diagnostic Sandbox Engine
                        </button>
                      </div>
                    </div>
                  );
                })()
              )}

              {/* Step 2: Interactive Sandbox Sorting Game */}
              {assessmentStep === 2 && (
                (() => {
                  let category = 'DevOps';
                  if (selectedPath === 'AI Specialist') category = 'AI';
                  else if (selectedPath === 'Product Designer') category = 'Design';
                  else if (selectedPath === 'Product Manager') category = 'Product';

                  const game = GAME_DATA[category];

                  return (
                    <div className="p-6 space-y-5 flex-1 flex flex-col justify-between overflow-y-auto">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider font-mono">STAGE 2 // SEQUENCE OPTIMIZATION</span>
                          <h4 className="text-xs font-extrabold text-white">Arrange steps in correct sequence from top to bottom:</h4>
                        </div>

                        {/* Interactive List with Up/Down triggers */}
                        <div className="space-y-2 font-sans">
                          {assessmentSequence.map((item, idx) => (
                            <div 
                              key={idx} 
                              className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs text-white"
                            >
                              <div className="flex items-center gap-3 pr-2">
                                <span className="font-mono text-[10px] text-emerald-500 bg-emerald-950/40 w-5 h-5 rounded-full flex items-center justify-center border border-emerald-900/30">
                                  {idx + 1}
                                </span>
                                <span className="font-semibold text-slate-200 text-[11px] leading-snug">{item}</span>
                              </div>

                              {/* Ordering Actions */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => moveItem(idx, 'up')}
                                  disabled={idx === 0}
                                  className={`w-6 h-6 rounded flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-[10px] font-bold border border-slate-750 transition-all ${
                                    idx === 0 ? 'text-slate-700 opacity-30 cursor-not-allowed' : 'text-slate-300'
                                  }`}
                                  title="Move Up"
                                >
                                  ▲
                                </button>
                                <button
                                  onClick={() => moveItem(idx, 'down')}
                                  disabled={idx === assessmentSequence.length - 1}
                                  className={`w-6 h-6 rounded flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-[10px] font-bold border border-slate-750 transition-all ${
                                    idx === assessmentSequence.length - 1 ? 'text-slate-700 opacity-30 cursor-not-allowed' : 'text-slate-300'
                                  }`}
                                  title="Move Down"
                                >
                                  ▼
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {game.tips && (
                          <p className="text-[10px] font-mono text-slate-500 leading-normal bg-slate-950/20 p-2.5 rounded-lg border border-slate-800/40">
                            💡 <strong>Hint:</strong> {game.tips}
                          </p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-850 flex gap-2">
                        <button
                          onClick={() => {
                            // Calculate Score
                            const correctSeq = game.correctSequence;
                            let matches = 0;
                            assessmentSequence.forEach((item, index) => {
                              if (item === correctSeq[index]) {
                                matches++;
                              }
                            });

                            let level: 'Beginner' | 'Intermediate' | 'Pro' = 'Beginner';
                            let success = false;
                            if (matches === 5) {
                              level = 'Pro';
                              success = true;
                            } else if (matches === 4) {
                              level = 'Intermediate';
                              success = true;
                            } else if (matches >= 3) {
                              level = 'Beginner';
                              success = true;
                            }

                            setAssessmentResult({ success, score: Math.round((matches / 5) * 100), level });
                            setAssessmentStep(3); // Loading analysis screen
                            
                            // Simulate AI node analysis latency
                            setTimeout(() => {
                              setAssessmentStep(4); // Show final result
                            }, 2000);
                          }}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs text-center transition-all shadow-md shadow-emerald-950/20"
                        >
                          Submit Setup to AI Evaluator Consensus
                        </button>
                      </div>
                    </div>
                  );
                })()
              )}

              {/* Step 3: Loading AI Simulation / Diagnostics */}
              {assessmentStep === 3 && (
                <div className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <div className="space-y-2">
                    <h3 className="text-base font-extrabold text-white font-mono">Running Real-Time Evaluation Diagnostics</h3>
                    <p className="text-xs text-slate-400 font-mono">AI consensus analyzing sequence correctness matrices...</p>
                  </div>
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-left font-mono text-[10px] text-slate-400 space-y-1">
                    <p className="text-emerald-400">⚡ INITIALIZING NETWORK COMPILE CHECK...</p>
                    <p className="text-emerald-400">⚡ VERIFYING GRAPH DEPENDENCIES...</p>
                    <p className="text-yellow-400">⚡ COMPARATIVE INDEX ALIGNMENT: PENDING SECURE VERIFY...</p>
                  </div>
                </div>
              )}

              {/* Step 4: Final Assessment Results & Level Claims */}
              {assessmentStep === 4 && assessmentResult && (
                <div className="p-6 space-y-6 overflow-y-auto">
                  <div className="text-center space-y-4">
                    {assessmentResult.success ? (
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-black">
                        ✓
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500 text-rose-400 flex items-center justify-center mx-auto text-2xl font-black">
                        ✗
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] font-mono text-violet-400 font-extrabold uppercase tracking-widest bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                        DIAGNOSTIC COMPLETED
                      </span>
                      <h3 className="text-2xl font-black text-white mt-3">Evaluation Results</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Consensus nodes completed analysis on sequence layout alignment.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                      <span className="text-xs text-slate-400 font-mono">Evaluator Score</span>
                      <span className="text-lg font-black text-white font-mono">{assessmentResult.score}% Correct</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-mono">Assessed Mastery Rating</span>
                      <span className={`px-2.5 py-1 rounded text-xs font-black font-mono border ${
                        assessmentResult.success 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      }`}>
                        {assessmentResult.success ? assessmentResult.level.toUpperCase() : 'FAILED'}
                      </span>
                    </div>

                    {assessmentResult.success ? (
                      <p className="text-[11px] text-slate-400 leading-normal pt-2 font-sans text-center">
                        This rating will be securely cryptographically stamped on your candidate file and published live to search algorithms.
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 leading-normal pt-2 font-sans text-center">
                        Validation score was below standard threshold bounds. Take a look at the study materials and retry again!
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {assessmentResult.success ? (
                      <button
                        onClick={() => {
                          onUpdateSkillLevel?.(activeAssessmentSkill, assessmentResult.level);
                          setActiveAssessmentSkill(null);
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs text-center transition-all"
                      >
                        Claim Verified {assessmentResult.level} Mastery Badge 🏆
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setAssessmentStep(2);
                          setAssessmentResult(null);
                        }}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs text-center transition-all"
                      >
                        Retry Challenge Sandbox
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {activeTab === 'learning' && !selectedCourse && (
        <div className="space-y-6 animate-fadeIn" id="tab-panels-learning">
          {/* Welcome Dashboard Accent */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-6 sm:p-8 text-indigo-950 relative overflow-hidden shadow-sm">
            <div className="absolute right-0 top-0 bottom-0 opacity-5 flex items-center pr-10 text-indigo-600 pointer-events-none">
              <Layers className="w-72 h-72" />
            </div>
            
            <div className="max-w-xl relative z-10 space-y-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200/30">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> CORE MISSION
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Your work output translates directly into hiring validation</h2>
              <p className="text-sm text-indigo-900/80 leading-relaxed">
                Skip self-reported resume bullets. When you complete lessons here, your database file updates automatically. Recruiters immediately discover your real capability.
              </p>
            </div>
          </div>

          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Expand Your Verified Portfolio</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="courses-grid">
            {courses.map(course => {
              const isEnrolled = course.enrolled;
              const isCompleted = course.completed;

              return (
                <div 
                  key={course.id} 
                  id={`course-card-${course.id}`}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wide uppercase ${
                        course.category === 'Engineering' ? 'bg-indigo-50 text-indigo-700' :
                        course.category === 'Artificial Intelligence' ? 'bg-emerald-50 text-emerald-700' :
                        course.category === 'Design' ? 'bg-pink-50 text-pink-700' :
                        course.category === 'Product' ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-50 text-slate-700'
                      }`}>
                        {course.category}
                      </span>
                      {isCompleted && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 font-mono">
                          <Check className="w-3 h-3 mr-1" /> VERIFIED
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base tracking-tight leading-tight">{course.title}</h3>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">{course.description}</p>
                    </div>

                    <div className="flex items-center text-[11px] text-slate-500 space-x-4 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {course.duration}
                      </span>
                      <span>•</span>
                      <span>{course.lessons.length} Modules</span>
                    </div>

                    {/* Skill Badges Granted */}
                    <div className="space-y-2">
                      <p className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider">SKILLS VERIFIED UPON COMPLETION:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {course.skillsGranted.map(s => (
                          <span key={s} className="px-2 py-1 bg-slate-50 rounded text-[11px] font-semibold text-slate-700 border border-slate-100">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-50">
                    {isCompleted ? (
                      <div className="w-full bg-emerald-50 text-emerald-800 py-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-500" /> 
                        <span>Portfolio Updated</span>
                      </div>
                    ) : isEnrolled ? (
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Continue Course ({course.progress}% done)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartCourse(course)}
                        className="w-full bg-slate-900 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-150 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1"
                      >
                        <span>Enroll & Certify Ability</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. VERIFIED PORTFOLIO / CV TAB PANEL */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn" id="tab-panels-profile">
          {/* Left Block: The Profile Resume Output */}
          <div className="lg:col-span-12 space-y-6">
            {/* Main resume card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-8" id="verified-compiled-cv">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row gap-6 items-start justify-between border-b border-slate-100 pb-6">
                <div className="flex flex-col sm:flex-row gap-5 items-center text-center sm:text-left">
                  <img 
                    src={candidate.avatar} 
                    alt={candidate.name} 
                    className="w-18 h-18 rounded-2xl object-cover ring-4 ring-indigo-50" 
                  />
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{candidate.name}</h2>
                    <p className="text-sm font-semibold text-indigo-600 mt-1">{candidate.title}</p>
                    <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                      <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                        {candidate.email}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">Live on Recruiter Marketplace</span>
                    </div>
                  </div>
                </div>

                {/* Candidate Status Selector */}
                <div className="bg-slate-50 py-1.5 px-3 rounded-xl border border-slate-100 self-stretch sm:self-auto flex flex-col justify-center items-center sm:items-end">
                  <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider">JOB-SEARCH STATE</span>
                  <select 
                    id="status-select"
                    value={candidate.status}
                    onChange={(e) => onUpdateStatus(e.target.value as Candidate['status'])}
                    className="text-xs font-bold text-emerald-700 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer pt-1"
                  >
                    <option value="Open for Offers" className="text-slate-800">🟢 Open for Offers</option>
                    <option value="Interviewing" className="text-slate-800">🟡 Interviewing</option>
                    <option value="Active" className="text-slate-800">🔴 Active (Not Looking)</option>
                  </select>
                </div>
              </div>

              {/* Verified Skills Ledger (The Crown Jewel) */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      Verified Professional Competencies
                    </h3>
                    <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold font-mono">
                      CRYPTO CONSENSUS
                    </span>
                  </div>

                  {/* View Toggles & Show Progress Toggle */}
                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    {profileView === 'tree' && (
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600 select-none">
                        <input
                          id="current-progress-toggle"
                          type="checkbox"
                          checked={showCurrentProgress}
                          onChange={(e) => setShowCurrentProgress(e.target.checked)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        />
                        <span>Current Progress</span>
                      </label>
                    )}

                    <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                      <button
                        id="list-view-btn"
                        onClick={() => setProfileView('list')}
                        className={`p-1.5 rounded-md text-slate-500 hover:text-slate-950 transition-all ${
                          profileView === 'list' ? 'bg-white shadow-sm text-slate-950' : ''
                        }`}
                        title="List View"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        id="tree-view-btn"
                        onClick={() => setProfileView('tree')}
                        className={`p-1.5 rounded-md text-slate-500 hover:text-slate-950 transition-all ${
                          profileView === 'tree' ? 'bg-white shadow-sm text-slate-950' : ''
                        }`}
                        title="Skill Tree View"
                      >
                        <GitBranch className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {profileView === 'list' ? (
                  candidate.skills.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="verified-skills-list-cv">
                      {candidate.skills.map(skill => {
                        const correspondingCourse = courses.find(c => c.skillsGranted.includes(skill));
                        const mastery = candidate.skillLevels?.[skill] || 'Intermediate';
                        return (
                          <div 
                            key={skill} 
                            className="bg-white border border-slate-150 rounded-xl p-3 flex items-center justify-between shadow-sm hover:shadow transition-all"
                          >
                            <div className="flex items-center space-x-2.5">
                              <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center font-mono text-[9px] font-black text-white ${
                                mastery === 'Pro' ? 'bg-emerald-500' :
                                mastery === 'Intermediate' ? 'bg-indigo-600' :
                                'bg-slate-100 text-slate-700 font-semibold'
                              }`}>
                                {mastery[0]}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-900">{skill}</p>
                                {correspondingCourse ? (
                                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">Via: {correspondingCourse.title}</p>
                                ) : (
                                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Project-Acquired</p>
                                )}
                              </div>
                            </div>
                            <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                              Verified Fit
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-250">
                      <GraduationCap className="w-8 h-8 text-indigo-400 mx-auto opacity-75 mb-2" />
                      <p className="text-xs text-slate-500 font-medium">No verified skills generated yet.</p>
                      <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                        Enroll in the Course Academy and complete dynamic module quizzes to gain auto-validated certifications.
                      </p>
                    </div>
                  )
                ) : (
                  (() => {
                    const learningSkills = Array.from(new Set(
                      courses
                        .filter(c => c.enrolled && !c.completed)
                        .flatMap(c => c.skillsGranted)
                        .filter(s => !candidate.skills.includes(s))
                    ));

                    let customSkillCount = 0;
                    const dynamicCoords = { ...PROFILE_SKILL_COORDINATES };
                    candidate.skills.forEach(s => {
                      if (!dynamicCoords[s]) {
                        dynamicCoords[s] = {
                          x: 780,
                          y: 70 + (customSkillCount % 8) * 80,
                          category: 'Custom',
                          description: 'Self-directed or project-acquired skill competency.'
                        };
                        customSkillCount++;
                      }
                    });

                    const visibleNodesList = Object.keys(dynamicCoords).filter(name => {
                      if (candidate.skills.includes(name)) return true;
                      if (showCurrentProgress && learningSkills.includes(name)) return true;
                      return false;
                    });

                    const visibleNodes = visibleNodesList.map(name => ({
                      name,
                      ...dynamicCoords[name]
                    }));

                    const maxX = visibleNodes.length > 0 ? Math.max(...visibleNodes.map(n => n.x)) : 800;
                    const maxY = visibleNodes.length > 0 ? Math.max(...visibleNodes.map(n => n.y)) : 600;
                    const canvasWidth = Math.max(maxX + 150, 800);
                    const canvasHeight = Math.max(maxY + 150, 600);

                    const padding = 60;
                    const scaleX = (viewportSize.width - padding) / canvasWidth;
                    const scaleY = (viewportSize.height - padding) / canvasHeight;
                    const idealScale = Math.min(scaleX, scaleY, 0.85);
                    const minScale = Math.min(idealScale * 0.5, 0.1);

                    return (
                      <div className="relative border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden shadow-inner select-none h-[500px]" id="profile-skill-tree-canvas">
                        <style>{`
                          @keyframes flow-particles-profile {
                            0% { stroke-dashoffset: 24; }
                            100% { stroke-dashoffset: 0; }
                          }
                          .connector-flow-profile {
                            stroke-dasharray: 6, 4;
                            animation: flow-particles-profile 1.5s linear infinite;
                          }
                        `}</style>
                        <TransformWrapper
                          key={`${showCurrentProgress}-${candidate.skills.length}-${idealScale}`}
                          initialScale={idealScale}
                          minScale={minScale}
                          maxScale={2}
                          centerOnInit={true}
                          wheel={{ step: 0.1 }}
                        >
                          {({ zoomIn, zoomOut, resetTransform }) => (
                            <>
                              {/* Floating controls toolbar */}
                              <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 bg-white/90 backdrop-blur-md border border-slate-200 p-1.5 rounded-xl shadow-sm">
                                <button
                                  type="button"
                                  onClick={() => zoomIn()}
                                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all font-bold text-sm cursor-pointer select-none"
                                  title="Zoom In"
                                >
                                  +
                                </button>
                                <button
                                  type="button"
                                  onClick={() => zoomOut()}
                                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all font-bold text-sm cursor-pointer select-none"
                                  title="Zoom Out"
                                >
                                  −
                                </button>
                                <button
                                  type="button"
                                  onClick={() => resetTransform()}
                                  className="px-3 h-8 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all font-extrabold text-[10px] uppercase tracking-wider cursor-pointer select-none"
                                  title="Fit to Window"
                                >
                                  Fit
                                </button>
                              </div>

                              {/* Visual Legend Key Overlay */}
                              <div className="absolute bottom-4 left-4 z-30 bg-white/90 backdrop-blur-md border border-slate-200/85 p-3 rounded-xl shadow-sm space-y-2 text-[10px] text-slate-600 w-36">
                                <span className="font-bold text-slate-800 uppercase tracking-wider block border-b border-slate-100 pb-1.5 text-[9px]">Competency Level</span>
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded bg-emerald-50 border border-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.2)] block" />
                                    <span className="font-semibold text-slate-750">Verified Pro</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded bg-indigo-50 border border-indigo-500 shadow-[0_0_4px_rgba(99,102,241,0.2)] block" />
                                    <span className="font-semibold text-slate-755">Intermediate</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded bg-cyan-50 border border-cyan-500 shadow-[0_0_4px_rgba(6,182,212,0.2)] block" />
                                    <span className="font-semibold text-slate-750">Beginner</span>
                                  </div>
                                  {showCurrentProgress && (
                                    <div className="flex items-center gap-2">
                                      <span className="w-2.5 h-2.5 rounded bg-amber-50 border border-dashed border-amber-500 block animate-pulse" />
                                      <span className="font-semibold text-amber-700">In Progress</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <TransformComponent wrapperStyle={{ width: "100%", height: "100%", cursor: "grab" }}>
                                <div className="relative" style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}>
                                  {/* Background grid canvas effect */}
                                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ 
                                    backgroundImage: 'radial-gradient(circle, #818cf8 1px, transparent 1px)', 
                                    backgroundSize: '16px 16px' 
                                  }} />

                                  {/* SVG lines layer */}
                                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                    <defs>
                                      <linearGradient id="glow-grad-profile" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="100%" stopColor="#6366f1" />
                                      </linearGradient>
                                    </defs>

                                    {(() => {
                                      const connections = PROFILE_SKILL_CONNECTIONS.filter(conn => {
                                        return visibleNodesList.includes(conn.from) && visibleNodesList.includes(conn.to);
                                      });
                                      const depthsMap = getProfileNodeDepths();
                                      const followedJobs = jobs.filter(j => (candidate.followedJobIds || []).includes(j.id));
                                      const allTargetSkills = followedJobs.flatMap(j => j.skillsNeeded);
                                      const profileActiveTargetSkills = getProfileSkillsWithAncestors(allTargetSkills);

                                      return connections.map((conn, idx) => {
                                        const fromNode = dynamicCoords[conn.from];
                                        const toNode = dynamicCoords[conn.to];

                                        if (!fromNode || !toNode) return null;

                                        const startX = fromNode.x;
                                        const startY = fromNode.y;
                                        const endX = toNode.x;
                                        const endY = toNode.y;

                                        const d = `M ${startX} ${startY} C ${(startX + endX) / 2} ${startY}, ${(startX + endX) / 2} ${endY}, ${endX} ${endY}`;

                                        const fromUnlocked = candidate.skills.includes(conn.from);
                                        const toUnlocked = candidate.skills.includes(conn.to);
                                        const isTargetActive = profileActiveTargetSkills.includes(conn.from) && profileActiveTargetSkills.includes(conn.to);

                                        const fromDepth = depthsMap[conn.from] ?? 0;
                                        const pathDelay = fromDepth * 0.4;
                                        const overlayDelay = fromDepth * 0.4 + 1.4;

                                        let strokeColor = '#10b981';
                                        const fromMastery = candidate.skillLevels?.[conn.from] || 'Intermediate';
                                        const toMastery = candidate.skillLevels?.[conn.to] || 'Intermediate';
                                        
                                        if (isTargetActive) {
                                          strokeColor = '#4f46e5';
                                        } else if (fromMastery === 'Pro' && toMastery === 'Pro') {
                                          strokeColor = '#10b981';
                                        } else if (fromMastery === 'Beginner' || toMastery === 'Beginner') {
                                          strokeColor = '#06b6d4';
                                        } else {
                                          strokeColor = '#6366f1';
                                        }

                                        return (
                                          <g key={idx}>
                                            {/* Base guide line */}
                                            <path 
                                              d={d}
                                              fill="none"
                                              stroke="#e2e8f0"
                                              strokeWidth={1.5}
                                            />
                                            
                                            {/* Glowing growing trunk (traces on mount) */}
                                            {fromUnlocked && toUnlocked && (
                                              <motion.path
                                                d={d}
                                                fill="none"
                                                stroke={strokeColor}
                                                strokeWidth={isTargetActive ? 3.0 : 2.5}
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 1.5, ease: "easeInOut", delay: pathDelay }}
                                              />
                                            )}

                                            {/* Flowing energy particles overlay */}
                                            {fromUnlocked && toUnlocked && (
                                              <motion.path
                                                d={d}
                                                fill="none"
                                                stroke="#86efac"
                                                strokeWidth={1.2}
                                                className="connector-flow-profile"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 0.8 }}
                                                transition={{ delay: overlayDelay, duration: 0.4 }}
                                              />
                                            )}
                                          </g>
                                        );
                                      });
                                    })()}
                                  </svg>

                                  {/* Nodes layer */}
                                  <div className="absolute inset-0 overflow-visible">
                                    <div className="relative w-full h-full">
                                      {visibleNodes.map((node, nodeIdx) => {
                                        const isUnlockedNode = candidate.skills.includes(node.name);
                                        const isLearningNode = learningSkills.includes(node.name);
                                        
                                        // Look up prerequisites, courseId and tier from any specialization tree
                                        let nodeDetails = { prerequisites: [] as string[], courseId: undefined as string | undefined, tier: 1 };
                                        for (const pathKey of Object.keys(SKILL_TREES)) {
                                          const matchingPathNode = SKILL_TREES[pathKey].nodes.find(n => n.name === node.name);
                                          if (matchingPathNode) {
                                            nodeDetails = {
                                              prerequisites: matchingPathNode.prerequisites,
                                              courseId: matchingPathNode.courseId,
                                              tier: matchingPathNode.tier
                                            };
                                            break;
                                          }
                                        }

                                        const prereqMet = nodeDetails.prerequisites.length === 0 || nodeDetails.prerequisites.every(p => candidate.skills.includes(p));
                                        const mastery = getSkillLevel(node.name);
                                        const activeJob = getActiveJobForPath();
                                        const isTargetSkill = activeJob ? activeJob.skillsNeeded.includes(node.name) : false;

                                        const wrapperStyle = {
                                          position: 'absolute' as const,
                                          left: `${node.x}px`,
                                          top: `${node.y}px`,
                                          transform: 'translate(-50%, -50%)',
                                          zIndex: profileHoveredSkill === node.name ? 50 : 20,
                                          width: '56px',
                                          height: '56px'
                                        };

                                        let nodeClass = '';
                                        let animateClass = '';
                                        if (isUnlockedNode) {
                                          if (mastery === 'Pro') {
                                            nodeClass = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-700 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2';
                                          } else if (mastery === 'Intermediate') {
                                            nodeClass = 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2';
                                          } else {
                                            nodeClass = 'bg-cyan-50 border-2 border-cyan-500 text-cyan-700 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2';
                                          }
                                        } else if (showCurrentProgress && isLearningNode) {
                                          nodeClass = 'border-dashed border-2 border-amber-500 bg-amber-50 text-amber-700 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2';
                                          animateClass = ''; // static, no breathing
                                        } else {
                                          return null;
                                        }

                                        return (
                                          <div key={node.name} style={wrapperStyle}>
                                            <motion.div 
                                              initial={{ scale: 0, opacity: 0 }}
                                              animate={{ scale: 1, opacity: 1 }}
                                              transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.1 + nodeIdx * 0.05 }}
                                              onMouseEnter={() => setProfileHoveredSkill(node.name)}
                                              onMouseLeave={() => setProfileHoveredSkill(null)}
                                              onClick={() => setProfileHoveredSkill(node.name)}
                                              tabIndex={0}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                  e.preventDefault();
                                                  setProfileHoveredSkill(profileHoveredSkill === node.name ? null : node.name);
                                                }
                                              }}
                                              onFocus={() => setProfileHoveredSkill(node.name)}
                                              onBlur={() => setProfileHoveredSkill(null)}
                                              className={`w-full h-full rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative group select-none focus:outline-none ${nodeClass} ${animateClass}`}
                                            >
                                              {renderSkillIcon(node.name)}

                                              <div className={`absolute -bottom-7 left-1/2 transform -translate-x-1/2 w-24 text-center text-[9px] font-bold tracking-tight font-sans transition-colors leading-tight ${
                                                isUnlockedNode ? 'text-slate-600 group-hover:text-slate-900 group-focus:text-slate-900' : showCurrentProgress && isLearningNode ? 'text-amber-600' : 'text-slate-400'
                                              }`}>
                                                {node.name}
                                              </div>

                                              {/* Hover card details card tooltip */}
                                              <AnimatePresence>
                                                {profileHoveredSkill === node.name && (
                                                  <motion.div 
                                                    initial={{ opacity: 0, scale: 0.85, y: 5 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.85, y: 5 }}
                                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                    className="absolute bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl text-left text-xs z-50 text-white space-y-3 pointer-events-auto"
                                                    style={{ 
                                                      width: '260px', 
                                                      bottom: node.y < 120 ? 'auto' : '65px',
                                                      top: node.y < 120 ? '65px' : 'auto',
                                                      left: '50%', 
                                                      transform: 'translateX(-50%)' 
                                                    }}
                                                  >
                                                    <div className="flex items-start justify-between">
                                                      <div>
                                                        <h4 className="font-extrabold text-sm tracking-tight text-white">{node.name}</h4>
                                                        <span className="text-[10px] font-semibold text-slate-400 font-mono">Tier {nodeDetails.tier} • {nodeDetails.prerequisites.length === 0 ? 'Core competency' : 'Specialized'}</span>
                                                      </div>
                                                      <span className={`px-2 py-0.5 rounded text-[9px] font-black font-mono border ${
                                                        mastery === 'Pro' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                                        mastery === 'Intermediate' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
                                                        mastery === 'Beginner' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' :
                                                        isLearningNode ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                                        'bg-slate-955 text-slate-555 border-slate-855'
                                                      }`}>
                                                        {isUnlockedNode ? mastery.toUpperCase() : isLearningNode ? 'LEARNING' : 'LOCKED'}
                                                      </span>
                                                    </div>

                                                    <p className="text-slate-300 text-[11px] leading-relaxed font-sans">{node.description}</p>

                                                    {nodeDetails.prerequisites.length > 0 && (
                                                      <div className="text-[10px] text-slate-400 font-mono">
                                                        <strong>Requires:</strong> {nodeDetails.prerequisites.join(', ')}
                                                      </div>
                                                    )}

                                                    <div className="pt-2 border-t border-slate-800 flex flex-col gap-1.5">
                                                      {isUnlockedNode ? (
                                                        <button
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            startAssessment(node.name);
                                                          }}
                                                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded-lg text-[10px] text-center transition-all shadow-sm cursor-pointer"
                                                        >
                                                          {mastery === 'Pro' ? 'Verify Level Again' : 'Challenge AI Sandbox (Level Up)'}
                                                        </button>
                                                      ) : prereqMet ? (
                                                        <div className="space-y-1.5">
                                                          {nodeDetails.courseId ? (
                                                            (() => {
                                                              const relatedCourse = courses.find(c => c.id === nodeDetails.courseId);
                                                              if (relatedCourse) {
                                                                return (
                                                                  <button
                                                                    onClick={(e) => {
                                                                      e.stopPropagation();
                                                                      setActiveTab('learning');
                                                                      handleStartCourse(relatedCourse);
                                                                    }}
                                                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1.5 rounded-lg text-[10px] text-center transition-all cursor-pointer"
                                                                  >
                                                                    Enroll: {relatedCourse.title} 🎓
                                                                  </button>
                                                                );
                                                              }
                                                              return null;
                                                            })()
                                                          ) : (
                                                            <button
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                startAssessment(node.name);
                                                              }}
                                                              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1.5 rounded-lg text-[10px] text-center transition-all cursor-pointer"
                                                            >
                                                              Run AI Assessment Sandbox
                                                            </button>
                                                          )}
                                                        </div>
                                                      ) : (
                                                        <div className="text-[10px] text-rose-400 font-semibold font-mono text-center bg-rose-500/10 p-1.5 rounded border border-rose-500/20">
                                                          🔒 Previous nodes locked
                                                        </div>
                                                      )}
                                                    </div>
                                                  </motion.div>
                                                )}
                                              </AnimatePresence>
                                            </motion.div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                    </div>
                                    </div>
                                  </TransformComponent>
                                </>
                              )}
                        </TransformWrapper>
                      </div>
                    );
                  })()
                )}
              </div>

              {/* Self-Directed Personal Projects */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Self-Directed Engineering Projects
                  </h3>
                  {!isAddingProject && (
                    <button 
                      onClick={() => setIsAddingProject(true)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                      id="add-project-btn"
                    >
                      <Plus className="w-4 h-4" /> Add Project
                    </button>
                  )}
                </div>

                {isAddingProject && (
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4" id="project-form-container">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Publish New Project Case Study</h3>
                    <form onSubmit={handleAddProjectSubmit} className="space-y-3.5 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Project Name</label>
                          <input 
                            id="proj-title-input"
                            type="text" 
                            required
                            placeholder="e.g. FlightPath - Runway Analytics"
                            value={newProjTitle}
                            onChange={(e) => setNewProjTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Technologies/Languages Used</label>
                          <input 
                            id="proj-skills-input"
                            type="text" 
                            placeholder="React, Tailwind, Docker, rust (comma separated)"
                            value={newProjSkills}
                            onChange={(e) => setNewProjSkills(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Impact & Description</label>
                          <textarea 
                            id="proj-desc-input"
                            required
                            rows={3}
                            placeholder="Explain what was constructed, quantitative speeds achieved, or challenges overcome."
                            value={newProjDesc}
                            onChange={(e) => setNewProjDesc(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Repository/Live URL</label>
                          <input 
                            id="proj-link-input"
                            type="url" 
                            placeholder="https://github.com/developer/flight-path"
                            value={newProjLink}
                            onChange={(e) => setNewProjLink(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                          />
                          <div className="flex space-x-2 pt-4">
                            <button 
                              id="submit-project-btn"
                              type="submit"
                              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg cursor-pointer"
                            >
                              Publish Project
                            </button>
                            <button 
                              type="button"
                              onClick={() => setIsAddingProject(false)}
                              className="px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {candidate.projects.length > 0 ? (
                  <div className="space-y-4" id="projects-list-cv">
                    {candidate.projects.map(proj => (
                      <div key={proj.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                          {proj.link && (
                            <a 
                              href={proj.link} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-slate-400 hover:text-slate-650"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">{proj.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {proj.skills.map(s => (
                            <span key={s} className="px-1.5 py-0.5 bg-white border border-slate-100 rounded text-[10px] text-slate-600 font-medium">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No custom web projects added yet. Recruiter visibility benefits from adding raw outputs alongside academic work.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. DISCOVER OPPORTUNITIES TAB PANEL */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6 animate-fadeIn" id="tab-panels-opportunities">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm" id="jobs-filters-bar">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input 
                id="job-search-input"
                type="text" 
                placeholder="Search jobs by title, company, or tech stack..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              />
            </div>
            
            {/* Skill Selector Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold font-mono whitespace-nowrap">Filter Skill:</span>
              <select
                id="skill-filter-select"
                value={selectedSkillFilter}
                onChange={(e) => setSelectedSkillFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              >
                <option value="All">All Competencies</option>
                {allSkills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Job listings grid */}
          <div className="space-y-4" id="opportunities-feed">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => {
                const matchScore = calculateMatchScore(job.skillsNeeded);
                const hasApplied = appliedJobIds.includes(job.id);

                return (
                  <div 
                    key={job.id} 
                    id={`job-card-${job.id}`}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    <div className="flex-1 space-y-4">
                      {/* Job Title and Meta */}
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg select-none">
                            {job.logo}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-base leading-tight">{job.title}</h3>
                            <p className="text-xs text-slate-500 font-semibold mt-0.5">{job.company}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center font-mono text-[11px] text-slate-500 gap-x-4 gap-y-1 mt-2.5">
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-slate-400" /> {job.salary}</span>
                          <span>•</span>
                          <span className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded">{job.type}</span>
                          <span>•</span>
                          <span>Posted: {job.datePosted}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">{job.description}</p>

                      {/* Required Skills match indicator */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">COMPETENCY TARGETS:</span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            matchScore === 100 ? 'bg-emerald-50 text-emerald-700' :
                            matchScore >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {matchScore}% SKILL MATCH
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5">
                          {job.skillsNeeded.map(skill => {
                            const isVerifiedSkill = candidate.skills.includes(skill);
                            // Highlight course candidate can enroll in if they lack the skill
                            const correspondingLackCourse = !isVerifiedSkill ? courses.find(c => c.skillsGranted.includes(skill)) : null;

                            return (
                              <div key={skill} className="flex items-center">
                                {isVerifiedSkill ? (
                                  <span className="px-2 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center">
                                    <Check className="w-3 h-3 text-emerald-500 mr-1" /> {skill}
                                  </span>
                                ) : correspondingLackCourse ? (
                                  <button
                                    id={`enroll-lack-${job.id}-${correspondingLackCourse.id}`}
                                    onClick={() => {
                                      setActiveTab('learning');
                                      handleStartCourse(correspondingLackCourse);
                                    }}
                                    className="px-2 py-1 rounded text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 flex items-center transition-all cursor-pointer group"
                                    title={`Click to acquire ${skill} via ${correspondingLackCourse.title}`}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-505 mr-1.5 group-hover:scale-125 transition-all"></span>
                                    {skill} (Acquire 🎓)
                                  </button>
                                ) : (
                                  <span className="px-2 py-1 rounded text-xs font-regular bg-slate-50 text-slate-500 border border-slate-100">
                                    {skill} (Lacking)
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Job Skill Path Map (Simplified horizontal/chain skill tree) */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2.5" id={`job-skill-path-map-${job.id}`}>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                          <span>Opportunity Pathway Graph</span>
                          <span className="text-indigo-600 font-semibold lowercase">Complete this path to secure 100% verified fit</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-y-3 relative py-1">
                          {job.skillsNeeded.map((skill, sIdx) => {
                            const isPossessed = candidate.skills.includes(skill);
                            return (
                              <React.Fragment key={skill}>
                                {sIdx > 0 && (
                                  <div className="flex items-center mx-1.5 shrink-0">
                                    {/* Connection line */}
                                    <div className={`h-0.5 w-4 transition-all duration-300 ${
                                      isPossessed && candidate.skills.includes(job.skillsNeeded[sIdx - 1])
                                        ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                                        : 'bg-slate-200 border-dashed border-t border-slate-300'
                                    }`} />
                                  </div>
                                )}

                                <div 
                                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold select-none transition-all duration-300 ${
                                    isPossessed
                                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm shadow-emerald-100'
                                      : 'bg-white border-slate-200 text-slate-400 border-dashed hover:border-slate-300'
                                  }`}
                                  title={isPossessed ? `${skill} - Possessed` : `${skill} - Lacking`}
                                >
                                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono text-[7px] font-black text-white shrink-0 ${
                                    isPossessed ? 'bg-emerald-500' : 'bg-slate-300'
                                  }`}>
                                    {isPossessed ? '✓' : '🔒'}
                                  </div>
                                  <span className="text-[11px]">{skill}</span>
                                </div>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex lg:flex-col items-stretch lg:items-end justify-between lg:justify-center p-4 lg:p-0 bg-slate-50 lg:bg-transparent rounded-xl gap-3">
                      <div>
                        {job.applicantsCount > 0 && (
                          <div className="text-right text-[10px] text-slate-400 font-mono font-medium hidden lg:block mb-2">
                            {job.applicantsCount} Verified Applicants
                          </div>
                        )}
                      </div>

                      {hasApplied ? (
                        <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-1 font-sans">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Applied
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 w-full lg:w-auto">
                          <button
                            id={`apply-btn-${job.id}`}
                            onClick={() => onApplyJob(job.id)}
                            className={`py-2.5 px-6 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                              matchScore === 100 
                                ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-100'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100'
                            }`}
                          >
                            {matchScore === 100 ? 'Apply with 100% Verified Fit' : 'Apply For Role'}
                          </button>
                          
                          {(candidate.followedJobIds || []).includes(job.id) ? (
                            <button
                              id={`following-path-btn-${job.id}`}
                              onClick={() => onUnfollowJob?.(job.id)}
                              className="py-1.5 px-4 rounded-lg border border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100 font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              Following Path 🎯
                            </button>
                          ) : (
                            <button
                              id={`follow-path-btn-${job.id}`}
                              onClick={() => {
                                onFollowJob?.(job.id);
                                const spec = getJobSpecialization(job);
                                setSelectedPath(spec as any);
                                setMyPathView('hub');
                                setActiveTab('roadmaps');
                                setActiveTargetJobId(job.id);
                              }}
                              className="py-1.5 px-4 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              Follow Skill Path 🎯
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-500 italic">No job opportunities match your active competency search criteria.</p>
                <button
                  onClick={() => { setJobSearch(''); setSelectedSkillFilter('All'); }}
                  className="mt-3 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold"
                >
                  Clear Job Search Filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Graduation Certificate Minting Award Celebration Modal */}
      <AnimatePresence>
        {showCertModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" id="cert-congrats-modal">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full border border-slate-100 shadow-2xl space-y-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                <Award className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[10px] font-mono text-indigo-600 font-extrabold uppercase tracking-widest bg-indigo-50 px-2.5 py-0.5 rounded">
                  CONSENSUS VALIDATION SECURED
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2.5 tracking-tight">Congratulations, {candidate.name}!</h3>
                <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto">
                  You have successfully completed every lesson module and verified your hands-on ability under CareerOS standards.
                </p>
              </div>

              {/* The Certificate Render */}
              <div className="relative border-4 border-double border-indigo-600 bg-indigo-50/20 p-6 rounded-xl space-y-3">
                <div className="absolute right-3 top-3 text-[10px] font-mono text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-100 font-bold flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> SIGNED PROOF
                </div>
                <span className="font-mono text-[9px] text-slate-400 block">CAREEROS DIPLOMA OF COMPETENCY</span>
                <h4 className="text-base font-extrabold text-slate-900 tracking-tight">{showCertModal.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-sans max-w-sm mx-auto">
                  Attributes: <span className="font-semibold text-indigo-700 font-mono text-[11px]">{showCertModal.skillsGranted.join(', ')}</span> have been auto-injected into Candidate File and published to recruiter registries.
                </p>
                <div className="text-[10px] text-slate-400 mt-4 flex justify-between font-mono pt-4 border-t border-indigo-100/40">
                  <span>DATE: {new Date().toLocaleDateString()}</span>
                  <span>NODE ID: VERIFY-96H32</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  id="close-cert-btn"
                  onClick={() => {
                    setShowCertModal(null);
                    setActiveTab('profile');
                  }}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md"
                >
                  View Dynamic Profile Updates
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
