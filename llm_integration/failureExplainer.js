// llm_integration/failureExplainer.js

// Option A uses a Large Language Model(LLM) to automatically analyze failed Playwright test
// cases. When a test fails, the framework captures the test name, error message, page URL,
// and HTML content.The HTML is cleaned and trimmed before being sent to the Gemini 
// LLM with a structured prompt. The AI returns a JSON response containing the root
// cause, suggested fix, severity, confidence level, and failure category. 
// This analysis is attached to the Playwright report and can also be saved
// as JSON and Markdown files.Overall, Option A simplifies debugging, reduces
//  analysis time, and helps QA engineers resolve test failures more efficiently.


// Import Google Gemini AI SDK
import { GoogleGenAI } from '@google/genai';

// Import Node.js modules for file and directory operations
import fs from 'fs';
import path from 'path';

// Initialize Gemini AI client using the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Define maximum character limits to avoid sending excessive data to the LLM
const MAX_HTML_CHARS = 4000;
const MAX_ERROR_CHARS = 2000;

/**
 * Cleans the HTML before sending it to the AI model.
 * Removes scripts, styles, comments, extra whitespace,
 * and limits the content size.
 */
function sanitizeHTML(html) {
  if (!html) return '';

  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_HTML_CHARS);
}

/**
 * Builds a structured prompt containing test details,
 * error message, URL, and page HTML for AI analysis.
 */
function buildPrompt({ testName, errorMessage, url, pageHTML }) {
  const trimmedError = (errorMessage || '').slice(0, MAX_ERROR_CHARS);
  const cleanHTML = sanitizeHTML(pageHTML);

  let context = `Test name: ${testName}\n`;
  context += `URL at failure: ${url || 'N/A'}\n`;
  context += `Error message:\n${trimmedError}\n`;

  if (cleanHTML) {
    context += `\nRelevant page HTML (truncated):\n${cleanHTML}\n`;
  }

  return `You are a senior QA engineer helping debug a failing Playwright UI test.

${context}

Respond with ONLY a JSON object (no markdown fences, no preamble, no extra text) matching exactly this shape:
{
  "rootCause": "one or two sentence plain-English explanation of what broke",
  "suggestedFix": "concrete, actionable suggestion for how to fix it",
  "severity": "low | medium | high | critical",
  "confidence": "low | medium | high",
  "category": "selector | timing | network | assertion | environment | data | unknown"
}`;
}

/**
 * Sends failure details to Gemini AI and returns
 * a structured analysis of the failed test.
 */
export async function explainTestFailure({
  testName,
  errorMessage,
  url,
  pageHTML,
}) {
  // Generate the AI prompt
  const prompt = buildPrompt({ testName, errorMessage, url, pageHTML });

  try {
    // Request analysis from Gemini AI
    const interaction = await ai.interactions.create({
      model: 'gemini-3.5-flash',
      input: prompt,
    });

    // Get the AI response
    const raw = (interaction.output_text || '').trim();

    // Remove Markdown code fences if present
    const cleaned = raw.replace(/^```json\s*|```$/g, '').trim();

    let parsed;

    try {
      // Parse the JSON response from the AI
      parsed = JSON.parse(cleaned);
    } catch {
      // Fallback when AI returns invalid JSON
      parsed = {
        rootCause: raw || 'LLM did not return parseable JSON.',
        suggestedFix: 'N/A',
        severity: 'unknown',
        confidence: 'low',
        category: 'unknown',
      };
    }

    // Return the final AI analysis
    return {
      testName,
      url,
      errorMessage,
      ...parsed,
    };
  } catch (err) {
    // Handle API or network failures
    return {
      testName,
      url,
      errorMessage,
      rootCause: `LLM analysis failed: ${err.message}`,
      suggestedFix: 'N/A — check GEMINI_API_KEY and network access.',
      severity: 'unknown',
      confidence: 'low',
      category: 'unknown',
    };
  }
}

/**
 * Saves AI analysis results as JSON and Markdown reports.
 */
export function saveLLMReport(analyses) {

  // Create reports directory if it doesn't exist
  const dir = path.join('reports');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Save report in JSON format
  const jsonPath = path.join(dir, 'ai-failure-report.json');
  fs.writeFileSync(jsonPath, JSON.stringify(analyses, null, 2));

  // Generate a human-readable Markdown report
  const mdPath = path.join(dir, 'ai-failure-report.md');
  const lines = ['# AI Failure Analysis Report', ''];

  analyses.forEach((a, i) => {
    lines.push(`## ${i + 1}. ${a.testName}`);
    lines.push(`- **URL:** ${a.url || 'N/A'}`);
    lines.push(`- **Severity:** ${a.severity}`);
    lines.push(`- **Confidence:** ${a.confidence}`);
    lines.push(`- **Category:** ${a.category}`);
    lines.push(`- **Root Cause:** ${a.rootCause}`);
    lines.push(`- **Suggested Fix:** ${a.suggestedFix}`);
    lines.push('');
  });

  // Save Markdown report
  fs.writeFileSync(mdPath, lines.join('\n'));

  // Return the generated report path
  return mdPath;
}