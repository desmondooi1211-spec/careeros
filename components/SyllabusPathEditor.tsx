'use client'

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Plus, Trash2, Link, BookOpen, HelpCircle, Users,
  Check, Sparkles, ZoomIn, ZoomOut, Maximize2, AlertTriangle,
  Palette, Layers, Braces, Database, Cloud, Cpu, Waypoints,
  Code2, Terminal, Boxes, GitBranch, WifiOff,
} from 'lucide-react'

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface SlideData { label: string; content: string }
interface QuizOption { text: string; correct: boolean }
interface QuizData { question: string; options: QuizOption[] }
interface Learner { name: string; avatar: string; progress: number }

interface SkillNode {
  id: string; name: string; type: string
  x: number; y: number; col: number; row: number
  slides: SlideData[]; quiz: QuizData; learners: Learner[]
  color: string
}

interface Connection { from: string; to: string }

interface SyllabusPathEditorProps {
  jobTitle?: string; jobCompany?: string; initialSkills?: string[]
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const PALETTE = ['#4F46E5', '#7C3AED', '#0891B2', '#059669', '#DB2777', '#D97706']

const MOCK_LEARNER_NAMES = [
  'Aisha Rahman', 'Marcus Chen', 'Sofia Mendez', 'James Park',
  'Priya Nair', 'Oliver Schmidt', 'Yuki Tanaka', 'Amara Osei',
  'Lucas Ferreira', 'Nina Johansson',
]
const MOCK_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Amara',
]

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Foundation: Palette, Framework: Layers, Language: Braces, Backend: Database,
  DevOps: Cloud, Database: Database, Runtime: Cpu, Integration: Waypoints,
  Styling: Palette, Skill: Sparkles,
}
const FALLBACK_ICONS = [Code2, Terminal, Boxes, GitBranch, Sparkles]
function getNodeIcon(type: string, hash: number) {
  return TYPE_ICONS[type] || FALLBACK_ICONS[hash % FALLBACK_ICONS.length]
}

const NODE_D = 56
const NODE_R = NODE_D / 2
const SLOT_SPACING_X = 120
const SLOT_SPACING_Y = 140
const PAD_X = 80
const PAD_Y = 60
const MAX_CONNECTIONS_UP = 3
const MAX_CONNECTIONS_DOWN = 3
const MAX_CONNECTIONS = MAX_CONNECTIONS_UP + MAX_CONNECTIONS_DOWN // 6
const AUTO_CONNECT_DISTANCE = 1
const CANVAS_W = 6000
const CANVAS_H = 4000
const GRID_COLS = Math.floor((CANVAS_W - PAD_X) / SLOT_SPACING_X) // ~49
const GRID_ROWS = Math.floor((CANVAS_H - PAD_Y) / SLOT_SPACING_Y) // ~28

function slotPixel(col: number, row: number) {
  const x = PAD_X + col * SLOT_SPACING_X + (row % 2 === 1 ? SLOT_SPACING_X / 2 : 0)
  const y = PAD_Y + row * SLOT_SPACING_Y
  return { x, y }
}


function findNearestFreeSlot(centerX: number, centerY: number, occupied: Set<string>) {
  let best: { col: number; row: number; dist: number } | null = null
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const key = `${col},${row}`
      if (occupied.has(key)) continue
      const { x, y } = slotPixel(col, row)
      const dist = Math.hypot(x + NODE_R - centerX, y + NODE_R - centerY)
      if (!best || dist < best.dist) best = { col, row, dist }
    }
  }
  return best
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function slotDist(a: SkillNode, b: SkillNode) {
  return Math.max(Math.abs(a.col - b.col), Math.abs(a.row - b.row))
}

function degreeOf(id: string, conns: Connection[]) {
  return conns.filter(c => c.from === id || c.to === id).length
}
function neighborsOf(id: string, conns: Connection[]): string[] {
  return conns
    .filter(c => c.from === id || c.to === id)
    .map(c => (c.from === id ? c.to : c.from))
}

function degreeInDirection(
  id: string,
  dir: 'up' | 'down',
  nodeList: SkillNode[],
  conns: Connection[],
): number {
  const node = nodeList.find(n => n.id === id)
  if (!node) return 0
  return neighborsOf(id, conns).filter(nid => {
    const other = nodeList.find(n => n.id === nid)
    if (!other) return false
    return dir === 'up' ? other.row < node.row : other.row > node.row
  }).length
}
function connectionExists(a: string, b: string, conns: Connection[]) {
  return conns.some(c => (c.from === a && c.to === b) || (c.from === b && c.to === a))
}

function reconcileConnections(
  droppedId: string,
  nodeList: SkillNode[],
  conns: Connection[],
): Connection[] {
  const dropped = nodeList.find(n => n.id === droppedId)
  if (!dropped) return conns

  // drop any existing tie involving the moved node if it's no longer row-adjacent
  let next = conns.filter(c => {
    if (c.from !== droppedId && c.to !== droppedId) return true
    const peer = nodeList.find(n => n.id === (c.from === droppedId ? c.to : c.from))
    if (!peer) return false
    return Math.abs(peer.row - dropped.row) === 1
  })

  // candidates: only nodes exactly one row above or below, sorted by pixel distance
  const candidates = nodeList
    .filter(n => n.id !== droppedId)
    .filter(n => Math.abs(n.row - dropped.row) === 1)
    .filter(n => !connectionExists(droppedId, n.id, next))
    .sort((a, b) => {
      const distA = Math.hypot(a.x - dropped.x, a.y - dropped.y)
      const distB = Math.hypot(b.x - dropped.x, b.y - dropped.y)
      return distA - distB
    })

  for (const candidate of candidates) {
    if (degreeOf(droppedId, next) >= MAX_CONNECTIONS) break
    if (degreeOf(candidate.id, next) >= MAX_CONNECTIONS) continue
    next = [...next, { from: droppedId, to: candidate.id }]
  }

  return next
}

// ─── Node / quiz generators ────────────────────────────────────────────────

function generateNodeData(name: string, index: number): SkillNode {
  const hash = Array.from(name).reduce((acc, c, i) => (acc * 31 + name.charCodeAt(i)) >>> 0, 0)
  const color = PALETTE[hash % PALETTE.length]
  const numLearners = 2 + Math.floor(seededRandom(hash) * 3)
  const learners: Learner[] = Array.from({ length: numLearners }, (_, i) => ({
    name: MOCK_LEARNER_NAMES[(hash + i) % MOCK_LEARNER_NAMES.length],
    avatar: MOCK_AVATARS[(hash + i) % MOCK_AVATARS.length],
    progress: 20 + Math.floor(seededRandom(hash * (i + 2)) * 70),
  }))
  return {
    id: `node-${index}-${name.replace(/\s/g, '')}`,
    name, type: getNodeType(name),
    x: 0, y: 0, col: 0, row: 0, color,
    slides: [
      { label: 'Intro', content: `Introduction to ${name} — core concepts, history, and why it matters in modern development.` },
      { label: 'Deep Dive', content: `Advanced ${name} patterns, best practices, and real-world application in production systems.` },
    ],
    quiz: { question: generateQuizQuestion(name), options: generateQuizOptions(name) },
    learners,
  }
}

function getNodeType(name: string): string {
  const types: Record<string, string> = {
    'HTML5/CSS3': 'Foundation', 'React': 'Framework', 'TypeScript': 'Language',
    'Next.js': 'Framework', 'Supabase': 'Backend', 'Docker': 'DevOps',
    'SQL': 'Database', 'Node.js': 'Runtime', 'REST APIs': 'Integration',
    'GraphQL': 'Integration', 'CI/CD': 'DevOps', 'Tailwind CSS': 'Styling',
  }
  return types[name] || 'Skill'
}

function generateQuizQuestion(name: string): string {
  const q: Record<string, string> = {
    'React': 'Which hook manages local component state in React?',
    'TypeScript': 'What does the "as const" assertion do in TypeScript?',
    'Next.js': 'Where do Server Actions execute in Next.js?',
    'Docker': 'What does the EXPOSE instruction do in a Dockerfile?',
    'SQL': 'Which SQL clause filters rows after grouping?',
    'Node.js': 'What module system does Node.js use natively?',
    'GraphQL': 'What replaces multiple REST endpoints in GraphQL?',
    'CI/CD': 'What triggers a CI pipeline by default?',
  }
  return q[name] || `What is the primary purpose of ${name}?`
}

function generateQuizOptions(name: string): QuizOption[] {
  const o: Record<string, QuizOption[]> = {
    'React': [{ text: 'useEffect', correct: false }, { text: 'useState', correct: true }, { text: 'useContext', correct: false }],
    'TypeScript': [{ text: 'Converts to string', correct: false }, { text: 'Creates a literal type', correct: true }, { text: 'Disables type checks', correct: false }],
    'Next.js': [{ text: 'Browser only', correct: false }, { text: 'Server only', correct: true }, { text: 'Both sides', correct: false }],
  }
  return o[name] || [{ text: 'Option A', correct: false }, { text: 'Option B (correct)', correct: true }, { text: 'Option C', correct: false }]
}

// ─── LAYOUT ──────────────────────────────────────────────────────────────────

function assignSlots(nodeList: SkillNode[], conns: Connection[]): Record<string, { col: number; row: number }> {
  const childrenOf: Record<string, string[]> = {}
  const parentOf: Record<string, string> = {}

  conns.forEach(c => {
    if (!nodeList.some(n => n.id === c.from) || !nodeList.some(n => n.id === c.to)) return
    childrenOf[c.from] = childrenOf[c.from] || []
    childrenOf[c.from].push(c.to)
    parentOf[c.to] = c.from
  })

  const roots = nodeList.filter(n => !parentOf[n.id]).map(n => n.id)
  const rows: Record<string, number> = {}
  const cols: Record<string, number> = {}
  let leafCol = 0

  const queue = [...roots]
  roots.forEach(id => { rows[id] = 0 })

  while (queue.length) {
    const id = queue.shift()!
    const kids = childrenOf[id] || []
    kids.forEach(kid => {
      rows[kid] = rows[id] + 1
      queue.push(kid)
    })
  }

  const visited = new Set<string>()
  function assignCol(id: string): number {
    if (visited.has(id)) return cols[id]
    visited.add(id)
    const kids = (childrenOf[id] || []).filter(k => !visited.has(k))
    let col: number
    if (kids.length === 0) {
      col = leafCol++
    } else {
      const kidCols = kids.map(k => assignCol(k))
      col = Math.round((Math.min(...kidCols) + Math.max(...kidCols)) / 2)
    }
    cols[id] = Math.min(col, GRID_COLS - 1)
    return cols[id]
  }

  roots.forEach(id => assignCol(id))
  nodeList.forEach(n => { if (!visited.has(n.id)) assignCol(n.id) })

  const result: Record<string, { col: number; row: number }> = {}
  nodeList.forEach(n => {
    result[n.id] = {
      col: cols[n.id] ?? 0,
      row: Math.min(rows[n.id] ?? 0, GRID_ROWS - 1)
    }
  })
  return result
}

function applyLayout(nodeList: SkillNode[], conns: Connection[]): SkillNode[] {
  const slots = assignSlots(nodeList, conns)
  return nodeList.map(n => {
    const s = slots[n.id] || { col: 0, row: 0 }
    const { x, y } = slotPixel(s.col, s.row)
    return { ...n, x, y, col: s.col, row: s.row }
  })
}

function buildDefaultTree(ids: string[]): Connection[] {
  if (ids.length <= 1) return []
  const conns: Connection[] = []
  const BRANCH_FACTOR = 3
  let currentLevel = [ids[0]]
  let i = 1

  while (i < ids.length) {
    const nextLevel: string[] = []
    for (const parent of currentLevel) {
      for (let b = 0; b < BRANCH_FACTOR && i < ids.length; b++) {
        const child = ids[i]
        conns.push({ from: parent, to: child })
        nextLevel.push(child)
        i++
      }
    }
    currentLevel = nextLevel
    if (currentLevel.length === 0) break
  }

  return conns
}

// ─── ANIMATED PROGRESS BAR ───────────────────────────────────────────────────

function AnimatedProgressBar({ target, color }: { target: number; color: string }) {
  const [value, setValue] = useState(target - 5)
  useEffect(() => {
    const interval = setInterval(() => {
      setValue(prev => parseFloat(Math.min(99.9, prev + parseFloat((Math.random() * 0.3).toFixed(1))).toFixed(1)))
    }, 800)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ background: color }}
          animate={{ width: `${value}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
      </div>
      <span className="text-[10px] font-mono text-slate-500 w-10 text-right">{value.toFixed(1)}%</span>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function SyllabusPathEditor({
  jobTitle = 'Full-Stack Developer (Generative Products)',
  jobCompany = 'Brainwave AI',
  initialSkills = ['HTML5/CSS3', 'React', 'TypeScript', 'Next.js', 'Supabase', 'Docker', 'SQL', 'Node.js', 'REST APIs'],
}: SyllabusPathEditorProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isPanning, setIsPanning] = useState(false)
  const panStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 })
  const seed = useMemo(() => {
    const raw = initialSkills.map((name, i) => generateNodeData(name, i))
    const conns = buildDefaultTree(raw.map(n => n.id))
    return { raw, conns }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [nodes, setNodes] = useState<SkillNode[]>(() => applyLayout(seed.raw, seed.conns))
  const [connections, setConnections] = useState<Connection[]>(() => seed.conns)
  const [selectedId, setSelectedId] = useState<string | null>(nodes[1]?.id || null)
  const [drawerTab, setDrawerTab] = useState<'preview' | 'edit'>('preview')
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [linkMode, setLinkMode] = useState(false)
  const [linkFrom, setLinkFrom] = useState<string | null>(null)
  const [linkWarning, setLinkWarning] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Record<string, { name: string; slide0: string; slide1: string; quiz: string }>>({})
  const [saveFlash, setSaveFlash] = useState(false)
  const [selectedQuizOption, setSelectedQuizOption] = useState<Record<string, number>>({})
  const [zoom, setZoom] = useState(1)
  const [previewConns, setPreviewConns] = useState<Connection[]>([])

  const selectedNode = nodes.find(n => n.id === selectedId) || null

  const zoomIn = () => setZoom(z => Math.min(1.5, Math.round((z + 0.15) * 100) / 100))
  const zoomOut = () => setZoom(z => Math.max(0.4, Math.round((z - 0.15) * 100) / 100))
  const zoomReset = () => setZoom(1)

  function elbowPath(a: SkillNode, b: SkillNode) {
    const ax = a.x + NODE_R, ay = a.y + NODE_R
    const bx = b.x + NODE_R, by = b.y + NODE_R
    const bBelow = by >= ay
    const startY = ay + (bBelow ? NODE_R : -NODE_R)
    const endY = by + (bBelow ? -NODE_R : NODE_R)
    const midY = (startY + endY) / 2
    return `M${ax},${startY} L${ax},${midY} L${bx},${midY} L${bx},${endY}`
  }

  const flashWarning = (msg: string) => {
    setLinkWarning(msg); setTimeout(() => setLinkWarning(null), 2200)
  }

  // ── Drag ──────────────────────────────────────────────────────────────────
const handleBoardMouseDown = (e: React.MouseEvent) => {
  if (linkMode || draggingId) return
  const container = scrollContainerRef.current
  if (!container) return
  setIsPanning(true)
  panStart.current = {
    x: e.clientX,
    y: e.clientY,
    scrollLeft: container.scrollLeft,
    scrollTop: container.scrollTop,
  }
}

const handlePanMouseMove = useCallback((e: MouseEvent) => {
  if (!isPanning) return
  const container = scrollContainerRef.current
  if (!container) return
  const dx = e.clientX - panStart.current.x
  const dy = e.clientY - panStart.current.y
  container.scrollLeft = panStart.current.scrollLeft - dx
  container.scrollTop = panStart.current.scrollTop - dy
}, [isPanning])

const handlePanMouseUp = useCallback(() => {
  setIsPanning(false)
}, [])

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    if (linkMode) return
    e.stopPropagation()
    const node = nodes.find(n => n.id === id)
    if (!node) return
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    setDraggingId(id)
    setDragOffset({ x: (e.clientX - rect.left) / zoom - node.x, y: (e.clientY - rect.top) / zoom - node.y })
    setSelectedId(id)
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingId) return
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.max(0, Math.min(CANVAS_W - NODE_D, (e.clientX - rect.left) / zoom - dragOffset.x))
    const y = Math.max(0, Math.min(CANVAS_H - NODE_D, (e.clientY - rect.top) / zoom - dragOffset.y))

    setNodes(prev => {
      const updated = prev.map(n => n.id === draggingId ? { ...n, x, y } : n)
      const dragged = updated.find(n => n.id === draggingId)!
      const occupied = new Set(updated.filter(n => n.id !== draggingId).map(n => `${n.col},${n.row}`))
      const nearest = findNearestFreeSlot(dragged.x + NODE_R, dragged.y + NODE_R, occupied)
      if (nearest) {
        const ghost = { ...dragged, col: nearest.col, row: nearest.row }
        const ghostList = updated.map(n => n.id === draggingId ? ghost : n)
        const preview = reconcileConnections(draggingId, ghostList, connections)
        const addedOrKept = preview.filter(c =>
          (c.from === draggingId || c.to === draggingId) &&
          !connectionExists(c.from, c.to, connections.filter(cc =>
            cc.from !== draggingId && cc.to !== draggingId
          ))
        )
        setPreviewConns(addedOrKept)
      }
      return updated
    })
  }, [draggingId, dragOffset, zoom, connections])

  const handleMouseUp = useCallback(() => {
    if (draggingId) {
      setNodes(prev => {
        const dragged = prev.find(n => n.id === draggingId)
        if (!dragged) return prev
        const occupied = new Set(prev.filter(n => n.id !== draggingId).map(n => `${n.col},${n.row}`))
        const nearest = findNearestFreeSlot(dragged.x + NODE_R, dragged.y + NODE_R, occupied)
        if (!nearest) return prev
        const { x, y } = slotPixel(nearest.col, nearest.row)
        const snapped = prev.map(n =>
          n.id === draggingId ? { ...n, x, y, col: nearest.col, row: nearest.row } : n
        )
        setConnections(prevConns => reconcileConnections(draggingId, snapped, prevConns))
        setPreviewConns([])
        return snapped
      })
    }
    setDraggingId(null)
    setPreviewConns([])
  }, [draggingId])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handlePanMouseMove)
    window.addEventListener('mouseup', handlePanMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handlePanMouseMove)
      window.removeEventListener('mouseup', handlePanMouseUp)
    }
  }, [handleMouseMove, handleMouseUp, handlePanMouseMove, handlePanMouseUp])

  // ── Manual re-link mode ───────────────────────────────────────────────────
  const handleNodeClickInLinkMode = (id: string) => {
    if (!linkFrom) { setLinkFrom(id); return }
    if (linkFrom === id) { setLinkFrom(null); return }

    const fromNode = nodes.find(n => n.id === linkFrom)!
    const toNode = nodes.find(n => n.id === id)!

    if (fromNode.row === toNode.row) {
      flashWarning('Cannot link nodes on the same row — they must be above/below each other.')
      setLinkFrom(null); setLinkMode(false); return
    }

    const exists = connectionExists(linkFrom, id, connections)
    if (exists) {
      const nextConns = connections.filter(c => !((c.from === linkFrom && c.to === id) || (c.from === id && c.to === linkFrom)))
      setConnections(nextConns)
      setNodes(prev => applyLayout(prev, nextConns))
      setLinkFrom(null); setLinkMode(false); return
    }

    const dir: 'up' | 'down' = fromNode.row < toNode.row ? 'down' : 'up'
    const fromCap = dir === 'up' ? MAX_CONNECTIONS_UP : MAX_CONNECTIONS_DOWN
    const toCap = dir === 'up' ? MAX_CONNECTIONS_DOWN : MAX_CONNECTIONS_UP

    if (
      degreeInDirection(linkFrom, dir, nodes, connections) >= fromCap ||
      degreeInDirection(id, dir === 'up' ? 'down' : 'up', nodes, connections) >= toCap
    ) {
      flashWarning(`Each node can only connect to ${MAX_CONNECTIONS_UP} above and ${MAX_CONNECTIONS_DOWN} below.`)
      setLinkFrom(null); setLinkMode(false); return
    }

    const nextConns = [...connections, { from: linkFrom, to: id }]
    setConnections(nextConns)
    setNodes(prev => applyLayout(prev, nextConns))
    setLinkFrom(null); setLinkMode(false)
  }

  const handleNodeClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (linkMode) handleNodeClickInLinkMode(id)
    else setSelectedId(id)
  }

  // ── Add / delete ──────────────────────────────────────────────────────────
  const handleAddNode = () => {
    const name = prompt('New skill name:')
    if (!name?.trim()) return
    const newNode = generateNodeData(name.trim(), nodes.length)
    let parentId: string | undefined
    if (selectedId && degreeInDirection(selectedId, 'down', nodes, connections) < MAX_CONNECTIONS_DOWN) {
      parentId = selectedId
    } else {
      parentId = nodes.find(n => degreeInDirection(n.id, 'down', nodes, connections) < MAX_CONNECTIONS_DOWN)?.id
      if (!parentId) flashWarning('Every node already has 3 children — added as a new root.')
    }
    const nextNodes = [...nodes, newNode]
    const nextConns = parentId ? [...connections, { from: parentId, to: newNode.id }] : connections
    setConnections(nextConns)
    setNodes(applyLayout(nextNodes, nextConns))
    setSelectedId(newNode.id)
  }

  const handleDeleteNode = () => {
    if (!selectedId) return
    const nextNodes = nodes.filter(n => n.id !== selectedId)
    const nextConns = connections.filter(c => c.from !== selectedId && c.to !== selectedId)
    setConnections(nextConns)
    setNodes(applyLayout(nextNodes, nextConns))
    setSelectedId(nextNodes[0]?.id || null)
  }

  const handleReparent = (nodeId: string, newParentId: string | null) => {
    // drop this node's existing "upward" connection (to whatever's currently one row above it)
    const nextConnsWithoutOldParent = connections.filter(c => {
      if (c.to !== nodeId && c.from !== nodeId) return true
      const peerId = c.from === nodeId ? c.to : c.from
      const peer = nodes.find(n => n.id === peerId)
      const self = nodes.find(n => n.id === nodeId)
      if (!peer || !self) return true
      return peer.row >= self.row  // keep connections to children/siblings, drop the one to the old parent
    })

    const nextConns = newParentId
      ? [...nextConnsWithoutOldParent, { from: newParentId, to: nodeId }]
      : nextConnsWithoutOldParent

    setConnections(nextConns)
    setNodes(prev => applyLayout(prev, nextConns))
  }

  // ── Save edits ────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!selectedId || !editValues[selectedId]) return
    const ev = editValues[selectedId]
    setNodes(prev => prev.map(n => {
      if (n.id !== selectedId) return n
      return {
        ...n,
        name: ev.name || n.name,
        slides: [
          { label: n.slides[0].label, content: ev.slide0 || n.slides[0].content },
          { label: n.slides[1]?.label || 'Deep Dive', content: ev.slide1 || n.slides[1]?.content || '' },
        ],
        quiz: { ...n.quiz, question: ev.quiz || n.quiz.question },
      }
    }))
    setSaveFlash(true)
    setTimeout(() => setSaveFlash(false), 1500)
  }

  const visibleConns = useMemo(() => {
    const all = [...connections]
    previewConns.forEach(pc => {
      if (!connectionExists(pc.from, pc.to, all)) all.push(pc)
    })
    return all
  }, [connections, previewConns])

  return (
    <div className="flex flex-col" style={{ minHeight: '520px' }}>
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden" style={{ minHeight: '480px' }}>

        {/* ── LEFT: Board ── */}
        <div className="flex flex-col flex-1 min-w-0 border-b lg:border-b-0 lg:border-r border-slate-100">

          {/* Toolbar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-100 bg-slate-50/60 flex-wrap">
            <button onClick={handleAddNode}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition">
              <Plus className="w-3.5 h-3.5" /> Add Node
            </button>
            <button onClick={handleDeleteNode} disabled={!selectedId}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition disabled:opacity-40">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
            <button onClick={() => { setLinkMode(m => !m); setLinkFrom(null) }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold border rounded-lg transition ${
                linkMode ? 'bg-amber-500 text-white border-amber-500' : 'text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-200'
              }`}>
              <Link className="w-3.5 h-3.5" />
              {linkMode ? (linkFrom ? 'Click target node…' : 'Click source node…') : 'Re-link'}
            </button>

            <div className="flex-1" />

            {linkWarning && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
                <AlertTriangle className="w-3 h-3" /> {linkWarning}
              </span>
            )}

            {/* Zoom controls */}
            <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5">
              <button onClick={zoomOut} className="p-1 rounded-md hover:bg-slate-100 text-slate-500" title="Zoom out"><ZoomOut className="w-3.5 h-3.5" /></button>
              <button onClick={zoomReset} className="px-1.5 text-[10px] font-mono font-bold text-slate-500 hover:bg-slate-100 rounded-md py-1">{Math.round(zoom * 100)}%</button>
              <button onClick={zoomIn} className="p-1 rounded-md hover:bg-slate-100 text-slate-500" title="Zoom in"><ZoomIn className="w-3.5 h-3.5" /></button>
              <button onClick={zoomReset} className="p-1 rounded-md hover:bg-slate-100 text-slate-500" title="Fit"><Maximize2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {/* Board */}
          <div
            ref={scrollContainerRef}
            className="relative bg-slate-50/40 overflow-auto select-none"
            style={{
              cursor: draggingId ? 'grabbing' : isPanning ? 'grabbing' : 'grab',
              height: '500px',   // ← this is your "limit view size" — set whatever fixed height/width you want
            }}
            onMouseDown={handleBoardMouseDown}
            onClick={() => { if (!linkMode && !isPanning) setSelectedId(null) }}
          >
            <div ref={canvasRef} className="relative origin-top-left"
              style={{ width: `${CANVAS_W}px`, height: `${CANVAS_H}px`, transform: `scale(${zoom})` }}>

              {/* Preset sockets */}
              <svg className="absolute inset-0 pointer-events-none" style={{ width: `${CANVAS_W}px`, height: `${CANVAS_H}px` }}>
                {Array.from({ length: GRID_ROWS }).map((_, row) =>
                  Array.from({ length: GRID_COLS }).map((_, col) => {
                    const { x, y } = slotPixel(col, row)
                    return (
                      <circle key={`slot-${col}-${row}`}
                        cx={x + NODE_R} cy={y + NODE_R} r={NODE_R - 4}
                        fill="#EEF2FF" stroke="#C7D2FE" strokeWidth={1.5}
                        strokeDasharray="3,4" opacity={0.6} />
                    )
                  })
                )}
              </svg>

              {/* Connections — committed + live preview */}
              <svg className="absolute inset-0 pointer-events-none" style={{ width: `${CANVAS_W}px`, height: `${CANVAS_H}px` }}>
                {visibleConns.map((conn, i) => {
                  const a = nodes.find(n => n.id === conn.from)
                  const b = nodes.find(n => n.id === conn.to)
                  if (!a || !b) return null

                  const isPreview = previewConns.some(
                    pc => (pc.from === conn.from && pc.to === conn.to) || (pc.from === conn.to && pc.to === conn.from)
                  )
                  const isActive = (a.id === selectedId || b.id === selectedId) && !isPreview

                  return (
                    <path key={`${conn.from}-${conn.to}-${i}`}
                      d={elbowPath(a, b)}
                      stroke={isPreview ? '#6EE7B7' : isActive ? '#4F46E5' : '#94A3B8'}
                      strokeWidth={isPreview ? 2 : isActive ? 2.5 : 1.75}
                      strokeDasharray={isPreview ? '6,4' : undefined}
                      fill="none" strokeLinecap="round" strokeLinejoin="round"
                      opacity={isPreview ? 0.85 : 1}
                    />
                  )
                })}

                {linkMode && linkFrom && (() => {
                  const from = nodes.find(n => n.id === linkFrom)
                  if (!from) return null
                  return (
                    <circle cx={from.x + NODE_R} cy={from.y + NODE_R} r={10} fill="#F59E0B" opacity={0.4}>
                      <animate attributeName="r" values="8;16;8" dur="1.2s" repeatCount="indefinite" />
                    </circle>
                  )
                })()}
              </svg>

              {/* Nodes */}
              {nodes.map(node => {
                const isSelected = node.id === selectedId
                const isLinkSource = node.id === linkFrom
                const isFull = degreeOf(node.id, connections) >= MAX_CONNECTIONS
                const isDraggingThis = node.id === draggingId
                const wouldConnect = isDraggingThis
                  ? false
                  : previewConns.some(pc => pc.from === node.id || pc.to === node.id)

                const hash = Array.from(node.name).reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) >>> 0, 0)
                const Icon = getNodeIcon(node.type, hash)

                return (
                  <motion.div key={node.id}
                    style={{ position: 'absolute', left: node.x, top: node.y, zIndex: isDraggingThis ? 30 : isSelected ? 20 : 10, width: NODE_D }}
                    animate={{ scale: isSelected ? 1.08 : 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    onMouseDown={e => handleMouseDown(e, node.id)}
                    onClick={e => handleNodeClick(e, node.id)}
                    className="cursor-pointer select-none flex flex-col items-center">

                    {wouldConnect && (
                      <div className="absolute rounded-full" style={{
                        border: '2.5px dashed #34D399', borderRadius: '50%',
                        width: NODE_D + 10, height: NODE_D + 10, top: -5, left: -5,
                        animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite',
                        opacity: 0.7,
                      }} />
                    )}

                    <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md ring-2 ring-white transition-all hover:shadow-lg relative"
                      style={{
                        background: node.color,
                        outline: isSelected 
                          ? `3px solid ${node.color}55`
                          : isSelected
                          ? '3px solid #FCA5A588'
                          : isLinkSource ? '3px solid #F59E0B55'
                          : wouldConnect ? '3px solid #34D39955'
                          : 'none',
                        outlineOffset: 2,
                        border: undefined,
                        boxShadow: isDraggingThis ? '0 8px 30px rgba(79,70,229,0.35)' : undefined,
                      }}>
                      {<Icon className="w-6 h-6 text-white" />}
                      {linkMode && isFull && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">3</span>
                      )}
                    </div>

                    <div className="mt-1.5 text-center">
                      <div className="text-[10.5px] font-bold leading-tight max-w-[90px]" style={{ color: '#1E293B' }}>
                        {node.name}
                      </div>
                      <div className="flex items-center justify-center gap-1 text-[9px] text-slate-400 mt-0.5">
                        <Users className="w-2.5 h-2.5" />{node.learners.length}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Drawer ── */}
        <div className="flex flex-col bg-white w-full lg:w-[300px] lg:min-w-[260px] lg:flex-shrink-0 max-h-[60vh] lg:max-h-none">
          <div className="flex border-b border-slate-100">
            {(['preview', 'edit'] as const).map(tab => (
              <button key={tab} onClick={() => setDrawerTab(tab)}
                className={`flex-1 py-2.5 text-xs font-bold transition ${
                  drawerTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}>
                {tab === 'preview' ? 'Preview' : 'Edit content'}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {!selectedNode ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-2 py-10">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-xs text-slate-400 font-medium">Click a node to inspect it</p>
              </div>
            ) : drawerTab === 'preview' ? (
              <PreviewPanel
                node={selectedNode}
                allNodes={nodes}
                connections={connections}
                onReparent={handleReparent}
                selectedQuizOption={selectedQuizOption}
                setSelectedQuizOption={setSelectedQuizOption}
              />
            ) : (
              <EditPanel node={selectedNode} editValues={editValues} setEditValues={setEditValues} onSave={handleSave} saveFlash={saveFlash} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── DISCONNECTED PANEL ──────────────────────────────────────────────────────

function DisconnectedPanel({ node }: { node: SkillNode }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-10 px-2">
      <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
        <WifiOff className="w-6 h-6 text-rose-400" />
      </div>
      <div>
        <p className="text-sm font-bold text-rose-600 mb-1">{node.name} is disconnected</p>
        <p className="text-xs text-slate-400 leading-relaxed">
          Drag it close to another node — it will auto-connect when you drop it within range.
        </p>
      </div>anel
      <div className="mt-2 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-xs text-rose-500 font-medium w-full">
        Preview unavailable until reconnected
      </div>
    </div>
  )
}

// ─── PREVIEW PANEL ─────────────────────────────────────────────────────────

function PreviewPanel({ node, allNodes, connections, onReparent, selectedQuizOption, setSelectedQuizOption }: {
  node: SkillNode
  allNodes: SkillNode[]
  connections: Connection[]
  onReparent: (nodeId: string, newParentId: string | null) => void
  selectedQuizOption: Record<string, number>
  setSelectedQuizOption: React.Dispatch<React.SetStateAction<Record<string, number>>>
}) {
  const [activeSlide, setActiveSlide] = useState(0)
  const chosen = selectedQuizOption[node.id]
  const currentParent = allNodes.find(n =>                   
    connections.some(c => c.to === node.id && c.from === n.id && n.row < node.row) 
  )  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: node.color }}>
          {node.name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900">{node.name}</div>
          <div className="text-[10px] text-slate-400">{node.type}</div>
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-500 mb-1">Connect under (parent)</label>
        <select
          value={currentParent?.id || ''}
          onChange={e => onReparent(node.id, e.target.value || null)}
          className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">— No parent (root) —</option>
          {allNodes
            .filter(n => n.id !== node.id)
            .map(n => (
              <option key={n.id} value={n.id}>{n.name}</option>
            ))}
        </select>
        <p className="text-[9.5px] text-slate-400 mt-1">
          Changing this rebuilds the tree below the new parent.
        </p>
    </div>
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lesson Slides</span>
        </div>
        <div className="flex gap-1.5 mb-2">
          {node.slides.map((s, i) => (
            <button key={i} onClick={() => setActiveSlide(i)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${activeSlide === i ? 'text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              style={activeSlide === i ? { background: node.color } : {}}>
              {s.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activeSlide} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}
            className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-600 leading-relaxed">
            {node.slides[activeSlide]?.content}
          </motion.div>
        </AnimatePresence>
      </div>
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quiz</span>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 space-y-2">
          <p className="text-xs font-semibold text-slate-800">{node.quiz.question}</p>
          {node.quiz.options.map((opt, i) => {
            const isChosen = chosen === i; const isCorrect = opt.correct; const showResult = chosen !== undefined
            return (
              <button key={i} onClick={() => setSelectedQuizOption(prev => ({ ...prev, [node.id]: i }))}
                className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition ${
                  isChosen && isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
                  isChosen && !isCorrect ? 'bg-rose-50 border-rose-300 text-rose-800' :
                  showResult && isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                  'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'
                }`}>
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isChosen ? 'border-current' : 'border-slate-300'}`}>
                  {isChosen && <span className="w-2 h-2 rounded-full bg-current" />}
                  {!isChosen && showResult && isCorrect && <Check className="w-2.5 h-2.5 text-emerald-500" />}
                </span>
                {opt.text}
              </button>
            )
          })}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Users className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Currently Learning</span>
        </div>
        <div className="space-y-2.5">
          {node.learners.slice(0, 3).map((learner, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <img src={learner.avatar} alt={learner.name}
                className="w-6 h-6 rounded-full bg-slate-200 flex-shrink-0"
                onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${learner.name}&size=24` }} />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-semibold text-slate-700 truncate">{learner.name}</div>
                <AnimatedProgressBar target={learner.progress} color={node.color} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── EDIT PANEL ─────────────────────────────────────────────────────────────

function EditPanel({ node, editValues, setEditValues, onSave, saveFlash }: {
  node: SkillNode
  editValues: Record<string, { name: string; slide0: string; slide1: string; quiz: string }>
  setEditValues: React.Dispatch<React.SetStateAction<Record<string, { name: string; slide0: string; slide1: string; quiz: string }>>>
  onSave: () => void
  saveFlash: boolean
}) {
  const ev = editValues[node.id] || { name: node.name, slide0: node.slides[0]?.content || '', slide1: node.slides[1]?.content || '', quiz: node.quiz.question }
  const update = (field: string, value: string) => setEditValues(prev => ({ ...prev, [node.id]: { ...ev, [field]: value } }))
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: node.color }}>{node.name.charAt(0)}</div>
        <span className="text-xs font-bold text-slate-800">Edit — {node.name}</span>
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-500 mb-1">Module name</label>
        <input value={ev.name} onChange={e => update('name', e.target.value)} className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-500 mb-1">Slide 1 — Intro</label>
        <textarea value={ev.slide0} onChange={e => update('slide0', e.target.value)} rows={3} className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300" />
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-500 mb-1">Slide 2 — Deep Dive</label>
        <textarea value={ev.slide1} onChange={e => update('slide1', e.target.value)} rows={3} className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300" />
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-500 mb-1">Quiz question</label>
        <input value={ev.quiz} onChange={e => update('quiz', e.target.value)} className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
      </div>
      <motion.button onClick={onSave}
        animate={saveFlash ? { scale: [1, 1.05, 1], backgroundColor: ['#4F46E5', '#059669', '#4F46E5'] } : {}}
        transition={{ duration: 0.6 }}
        className="w-full py-2.5 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
        style={{ background: saveFlash ? '#059669' : '#4F46E5' }}>
        {saveFlash ? <><Check className="w-3.5 h-3.5" /> Saved!</> : 'Save changes'}
      </motion.button>
    </div>
  )
}
