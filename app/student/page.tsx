import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StudentDashboardPage() {
  return (
    <DashboardShell
      role="student"
      title="Student Research Portal"
      user={{
        name: "Freedom Sola",
        email: "freedom.sola@university.edu",
        institution: "PhD Candidate in Public Health",
      }}
    >
      <div className="space-y-8 ui-interface">
        {/* Top welcome banner */}
        <div className="border-b border-tone-rule pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-tone-muted">
              Academic Dashboard
            </span>
            <h2 className="text-2xl font-serif text-tone-heading mt-1">
              Welcome back, Freedom
            </h2>
            <p className="text-xs text-tone-muted mt-1">
              Track your active mentoring projects, upcoming consultations, and feedback milestones.
            </p>
          </div>
          <Button href="/booking" variant="accent" size="sm">
            Request mentoring support
          </Button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card background="white" className="hover:shadow-xs transition-shadow duration-150 border-tone-rule">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-tone-muted">
                Active Projects
              </span>
              <CardTitle className="text-2xl font-serif text-navy">1</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-tone-muted">Doctoral thesis mentoring in progress</p>
            </CardContent>
          </Card>

          <Card background="white" className="hover:shadow-xs transition-shadow duration-150 border-tone-rule">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-tone-muted">
                Next Consultation
              </span>
              <CardTitle className="text-xl font-serif text-navy">Thursday, 14:00</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-tone-muted">With assigned quantitative mentor (Dr. E. R.)</p>
            </CardContent>
          </Card>

          <Card background="white" className="hover:shadow-xs transition-shadow duration-150 border-tone-rule">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-tone-muted">
                Pending Milestones
              </span>
              <CardTitle className="text-2xl font-serif text-navy">1</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-tone-muted">Methodology review & sample size audit</p>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Mentor Card (Visible only inside dashboard after assignment!) */}
        <div className="border border-tone-rule bg-cream p-6 rounded-[2px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-tone-rule/70 pb-4 mb-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-gold font-semibold">
                Assigned Research Mentor
              </span>
              <h3 className="text-lg font-serif text-tone-heading font-medium mt-0.5">
                Dr. E. R.
              </h3>
            </div>
            <Badge variant="navy">Quantitative Methodology Specialist</Badge>
          </div>

          <p className="text-xs text-tone-body leading-relaxed">
            Dr. E. R. holds an earned PhD in Biostatistics with over 12 years of experience coaching
            doctoral researchers on complex statistical modeling and research design.
          </p>

          <div className="mt-4 pt-3 border-t border-tone-rule/60 flex flex-wrap gap-2 text-xs text-tone-muted">
            <span className="font-semibold text-navy">Disciplines:</span>
            <span>Health Sciences, Epidemiology, Public Health</span>
            <span className="text-rule mx-1">|</span>
            <span className="font-semibold text-navy">Tools:</span>
            <span>R, SPSS, Stata, Python</span>
          </div>
        </div>

        {/* Support Requests List / Honest Empty State */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-tone-heading">Active Support Requests</h3>
            <Link href="/student/projects" className="text-xs text-navy font-medium hover:underline">
              View all projects &rarr;
            </Link>
          </div>

          <div className="border border-tone-rule bg-white divide-y divide-tone-rule rounded-[2px]">
            <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="text-xs font-semibold text-tone-heading">
                  Epidemiological Analysis of Maternal Health Access in Rural Districts
                </span>
                <p className="text-[11px] text-tone-muted mt-0.5">
                  Dissertation Mentoring &bull; Due Nov 28, 2026
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="success">Active</Badge>
                <Link
                  href="/student/projects"
                  className="text-xs text-navy hover:underline font-medium"
                >
                  View milestones &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
