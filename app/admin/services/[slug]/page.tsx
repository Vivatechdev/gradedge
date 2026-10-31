"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getServiceBySlug, type ServiceContentItem } from "@/lib/data/services-content";

export default function AdminServiceEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const initialData = getServiceBySlug(slug);

  if (!initialData) {
    notFound();
  }

  const [service, setService] = useState<ServiceContentItem>(initialData);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "content" | "process" | "sample" | "faqs" | "seo">("overview");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  }

  return (
    <DashboardShell
      role="admin"
      title={`Edit Service: ${service.title}`}
      user={{
        name: "Freedom Sola",
        email: "freedom.sola@gradedge.internal",
        institution: "Academic Administration",
      }}
    >
      <div className="space-y-6 max-w-5xl">
        {/* Header Breadcrumb & Actions */}
        <div className="border-b border-tone-rule pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-tone-muted">
              <Link href="/admin/services" className="hover:text-navy underline">
                Services Catalog
              </Link>
              <span>/</span>
              <span className="font-mono text-tone-body">{service.slug}</span>
            </div>
            <h2 className="text-2xl font-serif text-tone-heading mt-1">{service.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" href={`/services/${service.slug}`}>
              View Live Page
            </Button>
            <Button variant="accent" size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-cream border border-gold/40 text-tone-heading text-xs rounded-[2px] flex items-center justify-between">
            <span>✓ Service content updated successfully in editorial database.</span>
            <span className="text-[10px] text-tone-muted">Changes reflected across static routes on revalidation.</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 border-b border-tone-rule pb-2 text-xs">
          {(
            [
              { id: "overview", label: "Hero & At-A-Glance" },
              { id: "content", label: "Checklists & Deliverables" },
              { id: "process", label: "Process & Timeline" },
              { id: "sample", label: "Sample Feedback Mockup" },
              { id: "faqs", label: "FAQs & Integrity" },
              { id: "seo", label: "SEO & Meta" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-[2px] font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-navy text-white"
                  : "bg-paper text-tone-muted hover:text-tone-heading border border-tone-rule"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <Card background="white">
                <CardHeader>
                  <CardTitle className="text-base font-serif text-tone-heading">Hero & Promise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div>
                    <label className="block font-medium text-tone-heading mb-1">Service Title</label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => setService({ ...service, title: e.target.value })}
                      className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body font-serif text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-tone-heading mb-1">
                      Plain Two-Sentence Promise (Primary Value Statement)
                    </label>
                    <textarea
                      rows={3}
                      value={service.two_sentence_promise}
                      onChange={(e) => setService({ ...service, two_sentence_promise: e.target.value })}
                      className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-tone-heading mb-1">Hero Executive Summary</label>
                    <textarea
                      rows={3}
                      value={service.hero_summary}
                      onChange={(e) => setService({ ...service, hero_summary: e.target.value })}
                      className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-tone-heading mb-1">Hero Image Path (3:2)</label>
                      <input
                        type="text"
                        value={service.hero_image}
                        onChange={(e) => setService({ ...service, hero_image: e.target.value })}
                        className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body font-mono focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-tone-heading mb-1">Hero Image Screen-Reader Alt</label>
                      <input
                        type="text"
                        value={service.hero_image_alt}
                        onChange={(e) => setService({ ...service, hero_image_alt: e.target.value })}
                        className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card background="white">
                <CardHeader>
                  <CardTitle className="text-base font-serif text-tone-heading">At-A-Glance Strip Facts</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block font-medium text-tone-heading mb-1">Format</label>
                    <input
                      type="text"
                      value={service.format_text}
                      onChange={(e) => setService({ ...service, format_text: e.target.value })}
                      className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-tone-heading mb-1">Typical Turnaround</label>
                    <input
                      type="text"
                      value={service.turnaround_text}
                      onChange={(e) => setService({ ...service, turnaround_text: e.target.value })}
                      className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-tone-heading mb-1">Best For</label>
                    <input
                      type="text"
                      value={service.best_for}
                      onChange={(e) => setService({ ...service, best_for: e.target.value })}
                      className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-tone-heading mb-1">Starting Price (NGN / USD)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={service.starting_price_ngn}
                        onChange={(e) => setService({ ...service, starting_price_ngn: Number(e.target.value) })}
                        className="w-1/2 px-2 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body"
                      />
                      <input
                        type="number"
                        value={service.starting_price_usd}
                        onChange={(e) => setService({ ...service, starting_price_usd: Number(e.target.value) })}
                        className="w-1/2 px-2 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 2: CONTENT & DELIVERABLES */}
          {activeTab === "content" && (
            <div className="space-y-6">
              <Card background="white">
                <CardHeader>
                  <CardTitle className="text-base font-serif text-tone-heading">
                    Checklist: Signs You Need This (One per line)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <textarea
                    rows={5}
                    value={service.signs_you_need_this.join("\n")}
                    onChange={(e) =>
                      setService({
                        ...service,
                        signs_you_need_this: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                  <p className="text-[11px] text-tone-muted">
                    These form the checklist in Section 02 (&quot;Is this for you?&quot;).
                  </p>
                </CardContent>
              </Card>

              <Card background="white">
                <CardHeader>
                  <CardTitle className="text-base font-serif text-tone-heading">
                    Deliverables & Expected Outcomes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div>
                    <span className="block font-medium text-tone-heading mb-2">Deliverables (Title + Description)</span>
                    <div className="space-y-3">
                      {service.deliverables.map((del, i) => (
                        <div key={i} className="p-3 border border-tone-rule bg-paper rounded-[2px] space-y-2">
                          <input
                            type="text"
                            value={del.title}
                            onChange={(e) => {
                              const updated = [...service.deliverables];
                              updated[i].title = e.target.value;
                              setService({ ...service, deliverables: updated });
                            }}
                            className="w-full px-2 py-1.5 border border-tone-rule bg-white text-tone-heading font-medium rounded-[2px]"
                          />
                          <textarea
                            rows={2}
                            value={del.description}
                            onChange={(e) => {
                              const updated = [...service.deliverables];
                              updated[i].description = e.target.value;
                              setService({ ...service, deliverables: updated });
                            }}
                            className="w-full px-2 py-1.5 border border-tone-rule bg-white text-tone-body rounded-[2px]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-tone-heading mb-1">
                      Expected Outcomes (One per line)
                    </label>
                    <textarea
                      rows={4}
                      value={service.outcomes.join("\n")}
                      onChange={(e) =>
                        setService({
                          ...service,
                          outcomes: e.target.value.split("\n").filter(Boolean),
                        })
                      }
                      className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 3: PROCESS */}
          {activeTab === "process" && (
            <Card background="white">
              <CardHeader>
                <CardTitle className="text-base font-serif text-tone-heading">How It Works (Vertical Timeline)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                {service.process_steps.map((step, i) => (
                  <div key={i} className="p-4 border border-tone-rule bg-paper rounded-[2px] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-base font-semibold text-tone-heading">
                        Step 0{step.step}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-tone-muted">Duration:</span>
                        <input
                          type="text"
                          value={step.typical_duration}
                          onChange={(e) => {
                            const updated = [...service.process_steps];
                            updated[i].typical_duration = e.target.value;
                            setService({ ...service, process_steps: updated });
                          }}
                          className="px-2 py-1 border border-tone-rule bg-white text-tone-body rounded-[2px] w-28 text-right"
                        />
                      </div>
                    </div>

                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const updated = [...service.process_steps];
                        updated[i].title = e.target.value;
                        setService({ ...service, process_steps: updated });
                      }}
                      className="w-full px-2 py-1.5 border border-tone-rule bg-white font-medium text-tone-heading rounded-[2px]"
                    />

                    <textarea
                      rows={2}
                      value={step.description}
                      onChange={(e) => {
                        const updated = [...service.process_steps];
                        updated[i].description = e.target.value;
                        setService({ ...service, process_steps: updated });
                      }}
                      className="w-full px-2 py-1.5 border border-tone-rule bg-white text-tone-body rounded-[2px]"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* TAB 4: SAMPLE FEEDBACK */}
          {activeTab === "sample" && (
            <Card background="white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-serif text-tone-heading">
                    Illustrative Sample Feedback Mock-up
                  </CardTitle>
                  <Badge variant="navy">Illustrative Example</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-tone-heading mb-1">Feedback Title</label>
                  <input
                    type="text"
                    value={service.sample_feedback.title}
                    onChange={(e) =>
                      setService({
                        ...service,
                        sample_feedback: { ...service.sample_feedback, title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-heading font-medium"
                  />
                </div>

                <div>
                  <label className="block font-medium text-tone-heading mb-1">Manuscript Context / Discipline</label>
                  <input
                    type="text"
                    value={service.sample_feedback.manuscript_context}
                    onChange={(e) =>
                      setService({
                        ...service,
                        sample_feedback: { ...service.sample_feedback, manuscript_context: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-tone-heading mb-1">Original Draft Text</label>
                    <textarea
                      rows={3}
                      value={service.sample_feedback.original_text}
                      onChange={(e) =>
                        setService({
                          ...service,
                          sample_feedback: { ...service.sample_feedback, original_text: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-tone-heading mb-1">Annotated Revised Excerpt</label>
                    <textarea
                      rows={3}
                      value={service.sample_feedback.annotated_excerpt}
                      onChange={(e) =>
                        setService({
                          ...service,
                          sample_feedback: { ...service.sample_feedback, annotated_excerpt: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-tone-heading mb-1">Mentor Marginal Note</label>
                  <textarea
                    rows={2}
                    value={service.sample_feedback.mentor_marginal_note}
                    onChange={(e) =>
                      setService({
                        ...service,
                        sample_feedback: { ...service.sample_feedback, mentor_marginal_note: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body italic"
                  />
                </div>

                <div>
                  <label className="block font-medium text-tone-heading mb-1">Actionable Takeaway</label>
                  <input
                    type="text"
                    value={service.sample_feedback.actionable_takeaway}
                    onChange={(e) =>
                      setService({
                        ...service,
                        sample_feedback: { ...service.sample_feedback, actionable_takeaway: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body font-medium"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 5: FAQS & INTEGRITY */}
          {activeTab === "faqs" && (
            <div className="space-y-6">
              <Card background="cream" topRuleGold>
                <CardHeader>
                  <CardTitle className="text-base font-serif text-tone-heading">
                    What We Won&apos;t Do (Integrity Boundary Statements)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <textarea
                    rows={4}
                    value={service.what_we_wont_do.join("\n")}
                    onChange={(e) =>
                      setService({
                        ...service,
                        what_we_wont_do: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-white text-tone-body focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                  <p className="text-[11px] text-tone-muted">
                    Plain statements on what is outside the service (ghostwriting, data fabrication, supervisor impersonation).
                  </p>
                </CardContent>
              </Card>

              <Card background="white">
                <CardHeader>
                  <CardTitle className="text-base font-serif text-tone-heading">Service FAQs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  {service.faqs.map((faq, i) => (
                    <div key={i} className="p-3 border border-tone-rule bg-paper rounded-[2px] space-y-2">
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => {
                          const updated = [...service.faqs];
                          updated[i].question = e.target.value;
                          setService({ ...service, faqs: updated });
                        }}
                        className="w-full px-2 py-1.5 border border-tone-rule bg-white font-medium text-tone-heading rounded-[2px]"
                      />
                      <textarea
                        rows={3}
                        value={faq.answer}
                        onChange={(e) => {
                          const updated = [...service.faqs];
                          updated[i].answer = e.target.value;
                          setService({ ...service, faqs: updated });
                        }}
                        className="w-full px-2 py-1.5 border border-tone-rule bg-white text-tone-body rounded-[2px]"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 6: SEO */}
          {activeTab === "seo" && (
            <Card background="white">
              <CardHeader>
                <CardTitle className="text-base font-serif text-tone-heading">Search Engine Optimization (SEO)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-tone-heading mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={service.seo.meta_title}
                    onChange={(e) =>
                      setService({
                        ...service,
                        seo: { ...service.seo, meta_title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body"
                  />
                </div>
                <div>
                  <label className="block font-medium text-tone-heading mb-1">Meta Description</label>
                  <textarea
                    rows={3}
                    value={service.seo.meta_description}
                    onChange={(e) =>
                      setService({
                        ...service,
                        seo: { ...service.seo, meta_description: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-tone-rule">
            <Button variant="secondary" size="md" href="/admin/services">
              Cancel
            </Button>
            <Button variant="accent" size="md" type="submit">
              Save All Changes
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}

