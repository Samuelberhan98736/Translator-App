import test from "node:test";
import assert from "node:assert/strict";
import { translateNow } from "../../src/modules/translations/translation.service";

test("translateNow returns transformed output with arrays", () => {
  const result = translateNow({
    jobTitle: "FinTech Analyst",
    jobDescription: "Risk analysis, compliance, reporting, stakeholder communication",
    resumeText: "Worked on reporting dashboards and stakeholder presentations"
  });

  assert.equal(typeof result.transformedResume, "string");
  assert.equal(Array.isArray(result.skillGaps), true);
  assert.equal(Array.isArray(result.matchedKeywords), true);
});
