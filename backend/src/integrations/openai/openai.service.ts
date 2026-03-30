import { env } from "../../config/env";
import type { CapabilityGap, CreateTranslationRequest, TranslationResult } from "../../modules/translations/translation.types";
import { openai } from "./openai.client";

interface OpenAITranslationResult {
  transformedResume: string;
  matchedKeywords: string[];
  skillGaps: string[];
  capabilityGaps: CapabilityGap[];
  profileSummary: string;
}

function buildProfileContext(input: CreateTranslationRequest): string {
  if (!input.profile) return "";
  const { major, role, opportunityType, schedulePreference, handshakeConnected } = input.profile;
  return [
    major ? `Major: ${major}` : null,
    role ? `Target Role: ${role}` : null,
    `Opportunity: ${opportunityType}`,
    `Schedule: ${schedulePreference}`,
    handshakeConnected ? "Handshake profile linked" : null
  ]
    .filter(Boolean)
    .join(" | ");
}

export async function translateWithAI(input: CreateTranslationRequest): Promise<TranslationResult> {
  const profileContext = buildProfileContext(input);
  const companyLine = input.company ? ` at ${input.company}` : "";

  const systemPrompt = `You are an expert career advisor and resume writer specializing in helping students and early-career candidates land jobs. Your task is to rewrite a resume to better align with a specific job posting.

Rules:
- Keep all experience and facts accurate — do not fabricate achievements
- Reframe existing bullet points using the language, keywords, and priorities from the job description
- Identify skills mentioned in the job description that are present in the resume (matchedKeywords)
- Identify skills in the job description that are missing from the resume (skillGaps)
- Flag the most important gaps as capabilityGaps with actionable recommendations

You MUST respond with valid JSON only. No markdown, no explanation outside the JSON.

JSON schema:
{
  "transformedResume": "string — the full rewritten resume",
  "matchedKeywords": ["string", ...],
  "skillGaps": ["string", ...],
  "capabilityGaps": [
    {
      "capability": "string",
      "severity": "high" | "medium" | "low",
      "evidence": "string — why this gap matters for the role",
      "recommendation": "string — specific action the candidate should take"
    }
  ],
  "profileSummary": "string — one sentence positioning summary"
}

Return at most 10 matchedKeywords, 8 skillGaps, and 5 capabilityGaps.`;

  const userPrompt = `Job Title: ${input.jobTitle}${companyLine}
${profileContext ? `Student Profile: ${profileContext}` : ""}

--- JOB DESCRIPTION ---
${input.jobDescription}

--- RESUME ---
${input.resumeText}`;

  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("OpenAI returned an empty response");
  }

  const parsed = JSON.parse(raw) as OpenAITranslationResult;

  return {
    transformedResume: parsed.transformedResume ?? "",
    matchedKeywords: Array.isArray(parsed.matchedKeywords) ? parsed.matchedKeywords : [],
    skillGaps: Array.isArray(parsed.skillGaps) ? parsed.skillGaps : [],
    capabilityGaps: Array.isArray(parsed.capabilityGaps) ? parsed.capabilityGaps : [],
    profileSummary: parsed.profileSummary ?? profileContext
  };
}
