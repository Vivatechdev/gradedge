/**
 * Single source of truth for all public navigation links.
 * Used by: PublicHeader, PublicFooter, mobile menu, /sitemap page, sitemap.xml.
 * Edit here — all consumers update automatically.
 */

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
}

export const PRIMARY_NAV: NavItem[] = [
  {
    label: "Services",
    href: "/services",
    children: [
      {
        label: "Dissertation Support",
        href: "/services/dissertation-support",
        description: "Mentoring, proposal development, literature review and research design",
      },
      {
        label: "Data Analysis",
        href: "/services/data-analysis",
        description: "SPSS, R, Python, Stata, NVivo, SmartPLS",
      },
      {
        label: "Editing & Writing Quality",
        href: "/services/editing-and-writing-quality",
        description: "Academic editing, proofreading, referencing and similarity review",
      },
      {
        label: "Publishing & Career",
        href: "/services/publishing-and-career",
        description: "Journal conversion, grant coaching and conference support",
      },
      {
        label: "Coaching & Training",
        href: "/services/coaching-and-training",
        description: "Tutoring, workshops and defense preparation",
      },
    ],
  },
  {
    label: "Accelerator",
    href: "/accelerator",
    description: "Nine-month structured programme for doctoral candidates",
  },
  {
    label: "Membership",
    href: "/membership",
    description: "Monthly and annual plans for ongoing mentoring",
  },
  {
    label: "Subject Areas",
    href: "/subjects",
    description: "Find support matched to your discipline",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "Blog",
    href: "/blog",
  },
];

export const FOOTER_COLUMNS: { heading: string; links: NavItem[] }[] = [
  {
    heading: "Services",
    links: [
      { label: "Dissertation Support", href: "/services/dissertation-support" },
      { label: "Data Analysis", href: "/services/data-analysis" },
      { label: "Editing & Proofreading", href: "/services/editing-and-writing-quality" },
      { label: "Publishing & Career", href: "/services/publishing-and-career" },
      { label: "Coaching & Training", href: "/services/coaching-and-training" },
      { label: "All Services", href: "/services" },
    ],
  },
  {
    heading: "Programmes",
    links: [
      { label: "Dissertation Accelerator", href: "/accelerator" },
      { label: "Membership Plans", href: "/membership" },
      { label: "Pricing", href: "/pricing" },
      { label: "Subject Areas", href: "/subjects" },
      { label: "Institutions", href: "/institutions" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Templates", href: "/resources/templates" },
      { label: "Guides", href: "/resources/guides" },
      { label: "Glossary", href: "/resources/glossary" },
      { label: "Student Stories", href: "/stories" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About GradEdge", href: "/about" },
      { label: "How It Works", href: "/about/how-it-works" },
      { label: "Academic Integrity", href: "/about/academic-integrity" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const LEGAL_LINKS: NavItem[] = [
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Academic Integrity Policy", href: "/legal/academic-integrity" },
  { label: "Refund Policy", href: "/legal/refunds" },
  { label: "Cookie Policy", href: "/legal/cookies" },
  { label: "Acceptable Use", href: "/legal/acceptable-use" },
  { label: "Disclaimer", href: "/legal/disclaimer" },
  { label: "Accessibility", href: "/accessibility" },
];

/** Flat list of all public URLs for sitemap generation */
export const ALL_STATIC_ROUTES: string[] = [
  "/",
  "/about",
  "/about/how-it-works",
  "/about/academic-integrity",
  "/services",
  "/services/dissertation-support",
  "/services/data-analysis",
  "/services/editing-and-writing-quality",
  "/services/publishing-and-career",
  "/services/coaching-and-training",
  "/accelerator",
  "/accelerator/faq",
  "/accelerator/apply",
  "/accelerator/application-received",
  "/membership",
  "/membership/join",
  "/subjects",
  "/pricing",
  "/blog",
  "/resources",
  "/resources/templates",
  "/resources/guides",
  "/resources/glossary",
  "/stories",
  "/institutions",
  "/institutions/workshops",
  "/institutions/request-a-workshop",
  "/institutions/partnerships",
  "/faq",
  "/contact",
  "/book",
  "/request-support",
  "/search",
  "/legal/terms",
  "/legal/privacy",
  "/legal/academic-integrity",
  "/legal/refunds",
  "/legal/cookies",
  "/legal/acceptable-use",
  "/legal/disclaimer",
  "/accessibility",
];

