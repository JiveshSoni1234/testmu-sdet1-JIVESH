# AI Usage Log

> This document records every AI tool used during the TestMu SDET-1 assessment, the purpose it served, and the output it helped generate.

---

# Tool Used: ChatGPT

| # | Task | What I Used It For | What It Produced |
|---|------|--------------------|------------------|
| 1 | Framework Setup | Planned the Playwright project structure and folder organization | Suggested a scalable project structure with reusable folders and configuration files |
| 2 | Prompt Engineering | Created and refined prompts for Login, Dashboard, and REST API modules | Well-structured prompts that generated comprehensive test scenarios |
| 3 | Login Test Generation | Generated functional, negative, and security-related login test cases | Login scenarios in Gherkin and Playwright format |
| 4 | Dashboard Test Generation | Generated UI validation scenarios for widgets, filters, sorting, permissions, and responsiveness | Dashboard automation test cases |
| 5 | REST API Test Generation | Generated API scenarios covering authentication, CRUD operations, schema validation, and error handling | API automation test cases |
| 6 | Playwright Automation | Assisted in converting generated scenarios into Playwright test scripts | JavaScript Playwright test files following framework standards |
| 7 | Gemini Integration | Assisted in implementing Google Gemini API for failed test analysis | `failureExplainer.js` that sends failed test details to Gemini, receives AI-generated root cause analysis and suggested fixes, and attaches the response to the Allure Report |
| 8 | Documentation | Helped prepare README.md, prompts.md, and project documentation | Professional project documentation and execution guide |
| 9 | Debugging | Assisted in resolving Playwright configuration issues, Gemini API integration, environment variables, and execution errors | Improved framework stability and successful LLM integration |

---

# AI-Assisted Development

## Task 1 – Framework Setup

**AI Contribution**
- Suggested a clean and scalable Playwright framework.
- Recommended folder organization and reusable utility classes.
- Helped structure configuration files.

**Output**
- Organized Playwright automation framework.

---

## Task 2 – Prompt Engineering

**AI Contribution**
- Improved prompts through multiple iterations.
- Suggested better wording to generate higher-quality test cases.

**Output**
- Login prompts
- Dashboard prompts
- REST API prompts
- Gherkin scenarios
- Playwright automation scenarios

---

## Task 3 – LLM Integration

**Selected Option:** Option A – Failure Explainer

**AI Contribution**
- Assisted in integrating the Google Gemini API into the Playwright framework.
- Helped design prompts for analyzing failed test executions.
- Suggested formatting for AI-generated explanations.
- Assisted in attaching AI responses to Allure Reports.

**Output**
Whenever a Playwright test fails:

- Failure details are collected.
- Google Gemini analyzes the failure.
- AI generates:
  - Root Cause Analysis
  - Failure Explanation
  - Suggested Fix
- The AI response is attached to the Allure Report for easier debugging.

---

# Allure Report Enhancement

AI was used to integrate failure analysis directly into the reporting process.

Each failed test contains:

- AI Failure Summary
- Root Cause Analysis
- Suggested Resolution
- Complete Gemini Response

This reduces manual debugging effort and provides actionable insights directly within the report.

---

# Documentation

AI assisted in preparing:

- README.md
- prompts.md
- ai-usage-log.md
- Sample AI output documentation

---

# Summary

| AI Tool | Primary Usage |
|----------|---------------|
| ChatGPT | Framework planning, prompt engineering, Playwright automation, Gemini integration, debugging, documentation |

---

# Key Learnings

1. Specific prompts generated more accurate and reusable test cases than generic prompts.

2. Providing detailed module context significantly improved AI-generated outputs.

3. Integrating Google Gemini into the automation framework enables automatic failure analysis and faster root cause identification.

4. Attaching AI-generated explanations directly to Allure Reports makes debugging more efficient.

5. All AI-generated content was manually reviewed, validated, and refined before being incorporated into the final solution.

---

# Human Contribution

The following work was completed manually:

- Playwright framework implementation
- Test execution and validation
- Google Gemini API configuration
- Integration of AI responses with Allure Reports
- Verification of generated test cases
- Review and refinement of AI-generated content
- Final debugging and project testing

---

**Note:** AI was used as a development assistant to improve productivity and implementation quality. All outputs generated with AI were reviewed, validated, and modified where necessary before being included in the final submission.