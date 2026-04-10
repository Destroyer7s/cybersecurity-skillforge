# CyberSkillForge

CyberSkillForge is an interactive cybersecurity learning and simulation platform built as a static web application. It combines structured study content, hands-on labs, and advanced terminal-style simulators into a portfolio-ready training experience.

## Recruiter Snapshot

CyberSkillForge is designed to demonstrate practical security engineering capability, not just coursework completion.

- Role alignment: SOC analyst, detection engineer, cloud security engineer, security automation engineer
- Evidence style: hands-on labs, staged simulations, measurable progress signals, reproducible workflows
- Technical depth: web app security, endpoint security, cloud operations, SIEM-driven triage, threat modeling
- Delivery model: static architecture with fast deployment and no backend dependencies
- Portfolio value: interview-ready artifacts, scenario-driven reasoning, and operationally grounded training

Quick links:

- Live site: https://destroyer7s.github.io/cybersecurity-skillforge/
- Main study index: studies.html
- Labs catalog: labs.html
- Simulator hub: simulator.html

## Live Site

Primary live page:

- https://destroyer7s.github.io/cybersecurity-skillforge/

If you fork this repo and deploy via GitHub Pages, your URL will be:

- https://<your-username>.github.io/cybersecurity-skillforge/

## Core Capabilities

- Production-style front-end experience with responsive design and strong visual hierarchy
- Deep study track across major cybersecurity domains
- 50+ practical labs with clear objectives, success criteria, and advanced challenges
- High-interaction simulator suite:
  - General cybersecurity simulator
  - Palo Alto simulator
  - AWS simulator
  - Web Security Deep Simulator
- Large command-space simulation logic (including synthetic command roots)
- Persistent learner progress and scoring via browser localStorage

## Simulator Suite

### 1) General Simulator

File entry:

- simulator.html

Purpose:

- Broad command and scenario simulation across topics
- High command variation and parser breadth
- Skill progression and scoring loops

### 2) Palo Alto Simulator

File entry:

- paloalto-simulator.html

Purpose:

- Platform-oriented workflows and staged security operations drills
- Scenario progression with command validation and guided hints

### 3) AWS Simulator

File entry:

- aws-simulator.html

Purpose:

- Cloud security simulation with realistic operational workflows
- Stage-based investigations and mitigation flow

### 4) Web Security Deep Simulator

File entry:

- web-simulator.html

Purpose:

- 12 scenario campaign with multi-stage objectives
- Attack-chain visualization, activity timeline, achievements, and report export
- Keyboard shortcuts, command suggestions, and after-action reporting

## Learning Content

### Study Track

File entry:

- studies.html

Coverage includes:

- Endpoint Security
- Network Security
- Penetration Testing
- Security Architecture Design
- Security Automation
- Security Information and Data Engineering
- SIEM and Detection Engineering
- Security Operations and Incident Response
- Threat Modeling and Risk Analysis
- Vulnerability Management

### Labs Track

File entry:

- labs.html

Coverage includes:

- 50+ labs distributed across all major skill areas
- Time estimates, execution steps, success criteria, advanced challenges

## Project Structure

- index.html: Landing page and primary navigation hub
- studies.html: Long-form curriculum and deep-dive references
- labs.html: Hands-on lab catalog and practical exercises
- simulator.html: General simulator hub and command simulation experience
- paloalto-simulator.html: Palo Alto focused simulator UI
- paloalto-simulator.js: Palo Alto simulator engine
- aws-simulator.html: AWS focused simulator UI
- aws-simulator.js: AWS simulator engine
- web-simulator.html: Web security simulator UI
- web-simulator.js: Web security simulator engine
- script.js: Shared site interactions and study/lab behavior
- styles.css: Visual design system and responsive styling

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Browser localStorage for persistent client-side state
- Static hosting via GitHub Pages

## Local Development

Run from the project root with any static file server.

Example using Python:

```bash
python3 -m http.server 8080
```

Open:

- http://localhost:8080

## Deployment (GitHub Pages)

1. Push repository to GitHub.
2. Open repository Settings -> Pages.
3. Under Build and deployment:
   - Source: Deploy from a branch
   - Branch: main (root)
4. Save and wait for deployment completion.
5. Access your live URL.

## Data and Persistence

- The app is fully client-side.
- Progress, scores, and simulator state are stored in browser localStorage.
- No backend services are required for normal usage.

## Recommended Browser Support

- Chrome (latest)
- Edge (latest)
- Firefox (latest)
- Safari (latest)

## Browser Compatibility Diagnostics

The project includes a built-in diagnostics overlay for cross-browser QA.

Open with query parameters:

- `?diag=1` or `?compat=1`: opens compatibility panel
- `?diag=1&autotest=1`: opens panel and runs browser sanity checks automatically

Example URLs:

- `http://localhost:8080/?diag=1`
- `http://localhost:8080/?diag=1&autotest=1`

Diagnostics panel reports:

- Detected platform and touch status
- Theme runtime mode and active theme
- Feature support (`matchMedia`, `localStorage`, `color-mix`, `100dvh`, `backdrop-filter`)
- Browser sanity check pass/fail summary

## Cross-Browser Validation Checklist

Run this matrix before release:

1. Chrome (Windows/macOS): theme switching, simulator navigation, responsive breakpoints.
2. Edge (Windows): verify fallback visuals and diagnostics pass score.
3. Firefox (Windows/macOS): check gradients, overlays, and simulator input behavior.
4. Safari (macOS + iOS): verify backdrop rendering, mobile viewport sizing, and form usability.
5. Android Chrome: orientation changes, toast placement, and simulator scroll behavior.

## Customization Guide

Common edits before sharing publicly:

1. Update contact details and profile links in index.html.
2. Replace placeholder portfolio references with your own project artifacts.
3. Add screenshots or evidence links for completed labs.
4. Tune simulator scenarios and scoring logic for your preferred difficulty.
5. Update branding text and metadata in page headers.

## Suggested Portfolio Workflow

1. Complete a study module in studies.html.
2. Execute matching labs in labs.html.
3. Run related simulator scenarios to demonstrate decision-making.
4. Publish artifacts (reports, scripts, screenshots, metrics) in GitHub repos.
5. Link those artifacts back into this site.

## Contributing Standards

This repository is currently maintained as a portfolio-grade project. If you collaborate, use the standards below to keep quality consistent.

### Branch Naming

Use one of these formats:

- feature/<short-description>
- fix/<short-description>
- docs/<short-description>
- refactor/<short-description>

Examples:

- feature/web-sim-achievements
- fix/aws-sim-stage-validation
- docs/readme-professionalization

### Commit Message Format

Use concise, intention-first commits:

- feat: add after action report drawer for web simulator
- fix: correct stage progression reset on scenario swap
- docs: add recruiter snapshot and live page links
- style: refine simulator panel spacing on mobile

### Pull Request Checklist

Before opening a PR, verify:

1. Feature behavior is validated manually in desktop and mobile layouts.
2. No navigation regressions were introduced across index, studies, labs, and simulator pages.
3. Console is free of runtime errors in edited flows.
4. README or documentation is updated when behavior changes.
5. Screenshots or short notes are added for major UI changes.

## Release and Changelog Workflow

Use lightweight semantic versioning for portfolio releases:

- MAJOR: breaking navigation/content changes or large rewrites
- MINOR: new simulator features, new labs, major UX additions
- PATCH: bug fixes, copy updates, styling corrections

Recommended tags:

- v1.0.0 initial stable portfolio launch
- v1.1.0 simulator feature expansion
- v1.1.1 regression and polish fixes

### Changelog Template

Create or update CHANGELOG.md using this structure:

```md
# Changelog

## [Unreleased]

### Added
-

### Changed
-

### Fixed
-

## [1.1.0] - YYYY-MM-DD

### Added
- Web Security Deep Simulator with scenario timeline and achievements.

### Changed
- Improved simulator hub navigation and cross-links.

### Fixed
- Stage reset edge cases in specialized simulators.
```

If publishing frequently, keep an "Unreleased" section and roll it into a version section at release time.

## Troubleshooting

### Site changes not visible on GitHub Pages

- Confirm commits are pushed to main.
- Check Pages deployment status under repository Actions/Pages.
- Hard refresh browser cache.

### Simulator progress reset unexpectedly

- Verify localStorage is enabled in browser settings.
- Avoid private/incognito mode if persistence is required.

### Navigation or layout issues on mobile

- Confirm responsive CSS from styles.css is loaded.
- Verify no stale cached files are overriding current assets.

## License

Add your preferred license here (for example, MIT) if you intend public reuse.

## Maintainer

- GitHub: https://github.com/Destroyer7s
