"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { BlogPostSchema, type BlogPostInput } from "@/lib/validators";

export default function AdminBlogManagementPage() {
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BlogPostInput>({
    resolver: zodResolver(BlogPostSchema),
    defaultValues: {
      status: "draft",
      reading_time_minutes: 6,
      featured_image: "/images/blog/header.jpg",
      featured_image_alt: "Academic research drafts, notebooks, and reference materials on desk",
    },
  });

  const watchedImage = watch("featured_image");
  const watchedAlt = watch("featured_image_alt");

  async function onSubmit(data: BlogPostInput) {
    setSuccessMessage("");
    try {
      // In production, save to supabase blog_posts table
      setSuccessMessage(`Post "${data.title}" drafted successfully with verified editorial alt text.`);
      reset();
    } catch {
      // Handle error
    }
  }

  return (
    <DashboardShell
      role="admin"
      title="Content & Blog Publishing"
      user={{
        name: "Freedom Sola",
        email: "freedom.sola@gradedge.internal",
        institution: "Academic Administration",
      }}
    >
      <div className="space-y-8 max-w-5xl">
        <div className="border-b border-tone-rule pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-tone-muted">
              Publishing Desk
            </span>
            <h2 className="text-2xl font-serif text-tone-heading mt-1">
              New Article & Imagery Metadata
            </h2>
            <p className="text-xs text-tone-muted mt-1">
              All GradEdge articles require editorial photography with mandatory screen-reader alt descriptions.
            </p>
          </div>
        </div>

        {successMessage && (
          <div className="p-4 bg-cream border border-gold/40 text-tone-heading text-xs rounded-[2px]">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-6">
            <Card background="white">
              <CardHeader>
                <CardTitle className="text-base font-serif text-tone-heading">Article Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div>
                  <label htmlFor="title" className="block font-medium text-tone-heading mb-1">
                    Article Title *
                  </label>
                  <input
                    id="title"
                    {...register("title")}
                    placeholder="e.g. Navigating Panel Econometrics in Dissertation Research"
                    className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                  {errors.title && <p className="text-danger mt-1">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="slug" className="block font-medium text-tone-heading mb-1">
                      URL Slug *
                    </label>
                    <input
                      id="slug"
                      {...register("slug")}
                      placeholder="navigating-panel-econometrics"
                      className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                    {errors.slug && <p className="text-danger mt-1">{errors.slug.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="reading_time_minutes" className="block font-medium text-tone-heading mb-1">
                      Reading Time (mins)
                    </label>
                    <input
                      id="reading_time_minutes"
                      type="number"
                      {...register("reading_time_minutes", { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="standfirst" className="block font-medium text-tone-heading mb-1">
                    Standfirst / Abstract *
                  </label>
                  <textarea
                    id="standfirst"
                    rows={3}
                    {...register("standfirst")}
                    placeholder="Concise 2-sentence summary contextualising the research problem..."
                    className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                  {errors.standfirst && <p className="text-danger mt-1">{errors.standfirst.message}</p>}
                </div>

                <div>
                  <label htmlFor="body_markdown" className="block font-medium text-tone-heading mb-1">
                    Body Content (Markdown) *
                  </label>
                  <textarea
                    id="body_markdown"
                    rows={8}
                    {...register("body_markdown")}
                    placeholder="Write the full scholarly article guidance..."
                    className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body focus:outline-none focus:ring-1 focus:ring-gold font-mono"
                  />
                  {errors.body_markdown && <p className="text-danger mt-1">{errors.body_markdown.message}</p>}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary">
                Save Draft
              </Button>
              <Button type="submit" variant="accent" disabled={isSubmitting}>
                {isSubmitting ? "Publishing..." : "Publish Article"}
              </Button>
            </div>
          </div>

          <div className="md:col-span-5 space-y-6">
            <Card background="white" topRuleGold>
              <CardHeader>
                <CardTitle className="text-base font-serif text-tone-heading">
                  Featured Image & Screen-Reader Alt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div>
                  <label htmlFor="featured_image" className="block font-medium text-tone-heading mb-1">
                    Image Source Path or URL *
                  </label>
                  <input
                    id="featured_image"
                    {...register("featured_image")}
                    placeholder="/images/blog/methodology.jpg"
                    className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body focus:outline-none focus:ring-1 focus:ring-gold font-mono"
                  />
                  {errors.featured_image && (
                    <p className="text-danger mt-1">{errors.featured_image.message}</p>
                  )}
                  <p className="text-[11px] text-tone-muted mt-1">
                    Must adhere to editorial rules: natural light, no faces or portraits, real academic desks or documents.
                  </p>
                </div>

                <div>
                  <label htmlFor="featured_image_alt" className="block font-medium text-tone-heading mb-1">
                    Required Screen-Reader Alt Text *
                  </label>
                  <textarea
                    id="featured_image_alt"
                    rows={3}
                    {...register("featured_image_alt")}
                    placeholder="e.g. Scholarly manuscript open to a statistical methods chapter with blue ink margin annotations"
                    className="w-full px-3 py-2 border border-tone-rule rounded-[2px] bg-paper text-tone-body focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                  {errors.featured_image_alt && (
                    <p className="text-danger mt-1">{errors.featured_image_alt.message}</p>
                  )}
                  <p className="text-[11px] text-tone-muted mt-1">
                    Describe visual elements precisely for visually impaired readers.
                  </p>
                </div>

                <div className="pt-2">
                  <span className="block font-medium text-tone-heading mb-2">Live Photo Preview (3:2)</span>
                  <div className="border border-tone-rule rounded-[2px] overflow-hidden bg-paper">
                    <Photo
                      src={watchedImage || "/images/blog/header.jpg"}
                      alt={watchedAlt || "Article preview image"}
                      aspectRatio="3:2"
                      caption="Preview of article header presentation"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
