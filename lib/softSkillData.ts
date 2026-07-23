import { SoftSkillBadge, SoftSkillTrait } from './types';

/* ── Question Bank ── */

export const questionBank: Record<SoftSkillTrait, string[]> = {
  communication: [
    "Tell me about a time you had to explain a complex technical idea to someone without a technical background. How did you approach it?",
    "Describe a situation where you had to deliver difficult or unwelcome news to a stakeholder or team member. How did you handle it?",
    "Tell me about a time your message or explanation was misunderstood. How did you realize it and correct it?"
  ],
  leadership: [
    "Describe a situation where you had to motivate a team or group during a difficult or stressful period.",
    "Tell me about a time you had to lead a project or task without having formal authority over the people involved.",
    "Describe a time you had to give constructive feedback to someone who wasn't performing well. How did you approach it?"
  ],
  decisionMaking: [
    "Tell me about a time you had to make an important decision without having all the information you wanted. What did you do?",
    "Describe a situation where you had to choose between two competing priorities with limited time. How did you decide?",
    "Tell me about a decision you made that didn't turn out as expected. What did you learn from it?"
  ],
  criticalThinking: [
    "Describe a time you noticed a problem that others had missed. How did you identify it and what did you do next?",
    "Tell me about a situation where you had to investigate the root cause of an issue rather than just fixing the symptom.",
    "Describe a time you had to challenge an assumption or existing process that wasn't working well. What did you do?"
  ]
};

export const traitOrder: SoftSkillTrait[] = ['communication', 'leadership', 'decisionMaking', 'criticalThinking'];

export const traitLabels: Record<SoftSkillTrait, string> = {
  communication: 'Communication',
  leadership: 'Leadership',
  decisionMaking: 'Decision-Making',
  criticalThinking: 'Critical Thinking'
};

export function selectQuestions(): Record<SoftSkillTrait, string> {
  return {
    communication: questionBank.communication[Math.floor(Math.random() * questionBank.communication.length)],
    leadership: questionBank.leadership[Math.floor(Math.random() * questionBank.leadership.length)],
    decisionMaking: questionBank.decisionMaking[Math.floor(Math.random() * questionBank.decisionMaking.length)],
    criticalThinking: questionBank.criticalThinking[Math.floor(Math.random() * questionBank.criticalThinking.length)]
  };
}

/* ── Criteria Scoring ── */

export interface CriteriaResult {
  score: number;
  note: string;
}

export interface CriteriaProfile {
  starStructure: CriteriaResult;
  relevance: CriteriaResult;
  communicationQuality: CriteriaResult;
  depthSpecificity: CriteriaResult;
  speakingConfidence: CriteriaResult;
  badge: SoftSkillBadge;
  label: string;
}

export const criteriaLabels: Record<string, string> = {
  starStructure: 'STAR Structure',
  relevance: 'Relevance',
  communicationQuality: 'Communication Quality',
  depthSpecificity: 'Depth & Specificity',
  speakingConfidence: 'Speaking Confidence'
};

/* ── 5 Profiles per Competency (20 total) ── */

const communicationProfiles: CriteriaProfile[] = [
  {
    label: 'Outstanding',
    badge: 'gold',
    starStructure: { score: 5, note: 'Crystal-clear Situation, Task, Action, and Result flow' },
    relevance: { score: 5, note: 'Laser-focused on the question, no drifting' },
    communicationQuality: { score: 5, note: 'Impeccable pacing with vivid, concrete language' },
    depthSpecificity: { score: 4, note: 'Specific examples and metrics used throughout' },
    speakingConfidence: { score: 5, note: 'Assertive tone, zero filler words, natural cadence' }
  },
  {
    label: 'Excellent',
    badge: 'gold',
    starStructure: { score: 5, note: 'Well-organised narrative with clear transitions' },
    relevance: { score: 4, note: 'Stayed on topic with minor tangents' },
    communicationQuality: { score: 4, note: 'Complex ideas distilled into accessible language' },
    depthSpecificity: { score: 5, note: 'Rich detail with clear ownership of outcomes' },
    speakingConfidence: { score: 4, note: 'Confident delivery with occasional pauses for effect' }
  },
  {
    label: 'Proficient',
    badge: 'silver',
    starStructure: { score: 4, note: 'Good structure, slight fuzziness in the Result section' },
    relevance: { score: 4, note: 'Largely on point with one minor diversion' },
    communicationQuality: { score: 3, note: 'Clear explanation but occasionally too technical' },
    depthSpecificity: { score: 3, note: 'Adequate detail but could show more ownership' },
    speakingConfidence: { score: 3, note: 'Steady voice with a few filler words' }
  },
  {
    label: 'Developing',
    badge: 'silver',
    starStructure: { score: 3, note: 'Basic structure present, missing the Action element' },
    relevance: { score: 3, note: 'Partially answered, one off-topic section' },
    communicationQuality: { score: 4, note: 'Simple but accurate language, easy to follow' },
    depthSpecificity: { score: 3, note: 'General examples, lacking concrete specifics' },
    speakingConfidence: { score: 3, note: 'Measured pace with noticeable hesitation points' }
  },
  {
    label: 'Foundational',
    badge: 'bronze',
    starStructure: { score: 2, note: 'Situation mentioned, Task/Action/Result unclear' },
    relevance: { score: 3, note: 'Broadly related but missed the core question' },
    communicationQuality: { score: 2, note: 'Disjointed sequence, listener had to piece together meaning' },
    depthSpecificity: { score: 2, note: 'Surface-level observations without personal insight' },
    speakingConfidence: { score: 2, note: 'Frequent pauses, fillers, and self-corrections' }
  }
];

const leadershipProfiles: CriteriaProfile[] = [
  {
    label: 'Outstanding',
    badge: 'gold',
    starStructure: { score: 5, note: 'Compelling arc from challenge through team mobilisation to results' },
    relevance: { score: 5, note: 'Directly showcases leadership under pressure' },
    communicationQuality: { score: 5, note: 'Inspirational tone, respects all contributors by name' },
    depthSpecificity: { score: 5, note: 'Quantified team impact with before/after metrics' },
    speakingConfidence: { score: 4, note: 'Commanding presence with calibrated emotional tone' }
  },
  {
    label: 'Excellent',
    badge: 'gold',
    starStructure: { score: 4, note: 'Strong leadership narrative, Result slightly underdeveloped' },
    relevance: { score: 5, note: 'Sharp focus on influence without formal authority' },
    communicationQuality: { score: 4, note: 'Balanced and diplomatic framing of difficult situations' },
    depthSpecificity: { score: 4, note: 'Good detail on team dynamics and challenges overcome' },
    speakingConfidence: { score: 5, note: 'Authoritative yet approachable, excellent vocal variety' }
  },
  {
    label: 'Proficient',
    badge: 'silver',
    starStructure: { score: 4, note: 'Clear sequence, light on the Action phase specifics' },
    relevance: { score: 4, note: 'Relevant leadership example, somewhat generic' },
    communicationQuality: { score: 3, note: 'Polite and encouraging tone, slightly repetitive' },
    depthSpecificity: { score: 3, note: 'Mentions team size but not individual contributions' },
    speakingConfidence: { score: 3, note: 'Firm voice with occasional uncertainty on details' }
  },
  {
    label: 'Developing',
    badge: 'silver',
    starStructure: { score: 3, note: 'Structure present, Task and Result blur together' },
    relevance: { score: 3, note: 'Leadership aspects present but underemphasised' },
    communicationQuality: { score: 3, note: 'Straightforward delivery, lacks persuasive framing' },
    depthSpecificity: { score: 4, note: 'Honest reflection on team feedback received' },
    speakingConfidence: { score: 2, note: 'Hesitant in describing conflict-resolution moments' }
  },
  {
    label: 'Foundational',
    badge: 'bronze',
    starStructure: { score: 2, note: 'Struggles to separate Situation from Task' },
    relevance: { score: 2, note: 'Describes general teamwork, not leadership initiative' },
    communicationQuality: { score: 2, note: 'Passive language undermines leadership narrative' },
    depthSpecificity: { score: 2, note: 'Few concrete actions, relies on vague group effort' },
    speakingConfidence: { score: 2, note: 'Quiet delivery, frequent umms and self-doubt signals' }
  }
];

const decisionMakingProfiles: CriteriaProfile[] = [
  {
    label: 'Outstanding',
    badge: 'gold',
    starStructure: { score: 5, note: 'Tight decision arc: dilemma → options → choice → impact' },
    relevance: { score: 5, note: 'Fully owns the ambiguity and the decision responsibility' },
    communicationQuality: { score: 5, note: 'Crisp reasoning laid out step-by-step' },
    depthSpecificity: { score: 5, note: 'Trade-offs quantified, stakeholders named, outcomes measured' },
    speakingConfidence: { score: 5, note: 'Calm, decisive, no second-guessing language' }
  },
  {
    label: 'Excellent',
    badge: 'gold',
    starStructure: { score: 5, note: 'Excellent problem framing and logical resolution path' },
    relevance: { score: 4, note: 'On-point decision story, slightly over-explains context' },
    communicationQuality: { score: 4, note: 'Well-reasoned with clear criteria for the final choice' },
    depthSpecificity: { score: 4, note: 'Specific about which data was missing versus available' },
    speakingConfidence: { score: 4, note: 'Assured, frames uncertainty as a learning opportunity' }
  },
  {
    label: 'Proficient',
    badge: 'silver',
    starStructure: { score: 4, note: 'Good flow, Result could be more quantified' },
    relevance: { score: 4, note: 'Relevant high-stakes decision, well-chosen example' },
    communicationQuality: { score: 3, note: 'Logical but heavy on technical jargon' },
    depthSpecificity: { score: 3, note: 'Outlines the choice but not the rejected alternatives' },
    speakingConfidence: { score: 3, note: 'Confident about the outcome, tentative on the process' }
  },
  {
    label: 'Developing',
    badge: 'silver',
    starStructure: { score: 3, note: 'S-A-R visible, missing clear Task definition' },
    relevance: { score: 3, note: 'Decision example is relevant but too brief' },
    communicationQuality: { score: 3, note: 'Understandable but meandering in the middle section' },
    depthSpecificity: { score: 2, note: 'General "we decided" without personal role clarity' },
    speakingConfidence: { score: 3, note: 'Even tone but avoids eye-contact references' }
  },
  {
    label: 'Foundational',
    badge: 'bronze',
    starStructure: { score: 2, note: 'Fragmented story, hard to follow the decision logic' },
    relevance: { score: 2, note: 'Describes a group decision, not personal ownership' },
    communicationQuality: { score: 2, note: 'Rambling explanation with several restarts' },
    depthSpecificity: { score: 2, note: 'No mention of trade-offs or consequences considered' },
    speakingConfidence: { score: 1, note: 'Noticeable nervousness and rushed conclusion' }
  }
];

const criticalThinkingProfiles: CriteriaProfile[] = [
  {
    label: 'Outstanding',
    badge: 'gold',
    starStructure: { score: 5, note: 'Masterful root-cause investigation arc' },
    relevance: { score: 5, note: 'Perfectly illustrates systematic problem-solving' },
    communicationQuality: { score: 5, note: 'Elegantly guides listener through the discovery process' },
    depthSpecificity: { score: 5, note: 'Layers of analysis, each deeper than the last' },
    speakingConfidence: { score: 5, note: 'Intellectual authority without arrogance' }
  },
  {
    label: 'Excellent',
    badge: 'gold',
    starStructure: { score: 4, note: 'Strong investigative narrative, Result slightly underplayed' },
    relevance: { score: 5, note: 'Excellent example of challenging assumptions constructively' },
    communicationQuality: { score: 4, note: 'Clear deductive reasoning chain' },
    depthSpecificity: { score: 5, note: 'Detailed evidence trail from symptom to root cause' },
    speakingConfidence: { score: 4, note: 'Engaging, draws listener into the thought process' }
  },
  {
    label: 'Proficient',
    badge: 'silver',
    starStructure: { score: 4, note: 'Logical flow, Action section is the strongest' },
    relevance: { score: 3, note: 'Good analytical example, slightly generic scenario' },
    communicationQuality: { score: 3, note: 'Data-focused delivery, could be more engaging' },
    depthSpecificity: { score: 4, note: 'Mentions methodology but not the dead ends explored' },
    speakingConfidence: { score: 3, note: 'Steady, but lacks the conviction of a subject-matter expert' }
  },
  {
    label: 'Developing',
    badge: 'silver',
    starStructure: { score: 3, note: 'Structure okay, Task and Action overlap' },
    relevance: { score: 4, note: 'Genuine critical-thinking moment, well-chosen' },
    communicationQuality: { score: 2, note: 'Overly verbose, key insight buried in preamble' },
    depthSpecificity: { score: 3, note: 'Identifies the symptom fix but not the root cause' },
    speakingConfidence: { score: 3, note: 'Comfortable explaining but defensive about pushback' }
  },
  {
    label: 'Foundational',
    badge: 'bronze',
    starStructure: { score: 2, note: 'Missing clear Situation context' },
    relevance: { score: 2, note: 'Problem-solving shown but lacks critical evaluation depth' },
    communicationQuality: { score: 2, note: 'Hard to follow, jumps between symptoms and solutions' },
    depthSpecificity: { score: 2, note: 'Superficial analysis, accepted first explanation found' },
    speakingConfidence: { score: 2, note: 'Timid delivery, defers to others too frequently' }
  }
];

export const traitProfiles: Record<SoftSkillTrait, CriteriaProfile[]> = {
  communication: communicationProfiles,
  leadership: leadershipProfiles,
  decisionMaking: decisionMakingProfiles,
  criticalThinking: criticalThinkingProfiles
};

/* ── Evaluation ── */

export function evaluateSoftSkills(): {
  profileByTrait: Record<SoftSkillTrait, CriteriaProfile>;
  badges: Record<SoftSkillTrait, SoftSkillBadge>;
} {
  const profileByTrait = {} as Record<SoftSkillTrait, CriteriaProfile>;
  const badges = {} as Record<SoftSkillTrait, SoftSkillBadge>;

  for (const trait of traitOrder) {
    const profiles = traitProfiles[trait];
    const picked = profiles[Math.floor(Math.random() * profiles.length)];
    profileByTrait[trait] = picked;
    badges[trait] = picked.badge;
  }

  return { profileByTrait, badges };
}

/* ── Badge Tier Styling ── */

export const badgeTierColors: Record<SoftSkillBadge, {
  bg: string;
  text: string;
  border: string;
  glow: string;
  label: string;
  gradient: string;
  innerRing: string;
  iconGlow: string;
}> = {
  gold: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-300',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]',
    label: 'GOLD',
    gradient: 'from-amber-400 via-yellow-400 to-amber-500',
    innerRing: 'border-amber-200',
    iconGlow: 'drop-shadow(0 0 4px rgba(245,158,11,0.6))'
  },
  silver: {
    bg: 'bg-slate-50',
    text: 'text-gray-400',
    border: 'border-gray-200',
    glow: 'shadow-[0_0_18px_rgba(209,213,219,0.7)]',
    label: 'SILVER',
    gradient: 'from-gray-200 via-gray-300 to-gray-100',
    innerRing: 'border-gray-200',
    iconGlow: 'drop-shadow(0 0 6px rgba(243, 243, 245, 0.8))'
  },
  bronze: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-300',
    glow: 'shadow-[0_0_10px_rgba(194,65,12,0.35)]',
    label: 'BRONZE',
    gradient: 'from-amber-700 via-orange-600 to-amber-800',
    innerRing: 'border-orange-200',
    iconGlow: 'drop-shadow(0 0 3px rgba(194,65,12,0.4))'
  }
};

export const THINKING_DURATION = 60;
export const ANSWERING_DURATION = 300;
export const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
