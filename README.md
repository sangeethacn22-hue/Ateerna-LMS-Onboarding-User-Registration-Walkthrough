# Ateerna-LMS-Onboarding-User-Registration-Walkthrough
# Ateerna LMS - Automated User Onboarding & Registration Walkthrough

Automated browser walkthrough framework built with Playwright and Node.js that records an interactive, beginner-friendly registration tutorial for Ateerna LMS.

## Features
- **Standalone User Simulation:** Automates the complete user registration flow without brittle test assertions, designed for user onboarding.
- **Dynamic Dummy Identities:** Generates timestamped dummy credentials (name, email, phone, password) on each run.
- **On-Screen Visual Banners:** Injects floating instruction badges and placeholder prompt guidance directly into the DOM to guide viewers.
- **Clean Walkthrough Video Output:** Configured with natural action pacing (`slowMo: 300ms`) and automatic file renaming to eliminate random hash titles.

## Tech Stack
- **Engine:** Playwright (`@playwright/test`)
- **Runtime:** Node.js (ES Modules)
- **Target Portal:** https://lms.ateerna.com/login

## Setup & Installation

1. Navigate to the project directory:
   cd ateerna-automation

2. Install dependencies:
   npm install

3. Install Playwright browser binaries:
   npx playwright install chromium

## Running the Walkthrough

Execute the recording script:
node record-ateerna-register.js

The generated video will be saved to:
videos/ateerna_registration/ateerna-registration-tutorial.webm
