"use client";

import React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllServices, CATEGORY_METADATA, type ServiceContentItem } from "@/lib/data/services-content";

export default function AdminServicesListPage() {
  const services = getAllServices();
  const categories = Object.keys(CATEGORY_METADATA) as Array<ServiceContentItem["category"]>;

  return (
    <DashboardShell
      role="admin"
      title="Services & Editorial Catalog"
      user={{
        name: "Freedom Sola",
        email: "freedom.sola@gradedge.internal",
        institution: "Academic Administration",
      }}
    >
      <div className="space-y-8 max-w-6xl">
        <div className="border-b border-tone-rule pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-tone-muted">
              Catalog Management
            </span>
            <h2 className="text-2xl font-serif text-tone-heading mt-1">
              Active Research Services ({services.length})
            </h2>
            <p className="text-xs text-tone-muted mt-1">
              Manage live service content, deliverables, process steps, illustrative sample feedback, pricing, and SEO fields.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="accent" size="sm" href="/services">
              View Public Catalog &rarr;
            </Button>
          </div>
        </div>

        {categories.map((catKey) => {
          const catMeta = CATEGORY_METADATA[catKey];
          const catServices = services.filter((s) => s.category === catKey);

          return (
            <div key={catKey} className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-tone-rule pb-2">
                <div>
                  <h3 className="font-serif text-lg font-medium text-tone-heading">{catMeta.name}</h3>
                  <p className="text-xs text-tone-muted">{catMeta.description}</p>
                </div>
                <Badge variant="navy">{catServices.length} Services</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {catServices.map((service) => (
                  <Card key={service.slug} background="white" className="hover:border-navy transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-base font-serif text-tone-heading leading-snug">
                          {service.title}
                        </CardTitle>
                        <Badge variant="success">Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 text-xs">
                      <p className="text-tone-muted line-clamp-2">{service.two_sentence_promise}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-tone-rule text-[11px] text-tone-muted">
                        <span>Turnaround: {service.turnaround_text}</span>
                        <span className="font-medium text-tone-heading">
                          From ₦{service.starting_price_ngn.toLocaleString()} / ${service.starting_price_usd}
                        </span>
                      </div>
                      <div className="pt-2 flex justify-end gap-2">
                        <Button variant="secondary" size="sm" href={`/services/${service.slug}`}>
                          Preview Page
                        </Button>
                        <Button variant="primary" size="sm" href={`/admin/services/${service.slug}`}>
                          Edit Content &rarr;
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardShell>
  );
}

