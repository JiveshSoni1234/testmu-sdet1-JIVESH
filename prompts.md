# prompts.md — Raw Prompts Used for Test Generation

> These are the exact prompts used during the development of this project.
> The prompts are documented without post-editing to demonstrate the prompt engineering process as required by the assignment.

**AI Tool Used:** ChatGPT

---

# SYSTEM ROLE CONDITIONING PROMPT

```
You are a Senior SDET and AI-Native Quality Engineer with expertise in Playwright, JavaScript, API Testing, and Quality Engineering.

Your goal is to build an automation solution that follows industry best practices and meets production-quality standards.

While generating responses:

- Think like a senior automation engineer.
- Generate reusable, maintainable, and scalable solutions.
- Cover functional, negative, edge, and security scenarios.
- Follow Playwright best practices.
- Generate clean JavaScript code using ES Modules.
- Produce realistic test cases instead of generic examples.
- Prioritize readability and maintainability.
- Ensure the final solution is suitable for an enterprise QA automation framework.
```

---

**Purpose**

This prompt was used before every task to provide context and improve the quality of AI-generated responses.

---

# MODULE 1 — LOGIN

## Prompt 1.1 (Initial Prompt)

```
Generate Login test cases.
```

### What didn't work

The generated output only covered basic login functionality. It missed negative scenarios, session validation, security checks, and proper formatting.

### What I changed

Added project context, required scenarios, output format, and framework-specific requirements.

---

## Prompt 1.2 (Final Prompt)

```
You are a Senior QA Automation Engineer.

Generate comprehensive Playwright test cases for the Login module of a web application.

Cover the following scenarios:

- Valid Login
- Invalid Username
- Invalid Password
- Empty Username
- Empty Password
- Empty Credentials
- SQL Injection Attempt
- Forgot Password
- Session Expiry
- Logout Validation
- Browser Back After Logout
- Direct URL Access Without Login

For every test case include:

- Test Case ID
- Test Title
- Preconditions
- Test Steps
- Expected Result

Generate the output in Gherkin format followed by Playwright implementation ideas.
```

### What didn't work first time

The initial response lacked reusable structure and missed security-related scenarios.

### What I changed

Specified the exact scenarios, required output format, and asked for Playwright-oriented test cases.

---

# MODULE 2 — DASHBOARD

## Prompt 2.1 (Initial Prompt)

```
Generate Dashboard test cases.
```

### What didn't work

The generated cases were generic and did not include widget validation, permissions, filtering, or responsiveness.

### What I changed

Provided detailed functional areas and required coverage.

---

## Prompt 2.2 (Final Prompt)

```
You are a Senior QA Automation Engineer.

Generate Playwright test scenarios for the Dashboard module.

Cover:

- Widget Loading
- Data Accuracy
- Sidebar Navigation
- Filter Functionality
- Sorting
- Responsive Layout
- Permission Based Visibility
- Unauthorized Access
- Dashboard Performance

For every scenario provide:

- Test ID
- Scenario
- Gherkin Steps
- Expected Result

Ensure the scenarios are suitable for automation using Playwright.
```

### What didn't work first time

The first output focused only on UI visibility and ignored permission validation and responsiveness.

### What I changed

Added explicit requirements for dashboard widgets, permissions, and responsive behaviour.

---

# MODULE 3 — REST API

## Prompt 3.1 (Initial Prompt)

```
Generate REST API test cases.
```

### What didn't work

The generated scenarios were very basic and did not include schema validation, authentication, or error handling.

### What I changed

Specified all required API validation categories and automation expectations.

---

## Prompt 3.2 (Final Prompt)

```
You are a Senior QA Automation Engineer.

Generate REST API test cases suitable for Playwright API Testing.

Include scenarios for:

- Authentication Validation
- CRUD Operations
- Request Validation
- Response Validation
- Status Code Verification
- Error Handling
- Schema Validation
- Rate Limiting
- Performance Validation

Provide:

- Test Case ID
- Scenario
- Expected Request
- Expected Response
- Expected Status Code

Generate automation-ready test cases.
```

### What didn't work first time

The initial output lacked detailed validation and focused only on happy-path API testing.

### What I changed

Added response validation, schema validation, rate limiting, and error scenarios.

---

# TASK 3 — LLM Integration

## Prompt Used

```
You are a Senior JavaScript Automation Engineer.

Build an AI-powered Failure Explainer for a Playwright automation framework using Google Gemini API.

When a Playwright test fails:

- Capture the test title
- Capture the error message
- Capture the stack trace
- Capture the page URL
- Capture additional execution details

Send the collected information to Google Gemini.

Gemini should return:

- Failure Summary
- Root Cause Analysis
- Possible Reason
- Suggested Fix
- Confidence Level

Requirements:

- Use Google Gemini API
- Use JavaScript ES Modules
- Return structured JSON
- Save the AI response
- Attach the response to the Allure Report
- Handle API failures gracefully
- Keep the implementation reusable and maintainable

Generate the complete implementation with appropriate comments.
```

### What didn't work first time

The first implementation generated only plain text responses and did not produce structured output suitable for reporting.

### What I changed

Modified the prompt to request structured JSON and explicit Allure Report integration.

---

# TASK 3 — ALLURE REPORT INTEGRATION

## Prompt Used

```
Enhance the Playwright automation framework so that whenever a test fails, the AI-generated response received from Google Gemini is automatically attached to the Allure Report.

The attachment should include:

- Failure Summary
- Root Cause Analysis
- Suggested Fix
- Complete AI Response

Ensure the report remains readable and easy for QA engineers to analyse.
```

### What didn't work first time

Initially, the AI response was only written to the console and JSON file.

### What I changed

Requested direct attachment of the AI response to the Allure Report to improve debugging and reporting.

