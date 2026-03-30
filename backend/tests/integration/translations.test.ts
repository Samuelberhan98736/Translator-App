import test from "node:test";
import assert from "node:assert/strict";
import { translateWithAI } from "../../src/integrations/openai/openai.service";

test("translateWithAI returns structured output", async () => {
  const result = await translateWithAI({
    jobTitle: "FinTech Analyst",
    jobDescription: "Risk analysis, compliance, reporting, stakeholder communication",
    resumeText: "Worked on reporting dashboards and stakeholder presentations"
  });

  assert.equal(typeof result.transformedResume, "string");
  assert.equal(Array.isArray(result.skillGaps), true);
  assert.equal(Array.isArray(result.matchedKeywords), true);
  assert.equal(Array.isArray(result.capabilityGaps), true);
});
