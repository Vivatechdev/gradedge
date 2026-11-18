import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireRole("admin");
    const { id: projectId } = await params;
    const supabase = createServiceRoleClient();

    // Admin sees all files for this project
    const { data: files, error } = await supabase
      .from("files")
      .select("id, project_id, owner_id, file_name, mime_type, size_bytes, visibility, version_label, notes, uploaded_at, bucket_path, profiles:owner_id(full_name, email)")
      .eq("project_id", projectId)
      .order("uploaded_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Generate signed download URLs (valid 1 hour)
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
          fileName: f.file_name,
          mimeType: f.mime_type,
          sizeBytes: f.size_bytes,
          visibility: f.visibility,
          versionLabel: f.version_label || "v1.0",
          notes: f.notes,
          uploadedAt: f.uploaded_at,
          uploadedBy: f.profiles?.full_name || f.profiles?.email || "Unknown Author",
          signedUrl,
        };
      })
    );

    // Audit log admin access
    await supabase.from("audit_log").insert({
      actor_id: user.id,
      action: "admin_viewed_project_files",
      entity: "project",
      entity_id: projectId,
      metadata: { files_count: filesWithSignedUrls.length },
    });

    return NextResponse.json({ files: filesWithSignedUrls });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unauthorized" }, { status: 401 });
  }
}

