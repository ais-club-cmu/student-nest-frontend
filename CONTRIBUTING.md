# Contributing to StudentNest Frontend

First off, thank you for considering contributing to StudentNest! We welcome contributions from everyone and are excited to build this platform together.

The following is a set of guidelines for contributing to the StudentNest frontend repository.

## Contribution Workflow

To ensure a smooth collaboration process and maintain a high-quality codebase, please follow these steps when contributing:

### 1. Find or Create an Issue
Before writing any code or submitting a pull request, please ensure there is an issue tracking the work.
- **Find an existing issue**: Go to the Issues tab and find an open issue you'd like to work on. Comment on it to let others know you're claiming it so we avoid duplicate work.
- **Create a new issue**: If your bug or feature isn't already listed, please create a new issue detailing the problem, context, and a proposed solution. Wait for a maintainer to approve the issue or assign it to you before starting work.

### 2. Create a Branch
- Clone the project to your local machine (if you haven't already).
- Pull the latest changes from the `main` branch to ensure you are up to date.
- Create a new branch specifically for your issue directly in this repository. We recommend using a descriptive naming convention that includes the issue number:
  - `feat/issue-12-add-landlord-dashboard`
  - `fix/issue-34-header-responsiveness`
  - `docs/issue-56-update-readme`

### 3. Develop Your Changes
- Implement your changes locally.
- **Responsiveness**: StudentNest is a modern web application. You must ensure your UI remains fully responsive across all device sizes (mobile, tablet, and desktop). Test your changes thoroughly by resizing your browser.
- **Code Style**: Follow the project's existing Next.js 14 App Router and Tailwind CSS conventions. Reuse existing components (like Buttons or Inputs) whenever possible.

### 4. Create a Pull Request (PR)
Once your changes are ready, commit them, push your branch to the origin repository, and open a Pull Request against the `main` branch.

#### Creating an Excellent PR
Your PR description **MUST** include the following elements to be considered for review:

1. **Issue Reference**: Link the PR to the original issue it solves (e.g., `Closes #12`).
2. **Context**: A brief summary of what you did and why you structured your code that way.
3. **Visual Proof (Demo or Pictures)**: *Mandatory for any UI changes.* You must include screenshots, a screen recording, or a GIF demonstrating your changes in action.
4. **Responsiveness Proof**: Include screenshots showing how your changes look on both a Mobile viewport and a Desktop viewport to prove it scales properly.

### 5. Review Process
- A maintainer will review your Pull Request. 
- They may request changes or ask questions about your implementation.
- Once approved, a maintainer will merge your PR into the main branch.

---

## Local Development Setup

To get your local environment set up:

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

Thank you for contributing!
