# CyberSkillForge

CyberSkillForge is a polished, single-page cybersecurity education and portfolio website designed for GitHub hosting and targeted at Advanced Endpoint Security Engineer roles.

## What this project demonstrates

- Intentional UI/UX design with custom styling, gradients, and animated reveals
- Endpoint-security-focused content architecture for learning and employer evaluation
- Full required-skills matrix with explicit ways to learn and prove each skill area
- Interactive JavaScript components:
  - rotating mission ticker
  - learning pathway filters
  - command lab simulator
  - self-scoring quiz
- Fully static deployment (no backend), ideal for GitHub Pages

## Required skills covered in this site

- Endpoint Security
- Network Security
- Penetration Testing
- Security Architecture Design
- Security Automation
- Security Information
- Security Information and Event Management (SIEM)
- Security Operations
- Threat Modeling
- Vulnerability Management

Each skill area includes:

- A practical learning path (what to study and practice)
- A portfolio proof path (what artifacts and metrics to publish)

## Project structure

- `index.html` - homepage with role alignment, qualifications strategy, deep-dive skills matrix, and CTAs
- `studies.html` - 10+ hours of comprehensive study material covering all 10 required skills
  - Endpoint Security Fundamentals
  - Network Security & Segmentation (zero trust, defense-in-depth)
  - Penetration Testing & Assessment Methodology
  - Security Architecture Design (STRIDE, trust boundaries, ADRs)
  - Security Automation & DevSecOps (CI/CD, IaC, Python automation)
  - Security Information & Data Engineering (log normalization, telemetry quality)
  - SIEM & Detection Engineering (ATT&CK-mapped rules, tuning)
  - Security Operations & Incident Response (IR lifecycle, runbooks)
  - Threat Modeling & Risk Analysis (attack trees, abuse cases)
  - Vulnerability Management & Patch Operations (CVSS, SLA enforcement)
  - Each section includes diagrams (SVG), code examples, and key references
- `labs.html` - 50+ hands-on labs across all 10 skill areas:
  - 5 Endpoint Security labs (hardening, FDE, USB controls, patch automation, EDR)
  - 5 Network Security labs (firewall, segmentation, zero trust VPN, DNS filtering, packet analysis)
  - 5 Penetration Testing labs (scoped assessments, AD exploitation, web app security, phishing, threat simulation)
  - 5 Architecture Design labs (device lifecycle, IAM, zero trust design, threat models, IR architecture)
  - 5 Security Automation labs (endpoint checks, CI/CD pipeline, IaC scanning, threat simulation, drift detection)
  - 5 Data Engineering labs (log normalization, enrichment, quality benchmarking, forensics, dashboards)
  - 5 SIEM labs (detection rules, response automation, alert tuning, hunting, coverage testing)
  - 5 Security Operations labs (incident runbooks, tabletop exercises, evidence collection, post-mortems, metrics)
  - 5 Threat Modeling labs (STRIDE analysis, attack trees, abuse cases, control validation, supply chain risk)
  - 5 Vulnerability Management labs (scanning, CVSS scoring, patch deployment, false positive tuning, compliance)
  - Each lab includes time estimate, step-by-step instructions, success criteria, and advanced challenges
- `styles.css` - visual system, responsive layout, motion, and components
- `script.js` - interaction logic for routing, labs, filters, quiz, and animations

## Run locally

From this folder, start any static server. Example with Python:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080

## Deploy to GitHub Pages

1. Create a new GitHub repository (example: `cyberskillforge-portfolio`).
2. Push this folder to the repository root.
3. In GitHub, open Settings -> Pages.
4. Under Build and deployment, select:
   - Source: Deploy from a branch
   - Branch: `main` (or `master`) and `/ (root)`
5. Save and wait for deployment.
6. Your site will be available at `https://<your-username>.github.io/<repo-name>/`.

## How to use this site

1. **Study Phase** (10+ hours)
   - Review `studies.html` for each required skill area
   - Read references provided
   - Take notes on key concepts
   - Research certifications (AZ-500, SC-300 recommended)

2. **Lab Phase** (50+ hours)
   - Complete labs from `labs.html` in order of difficulty
   - Document your work (screenshots, configs, reports)
   - Push lab evidence to GitHub for portfolio
   - Build real proof artifacts: scripts, tool configs, analysis reports

3. **Portfolio Building**
   - Create GitHub repos for each project
   - Link to your best lab work from portfolio cards
   - Add write-ups and lessons learned
   - Track metrics: MTTR improvements, CVE coverage, automation ROI

4. **Interview Preparation**
   - Be able to explain each skill at STAR format (Situation, Task, Action, Result)
   - Reference your lab work and improvements
   - Show quantified impact (e.g., "reduced MTTR from 30min to 10min")
   - Practice explaining your architecture decisions

## Customization checklist for job applications

- Replace placeholder email in `index.html`
- Add links to your LinkedIn, GitHub profile, resume, and portfolio repos
- Link lab evidence and project repos from portfolio cards
- Add real project screenshots and measurable impact statements
- Keep the site updated as you finish new labs and certifications
- Create a `/blog/` subdirectory with write-ups of major projects
