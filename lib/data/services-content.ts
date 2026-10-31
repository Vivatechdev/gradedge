export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  typical_duration: string;
}

export interface SampleFeedback {
  title: string;
  manuscript_context: string;
  original_text: string;
  annotated_excerpt: string;
  mentor_marginal_note: string;
  actionable_takeaway: string;
  label: "Illustrative example";
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price_ngn: number;
  price_usd: number;
  rounds_of_feedback: string;
  turnaround: string;
  includes: string[];
  popular?: boolean;
}

export interface ServiceContentItem {
  slug: string;
  title: string;
  category: "dissertation-support" | "data-analysis" | "editing-and-writing-quality" | "publishing-and-career" | "coaching-and-training";
  category_name: string;
  two_sentence_promise: string;
  hero_image: string;
  hero_image_alt: string;
  hero_summary: string;
  // At-a-glance strip
  format_text: string;
  turnaround_text: string;
  best_for: string;
  starting_price_ngn: number;
  starting_price_usd: number;
  // Deep editorial content
  who_its_for: string[];
  signs_you_need_this: string[];
  outcomes: string[];
  deliverables: Array<{ title: string; description: string }>;
  process_steps: ProcessStep[];
  sample_feedback: SampleFeedback;
  software_tools: string[];
  what_we_wont_do: string[];
  faqs: ServiceFaq[];
  related_service_slugs: string[];
  related_post_slugs: string[];
  packages: ServicePackage[];
  seo: {
    meta_title: string;
    meta_description: string;
  };
}

export const CATEGORY_METADATA: Record<
  ServiceContentItem["category"],
  {
    name: string;
    description: string;
    image: string;
    image_alt: string;
  }
> = {
  "dissertation-support": {
    name: "Dissertation Support",
    description:
      "Structured, longitudinal developmental feedback across every stage of your thesis — from research questions and conceptual framework to full chapter drafts.",
    image: "/images/services/stage-writing.jpg",
    image_alt: "Academic research manuscripts with handwritten marginal annotations on a quiet study desk",
  },
  "data-analysis": {
    name: "Data Analysis",
    description:
      "Methodological and statistical guidance for quantitative, qualitative, and mixed-methods research. We audit assumptions, guide syntax execution, and teach output interpretation.",
    image: "/images/services/stage-research.jpg",
    image_alt: "Statistical analysis charts, open software syntax scripts, and econometric data notebooks",
  },
  "editing-and-writing-quality": {
    name: "Editing & Writing Quality",
    description:
      "Line-level developmental editing, referencing compliance, and academic style refinement. We strengthen argument structure and scholarly register while protecting your intellectual voice.",
    image: "/images/services/stage-writing.jpg",
    image_alt: "Close-up of academic thesis manuscript with line-level editorial marks and precision references",
  },
  "publishing-and-career": {
    name: "Publishing & Career",
    description:
      "Transform exhaustive dissertation chapters into competitive journal submissions, craft grant applications, and prepare responses to peer review.",
    image: "/images/services/stage-publishing.jpg",
    image_alt: "Peer-reviewed academic journals, accepted paper proofs, and grant application proposals",
  },
  "coaching-and-training": {
    name: "Coaching & Training",
    description:
      "One-on-one presentation practice for oral defenses and vivas, timeline management, and practical software intensives with experienced academic mentors.",
    image: "/images/services/stage-start.jpg",
    image_alt: "Academic seminar presentation room, defense slides, and one-on-one scholarly coaching notes",
  },
};

export const SERVICES_CONTENT: Record<string, ServiceContentItem> = {
  // ── CATEGORY 1: DISSERTATION SUPPORT ─────────────────────────────────────────
  "dissertation-thesis-mentoring": {
    slug: "dissertation-thesis-mentoring",
    title: "Dissertation & Thesis Mentoring",
    category: "dissertation-support",
    category_name: "Dissertation Support",
    two_sentence_promise:
      "Receive line-level developmental written feedback and one-on-one strategy calls through every chapter of your doctoral or master's thesis. We help you clarify arguments, structure empirical evidence, and defend your research with independent authority.",
    hero_image: "/images/services/stage-writing.jpg",
    hero_image_alt: "Open dissertation draft manuscript with mentor marginal notes beside a laptop",
    hero_summary:
      "Our flagship mentoring engagement pairs you with an experienced academic mentor who reviews your draft chapters in structured cycles. We do not write your thesis; we train you to think, write, and defend like an established scholar.",
    format_text: "Milestone written reviews + 1-on-1 strategy sessions",
    turnaround_text: "5 to 7 working days per chapter",
    best_for: "Doctoral & Master's candidates actively drafting chapters",
    starting_price_ngn: 250000,
    starting_price_usd: 175,
    who_its_for: [
      "PhD and Master's scholars who have an official supervisor but receive infrequent or overly brief feedback between semester meetings.",
      "Researchers facing repeated revision requests on chapter drafts without clear direction on how to satisfy committee demands.",
      "Scholars who feel isolated in their writing routine and need structured milestone accountability to finish on schedule.",
    ],
    signs_you_need_this: [
      "Your supervisor writes 'needs more critical synthesis' or 'argument unclear' without specifying which sections fall short.",
      "You have accumulated substantial empirical data but struggle to connect your findings back to your theoretical framework.",
      "You find yourself rewriting the same 15 pages for months without advancing to the next chapter.",
      "Your committee submission deadline is approaching and you need an objective academic audit before final sign-off.",
    ],
    outcomes: [
      "A coherent, theoretically grounded dissertation with strong logical continuity between chapters.",
      "Clear understanding of every methodological choice, analytical test, and interpretive nuance in your text.",
      "The intellectual confidence and vocabulary needed to defend your dissertation before an examination committee.",
    ],
    deliverables: [
      {
        title: "Annotated Chapter Manuscript",
        description: "Line-level marginal commentary evaluating argument progression, evidence synthesis, and academic register.",
      },
      {
        title: "Executive Revision Brief",
        description: "A structured 2- to 3-page diagnostic summary outlining primary structural issues, secondary refinements, and next steps.",
      },
      {
        title: "1-on-1 Video Strategy Consultation",
        description: "A recorded 60-minute session reviewing mentor annotations, addressing committee queries, and setting milestone targets.",
      },
      {
        title: "Follow-up Revision Verification",
        description: "A secondary review of your revised sections to confirm that all structural and methodological gaps have been resolved.",
      },
    ],
    process_steps: [
      {
        step: 1,
        title: "Intake & Project Scoping",
        description: "Submit your chapter draft, university formatting guidelines, research questions, and any recent supervisor feedback.",
        typical_duration: "Day 1",
      },
      {
        step: 2,
        title: "Line-Level Academic Audit",
        description: "Your assigned mentor conducts a rigorous read, annotating paragraph transitions, citation precision, and conceptual continuity.",
        typical_duration: "Days 2 to 5",
      },
      {
        step: 3,
        title: "Delivery & Strategy Consultation",
        description: "Receive your annotated file and executive brief, followed by a recorded 60-minute strategy call to agree on revisions.",
        typical_duration: "Days 6 to 7",
      },
      {
        step: 4,
        title: "Revision Implementation & Verification",
        description: "You execute the revisions using our action plan and submit your updated draft for final confirmation before supervisor submission.",
        typical_duration: "Days 8 to 14",
      },
    ],
    sample_feedback: {
      title: "Diagnostic Feedback on Chapter 4: Empirical Findings",
      manuscript_context: "PhD Dissertation in Public Administration, evaluating civil service decentralization reforms.",
      original_text: "The data shows that 68% of regional officers preferred autonomous decision-making. This proves that central oversight has failed.",
      annotated_excerpt: "The survey data indicate that 68% (n = 142) of regional administrators reported a preference for decentralized budgetary authority. However, this finding alone does not substantiate the claim that central oversight has failed; rather, it documents administrator preference under the 2021 statutory framework.",
      mentor_marginal_note: "Mentor note: Overclaiming causality. A descriptive preference metric cannot 'prove' institutional failure without comparative performance indicators. Rephrase cautiously to align with your empirical construct, and link directly to Ostrom's institutional analysis framework introduced on p. 42.",
      actionable_takeaway: "Separate raw participant perception data from structural institutional evaluation. Qualify all assertive verbs.",
      label: "Illustrative example",
    },
    software_tools: ["Microsoft Word Track Changes", "Google Docs Editorial Mode", "Mendeley / Zotero", "Grammarly Academic", "LaTeX / Overleaf"],
    what_we_wont_do: [
      "We will not write sentences, paragraphs, or entire chapters on your behalf under any circumstances.",
      "We will not generate synthetic datasets, fabricate interview transcripts, or manipulate empirical results.",
      "We will not communicate with your university supervisor or committee members on your behalf.",
      "We will not guarantee committee approval, grade outcomes, or defense exemptions.",
    ],
    faqs: [
      {
        question: "How does mentor matching work for this service?",
        answer: "We review your discipline, research paradigm (quantitative, qualitative, or mixed), and methodological focus. You are assigned a mentor with an advanced degree (PhD or verified terminal degree) in your specific field.",
      },
      {
        question: "Can I submit multiple chapters simultaneously?",
        answer: "We strongly advise reviewing chapters sequentially. Methodological or theoretical misalignments in Chapters 1 to 3 cascade into Chapters 4 and 5; fixing foundations first saves substantial revision time.",
      },
      {
        question: "What if my supervisor disagrees with a mentor recommendation?",
        answer: "Your supervisor holds ultimate institutional authority. Our role is to help you understand differing academic conventions, weigh supervisor preferences, and draft well-reasoned justifications for your choices.",
      },
    ],
    related_service_slugs: ["topic-proposal-development", "literature-review-support", "research-design-ethics"],
    related_post_slugs: ["how-to-structure-dissertation-chapters", "navigating-supervisor-feedback", "avoiding-methodological-drift"],
    packages: [
      {
        id: "mentoring-single-chapter",
        name: "Single Chapter Intensive",
        description: "Line-level diagnostic review of one draft chapter (up to 8,000 words) with written notes and a strategy call.",
        price_ngn: 250000,
        price_usd: 175,
        rounds_of_feedback: "1 full round + 1 verification check",
        turnaround: "5 working days",
        includes: [
          "Line-level Track Changes annotations",
          "Executive Revision Brief (2-3 pages)",
          "60-minute 1-on-1 strategy video consultation",
          "Follow-up verification review of revised text",
        ],
      },
      {
        id: "mentoring-three-chapters",
        name: "Three-Chapter Core Pathway",
        description: "Milestone guidance covering your proposal or core chapters (Introduction, Literature Review, Methodology).",
        price_ngn: 650000,
        price_usd: 450,
        rounds_of_feedback: "3 sequential rounds + verification checks",
        turnaround: "14 working days total",
        popular: true,
        includes: [
          "Sequential review of three draft chapters (up to 25,000 words total)",
          "Three 60-minute 1-on-1 video consultations",
          "Cross-chapter argument coherence audit",
          "Supervisor feedback response navigation",
          "Dedicated mentor email access between cycles",
        ],
      },
      {
        id: "mentoring-full-dissertation",
        name: "Full Dissertation Mentorship",
        description: "Complete developmental guidance across all five dissertation chapters through final pre-defense sign-off.",
        price_ngn: 1350000,
        price_usd: 950,
        rounds_of_feedback: "5 chapter rounds + pre-defense final audit",
        turnaround: "Covers entire 3 to 6 month milestone cycle",
        includes: [
          "Line-level review of all chapters (up to 65,000 words)",
          "Six 60-minute strategy consultations",
          "Comprehensive methodology and findings alignment audit",
          "Pre-submission committee readiness review",
          "Mock viva / defense oral preparation session",
        ],
      },
    ],
    seo: {
      meta_title: "Dissertation & Thesis Mentoring — Structured Feedback for Graduate Scholars",
      meta_description:
        "One-on-one academic mentoring and developmental chapter feedback for PhD and Master's candidates. Structured feedback cycles, argument clarity, and defense readiness.",
    },
  },

  "topic-proposal-development": {
    slug: "topic-proposal-development",
    title: "Topic & Proposal Development",
    category: "dissertation-support",
    category_name: "Dissertation Support",
    two_sentence_promise:
      "Transform broad intellectual interests into a well-bounded, defensible research question and an institutionally compliant dissertation proposal. We evaluate theoretical feasibility, empirical access, and methodological alignment before you submit to your committee.",
    hero_image: "/images/services/stage-start.jpg",
    hero_image_alt: "Academic research proposal outline with conceptual frameworks and literature cards",
    hero_summary:
      "A failed dissertation proposal costs an average of two semesters in administrative delays. We work with you to demarcate your problem statement, articulate your scholarly contribution, and craft a proposal your committee can approve with confidence.",
    format_text: "Written diagnostic audit + 2 strategy consultations",
    turnaround_text: "4 to 6 working days",
    best_for: "Incoming doctoral scholars & Master's students preparing proposal defense",
    starting_price_ngn: 180000,
    starting_price_usd: 125,
    who_its_for: [
      "Scholars with extensive general ideas who need assistance framing testable, bounded research questions.",
      "Researchers whose initial proposal was returned by a departmental review committee for significant rework.",
      "Candidates preparing competitive doctoral admissions or scholarship research proposals.",
    ],
    signs_you_need_this: [
      "Your working title is more than 30 words long and attempts to investigate three separate phenomena at once.",
      "You cannot yet state in two clear sentences what theoretical gap your research addresses.",
      "Your committee commented that your proposed methodology is detached from your research questions.",
      "You are unsure whether required empirical data or archival sources are practically accessible.",
    ],
    outcomes: [
      "A clearly stated problem statement with compelling scholarly justification.",
      "Mutually reinforcing research questions, theoretical lenses, and candidate methodologies.",
      "A defensible proposal document that satisfies faculty standards and ethics prerequisites.",
    ],
    deliverables: [
      {
        title: "Proposal Feasibility & Scope Diagnostic",
        description: "An evaluation of your proposed scope, data access feasibility, and timeline realism.",
      },
      {
        title: "Research Questions Refinement Matrix",
        description: "A tabular mapping aligning primary research questions with operational sub-questions, data sources, and analytical tools.",
      },
      {
        title: "Line-Level Proposal Annotation",
        description: "Thorough review of your draft proposal (up to 6,000 words) for structural coherence and scholarly tone.",
      },
      {
        title: "Committee Defense Talking Points",
        description: "A structured outline of potential committee critiques and reasoned academic justifications.",
      },
    ],
    process_steps: [
      {
        step: 1,
        title: "Interest & Literature Mapping",
        description: "Review current topic notes, target degree requirements, and key seminal papers in your area.",
        typical_duration: "Days 1 to 2",
      },
      {
        step: 2,
        title: "Research Question Formulation Call",
        description: "A 60-minute recorded session sharpening research questions and identifying the theoretical contribution.",
        typical_duration: "Day 3",
      },
      {
        step: 3,
        title: "Draft Proposal Written Audit",
        description: "Detailed line-level commentary on your draft proposal sections with alignment checks.",
        typical_duration: "Days 4 to 5",
      },
      {
        step: 4,
        title: "Committee Readiness Sign-off",
        description: "Final review of your revisions and delivery of committee defense defense notes.",
        typical_duration: "Day 6",
      },
    ],
    sample_feedback: {
      title: "Proposal Feasibility Audit: Environmental Economics",
      manuscript_context: "Doctoral Dissertation Proposal investigating renewable energy adoption across emerging markets.",
      original_text: "This study will analyze how global climate policies impact corporate governance, fiscal policies, and GDP growth in 54 African countries from 1990 to 2025.",
      annotated_excerpt: "This study investigates the effect of national renewable energy adoption policies on clean-tech capital expenditure among publicly traded manufacturing firms in Ghana, Nigeria, and Kenya (2012–2024).",
      mentor_marginal_note: "Mentor note: Scope is far too vast for a single doctoral study. Analyzing three distinct macro-variables across 54 heterogenous economies will lead to descriptive superficiality. Restrict your geographic scope to three comparable economies with verified firm-level panel data, and specify clean-tech capex as your bounded outcome metric.",
      actionable_takeaway: "Narrow geographical and variable scope to guarantee depth and empirical feasibility.",
      label: "Illustrative example",
    },
    software_tools: ["Zotero", "Mendeley", "Conceptual Mapping Tools", "Microsoft Word", "Google Docs"],
    what_we_wont_do: [
      "We will not write your research proposal or choose your topic for you.",
      "We will not invent hypothetical hypotheses or fabricate pilot study results.",
      "We will not guarantee institutional acceptance or scholarship award decisions.",
    ],
    faqs: [
      {
        question: "Can I bring a topic that has already been rejected by my committee?",
        answer: "Yes. Many of our scholars come to us after an initial rejection. We examine the committee's written objections and help you redesign the proposal to address every specific concern.",
      },
      {
        question: "How long should a dissertation proposal typically be?",
        answer: "Requirements vary by institution and discipline, usually ranging from 15 to 35 pages (5,000 to 12,000 words). We adapt our guidance to your university's explicit formatting template.",
      },
    ],
    related_service_slugs: ["dissertation-thesis-mentoring", "literature-review-support", "research-design-ethics"],
    related_post_slugs: ["framing-a-defensible-research-question", "why-dissertation-proposals-get-rejected"],
    packages: [
      {
        id: "proposal-starter",
        name: "Topic Scoping & Research Questions",
        description: "Refinement of your research problem, question hierarchy, and feasibility assessment.",
        price_ngn: 180000,
        price_usd: 125,
        rounds_of_feedback: "1 review + 1 60-min call",
        turnaround: "4 working days",
        includes: ["Problem statement critique", "Research questions alignment matrix", "60-minute scoping consultation"],
      },
      {
        id: "proposal-complete",
        name: "Full Proposal Milestone Review",
        description: "Comprehensive line-level audit of your complete draft proposal before formal committee defense.",
        price_ngn: 380000,
        price_usd: 260,
        rounds_of_feedback: "2 iterative reviews + 2 strategy calls",
        turnaround: "8 working days",
        popular: true,
        includes: [
          "Full proposal review (up to 12,000 words)",
          "Two 60-minute strategy consultations",
          "Theoretical gap and methods alignment audit",
          "Committee defense anticipation briefing",
        ],
      },
    ],
    seo: {
      meta_title: "Dissertation Topic & Proposal Development — Academic Mentoring",
      meta_description:
        "Refine your research questions, bound your problem statement, and craft an institutionally viable dissertation proposal with expert academic mentoring.",
    },
  },

  "literature-review-support": {
    slug: "literature-review-support",
    title: "Literature Review Support",
    category: "dissertation-support",
    category_name: "Dissertation Support",
    two_sentence_promise:
      "Synthesize complex scholarly debates, identify verified empirical gaps, and build a cohesive theoretical framework. We train you to move beyond descriptive book reports into critical, thematic academic argumentation.",
    hero_image: "/images/services/stage-writing.jpg",
    hero_image_alt: "Scholarly synthesis matrix table with highlighted peer-reviewed academic papers",
    hero_summary:
      "A weak literature review simply summarizes papers one by one ('Smith said X, then Jones said Y'). We guide you in constructing thematic synthesis matrices that pit opposing perspectives against each other to demonstrate why your study is necessary.",
    format_text: "Written chapter critique + synthesis matrix review",
    turnaround_text: "5 to 7 working days",
    best_for: "Scholars struggling with chapter 2 structure or systematic reviews",
    starting_price_ngn: 200000,
    starting_price_usd: 140,
    who_its_for: [
      "Researchers with hundreds of downloaded PDFs who struggle to synthesize them into a logical, thematic narrative.",
      "Scholars whose supervisors comment that their review reads like an annotated bibliography rather than a critical synthesis.",
      "Graduate students conducting PRISMA-compliant systematic or scoping reviews.",
    ],
    signs_you_need_this: [
      "Every paragraph in your draft begins with an author's name rather than a conceptual theme.",
      "You cannot articulate how your conceptual framework links directly to your methodology.",
      "You are unsure how to synthesize literature from distinct disciplines without confusing definitions.",
      "Your citations are dated and your supervisor asks for recent empirical scholarship (last 3-5 years).",
    ],
    outcomes: [
      "A thematic literature review chapter structured around scholarly debates rather than isolated studies.",
      "A clearly justified conceptual or theoretical framework that anchors your investigation.",
      "Demonstrable mastery over seminal and contemporary scholarship in your sub-field.",
    ],
    deliverables: [
      {
        title: "Thematic Synthesis Matrix Review",
        description: "Critique of your literature extraction matrix ensuring proper grouping of authors by empirical stance.",
      },
      {
        title: "Line-Level Chapter 2 Annotation",
        description: "Detailed commentary on paragraph transitions, critical voice balance, and empirical gap justification.",
      },
      {
        title: "Conceptual Framework Diagnostic",
        description: "A diagrammatic and narrative audit checking that every construct in your framework is accounted for in your review.",
      },
      {
        title: "60-Minute Synthesis Strategy Session",
        description: "Live review of structural bottlenecks and techniques for resolving conflicting scholarship.",
      },
    ],
    process_steps: [
      {
        step: 1,
        title: "Matrix & Chapter Ingestion",
        description: "Submit your draft literature review chapter, synthesis matrix, and list of core foundational papers.",
        typical_duration: "Day 1",
      },
      {
        step: 2,
        title: "Thematic & Critical Evaluation",
        description: "Mentor examines whether synthesis is genuinely critical or merely descriptive, noting structural weaknesses.",
        typical_duration: "Days 2 to 4",
      },
      {
        step: 3,
        title: "Strategy Video Call",
        description: "Review annotated chapter sections and walk through matrix reorganization together.",
        typical_duration: "Day 5",
      },
      {
        step: 4,
        title: "Revision & Final Check",
        description: "You rewrite identified passages and receive a secondary check on paragraph transitions.",
        typical_duration: "Days 6 to 7",
      },
    ],
    sample_feedback: {
      title: "Literature Review Diagnostic: Health Systems Research",
      manuscript_context: "Chapter 2 draft evaluating telemedicine uptake in rural clinics.",
      original_text: "Smith (2018) studied rural clinics and found bandwidth was low. Johnson (2020) also studied telemedicine and noted staff shortages. Williams (2022) found patient resistance.",
      annotated_excerpt: "Technological infrastructural deficits — particularly inconsistent rural broadband bandwidth — constitute a primary constraint on clinical adoption (Smith, 2018; Chen, 2021). However, infrastructural availability alone fails to predict uptake when workforce training is deficient (Johnson, 2020). Recent empirical evidence suggests that organizational resistance is compounded when clinical workflows are disrupted without prior staff consultation (Williams, 2022).",
      mentor_marginal_note: "Mentor note: Replaced serial author listing with a synthetic, thematic topic sentence. Group complementary and contrasting findings under the overarching conceptual barrier rather than cataloging authors one by one.",
      actionable_takeaway: "Lead with the conceptual argument, then group multiple citations as evidence for that claim.",
      label: "Illustrative example",
    },
    software_tools: ["Zotero", "Mendeley", "Rayyan (Systematic Reviews)", "NVivo for Literature", "Excel Synthesis Matrices"],
    what_we_wont_do: [
      "We will not search for and download papers on your behalf without your involvement.",
      "We will not write your literature review or generate synthetic summaries.",
      "We will not invent citations or fabricate quotes from scholarly sources.",
    ],
    faqs: [
      {
        question: "Can you help if I am conducting a systematic or scoping review?",
        answer: "Yes. We support scholars following PRISMA guidelines, helping evaluate search strings, inclusion/exclusion criteria documentation, and risk-of-bias assessment tables.",
      },
    ],
    related_service_slugs: ["dissertation-thesis-mentoring", "topic-proposal-development", "academic-editing-proofreading"],
    related_post_slugs: ["writing-a-critical-literature-review", "organizing-a-synthesis-matrix"],
    packages: [
      {
        id: "lit-review-single",
        name: "Chapter 2 Diagnostic Review",
        description: "In-depth review of one draft literature review chapter (up to 10,000 words) with written notes and a call.",
        price_ngn: 200000,
        price_usd: 140,
        rounds_of_feedback: "1 full round + 1 verification check",
        turnaround: "5 working days",
        includes: ["Line-level Track Changes review", "Synthesis matrix evaluation", "60-minute strategy call", "Verification of revisions"],
      },
    ],
    seo: {
      meta_title: "Literature Review Support & Critical Synthesis — GradEdge",
      meta_description:
        "Master the craft of critical literature synthesis. Structure thematic reviews, build conceptual frameworks, and eliminate descriptive summaries with academic mentoring.",
    },
  },

  "research-design-ethics": {
    slug: "research-design-ethics",
    title: "Research Design & Ethics Approval Support",
    category: "dissertation-support",
    category_name: "Dissertation Support",
    two_sentence_promise:
      "Audit your methodological paradigm, sampling strategy, data collection instruments, and IRB/ethics protocol before institutional submission. We ensure your research design is methodologically sound and fully defensible.",
    hero_image: "/images/services/stage-research.jpg",
    hero_image_alt: "Methodological framework blueprint and institutional ethics review documentation",
    hero_summary:
      "Methodological ambiguity and ethics committee rejections can stall research by six months or more. We review your participant consent forms, risk mitigation protocols, and measurement instruments to guarantee institutional compliance and academic rigor.",
    format_text: "Methodological audit + ethics documentation review",
    turnaround_text: "4 to 6 working days",
    best_for: "Candidates finalizing Chapter 3 or submitting ethics/IRB applications",
    starting_price_ngn: 220000,
    starting_price_usd: 150,
    who_its_for: [
      "Researchers formulating quantitative, qualitative, or mixed-methods research designs.",
      "Scholars whose institutional ethics/IRB application received requests for major revisions or risk clarifications.",
      "Students working with vulnerable populations or sensitive personal data requiring strict privacy safeguards.",
    ],
    signs_you_need_this: [
      "You struggle to justify your ontological and epistemological stance in Chapter 3.",
      "Your sample size calculation or sampling technique lacks formal methodological justification.",
      "Your ethics board asked for detailed data de-identification, encryption, and destruction protocols.",
      "Your survey or interview guide has not been evaluated for construct validity or pilot testing.",
    ],
    outcomes: [
      "A watertight Chapter 3 (Methodology) with explicit philosophical and practical justification.",
      "Institutional ethics application ready for submission with compliant consent and risk protocols.",
      "Validated data collection instruments aligned directly with your research questions.",
    ],
    deliverables: [
      {
        title: "Methodological Alignment Audit",
        description: "Systematic check that questions, data sources, sampling methods, and analytical plans correspond perfectly.",
      },
      {
        title: "Ethics Application & Protocol Review",
        description: "Line-level critique of participant information sheets, consent forms, and data governance plans.",
      },
      {
        title: "Instrumentation Validity Critique",
        description: "Evaluation of survey questions, interview schedules, or observational rubrics for methodological validity.",
      },
      {
        title: "60-Minute Defense Preparation Consultation",
        description: "Walkthrough of methodological defense arguments to satisfy faculty committee questioning.",
      },
    ],
    process_steps: [
      {
        step: 1,
        title: "Protocol & Instrument Submission",
        description: "Submit Chapter 3 draft, institutional ethics guidelines, participant recruitment plans, and instruments.",
        typical_duration: "Day 1",
      },
      {
        step: 2,
        title: "Methodological & Ethics Review",
        description: "Your mentor evaluates sampling power, ethical risks, privacy compliance, and paradigm coherence.",
        typical_duration: "Days 2 to 4",
      },
      {
        step: 3,
        title: "Consultation & Revisions",
        description: "60-minute recorded session discussing protocol adjustments and response strategies for ethics committee queries.",
        typical_duration: "Day 5",
      },
    ],
    sample_feedback: {
      title: "Ethics Protocol Review: Educational Research with Minors",
      manuscript_context: "Doctoral dissertation investigating digital learning interventions in secondary schools.",
      original_text: "Students will complete the online assessment during class time. Consent is assumed through school enrollment.",
      annotated_excerpt: "Dual-tier consent protocols are required: active written parental/guardian consent forms must precede participant assent. Furthermore, participating students (ages 14–16) must receive an age-appropriate assent document detailing their right to withdraw without educational penalty.",
      mentor_marginal_note: "Mentor note: Passive consent violates both institutional IRB standards and statutory minor protection laws in your jurisdiction. Revise to establish explicit active consent procedures, and include data anonymization at the point of digital capture.",
      actionable_takeaway: "Incorporate dual-tier parental consent and minor assent with explicit withdrawal clauses.",
      label: "Illustrative example",
    },
    software_tools: ["Qualtrics", "SurveyMonkey", "Microsoft Forms", "G*Power (Power Analysis)", "RedCap"],
    what_we_wont_do: [
      "We will not recruit research participants or distribute survey instruments for you.",
      "We will not sign ethics forms as primary investigators.",
      "We will not fabricate pilot test data or simulate participant responses.",
    ],
    faqs: [
      {
        question: "Can you help respond to an ethics committee conditional rejection?",
        answer: "Yes. We help you interpret the committee's specific stipulations and draft a point-by-point response memo accompanied by updated protocol documentation.",
      },
    ],
    related_service_slugs: ["dissertation-thesis-mentoring", "quantitative-data-analysis", "qualitative-data-analysis"],
    related_post_slugs: ["calculating-sample-size-g-power", "navigating-irb-ethics-approval"],
    packages: [
      {
        id: "design-ethics-standard",
        name: "Methodology & Ethics Audit",
        description: "Comprehensive review of Chapter 3 and your institutional ethics protocol.",
        price_ngn: 220000,
        price_usd: 150,
        rounds_of_feedback: "1 thorough audit + 1 call",
        turnaround: "5 working days",
        includes: ["Chapter 3 line-level review", "Ethics protocol compliance check", "Instrument validity audit", "60-minute strategy call"],
      },
    ],
    seo: {
      meta_title: "Research Design & Ethics Approval Support — GradEdge",
      meta_description:
        "Ensure your dissertation methodology and IRB ethics application are rigorous, compliant, and defensible with specialized academic mentoring.",
    },
  },

  // ── CATEGORY 2: DATA ANALYSIS ───────────────────────────────────────────────
  "quantitative-data-analysis": {
    slug: "quantitative-data-analysis",
    title: "Quantitative Data Analysis (SPSS, R, Python, Stata)",
    category: "data-analysis",
    category_name: "Data Analysis",
    two_sentence_promise:
      "Master statistical testing, assumption verification, regression modeling, and APA-compliant results presentation. We audit your syntax scripts and teach you how to interpret every coefficient and p-value with total confidence.",
    hero_image: "/images/services/stage-research.jpg",
    hero_image_alt: "Statistical programming code editor in R and SPSS regression output tables on monitor",
    hero_summary:
      "Running statistical code without understanding the underlying mathematical assumptions leaves you vulnerable in your defense. We provide hands-on mentoring in SPSS, R, Python, and Stata so you understand exactly what your data reveals.",
    format_text: "Syntax audit + live 1-on-1 analytical coaching",
    turnaround_text: "5 to 7 working days",
    best_for: "Researchers with collected quantitative data preparing Chapter 4",
    starting_price_ngn: 300000,
    starting_price_usd: 210,
    who_its_for: [
      "Scholars who have collected numerical data and need guidance selecting and executing inferential statistical tests.",
      "Researchers who generated statistical output but struggle to interpret coefficients, interaction terms, or effect sizes.",
      "Candidates who need their statistical syntax audited for assumption violations (normality, homoscedasticity, multicollinearity).",
    ],
    signs_you_need_this: [
      "You ran a linear regression but failed to test for multicollinearity (VIF) or residual normality.",
      "Your p-values are non-significant and you are unsure how to report null findings with scholarly integrity.",
      "Your supervisor asked for effect sizes (Cohen's d, eta-squared) and confidence intervals that you have not computed.",
      "You are terrified that your defense committee will ask you to explain the mathematical difference between your models.",
    ],
    outcomes: [
      "Verified, reproducible statistical syntax in R, SPSS, Stata, or Python.",
      "APA 7-compliant results tables and high-resolution figures.",
      "Deep conceptual understanding of your statistical tests, enabling an authoritative oral defense.",
    ],
    deliverables: [
      {
        title: "Syntax & Script Audit Report",
        description: "Thorough review of your analytical script checking data cleaning routines, recoding, and model specifications.",
      },
      {
        title: "Assumption Testing Verification Brief",
        description: "Diagnostic documentation of normality, linearity, homoscedasticity, and multicollinearity metrics.",
      },
      {
        title: "APA 7 Results Tables & Visualizations",
        description: "Publication-grade tables formatted to current APA standards ready for your findings chapter.",
      },
      {
        title: "Two 60-Minute Analytical Coaching Calls",
        description: "Screen-share walkthroughs interpreting output tables, coefficient magnitudes, and defense talking points.",
      },
    ],
    process_steps: [
      {
        step: 1,
        title: "Data & Code Ingestion",
        description: "Submit your de-identified dataset, analysis plan, research hypotheses, and existing syntax scripts.",
        typical_duration: "Day 1",
      },
      {
        step: 2,
        title: "Diagnostic Assumption Audit",
        description: "Your quantitative mentor runs diagnostic tests to evaluate model suitability and parametric assumptions.",
        typical_duration: "Days 2 to 4",
      },
      {
        step: 3,
        title: "Interactive Analysis Session",
        description: "A 60-minute screen-share walking through script execution, error handling, and parameter interpretation.",
        typical_duration: "Day 5",
      },
      {
        step: 4,
        title: "Results Review & Interpretation Check",
        description: "You draft your findings narrative and receive line-level feedback on statistical accuracy.",
        typical_duration: "Days 6 to 7",
      },
    ],
    sample_feedback: {
      title: "Statistical Syntax & Findings Review: Organizational Psychology",
      manuscript_context: "Hierarchical multiple regression examining employee burnout predictors.",
      original_text: "Table 4 shows the regression was significant (p < 0.05). Therefore, workload causes burnout.",
      annotated_excerpt: "Hierarchical multiple regression revealed that workload accounted for a statistically significant proportion of variance in emotional exhaustion above demographic controls, ΔR² = .14, F(3, 214) = 11.42, p < .001, 95% CI [.18, .44], with a moderate effect size (f² = .16).",
      mentor_marginal_note: "Mentor note: Cross-sectional survey data cannot prove causality; replace 'causes' with 'accounts for variance in'. Additionally, provide exact F-statistics, degrees of freedom, effect sizes, and confidence intervals per APA 7 guidelines.",
      actionable_takeaway: "Report exact inferential metrics (F, df, p, 95% CI) and avoid claiming causal relationships from correlational data.",
      label: "Illustrative example",
    },
    software_tools: ["R / RStudio", "IBM SPSS Statistics", "Stata", "Python (pandas, statsmodels, scipy)", "JASP / Jamovi"],
    what_we_wont_do: [
      "We will not manipulate data, delete outliers without justification, or p-hack to force statistical significance.",
      "We will not fabricate datasets or generate synthetic participant responses.",
      "We will not write your empirical discussion chapter for you.",
    ],
    faqs: [
      {
        question: "Do I need to share my raw data with you?",
        answer: "You share an anonymized/de-identified dataset stripped of participant names, email addresses, and identifiable characteristics. We sign non-disclosure agreements prior to file transfer.",
      },
      {
        question: "What if my findings do not support my original hypotheses?",
        answer: "Null findings are standard and valuable in rigorous scientific inquiry. We teach you how to report non-significant findings transparently, discuss theoretical implications, and defend your work with confidence.",
      },
    ],
    related_service_slugs: ["structural-equation-modeling", "mixed-methods-research-design", "research-design-ethics"],
    related_post_slugs: ["reporting-apa-7-regression-tables", "checking-parametric-assumptions", "what-to-do-when-hypotheses-fail"],
    packages: [
      {
        id: "quant-model-audit",
        name: "Model Specification & Syntax Review",
        description: "Review of statistical hypotheses, variable recoding, and analysis syntax in SPSS, R, or Stata.",
        price_ngn: 300000,
        price_usd: 210,
        rounds_of_feedback: "1 code audit + 1 60-min call",
        turnaround: "5 working days",
        includes: ["Data cleaning review", "Syntax verification", "Assumption check audit", "60-minute strategy call"],
      },
      {
        id: "quant-complete-analysis",
        name: "Full Statistical Mentorship & Results Structuring",
        description: "End-to-end guidance from assumption testing to complete APA 7 results chapter review.",
        price_ngn: 600000,
        price_usd: 420,
        rounds_of_feedback: "2 comprehensive rounds + 2 strategy calls",
        turnaround: "10 working days",
        popular: true,
        includes: [
          "Complete dataset verification & assumption diagnostics",
          "Reproducible syntax scripts with detailed comments",
          "APA 7-compliant results tables and charts",
          "Two 60-minute video coaching sessions",
          "Line-level feedback on draft Chapter 4 results text",
        ],
      },
    ],
    seo: {
      meta_title: "Quantitative Data Analysis Mentoring (SPSS, R, Stata, Python) — GradEdge",
      meta_description:
        "Master dissertation statistics with academic quantitative mentoring. We audit syntax, verify assumptions, format APA results tables, and prepare you for your oral defense.",
    },
  },

  "qualitative-data-analysis": {
    slug: "qualitative-data-analysis",
    title: "Qualitative Data Analysis (NVivo, ATLAS.ti)",
    category: "data-analysis",
    category_name: "Data Analysis",
    two_sentence_promise:
      "Construct defensible coding hierarchies, conduct reflexive thematic analysis, and extract compelling qualitative evidence. We mentor you in NVivo and ATLAS.ti, ensuring your qualitative findings are conceptual, rigorous, and audit-ready.",
    hero_image: "/images/services/stage-research.jpg",
    hero_image_alt: "Qualitative coding tree diagram in NVivo and interview transcript annotations",
    hero_summary:
      "Qualitative research often falters when transcripts are treated descriptively rather than analytically. We teach you how to develop codebooks, maintain reflexive audit trails, and synthesize themes that address your research questions with philosophical depth.",
    format_text: "Coding hierarchy audit + NVivo/ATLAS.ti mentoring call",
    turnaround_text: "5 to 7 working days",
    best_for: "Researchers working with interview, focus group, or textual data",
    starting_price_ngn: 280000,
    starting_price_usd: 195,
    who_its_for: [
      "Scholars conducting reflexive thematic analysis, grounded theory, or phenomenological inquiry.",
      "Researchers overwhelmed by hundreds of pages of transcripts who need assistance building a coherent codebook.",
      "Students using NVivo or ATLAS.ti who need technical mentoring in nodes, cases, and thematic matrices.",
    ],
    signs_you_need_this: [
      "Your codebook has 300 isolated codes and you cannot explain how they group into overarching themes.",
      "Your supervisor notes that your findings read like summary quotes without analytical interpretation.",
      "You are unsure how to demonstrate qualitative rigor, trustworthiness, and audit trails (Lincoln & Guba criteria).",
      "You struggle to distinguish between inductive and deductive coding approaches in your methodology.",
    ],
    outcomes: [
      "A structured, hierarchical codebook with clear operational definitions and exemplar quotes.",
      "Methodologically justified thematic findings chapter with rich contextual analysis.",
      "Documented qualitative audit trail demonstrating trustworthiness and reflexivity.",
    ],
    deliverables: [
      {
        title: "Codebook & Thematic Hierarchy Audit",
        description: "Evaluation of candidate codes, parent-child nodes, and thematic boundaries for conceptual distinction.",
      },
      {
        title: "Trustworthiness & Rigor Protocol",
        description: "Guidance documenting credibility, transferability, dependability, and confirmability in Chapter 4.",
      },
      {
        title: "Findings Chapter Narrative Review",
        description: "Line-level critique balancing participant voice with authorial analytical interpretation.",
      },
      {
        title: "60-Minute Qualitative Coaching Call",
        description: "Interactive session reviewing thematic maps, software queries, and committee defense arguments.",
      },
    ],
    process_steps: [
      {
        step: 1,
        title: "Transcript & Codebook Ingestion",
        description: "Submit sample de-identified transcripts, current coding scheme, and qualitative research questions.",
        typical_duration: "Day 1",
      },
      {
        step: 2,
        title: "Thematic & Conceptual Review",
        description: "Mentor analyzes code consistency, conceptual depth, and alignment with your stated philosophical paradigm.",
        typical_duration: "Days 2 to 4",
      },
      {
        step: 3,
        title: "Interactive Coding Workshop",
        description: "60-minute video session reviewing coding trees, resolving overlap, and structuring theme narratives.",
        typical_duration: "Day 5",
      },
    ],
    sample_feedback: {
      title: "Qualitative Codebook Audit: Nursing Leadership Study",
      manuscript_context: "Thematic analysis of semi-structured interviews with 24 clinical nurse managers.",
      original_text: "Theme 1: Staff are tired. Participant 4 said: 'We are working 14-hour shifts without breaks.' Participant 8 also said they were tired.",
      annotated_excerpt: "Theme 1: Cumulative Physical Depletion and Institutional Disenfranchisement. Participants consistently linked relentless staffing deficits not merely to physical fatigue, but to an erosion of professional efficacy: 'We are working 14-hour shifts without breaks...' (P4, Medical-Surgical).",
      mentor_marginal_note: "Mentor note: Move beyond semantic labels ('Staff are tired') to latent, conceptual themes that capture the broader systemic dynamic. Integrate reflexive interpretation directly after every block quote.",
      actionable_takeaway: "Elevate descriptive codes into conceptual themes that address systemic research questions.",
      label: "Illustrative example",
    },
    software_tools: ["NVivo", "ATLAS.ti", "MAXQDA", "Dedoose", "Transana"],
    what_we_wont_do: [
      "We will not code your transcripts on your behalf without your active intellectual involvement.",
      "We will not fabricate qualitative interviews or alter participant quotes.",
      "We will not write your qualitative findings chapter.",
    ],
    faqs: [
      {
        question: "Can you help me set up NVivo project structures?",
        answer: "Yes. We show you how to import transcripts, set up case classifications and attributes, organize codes into hierarchical folders, and run matrix coding queries.",
      },
    ],
    related_service_slugs: ["quantitative-data-analysis", "mixed-methods-research-design", "dissertation-thesis-mentoring"],
    related_post_slugs: ["thematic-analysis-step-by-step", "establishing-qualitative-trustworthiness"],
    packages: [
      {
        id: "qual-codebook-audit",
        name: "Codebook & Thematic Review",
        description: "Diagnostic review of your qualitative coding tree, theme hierarchy, and sample transcripts.",
        price_ngn: 280000,
        price_usd: 195,
        rounds_of_feedback: "1 codebook audit + 1 call",
        turnaround: "5 working days",
        includes: ["Codebook hierarchy critique", "Thematic map evaluation", "60-minute coaching session"],
      },
    ],
    seo: {
      meta_title: "Qualitative Data Analysis Mentoring (NVivo, ATLAS.ti) — GradEdge",
      meta_description:
        "Master qualitative coding and thematic analysis with specialized academic coaching. Build defensible codebooks and present rich empirical findings.",
    },
  },

  "structural-equation-modeling": {
    slug: "structural-equation-modeling",
    title: "Structural Equation Modeling (SmartPLS, AMOS)",
    category: "data-analysis",
    category_name: "Data Analysis",
    two_sentence_promise:
      "Design and validate complex measurement and structural path models using PLS-SEM or CB-SEM. We guide you through indicator reliability, convergent and discriminant validity (HTMT), and multi-group mediation/moderation analysis.",
    hero_image: "/images/services/stage-research.jpg",
    hero_image_alt: "Structural equation model path diagram in SmartPLS with latent constructs and regression coefficients",
    hero_summary:
      "Structural Equation Modeling requires rigorous two-stage evaluation: first confirming your measurement model, then testing structural paths. We teach you how to satisfy reporting standards in AMOS and SmartPLS with complete mathematical justification.",
    format_text: "Model specification audit + live SEM coaching session",
    turnaround_text: "5 to 7 working days",
    best_for: "Researchers testing complex multi-construct hypotheses and mediation models",
    starting_price_ngn: 350000,
    starting_price_usd: 245,
    who_its_for: [
      "Doctoral scholars using PLS-SEM (SmartPLS) or CB-SEM (AMOS / lavaan) for survey-based investigations.",
      "Researchers testing multi-stage mediation, moderated mediation, or second-order reflective-formative constructs.",
      "Candidates whose discriminant validity criteria (Fornell-Larcker, HTMT) are failing diagnostic thresholds.",
    ],
    signs_you_need_this: [
      "Your model fit indices in AMOS (CFI, TLI, RMSEA) do not meet established cut-off criteria.",
      "You have cross-loading indicators and are unsure whether deleting items threatens construct validity.",
      "You cannot explain to your committee why you chose PLS-SEM over covariance-based SEM.",
      "You struggle to compute and report bootstrapping confidence intervals for indirect mediation effects.",
    ],
    outcomes: [
      "A fully verified, methodologically justified SEM model in SmartPLS, AMOS, or R lavaan.",
      "Complete measurement model evaluation tables (Cronbach's alpha, CR, AVE, HTMT matrix).",
      "Defensible structural hypothesis testing results ready for your dissertation findings chapter.",
    ],
    deliverables: [
      {
        title: "SEM Model Diagnostic Brief",
        description: "Evaluation of indicator reliability, multicollinearity (inner VIFs), model fit, and sample power.",
      },
      {
        title: "Measurement Model Evaluation Tables",
        description: "Complete formatted tables for outer loadings, construct reliability, convergent validity, and HTMT ratios.",
      },
      {
        title: "Structural Path Hypothesis Summary",
        description: "Direct, indirect (mediation), and interaction (moderation) path coefficient tables with t-values and p-values.",
      },
      {
        title: "60-Minute SEM Strategy Video Call",
        description: "Live screen-share session reviewing model adjustments, bootstrapping parameters, and committee talking points.",
      },
    ],
    process_steps: [
      {
        step: 1,
        title: "Conceptual Framework & Dataset Intake",
        description: "Submit your measurement model diagram, survey instrument, hypotheses, and clean dataset.",
        typical_duration: "Day 1",
      },
      {
        step: 2,
        title: "Two-Stage Evaluation Audit",
        description: "Mentor inspects outer measurement model validity before auditing structural path coefficients.",
        typical_duration: "Days 2 to 4",
      },
      {
        step: 3,
        title: "SEM Strategy Consultation",
        description: "60-minute recorded session reviewing model adjustments and mediation bootstrapping procedures.",
        typical_duration: "Day 5",
      },
    ],
    sample_feedback: {
      title: "PLS-SEM Diagnostic: Consumer Technology Adoption",
      manuscript_context: "Doctoral study examining UTAUT2 constructs with trust as mediator.",
      original_text: "Fornell-Larcker criterion was met so discriminant validity is proven.",
      annotated_excerpt: "Discriminant validity was established via the heterotrait-monotrait ratio of correlations (HTMT), with all values remaining below the conservative .85 threshold (Henseler et al., 2015). Fornell-Larcker criteria are reported as supplementary evidence in Appendix C.",
      mentor_marginal_note: "Mentor note: Leading methodological journals and examination boards now reject sole reliance on Fornell-Larcker due to low sensitivity in detecting cross-loadings. Report HTMT ratios with bootstrapped 90% confidence intervals.",
      actionable_takeaway: "Use HTMT as the primary metric for discriminant validity in PLS-SEM.",
      label: "Illustrative example",
    },
    software_tools: ["SmartPLS 4", "IBM SPSS AMOS", "R (lavaan, semPlot)", "Mplus", "WarpPLS"],
    what_we_wont_do: [
      "We will not manipulate data to artificially lower HTMT ratios or force model convergence.",
      "We will not delete indicators arbitrarily without substantive theoretical justification.",
      "We will not write your dissertation discussion chapter.",
    ],
    faqs: [
      {
        question: "How do I decide between AMOS and SmartPLS?",
        answer: "We help you evaluate whether your objective is theory testing and confirmation (CB-SEM via AMOS) or prediction and exploratory extension (PLS-SEM via SmartPLS), factoring in sample size, distribution normality, and model complexity.",
      },
    ],
    related_service_slugs: ["quantitative-data-analysis", "mixed-methods-research-design", "research-design-ethics"],
    related_post_slugs: ["choosing-between-pls-sem-and-cb-sem", "reporting-htmt-discriminant-validity"],
    packages: [
      {
        id: "sem-standard",
        name: "SEM Model Audit & Consultation",
        description: "Complete measurement and structural model review in SmartPLS or AMOS with strategy call.",
        price_ngn: 350000,
        price_usd: 245,
        rounds_of_feedback: "1 model audit + 1 call",
        turnaround: "5 working days",
        includes: ["Measurement model evaluation", "Structural path check", "HTMT / fit index audit", "60-minute strategy consultation"],
      },
    ],
    seo: {
      meta_title: "Structural Equation Modeling Mentoring (SmartPLS, AMOS) — GradEdge",
      meta_description:
        "Master SEM research methodology. Validate measurement models, test complex mediation hypotheses, and generate APA results tables with expert coaching.",
    },
  },

  "mixed-methods-research-design": {
    slug: "mixed-methods-research-design",
    title: "Mixed Methods Research Integration",
    category: "data-analysis",
    category_name: "Data Analysis",
    two_sentence_promise:
      "Integrate quantitative and qualitative findings into a rigorous, cohesive mixed-methods study. We guide you in selecting convergent, explanatory, or exploratory sequential designs and constructing integrated joint displays.",
    hero_image: "/images/services/stage-research.jpg",
    hero_image_alt: "Mixed methods research design flow chart showing quantitative and qualitative data integration",
    hero_summary:
      "A genuine mixed-methods dissertation is not simply two separate studies bound together. We train you how to integrate qualitative insights with statistical results using joint displays and defensible methodological notation (Creswell & Plano Clark standards).",
    format_text: "Integration architecture audit + 1-on-1 strategy call",
    turnaround_text: "5 to 7 working days",
    best_for: "Researchers combining quantitative surveys with qualitative interviews",
    starting_price_ngn: 320000,
    starting_price_usd: 225,
    who_its_for: [
      "Scholars designing convergent, explanatory sequential (QUAN -> qual), or exploratory sequential (QUAL -> quan) studies.",
      "Researchers who completed both data phases but struggle to integrate findings in Chapter 5.",
      "Students seeking guidance on building joint display tables that synthesize mixed evidence.",
    ],
    signs_you_need_this: [
      "Your dissertation reads like two disconnected mini-dissertations with separate conclusions.",
      "Your committee asks 'where does integration actually occur?' and you cannot point to an explicit analytical point.",
      "You are unsure how to reconcile conflicting quantitative and qualitative results.",
    ],
    outcomes: [
      "A formally designated mixed-methods design with standard notation and procedural flowcharts.",
      "Compelling joint displays integrating quantitative statistical metrics with qualifying interview quotes.",
      "A unified discussion chapter that delivers integrated insights impossible through single-method approaches.",
    ],
    deliverables: [
      {
        title: "Mixed-Methods Procedural Diagram Review",
        description: "Audit of your study flowchart detailing sequencing, priority, and explicit points of interface.",
      },
      {
        title: "Joint Display Architecture & Review",
        description: "Custom tabular displays juxtaposing statistical results with explanatory thematic quotes.",
      },
      {
        title: "Integration Chapter Diagnostic",
        description: "Line-level commentary on how effectively qualitative evidence clarifies quantitative anomalies.",
      },
      {
        title: "60-Minute Integration Coaching Session",
        description: "Interactive session addressing integration bottlenecks and committee defense arguments.",
      },
    ],
    process_steps: [
      {
        step: 1,
        title: "Study Design & Findings Review",
        description: "Submit quantitative findings, qualitative themes, and current integration drafts.",
        typical_duration: "Day 1",
      },
      {
        step: 2,
        title: "Integration Analysis & Display Audit",
        description: "Mentor evaluates integration rigor and structural joint display coherence.",
        typical_duration: "Days 2 to 4",
      },
      {
        step: 3,
        title: "Strategy Consultation",
        description: "60-minute video session reviewing joint displays and harmonizing Chapter 5 discussion.",
        typical_duration: "Day 5",
      },
    ],
    sample_feedback: {
      title: "Mixed-Methods Joint Display Audit: Clinical Education",
      manuscript_context: "Explanatory sequential study examining simulation training outcomes.",
      original_text: "Quantitative survey showed 40% satisfaction. In qualitative interviews, participants explained why.",
      annotated_excerpt: "Joint Display 4 integrates quantitative efficacy scores with qualitative experiential narratives. While quantitative measures showed low confidence in emergency airway management (M = 2.4/5.0), qualitative interviews revealed that this deficit stemmed from unrealistic simulation time constraints rather than theoretical confusion (Theme 3, P7: 'The timer created panic rather than learning').",
      mentor_marginal_note: "Mentor note: Present your integration through a structured joint display table mapping each quantitative construct directly to its qualitative explanatory quote, rather than narrating them in separate sections.",
      actionable_takeaway: "Build side-by-side joint displays that explicitly juxtapose numbers with explanatory narrative quotes.",
      label: "Illustrative example",
    },
    software_tools: ["R / SPSS", "NVivo / ATLAS.ti", "Excel Joint Display Matrices", "Draw.io (Flowcharts)"],
    what_we_wont_do: [
      "We will not fabricate qualitative quotes to artificially explain quantitative statistical anomalies.",
      "We will not write your integration discussion chapter.",
    ],
    faqs: [
      {
        question: "What is a joint display?",
        answer: "A joint display is an empirical visual table that juxtaposes quantitative statistical results directly alongside qualitative textual excerpts to generate integrated insights.",
      },
    ],
    related_service_slugs: ["quantitative-data-analysis", "qualitative-data-analysis", "dissertation-thesis-mentoring"],
    related_post_slugs: ["how-to-build-mixed-methods-joint-displays", "explanatory-sequential-design-guide"],
    packages: [
      {
        id: "mixed-methods-standard",
        name: "Mixed Methods Integration Review",
        description: "Complete design, joint display, and discussion integration audit with consultation call.",
        price_ngn: 320000,
        price_usd: 225,
        rounds_of_feedback: "1 comprehensive review + 1 call",
        turnaround: "5 working days",
        includes: ["Design flowchart audit", "Joint display construction guidance", "Chapter 5 integration review", "60-minute strategy call"],
      },
    ],
    seo: {
      meta_title: "Mixed Methods Research Integration Mentoring — GradEdge",
      meta_description:
        "Master mixed methods research integration. Build joint displays, synthesize quantitative and qualitative evidence, and defend your study with confidence.",
    },
  },

  // ── CATEGORY 3: EDITING & WRITING QUALITY ────────────────────────────────────
  "academic-editing-proofreading": {
    slug: "academic-editing-proofreading",
    title: "Academic Editing & Proofreading",
    category: "editing-and-writing-quality",
    category_name: "Editing & Writing Quality",
    two_sentence_promise:
      "Refine your scholarly tone, sentence rhythm, and argument coherence while preserving your authentic intellectual voice. We eliminate ambiguity, typographical errors, and clumsy phrasing to meet the highest university press standards.",
    hero_image: "/images/services/stage-writing.jpg",
    hero_image_alt: "Academic dissertation page with line-level developmental editing marks in red and blue ink",
    hero_summary:
      "A substantive academic edit goes far beyond basic spellchecking. We examine paragraph unity, transition mechanics, discipline-appropriate register, and academic rigor to ensure your dissertation reads like the work of an established researcher.",
    format_text: "Line-level Track Changes editing + editorial diagnostic letter",
    turnaround_text: "4 to 7 working days (per 15,000 words)",
    best_for: "Scholars preparing completed chapters or final manuscript for submission",
    starting_price_ngn: 150000,
    starting_price_usd: 105,
    who_its_for: [
      "PhD and Master's candidates finalizing dissertation chapters for internal or external examination.",
      "Scholars whose committee commented that writing is 'dense', 'repetitive', or 'difficult to follow'.",
      "Multilingual researchers seeking professional developmental refinement of their scholarly English.",
    ],
    signs_you_need_this: [
      "Your paragraphs frequently span an entire page without clear topic sentences.",
      "You overuse passive voice constructions that obscure agency in your methodology.",
      "Colleagues read your work and have to ask what your core point is after reading two pages.",
      "Your final submission deadline is near and you cannot afford typographical or grammatical rejections.",
    ],
    outcomes: [
      "A polished, rhythmically precise dissertation that communicates complex research with absolute clarity.",
      "Consistent academic register and terminology aligned with international scholarly standards.",
      "Two copies delivered: one with all changes tracked, and one clean version ready for reading.",
    ],
    deliverables: [
      {
        title: "Track Changes Annotated Manuscript",
        description: "Complete line-level corrections for grammar, syntax, tone, and paragraph transitions.",
      },
      {
        title: "Clean Manuscript Version",
        description: "A ready-to-read version with all mechanical edits accepted and marginal queries preserved.",
      },
      {
        title: "Editor's Diagnostic Letter",
        description: "A personalized 2-page overview detailing recurrent writing habits and structural suggestions.",
      },
      {
        title: "30-Minute Editorial Clarification Call",
        description: "Optional consultation to review specific editorial suggestions or stylistic questions.",
      },
    ],
    process_steps: [
      {
        step: 1,
        title: "Manuscript Intake & Style Guide Confirmation",
        description: "Submit your chapter files (Word format) and specify your target style guide (APA, Chicago, Harvard).",
        typical_duration: "Day 1",
      },
      {
        step: 2,
        title: "Substantive Editorial Pass",
        description: "Editor conducts thorough line-by-line review improving clarity, syntax, and voice consistency.",
        typical_duration: "Days 2 to 5",
      },
      {
        step: 3,
        title: "Delivery & Verification",
        description: "Receive tracked and clean copies along with your editorial letter and review any margin queries.",
        typical_duration: "Days 6 to 7",
      },
    ],
    sample_feedback: {
      title: "Line-Level Developmental Edit: Political Science Dissertation",
      manuscript_context: "Introduction chapter discussing democratic backsliding.",
      original_text: "In this modern contemporary era of today, it can be seen that democratic erosion is taking place in many countries.",
      annotated_excerpt: "Contemporary democratic institutions face accelerated systemic erosion across both consolidated and transitional regimes.",
      mentor_marginal_note: "Editor note: Replaced redundant colloquialisms ('In this modern contemporary era of today, it can be seen that') with concise, authoritative academic prose. Avoid conversational filler in scholarly openings.",
      actionable_takeaway: "Eliminate temporal redundancies and lead with concrete empirical nouns.",
      label: "Illustrative example",
    },
    software_tools: ["Microsoft Word Track Changes", "PerfectIt (Consistency Checker)", "Zotero / Mendeley Integration"],
    what_we_wont_do: [
      "We will not rewrite entire arguments or alter your empirical conclusions.",
      "We will not ghostwrite missing sections or add unverified references.",
      "We will not alter your technical subject-matter definitions without your explicit consent.",
    ],
    faqs: [
      {
        question: "Does your editing comply with university academic integrity policies?",
        answer: "Yes. Our editing adheres strictly to the CIEP (Chartered Institute of Editing and Proofreading) guidelines for academic work. We refine language, syntax, and style without altering authorial ownership or empirical arguments.",
      },
    ],
    related_service_slugs: ["referencing-formatting-compliance", "similarity-report-review", "dissertation-thesis-mentoring"],
    related_post_slugs: ["editing-your-own-dissertation-checklist", "active-vs-passive-voice-in-research"],
    packages: [
      {
        id: "edit-chapter",
        name: "Single Chapter Substantive Edit",
        description: "Line-level developmental edit of one chapter (up to 8,000 words).",
        price_ngn: 150000,
        price_usd: 105,
        rounds_of_feedback: "1 comprehensive edit + verification check",
        turnaround: "4 working days",
        includes: ["Tracked & clean versions", "Grammar, syntax & tone refinement", "Editor's diagnostic letter"],
      },
      {
        id: "edit-full-thesis",
        name: "Full Dissertation Complete Edit",
        description: "End-to-end editorial refinement across all chapters (up to 50,000 words).",
        price_ngn: 750000,
        price_usd: 520,
        rounds_of_feedback: "Full manuscript edit + post-revision check",
        turnaround: "14 working days",
        popular: true,
        includes: [
          "Complete dissertation edit (all chapters)",
          "Tracked and clean manuscript files",
          "Comprehensive consistency check across terms",
          "Editorial diagnostic summary",
          "Two 30-minute clarification consultations",
        ],
      },
    ],
    seo: {
      meta_title: "Academic Editing & Proofreading for Theses & Dissertations — GradEdge",
      meta_description:
        "Professional developmental editing and proofreading for graduate researchers. Refine scholarly voice, eliminate grammatical ambiguity, and prepare for examination.",
    },
  },

  "referencing-formatting-compliance": {
    slug: "referencing-formatting-compliance",
    title: "Referencing, Citations & Style Compliance",
    category: "editing-and-writing-quality",
    category_name: "Editing & Writing Quality",
    two_sentence_promise:
      "Guarantee absolute concordance between your in-text citations and reference list entries, while formatting your manuscript to exact university press guidelines. We audit APA 7, Harvard, Chicago, Vancouver, and institutional style books.",
    hero_image: "/images/services/stage-writing.jpg",
    hero_image_alt: "Academic bibliography reference list with citation cross-checks and DOI verification",
    hero_summary:
      "Reference list inconsistencies and formatting non-compliance cause last-minute dissertation rejections at the graduate school office. We cross-check every single citation, verify DOIs, format preliminary pages, and align your layout with institutional requirements.",
    format_text: "Full bibliography audit + document layout formatting",
    turnaround_text: "3 to 5 working days",
    best_for: "Scholars preparing final pre-binding or library deposit submissions",
    starting_price_ngn: 120000,
    starting_price_usd: 85,
    who_its_for: [
      "Candidates who compiled references over several years and have mismatched citations and bibliography entries.",
      "Students struggling to format tables of contents, lists of figures, and front matter in Microsoft Word or LaTeX.",
      "Authors submitting to journals with stringent citation style manuals.",
    ],
    signs_you_need_this: [
      "You have citations in the text that do not appear in your reference list (or vice versa).",
      "Your supervisor or graduate school rejected your draft due to margin, font, or pagination errors.",
      "Your bibliography has inconsistent DOI links, missing page ranges, and mixed citation formats.",
    ],
    outcomes: [
      "100% concordance between in-text citations and reference list entries.",
      "Properly formatted front matter (Title page, Declaration, Abstract, Table of Contents, Lists of Tables).",
      "Flawless compliance with your university's official dissertation formatting handbook.",
    ],
    deliverables: [
      {
        title: "Citation Concordance Audit Report",
        description: "A list of every missing, orphan, or misspelled citation identified across your document.",
      },
      {
        title: "Fully Formatted Reference List",
        description: "Complete bibliography formatted strictly according to your target manual (APA 7, Harvard, Chicago).",
      },
      {
        title: "Formatted Manuscript Document",
        description: "Properly styled headings, automated Table of Contents, correct margins, and compliant preliminary pages.",
      },
    ],
    process_steps: [
      {
        step: 1,
        title: "Document & University Guidelines Submission",
        description: "Submit complete dissertation draft and your university's official formatting handbook.",
        typical_duration: "Day 1",
      },
      {
        step: 2,
        title: "Concordance Cross-Check & Styling",
        description: "Editor matches every in-text citation against bibliography and sets up automated heading styles.",
        typical_duration: "Days 2 to 4",
      },
      {
        step: 3,
        title: "Final Verification Delivery",
        description: "Deliver formatted file with summary report of any citations needing missing source details from author.",
        typical_duration: "Day 5",
      },
    ],
    sample_feedback: {
      title: "Citation Concordance Diagnostic: Sociology Dissertation",
      manuscript_context: "Chapter 3 methodology cross-check.",
      original_text: "In-text citation: '(Bourdieu, 1987)'. Reference list entry: None found. In-text citation: '(Foucault, 1978, p. 12)'. Reference list entry: Foucault, M. (1980).",
      annotated_excerpt: "Bourdieu (1987) is cited on p. 45 and p. 78 but missing entirely from your References list. Foucault date discrepancy: cited as 1978 in-text, but listed as 1980 in bibliography. Synchronize publication dates.",
      mentor_marginal_note: "Editor note: Orphan citations identified and flagged. Updated bibliography to include Bourdieu (1987) citation and verified standard DOI formatting across all journal references.",
      actionable_takeaway: "Resolve all citation mismatches before final submission to library repository.",
      label: "Illustrative example",
    },
    software_tools: ["Zotero", "Mendeley", "EndNote", "Microsoft Word Styles Engine", "Crossref DOI API"],
    what_we_wont_do: [
      "We will not fabricate references or invent citations that do not exist.",
      "We will not convert non-academic informal blogs into peer-reviewed scholarly citations.",
    ],
    faqs: [
      {
        question: "Can you fix references in EndNote or Zotero libraries directly?",
        answer: "Yes. If you provide your exported .ris or .bib file, we can clean and standardize your reference manager library directly.",
      },
    ],
    related_service_slugs: ["academic-editing-proofreading", "similarity-report-review", "dissertation-thesis-mentoring"],
    related_post_slugs: ["mastering-apa-7-reference-rules", "how-to-fix-word-table-of-contents"],
    packages: [
      {
        id: "referencing-standard",
        name: "Full Dissertation Citation & Format Audit",
        description: "Complete citation concordance check, reference list formatting, and front matter setup.",
        price_ngn: 120000,
        price_usd: 85,
        rounds_of_feedback: "1 complete audit + verification",
        turnaround: "4 working days",
        includes: ["Full citation concordance audit", "Reference list standardization", "Table of contents & front matter styling"],
      },
    ],
    seo: {
      meta_title: "Referencing, Citations & Dissertation Formatting Compliance — GradEdge",
      meta_description:
        "Ensure 100% citation concordance and full university formatting compliance. We audit APA 7, Harvard, Chicago, and Vancouver styles with meticulous accuracy.",
    },
  },

  "similarity-report-review": {
    slug: "similarity-report-review",
    title: "Similarity Report Review & Paraphrasing Coaching",
    category: "editing-and-writing-quality",
    category_name: "Editing & Writing Quality",
    two_sentence_promise:
      "Interpret your similarity report with academic precision and learn ethical paraphrasing techniques to eliminate unintended text overlap. We teach you how to synthesize source material without risking accidental plagiarism allegations.",
    hero_image: "/images/services/stage-writing.jpg",
    hero_image_alt: "Similarity audit report review document with highlighted text strings and paraphrasing notes",
    hero_summary:
      "A raw percentage on a similarity report tells you almost nothing about academic integrity. We review highlighted text strings with you, distinguish between benign common methodology formulas and problematic text recycling, and train you in rigorous scholarly paraphrasing.",
    format_text: "Report diagnostic audit + 1-on-1 paraphrasing coaching call",
    turnaround_text: "2 to 3 working days",
    best_for: "Scholars whose draft flagged high similarity before departmental submission",
    starting_price_ngn: 100000,
    starting_price_usd: 70,
    who_its_for: [
      "Scholars whose institutional submission returned a higher similarity index than faculty guidelines permit.",
      "Researchers struggling to express complex definitions or statutory passages in their own words.",
      "Students wanting to ensure their literature review is ethically synthesized prior to formal committee review.",
    ],
    signs_you_need_this: [
      "Your Turnitin or institutional similarity report highlights entire sentences in your literature review.",
      "You rely heavily on direct quotes because you are nervous about altering an author's technical meaning.",
      "Your report flags institutional boilerplate and you do not know how to request exclusion filters.",
    ],
    outcomes: [
      "Clear line-level diagnostic of all flagged similarity blocks.",
      "Mastery of multi-source conceptual paraphrasing and synthesis techniques.",
      "Ethically sound text that reflects your authentic authorial voice without algorithmic flags.",
    ],
    deliverables: [
      {
        title: "Similarity String Diagnostic Memo",
        description: "Categorization of all flagged blocks into benign boilerplate, direct quote errors, and substantive overlap.",
      },
      {
        title: "Paraphrasing Intervention Blueprint",
        description: "Step-by-step guidance demonstrating how to dismantle flagged sentences and rebuild them conceptually.",
      },
      {
        title: "45-Minute Coaching Call",
        description: "Live walkthrough examining flagged sections and practicing synthesis techniques.",
      },
    ],
    process_steps: [
      {
        step: 1,
        title: "Report & Draft Submission",
        description: "Submit your official similarity PDF report along with the matching Word document draft.",
        typical_duration: "Day 1",
      },
      {
        step: 2,
        title: "Line-by-Line Diagnostic Audit",
        description: "Mentor analyzes every highlighted string to identify root causes and structural patterns.",
        typical_duration: "Day 2",
      },
      {
        step: 3,
        title: "Paraphrasing Coaching Session",
        description: "45-minute video call teaching high-level academic synthesis and revision execution.",
        typical_duration: "Day 3",
      },
    ],
    sample_feedback: {
      title: "Paraphrasing Diagnostic: Economics Chapter 2",
      manuscript_context: "Flagged literature string with 82% overlap against original journal article.",
      original_text: "According to Keynes (1936), the propensity to consume is determined by the psychological law that individuals increase consumption as income grows, but not as much as the increase in income.",
      annotated_excerpt: "Keynesian consumption theory posits an inelastic marginal propensity to consume: while absolute consumer expenditure rises alongside disposable income, it does so at a diminishing relative rate (Keynes, 1936).",
      mentor_marginal_note: "Mentor note: The original text simply swapped a few synonyms while retaining Keynes's exact clause structure. Reframe the core economic principle using conceptual terminology rather than following the original sentence syntax.",
      actionable_takeaway: "Deconstruct the sentence structure entirely before rewriting; never rely on synonym replacement.",
      label: "Illustrative example",
    },
    software_tools: ["Turnitin Report Analysis", "Microsoft Word Track Changes", "Zotero Citation Tracker"],
    what_we_wont_do: [
      "We will not use AI spinners or character-substitution tricks to deceive similarity detection algorithms.",
      "We will not rewrite text on your behalf to bypass university integrity checks.",
      "We will not guarantee a specific numeric similarity percentage.",
    ],
    faqs: [
      {
        question: "Do you run papers through Turnitin for students?",
        answer: "No. Third-party repository submissions can accidentally store your paper in institutional databases, creating false 100% self-plagiarism matches. We analyze existing reports provided by your university and review your drafts offline.",
      },
    ],
    related_service_slugs: ["academic-editing-proofreading", "literature-review-support", "referencing-formatting-compliance"],
    related_post_slugs: ["understanding-turnitin-similarity-reports", "ethical-paraphrasing-in-academia"],
    packages: [
      {
        id: "similarity-review-standard",
        name: "Similarity Report Audit & Coaching",
        description: "Complete line-level report analysis and 45-minute live paraphrasing coaching consultation.",
        price_ngn: 100000,
        price_usd: 70,
        rounds_of_feedback: "1 audit + 1 coaching call",
        turnaround: "2 working days",
        includes: ["Line-by-line report diagnosis", "Paraphrasing intervention guide", "45-minute video coaching session"],
      },
    ],
    seo: {
      meta_title: "Similarity Report Review & Paraphrasing Coaching — GradEdge",
      meta_description:
        "Understand your similarity report, eliminate accidental overlap, and master ethical academic paraphrasing with structured academic coaching.",
    },
  },

  "esl-academic-writing-support": {
    slug: "esl-academic-writing-support",
    title: "Academic Writing Support for Multilingual Scholars",
    category: "editing-and-writing-quality",
    category_name: "Editing & Writing Quality",
    two_sentence_promise:
      "Bridge the gap between complex research thinking and native-level English academic prose. We coach multilingual researchers on disciplinary idioms, article usage, hedging conventions, and rhetorical argument structures.",
    hero_image: "/images/services/stage-writing.jpg",
    hero_image_alt: "Bilingual academic notes and English research manuscript with register guidance marks",
    hero_summary:
      "Non-native English scholars frequently produce brilliant empirical research that gets dismissed because of subtle linguistic friction. We provide specialized developmental mentoring that sharpens your English scholarly register while preserving your intellectual ownership.",
    format_text: "Diagnostic chapter edit + 1-on-1 writing mechanics consultation",
    turnaround_text: "5 to 7 working days",
    best_for: "International and multilingual doctoral scholars writing in English",
    starting_price_ngn: 180000,
    starting_price_usd: 125,
    who_its_for: [
      "Scholars whose primary language is not English, writing their dissertation for English-medium universities.",
      "Researchers receiving feedback that their writing is 'unidiomatic' or 'needs native-speaker polish'.",
      "Postgraduate candidates wanting to master international scholarly writing conventions.",
    ],
    signs_you_need_this: [
      "Direct translations from your primary language produce awkward English preposition and article patterns.",
      "You struggle with academic hedging (distinguishing between 'demonstrates', 'suggests', and 'implies').",
      "Reviewers praise your methodology but critique your writing clarity.",
    ],
    outcomes: [
      "Clean, idiomatic English academic prose that flows naturally to native examiners.",
      "Mastery of academic hedging and cautious scientific assertion.",
      "Long-term improvement in your independent scholarly writing capabilities.",
    ],
    deliverables: [
      {
        title: "Track Changes Developmental Edit",
        description: "Line-level corrections targeting English syntax, collocations, article usage, and transitions.",
      },
      {
        title: "Multilingual Style Diagnostic Brief",
        description: "Analysis of your personal grammatical patterns with clear replacement rules.",
      },
      {
        title: "60-Minute Writing Mechanics Coaching Call",
        description: "Review of key sentence patterns and live practice refining challenging paragraphs.",
      },
    ],
    process_steps: [
      {
        step: 1,
        title: "Draft Submission & Target Review",
        description: "Submit chapter draft and note your native language background and specific areas of concern.",
        typical_duration: "Day 1",
      },
      {
        step: 2,
        title: "Developmental Line Editing",
        description: "Editor identifies recurring L1-interference patterns and polishes sentence flow.",
        typical_duration: "Days 2 to 5",
      },
      {
        step: 3,
        title: "Interactive Mechanics Consultation",
        description: "60-minute session reviewing editorial corrections and practicing academic phrasing conventions.",
        typical_duration: "Day 6",
      },
    ],
    sample_feedback: {
      title: "Multilingual Style Diagnostic: Engineering Dissertation",
      manuscript_context: "Results discussion draft from a multilingual doctoral candidate.",
      original_text: "In this study, it was made the experiment to prove that the heat transfer becomes bigger when pressure increases.",
      annotated_excerpt: "Experimental trials demonstrated that convective heat transfer rates increased proportionally with elevated operating pressure.",
      mentor_marginal_note: "Editor note: Replaced the non-idiomatic construction 'it was made the experiment' with direct scientific phrasing. Replaced colloquial 'becomes bigger' with standard engineering register 'increased proportionally'.",
      actionable_takeaway: "Use active experimental nouns as grammatical subjects and employ precise dimensional verbs.",
      label: "Illustrative example",
    },
    software_tools: ["Microsoft Word Track Changes", "Corpus of Contemporary American English (COCA)", "Manchester Academic Phrasebank"],
    what_we_wont_do: [
      "We will not write sentences or draft text for you.",
      "We will not alter technical formulas or mathematical representations.",
    ],
    faqs: [
      {
        question: "How is this different from standard editing?",
        answer: "Standard editing merely fixes errors. Multilingual writing support actively teaches you why specific phrasing sounds unnatural in English academic register and trains you to avoid those patterns permanently.",
      },
    ],
    related_service_slugs: ["academic-editing-proofreading", "dissertation-thesis-mentoring", "referencing-formatting-compliance"],
    related_post_slugs: ["academic-hedging-guide", "common-esl-errors-in-dissertations"],
    packages: [
      {
        id: "esl-writing-standard",
        name: "Multilingual Chapter Edit & Coaching",
        description: "Detailed edit of one chapter (up to 8,000 words) plus a 60-minute writing mechanics coaching session.",
        price_ngn: 180000,
        price_usd: 125,
        rounds_of_feedback: "1 comprehensive edit + 1 coaching call",
        turnaround: "5 working days",
        includes: ["Line-level Track Changes edit", "Multilingual syntax diagnostic", "60-minute 1-on-1 coaching call"],
      },
    ],
    seo: {
      meta_title: "Academic Writing Support for Multilingual Scholars — GradEdge",
      meta_description:
        "Specialized academic writing coaching for non-native English graduate researchers. Master scholarly register, idiomatic phrasing, and publishing standards.",
    },
  },

  // ── CATEGORY 4: PUBLISHING & CAREER ──────────────────────────────────────────
  "journal-article-conversion": {
    slug: "journal-article-conversion",
    title: "Journal Article Conversion & Publishing Support",
    category: "publishing-and-career",
    category_name: "Publishing & Career",
    two_sentence_promise:
      "Condense an exhaustive 60-page dissertation chapter into a focused, high-impact 7,000-word peer-reviewed journal manuscript. We help you reposition your literature, sharpen your contribution, and target suitable indexed journals.",
    hero_image: "/images/services/stage-publishing.jpg",
    hero_image_alt: "Peer-reviewed journal publication manuscript draft with editorial condensing markers",
    hero_summary:
      "Dissertations and journal articles serve entirely different audiences. While a thesis proves you read everything, a journal article must argue a single distinct theoretical contribution concisely. We guide you through the condensation and repositioning process.",
    format_text: "Manuscript restructuring audit + submission readiness check",
    turnaround_text: "7 to 10 working days",
    best_for: "Recent PhD graduates or senior candidates publishing from thesis chapters",
    starting_price_ngn: 320000,
    starting_price_usd: 225,
    who_its_for: [
      "Doctoral graduates aiming to publish peer-reviewed papers from their completed dissertation.",
      "Scholars whose university mandates journal publications as a prerequisite for doctoral defense.",
      "Early career researchers transitioning from student writing to peer-reviewed publication register.",
    ],
    signs_you_need_this: [
      "Your draft is 18,000 words long and the target journal enforces a strict 8,000-word limit.",
      "Your literature review still reads like a broad student chapter rather than a focused scholarly debate.",
      "You are unsure how to frame the article's unique contribution to stand out to journal editors.",
    ],
    outcomes: [
      "A streamlined, publication-ready journal manuscript conforming to target journal guidelines.",
      "A compelling Abstract, Title, and Cover Letter designed for journal editorial boards.",
      "Clear strategy for navigating peer review and handling reviewer comments.",
    ],
    deliverables: [
      {
        title: "Article Restructuring Blueprint",
        description: "A page-by-page plan showing exactly which thesis sections to condense, retain, or cut.",
      },
      {
        title: "Line-Level Manuscript Review",
        description: "Substantive editorial critique of your condensed draft (up to 8,000 words) for journal impact.",
      },
      {
        title: "Cover Letter to the Editor",
        description: "Review and refinement of your formal submission cover letter highlighting theoretical significance.",
      },
      {
        title: "60-Minute Journal Strategy Call",
        description: "Interactive session reviewing target journal suitability and manuscript positioning.",
      },
    ],
    process_steps: [
      {
        step: 1,
        title: "Dissertation Chapter & Journal Selection Intake",
        description: "Submit original thesis chapter, candidate journals (Scopus/Web of Science), and target word limits.",
        typical_duration: "Day 1",
      },
      {
        step: 2,
        title: "Condensation & Architecture Blueprint",
        description: "Mentor produces a structural blueprint mapping out the streamlined article argument.",
        typical_duration: "Days 2 to 4",
      },
      {
        step: 3,
        title: "Condensed Draft Review",
        description: "Detailed line-level commentary on your condensed draft ensuring argument tightness.",
        typical_duration: "Days 5 to 8",
      },
      {
        step: 4,
        title: "Final Submission Consultation",
        description: "60-minute strategy call finalizing cover letter, journal choice, and submission checklist.",
        typical_duration: "Days 9 to 10",
      },
    ],
    sample_feedback: {
      title: "Conversion Blueprint: Criminology Chapter to Journal Article",
      manuscript_context: "Converting a 45-page qualitative dissertation chapter into a 7,500-word journal manuscript.",
      original_text: "Chapters 1, 2, and 3 background literature (18,000 words total) summarized in full detail before introducing findings.",
      annotated_excerpt: "Eliminate 80% of foundational textbook history (e.g. Cesare Beccaria and 19th-century deterrence theory). Open directly with the contemporary 2018–2024 debate on algorithmic bail risk assessments, citing only the 15 most pertinent empirical studies that directly motivate your research question.",
      mentor_marginal_note: "Mentor note: Journal readers do not need a history of criminological thought; they need to know what empirical puzzle your study solves today. Cut background ruthlessly to reserve word count for rich interview evidence.",
      actionable_takeaway: "Condense foundational literature to focus exclusively on the immediate contemporary debate.",
      label: "Illustrative example",
    },
    software_tools: ["Journal Finder (Elsevier, Springer, Wiley)", "Zotero", "Microsoft Word Track Changes"],
    what_we_wont_do: [
      "We will not write the journal article for you.",
      "We will not guarantee journal acceptance or peer review outcomes.",
      "We will not list ourselves as co-authors on your work.",
    ],
    faqs: [
      {
        question: "Can I publish multiple papers from a single dissertation?",
        answer: "Yes. Many multi-study dissertations contain material for two or three distinct journal articles. We help you identify the unique empirical angles for each candidate manuscript.",
      },
    ],
    related_service_slugs: ["target-journal-selection-audit", "response-to-reviewers-strategy", "academic-editing-proofreading"],
    related_post_slugs: ["converting-thesis-into-journal-article", "how-to-write-cover-letter-to-editor"],
    packages: [
      {
        id: "conversion-standard",
        name: "Thesis-to-Article Conversion Mentorship",
        description: "Complete restructuring blueprint, condensed draft edit, cover letter review, and 60-minute call.",
        price_ngn: 320000,
        price_usd: 225,
        rounds_of_feedback: "1 structural blueprint + 1 full manuscript review + 1 call",
        turnaround: "8 working days",
        includes: ["Restructuring blueprint", "Full manuscript edit (up to 8,000 words)", "Cover letter review", "60-minute strategy call"],
      },
    ],
    seo: {
      meta_title: "Journal Article Conversion & Publishing Support — GradEdge",
      meta_description:
        "Convert your dissertation chapter into a high-impact peer-reviewed journal article. Restructure arguments, meet word counts, and navigate submission with expert mentoring.",
    },
  },

  "target-journal-selection-audit": {
    slug: "target-journal-selection-audit",
    title: "Journal Selection & Manuscript Readiness Audit",
    category: "publishing-and-career",
    category_name: "Publishing & Career",
    two_sentence_promise:
      "Avoid predatory publishers and rapid desk rejections by identifying indexed, reputable journals that genuinely match your paper's scope. We audit your draft against explicit journal criteria before you submit.",
    hero_image: "/images/services/stage-publishing.jpg",
    hero_image_alt: "Academic journal metrics indexing report (Scopus, Web of Science) and manuscript audit checklist",
    hero_summary:
      "Desk rejections waste months of academic momentum. We review your manuscript's theoretical contribution, methodology, and citation network to recommend three verified Scopus / Web of Science indexed journals with realistic acceptance profiles.",
    format_text: "Journal matching dossier + manuscript readiness audit",
    turnaround_text: "3 to 5 working days",
    best_for: "Researchers preparing to submit their first or second journal article",
    starting_price_ngn: 140000,
    starting_price_usd: 95,
    who_its_for: [
      "Scholars unsure which journals within their discipline are reputable, indexed, and aligned with their study scope.",
      "Researchers vulnerable to predatory publishers sending unsolicited email solicitations.",
      "Authors wanting an objective pre-submission audit to minimize the risk of immediate desk rejection.",
    ],
    signs_you_need_this: [
      "Your paper was desk-rejected within 48 hours with a note stating it was 'out of scope'.",
      "You are unsure how to evaluate journal impact factors, CiteScores, and quartile rankings (Q1–Q4).",
      "You do not know whether open access publication fees (APCs) are mandatory or optional in your target journals.",
    ],
    outcomes: [
      "A tailored dossier of 3 verified indexed target journals matching your paper's methodology and scope.",
      "Pre-submission readiness audit highlighting structural weaknesses that trigger editor desk rejections.",
      "Clear roadmap of submission guidelines, formatting expectations, and realistic review timelines.",
    ],
    deliverables: [
      {
        title: "Target Journal Matching Dossier",
        description: "In-depth profiles of 3 recommended journals (indexing status, impact factor, turnaround time, APCs).",
      },
      {
        title: "Desk Rejection Risk Audit",
        description: "Diagnostic check assessing scope alignment, contribution clarity, and abstract effectiveness.",
      },
      {
        title: "45-Minute Submission Strategy Call",
        description: "Live consultation walking through journal selection criteria and submission steps.",
      },
    ],
    process_steps: [
      {
        step: 1,
        title: "Draft & Preferences Ingestion",
        description: "Submit your manuscript draft, target indexing preferences (Scopus/WoS), and budget constraints.",
        typical_duration: "Day 1",
      },
      {
        step: 2,
        title: "Citation & Scope Matching",
        description: "Mentor analyzes your reference network and evaluates candidate journal editorial boards.",
        typical_duration: "Days 2 to 3",
      },
      {
        step: 3,
        title: "Dossier Delivery & Strategy Consultation",
        description: "Receive journal dossier and conduct a 45-minute video call to select your primary target.",
        typical_duration: "Days 4 to 5",
      },
    ],
    sample_feedback: {
      title: "Journal Scope Audit: Development Economics",
      manuscript_context: "Evaluating micro-credit interventions in rural Nigeria.",
      original_text: "Target Journal: American Economic Review (AER).",
      annotated_excerpt: "AER publishes theoretical innovations and global econometric breakthroughs; a single-region regional empirical study faces immediate desk rejection here. Recommended realistic targets: Journal of Development Studies (Taylor & Francis, Q1), Development Policy Review (Wiley, Q2), or African Development Review (Q2).",
      mentor_marginal_note: "Mentor note: Matching paper scope to journal aims is critical. The three recommended alternatives actively welcome regional empirical evaluations and have median turnaround times under 12 weeks.",
      actionable_takeaway: "Target journals whose published papers share your exact methodological approach and geographic scope.",
      label: "Illustrative example",
    },
    software_tools: ["Scopus / SJR Scimago", "Web of Science Master Journal List", "DOAJ (Directory of Open Access Journals)"],
    what_we_wont_do: [
      "We will not guarantee journal acceptance or editor decisions.",
      "We will not recommend unverified or predatory open-access publishers.",
    ],
    faqs: [
      {
        question: "How do you verify that a journal is not predatory?",
        answer: "We verify current indexing in Scopus and Web of Science, check inclusion in the DOAJ, inspect editorial board credentials, and examine past issues to confirm rigorous peer-review standards.",
      },
    ],
    related_service_slugs: ["journal-article-conversion", "response-to-reviewers-strategy", "academic-editing-proofreading"],
    related_post_slugs: ["identifying-predatory-journals-checklist", "understanding-journal-quartiles"],
    packages: [
      {
        id: "journal-selection-standard",
        name: "Journal Matching & Readiness Audit",
        description: "Dossier of 3 vetted target journals, desk-rejection risk audit, and 45-minute consultation.",
        price_ngn: 140000,
        price_usd: 95,
        rounds_of_feedback: "1 audit dossier + 1 consultation",
        turnaround: "4 working days",
        includes: ["3 vetted journal profiles", "Desk rejection risk audit", "45-minute video strategy call"],
      },
    ],
    seo: {
      meta_title: "Target Journal Selection & Readiness Audit — GradEdge",
      meta_description:
        "Identify reputable, indexed Scopus and Web of Science journals matching your research. Avoid desk rejections with a comprehensive pre-submission readiness audit.",
    },
  },

  "response-to-reviewers-strategy": {
    slug: "response-to-reviewers-strategy",
    title: "Response to Reviewers & Resubmission Strategy",
    category: "publishing-and-career",
    category_name: "Publishing & Career",
    two_sentence_promise:
      "Craft a respectful, authoritative point-by-point response letter to peer reviewers and implement requested revisions. We help you navigate contradictory referee feedback and defend your methodology diplomatically.",
    hero_image: "/images/services/stage-publishing.jpg",
    hero_image_alt: "Peer reviewer decision letter with point-by-point author response matrix and track-changed revisions",
    hero_summary:
      "A 'Revise and Resubmit' decision is an invitation to publish, but defensive or vague author responses frequently lead to final rejection. We help you structure a rigorous, courteous response letter that demonstrates compliance with every referee comment.",
    format_text: "Response letter critique + revised manuscript verification",
    turnaround_text: "4 to 6 working days",
    best_for: "Scholars holding a Major or Minor Revision decision from a journal",
    starting_price_ngn: 200000,
    starting_price_usd: 140,
    who_its_for: [
      "Authors who received a 'Major Revision' or 'Minor Revision' decision from an academic journal.",
      "Researchers facing conflicting reviewer demands (e.g. Reviewer 1 wants brevity, Reviewer 2 wants more literature).",
      "Scholars unsure how to disagree respectfully with a referee's mistaken criticism.",
    ],
    signs_you_need_this: [
      "You feel angry or defensive about harsh reviewer commentary and do not know how to respond calmly.",
      "Reviewers requested additional data collection or tests that are outside the feasible scope of your study.",
      "You have made revisions in your manuscript but have not documented them clearly in your response letter.",
    ],
    outcomes: [
      "A diplomatic, point-by-point response matrix that makes it effortless for the editor to accept your paper.",
      "Defensible justifications for points where you choose not to alter the manuscript.",
      "A revised manuscript with clear Track Changes matching the response document exactly.",
    ],
    deliverables: [
      {
        title: "Point-by-Point Response Matrix Review",
        description: "Line-level critique of your draft responses to every reviewer query, ensuring respectful academic tone.",
      },
      {
        title: "Conflicting Reviewer Strategy Memo",
        description: "A diplomatic approach for reconciling opposing reviewer demands for the editor's attention.",
      },
      {
        title: "Revised Manuscript Check",
        description: "Verification that all changes promised in your response letter are accurately reflected in your text.",
      },
      {
        title: "45-Minute Resubmission Strategy Call",
        description: "Live consultation reviewing tricky points and editor cover letter framing.",
      },
    ],
    process_steps: [
      {
        step: 1,
        title: "Decision Letter & Draft Ingestion",
        description: "Submit the journal decision letter, all reviewer comments, original manuscript, and current draft revisions.",
        typical_duration: "Day 1",
      },
      {
        step: 2,
        title: "Response Matrix Critique",
        description: "Mentor reviews your proposed responses, polishing diplomatic register and strengthening academic evidence.",
        typical_duration: "Days 2 to 4",
      },
      {
        step: 3,
        title: "Strategy Call & Final Polish",
        description: "45-minute video call finalizing your response memo and editor cover letter before resubmission.",
        typical_duration: "Days 5 to 6",
      },
    ],
    sample_feedback: {
      title: "Reviewer Response Polish: Sociology Journal",
      manuscript_context: "Responding to Reviewer 2 who claimed sample size (N = 18) was insufficient for qualitative rigor.",
      original_text: "Author draft: Reviewer 2 is wrong. Qualitative research does not need big numbers like quantitative work does.",
      annotated_excerpt: "We thank Reviewer 2 for highlighting the need for methodological clarity regarding sample adequacy. We have expanded Section 3.2 (p. 9) to explicitly contextualize our sample size (N = 18) within Malterud et al.'s (2016) information power framework, demonstrating that our narrow aim, dense participant specificity, and rich dialogic quality achieved saturation without redundant sampling.",
      mentor_marginal_note: "Mentor note: Never tell a reviewer they are 'wrong'. Thank them for the opportunity to clarify, articulate the theoretical principle calmly, and cite authoritative methodological literature to justify your choice.",
      actionable_takeaway: "Frame disagreements as opportunities to provide clearer methodological justification.",
      label: "Illustrative example",
    },
    software_tools: ["Microsoft Word Track Changes", "Response Table Matrices", "Zotero Citation Tracker"],
    what_we_wont_do: [
      "We will not write the response letter without your active intellectual input.",
      "We will not guarantee that the editor will accept your revised manuscript.",
    ],
    faqs: [
      {
        question: "Can I decline a reviewer's request?",
        answer: "Yes, provided you do so with extreme politeness and strong scholarly evidence. We help you explain why a requested change would alter the study scope or introduce methodological inconsistency.",
      },
    ],
    related_service_slugs: ["journal-article-conversion", "target-journal-selection-audit", "academic-editing-proofreading"],
    related_post_slugs: ["how-to-write-response-to-reviewers-letter", "handling-harsh-peer-review-feedback"],
    packages: [
      {
        id: "response-standard",
        name: "Response to Reviewers Mentorship",
        description: "Complete response letter review, manuscript verification check, and 45-minute strategy call.",
        price_ngn: 200000,
        price_usd: 140,
        rounds_of_feedback: "1 full response matrix audit + 1 call",
        turnaround: "5 working days",
        includes: ["Point-by-point response memo critique", "Revised text verification", "Editor cover letter review", "45-minute strategy consultation"],
      },
    ],
    seo: {
      meta_title: "Response to Reviewers & Resubmission Strategy — GradEdge",
      meta_description:
        "Navigate journal peer review revisions with confidence. Draft diplomatic, authoritative response letters and implement requested manuscript changes.",
    },
  },

  "grant-scholarship-coaching": {
    slug: "grant-scholarship-coaching",
    title: "Grant & Scholarship Application Coaching",
    category: "publishing-and-career",
    category_name: "Publishing & Career",
    two_sentence_promise:
      "Craft persuasive research funding applications, fellowship proposals, and academic scholarship statements. We coach you on framing intellectual merit, broader societal impact, and budgetary feasibility to satisfy competitive evaluation panels.",
    hero_image: "/images/services/stage-publishing.jpg",
    hero_image_alt: "Academic research grant proposal document with evaluation rubrics and budget allocation sheets",
    hero_summary:
      "Winning academic research funding requires articulating why your project matters not just to your narrow sub-field, but to funding panel reviewers who may be generalists. We teach you how to translate scholarly concepts into compelling, high-scoring proposals.",
    format_text: "Application audit + 1-on-1 proposal coaching session",
    turnaround_text: "5 to 7 working days",
    best_for: "Graduate scholars and postdocs applying for research grants or fellowships",
    starting_price_ngn: 220000,
    starting_price_usd: 150,
    who_its_for: [
      "PhD candidates applying for national research grants, dissertation completion fellowships, or fieldwork funding.",
      "Postdoctoral researchers crafting competitive early-career fellowship proposals.",
      "Scholars preparing international postgraduate scholarship applications (Commonwealth, Chevening, Fulbright).",
    ],
    signs_you_need_this: [
      "Your proposal is overly technical and fails to explain broader societal or scientific significance to generalist reviewers.",
      "You struggle to write a realistic, justifiable project timeline (Gantt chart) and budget justification.",
      "Previous funding applications received feedback that the project lacked clear feasibility or risk management.",
    ],
    outcomes: [
      "A compelling grant proposal structured against explicit evaluation criteria.",
      "Clear articulation of intellectual merit, societal impact, and deliverable milestones.",
      "Realistic budget justification and risk mitigation framework.",
    ],
    deliverables: [
      {
        title: "Funding Criteria Alignment Audit",
        description: "Review of your draft proposal against specific scoring criteria (e.g. NSF, ERC, NIH, Commonwealth).",
      },
      {
        title: "Line-Level Proposal Annotation",
        description: "Editorial refinement sharpening persuasive impact, project clarity, and academic tone.",
      },
      {
        title: "Budget & Milestone Feasibility Review",
        description: "Critique of your project Gantt chart, research milestones, and expenditure justification.",
      },
      {
        title: "60-Minute Grant Strategy Video Call",
        description: "Live practice pitch and strategic review addressing potential reviewer skepticism.",
      },
    ],
    process_steps: [
      {
        step: 1,
        title: "Call Guidelines & Draft Ingestion",
        description: "Submit funder guidelines, evaluation rubrics, current proposal draft, and CV.",
        typical_duration: "Day 1",
      },
      {
        step: 2,
        title: "Evaluation Rubric Audit",
        description: "Mentor evaluates proposal against scoring criteria, flagging ambiguities and feasibility gaps.",
        typical_duration: "Days 2 to 4",
      },
      {
        step: 3,
        title: "Strategy Consultation",
        description: "60-minute video session reviewing revisions and polishing executive summary hooks.",
        typical_duration: "Day 5",
      },
    ],
    sample_feedback: {
      title: "Grant Proposal Audit: Public Health Fellowship",
      manuscript_context: "Application for a 2-year doctoral fieldwork fellowship.",
      original_text: "This research will help humanity understand malaria better.",
      annotated_excerpt: "This investigation delivers three actionable clinical outcomes: a validated digital triage protocol for community health workers, a regional risk-density map accessible to health ministries, and empirical data informing regional resource allocations.",
      mentor_marginal_note: "Mentor note: 'Help humanity' is a vague platitude that grant reviewers will discount. Detail specific, measurable, and tangible translational deliverables that demonstrate immediate return on the funder's financial investment.",
      actionable_takeaway: "Replace broad aspirational statements with concrete, measurable project deliverables.",
      label: "Illustrative example",
    },
    software_tools: ["Gantt Chart Tools", "Budget Modeling (Excel)", "Funder Rubric Cross-Walks"],
    what_we_wont_do: [
      "We will not write your grant proposal or budget for you.",
      "We will not guarantee funding approval or award selection.",
    ],
    faqs: [
      {
        question: "Can you help with scholarship personal statements as well as research proposals?",
        answer: "Yes. We coach you on crafting authentic, compelling academic narratives that demonstrate leadership, academic rigor, and alignment with scholarship mission statements.",
      },
    ],
    related_service_slugs: ["topic-proposal-development", "journal-article-conversion", "academic-career-postdoc-guidance"],
    related_post_slugs: ["writing-a-winning-research-grant-proposal", "crafting-impactful-academic-cvs"],
    packages: [
      {
        id: "grant-standard",
        name: "Grant Application Mentorship",
        description: "Complete proposal audit against funder rubrics, budget review, and 60-minute strategy call.",
        price_ngn: 220000,
        price_usd: 150,
        rounds_of_feedback: "1 comprehensive audit + 1 call",
        turnaround: "5 working days",
        includes: ["Funder rubric alignment check", "Line-level proposal annotation", "Budget & timeline critique", "60-minute strategy session"],
      },
    ],
    seo: {
      meta_title: "Grant & Scholarship Application Coaching — GradEdge",
      meta_description:
        "Craft competitive research grant and scholarship proposals. Master intellectual merit, impact statements, and budget justifications with specialized academic coaching.",
    },
  },

  // ── CATEGORY 5: COACHING & TRAINING ──────────────────────────────────────────
  "defense-presentation-coaching": {
    slug: "defense-presentation-coaching",
    title: "Presentation & Oral Defense (Viva) Coaching",
    category: "coaching-and-training",
    category_name: "Coaching & Training",
    two_sentence_promise:
      "Prepare for your doctoral viva voce or oral defense with simulated mock examinations and slide deck refinement. We train you how to respond to adversarial committee questioning with composure, academic precision, and intellectual authority.",
    hero_image: "/images/services/stage-start.jpg",
    hero_image_alt: "Doctoral oral defense presentation slides with mock committee question evaluation rubric",
    hero_summary:
      "Walking into your defense without practicing out loud under simulated examination conditions is a high-risk gamble. We conduct realistic mock vivas, probe your methodology for vulnerabilities, and teach you how to field unexpected questions without becoming defensive.",
    format_text: "Slide deck audit + 90-minute live simulated mock defense",
    turnaround_text: "3 to 5 working days",
    best_for: "Candidates with an approved dissertation scheduled for defense within 1 to 8 weeks",
    starting_price_ngn: 180000,
    starting_price_usd: 125,
    who_its_for: [
      "PhD and Master's candidates with confirmed defense dates.",
      "Researchers who experience acute public speaking or committee defense anxiety.",
      "Scholars preparing oral conference presentations for international academic conventions.",
    ],
    signs_you_need_this: [
      "Your slide deck has 75 text-heavy slides for a 20-minute presentation.",
      "You freeze or become argumentative when colleagues ask probing questions about your sampling or findings.",
      "You do not know how to handle questions where the answer is 'that was outside the scope of this study'.",
    ],
    outcomes: [
      "A streamlined, visually clear defense slide deck focused on contribution and methodology.",
      "Mastery of verbal defense strategies to handle tough methodological challenges with poise.",
      "Confidence built through realistic, disciplined mock examination practice.",
    ],
    deliverables: [
      {
        title: "Slide Deck Architectural Audit",
        description: "Slide-by-slide feedback pruning text, emphasizing conceptual figures, and managing timing.",
      },
      {
        title: "Tailored Committee Question Inventory",
        description: "A customized list of 25 likely committee questions targeting your specific methodology and topic.",
      },
      {
        title: "90-Minute Simulated Mock Defense",
        description: "Recorded mock examination: 20-minute presentation followed by 50 minutes of disciplined questioning and a 20-minute debrief.",
      },
      {
        title: "Oral Defense Performance Debrief Memo",
        description: "Written feedback detailing verbal strengths, areas of overclaiming, and delivery improvements.",
      },
    ],
    process_steps: [
      {
        step: 1,
        title: "Manuscript Summary & Slide Intake",
        description: "Submit your final dissertation draft, abstract, defense slides, and committee member profiles.",
        typical_duration: "Day 1",
      },
      {
        step: 2,
        title: "Slide Audit & Question Preparation",
        description: "Your mentor reviews your slides and generates tailored, discipline-specific examination probes.",
        typical_duration: "Days 2 to 3",
      },
      {
        step: 3,
        title: "Live 90-Minute Mock Viva Session",
        description: "Simulated oral defense examination with real-time questioning, followed by immediate debrief.",
        typical_duration: "Day 4",
      },
      {
        step: 4,
        title: "Debrief Memo & Final Adjustments",
        description: "Receive session recording and debrief memo with targeted slide refinement suggestions.",
        typical_duration: "Day 5",
      },
    ],
    sample_feedback: {
      title: "Mock Defense Debrief: Educational Leadership PhD",
      manuscript_context: "Simulated oral examination questioning on qualitative sample size.",
      original_text: "Candidate oral response: 'I only interviewed 12 principals because nobody else replied to my emails.'",
      annotated_excerpt: "Recommended defense response: 'While our initial recruitment pool was broader, our final sample of 12 principals fulfilled Malterud's information power criteria. Given our narrow research aim—evaluating crisis response protocols—and the deep institutional tenure of the participating administrators, the qualitative data reached conceptual saturation without requiring additional recruitment.'",
      mentor_marginal_note: "Mentor note: Never cite logistical inconvenience ('nobody replied') as your methodological rationale. Always frame your sample size around theoretical saturation and information power.",
      actionable_takeaway: "Frame logistical constraints using established methodological vocabulary.",
      label: "Illustrative example",
    },
    software_tools: ["PowerPoint / Keynote", "Zoom / Google Meet (HD Recording)", "Presentation Timer"],
    what_we_wont_do: [
      "We will not design or build your slides from scratch without your content.",
      "We will not attend your real university defense or speak on your behalf.",
      "We will not guarantee a specific defense grade or honors outcome.",
    ],
    faqs: [
      {
        question: "Can you tailor the mock defense to UK viva voce vs US defense formats?",
        answer: "Yes. UK vivas involve closed-door dialogue with internal and external examiners, while US defenses typically feature a public presentation followed by closed committee interrogation. We configure the mock session to match your exact institutional format.",
      },
    ],
    related_service_slugs: ["dissertation-thesis-mentoring", "research-productivity-coaching", "academic-editing-proofreading"],
    related_post_slugs: ["how-to-survive-your-doctoral-viva", "designing-effective-defense-slides"],
    packages: [
      {
        id: "defense-intensive",
        name: "Complete Mock Defense & Slide Coaching",
        description: "Slide deck audit, custom question inventory, 90-minute recorded mock viva, and debrief memo.",
        price_ngn: 180000,
        price_usd: 125,
        rounds_of_feedback: "1 slide audit + 90-min live mock exam + debrief",
        turnaround: "4 working days",
        includes: ["Slide deck line-level review", "25 tailored committee questions", "90-minute live mock viva session", "Written performance debrief memo"],
      },
    ],
    seo: {
      meta_title: "Oral Defense & Viva Voce Coaching — GradEdge",
      meta_description:
        "Prepare for your doctoral defense with simulated mock vivas, slide deck audits, and committee question inventories with experienced academic mentors.",
    },
  },

  "research-productivity-coaching": {
    slug: "research-productivity-coaching",
    title: "Research Productivity & Timeline Management",
    category: "coaching-and-training",
    category_name: "Coaching & Training",
    two_sentence_promise:
      "Overcome chronic academic procrastination, manage unstructured research schedules, and establish sustainable daily writing habits. We provide bi-weekly milestone accountability and workflow systems tailored to graduate researchers.",
    hero_image: "/images/services/stage-start.jpg",
    hero_image_alt: "Academic research semester planning calendar with milestone writing sprints and tracking charts",
    hero_summary:
      "Graduate research offers vast unstructured time, which frequently leads to isolation, guilt, and stalled progress. We help you design realistic semester milestones, implement focus writing sprints, and establish objective accountability to regain momentum.",
    format_text: "Workflow audit + bi-weekly 1-on-1 milestone accountability calls",
    turnaround_text: "Ongoing monthly coaching (4-week cycle)",
    best_for: "Scholars struggling with thesis momentum, writer's block, or isolation",
    starting_price_ngn: 120000,
    starting_price_usd: 85,
    who_its_for: [
      "Doctoral candidates in their writing phase who have lost momentum and structure.",
      "Researchers juggling professional careers, family commitments, and dissertation deadlines.",
      "Scholars suffering from academic burnout, perfectionist paralysis, and chronic avoidance.",
    ],
    signs_you_need_this: [
      "You sit at your computer for six hours and produce only three paragraphs.",
      "You constantly reschedule your self-imposed chapter deadlines.",
      "You feel overwhelming guilt on weekends because you are not writing, yet produce little during the week.",
    ],
    outcomes: [
      "A realistic, de-escalated semester milestone roadmap that balances research with life.",
      "Sustainable daily writing routines based on cognitive focus blocks rather than binge writing.",
      "Consistent, measurable weekly word counts and completed draft milestones.",
    ],
    deliverables: [
      {
        title: "Academic Workflow & Habit Audit",
        description: "Analysis of your current schedule, productivity leaks, and cognitive fatigue triggers.",
      },
      {
        title: "Semester Milestone Roadmap (Gantt)",
        description: "Realistic schedule breaking down 100,000-word projects into manageable 500-word daily targets.",
      },
      {
        title: "Two 45-Minute Bi-Weekly Coaching Calls",
        description: "Structured accountability check-ins evaluating completed writing targets and addressing bottlenecks.",
      },
      {
        title: "Asynchronous Weekly Check-In",
        description: "Weekly text/email check-ins to log completed pages and reset targets.",
      },
    ],
    process_steps: [
      {
        step: 1,
        title: "Productivity Diagnostic",
        description: "Complete our workflow survey mapping writing habits, energy rhythms, and thesis deadlines.",
        typical_duration: "Day 1",
      },
      {
        step: 2,
        title: "Roadmap Setup Consultation",
        description: "45-minute video call agreeing on sustainable milestones and focus sprint schedules.",
        typical_duration: "Day 3",
      },
      {
        step: 3,
        title: "Bi-Weekly Accountability Cadence",
        description: "Ongoing bi-weekly check-ins to review progress, troubleshoot blocks, and celebrate milestone completions.",
        typical_duration: "Days 14 & 28",
      },
    ],
    sample_feedback: {
      title: "Productivity Workflow Audit: Humanities PhD",
      manuscript_context: "Overcoming a 4-month writer's block on Chapter 4.",
      original_text: "Plan: 'I will write for 8 hours every Saturday and Sunday to finish Chapter 4.'",
      annotated_excerpt: "Binge-writing schedules fail because cognitive fatigue induces perfectionist anxiety after 3 hours. Shift to three 90-minute uninterrupted morning focus blocks on Tuesday, Thursday, and Saturday (target: 400 words per block = 1,200 words weekly).",
      mentor_marginal_note: "Mentor note: The research literature on scholarly productivity demonstrates that daily low-stress increments outperform weekend binges in both volume and conceptual coherence.",
      actionable_takeaway: "Replace weekend marathon goals with consistent 90-minute focus sessions.",
      label: "Illustrative example",
    },
    software_tools: ["Notion Academic OS", "Trello Milestone Boards", "Pomodoro Timers", "Google Calendar Time-Blocking"],
    what_we_wont_do: [
      "We will not act as psychotherapists; our focus is specifically on academic workflow and scholarly productivity.",
      "We will not write or revise your manuscripts in this service.",
    ],
    faqs: [
      {
        question: "Can I combine productivity coaching with chapter mentoring?",
        answer: "Yes. Many scholars combine bi-weekly productivity accountability with substantive chapter mentoring reviews.",
      },
    ],
    related_service_slugs: ["dissertation-thesis-mentoring", "defense-presentation-coaching", "academic-career-postdoc-guidance"],
    related_post_slugs: ["overcoming-dissertation-burnout", "time-blocking-for-phd-researchers"],
    packages: [
      {
        id: "productivity-monthly",
        name: "Monthly Accountability Cadence",
        description: "Workflow audit, custom semester roadmap, two 45-minute calls, and weekly check-ins.",
        price_ngn: 120000,
        price_usd: 85,
        rounds_of_feedback: "Monthly coaching cycle",
        turnaround: "Ongoing 4-week cadence",
        includes: ["Academic workflow audit", "Custom milestone roadmap", "Two 45-minute 1-on-1 calls", "Weekly email accountability checks"],
      },
    ],
    seo: {
      meta_title: "Research Productivity & Dissertation Timeline Coaching — GradEdge",
      meta_description:
        "Overcome academic procrastination and finish your dissertation on schedule. Bi-weekly accountability, sustainable writing habits, and milestone roadmaps.",
    },
  },

  "statistical-software-intensive": {
    slug: "statistical-software-intensive",
    title: "1-on-1 Statistical Software Intensive (R, SPSS, Stata)",
    category: "coaching-and-training",
    category_name: "Coaching & Training",
    two_sentence_promise:
      "Master your specific statistical software through dedicated one-on-one screen-share training using your actual research dataset. We teach you syntax scripting, data transformation, diagnostics, and graphical output generation.",
    hero_image: "/images/services/stage-research.jpg",
    hero_image_alt: "1-on-1 live screen-share tutorial showing RStudio statistical script coding and visualization",
    hero_summary:
      "Generic YouTube tutorials and canned textbook datasets rarely prepare you for the messy reality of your own research data. We provide customized 1-on-1 live coding intensives using your actual variables and research questions.",
    format_text: "Live screen-share training sessions + custom annotated syntax scripts",
    turnaround_text: "Scheduled at your convenience",
    best_for: "Researchers needing rapid practical proficiency in R, SPSS, Stata, or NVivo",
    starting_price_ngn: 150000,
    starting_price_usd: 105,
    who_its_for: [
      "Researchers transitioning from menu-driven interfaces to reproducible syntax scripting in R or Stata.",
      "Scholars needing urgent hands-on help troubleshooting error messages in their statistical code.",
      "Students who learn best through live, interactive screen-share instruction rather than pre-recorded videos.",
    ],
    signs_you_need_this: [
      "You have spent three days trying to fix a single error in your R or Stata script.",
      "You do not know how to recode reverse-scored survey items or handle missing data properly.",
      "You want to generate publication-grade ggplot2 or SPSS charts with custom formatting.",
    ],
    outcomes: [
      "Clean, reproducible, and fully commented syntax scripts that run without errors.",
      "Practical competence executing data transformations, model runs, and diagnostics independently.",
      "Full video recording of your custom live tutorial for permanent reference.",
    ],
    deliverables: [
      {
        title: "Two 60-Minute Live Screen-Share Sessions",
        description: "Hands-on interactive coding working directly inside your statistical software environment.",
      },
      {
        title: "Custom Annotated Syntax Script",
        description: "Clean script file containing step-by-step comments explaining every function and argument.",
      },
      {
        title: "Session Video Recording",
        description: "Full HD recording of the session for step-by-step replay whenever you run future analyses.",
      },
    ],
    process_steps: [
      {
        step: 1,
        title: "Software & Goal Assessment",
        description: "Identify target software (R, SPSS, Stata, Python), sample dataset, and analytical goals.",
        typical_duration: "Day 1",
      },
      {
        step: 2,
        title: "Live Intensive Session 1",
        description: "60 minutes screen-sharing: data preparation, variable cleaning, and exploratory diagnostics.",
        typical_duration: "Scheduled",
      },
      {
        step: 3,
        title: "Live Intensive Session 2",
        description: "60 minutes: inferential model execution, assumption checks, and output visualization.",
        typical_duration: "Scheduled",
      },
      {
        step: 4,
        title: "Script & Recording Delivery",
        description: "Delivery of clean, documented syntax scripts and session video archive.",
        typical_duration: "Immediate",
      },
    ],
    sample_feedback: {
      title: "R Script Tutorial Notes: Moderation Modeling",
      manuscript_context: "1-on-1 live coding session setting up interaction terms in R.",
      original_text: "model <- lm(burnout ~ workload * support, data = df) # Error: object 'burnout' not found",
      annotated_excerpt: "# Step 1: Ensure factors are centered to prevent artificial multicollinearity:\ndf$workload_c <- scale(df$workload, center = TRUE, scale = FALSE)\ndf$support_c <- scale(df$support, center = TRUE, scale = FALSE)\n\n# Step 2: Fit model with centered terms:\nmodel_mod <- lm(burnout ~ workload_c * support_c, data = df)\nsummary(model_mod)",
      mentor_marginal_note: "Mentor note: Centering continuous predictors prior to computing product terms reduces non-essential multicollinearity and makes the main effect coefficients immediately interpretable at the mean.",
      actionable_takeaway: "Mean-center continuous interaction variables to preserve clean coefficient interpretability.",
      label: "Illustrative example",
    },
    software_tools: ["R / RStudio", "IBM SPSS Statistics", "Stata", "Python (Jupyter Notebooks)", "NVivo"],
    what_we_wont_do: [
      "We will not run your analyses and deliver results without your attendance and understanding.",
      "We will not manipulate data to fabricate statistical significance.",
    ],
    faqs: [
      {
        question: "Can we use my actual dissertation dataset during the call?",
        answer: "Yes, that is the primary value of this intensive. You share an anonymized dataset and we write the code together on your machine.",
      },
    ],
    related_service_slugs: ["quantitative-data-analysis", "structural-equation-modeling", "research-productivity-coaching"],
    related_post_slugs: ["r-vs-spss-for-dissertations", "cleaning-survey-data-in-r"],
    packages: [
      {
        id: "software-intensive-standard",
        name: "Software Intensive (2 Hours)",
        description: "Two 60-minute live screen-share sessions, annotated custom scripts, and session recordings.",
        price_ngn: 150000,
        price_usd: 105,
        rounds_of_feedback: "Two 60-min live sessions",
        turnaround: "Scheduled on demand",
        includes: ["Two 60-minute 1-on-1 live sessions", "Custom annotated syntax file", "Full HD session recordings", "Email follow-up for script debugging"],
      },
    ],
    seo: {
      meta_title: "1-on-1 Statistical Software Intensive (R, SPSS, Stata) — GradEdge",
      meta_description:
        "Learn R, SPSS, or Stata hands-on using your actual research dataset. 1-on-1 live screen-share coaching, reproducible syntax scripts, and recorded sessions.",
    },
  },

  "academic-career-postdoc-guidance": {
    slug: "academic-career-postdoc-guidance",
    title: "Academic Career & Postdoctoral Application Guidance",
    category: "coaching-and-training",
    category_name: "Coaching & Training",
    two_sentence_promise:
      "Transition from doctoral candidate to employed academic researcher. We coach you on crafting competitive academic CVs, research statements, teaching philosophies, and preparing for faculty job talk presentations.",
    hero_image: "/images/services/stage-publishing.jpg",
    hero_image_alt: "Academic CV portfolio, teaching philosophy statement, and faculty application dossier",
    hero_summary:
      "Navigating the academic job market demands framing your research as an ongoing, fundable research agenda rather than just a finished student dissertation. We help you assemble a competitive faculty application dossier and prepare for academic interviews.",
    format_text: "Dossier review + 60-minute academic job market strategy call",
    turnaround_text: "5 to 7 working days",
    best_for: "Finishing doctoral candidates & postdocs applying for academic jobs",
    starting_price_ngn: 180000,
    starting_price_usd: 125,
    who_its_for: [
      "PhD candidates entering the academic job market for lecturer, assistant professor, or postdoctoral positions.",
      "Scholars needing strategic feedback on their academic CV, research statement, and teaching dossier.",
      "Candidates invited to campus interviews who need to prepare their job talk and teaching demonstration.",
    ],
    signs_you_need_this: [
      "Your CV reads like an industry résumé rather than an academic curriculum vitae.",
      "Your research statement only describes your past dissertation rather than your future 5-year funded pipeline.",
      "You have submitted 20 academic applications without being shortlisted for an interview.",
    ],
    outcomes: [
      "A high-impact academic CV formatted to international higher education hiring standards.",
      "A compelling Research Statement presenting a viable 3-to-5 year scholarly pipeline.",
      "Preparation to handle faculty hiring committee interviews and job talk presentations with confidence.",
    ],
    deliverables: [
      {
        title: "Academic CV Substantive Critique",
        description: "Line-level audit organizing publications, funding, teaching, and service to highlight academic standing.",
      },
      {
        title: "Research Statement Strategic Review",
        description: "Refinement of your future scholarly agenda, funding trajectory, and institutional fit.",
      },
      {
        title: "Teaching Philosophy Statement Audit",
        description: "Feedback grounding your pedagogical values in concrete classroom evidence.",
      },
      {
        title: "60-Minute Faculty Job Market Call",
        description: "Live consultation reviewing search strategies, job talk design, and campus interview expectations.",
      },
    ],
    process_steps: [
      {
        step: 1,
        title: "Dossier & Target Institution Intake",
        description: "Submit current CV, research statement, teaching statement, and sample job advertisements.",
        typical_duration: "Day 1",
      },
      {
        step: 2,
        title: "Dossier Review & Strategy Audit",
        description: "Mentor critiques materials from the perspective of an academic search committee chair.",
        typical_duration: "Days 2 to 4",
      },
      {
        step: 3,
        title: "Strategy Video Consultation",
        description: "60-minute session reviewing dossier refinements and practicing faculty interview responses.",
        typical_duration: "Day 5",
      },
    ],
    sample_feedback: {
      title: "Research Statement Review: Faculty Application",
      manuscript_context: "Doctoral graduate applying for Assistant Professor positions.",
      original_text: "My future research will continue to look at what I did in my dissertation.",
      annotated_excerpt: "Over the next three years, my research agenda expands the empirical foundations of my dissertation across two funded trajectories: first, a comparative cross-national investigation targeting a British Academy Small Grant (Year 1); second, an applied policy translation initiative partnering with municipal health authorities (Years 2–3).",
      mentor_marginal_note: "Mentor note: Search committees want to see that you have an independent, fundable research identity beyond your dissertation supervisor. Outline specific future grants and peer-reviewed journal targets.",
      actionable_takeaway: "Articulate a forward-looking 3-year research and grant-seeking pipeline.",
      label: "Illustrative example",
    },
    software_tools: ["LaTeX / Word CV Templates", "ORCID Profile Setup", "Google Scholar Metrics"],
    what_we_wont_do: [
      "We will not write your application statements or fabricate teaching evaluations.",
      "We will not guarantee academic job offers or shortlisting.",
    ],
    faqs: [
      {
        question: "Can you help prepare for the job talk presentation?",
        answer: "Yes. In our consultation, we critique your job talk slide outline, structure, and timing to appeal to both specialists and general faculty in the department.",
      },
    ],
    related_service_slugs: ["grant-scholarship-coaching", "journal-article-conversion", "defense-presentation-coaching"],
    related_post_slugs: ["crafting-an-academic-cv-that-stands-out", "transitioning-from-phd-to-postdoc"],
    packages: [
      {
        id: "career-dossier-standard",
        name: "Academic Career Dossier Mentorship",
        description: "Complete review of CV, research statement, teaching philosophy, and a 60-minute strategy call.",
        price_ngn: 180000,
        price_usd: 125,
        rounds_of_feedback: "1 full dossier review + 1 call",
        turnaround: "5 working days",
        includes: ["Academic CV line-level critique", "Research Statement review", "Teaching Philosophy feedback", "60-minute job market strategy session"],
      },
    ],
    seo: {
      meta_title: "Academic Career & Postdoctoral Application Guidance — GradEdge",
      meta_description:
        "Prepare for the academic job market. Craft high-impact academic CVs, research statements, and prepare for faculty job talk interviews with expert mentoring.",
    },
  },
};

export function getAllServices(): ServiceContentItem[] {
  return Object.values(SERVICES_CONTENT);
}

export function getServiceBySlug(slug: string): ServiceContentItem | undefined {
  return SERVICES_CONTENT[slug];
}

export function getServicesByCategory(category: string): ServiceContentItem[] {
  return Object.values(SERVICES_CONTENT).filter((s) => s.category === category);
}

export function getRelatedServices(slug: string, count = 3): ServiceContentItem[] {
  const current = SERVICES_CONTENT[slug];
  if (!current) return Object.values(SERVICES_CONTENT).slice(0, count);

  const related = current.related_service_slugs
    .map((s) => SERVICES_CONTENT[s])
    .filter(Boolean) as ServiceContentItem[];

  if (related.length >= count) return related.slice(0, count);

  // Fallback to same category services
  const sameCategory = Object.values(SERVICES_CONTENT).filter(
    (s) => s.category === current.category && s.slug !== slug && !related.find((r) => r.slug === s.slug)
  );

  return [...related, ...sameCategory].slice(0, count);
}

