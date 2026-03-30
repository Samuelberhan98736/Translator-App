/**
 * Seed script — creates 3 test users with profiles, resumes, job targets,
 * and completed translation jobs in Supabase.
 *
 * Run with:  npx ts-node --transpile-only src/scripts/seed.ts
 */

import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

// ─── Test users ───────────────────────────────────────────────────────────────

const TEST_USERS = [
  {
    email: "alice@test.com",
    password: "Password123!",
    profile: {
      major: "Computer Science",
      target_role: "Software Engineering Intern",
      opportunity_type: "internship" as const,
      schedule_preference: "full-time" as const,
      handshake_connected: true,
      summary: "Junior CS student focused on full-stack web development with React and Node.js. Experience with TypeScript, REST APIs, and agile workflows through two club projects."
    },
    resume: {
      title: "Alice – SWE Intern Resume",
      text: `Alice Johnson
alice@test.com | github.com/alicejohnson

EDUCATION
B.S. Computer Science, Georgia State University — Expected May 2026
GPA: 3.7 | Dean's List 2023, 2024

SKILLS
Languages: TypeScript, JavaScript, Python, Java
Frameworks: React, Node.js, Express
Tools: Git, Docker, PostgreSQL, Supabase

EXPERIENCE
Web Developer Intern — Campus IT Services (May 2024 – Aug 2024)
• Built internal ticket dashboard with React and REST API, reducing resolution time by 30%
• Wrote unit tests with Jest achieving 85% coverage

PROJECTS
Resume Translator App (2024)
• Full-stack app using Next.js, Supabase Auth, and OpenAI API
• Deployed on Vercel with CI/CD pipeline via GitHub Actions`
    },
    jobTargets: [
      {
        job_title: "Frontend Engineer Intern",
        company: "Google",
        job_description: "Build and maintain React-based UIs for internal tooling. Strong TypeScript and REST API experience required. Experience with testing frameworks a plus.",
        source: "manual" as const,
        opportunity_type: "internship" as const,
        schedule_preference: "full-time" as const
      },
      {
        job_title: "Software Engineer Intern",
        company: "Stripe",
        job_description: "Work on developer-facing APIs and dashboards. Node.js, TypeScript, PostgreSQL. Agile team environment. Previous internship experience preferred.",
        source: "handshake" as const,
        opportunity_type: "internship" as const,
        schedule_preference: "full-time" as const
      }
    ]
  },
  {
    email: "bob@test.com",
    password: "Password123!",
    profile: {
      major: "Information Systems",
      target_role: "Data Analyst",
      opportunity_type: "job" as const,
      schedule_preference: "full-time" as const,
      handshake_connected: false,
      summary: "Senior IS student with strong SQL and Python skills, experienced in Tableau and data pipeline work. Looking for full-time data analyst roles."
    },
    resume: {
      title: "Bob – Data Analyst Resume",
      text: `Bob Williams
bob@test.com | linkedin.com/in/bobwilliams

EDUCATION
B.S. Information Systems, Georgia State University — May 2025
GPA: 3.4

SKILLS
Languages: Python, SQL, R
Tools: Tableau, Power BI, Excel, dbt, Snowflake, Pandas

EXPERIENCE
Data Analyst Intern — Retail Co (Jan 2024 – Present)
• Designed 5 Tableau dashboards tracking $2M monthly revenue
• Automated weekly reporting ETL with Python, saving 6 hours/week

PROJECTS
Sales Forecasting Model (2024)
• Built regression model in Python predicting quarterly sales within 4% error
• Presented findings to senior leadership team`
    },
    jobTargets: [
      {
        job_title: "Data Analyst",
        company: "Delta Air Lines",
        job_description: "Analyze operational data using SQL and Python. Build Tableau reports for leadership. Experience with data warehousing (Snowflake or Redshift) required.",
        source: "manual" as const,
        opportunity_type: "job" as const,
        schedule_preference: "full-time" as const
      }
    ]
  },
  {
    email: "carol@test.com",
    password: "Password123!",
    profile: {
      major: "Cybersecurity",
      target_role: "Security Analyst Intern",
      opportunity_type: "internship" as const,
      schedule_preference: "part-time" as const,
      handshake_connected: true,
      summary: "Sophomore cybersecurity student with hands-on CTF experience and knowledge of network analysis tools. Seeking part-time security analyst internship."
    },
    resume: {
      title: "Carol – Security Intern Resume",
      text: `Carol Martinez
carol@test.com | github.com/carolm-sec

EDUCATION
B.S. Cybersecurity, Georgia State University — Expected May 2027
GPA: 3.8

SKILLS
Security: Wireshark, Nmap, Metasploit, Burp Suite
Languages: Python, Bash, PowerShell
Certifications: CompTIA Security+ (in progress)

EXPERIENCE
IT Support Volunteer — GSU Help Desk (Sep 2023 – Present)
• Assisted 50+ students/staff with account security and network issues
• Documented recurring phishing attempts and escalated to security team

CTF COMPETITIONS
PicoCTF 2024 — Top 15% nationally
HackTheBox Student Program — Active participant`
    },
    jobTargets: [
      {
        job_title: "Security Analyst Intern",
        company: "NCR Atleos",
        job_description: "Support SOC team with log analysis, vulnerability scanning, and incident response. Wireshark and SIEM experience preferred. Part-time schedule available.",
        source: "handshake" as const,
        opportunity_type: "internship" as const,
        schedule_preference: "part-time" as const
      }
    ]
  }
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function log(msg: string) { console.log(msg); }
function warn(msg: string) { console.warn(`  ⚠️  ${msg}`); }
function fail(msg: string) { console.error(`  ✗ ${msg}`); }

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  log("Starting seed...\n");

  for (const user of TEST_USERS) {
    log(`── ${user.email}`);

    // 1. Create auth user (skip if already exists)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true
    });

    let userId: string;

    if (authError) {
      if (authError.message.toLowerCase().includes("already been registered") ||
          authError.message.toLowerCase().includes("already exists")) {
        // Find existing user
        const { data: list } = await supabase.auth.admin.listUsers();
        const existing = list?.users.find((u) => u.email === user.email);
        if (!existing) { fail(`Cannot find existing user ${user.email}`); continue; }
        userId = existing.id;
        log(`  ↩ Auth user already exists (${userId})`);
      } else {
        fail(`Auth create failed: ${authError.message}`);
        continue;
      }
    } else {
      userId = authData.user.id;
      log(`  ✓ Auth user created (${userId})`);
    }

    // 2. Update profile (trigger auto-created a blank row on user insert)
    const { error: profileError } = await supabase
      .from("profiles")
      .update(user.profile)
      .eq("user_id", userId);

    if (profileError) {
      warn(`Profile update: ${profileError.message}`);
    } else {
      log(`  ✓ Profile updated`);
    }

    // 3. Upsert resume
    const { data: resumeData, error: resumeError } = await supabase
      .from("resumes")
      .upsert(
        { user_id: userId, title: user.resume.title, current_version: 1 },
        { onConflict: "id", ignoreDuplicates: false }
      )
      .select("id")
      .single();

    if (resumeError || !resumeData) {
      warn(`Resume insert: ${resumeError?.message}`);
    } else {
      log(`  ✓ Resume created (${resumeData.id})`);

      // 4. Insert resume version
      const { error: versionError } = await supabase
        .from("resume_versions")
        .upsert(
          {
            resume_id: resumeData.id,
            version: 1,
            extracted_text: user.resume.text
          },
          { onConflict: "resume_id,version", ignoreDuplicates: true }
        );

      if (versionError) {
        warn(`Resume version insert: ${versionError.message}`);
      } else {
        log(`  ✓ Resume version 1 saved`);
      }

      // 5. Insert job targets + translation jobs
      for (const jt of user.jobTargets) {
        const { data: jtData, error: jtError } = await supabase
          .from("job_targets")
          .insert({ user_id: userId, ...jt })
          .select("id")
          .single();

        if (jtError || !jtData) {
          warn(`Job target insert: ${jtError?.message}`);
          continue;
        }
        log(`  ✓ Job target: ${jt.job_title} @ ${jt.company}`);

        // 6. Create a completed translation job
        const { data: tjData, error: tjError } = await supabase
          .from("translation_jobs")
          .insert({
            user_id: userId,
            resume_id: resumeData.id,
            resume_version: 1,
            status: "completed",
            job_title: jt.job_title,
            company: jt.company,
            job_description: jt.job_description,
            source: jt.source,
            opportunity_type: jt.opportunity_type,
            schedule_preference: jt.schedule_preference,
            profile_snapshot: user.profile,
            started_at: new Date(Date.now() - 5000).toISOString(),
            finished_at: new Date().toISOString()
          })
          .select("id")
          .single();

        if (tjError || !tjData) {
          warn(`Translation job insert: ${tjError?.message}`);
          continue;
        }

        // 7. Insert translation output
        const { error: toError } = await supabase
          .from("translation_outputs")
          .insert({
            job_id: tjData.id,
            transformed_resume: `[Seed] Resume rewritten for ${jt.job_title} at ${jt.company}.\n\n${user.resume.text}`,
            matched_keywords: ["TypeScript", "React", "Node.js"],
            skill_gaps: ["Kubernetes", "GraphQL"],
            capability_gaps: [
              {
                capability: "GraphQL",
                severity: "medium",
                evidence: `${jt.job_title} at ${jt.company} mentions GraphQL but the resume does not.`,
                recommendation: "Add a small GraphQL project or mention familiarity in your skills section."
              }
            ],
            profile_summary: user.profile.summary
          });

        if (toError) {
          warn(`Translation output insert: ${toError.message}`);
        } else {
          log(`  ✓ Translation job + output seeded`);
        }
      }
    }

    log("");
  }

  log("Seed complete.");
  log("\nTest credentials (all share the same password):");
  for (const u of TEST_USERS) {
    log(`  ${u.email.padEnd(22)}  Password123!`);
  }
}

seed().catch((err) => {
  console.error("\nSeed failed:", err);
  process.exit(1);
});
