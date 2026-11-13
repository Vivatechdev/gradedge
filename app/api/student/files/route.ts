import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { requireUser } from "@/lib/auth/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/csv",
  "application/x-spss-sav",
  "application/octet-stream",
  "text/plain",
  "text/x-r",
  "text/x-python",
  "application/zip",
  "application/x-zip-compressed",
];

const MAX_FILE_SIZE = 26214400; // 25 MB

export async function GET() {
  try {
    const { user } = await requireUser();
    const supabase = createServiceRoleClient();

    // Fetch user's files with project title
    const { data: files, error } = await supabase
      .from("files")
      .select("id, project_id, file_name, mime_type, size_bytes, visibility, version_label, notes, uploaded_at, bucket_path, projects(id, title)")
      .eq("owner_id", user.id)
      .order("uploaded_at", { ascending: false });

    if (error) {
      throw error;
    }

    // Generate signed preview/download URLs (valid 1 hour)
    const filesWithSignedUrls = await Promise.all(
      (files || []).map(async (f: any) => {
        let signedUrl = "";
        try {
          const { data: signRes } = await supabase.storage
            .from("project-files")
            .createSignedUrl(f.bucket_path, 3600);
          signedUrl = signRes?.signedUrl || "";
        } catch {
          signedUrl = "";
        }

        return {
          id: f.id,
          projectId: f.project_id,
          projectTitle: f.projects?.title || "Independent Drafts",
          fileName: f.file_name,
          mimeType: f.mime_type,
          sizeBytes: f.size_bytes,
          visibility: f.visibility,
          versionLabel: f.version_label || "v1.0",
          notes: f.notes,
          uploadedAt: f.uploaded_at,
          signedUrl,
          isPdf: f.mime_type === "application/pdf" || f.file_name.toLowerCase().endsWith(".pdf"),
        };
      })
    );

    // Also fetch user's projects for project assignment selector
    const { data: userProjects } = await supabase
      .from("projects")
      .select("id, title")
      .eq("student_id", user.id);

    return NextResponse.json({
      files: filesWithSignedUrls,
      projects: userProjects || [],
    });
  } catch (err: any) {
    console.error("[Student Files GET Error]", err);
    return NextResponse.json({ error: err.message || "Failed to load files" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireUser();
    const supabase = createServiceRoleClient();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const projectId = (formData.get("projectId") as string) || null;
    const versionLabel = ((formData.get("versionLabel") as string) || "v1.0").trim();
    const visibility = (formData.get("visibility") as string) === "private" ? "private" : "shared_with_mentor";
    const notes = ((formData.get("notes") as string) || "").trim();

    if (!file) {
      return NextResponse.json({ error: "No file provided for upload." }, { status: 400 });
    }

    // Size validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds 25 MB limit (${Math.round(file.size / 1024 / 1024)} MB).` },
        { status: 400 }
      );
    }

    // Type validation
    const mimeType = file.type || "application/octet-stream";
    const fileName = file.name;
    const ext = fileName.split(".").pop()?.toLowerCase();
    const allowedExts = ["pdf", "doc", "docx", "csv", "sav", "r", "py", "zip", "txt"];

    if (!allowedExts.includes(ext || "")) {
      return NextResponse.json(
        { error: `File type .${ext} is not supported. Please upload PDF, Word, CSV, SPSS (.sav), R, Python, or ZIP.` },
        { status: 400 }
      );
    }

    // Read bytes
    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const bucketPath = `${user.id}/${Date.now()}_${safeName}`;

    // Upload to private Supabase Storage 'project-files'
    const { error: uploadErr } = await supabase.storage
      .from("project-files")
      .upload(bucketPath, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadErr) {
      console.error("[Storage Upload Error]", uploadErr);
      return NextResponse.json({ error: `Storage upload failed: ${uploadErr.message}` }, { status: 500 });
    }

    // Insert database record in 'files'
    const { data: fileRecord, error: insertErr } = await supabase
      .from("files")
      .insert({
        owner_id: user.id,
        project_id: projectId && projectId.length === 36 ? projectId : null,
        bucket_path: bucketPath,
        file_name: fileName,
        mime_type: mimeType,
        size_bytes: file.size,
        visibility,
        version_label: versionLabel,
        notes: notes || null,
      })
      .select()
      .single();

    if (insertErr) {
      console.error("[File Record Insert Error]", insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    // Audit log
    await supabase.from("audit_log").insert({
      actor_id: user.id,
      action: "file_uploaded",
      entity: "file",
      entity_id: fileRecord.id,
      metadata: {
        file_name: fileName,
        size_bytes: file.size,
        version_label: versionLabel,
        visibility,
        project_id: projectId,
      },
    });

    return NextResponse.json({ success: true, file: fileRecord });
  } catch (err: any) {
    console.error("[Student Files POST Error]", err);
    return NextResponse.json({ error: err.message || "Failed to process upload" }, { status: 500 });
  }
}

