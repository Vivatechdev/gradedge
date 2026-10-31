"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Toggle,
  FormRow,
  FormGroup,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Table,
  Badge,
  Accordion,
  AccordionItem,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Modal,
  ModalFooter,
  Drawer,
  ToastProvider,
  useToast,
  Tooltip,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
  Breadcrumb,
  Pagination,
  EmptyState,
  SkeletonText,
  Avatar,
  SectionLabel,
  PullQuote,
  MarginNote,
  StepList,
} from "@/components/ui";
import { Logo } from "@/components/layout/logo";

function StyleguideContent() {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toggleState, setToggleState] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const sampleTableData = [
    {
      id: "1",
      title: "Epidemiological Analysis of Maternal Care",
      level: "PhD",
      mentor: "Dr. E. R.",
      status: "Active",
      due: "2026-11-28",
    },
    {
      id: "2",
      title: "Panel Econometrics on Carbon Pricing",
      level: "PhD",
      mentor: "Dr. A. T.",
      status: "In Scoping",
      due: "2026-12-15",
    },
    {
      id: "3",
      title: "Qualitative Phenomenology of Hybrid Learning",
      level: "Masters",
      mentor: "Dr. M. K.",
      status: "Completed",
      due: "2026-10-10",
    },
  ];

  const sampleColumns = [
    { key: "title", header: "Support Request", sortable: true },
    { key: "level", header: "Study Level", sortable: true },
    { key: "mentor", header: "Assigned Mentor", sortable: true },
    {
      key: "status",
      header: "Status",
      render: (row: typeof sampleTableData[0]) => (
        <Badge
          variant={
            row.status === "Active"
              ? "success"
              : row.status === "Completed"
              ? "default"
              : "navy"
          }
        >
          {row.status}
        </Badge>
      ),
    },
    { key: "due", header: "Target Date", sortable: true },
  ];

  return (
    <div className="min-h-screen bg-paper text-tone-body pb-24">
      {/* Top styleguide header */}
      <header className="border-b border-tone-rule bg-white py-4 px-6 sticky top-0 z-30">
        <div className="site-container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="full" href="/" />
            <span className="text-xs font-semibold uppercase tracking-widest text-tone-muted border-l border-tone-rule pl-4">
              Design System & Component Styleguide
            </span>
          </div>
          <Link
            href="/"
            className="text-xs font-medium text-navy hover:underline"
          >
            &larr; Back to Public Site
          </Link>
        </div>
      </header>

      <div className="site-container pt-12 space-y-20">
        {/* Intro */}
        <div className="border-b border-tone-rule pb-8">
          <SectionLabel number={1} label="Foundations" />
          <h1 className="type-h1 mt-2">Design Tokens & Editorial Aesthetics</h1>
          <p className="type-lead mt-3 max-w-3xl">
            This design system strictly adheres to the GradEdge Anti-Generic Rules: flat surfaces,
            hairline rules (`#E4DFD5`), Fraunces serif headings, Instrument Sans body typography,
            and warm gold accents used sparingly for 10% emphasis.
          </p>
        </div>

        {/* 1. BRAND PALETTE */}
        <section className="space-y-6">
          <SectionLabel number={2} label="Color Palette" />
          <h2 className="type-h2">Named Color Tokens</h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="border border-tone-rule p-4 bg-white rounded-[2px]">
              <div className="h-12 w-full bg-navy rounded-[1px] mb-2" />
              <span className="text-xs font-semibold text-tone-body block">Navy (Primary)</span>
              <span className="text-[11px] text-tone-muted font-mono">#1F3A5F</span>
            </div>

            <div className="border border-tone-rule p-4 bg-white rounded-[2px]">
              <div className="h-12 w-full bg-navy-deep rounded-[1px] mb-2" />
              <span className="text-xs font-semibold text-tone-body block">Navy Deep</span>
              <span className="text-[11px] text-tone-muted font-mono">#14263F</span>
            </div>

            <div className="border border-tone-rule p-4 bg-white rounded-[2px]">
              <div className="h-12 w-full bg-gold rounded-[1px] mb-2" />
              <span className="text-xs font-semibold text-tone-body block">Warm Gold (Accent)</span>
              <span className="text-[11px] text-tone-muted font-mono">#C8963E</span>
            </div>

            <div className="border border-tone-rule p-4 bg-white rounded-[2px]">
              <div className="h-12 w-full bg-paper border border-tone-rule rounded-[1px] mb-2" />
              <span className="text-xs font-semibold text-tone-body block">Paper (Background)</span>
              <span className="text-[11px] text-tone-muted font-mono">#FAF8F4</span>
            </div>

            <div className="border border-tone-rule p-4 bg-white rounded-[2px]">
              <div className="h-12 w-full bg-cream border border-tone-rule rounded-[1px] mb-2" />
              <span className="text-xs font-semibold text-tone-body block">Cream (Sections)</span>
              <span className="text-[11px] text-tone-muted font-mono">#FBF5E9</span>
            </div>

            <div className="border border-tone-rule p-4 bg-white rounded-[2px]">
              <div className="h-12 w-full bg-ink rounded-[1px] mb-2" />
              <span className="text-xs font-semibold text-tone-body block">Ink (Body Text)</span>
              <span className="text-[11px] text-tone-muted font-mono">#2B2B2B</span>
            </div>

            <div className="border border-tone-rule p-4 bg-white rounded-[2px]">
              <div className="h-12 w-full bg-ink-soft rounded-[1px] mb-2" />
              <span className="text-xs font-semibold text-tone-body block">Ink Soft (Secondary)</span>
              <span className="text-[11px] text-tone-muted font-mono">#555555</span>
            </div>

            <div className="border border-tone-rule p-4 bg-white rounded-[2px]">
              <div className="h-12 w-full bg-rule rounded-[1px] mb-2" />
              <span className="text-xs font-semibold text-tone-body block">Rule (Hairline)</span>
              <span className="text-[11px] text-tone-muted font-mono">#E4DFD5</span>
            </div>

            <div className="border border-tone-rule p-4 bg-white rounded-[2px]">
              <div className="h-12 w-full bg-success rounded-[1px] mb-2" />
              <span className="text-xs font-semibold text-tone-body block">Success</span>
              <span className="text-[11px] text-tone-muted font-mono">#2E7D5B</span>
            </div>

            <div className="border border-tone-rule p-4 bg-white rounded-[2px]">
              <div className="h-12 w-full bg-error rounded-[1px] mb-2" />
              <span className="text-xs font-semibold text-tone-body block">Error</span>
              <span className="text-[11px] text-tone-muted font-mono">#C0392B</span>
            </div>
          </div>
        </section>

        {/* 2. TYPOGRAPHY SCALE */}
        <section className="space-y-6">
          <SectionLabel number={3} label="Typography" />
          <h2 className="type-h2">Type Hierarchy & Optical Sizing</h2>

          <div className="space-y-8 bg-cream p-8 border border-tone-rule rounded-[2px]">
            <div>
              <span className="type-micro block mb-2">Display (clamp 2.6rem to 4.5rem)</span>
              <p className="type-display">
                Rigorous doctoral coaching for serious academic inquiry.
              </p>
            </div>

            <div className="pt-6 border-t border-tone-rule">
              <span className="type-micro block mb-2">Headline 1 (Fraunces 2.5rem - 3rem)</span>
              <h1 className="type-h1">
                Dissertation methodology and data analysis mentoring
              </h1>
            </div>

            <div className="pt-6 border-t border-tone-rule">
              <span className="type-micro block mb-2">Headline 2 (Fraunces 1.85rem - 2.25rem)</span>
              <h2 className="type-h2">
                Structured feedback from earned postgraduate scholars
              </h2>
            </div>

            <div className="pt-6 border-t border-tone-rule">
              <span className="type-micro block mb-2">Headline 3 (Fraunces 1.35rem - 1.5rem)</span>
              <h3 className="type-h3">
                Research design, ethics protocol, and statistical syntax review
              </h3>
            </div>

            <div className="pt-6 border-t border-tone-rule">
              <span className="type-micro block mb-2">Lead Paragraph (1.18rem, line height 1.65)</span>
              <p className="type-lead max-w-3xl">
                We coach doctoral candidates and early career researchers through every phase of
                their thesis. You write your own work. We help you sharpen your arguments, defend
                your methodology, and master your statistical analysis.
              </p>
            </div>

            <div className="pt-6 border-t border-tone-rule">
              <span className="type-micro block mb-2">Body Text (Instrument Sans 17-18px, line height 1.6)</span>
              <p className="type-body max-w-3xl">
                Academic research requires precision, intellectual honesty, and resilience. Our
                mentors evaluate your draft chapters against international journal standards,
                identify logical fallacies, and ensure full alignment between your research
                questions and empirical models.
              </p>
            </div>

            <div className="pt-6 border-t border-tone-rule">
              <span className="type-micro block mb-2">Small Text (14px) & Micro-Label</span>
              <p className="type-small">
                Sequential invoices are generated automatically for all completed mentoring sessions.
              </p>
              <span className="type-micro mt-2 block">
                01 / Section Micro-Label &bull; Wide Letter Spacing
              </span>
            </div>
          </div>
        </section>

        {/* 3. LOGO VARIANTS */}
        <section className="space-y-6">
          <SectionLabel number={4} label="Brand Identity" />
          <h2 className="type-h2">Logo Component & Clear Space</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-tone-rule rounded-[2px] flex flex-col justify-between">
              <span className="type-micro mb-4">Variant: Full (Light Background)</span>
              <div className="py-4">
                <Logo variant="full" />
              </div>
              <span className="text-[11px] text-tone-muted">Min-width: 96px, Clear space = height of &apos;E&apos;</span>
            </div>

            <div data-tone="navy-deep" className="tone-navy-deep p-6 bg-navy-deep border border-tone-rule rounded-[2px] flex flex-col justify-between text-tone-body">
              <span className="type-micro text-tone-muted mb-4">Variant: Full-White (Dark Background)</span>
              <div className="py-4">
                <Logo variant="full-white" />
              </div>
              <span className="text-[11px] text-tone-muted">Used in footers, dark bars & sidebars</span>
            </div>

            <div data-tone="navy-deep" className="tone-navy-deep p-6 bg-navy-deep border border-tone-rule rounded-[2px] flex flex-col justify-between text-tone-body">
              <span className="type-micro text-tone-muted mb-4">Variant: Symbol Only</span>
              <div className="py-4">
                <Logo variant="symbol" />
              </div>
              <span className="text-[11px] text-tone-muted">Used in collapsed sidebars & mobile icons</span>
            </div>
          </div>
        </section>

        {/* 4. BUTTONS */}
        <section className="space-y-6">
          <SectionLabel number={5} label="Interactive Controls" />
          <h2 className="type-h2">Button Variants & States</h2>

          <div className="space-y-6 bg-white p-8 border border-tone-rule rounded-[2px]">
            <div>
              <span className="type-micro block mb-3">Variants (No Pill Shapes, Flat Surfaces)</span>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary">Primary Navy</Button>
                <Button variant="accent">Accent Gold (One Per Screen)</Button>
                <Button variant="secondary">Secondary Outline</Button>
                <Button variant="link">Text Link with Animated Underline</Button>
              </div>
            </div>

            <div className="pt-6 border-t border-tone-rule">
              <span className="type-micro block mb-3">Sizes</span>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" size="sm">Small (sm)</Button>
                <Button variant="primary" size="md">Medium (md)</Button>
                <Button variant="primary" size="lg">Large (lg)</Button>
              </div>
            </div>

            <div className="pt-6 border-t border-tone-rule">
              <span className="type-micro block mb-3">States (Loading & Disabled)</span>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" isLoading>Processing request</Button>
                <Button variant="accent" isLoading>Saving changes</Button>
                <Button variant="primary" disabled>Disabled Navy</Button>
                <Button variant="secondary" disabled>Disabled Outline</Button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FORM CONTROLS */}
        <section className="space-y-6">
          <SectionLabel number={6} label="Forms" />
          <h2 className="type-h2">Form Fields, Labels & Inline Validation</h2>

          <div className="bg-white p-8 border border-tone-rule rounded-[2px] max-w-3xl space-y-6">
            <FormGroup
              title="Researcher Details"
              description="Provide your academic affiliation and research focus area."
            >
              <FormRow>
                <Input
                  label="Full Name"
                  placeholder="e.g. Freedom Sola"
                  helperText="Your academic publishing name"
                  required
                />
                <Input
                  label="Institutional Email"
                  placeholder="scholar@university.edu"
                  type="email"
                  required
                />
              </FormRow>

              <FormRow>
                <Select
                  label="Academic Study Level"
                  options={[
                    { value: "phd", label: "PhD / Doctoral Candidate" },
                    { value: "masters", label: "Masters Researcher" },
                    { value: "postdoc", label: "Postdoctoral Researcher" },
                  ]}
                  required
                />
                <Input
                  label="Invalid Field with Error"
                  defaultValue="invalid-format"
                  error="Please provide a valid institutional domain address."
                />
              </FormRow>

              <Textarea
                label="Research Brief & Methodology Outline"
                placeholder="Describe your current chapter, data structure, or committee questions..."
                helperText="Maximum 1,000 words for scoping review."
                rows={4}
              />

              <div className="space-y-3 pt-2">
                <Checkbox
                  label="I understand that GradEdge provides coaching and feedback; I will author all writing myself."
                  required
                />
                <Checkbox
                  label="Subscribe to The Research Quarterly (Double opt-in newsletter)."
                />
              </div>

              <div className="pt-4 border-t border-tone-rule">
                <span className="type-micro block mb-2">Preferred Consultation Delivery</span>
                <div className="space-y-2">
                  <Radio name="delivery" label="Private 1-on-1 Video Call (Encrypted)" defaultChecked />
                  <Radio name="delivery" label="Written Chapter Audit & Developmental Notes" />
                </div>
              </div>

              <div className="pt-4 border-t border-tone-rule">
                <Toggle
                  checked={toggleState}
                  onChange={setToggleState}
                  label="Receive SMS consultation reminders"
                  helperText="Only urgent milestone and meeting link notifications."
                />
              </div>
            </FormGroup>
          </div>
        </section>

        {/* 6. CARDS & EDITORIAL CONTAINERS */}
        <section className="space-y-6">
          <SectionLabel number={7} label="Containers" />
          <h2 className="type-h2">Cards & Content Surfaces</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card background="cream">
              <CardHeader>
                <span className="type-micro">Standard Card</span>
                <CardTitle>Methodology Audit</CardTitle>
                <CardDescription>Comprehensive review of sampling and validity.</CardDescription>
              </CardHeader>
              <CardContent>
                Flat cream surface with hairline borders. No drop shadows or rounded pill shapes.
              </CardContent>
              <CardFooter>
                <span>3-5 day turnaround</span>
                <span className="font-semibold text-navy">$350 USD</span>
              </CardFooter>
            </Card>

            <Card background="white" topRuleGold>
              <CardHeader>
                <span className="type-micro text-gold">Featured Tier</span>
                <CardTitle>Dissertation Accelerator</CardTitle>
                <CardDescription>Top gold hairline rule for primary visual hierarchy.</CardDescription>
              </CardHeader>
              <CardContent>
                Structured 9-month doctoral pathway with bi-weekly mentoring checkpoints.
              </CardContent>
              <CardFooter>
                <span>Cohort begins Nov 1</span>
                <span className="font-semibold text-navy">Limited Cohort</span>
              </CardFooter>
            </Card>

            <Card background="paper">
              <CardHeader>
                <span className="type-micro">Paper Background</span>
                <CardTitle>Statistical Syntax Review</CardTitle>
                <CardDescription>SPSS, R, Python, and Stata model validation.</CardDescription>
              </CardHeader>
              <CardContent>
                Detailed script review ensuring robust assumption testing and reproducible output.
              </CardContent>
              <CardFooter>
                <span>Syntax audit</span>
                <span className="font-semibold text-navy">$300 USD</span>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* 7. DENSE DATA TABLE */}
        <section className="space-y-6">
          <SectionLabel number={8} label="Data Display" />
          <h2 className="type-h2">Dense Data Table with Responsive Collapse</h2>
          <p className="type-small max-w-2xl">
            Zebra striping is disabled; rows feature hairline dividers. On small viewports, rows
            intelligently collapse into structured card rows.
          </p>

          <Table
            columns={sampleColumns}
            data={sampleTableData}
            keyField="id"
            stickyHeader
          />
        </section>

        {/* 8. BADGES & STATUS TAGS */}
        <section className="space-y-6">
          <SectionLabel number={9} label="Indicators" />
          <h2 className="type-h2">Badges & Status Tags</h2>

          <div className="bg-white p-6 border border-tone-rule rounded-[2px] flex flex-wrap gap-3 items-center">
            <Badge variant="default">Default</Badge>
            <Badge variant="navy">In Scoping</Badge>
            <Badge variant="gold">Milestone Due</Badge>
            <Badge variant="success">Confirmed</Badge>
            <Badge variant="warning">Revision Needed</Badge>
            <Badge variant="error">Integrity Flag</Badge>
            <Badge variant="outline">Unpublished</Badge>
          </div>
        </section>

        {/* 9. ACCORDION & TABS */}
        <section className="space-y-6">
          <SectionLabel number={10} label="Disclosure & Navigation" />
          <h2 className="type-h2">Tabs & Native FAQ Accordion</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Interactive Tabs */}
            <div className="bg-white p-6 border border-tone-rule rounded-[2px]">
              <span className="type-micro block mb-4">Accessible Tabbed View</span>
              <Tabs defaultValue="overview">
                <TabList>
                  <Tab value="overview">Chapter Overview</Tab>
                  <Tab value="methodology">Methodology Plan</Tab>
                  <Tab value="feedback">Supervisor Feedback</Tab>
                </TabList>

                <TabPanel value="overview" className="text-sm pt-2">
                  <p className="text-tone-body leading-relaxed">
                    This dissertation examines the socio-economic determinants of maternal healthcare
                    utilization using nationally representative demographic health survey data.
                  </p>
                </TabPanel>

                <TabPanel value="methodology" className="text-sm pt-2">
                  <p className="text-tone-body leading-relaxed">
                    Quantitative multi-level logistic regression with random intercepts at district
                    cluster levels. Survey weighting applied in R.
                  </p>
                </TabPanel>

                <TabPanel value="feedback" className="text-sm pt-2">
                  <p className="text-tone-body leading-relaxed">
                    Committee requested an expanded discussion on endogeneity and instrument validity
                    for instrumental variables.
                  </p>
                </TabPanel>
              </Tabs>
            </div>

            {/* Native Accordion (Details/Summary) */}
            <div className="bg-white p-6 border border-tone-rule rounded-[2px]">
              <span className="type-micro block mb-4">FAQ Accordion (Native Semantics)</span>
              <Accordion>
                <AccordionItem
                  title="Does GradEdge write dissertations for students?"
                  defaultOpen
                >
                  No. We operate strictly as a developmental feedback, statistical advisory, and
                  academic coaching consultancy. The student does all the writing.
                </AccordionItem>
                <AccordionItem title="Who are the mentors and how are they assigned?">
                  Every mentor holds an earned postgraduate degree and is matched to your specific
                  discipline. Mentor profiles are private to protect mentor privacy.
                </AccordionItem>
                <AccordionItem title="Can you help with statistical software like SPSS and R?">
                  Yes. We provide hands-on script auditing, assumption testing, and output
                  interpretation for SPSS, R, Stata, Python, and SmartPLS.
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* 10. OVERLAYS: MODAL, DRAWER, TOAST & TOOLTIP */}
        <section className="space-y-6">
          <SectionLabel number={11} label="Overlays & Feedback" />
          <h2 className="type-h2">Dialogs, Drawers & System Toasts</h2>

          <div className="bg-white p-6 border border-tone-rule rounded-[2px] flex flex-wrap gap-4 items-center">
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              Open Accessible Modal
            </Button>

            <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
              Open Slide-out Drawer
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                toast({
                  title: "Milestone Verified",
                  message: "Your Chapter 3 feedback notes have been uploaded to your portal.",
                  type: "success",
                })
              }
            >
              Trigger Success Toast
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                toast({
                  title: "Payment Initiated",
                  message: "Redirecting to Paystack secure checkout...",
                  type: "info",
                })
              }
            >
              Trigger Info Toast
            </Button>

            <Tooltip content="Encrypted video room link generated upon booking">
              <span className="text-xs text-navy border-b border-navy/40 cursor-help pb-0.5">
                Hover for Tooltip
              </span>
            </Tooltip>

            {/* Dropdown Menu */}
            <DropdownMenu
              trigger={
                <Button variant="secondary" size="sm">
                  <span>Actions Menu ▾</span>
                </Button>
              }
            >
              <DropdownItem onClick={() => {}}>Download PDF Invoice</DropdownItem>
              <DropdownItem onClick={() => {}}>Reschedule Consultation</DropdownItem>
              <DropdownSeparator />
              <DropdownItem onClick={() => {}} className="text-error">
                Cancel Request
              </DropdownItem>
            </DropdownMenu>
          </div>

          {/* Modal instance */}
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Book a Research Consultation"
            description="Select your preferred date and submit brief notes for your mentor."
          >
            <div className="space-y-4 my-2">
              <Input label="Your Name" defaultValue="Freedom Sola" />
              <Input label="Topic Focus" defaultValue="Quantitative Methodology Review" />
              <Textarea
                label="Key Questions for Call"
                placeholder="Outline 2-3 specific questions you want addressed during the session..."
                rows={3}
              />
            </div>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="accent"
                onClick={() => {
                  setModalOpen(false);
                  toast({
                    title: "Consultation Requested",
                    message: "We have received your briefing notes.",
                    type: "success",
                  });
                }}
              >
                Confirm Request
              </Button>
            </ModalFooter>
          </Modal>

          {/* Drawer instance */}
          <Drawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title="Consultation Details"
          >
            <div className="space-y-4">
              <div className="p-3 bg-cream border border-tone-rule rounded-[2px]">
                <span className="type-micro text-navy">Assigned Mentor</span>
                <h4 className="font-serif text-base text-tone-heading font-semibold mt-1">
                  Dr. E. R. (Quantitative Specialist)
                </h4>
                <p className="text-xs text-tone-muted mt-1">
                  PhD Biostatistics &bull; R, SPSS, Stata
                </p>
              </div>

              <div>
                <span className="type-micro block mb-1">Session Notes</span>
                <p className="text-xs text-tone-body leading-relaxed">
                  Reviewing sample size power calculations for clustered randomized trials. Please
                  have your R script or SPSS dataset open during the call.
                </p>
              </div>

              <div className="pt-4 border-t border-tone-rule">
                <Button
                  variant="accent"
                  className="w-full"
                  onClick={() => setDrawerOpen(false)}
                >
                  Join Video Session
                </Button>
              </div>
            </div>
          </Drawer>
        </section>

        {/* 11. EDITORIAL COMPONENTS */}
        <section className="space-y-6">
          <SectionLabel number={12} label="Editorial Layouts" />
          <h2 className="type-h2">Pull Quotes, Margin Notes & Step Lists</h2>

          <div className="space-y-6">
            <PullQuote
              quote="The hallmark of rigorous scholarship is not writing more: it is knowing precisely why every analytical choice was made."
              attribution="Academic Advisory Director"
              role="GradEdge Academic Solutions"
            />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-8">
                <p className="type-body">
                  When preparing a dissertation for examination, candidates frequently mistake
                  committee queries for personal critiques. In reality, examiners test whether you
                  understand the boundaries of your methodology and whether your conclusions exceed
                  your evidentiary basis.
                </p>
              </div>
              <div className="md:col-span-4">
                <MarginNote calloutNumber="Note 1">
                  Examiners look for defensive justification of exclusions in your sampling frame
                  before reviewing your empirical results.
                </MarginNote>
              </div>
            </div>

            <div className="pt-8">
              <span className="type-micro block mb-4">Step List with Large Serif Numerals</span>
              <StepList
                steps={[
                  {
                    title: "Submit your research brief & timeline",
                    description:
                      "Share your current chapter drafts, committee feedback, and upcoming academic submission milestones.",
                  },
                  {
                    title: "Discipline-specific mentor matching",
                    description:
                      "We match your project with a mentor holding an earned postgraduate degree in your exact field.",
                  },
                  {
                    title: "Structured review & 1-on-1 strategy sessions",
                    description:
                      "Receive written developmental edits and walk through revision steps during dedicated video consultations.",
                  },
                ]}
              />
            </div>
          </div>
        </section>

        {/* 12. UTILITY COMPONENTS */}
        <section className="space-y-6">
          <SectionLabel number={13} label="Utilities" />
          <h2 className="type-h2">Breadcrumbs, Pagination, Avatars & Skeletons</h2>

          <div className="bg-white p-8 border border-tone-rule rounded-[2px] space-y-8">
            <div>
              <span className="type-micro block mb-2">Breadcrumb Navigation</span>
              <Breadcrumb
                items={[
                  { label: "Services", href: "/services" },
                  { label: "Data Analysis", href: "/services/data-analysis" },
                  { label: "Quantitative Statistics" },
                ]}
              />
            </div>

            <div className="pt-6 border-t border-tone-rule">
              <span className="type-micro block mb-2">Avatar with Initials Fallback</span>
              <div className="flex items-center gap-4">
                <Avatar name="Freedom Sola" size="sm" />
                <Avatar name="Freedom Sola" size="md" />
                <Avatar name="Freedom Sola" size="lg" />
              </div>
            </div>

            <div className="pt-6 border-t border-tone-rule">
              <span className="type-micro block mb-2">Pagination Component</span>
              <Pagination
                currentPage={currentPage}
                totalPages={5}
                onPageChange={setCurrentPage}
              />
            </div>

            <div className="pt-6 border-t border-tone-rule">
              <span className="type-micro block mb-2">Empty State (Honest Microcopy)</span>
              <EmptyState
                title="No consultations scheduled"
                description="You do not have any upcoming mentoring sessions. When you book a call with your assigned mentor, it will appear here with your meeting room link."
                action={
                  <Button variant="secondary" size="sm">
                    Book a consultation
                  </Button>
                }
              />
            </div>

            <div className="pt-6 border-t border-tone-rule">
              <span className="type-micro block mb-2">Restrained Skeleton Loaders</span>
              <div className="max-w-md">
                <SkeletonText lines={3} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <ToastProvider>
      <StyleguideContent />
    </ToastProvider>
  );
}
