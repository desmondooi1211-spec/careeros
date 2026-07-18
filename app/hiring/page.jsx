'use client'

import { useState, useEffect } from 'react'

const INITIAL_NODES = [
  { id: 1, name: 'HTML & CSS', type: 'Foundation', color: '#4F46E5', slides: [{ lbl: 'Intro', txt: 'Semantic HTML5 and modern CSS layout.' }, { lbl: 'Concept', txt: 'Flexbox, Grid, and responsive design patterns.' }], quiz: { q: 'Which property enables grid layout?', opts: ['display:flex', 'display:grid', 'display:block'], ok: 1 } },
  { id: 2, name: 'JavaScript', type: 'Core', color: '#7C3AED', slides: [{ lbl: 'Intro', txt: 'ES2024 features, closures, and async patterns.' }, { lbl: 'Code', txt: 'Promises, async/await, and event loop mastery.' }], quiz: { q: 'What does "hoisting" mean in JS?', opts: ['Moving code to top', 'Copying variables', 'Async execution'], ok: 0 } },
  { id: 3, name: 'TypeScript', type: 'Language', color: '#0891B2', slides: [{ lbl: 'Intro', txt: 'Static typing, interfaces, and generics.' }, { lbl: 'Code', txt: 'Utility types, mapped types, and decorators.' }], quiz: { q: 'What does "as const" do?', opts: ['Convert to string', 'Make literal type', 'Disable checks'], ok: 1 } },
  { id: 4, name: 'React', type: 'Framework', color: '#059669', slides: [{ lbl: 'Intro', txt: 'Component architecture, JSX, and hooks.' }, { lbl: 'Code', txt: 'useState, useEffect, useContext, custom hooks.' }], quiz: { q: 'Where do Server Actions run?', opts: ['Browser', 'Server', 'Both'], ok: 1 } },
  { id: 5, name: 'Next.js', type: 'Framework', color: '#4F46E5', slides: [{ lbl: 'Intro', txt: 'App Router, Server Components, streaming.' }, { lbl: 'Code', txt: 'Route handlers, middleware, dynamic segments.' }], quiz: { q: 'What is ISR in Next.js?', opts: ['Immediate Static Render', 'Incremental Static Regeneration', 'Internal Server Route'], ok: 1 } },
  { id: 6, name: 'Supabase', type: 'Backend', color: '#0891B2', slides: [{ lbl: 'Intro', txt: 'PostgreSQL BaaS with real-time capabilities.' }, { lbl: 'Concept', txt: 'Row-level security, auth, edge functions.' }], quiz: { q: 'What does RLS stand for?', opts: ['Remote Layer Security', 'Row-Level Security', 'Request Limit System'], ok: 1 } },
  { id: 7, name: 'REST APIs', type: 'Integration', color: '#7C3AED', slides: [{ lbl: 'Intro', txt: 'HTTP methods, status codes, and REST principles.' }, { lbl: 'Code', txt: 'Designing resource-oriented endpoints.' }], quiz: { q: 'Which HTTP method updates a resource?', opts: ['GET', 'POST', 'PUT'], ok: 2 } },
  { id: 8, name: 'Docker', type: 'DevOps', color: '#059669', slides: [{ lbl: 'Intro', txt: 'Containers, images, docker-compose workflows.' }, { lbl: 'Code', txt: 'Multi-stage builds and env configuration.' }], quiz: { q: 'What does EXPOSE do in a Dockerfile?', opts: ['Opens firewall', 'Documents port', 'Publishes port'], ok: 1 } },
  { id: 9, name: 'CI/CD', type: 'DevOps', color: '#4F46E5', slides: [{ lbl: 'Intro', txt: 'GitHub Actions pipelines and deployment gates.' }, { lbl: 'Concept', txt: 'Staging environments and rollback strategies.' }], quiz: { q: 'What triggers a CI pipeline?', opts: ['Scheduled job', 'Code push', 'Manual only'], ok: 1 } },
]

const OVERLAY_STEPS = [
  'Parsing job requirements',
  'Mapping skill dependencies',
  'Generating prerequisite tree',
  'Compiling lesson slides',
  'Assembling quiz assessments',
  'Finalising evaluation gates',
]

const NODE_ICONS = {
  Foundation: '⬡', Core: '◈', Language: '⟨⟩', Framework: '▣',
  Backend: '⊞', Integration: '⇌', DevOps: '⚙', Custom: '◉',
}

export default function HiringHub() {
  const [screen, setScreen] = useState('form')
  const [stepIndex, setStepIndex] = useState(-1)
  const [nodes, setNodes] = useState(INITIAL_NODES)
  const [selNode, setSelNode] = useState(INITIAL_NODES[3])
  const [drawerTab, setDrawerTab] = useState('preview')
  const [toast, setToast] = useState(null)
  const [overlaySteps, setOverlaySteps] = useState(OVERLAY_STEPS)
  const [overlaySubtitle, setOverlaySubtitle] = useState('Generating your personalised learning path...')
  const [editValues, setEditValues] = useState({})

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const runOverlay = (steps, subtitle, onDone) => {
    setOverlaySteps(steps)
    setOverlaySubtitle(subtitle)
    setStepIndex(-1)
    setScreen('overlay')
    let i = 0
    const interval = setInterval(() => {
      setStepIndex(i)
      i++
      if (i > steps.length) {
        clearInterval(interval)
        setTimeout(() => onDone(), 400)
      }
    }, 500)
  }

  const handlePostJob = () => {
    runOverlay(
      OVERLAY_STEPS,
      'Generating your personalised learning path...',
      () => setScreen('outline')
    )
  }

  const handlePublish = () => setScreen('publish')

  const handleGoEditor = () => {
    setScreen('editor')
    setSelNode(nodes[3])
    setDrawerTab('preview')
  }

  const handleReset = () => {
    setNodes(INITIAL_NODES)
    setScreen('form')
    setStepIndex(-1)
  }

  const handleBadge = (type) => {
    const configs = {
      react19: {
        steps: ['Analysing React module...', 'Generating React 19 content...', 'Refreshing quiz scenarios...'],
        subtitle: 'Applying AI modifications...',
        onDone: () => {
          setNodes(prev => prev.map(n =>
            n.name === 'React' || n.name === 'React 19'
              ? { ...n, name: 'React 19', slides: [{ lbl: 'Intro', txt: 'React 19 Compiler with automatic memoization and new hook syntax.' }, { lbl: 'Code', txt: 'New hooks: useOptimistic, useFormStatus, and compiler directives.' }] }
              : n
          ))
          showToast('React upgraded to React 19 Compiler standards')
          setScreen('editor')
        }
      },
      wasm: {
        steps: ['Designing WebAssembly module...', 'Writing lesson slides...', 'Generating quiz...'],
        subtitle: 'Applying AI modifications...',
        onDone: () => {
          setNodes(prev => {
            if (prev.find(n => n.name === 'WebAssembly')) return prev
            return [...prev, { id: Date.now(), name: 'WebAssembly', type: 'Advanced', color: '#7C3AED', slides: [{ lbl: 'Intro', txt: 'Rust-to-WASM compilation and memory management.' }, { lbl: 'Code', txt: 'cargo-web bindings and web worker integration.' }], quiz: { q: 'What language compiles well to WASM?', opts: ['Python', 'Rust', 'Ruby'], ok: 1 } }]
          })
          showToast('WebAssembly module added to path')
          setScreen('editor')
        }
      },
      soap: {
        steps: ['Scanning for deprecated content...', 'Removing obsolete nodes...', 'Re-linking dependencies...'],
        subtitle: 'Applying AI modifications...',
        onDone: () => {
          showToast('Deprecated SOAP nodes removed and path re-linked')
          setScreen('editor')
        }
      }
    }
    const c = configs[type]
    runOverlay(c.steps, c.subtitle, c.onDone)
  }

  const handleAddNode = () => {
    const name = prompt('New module name:')
    if (!name) return
    const newNode = { id: Date.now(), name, type: 'Custom', color: '#888', slides: [{ lbl: 'Intro', txt: 'New module content.' }], quiz: { q: 'Sample question?', opts: ['A', 'B', 'C'], ok: 0 } }
    setNodes(prev => [...prev, newNode])
    setSelNode(newNode)
    showToast(`Module "${name}" added`)
  }

  const handleDeleteNode = () => {
    if (nodes.length <= 1) { showToast('Cannot delete the last node'); return }
    setNodes(prev => {
      const filtered = prev.filter(n => n.id !== selNode.id)
      setSelNode(filtered[0])
      return filtered
    })
    showToast('Module removed and path re-linked')
  }

  const updateNodeField = (id, field, value) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, [field]: value } : n))
    if (selNode.id === id) setSelNode(prev => ({ ...prev, [field]: value }))
  }

  const updateSlide = (nodeId, slideIdx, value) => {
    setNodes(prev => prev.map(n => {
      if (n.id !== nodeId) return n
      const slides = [...n.slides]
      slides[slideIdx] = { ...slides[slideIdx], txt: value }
      return { ...n, slides }
    }))
  }

  const updateQuiz = (nodeId, value) => {
    setNodes(prev => prev.map(n => n.id !== nodeId ? n : { ...n, quiz: { ...n.quiz, q: value } }))
  }

  const handleSendAI = (e) => {
    const inp = document.getElementById('ai-inp')
    if (!inp || !inp.value.trim()) return
    showToast('Generating syllabus adjustments in background...')
    inp.value = ''
    setTimeout(() => showToast('Syllabus update complete — path modified'), 5000)
  }

  // ─── SCREENS ────────────────────────────────────────────────────────────────

  if (screen === 'form') return <FormScreen onSubmit={handlePostJob} />

  if (screen === 'overlay') return (
    <OverlayScreen
      steps={overlaySteps}
      subtitle={overlaySubtitle}
      stepIndex={stepIndex}
    />
  )

  if (screen === 'outline') return (
    <OutlineScreen
      nodes={nodes}
      onModify={handleGoEditor}
      onPublish={handlePublish}
    />
  )

  if (screen === 'editor') return (
    <EditorScreen
      nodes={nodes}
      selNode={selNode}
      drawerTab={drawerTab}
      toast={toast}
      onSelectNode={setSelNode}
      onSwitchTab={setDrawerTab}
      onAddNode={handleAddNode}
      onDeleteNode={handleDeleteNode}
      onBadge={handleBadge}
      onSendAI={handleSendAI}
      onPublish={handlePublish}
      onBack={() => setScreen('outline')}
      onUpdateField={updateNodeField}
      onUpdateSlide={updateSlide}
      onUpdateQuiz={updateQuiz}
      onSaveToast={showToast}
    />
  )

  if (screen === 'publish') return (
    <PublishScreen
      nodes={nodes}
      onEdit={handleGoEditor}
      onReset={handleReset}
    />
  )
}

// ─── FORM SCREEN ─────────────────────────────────────────────────────────────

function FormScreen({ onSubmit }) {
  const [skills, setSkills] = useState(['Next.js', 'React', 'Supabase', 'TypeScript'])
  const [skillInput, setSkillInput] = useState('')

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      setSkills(prev => [...prev, skillInput.trim()])
      setSkillInput('')
    }
  }

  const removeSkill = (s) => setSkills(prev => prev.filter(x => x !== s))

  const autoFill = () => {
    setSkills(['Next.js', 'React', 'Supabase', 'TypeScript', 'Docker', 'CI/CD'])
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-widest text-indigo-600 uppercase mb-2">Vacancy Discovery Generator</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Broadcast Open Opportunities to Validated Talents</h1>
        <p className="text-sm text-gray-500 mb-8">When you post a vacancy, our platform translates required skills directly into a learning path for candidates.</p>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Job title</label>
              <input defaultValue="Full-Stack Developer (Generative Products)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="e.g. LLM Interaction Specialist" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Hiring institution / company name</label>
              <input defaultValue="Brainwave" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="e.g. Stripe, OpenAI" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Target annual salary range</label>
              <input defaultValue="$130k – $160k" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="e.g. $130k – $160k" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Location / timezone limits</label>
              <input defaultValue="Remote (MY timezones)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="e.g. Remote (EU timezones)" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1">Core required technical competencies</label>
            <div className="flex flex-wrap gap-2 border border-gray-200 rounded-lg px-3 py-2 min-h-[42px]">
              {skills.map(s => (
                <span key={s} onClick={() => removeSkill(s)} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-indigo-100">
                  {s} ×
                </span>
              ))}
              <input
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
                placeholder="Add skill..."
                className="text-sm outline-none bg-transparent min-w-[80px]"
              />
            </div>
            <p className="text-xs text-indigo-500 mt-1">Press Enter to add. Click a tag to remove.</p>
          </div>

          <div className="mb-6">
            <label className="block text-xs text-gray-500 mb-1">Role description / scope of work</label>
            <textarea
              defaultValue="Build AI-powered web applications using modern full-stack tooling. You will architect features end-to-end, from database schema to deployed UI."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none h-24"
              placeholder="Write the responsibilities, expected daily workflow..."
            />
          </div>

          <div className="flex gap-3">
            <button onClick={autoFill} className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              ⚡ Auto-fill demo
            </button>
            <button
              onClick={onSubmit}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              <span>⚡</span> Finalize Job & Enlist in Shared Feed
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── OVERLAY SCREEN ───────────────────────────────────────────────────────────

function OverlayScreen({ steps, subtitle, stepIndex }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl overflow-hidden" style={{ background: '#0f0c2e' }}>
          <div className="relative p-10 text-center" style={{ backgroundImage: 'linear-gradient(rgba(79,70,229,0.12) 1px,transparent 1px),linear-gradient(90deg,rgba(79,70,229,0.12) 1px,transparent 1px)', backgroundSize: '32px 32px' }}>
            <div className="relative w-16 h-16 mx-auto mb-5">
              <div className="absolute inset-0 rounded-full border-2 border-indigo-700" style={{ borderTopColor: '#4F46E5', animation: 'spin 1s linear infinite' }} />
              <div className="absolute inset-1.5 rounded-full border-2 border-purple-800" style={{ borderBottomColor: '#7C3AED', animation: 'spin 1.5s linear infinite reverse' }} />
              <div className="absolute inset-0 flex items-center justify-center text-indigo-300 text-xl">⚙</div>
            </div>
            <div className="text-white font-medium text-lg mb-2">AI Synthesis Engine Active</div>
            <div className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>{subtitle}</div>
            <div className="text-left inline-flex flex-col gap-2">
              {steps.map((step, i) => {
                const done = i < stepIndex
                const active = i === stepIndex
                return (
                  <div key={i} className="flex items-center gap-3 text-sm transition-all duration-300" style={{ color: done ? 'rgba(255,255,255,0.9)' : active ? '#a5b4fc' : 'rgba(255,255,255,0.3)' }}>
                    <div className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{ borderColor: done ? '#4F46E5' : active ? '#a5b4fc' : 'rgba(255,255,255,0.2)', background: done ? '#4F46E5' : 'transparent' }}>
                      {done && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span>{step}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-3">This usually takes a few seconds</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// ─── OUTLINE SCREEN ───────────────────────────────────────────────────────────

function OutlineScreen({ nodes, onModify, onPublish }) {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold tracking-widest text-indigo-600 uppercase mb-2">Path generated</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Full-Stack Developer (Generative Products)</h1>
        <p className="text-sm text-gray-500 mb-6">Review your AI-generated learning path before publishing to candidates.</p>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {[['9', 'Skill nodes'], ['21', 'Lesson slides'], ['9', 'Quiz gates'], ['~27h', 'Est. duration']].map(([num, label]) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className="text-2xl font-semibold text-indigo-600">{num}</div>
              <div className="text-xs text-gray-400 mt-1">{label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            {nodes.map((n, i) => (
              <div key={n.id} className="flex items-center gap-2">
                <div className={`flex flex-col items-center px-3 py-2 rounded-xl border text-center min-w-[80px] relative ${i < 3 ? 'border-l-2' : 'border border-gray-100'}`}
                  style={{ borderLeftColor: i < 3 ? n.color : undefined }}>
                  {i < 3 && <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded-full">Prereq</span>}
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm mb-1" style={{ background: n.color + '22', color: n.color }}>
                    {NODE_ICONS[n.type] || '◉'}
                  </div>
                  <div className="text-xs font-medium text-gray-800">{n.name}</div>
                  <div className="text-[10px] text-gray-400">{n.type}</div>
                </div>
                {i < nodes.length - 1 && <span className="text-gray-300 text-lg">→</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onModify} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2">
            ✏️ Modify outline
          </button>
          <button onClick={onPublish} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2">
            🚀 Looks good — Publish
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── EDITOR SCREEN ────────────────────────────────────────────────────────────

function EditorScreen({ nodes, selNode, drawerTab, toast, onSelectNode, onSwitchTab, onAddNode, onDeleteNode, onBadge, onSendAI, onPublish, onBack, onUpdateField, onUpdateSlide, onUpdateQuiz, onSaveToast }) {
  const currentNode = nodes.find(n => n.id === selNode.id) || nodes[0]

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      {toast && (
        <div className="fixed bottom-4 right-4 bg-white border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 flex items-center gap-2 z-50 shadow-sm">
          ✓ {toast}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-500 hover:bg-gray-100">← Back</button>
          <h1 className="text-base font-semibold text-gray-900">Syllabus Path Editor</h1>
          <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full">Full-Stack Developer</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 bg-white rounded-2xl border border-gray-100 overflow-hidden min-h-[500px]">

          {/* Canvas */}
          <div className="lg:col-span-2 p-4 border-r border-gray-100">
            <div className="flex gap-2 mb-3 flex-wrap">
              <button onClick={onAddNode} className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-1">+ Add node</button>
              <button onClick={onDeleteNode} className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-1">🗑 Delete</button>
              <button className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">🔗 Re-link</button>
              <button onClick={() => onSaveToast('Demo data auto-filled')} className="px-2.5 py-1.5 bg-indigo-600 text-white border border-indigo-600 rounded-lg text-xs flex items-center gap-1">⚡ Auto-fill demo</button>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              {nodes.map((n, i) => (
                <div key={n.id} className="flex items-center gap-1.5">
                  <div
                    onClick={() => onSelectNode(n)}
                    className={`px-3 py-2 rounded-xl border-2 text-center min-w-[76px] cursor-pointer transition-all ${n.id === currentNode.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:border-indigo-200'}`}
                  >
                    <div className="text-xs font-medium text-gray-800">{n.name}</div>
                    <div className="text-[10px] text-gray-400">{n.type}</div>
                  </div>
                  {i < nodes.length - 1 && <span className="text-gray-300">→</span>}
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-3 border-t border-gray-100 text-xs text-gray-400 mb-4">
              <span><strong className="text-gray-700">{nodes.length}</strong> modules</span>
              <span><strong className="text-gray-700">{nodes.length * 2}</strong> lessons</span>
              <span><strong className="text-gray-700">{nodes.length}</strong> quizzes</span>
              <span><strong className="text-gray-700">~{nodes.length * 3}h</strong> total</span>
            </div>

            {/* AI Bar */}
            <div className="border-t border-gray-100 pt-3">
              <p className="text-[10px] text-gray-400 mb-2">AI command bar</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {[['react19', '⚡ Upgrade React to React 19'], ['wasm', '⚡ Add WebAssembly course'], ['soap', '⚡ Remove deprecated SOAP']].map(([key, label]) => (
                  <button key={key} onClick={() => onBadge(key)} className="px-3 py-1.5 rounded-full text-xs bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition">
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input id="ai-inp" className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="Describe a syllabus change in natural language..." onKeyDown={e => e.key === 'Enter' && onSendAI()} />
                <button onClick={onSendAI} className="px-4 py-2 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700">Send</button>
              </div>
            </div>
          </div>

          {/* Drawer */}
          <div className="flex flex-col">
            <div className="flex border-b border-gray-100">
              {['preview', 'edit'].map(tab => (
                <button key={tab} onClick={() => onSwitchTab(tab)}
                  className={`flex-1 py-3 text-xs font-medium transition ${drawerTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}>
                  {tab === 'preview' ? 'Preview' : 'Edit content'}
                </button>
              ))}
            </div>
            <div className="p-3 flex-1 overflow-y-auto">
              <p className="text-sm font-medium text-gray-800 mb-3">{currentNode.name} <span className="text-xs font-normal text-gray-400">{currentNode.type}</span></p>

              {drawerTab === 'preview' ? (
                <>
                  {currentNode.slides.map((s, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg p-3 mb-2">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{s.lbl}</div>
                      <div className="text-xs text-gray-600">{s.txt}</div>
                    </div>
                  ))}
                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mt-2">
                    <div className="text-xs font-medium text-indigo-700 mb-2">{currentNode.quiz.q}</div>
                    {currentNode.quiz.opts.map((o, i) => (
                      <div key={i} className={`flex items-center gap-2 text-xs py-1 ${i === currentNode.quiz.ok ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
                        <span>{i === currentNode.quiz.ok ? '✓' : '○'}</span>{o}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="block text-[10px] text-gray-400 mb-1">Module name</label>
                    <input defaultValue={currentNode.name} onBlur={e => onUpdateField(currentNode.id, 'name', e.target.value)} className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-300" />
                  </div>
                  {currentNode.slides.map((s, i) => (
                    <div key={i} className="mb-3">
                      <label className="block text-[10px] text-gray-400 mb-1">Slide {i + 1} — {s.lbl}</label>
                      <textarea defaultValue={s.txt} onBlur={e => onUpdateSlide(currentNode.id, i, e.target.value)} className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 resize-none h-14 focus:outline-none focus:ring-1 focus:ring-indigo-300" />
                    </div>
                  ))}
                  <div className="mb-3">
                    <label className="block text-[10px] text-gray-400 mb-1">Quiz question</label>
                    <input defaultValue={currentNode.quiz.q} onBlur={e => onUpdateQuiz(currentNode.id, e.target.value)} className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-300" />
                  </div>
                  <button onClick={() => onSaveToast(`Changes saved to ${currentNode.name}`)} className="w-full py-2 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition">
                    Save changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-3">
          <button onClick={onPublish} className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition flex items-center gap-2">
            🚀 Publish path
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── PUBLISH SCREEN ───────────────────────────────────────────────────────────

function PublishScreen({ nodes, onEdit, onReset }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-2xl mx-auto mb-4">✓</div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Job listing is live</h1>
        <p className="text-sm text-gray-500 mb-5">Your vacancy and its learning path are now visible to all verified candidates on the marketplace.</p>
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {['Full-Stack Developer', `${nodes.length} skill nodes`, `~${nodes.length * 3}h path`, 'Brainwave'].map(tag => (
            <span key={tag} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">{tag}</span>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onEdit} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition">
            ✏️ Edit path
          </button>
          <button onClick={onReset} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
            + Post another job
          </button>
        </div>
      </div>
    </div>
  )
}
