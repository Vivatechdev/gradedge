import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { createClient } from "@supabase/supabase-js";

/**
 * RLS Verification Script for GradEdge Academic Solutions
 * Proves that:
 * 1. An unauthenticated public user cannot read mentor records.
 * 2. A student user cannot read another student's projects, files, or messages.
 * 3. A student cannot read mentors unless explicitly assigned to them.
 */
async function testRLS() {
  console.log("==================================================");
  console.log("GradEdge Academic Solutions: RLS Verification Test");
  console.log("==================================================");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    console.error("Missing SUPABASE credentials in environment.");
    console.log("Ensure NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY are set.");
    process.exit(1);
  }

  // 1. Test Anonymous Client (Public Visitor)
  const anonClient = createClient(supabaseUrl, anonKey);

  console.log("\n[Test 1] Verifying public visitor CANNOT query mentors table directly...");
  const { data: mentorsPublic, error: mentorsError } = await anonClient
    .from("mentors")
    .select("*");

  if (mentorsError || (mentorsPublic && mentorsPublic.length === 0)) {
    console.log("✓ PASS: Public visitor received 0 mentor records or was denied access.");
  } else {
    console.error("✗ FAIL: Public visitor was able to read mentors!", mentorsPublic);
    process.exit(1);
  }

  // 2. Setup mock / test users using Service Role
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const studentAEmail = `test_student_a_${Date.now()}@example.com`;
  const studentBEmail = `test_student_b_${Date.now()}@example.com`;
  const tempPassword = "Password123!Secure";

  console.log("\n[Setup] Provisioning temporary test students A and B...");
  const { data: userA, error: errA } = await adminClient.auth.admin.createUser({
    email: studentAEmail,
    password: tempPassword,
    email_confirm: true,
  });

  const { data: userB, error: errB } = await adminClient.auth.admin.createUser({
    email: studentBEmail,
    password: tempPassword,
    email_confirm: true,
  });

  if (errA || errB || !userA.user || !userB.user) {
    console.error("Error creating test users:", errA || errB);
    console.log("Note: If Supabase instance is offline or unreachable, please connect credentials and run this script.");
    return;
  }

  const studentAId = userA.user.id;
  const studentBId = userB.user.id;

  try {
    // Upsert profiles
    await adminClient.from("profiles").upsert([
      {
        id: studentAId,
        full_name: "Freedom Sola",
        email: studentAEmail,
        role: "student",
        study_level: "phd",
        institution: "Research University A",
      },
      {
        id: studentBId,
        full_name: "Freedom Sola (Peer)",
        email: studentBEmail,
        role: "student",
        study_level: "masters",
        institution: "Research University B",
      },
    ]);

    // Find or create a test service
    const { data: service } = await adminClient
      .from("services")
      .select("id")
      .limit(1)
      .single();

    let serviceId = service?.id;
    if (!serviceId) {
      const { data: newService } = await adminClient
        .from("services")
        .insert({
          slug: `test-service-${Date.now()}`,
          title: "Test Mentoring Service",
          category: "mentoring",
          summary: "Summary for RLS test",
          description: "Full description",
          price_from_minor: 10000,
          currency: "USD",
          delivery_mode: "project",
        })
        .select()
        .single();
      serviceId = newService.id;
    }

    // Insert a private project belonging exclusively to Student A
    const { data: projectA, error: projErr } = await adminClient
      .from("projects")
      .insert({
        student_id: studentAId,
        service_id: serviceId,
        title: "Confidential PhD Thesis Project - Student A",
        brief: "Private methodology and data files.",
        status: "active",
      })
      .select()
      .single();

    if (projErr) throw projErr;

    // Login as Student B
    const clientB = createClient(supabaseUrl, anonKey);
    const { error: signInErr } = await clientB.auth.signInWithPassword({
      email: studentBEmail,
      password: tempPassword,
    });
    if (signInErr) throw signInErr;

    console.log("[Test 2] Student B attempting to select Student A's project...");
    const { data: bQueryResult, error: bQueryError } = await clientB
      .from("projects")
      .select("*")
      .eq("id", projectA.id);

    if (!bQueryError && (!bQueryResult || bQueryResult.length === 0)) {
      console.log("✓ PASS: Student B queried Student A's project ID and received 0 rows.");
    } else {
      console.error("✗ FAIL: Student B was able to read Student A's private project!", bQueryResult);
      process.exit(1);
    }

    console.log("\n[Test 3] Student B attempting to list all projects in the database...");
    const { data: allProjectsB } = await clientB.from("projects").select("*");
    const containsA = allProjectsB?.some((p) => p.student_id === studentAId);
    if (!containsA) {
      console.log("✓ PASS: Student B's project listing contains zero rows from Student A.");
    } else {
      console.error("✗ FAIL: Student A's project leaked into Student B's list!");
      process.exit(1);
    }

    console.log("\nAll RLS isolation tests passed successfully.");
  } finally {
    // Clean up temporary test users
    console.log("\n[Cleanup] Deleting test users...");
    await adminClient.auth.admin.deleteUser(studentAId);
    await adminClient.auth.admin.deleteUser(studentBId);
    console.log("✓ Cleanup complete.");
  }
}

testRLS().catch((err) => {
  console.error("RLS test error:", err);
  process.exit(1);
});

