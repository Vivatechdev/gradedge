"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useStudent } from "@/components/layout/student-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  Library,
  Download,
  FileCode,
  FileText,
  Search,
  CheckCircle2,
  FolderArchive,
  Terminal,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface DoctoralResource {
  id: string;
  category: "latex" | "stats" | "qualitative" | "ethics";
  categoryLabel: string;
  title: string;
  description: string;
  fileFormat: string;
  fileSize: string;
  lastUpdated: string;
}

const RESOURCES: DoctoralResource[] = [
  {
    id: "res-1",
    category: "latex",
    categoryLabel: "Thesis Templates",
    title: "University of Cambridge Doctoral Thesis LaTeX / Overleaf Starter Kit",
    description: "Pre-configured .tex master document with automated frontmatter, Cambridge college crest integration, hyperref metadata, and BibLaTeX APA 7th / Harvard bibliography styles.",
    fileFormat: "ZIP (.tex, .cls, .bib)",
    fileSize: "4.8 MB",
    lastUpdated: "Nov 2026",
  },
  {
    id: "res-2",
    category: "latex",
    categoryLabel: "Thesis Templates",
    title: "Oxford DPhil Monograph and Papers-Format LaTeX Bundle",
    description: "Official Oxford Bodleian Library compliance layout including declaration of originality, signature sheets, and dual chapter-level bibliography support.",
    fileFormat: "ZIP (.tex, .sty)",
    fileSize: "3.9 MB",
    lastUpdated: "Oct 2026",
  },
  {
    id: "res-3",
    category: "stats",
    categoryLabel: "Statistical Syntax",
    title: "Propensity Score Matching and Caliper Diagnostics (Stata .do / R Markdown)",
    description: "Complete replication pipeline containing psmatch2 scripts, nearest-neighbor matching algorithms, covariate balance tables, and Rosenbaum sensitivity bounds tests.",
    fileFormat: "Rmd / Stata .do",
    fileSize: "680 KB",
    lastUpdated: "Nov 2026",
  },
  {
    id: "res-4",
    category: "stats",
    categoryLabel: "Statistical Syntax",
    title: "Panel Econometrics and Two-Way Fixed Effects Stata Codebook",
    description: "Code and verification scripts for dynamic panel models, Arellano-Bond GMM estimators, Hansen J-test diagnostics, and cluster-robust standard errors.",
    fileFormat: "Stata .do",
    fileSize: "420 KB",
    lastUpdated: "Nov 2026",
  },
  {
    id: "res-5",
    category: "qualitative",
    categoryLabel: "Qualitative Codebooks",
    title: "NVivo and ATLAS.ti Thematic Coding Matrix and Audit Trail Template",
    description: "Rigorous template for Braun and Clarke 6-stage reflexive thematic analysis, inter-coder agreement indices, and audit trail documentation for defense examiners.",
    fileFormat: "Excel / NVivo .nvp",
    fileSize: "1.2 MB",
    lastUpdated: "Oct 2026",
  },
  {
    id: "res-6",
    category: "ethics",
    categoryLabel: "Ethics and Governance",
    title: "Institutional Review Board (IRB) Participant Consent and Data Security Pack",
    description: "Compliant participant information leaflets, GDPR research consent forms, and data retention protocol templates approved across UK and US universities.",
    fileFormat: "DOCX / PDF",
    fileSize: "850 KB",
    lastUpdated: "Nov 2026",
  },
];

export default function StudentResourcesPage() {
  const student = useStudent();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredResources = RESOURCES.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || res.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (title: string) => {
    showToast(`Downloading verified academic package: "${title}"`, "success");
  };

  return (
    <DashboardShell role="student" title="Resource Vault" user={student}>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-tone-rule pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-medium text-tone-heading">
              Doctoral Resource Vault and Academic Starter Kits
            </h2>
            <p className="text-xs text-tone-muted mt-1">
              Curated, peer-reviewed dissertation templates, statistical syntax repositories, and governance documentation.
            </p>
          </div>
        </div>

        {/* Search and Category Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 border border-tone-rule rounded-[2px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search templates, R syntax, Stata .do files, ethics packs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-paper border border-stone-200 rounded-[2px] focus:outline-hidden focus:border-gold"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: "all", label: "All Assets" },
              { id: "latex", label: "LaTeX and Overleaf" },
              { id: "stats", label: "Stats and Syntax" },
              { id: "qualitative", label: "Qualitative" },
              { id: "ethics", label: "Ethics and IRB" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`text-xs px-3 py-1.5 rounded-[2px] whitespace-nowrap font-medium transition-colors ${
                  activeCategory === cat.id
                    ? "bg-navy-deep text-white font-semibold"
                    : "bg-paper text-stone-600 hover:bg-stone-100 border border-tone-rule"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredResources.map((res) => (
            <Card key={res.id} className="bg-white border-tone-rule flex flex-col justify-between hover:border-gold/60 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <Badge variant="gold" className="text-[10px]">
                    {res.categoryLabel}
                  </Badge>
                  <span className="text-stone-400 font-sans text-[11px]">
                    {res.fileSize}
                  </span>
                </div>
                <CardTitle className="font-serif text-base text-tone-heading leading-snug">
                  {res.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 text-xs font-sans">
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  {res.description}
                </p>

                <div className="pt-3 border-t border-tone-rule flex items-center justify-between">
                  <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded-[2px]">
                    {res.fileFormat}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(res.title)}
                  >
                    <Download className="w-3.5 h-3.5 mr-1 text-gold" />
                    Download Kit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

