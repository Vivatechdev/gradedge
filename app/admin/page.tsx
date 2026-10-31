import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  return (
    <DashboardShell
      role="admin"
      title="Platform Operations"
      user={{
        name: "Freedom Sola",
        email: "freedom.sola@gradedge.internal",
        institution: "Academic Administration",
      }}
    >
      <div className="space-y-8 ui-interface">
        {/* Top welcome banner */}
        <div className="border-b border-tone-rule pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-tone-muted">
              Operations Control
            </span>
            <h2 className="text-2xl font-serif text-tone-heading mt-1">
              Academic Support Triage
            </h2>
            <p className="text-xs text-tone-muted mt-1">
              Review new student briefs, assign disciplines to mentors, and audit session compliance.
            </p>
          </div>
        </div>

        {/* Operational Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card background="white" topRuleGold>
            <CardHeader>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-tone-muted">
                Pending Scoping
              </span>
              <CardTitle className="text-2xl font-serif text-navy">5</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-tone-muted">New researcher briefs awaiting mentor assignment</p>
            </CardContent>
          </Card>

          <Card background="white">
            <CardHeader>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-tone-muted">
                Active Projects
              </span>
              <CardTitle className="text-2xl font-serif text-navy">10</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-tone-muted">Mentoring engagements currently in progress</p>
            </CardContent>
          </Card>

          <Card background="white">
            <CardHeader>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-tone-muted">
                Integrity Flags
              </span>
              <CardTitle className="text-2xl font-serif text-success">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-tone-muted">Zero academic integrity violations reported</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Support Requests Triage Table */}
        <div className="border border-tone-rule bg-white rounded-[2px] overflow-hidden">
          <div className="p-4 border-b border-tone-rule bg-cream flex justify-between items-center">
            <h3 className="font-serif text-base text-tone-heading font-medium">Recent Researcher Briefs</h3>
            <span className="text-xs text-tone-muted">Live triage queue</span>
          </div>

          <div className="divide-y divide-tone-rule text-xs">
            <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="font-semibold text-tone-heading block">
                  Freedom Sola &bull; Panel Econometrics on Carbon Pricing Mechanisms
                </span>
                <span className="text-[11px] text-tone-muted">
                  Research Institute &bull; PhD Candidate &bull; Assigned to Dr. A. T.
                </span>
              </div>
              <Badge variant="navy">In Scoping</Badge>
            </div>

            <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="font-semibold text-tone-heading block">
                  Freedom Sola &bull; Epidemiological Analysis of Maternal Health Access
                </span>
                <span className="text-[11px] text-tone-muted">
                  University Research Scholar &bull; PhD Candidate &bull; Assigned to Dr. E. R.
                </span>
              </div>
              <Badge variant="success">Active</Badge>
            </div>

            <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="font-semibold text-tone-heading block">
                  Freedom Sola &bull; Qualitative Phenomenology of Hybrid Learning Experiences
                </span>
                <span className="text-[11px] text-tone-muted">
                  Faculty of Education &bull; Masters Researcher &bull; Assigned to Dr. M. K.
                </span>
              </div>
              <Badge variant="navy">In Scoping</Badge>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
