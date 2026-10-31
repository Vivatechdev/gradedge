"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Terminal, Cpu, Database, Check, Layers, BarChart2 } from "lucide-react";

type SoftwareTool = "R" | "Python" | "SPSS" | "Stata" | "SmartPLS";

const SYNTAX_SAMPLES: Record<SoftwareTool, { code: string; library: string; description: string }> = {
  R: {
    library: "lavaan v0.6-17",
    description: "Structural Equation Modeling with robust standard errors (MLR)",
    code: `# Confirmatory Factor Analysis & Structural Path Model
library(lavaan)
model <- '
  # Measurement Model
  AcademicSelfEfficacy =~ ase1 + ase2 + ase3 + ase4
  SupervisorSupport    =~ ss1 + ss2 + ss3
  ThesisCompletionProg =~ tcp1 + tcp2 + tcp3 + tcp4

  # Structural Regressions (with indirect pathways)
  ThesisCompletionProg ~ c_prime*SupervisorSupport + b*AcademicSelfEfficacy
  AcademicSelfEfficacy ~ a*SupervisorSupport

  # Indirect & Total Effects
  indirect := a * b
  total    := c_prime + (a * b)
'
fit <- sem(model, data = thesis_dataset, estimator = "MLR", missing = "FIML")
summary(fit, fit.measures = TRUE, standardized = TRUE, rsquare = TRUE)`,
  },
  Python: {
    library: "statsmodels v0.14 & pingouin",
    description: "Multi-level Mixed-Effects Regression with clustered standard errors",
    code: `import statsmodels.formula.api as smf
import pingouin as pg

# Mixed Linear Model (Random Intercept by Department/University)
md = smf.mixedlm(
    "dissertation_progress ~ supervisor_autonomy + methodology_clarity + prior_publications",
    data=survey_df,
    groups=survey_df["institution_id"]
)
mdf = md.fit(reml=True)
print(mdf.summary())

# Assumption Diagnostics: Heteroscedasticity & Normality of Residuals
pg.normality(mdf.resid)
pg.homoscedasticity(data=survey_df, dv='dissertation_progress', group='institution_id')`,
  },
  SPSS: {
    library: "IBM SPSS Statistics 29",
    description: "Moderated Mediation via Hayes PROCESS Macro (Model 7)",
    code: `* Hayes PROCESS Macro v4.3 Syntax Execution.
PROCESS 
  y = ThesisProgress
  /x = SupervisoryFeedbackFrequency
  /m = MethodologicalConfidence
  /w = AcademicDiscipline
  /model = 7
  /boot = 5000
  /seed = 202610
  /conf = 95
  /stand = 1.
EXECUTE.`,
  },
  Stata: {
    library: "Stata 18 MP",
    description: "Generalized Structural Equation Modeling with clustered robust SEs",
    code: `* Generalized SEM with Cluster-Robust Standard Errors
gsem (ThesisProgress <- SupervisorClarity MentoringHours DisciplineID) ///
     (MethodologicalConfidence <- SupervisorClarity PriorResearchExp), ///
     vce(cluster UniversityClusterID)
estat ic
estat eqgof, format(%9.3f)
nlcom (_b[ThesisProgress:MethodologicalConfidence]*_b[MethodologicalConfidence:SupervisorClarity])`,
  },
  SmartPLS: {
    library: "SmartPLS 4",
    description: "Partial Least Squares Structural Equation Modeling (PLS-SEM)",
    code: `Algorithm: Consistent PLS-SEM (PLSc)
Weighting: Path Weighting Scheme
Stop Criterion: 10^-7 | Maximum Iterations: 500
Bootstrapping: 10,000 resamples with bias-corrected & accelerated (BCa) bootstrap
Effect Size (f^2): Evaluated at 0.02 (small), 0.15 (medium), 0.35 (large)
Predictive Relevance: Blindfolding procedure with cross-validated redundancy (Q^2)`,
  },
};

const FIT_METRICS = [
  { metric: "CFI", value: "0.978", threshold: "> 0.95 (Superb)", status: "pass" },
  { metric: "TLI", value: "0.971", threshold: "> 0.95 (Superb)", status: "pass" },
  { metric: "RMSEA", value: "0.038 [90% CI: 0.026 - 0.049]", threshold: "< 0.06 (Close Fit)", status: "pass" },
  { metric: "SRMR", value: "0.041", threshold: "< 0.08 (Acceptable)", status: "pass" },
  { metric: "χ²/df", value: "1.42 (p = 0.112)", threshold: "< 2.0 (Non-significant)", status: "pass" },
];

export function DataLabModelVisualizer({ className }: { className?: string }) {
  const [selectedTool, setSelectedTool] = useState<SoftwareTool>("R");
  const activeSyntax = SYNTAX_SAMPLES[selectedTool];

  return (
    <div
      data-tone="navy-deep"
      className={cn(
        "tone-navy-deep bg-navy-deep text-tone-body border border-tone-rule rounded-[2px] overflow-hidden shadow-lg",
        className
      )}
    >
      {/* Workbench Header Bar */}
      <div className="bg-[#0D1929] border-b border-white/10 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-gold shrink-0" />
          <span className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
            Empirical Statistical Lab & Syntax Architecture
          </span>
        </div>

        {/* Software Selector Tabs */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-[2px] border border-white/10">
          {(["R", "Python", "SPSS", "Stata", "SmartPLS"] as SoftwareTool[]).map((tool) => (
            <button
              key={tool}
              type="button"
              onClick={() => setSelectedTool(tool)}
              className={cn(
                "px-2.5 py-1 font-mono text-[11px] rounded-[2px] transition-all cursor-pointer",
                selectedTool === tool
                  ? "bg-gold text-[#14263F] font-bold shadow-xs"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              {tool}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
        {/* Left: Code Syntax Window (7 Cols) */}
        <div className="lg:col-span-7 p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-white/60 font-mono pb-2 border-b border-white/10">
            <span>Environment: {activeSyntax.library}</span>
            <span className="text-gold">{activeSyntax.description}</span>
          </div>

          <pre className="font-mono text-xs leading-relaxed text-emerald-300/90 bg-[#09111C] p-4 rounded-[2px] border border-white/5 overflow-x-auto selection:bg-gold selection:text-navy">
            <code>{activeSyntax.code}</code>
          </pre>

          <p className="text-[11px] text-white/70 leading-relaxed font-mono">
            &bull; All scripts are delivered as fully documented, reproducible syntax files with step-by-step comments explaining every variable transformation and model constraint.
          </p>
        </div>

        {/* Right: Path Model Diagram & Diagnostic Fit (5 Cols) */}
        <div className="lg:col-span-5 p-6 space-y-6 bg-[#0D1A2B]">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5 font-mono">
                <BarChart2 className="w-3.5 h-3.5 text-gold" />
                Model Fit Diagnostics
              </span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.5 rounded-[2px]">
                PASSES COMMITTEE RIGOR
              </span>
            </div>
            <p className="text-[11px] text-white/60 mt-1.5 leading-snug">
              Every quantitative analysis includes full structural equation or regression diagnostics against stringent academic thresholds:
            </p>
          </div>

          {/* Diagnostic Metrics Table */}
          <div className="border border-white/10 bg-white/5 rounded-[2px] divide-y divide-white/10 text-xs font-mono">
            {FIT_METRICS.map((row) => (
              <div key={row.metric} className="p-2.5 flex items-center justify-between">
                <span className="text-white font-semibold">{row.metric}</span>
                <span className="text-gold">{row.value}</span>
                <span className="text-[10px] text-white/50">{row.threshold}</span>
              </div>
            ))}
          </div>

          {/* Reproducibility Guarantee Callout */}
          <div className="p-3.5 bg-white/5 border border-white/10 rounded-[2px] space-y-1 text-xs">
            <span className="text-gold font-semibold block text-[11px] font-mono">
              Academic Audit Guarantee:
            </span>
            <p className="text-white/80 text-[11px] leading-relaxed">
              You receive not just the final tables, but the complete clean dataset, recoding scripts, and an audio-video walkthrough explaining how to interpret every parameter during your oral defense.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

