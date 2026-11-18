"use client";

import React, { useState, useRef, DragEvent } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface UploadedFileResult {
  id: string;
  fileName: string;
  sizeBytes: number;
  mimeType: string;
  bucketPath: string;
  signedUrl?: string;
  versionLabel?: string;
  visibility: string;
}

interface SharedFileUploadProps {
  projectId?: string | null;
  onUploadComplete?: (file: UploadedFileResult) => void;
  maxSizeBytes?: number; // Defaults to 25 MB
  allowedExtensions?: string[]; // Defaults to standard academic research types
  className?: string;
  compact?: boolean;
}

const DEFAULT_ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "csv", "sav", "r", "py", "zip", "txt"];
const DEFAULT_MAX_SIZE = 26214400; // 25 MB

export function SharedFileUpload({
  projectId,
  onUploadComplete,
  maxSizeBytes = DEFAULT_MAX_SIZE,
  allowedExtensions = DEFAULT_ALLOWED_EXTENSIONS,
  className = "",
  compact = false,
}: SharedFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [versionLabel, setVersionLabel] = useState("v1.0");
  const [visibility, setVisibility] = useState<"shared_with_mentor" | "private">("shared_with_mentor");
  const [notes, setNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // =========================================================================
  // CLIENT-SIDE VALIDATION
  // =========================================================================
  const validateFile = (file: File): string | null => {
    if (file.size > maxSizeBytes) {
      const maxMb = Math.round(maxSizeBytes / (1024 * 1024));
      const actualMb = (file.size / (1024 * 1024)).toFixed(1);
      return `File exceeds maximum allowed size of ${maxMb} MB (selected: ${actualMb} MB).`;
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !allowedExtensions.includes(ext)) {
      return `Invalid file format .${ext || "unknown"}. Permitted formats: ${allowedExtensions.map((e) => `.${e}`).join(", ")}.`;
    }

    return null;
  };

  const handleFileSelection = (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const error = validateFile(file);
    if (error) {
      setErrorMessage(error);
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  // =========================================================================
  // VIRUS SCAN PLACEHOLDER HOOK
  // =========================================================================
  const runPreUploadVirusScanPlaceholder = async (file: File): Promise<boolean> => {
    // =========================================================================
    // TODO [PRODUCTION VIRUS SCAN]:
    // In a production environment, pass file buffer through an anti-malware pipeline
    // (e.g. AWS GuardDuty S3 Malware Protection, ClamAV daemon sidecar, or VirusTotal API)
    // before committing to the unquarantined storage bucket.
    // =========================================================================
    return true;
  };

  // =========================================================================
  // UPLOAD DISPATCHER
  // =========================================================================
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setProgress(15);
    setErrorMessage(null);

    try {
      // 1. Virus scan hook check
      await runPreUploadVirusScanPlaceholder(selectedFile);
      setProgress(35);

      const formData = new FormData();
      formData.append("file", selectedFile);
      if (projectId) formData.append("projectId", projectId);
      formData.append("versionLabel", versionLabel.trim() || "v1.0");
      formData.append("visibility", visibility);
      if (notes.trim()) formData.append("notes", notes.trim());

      // Progress animation simulation for standard fetch
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            clearInterval(progressInterval);
            return 85;
          }
          return prev + 15;
        });
      }, 150);

      const res = await fetch("/api/student/files", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "File upload failed.");
      }

      setSuccessMessage(`"${selectedFile.name}" was uploaded successfully.`);
      setSelectedFile(null);
      setNotes("");

      if (onUploadComplete && result.file) {
        onUploadComplete({
          id: result.file.id,
          fileName: result.file.file_name,
          sizeBytes: result.file.size_bytes,
          mimeType: result.file.mime_type,
          bucketPath: result.file.bucket_path,
          versionLabel: result.file.version_label,
          visibility: result.file.visibility,
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`w-full bg-white border border-tone-rule rounded-[2px] p-5 ${className}`}>
      {/* Dropzone Container */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        aria-label="Upload document dropzone. Drag and drop file or click to select."
        className={`relative border-2 border-dashed rounded-[2px] p-6 text-center cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${
          isDragging
            ? "border-gold bg-cream/40"
            : "border-tone-rule hover:border-navy hover:bg-paper/40"
        } ${isUploading ? "opacity-60 cursor-not-allowed pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={allowedExtensions.map((e) => `.${e}`).join(",")}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileSelection(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <UploadCloud className="h-8 w-8 text-tone-muted" aria-hidden="true" />
          <p className="text-sm font-medium text-tone-heading">
            Drag & drop manuscript or dataset, or <span className="text-gold underline">browse files</span>
          </p>
          <p className="text-xs text-tone-muted">
            Supported: PDF, Word (.docx), CSV, SPSS (.sav), R, Python (.py), ZIP &bull; Max 25 MB
          </p>
        </div>
      </div>

      {/* Selected File Details & Metadata Controls */}
      {selectedFile && (
        <div className="mt-4 p-4 bg-paper border border-tone-rule rounded-[2px] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <FileText className="h-4 w-4 text-navy shrink-0" />
              <span className="text-xs font-semibold text-tone-heading truncate">{selectedFile.name}</span>
              <span className="text-[11px] text-tone-muted">
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            {!isUploading && (
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-tone-muted hover:text-tone-heading p-1"
                aria-label="Remove selected file"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {!compact && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-tone-rule/60 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-tone-muted mb-1">
                  Draft Version Label
                </label>
                <input
                  type="text"
                  value={versionLabel}
                  onChange={(e) => setVersionLabel(e.target.value)}
                  placeholder="e.g. v1.2 Chapter 3"
                  className="w-full h-8 px-2.5 border border-tone-rule rounded-[2px] text-xs bg-white text-tone-heading focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-tone-muted mb-1">
                  Access Visibility
                </label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="w-full h-8 px-2 border border-tone-rule rounded-[2px] text-xs bg-white text-tone-heading focus:border-gold focus:outline-none"
                >
                  <option value="shared_with_mentor">Shared with Assigned Mentor & Admin</option>
                  <option value="private">Private (Only You & Admin)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-tone-muted mb-1">
                  Methodological Notes / Scoping Questions (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Specify particular sections or statistical questions for review..."
                  className="w-full h-8 px-2.5 border border-tone-rule rounded-[2px] text-xs bg-white text-tone-heading focus:border-gold focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] text-tone-muted">
                <span>Uploading to secure repository...</span>
                <span>{progress}%</span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                className="w-full h-1.5 bg-tone-rule rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-gold transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={isUploading}
              onClick={handleUpload}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Document"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Error / Success Feedback */}
      {errorMessage && (
        <div className="mt-3 flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-[2px]" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mt-3 flex items-start gap-2 p-2.5 bg-green-50 border border-green-200 text-green-800 text-xs rounded-[2px]" role="status">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
}

