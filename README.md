# TestMu AI — SDET-1 Assessment

# AI-Native Quality Engineering Challenge

> **Candidate:** Jivesh  
> **Stack:** Node.js + Playwright + Google Gemini AI  
> **Target Application:** OrangeHRM Demo  
> https://opensource-demo.orangehrmlive.com

---

# 🚀 Quick Start

## Prerequisites

- Node.js v18 or above
- npm v8+
- Google Gemini API Key

---

# Installation

```bash
# Clone Repository
git clone <your-github-repository>

# Navigate to project
cd testmu-sdet1-jivesh

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Configure Gemini API Key

# Windows
set GEMINI_API_KEY=your_api_key

# Linux / macOS
export GEMINI_API_KEY=your_api_key
```

---

# 🧪 Execute Tests

```bash
# Run all tests
npx playwright test

# Login Tests
npx playwright test tests/login

# Dashboard Tests
npx playwright test tests/dashboard

# API Tests
npx playwright test tests/api

# Run headed mode
npx playwright test --headed
```

---

# 📊 View Reports

### HTML Report

```bash
npx playwright show-report
```

### Allure Report

Generate Report

```bash
allure generate allure-results --clean -o allure-report
```

Open Report

```bash
allure open allure-report
```

---

# 🤖 Task 3 – AI Failure Explainer

This project implements **Option A – Failure Explainer** using **Google Gemini AI**.

Whenever a Playwright test fails, the framework automatically:

- Captures the failed test details
- Captures the error message
- Captures execution details
- Sends the information to Google Gemini
- Receives AI-generated failure analysis
- Attaches the AI response directly to the Allure Report

The generated analysis contains:

- Failure Summary
- Root Cause Analysis
- Suggested Fix
- Confidence Level

Sample output is available inside:

```
llm_integration/
```

---

# 📂 Project Structure

```
testmu-sdet1-jivesh

│
├── .vscode/
│
├── allure-report/
├── allure-results/
│
├── features/
│   ├── api.feature
│   ├── dashboard.feature
│   └── login.feature
│
├── llm_integration/
│
├── node_modules/
│
├── scripts/
│
├── test-results/
│
├── tests/
│   ├── api/
│   ├── dashboard/
│   └── login/
│       ├── forgotPassword.spec.js
│       ├── invalidLogin.spec.js
│       ├── sessionExpiry.spec.js
│       └── validLogin.spec.js
│
├── fixtures.js
├── .env
├── .gitignore
├── ai-usage-log.md
├── package.json
├── package-lock.json
├── playwright.config.js
├── prompts.md
└── README.md
```

---

# 📋 Assignment Coverage

## Login Module

- Valid Login
- Invalid Credentials
- Forgot Password
- Session Expiry
- Logout Validation

---

## Dashboard Module

- Widget Validation
- Navigation
- Filters
- Permission Validation
- Responsive Behaviour

---

## REST API Module

- Authentication
- CRUD Operations
- Error Handling
- Schema Validation
- Rate Limiting

---

# 🏗 Framework Features

- Playwright Automation Framework
- JavaScript (Node.js)
- API & UI Automation
- Google Gemini AI Integration
- AI Failure Analysis
- Allure Reporting
- Gherkin Feature Files
- Modular Test Structure
- Prompt Engineering Documentation

---

# 🧠 Design Decisions

- Modular folder structure for better maintainability.
- Separate UI and API test suites.
- Google Gemini integration isolated from test execution logic.
- AI analysis generated only for failed tests.
- AI-generated response attached directly to the Allure Report.
- Gherkin feature files maintained separately.
- Prompt engineering documented for reproducibility.

---

# 🔑 Test Environment

**Application**

https://opensource-demo.orangehrmlive.com

**Credentials**

```
Username : Admin
Password : admin123
```

---

# 🚀 Future Improvements

If additional development time were available, the framework could be enhanced with:

- AI-based Auto Healing Locators
- Visual Regression Testing
- Flaky Test Classification (Option B)
- Smart Test Data Generation
- GitHub Actions CI/CD Integration
- API Contract Testing
- AI-generated Test Data

---

# 🤖 AI Usage

AI was used for:

- Framework Planning
- Prompt Engineering
- Test Case Generation
- Playwright Automation
- Google Gemini Integration
- Allure Report Enhancement
- Documentation
- Debugging

See **ai-usage-log.md** for complete details.

---

# 📄 Submission Contents

✔ Playwright Automation Framework

✔ Login Automation

✔ Dashboard Automation

✔ API Automation

✔ Gherkin Feature Files

✔ Google Gemini LLM Integration

✔ AI Failure Analysis

✔ Allure Report Integration

✔ Prompt Engineering Documentation

✔ AI Usage Log

✔ README

---

## Submitted By

**Jivesh**

**TestMu AI – SDET-1 Assessment**