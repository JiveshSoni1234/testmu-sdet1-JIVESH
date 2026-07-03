import 'dotenv/config';
import { test as base, expect } from '@playwright/test';
import { explainTestFailure } from '../llm_integration/failureExplainer.js';

// Extend base test by creating an automatic custom worker/test fixture
export const test = base.extend({
    aiTeardown: [async ({ page }, use, testInfo) => {
        // This runs BEFORE each test (Setup phase)
        // Leave empty or add setup code if needed

        await use(); // This executes the actual test case

        // --- AFTER EACH HOOK LOGIC STARTS HERE ---
        // This forces Playwright to flush this console block into the stdout stream of every test worker!
        console.log(`AfterEach Hook -> ${testInfo.title}`);

        if (testInfo.status === testInfo.expectedStatus) return;

        let html = '';
        let url = '';

        try {
            // Safely fetch page data from whichever fixture context is active
            const page = testInfo.fixtures?.page;
            if (page && !page.isClosed()) {
                url = page.url();
                html = await page.content();
            }
        } catch {
            // Pure API tests fallback safely
        }

        await testInfo.attach('failure-context', {
            body: JSON.stringify({ url, html }),
            contentType: 'application/json',
        });

        const errorMessage = testInfo.errors?.map((e) => e.message).join('\n')
            || testInfo.error?.message
            || 'Unknown Error';

        let analysis;
        try {
            analysis = await explainTestFailure({
                testName: testInfo.title,
                errorMessage,
                url,
                pageHTML: html,
            });
        } catch (err) {
            analysis = {
                rootCause: err.message,
                suggestedFix: "Gemini call failed",
                severity: "unknown",
                confidence: "low",
                category: "unknown",
            };
        }

        const summaryMd = `## 🤖 AI Failure Analysis

**Root Cause:** ${analysis.rootCause}

**Suggested Fix:** ${analysis.suggestedFix}

**Severity:** ${analysis.severity} | **Confidence:** ${analysis.confidence} | **Category:** ${analysis.category}
`;

        await testInfo.attach('AI Failure Analysis', {
            body: summaryMd,
            contentType: 'text/markdown',
        });
    }, { auto: true }] // <-- Crucial: Runs automatically for every test that imports this file!
});

export { expect };