"use client";

import React, { useEffect, useState, useRef } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useStudent } from "@/components/layout/student-context";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  UploadCloud,
  FileText,
  Eye,
  Download,
  FolderKanban,
  CheckCircle2,
  Lock,
  Users,
  X,
  FileCode,
  Table as TableIcon,
} from "lucide-react";

export default function StudentFilesPage() {
  const student = useStudent();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload Form State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [versionLabel, setVersionLabel] = useState("v1.0");
  const [shareWithMentor, setShareWithMentor] = useState(true);
  const [notes, setNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  // Inline PDF Preview Modal State
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string } | null>(null);

  const loadFiles = async () => {
    try {
      const res = await fetch("/api/student/files");
      const json = await res.json();
      if (res.ok) {
        setFiles(json.files || []);
        setProjects(json.projects || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      toast({ title: "No file selected", message: "Please choose a file to upload.", type: "error" });
      return;
    }

    if (uploadFile.size > 26214400) {
      toast({ title: "File Too Large", message: "Maximum file size allowed is 25 MB.", type: "error" });
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append("file", uploadFile);
    if (selectedProjectId) formData.append("projectId", selectedProjectId);
    formData.append("versionLabel", versionLabel);
    formData.append("visibility", shareWithMentor ? "shared_with_mentor" : "private");
    if (notes) formData.append("notes", notes);

    try {
      setUploadProgress(60);
      const res = await fetch("/api/student/files", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(90);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Upload failed");
      }

      setUploadProgress(100);
      toast({
        title: "File Uploaded",
        message: `${uploadFile.name} (${versionLabel}) saved securely.`,
        type: "success",
      });

      // Reset form
      setUploadFile(null);
      setNotes("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadFiles();
    } catch (err: any) {
      toast({ title: "Upload Failed", message: err.message, type: "error" });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Group files by project
  const groupedFiles: Record<string, any[]> = {};
  for (const f of files) {
    const key = f.projectTitle || "Independent Drafts";
    if (!groupedFiles[key]) groupedFiles[key] = [];
    groupedFiles[key].push(f);
  }

  return (
    <DashboardShell
      role="student"
      title="Files & Drafts"
      user={{
        name: student.name,
        email: student.email,
        institution: student.institution,
      }}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-tone-rule pb-5 space-y-1">
          <span className="type-micro text-gold">Manuscript & Empirical Repository</span>
          <h1 className="font-serif text-2xl font-medium text-tone-heading">
            Files, Draft Chapters & Analysis Data
          </h1>
          <p className="text-xs text-tone-muted leading-relaxed font-sans">
            Store revision drafts, statistical syntax scripts, and review feedback privately. All downloads use encrypted, signed URLs.
          </p>
        </div>

        {/* UPLOAD PANEL (Drag & Drop + Versioning) */}
        <div className="bg-white border border-tone-rule rounded-[2px] p-6 space-y-5 shadow-xs">
          <div className="flex items-center gap-2 border-b border-tone-rule pb-3">
            <UploadCloud className="w-4 h-4 text-gold" />
            <h2 className="font-serif text-base font-semibold text-tone-heading">
              Upload New Research Draft
            </h2>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-sans">
            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed p-6 text-center rounded-[2px] transition-colors cursor-pointer ${
                isDragging
                  ? "border-navy bg-navy/5"
                  : "border-tone-rule bg-paper/50 hover:bg-paper"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.csv,.sav,.r,.py,.zip,.txt"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setUploadFile(e.target.files[0]);
                  }
                }}
              />
              <UploadCloud className="w-8 h-8 text-tone-muted mx-auto mb-2" />
              <p className="font-medium text-tone-heading">
                {uploadFile ? (
                  <span className="text-navy font-semibold">{uploadFile.name} ({Math.round(uploadFile.size / 1024)} KB)</span>
                ) : (
                  <span>Drag and drop manuscript or click to browse</span>
                )}
              </p>
              <span className="text-[10px] text-tone-muted block mt-1">
                Supported: PDF, Word (DOCX), CSV, SPSS (.sav), R (.r), Python (.py), ZIP (max 25 MB)
              </span>
            </div>

            {/* Upload Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Project Link */}
              <div className="space-y-1">
                <label className="font-semibold text-tone-heading block">Assign to Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full h-9 px-2.5 text-xs bg-white border border-tone-rule rounded-[2px] text-tone-heading focus:outline-none focus:border-navy"
                >
                  <option value="">Independent / General Workspace</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Version Label */}
              <div className="space-y-1">
                <label className="font-semibold text-tone-heading block">Version Label</label>
                <input
                  type="text"
                  value={versionLabel}
                  onChange={(e) => setVersionLabel(e.target.value)}
                  placeholder="e.g. v1.0, v2.1-methodology"
                  className="w-full h-9 px-2.5 text-xs bg-white border border-tone-rule rounded-[2px] focus:outline-none focus:border-navy"
                />
              </div>

              {/* Share with Mentor Toggle */}
              <div className="space-y-1 flex flex-col justify-end">
                <label className="flex items-center gap-2 cursor-pointer select-none pb-2">
                  <input
                    type="checkbox"
                    checked={shareWithMentor}
                    onChange={(e) => setShareWithMentor(e.target.checked)}
                    className="w-4 h-4 rounded-[2px] text-navy focus:ring-gold"
                  />
                  <span className="text-xs font-semibold text-tone-heading">
                    Share with assigned mentor
                  </span>
                </label>
              </div>
            </div>

            {/* Optional Notes */}
            <div className="space-y-1">
              <label className="font-semibold text-tone-heading block">
                Draft Notes / Change Log (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Added normality tests and removed multicollinear items in Table 4"
                className="w-full h-9 px-2.5 text-xs bg-white border border-tone-rule rounded-[2px] focus:outline-none focus:border-navy"
              />
            </div>

            {/* Progress Bar */}
            {isUploading && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-tone-muted">
                  <span>Encrypting & uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-1 bg-paper border border-tone-rule rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="accent"
                size="sm"
                disabled={isUploading || !uploadFile}
                className="font-semibold"
              >
                {isUploading ? "Uploading..." : "Save to Research Repository"}
              </Button>
            </div>
          </form>
        </div>

        {/* ORGANIZED FILES LIST */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-tone-rule pb-2">
            <h2 className="font-serif text-lg font-medium text-tone-heading">
              Repository Folders & Project Files
            </h2>
            <span className="text-xs text-tone-muted">Total Files: {files.length}</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : files.length === 0 ? (
            <EmptyState
              icon={<FileText className="w-8 h-8 text-tone-muted" />}
              title="No files in repository"
              description="Upload your draft thesis chapters, data files, or analysis scripts above to organize revisions."
            />
          ) : (
            Object.entries(groupedFiles).map(([projectTitle, projectFileList]) => (
              <div
                key={projectTitle}
                className="bg-white border border-tone-rule rounded-[2px] overflow-hidden shadow-xs"
              >
                <div className="bg-paper px-5 py-3 border-b border-tone-rule flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-gold" />
                    <h3 className="font-serif text-sm font-semibold text-tone-heading">
                      {projectTitle}
                    </h3>
                  </div>
                  <span className="text-[11px] text-tone-muted">
                    {projectFileList.length} item{projectFileList.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="divide-y divide-tone-rule text-xs">
                  {projectFileList.map((f) => (
                    <div
                      key={f.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-paper/30 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-tone-heading flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-navy shrink-0" />
                            {f.fileName}
                          </span>
                          <span className="bg-paper border border-tone-rule font-mono text-[10px] px-1.5 py-0.5 rounded-[2px] text-tone-muted">
                            {f.versionLabel}
                          </span>
                          {f.visibility === "shared_with_mentor" ? (
                            <span className="text-[10px] text-navy flex items-center gap-1 bg-navy/5 px-1.5 py-0.5 rounded-[2px]">
                              <Users className="w-2.5 h-2.5" /> Shared with mentor
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-500 flex items-center gap-1 bg-stone-100 px-1.5 py-0.5 rounded-[2px]">
                              <Lock className="w-2.5 h-2.5" /> Private draft
                            </span>
                          )}
                        </div>

                        {f.notes && (
                          <p className="text-[11px] text-tone-muted italic">
                            &ldquo;{f.notes}&rdquo;
                          </p>
                        )}

                        <span className="text-[10px] text-stone-400 font-mono block">
                          {Math.round(f.sizeBytes / 1024)} KB &bull; Uploaded{" "}
                          {new Date(f.uploadedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {/* File Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {f.isPdf && f.signedUrl && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-xs"
                            onClick={() => setPreviewFile({ url: f.signedUrl, name: f.fileName })}
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            <span>Preview</span>
                          </Button>
                        )}
                        {f.signedUrl && (
                          <a
                            href={f.signedUrl}
                            download={f.fileName}
                            className="inline-flex items-center btn-secondary text-xs px-3 py-1.5 rounded-[2px]"
                          >
                            <Download className="w-3.5 h-3.5 mr-1 text-gold" />
                            <span>Download</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* INLINE PDF PREVIEW MODAL */}
        {previewFile && (
          <div className="fixed inset-0 z-50 bg-navy/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-tone-rule rounded-[2px] w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
              <div className="p-3.5 bg-paper border-b border-tone-rule flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gold" />
                  <span className="font-serif text-sm font-semibold text-tone-heading truncate max-w-md">
                    {previewFile.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={previewFile.url}
                    download={previewFile.name}
                    className="inline-flex items-center btn-secondary text-xs px-3 py-1.5 rounded-[2px]"
                  >
                    <Download className="w-3 h-3 mr-1 text-gold" />
                    <span>Download</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setPreviewFile(null)}
                    aria-label="Close Preview"
                    className="text-tone-muted hover:text-tone-heading p-1.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-stone-100">
                <iframe
                  src={previewFile.url}
                  className="w-full h-full border-none"
                  title={`Preview of ${previewFile.name}`}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

