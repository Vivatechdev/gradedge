export interface SelectorOption {
  id: string;
  label: string;
  description: string;
}

export interface SelectorQuestion {
  id: "stage" | "blocker" | "deadline";
  stepNumber: number;
  question: string;
  hint: string;
  options: SelectorOption[];
}

export interface RecommendationRule {
  stageId?: string;
  blockerId?: string;
  deadlineId?: string;
  recommendedSlug: string;
  reason: string;
}

export const SELECTOR_QUESTIONS: SelectorQuestion[] = [
  {
    id: "stage",
    stepNumber: 1,
    question: "Where are you currently situated in your research?",
    hint: "Select the stage that represents your immediate focus this month.",
    options: [
      {
        id: "proposal",
        label: "Topic & Proposal Stage",
        description: "Formulating research questions, writing the proposal, or preparing for proposal defense.",
      },
      {
        id: "literature",
        label: "Literature Review (Chapter 2)",
        description: "Synthesizing research, building conceptual frameworks, or organizing themes.",
      },
      {
        id: "methodology",
        label: "Research Design & Ethics",
        description: "Designing sampling strategies, drafting instruments, or submitting to IRB/ethics.",
      },
      {
        id: "analysis",
        label: "Data Collection & Analysis",
        description: "Working with statistical software (SPSS, R) or qualitative transcripts (NVivo).",
      },
      {
        id: "writing",
        label: "Chapter Writing & Revisions",
        description: "Drafting dissertation chapters, revising based on supervisor notes, or polishing prose.",
      },
      {
        id: "defense",
        label: "Oral Defense & Examination",
        description: "Preparing slides, practicing viva questioning, or converting thesis to journal papers.",
      },
    ],
  },
  {
    id: "blocker",
    stepNumber: 2,
    question: "What is currently presenting the primary bottleneck?",
    hint: "Choose the obstacle creating the most friction or delay.",
    options: [
      {
        id: "supervisor_feedback",
        label: "Unclear or Infrequent Supervisor Feedback",
        description: "Notes are brief, conflicting, or you wait months between chapter reviews.",
      },
      {
        id: "methods_software",
        label: "Statistical or Qualitative Software",
        description: "Struggling with syntax, assumption checks, coding schemes, or model output.",
      },
      {
        id: "writing_clarity",
        label: "Academic Writing Register & Structure",
        description: "Arguments feel descriptive, unidiomatic, or readers find your text dense.",
      },
      {
        id: "timeline_burnout",
        label: "Procrastination & Loss of Momentum",
        description: "Struggling with self-directed schedules, perfectionist paralysis, or isolation.",
      },
      {
        id: "integrity_overlap",
        label: "Similarity Report & Integrity Flags",
        description: "Need to interpret similarity strings and paraphrase source material ethically.",
      },
    ],
  },
  {
    id: "deadline",
    stepNumber: 3,
    question: "What is your target submission or defense timeframe?",
    hint: "This helps calibrate whether an intensive sprint or longitudinal pathway fits best.",
    options: [
      {
        id: "urgent",
        label: "Within 1 to 4 weeks",
        description: "Immediate deadline requiring fast diagnostic review and targeted intervention.",
      },
      {
        id: "medium",
        label: "1 to 3 months",
        description: "Active revision window for completing one or two core chapters.",
      },
      {
        id: "longitudinal",
        label: "3 to 9 months",
        description: "Substantial runway suited for full thesis mentoring or doctoral accelerator cohorts.",
      },
      {
        id: "exploratory",
        label: "Flexible / Over 9 months",
        description: "Early-stage planning or foundational skill-building.",
      },
    ],
  },
];

export const RECOMMENDATION_RULES: RecommendationRule[] = [
  // Stage = proposal
  {
    stageId: "proposal",
    recommendedSlug: "topic-proposal-development",
    reason: "Your immediate objective is to frame a defensible research question and establish scholarly feasibility before committee review.",
  },
  {
    stageId: "proposal",
    blockerId: "supervisor_feedback",
    recommendedSlug: "dissertation-thesis-mentoring",
    reason: "A dedicated mentor provides frequent, milestone-driven feedback between committee meetings to prevent months of proposal rework.",
  },

  // Stage = literature
  {
    stageId: "literature",
    recommendedSlug: "literature-review-support",
    reason: "Transforming descriptive summaries into a critical, thematic synthesis matrix is the core focus of this service.",
  },
  {
    stageId: "literature",
    blockerId: "integrity_overlap",
    recommendedSlug: "similarity-report-review",
    reason: "Addresses flagged literature strings directly, teaching conceptual multi-source paraphrasing without algorithmic flags.",
  },

  // Stage = methodology
  {
    stageId: "methodology",
    recommendedSlug: "research-design-ethics",
    reason: "Audits your sampling logic, instrumentation, and risk protocols to ensure immediate institutional ethics approval.",
  },

  // Stage = analysis
  {
    stageId: "analysis",
    blockerId: "methods_software",
    recommendedSlug: "quantitative-data-analysis",
    reason: "Hands-on statistical mentoring verifies parametric assumptions, audits your syntax, and structures APA results tables.",
  },
  {
    stageId: "analysis",
    recommendedSlug: "qualitative-data-analysis",
    reason: "Assists in structuring codebooks, establishing trustworthiness criteria, and conceptualizing thematic findings.",
  },

  // Blocker = methods_software
  {
    blockerId: "methods_software",
    deadlineId: "urgent",
    recommendedSlug: "statistical-software-intensive",
    reason: "A 1-on-1 screen-share intensive fixes coding syntax errors and executes model diagnostics directly on your dataset.",
  },

  // Blocker = writing_clarity
  {
    blockerId: "writing_clarity",
    recommendedSlug: "academic-editing-proofreading",
    reason: "Substantive line-level developmental editing improves sentence rhythm, eliminates ambiguity, and refines scholarly register.",
  },

  // Blocker = timeline_burnout
  {
    blockerId: "timeline_burnout",
    recommendedSlug: "research-productivity-coaching",
    reason: "De-escalates thesis overwhelm with bi-weekly milestone accountability, focus writing blocks, and custom semester roadmaps.",
  },

  // Stage = defense
  {
    stageId: "defense",
    recommendedSlug: "defense-presentation-coaching",
    reason: "Simulated mock viva examinations and slide audits prepare you to handle probing committee challenges with composure.",
  },
  {
    stageId: "defense",
    deadlineId: "longitudinal",
    recommendedSlug: "journal-article-conversion",
    reason: "Condenses your completed dissertation chapters into focused, high-impact peer-reviewed journal submissions.",
  },
];

export function computeRecommendations(
  stageId: string,
  blockerId: string,
  deadlineId: string
): Array<{ slug: string; reason: string }> {
  const matches: Array<{ slug: string; reason: string; priority: number }> = [];

  for (const rule of RECOMMENDATION_RULES) {
    let score = 0;
    if (rule.stageId && rule.stageId === stageId) score += 3;
    if (rule.blockerId && rule.blockerId === blockerId) score += 3;
    if (rule.deadlineId && rule.deadlineId === deadlineId) score += 2;

    // Must match at least two criteria if multiple are specified, or primary stage
    if (
      (rule.stageId && rule.blockerId && rule.stageId === stageId && rule.blockerId === blockerId) ||
      (rule.blockerId && rule.deadlineId && rule.blockerId === blockerId && rule.deadlineId === deadlineId) ||
      (rule.stageId === stageId && !rule.blockerId && !rule.deadlineId) ||
      (rule.blockerId === blockerId && !rule.stageId && !rule.deadlineId)
    ) {
      if (!matches.some((m) => m.slug === rule.recommendedSlug)) {
        matches.push({ slug: rule.recommendedSlug, reason: rule.reason, priority: score });
      }
    }
  }

  // Ensure default fallback if no exact rule triggered
  if (matches.length === 0) {
    matches.push({
      slug: "dissertation-thesis-mentoring",
      reason: "Our core mentoring program adapts to your specific chapter needs with customized written feedback and milestone calls.",
      priority: 1,
    });
  }

  // Return top 1 to 3 unique recommendations sorted by relevance
  return matches.sort((a, b) => b.priority - a.priority).slice(0, 3);
}

