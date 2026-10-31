import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { createClient } from "@supabase/supabase-js";
import { SERVICES_CONTENT } from "../lib/data/services-content";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const isClean = process.argv.includes("--clean");

async function cleanSeedData() {
  console.log("Cleaning GradEdge seed data...");

  // Delete test student profiles and private mentors
  await supabase.from("mentors").delete().neq("profile_id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("projects").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("bookings").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("packages").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("services").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("membership_plans").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("faqs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("blog_posts").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("blog_categories").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("subjects").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  console.log("✓ Seed data removed cleanly.");
}

async function runSeed() {
  if (isClean) {
    await cleanSeedData();
    return;
  }

  console.log("==================================================");
  console.log("Seeding GradEdge Academic Solutions Database");
  console.log("==================================================");

  // 1. SERVICES (20 Core Services across 5 categories)
  console.log("1. Seeding 20 core services and rich editorial content...");
  const servicesList = Object.values(SERVICES_CONTENT);
  const servicesData = servicesList.map((s, idx) => ({
    slug: s.slug,
    title: s.title,
    category: s.category,
    summary: s.hero_summary,
    description: s.two_sentence_promise,
    price_from_minor: s.starting_price_usd * 100,
    currency: "USD",
    delivery_mode: s.slug.includes("coaching") || s.slug.includes("intensive") ? "session" : "project",
    sort_order: idx + 1,
  }));

  const { data: insertedServices, error: serviceErr } = await supabase
    .from("services")
    .upsert(servicesData, { onConflict: "slug" })
    .select();

  if (serviceErr) throw serviceErr;
  console.log(`✓ Inserted ${insertedServices.length} services.`);

  // 1b. Seed service_content
  try {
    const serviceContentData = servicesList.map((s) => {
      const match = insertedServices.find((ins) => ins.slug === s.slug);
      return {
        service_id: match?.id,
        slug: s.slug,
        hero_image: s.hero_image,
        hero_summary: s.hero_summary,
        two_sentence_promise: s.two_sentence_promise,
        who_its_for: s.who_its_for,
        signs_you_need_this: s.signs_you_need_this,
        outcomes: s.outcomes,
        deliverables: s.deliverables,
        process_steps: s.process_steps,
        sample_feedback: s.sample_feedback,
        software_tools: s.software_tools,
        turnaround_text: s.turnaround_text,
        format_text: s.format_text,
        best_for: s.best_for,
        what_we_wont_do: s.what_we_wont_do,
        faqs: s.faqs,
        related_service_slugs: s.related_service_slugs,
        related_post_slugs: s.related_post_slugs,
        packages: s.packages,
        seo: s.seo,
      };
    });

    await supabase.from("service_content").upsert(serviceContentData, { onConflict: "slug" });
    console.log(`✓ Inserted ${serviceContentData.length} service_content records.`);
  } catch (err) {
    console.log("Note: service_content table insert skipped or pending migration:", err);
  }

  // 2. PACKAGES FOR MAIN SERVICES
  console.log("2. Seeding packages for main services...");
  const mentoringService = insertedServices.find((s) => s.slug === "dissertation-thesis-mentoring");
  const statsService = insertedServices.find((s) => s.slug === "quantitative-data-analysis");
  const editingService = insertedServices.find((s) => s.slug === "academic-editing-proofreading");

  const packagesData = [
    // Mentoring packages
    {
      service_id: mentoringService?.id,
      name: "Single Chapter Intensive Review",
      description: "In-depth review of one draft chapter (up to 8,000 words) with written feedback and a 60-minute strategy call.",
      price_minor: 35000,
      currency: "USD",
      includes: ["Written line-by-line developmental notes", "Structural alignment analysis", "60-minute 1-on-1 video call", "Follow-up revision checklist"],
    },
    {
      service_id: mentoringService?.id,
      name: "Three-Chapter Core Pathway",
      description: "Comprehensive guidance for proposal or core chapters (Introduction, Literature Review, Methodology).",
      price_minor: 95000,
      currency: "USD",
      includes: ["Three iterative chapter reviews", "Three 60-minute strategy consultations", "Committee feedback navigation", "Email check-in support between sessions"],
    },
    {
      service_id: mentoringService?.id,
      name: "Full Dissertation Mentorship",
      description: "End-to-end milestone mentoring from methodology through final defense preparation.",
      price_minor: 185000,
      currency: "USD",
      includes: ["All dissertation chapters reviewed", "Bi-weekly video consultations", "Methodology and data audit", "Mock viva/defense examination"],
    },
    // Quantitative packages
    {
      service_id: statsService?.id,
      name: "Model Specification & Syntax Review",
      description: "Review of statistical hypotheses, variable operationalization, and analysis syntax (R / SPSS / Stata).",
      price_minor: 30000,
      currency: "USD",
      includes: ["Assumption testing evaluation", "Syntax script verification", "45-minute live walkthrough"],
    },
    {
      service_id: statsService?.id,
      name: "Complete Statistical Audit & Results Structuring",
      description: "Full dataset verification, assumption diagnostics, inferential test execution review, and APA results tables.",
      price_minor: 65000,
      currency: "USD",
      includes: ["Full data cleaning audit", "Assumption test documentation", "APA 7 format summary tables", "Two 60-minute mentoring sessions"],
    },
    // Editing packages
    {
      service_id: editingService?.id,
      name: "Standard Chapter Proofreading",
      description: "Grammar, punctuation, academic style, and clarity check up to 10,000 words.",
      price_minor: 22000,
      currency: "USD",
      includes: ["Tracked changes document", "Clean final document", "Style sheet reference"],
    },
    {
      service_id: editingService?.id,
      name: "Full Dissertation Substantive Edit",
      description: "Thorough developmental and line editing across entire thesis manuscript up to 60,000 words.",
      price_minor: 95000,
      currency: "USD",
      includes: ["Deep line editing", "Flow and argument coherence", "Citation concord check", "Post-review revision call"],
    },
  ];

  await supabase.from("packages").upsert(packagesData);
  console.log("✓ Inserted service packages.");

  // 3. MEMBERSHIP PLANS (3 plans)
  console.log("3. Seeding 3 membership plans...");
  const membershipPlansData = [
    {
      name: "Research Scholar Membership",
      description: "Ideal for self-directed researchers needing ongoing access to academic workshops and monthly feedback.",
      price_minor: 4900,
      currency: "USD",
      interval: "month",
      paystack_plan_code: "PLN_scholar_monthly",
      perks: [
        "Monthly 45-minute 1-on-1 mentoring session",
        "Access to monthly live research methodology workshops",
        "Library of dissertation templates and audit checklists",
        "Priority scheduling for support requests",
      ],
      is_active: true,
    },
    {
      name: "Doctoral Fellow Membership",
      description: "Designed for active doctoral researchers actively drafting and requiring regular accountability.",
      price_minor: 9900,
      currency: "USD",
      interval: "month",
      paystack_plan_code: "PLN_doctoral_monthly",
      perks: [
        "Two monthly 60-minute 1-on-1 mentoring sessions",
        "Direct message access to matched mentor",
        "Monthly review of up to 4,000 words of drafts",
        "All workshops and methodology masterclasses",
        "Quarterly dissertation progress milestone review",
      ],
      is_active: true,
    },
    {
      name: "Annual Research Scholar",
      description: "Full year of continuous doctoral support at a preferential annual rate.",
      price_minor: 95000,
      currency: "USD",
      interval: "year",
      paystack_plan_code: "PLN_scholar_annual",
      perks: [
        "Everything in Doctoral Fellow membership",
        "Save over 20% compared to monthly billing",
        "Priority defense coaching sprint included",
        "Free journal article conversion consultation",
      ],
      is_active: true,
    },
  ];

  await supabase.from("membership_plans").upsert(membershipPlansData);
  console.log("✓ Inserted membership plans.");

  // 4. FAQS (8 FAQs strictly respecting academic integrity and privacy)
  console.log("4. Seeding 8 FAQs...");
  const faqsData = [
    {
      category: "Academic Integrity",
      question: "Does GradEdge write dissertations, proposals, or code for students?",
      answer: "No. GradEdge operates strictly as an academic coaching, developmental feedback, and research mentoring consultancy. We do not write student papers, complete course assessments, or guarantee specific grades. The student is the sole author of their work. We teach you how to refine your arguments, master your methodology, and navigate supervisory feedback.",
      sort_order: 1,
      is_published: true,
    },
    {
      category: "Mentors & Privacy",
      question: "Who are the mentors and how are they assigned?",
      answer: "Every GradEdge mentor holds an earned postgraduate degree (Master's or PhD) and has demonstrated expertise in research methodology and scholarly publishing. We match you with a mentor based on your specific discipline and research needs. To preserve mentor privacy and prevent unsolicited outreach, mentor profiles are never listed publicly. Once a mentor is assigned to your support request, you can view their academic profile inside your student dashboard.",
      sort_order: 2,
      is_published: true,
    },
    {
      category: "Sessions & Consultations",
      question: "How do 1-on-1 consultations and mentoring sessions work?",
      answer: "Sessions take place over private, encrypted video calls. Before each consultation, you can submit your draft excerpts, questions, or committee comments. During the call, your mentor walks through specific sections, offers constructive critique, and helps you formulate an actionable revision plan.",
      sort_order: 3,
      is_published: true,
    },
    {
      category: "Data Analysis",
      question: "What statistical software and qualitative tools do you support?",
      answer: "Our statistical mentors provide hands-on coaching across SPSS, R, Python, Stata, SAS, and GraphPad Prism for quantitative research. For structural equation modeling, we support SmartPLS and AMOS. For qualitative research, we coach researchers on NVivo, Atlas.ti, and manual reflexive thematic analysis frameworks.",
      sort_order: 4,
      is_published: true,
    },
    {
      category: "Process",
      question: "What happens after I submit a support request?",
      answer: "Our academic team reviews your project brief, study level, and timeline within 24 hours. We match your request with an available specialist in your field, confirm the scope and package requirements, and assign the project. You will receive notification to view the project details and schedule your first milestone session.",
      sort_order: 5,
      is_published: true,
    },
    {
      category: "Accelerator",
      question: "What is the 9-Month Dissertation Accelerator Program?",
      answer: "The Accelerator is an intensive doctoral cohort program tailored for PhD and professional doctorate candidates in their writing phase. It combines structured monthly milestone audits, dedicated bi-weekly 1-on-1 coaching, statistical review checkpoints, and defense preparation to bring candidates to completion within nine months.",
      sort_order: 6,
      is_published: true,
    },
    {
      category: "Payments",
      question: "Which currencies and payment methods are supported?",
      answer: "We accept secure payments globally through Paystack, supporting major credit/debit cards, bank transfers, and local payment methods in USD and NGN. Sequential invoices are generated automatically for all completed transactions.",
      sort_order: 7,
      is_published: true,
    },
    {
      category: "Confidentiality",
      question: "Is my research data and unpublished work kept confidential?",
      answer: "Yes, strictly. All drafts, datasets, and consultation discussions are bound by non-disclosure agreements. We never share, publish, or train AI models on student manuscripts or research files.",
      sort_order: 8,
      is_published: true,
    },
  ];

  await supabase.from("faqs").upsert(faqsData);
  console.log("✓ Inserted 8 FAQs.");

  // 5. SUBJECTS (Full list including health sciences sub-fields)
  console.log("5. Seeding subjects (with health sciences hierarchy)...");
  // First insert top-level subjects
  const parentSubjects = [
    { slug: "health-sciences", title: "Health Sciences & Medicine", summary: "Clinical medicine, epidemiology, public health, nursing, and biomedical research.", description: "Comprehensive coaching for medical and allied health researchers navigating institutional review boards, clinical trial protocols, and systematic reviews.", sort_order: 1 },
    { slug: "social-sciences-education", title: "Social Sciences & Education", summary: "Sociology, anthropology, pedagogy, education policy, and curriculum studies.", description: "Methodological support for qualitative phenomenology, surveys, mixed-methods research, and classroom interventions.", sort_order: 2 },
    { slug: "business-management-finance", title: "Business, Management & Finance", summary: "Corporate strategy, econometrics, organizational behavior, and marketing research.", description: "Quantitative econometric modeling, survey design, structural equation modeling (PLS-SEM), and case study research.", sort_order: 3 },
    { slug: "humanities-literature-history", title: "Humanities, Literature & History", summary: "Cultural studies, philosophical inquiries, historiography, and literary analysis.", description: "Archival research structuring, textual analysis, critical theory, and extended narrative argument development.", sort_order: 4 },
    { slug: "computer-science-it", title: "Computer Science & Information Technology", summary: "Machine learning, data science, human-computer interaction, and software systems.", description: "Algorithm benchmarking, empirical software engineering studies, and reproducible technical evaluations.", sort_order: 5 },
    { slug: "engineering-physical-sciences", title: "Engineering & Physical Sciences", summary: "Mechanical, electrical, civil engineering, physics, and applied mathematics.", description: "Experimental design, mathematical modeling, numerical simulations, and technical manuscript structuring.", sort_order: 6 },
    { slug: "environmental-sciences-agriculture", title: "Environmental Sciences & Agriculture", summary: "Ecology, climate adaptation, agronomy, and sustainability policy.", description: "Spatial analysis, environmental impact assessment methodologies, and longitudinal field data analysis.", sort_order: 7 },
    { slug: "law-criminology-policy", title: "Law, Criminology & Policy Studies", summary: "Jurisprudence, comparative law, criminal justice, and public administration.", description: "Doctrinal legal research, socio-legal empirical studies, and policy evaluation frameworks.", sort_order: 8 },
    { slug: "psychology-behavioural-sciences", title: "Psychology & Behavioural Sciences", summary: "Clinical psychology, cognitive science, psychometrics, and experimental psychology.", description: "Psychometric scale validation, experimental design, ANOVA/MANOVA, and neuroimaging data reporting.", sort_order: 9 },
  ];

  const { data: insertedParents } = await supabase
    .from("subjects")
    .upsert(parentSubjects, { onConflict: "slug" })
    .select();

  const healthParent = insertedParents?.find((s) => s.slug === "health-sciences");

  if (healthParent) {
    const healthSubFields = [
      { slug: "clinical-medicine-surgery", title: "Clinical Medicine & Surgery", parent_id: healthParent.id, summary: "Clinical trials, case series, surgical outcome studies, and diagnostic accuracy reviews.", description: "Mentoring on CONSORT guidelines, clinical trial registrations, and patient-reported outcome measures.", sort_order: 10 },
      { slug: "public-health-epidemiology", title: "Public Health & Epidemiology", parent_id: healthParent.id, summary: "Disease surveillance, cohort studies, biostatistics, and global health interventions.", description: "Support for STROBE guidelines, odds ratio interpretation, survival analysis, and public health policy reviews.", sort_order: 11 },
      { slug: "nursing-midwifery", title: "Nursing & Midwifery", parent_id: healthParent.id, summary: "Evidence-based practice, patient care protocols, qualitative clinical studies.", description: "Guidance on clinical audits, quality improvement projects, and mixed-method healthcare inquiries.", sort_order: 12 },
      { slug: "biomedical-sciences-pharmacology", title: "Biomedical Sciences & Pharmacology", parent_id: healthParent.id, summary: "Molecular biology, pharmacokinetics, cell assays, and translational medicine.", description: "In vitro and in vivo experimental protocol design, dose-response modeling, and laboratory manuscript structuring.", sort_order: 13 },
      { slug: "health-informatics-systems", title: "Health Informatics & Health Systems", parent_id: healthParent.id, summary: "Electronic health records, telemedicine evaluations, and health administration.", description: "Implementation science frameworks, usability evaluations, and healthcare analytics.", sort_order: 14 },
    ];
    await supabase.from("subjects").upsert(healthSubFields, { onConflict: "slug" });
  }
  console.log("✓ Inserted subjects and health sciences sub-fields.");

  // 6. BLOG CATEGORIES (9 categories)
  console.log("6. Seeding 9 blog categories...");
  const blogCategoriesData = [
    { slug: "dissertation-methodology", name: "Dissertation Methodology", description: "Design principles, sampling strategies, and methodological defense.", sort_order: 1 },
    { slug: "statistical-analysis", name: "Statistical Analysis", description: "Quantitative techniques, software syntax tutorials, and assumption diagnostics.", sort_order: 2 },
    { slug: "literature-reviews", name: "Literature Reviews", description: "Systematic review protocols, theoretical gap identification, and synthesis techniques.", sort_order: 3 },
    { slug: "academic-writing-editing", name: "Academic Writing & Editing", description: "Clarity, coherence, scholarly voice, and developmental chapter structuring.", sort_order: 4 },
    { slug: "defense-preparation", name: "Defense Preparation", description: "Viva voce strategies, committee objection handling, and presentation slides.", sort_order: 5 },
    { slug: "ethics-research-integrity", name: "Ethics & Research Integrity", description: "Institutional Review Board (IRB) protocols, consent mechanics, and research ethics.", sort_order: 6 },
    { slug: "publishing-peer-reviewed", name: "Publishing in Peer-Reviewed Journals", description: "Manuscript conversion, journal selection, and addressing reviewer comments.", sort_order: 7 },
    { slug: "academic-productivity", name: "Academic Productivity", description: "Thesis chapter sprint planning, avoiding burnout, and supervisor management.", sort_order: 8 },
    { slug: "grant-writing-scholarships", name: "Grant Writing & Scholarships", description: "Funding proposals, statements of significance, and fellowship applications.", sort_order: 9 },
  ];

  const { data: insertedCategories } = await supabase
    .from("blog_categories")
    .upsert(blogCategoriesData, { onConflict: "slug" })
    .select();
  console.log("✓ Inserted blog categories.");

  // 7. PRIVATE MENTORS (4 Seed Mentors: Initials only, strictly private, NEVER public)
  console.log("7. Seeding 4 private mentors (strictly internal)...");
  const mentorSeedData = [
    {
      email: "mentor.er@gradedge.internal",
      full_name: "Dr. E. R.",
      role: "mentor",
      headline: "Senior Biostatistician & Quantitative Methodology Specialist",
      bio: "Holds an earned PhD in Biostatistics. Over 12 years of experience mentoring doctoral researchers on complex statistical modeling, survival analysis, and parametric assumptions.",
      credentials: "PhD Biostatistics, MSc Applied Mathematics",
      disciplines: ["Health Sciences", "Epidemiology", "Public Health", "Psychometrics"],
      software: ["R", "SPSS", "Stata", "Python"],
      sort_order: 1,
    },
    {
      email: "mentor.mk@gradedge.internal",
      full_name: "Dr. M. K.",
      role: "mentor",
      headline: "Qualitative Inquiry Director & Social Science Methodologist",
      bio: "Holds an earned PhD in Sociology. Specializes in reflexive thematic analysis, phenomenological interviewing, and qualitative codebook construction.",
      credentials: "PhD Sociology, MEd Higher Education Research",
      disciplines: ["Social Sciences", "Education", "Humanities", "Nursing"],
      software: ["NVivo", "Atlas.ti", "MAXQDA"],
      sort_order: 2,
    },
    {
      email: "mentor.at@gradedge.internal",
      full_name: "Dr. A. T.",
      role: "mentor",
      headline: "Econometrics & Business Analytics Research Lead",
      bio: "Holds an earned PhD in Applied Economics. Advises business and finance researchers on panel data econometrics, time series analysis, and structural equation modeling.",
      credentials: "PhD Economics, MSc Financial Econometrics",
      disciplines: ["Business", "Finance", "Management", "Public Policy"],
      software: ["Stata", "R", "SmartPLS", "EViews"],
      sort_order: 3,
    },
    {
      email: "mentor.sj@gradedge.internal",
      full_name: "Dr. S. J.",
      role: "mentor",
      headline: "Translational Medicine & Systematic Review Consultant",
      bio: "Holds an earned doctorate in Biomedical Science. Specialist in PRISMA systematic reviews, meta-analyses, and ethics board navigation.",
      credentials: "PhD Biomedical Sciences, BSc (Hons) Pharmacology",
      disciplines: ["Biomedical Sciences", "Clinical Medicine", "Pharmacology"],
      software: ["RevMan", "GraphPad Prism", "EndNote"],
      sort_order: 4,
    },
  ];

  const insertedMentors = [];
  for (const m of mentorSeedData) {
    // Check or create auth user
    let userId: string;
    const { data: userList } = await supabase.auth.admin.listUsers();
    const existing = userList?.users?.find((u) => u.email === m.email);

    if (existing) {
      userId = existing.id;
    } else {
      const { data: createdUser, error: createErr } = await supabase.auth.admin.createUser({
        email: m.email,
        password: "SeedPassword123!Secure",
        email_confirm: true,
      });
      if (createErr || !createdUser.user) throw createErr;
      userId = createdUser.user.id;
    }

    // Upsert profile
    await supabase.from("profiles").upsert({
      id: userId,
      role: "mentor",
      full_name: m.full_name,
      email: m.email,
      study_level: "researcher",
      institution: "GradEdge Academic Advisory Pool",
      field_of_study: m.disciplines[0],
      status: "active",
    });

    // Upsert mentor private record
    await supabase.from("mentors").upsert({
      profile_id: userId,
      headline: m.headline,
      bio: m.bio,
      credentials: m.credentials,
      disciplines: m.disciplines,
      software: m.software,
      sort_order: m.sort_order,
    });

    insertedMentors.push({ id: userId, ...m });
  }
  console.log("✓ Inserted 4 private mentors.");

  // 8. SAMPLE BLOG DRAFTS (3 clearly marked sample drafts: status draft, never published)
  console.log("8. Seeding 3 sample blog drafts (status: draft)...");
  const methodologyCat = insertedCategories?.find((c) => c.slug === "dissertation-methodology");
  const statsCat = insertedCategories?.find((c) => c.slug === "statistical-analysis");
  const writingCat = insertedCategories?.find((c) => c.slug === "academic-writing-editing");

  const sampleBlogDrafts = [
    {
      slug: "structuring-audit-proof-methodology-chapter",
      title: "Structuring an Audit-Proof Methodology Chapter: Principles of Replicability",
      standfirst: "A rigorous methodology chapter does not simply report what you did: it justifies every analytical decision against competing alternatives.",
      body: {
        type: "markdown",
        content: "A dissertation methodology chapter serves as the operational spine of your entire research project. External examiners scrutinize this chapter with specific criteria: epistemological alignment, sampling justification, instrument validity, and analytical transparency. This guide details how to construct each section with defensible scholarly precision.",
      },
      category_id: methodologyCat?.id,
      status: "draft", // Stays in draft: never published
      author_name: "GradEdge Team",
      reading_time_minutes: 8,
      seo_title: "Structuring an Audit-Proof Methodology Chapter | GradEdge",
      seo_description: "Learn how to structure your doctoral methodology chapter to withstand committee review.",
      is_featured: false,
    },
    {
      slug: "common-pitfalls-in-thematic-analysis",
      title: "Common Pitfalls in Thematic Analysis: Moving Beyond Superficial Code Summaries",
      standfirst: "Why simply summarizing interview transcripts is not qualitative analysis, and how to build interpretive thematic depth.",
      body: {
        type: "markdown",
        content: "Many postgraduate researchers fall into the trap of using qualitative software to generate frequency counts of interview topics rather than conducting genuine thematic synthesis. We examine Braun and Clarke's reflexive framework and demonstrate how to move from semantic descriptions to conceptual themes.",
      },
      category_id: statsCat?.id,
      status: "draft", // Stays in draft: never published
      author_name: "GradEdge Team",
      reading_time_minutes: 6,
      seo_title: "Pitfalls in Qualitative Thematic Analysis | GradEdge",
      seo_description: "How to avoid superficial summaries and conduct rigorous reflexive thematic analysis.",
      is_featured: false,
    },
    {
      slug: "navigating-conflicting-supervisor-feedback",
      title: "Navigating Conflicting Committee Feedback Without Derailing Your Timeline",
      standfirst: "Practical strategies for synthesizing opposing recommendations from multiple supervisors with professional composure.",
      body: {
        type: "markdown",
        content: "When supervisor A recommends expanding your theoretical framework and supervisor B demands you cut 5,000 words, candidates often freeze. We outline an objective matrix technique for de-personalizing feedback, documenting consensus, and drafting respectful response memos.",
      },
      category_id: writingCat?.id,
      status: "draft", // Stays in draft: never published
      author_name: "GradEdge Team",
      reading_time_minutes: 7,
      seo_title: "Navigating Supervisor Feedback Conflicts | GradEdge",
      seo_description: "How to resolve conflicting advice between thesis committee members.",
      is_featured: false,
    },
  ];

  await supabase.from("blog_posts").upsert(sampleBlogDrafts, { onConflict: "slug" });
  console.log("✓ Inserted 3 sample blog drafts.");

  // 9. SAMPLE STUDENTS, PROJECTS & BOOKINGS (10 diverse students)
  console.log("9. Seeding 10 sample students with realistic projects and bookings...");
  const sampleStudents = [
    { name: "Freedom Sola", email: "freedom.sola@university.edu", study_level: "phd", institution: "University Research Scholar", field: "Public Health", projectTitle: "Epidemiological Analysis of Maternal Health Access in Rural Districts", serviceSlug: "dissertation-thesis-mentoring", mentorIndex: 0 },
    { name: "Freedom Sola (Economics)", email: "freedom.sola.econ@university.edu", study_level: "phd", institution: "Research Institute", field: "Economics", projectTitle: "Panel Econometrics on Carbon Pricing Mechanisms Across European Industries", serviceSlug: "quantitative-data-analysis", mentorIndex: 2 },
    { name: "Freedom Sola (Informatics)", email: "freedom.sola.info@university.edu", study_level: "masters", institution: "University College", field: "Health Informatics", projectTitle: "Predictive Analytics for Early Hospital Readmission Detection", serviceSlug: "quantitative-data-analysis", mentorIndex: 0 },
    { name: "Freedom Sola (Psychology)", email: "freedom.sola.psych@university.edu", study_level: "phd", institution: "Academic Centre", field: "Clinical Psychology", projectTitle: "Structural Equation Modeling of Neurocognitive Stress Biomarkers", serviceSlug: "structural-equation-modeling", mentorIndex: 2 },
    { name: "Freedom Sola (Education)", email: "freedom.sola.edu@university.edu", study_level: "masters", institution: "Faculty of Education", field: "Education", projectTitle: "Qualitative Phenomenology of Hybrid Learning Experiences in Sub-Saharan Universities", serviceSlug: "qualitative-data-analysis", mentorIndex: 1 },
    { name: "Freedom Sola (Biomedical)", email: "freedom.sola.biomed@university.edu", study_level: "phd", institution: "Medical Faculty", field: "Biomedical Science", projectTitle: "Systematic Review Protocol & Meta-Analysis on Cardiovascular Biomarkers", serviceSlug: "literature-review-support", mentorIndex: 3 },
    { name: "Freedom Sola (Policy)", email: "freedom.sola.policy@university.edu", study_level: "masters", institution: "School of Public Policy", field: "Environmental Policy", projectTitle: "Policy Evaluation & Ethics Protocol for Urban Renewable Energy Transitions", serviceSlug: "research-design-ethics", mentorIndex: 1 },
    { name: "Freedom Sola (Sociology)", email: "freedom.sola.soc@university.edu", study_level: "phd", institution: "Institute of Social Inquiry", field: "Sociology", projectTitle: "Mixed-Methods Research Design on Urban Displacement and Community Resilience", serviceSlug: "dissertation-thesis-mentoring", mentorIndex: 1 },
    { name: "Freedom Sola (Finance)", email: "freedom.sola.fin@university.edu", study_level: "masters", institution: "Graduate School of Business", field: "Finance", projectTitle: "High-Frequency Financial Volatility Modeling using R and GARCH Specifications", serviceSlug: "quantitative-data-analysis", mentorIndex: 2 },
    { name: "Freedom Sola (Health Systems)", email: "freedom.sola.hs@university.edu", study_level: "phd", institution: "School of Health Systems", field: "Health Systems", projectTitle: "Implementation Science Framework for Electronic Health Records Adoption", serviceSlug: "dissertation-accelerator-program", mentorIndex: 0 },
  ];

  for (let i = 0; i < sampleStudents.length; i++) {
    const s = sampleStudents[i];
    let studentId: string;

    const { data: userList } = await supabase.auth.admin.listUsers();
    const existing = userList?.users?.find((u) => u.email === s.email);

    if (existing) {
      studentId = existing.id;
    } else {
      const { data: createdUser, error: createErr } = await supabase.auth.admin.createUser({
        email: s.email,
        password: "SeedPassword123!Secure",
        email_confirm: true,
      });
      if (createErr || !createdUser.user) throw createErr;
      studentId = createdUser.user.id;
    }

    // Upsert student profile
    await supabase.from("profiles").upsert({
      id: studentId,
      role: "student",
      full_name: s.name,
      email: s.email,
      study_level: s.study_level,
      institution: s.institution,
      field_of_study: s.field,
      status: "active",
    });

    const targetService = insertedServices.find((ser) => ser.slug === s.serviceSlug) || insertedServices[0];
    const assignedMentor = insertedMentors[s.mentorIndex];

    // Upsert sample project (support request)
    const { data: project } = await supabase
      .from("projects")
      .insert({
        student_id: studentId,
        mentor_id: assignedMentor.id,
        service_id: targetService.id,
        title: s.projectTitle,
        brief: `Mentoring brief for ${s.field} study focusing on research design, chapter feedback, and statistical validation.`,
        status: i % 2 === 0 ? "active" : "scoping",
        due_date: new Date(Date.now() + (30 + i * 15) * 86400000).toISOString().split("T")[0],
      })
      .select()
      .single();

    if (project) {
      // Add milestone for active projects
      await supabase.from("milestones").insert([
        {
          project_id: project.id,
          title: "Milestone 1: Preliminary Draft Audit & Methodology Critique",
          description: "Mentor review of methodology outline and initial dataset structure.",
          status: "done",
          sort_order: 1,
        },
        {
          project_id: project.id,
          title: "Milestone 2: Empirical Results & Discussion Revision",
          description: "Revision of empirical chapters and committee feedback integration.",
          status: "in_progress",
          sort_order: 2,
        },
      ]);

      // Add a booking with the assigned mentor
      const bookingStart = new Date(Date.now() + (i + 1) * 86400000 + 10 * 3600000);
      const bookingEnd = new Date(bookingStart.getTime() + 60 * 60000);

      await supabase.from("bookings").insert({
        student_id: studentId,
        mentor_id: assignedMentor.id,
        service_id: targetService.id,
        project_id: project.id,
        starts_at: bookingStart.toISOString(),
        ends_at: bookingEnd.toISOString(),
        status: "confirmed",
        meeting_url: "https://meet.gradedge.internal/session-room",
        notes: "Detailed review of Chapter 3 and statistical models.",
      });
    }
  }

  console.log("✓ Inserted 10 sample students, projects, milestones, and confirmed bookings.");
  console.log("\n==================================================");
  console.log("Database Seeding Completed Successfully!");
  console.log("To remove seed data at any time, run: npm run seed:clean");
  console.log("==================================================");
}

runSeed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});

