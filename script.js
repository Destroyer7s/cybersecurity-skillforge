const tickerItems = [
  "Enforcing secure-by-default endpoint baselines",
  "Reducing standing privilege across managed devices",
  "Automating security controls with CI pipelines",
  "Turning telemetry into measurable risk reduction"
];

const commandResponses = {
  "whoami": "endpoint_engineer",
  "nmap -sv target.local": "Open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)",
  'grep "failed" auth.log': "18 failed login attempts detected from 192.168.1.45",
  'osqueryi "select * from processes limit 5"': "Top processes: launchd, WindowServer, Finder, zsh, osqueryd"
};

let tickerIndex = 0;
const tickerText = document.getElementById("tickerText");

function rotateTicker() {
  if (!tickerText) {
    return;
  }
  tickerText.textContent = tickerItems[tickerIndex];
  tickerIndex = (tickerIndex + 1) % tickerItems.length;
}

if (tickerText) {
  rotateTicker();
  setInterval(rotateTicker, 2600);
}

const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    mainNav.classList.toggle("is-open");
  });
}

const levelFilter = document.getElementById("levelFilter");
const pathwayCards = [...document.querySelectorAll("#pathwayGrid .card")];

if (levelFilter && pathwayCards.length) {
  levelFilter.addEventListener("change", (event) => {
    const value = event.target.value;

    pathwayCards.forEach((card) => {
      const match = value === "all" || card.dataset.level === value;
      card.style.display = match ? "block" : "none";
    });
  });
}

const terminalForm = document.getElementById("terminalForm");
const commandInput = document.getElementById("commandInput");
const terminalOutput = document.getElementById("terminalOutput");

if (terminalForm && commandInput && terminalOutput) {
  terminalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const rawCommand = commandInput.value.trim();
    if (!rawCommand) {
      return;
    }

    const normalized = rawCommand.toLowerCase();
    const result = commandResponses[normalized] || "Command not recognized. Try one of the suggested commands.";

    const promptLine = document.createElement("p");
    promptLine.className = "mono";
    promptLine.textContent = `analyst@skillforge:~$ ${rawCommand}`;

    const resultLine = document.createElement("p");
    resultLine.textContent = result;

    terminalOutput.append(promptLine, resultLine);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    commandInput.value = "";
  });
}

const quizForm = document.getElementById("quizForm");
const quizResult = document.getElementById("quizResult");
const answerKey = { q1: "a", q2: "b", q3: "c" };

if (quizForm && quizResult) {
  quizForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(quizForm);
    let score = 0;

    Object.entries(answerKey).forEach(([question, answer]) => {
      if (formData.get(question) === answer) {
        score += 1;
      }
    });

    const percent = Math.round((score / Object.keys(answerKey).length) * 100);
    const feedback =
      percent === 100
        ? "Perfect score. You are demonstrating strong endpoint security engineering judgment."
        : percent >= 67
          ? "Solid work. Keep improving automation depth and architecture tradeoff decisions."
          : "Good start. Review the skills matrix and retry with evidence-driven thinking.";

    quizResult.textContent = `Score: ${score}/3 (${percent}%). ${feedback}`;
    quizResult.style.color = percent >= 67 ? "#5effb5" : "#ff7a7a";
  });
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  document.body.classList.add("js-motion");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element, index) => {
    const delay = (index % 10) * 50;
    element.style.setProperty("--reveal-delay", `${delay}ms`);
    observer.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
}

const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const studyGuides = {
  "endpoint-security": {
    prerequisites: ["Basic OS administration", "User/privilege model concepts", "Patch management fundamentals"],
    coreConcepts: ["Defense-in-depth layering", "Hardening baselines and drift", "Endpoint telemetry quality"],
    practiceDrills: [
      "Apply CIS Level 1 baseline to 5 test endpoints and capture before/after drift evidence.",
      "Simulate suspicious PowerShell execution and collect process-tree + command-line artifacts from EDR.",
      "Run a 48-hour compliance check and produce a remediation backlog with owner and SLA."
    ],
    selfCheck: ["Can you explain why each endpoint control exists?", "Can you identify which control failed in a sample incident?"]
  },
  "network-security": {
    prerequisites: ["TCP/IP and routing basics", "Firewall rule evaluation", "Identity-aware access basics"],
    coreConcepts: ["Zero trust verification", "Microsegmentation strategy", "Egress control and monitoring"],
    practiceDrills: [
      "Build a zone-to-zone allow matrix for corp, DMZ, prod, and management segments.",
      "Validate deny-by-default policy using 10 approved and 10 unapproved traffic tests.",
      "Investigate a DNS tunneling scenario and write an egress containment recommendation."
    ],
    selfCheck: ["Can you justify every allow rule with business need?", "Can you explain east-west containment strategy?"]
  },
  "penetration-testing": {
    prerequisites: ["Legal scope and ethics", "Vulnerability fundamentals", "Basic scripting/CLI fluency"],
    coreConcepts: ["Assessment methodology", "Exploitability vs business impact", "Remediation verification"],
    practiceDrills: [
      "Execute a scoped web assessment from recon to validated exploit path in a lab target.",
      "Produce a finding report with CVSS vector, business impact, and reproduction steps.",
      "Retest remediated target and document proof that original attack path is closed."
    ],
    selfCheck: ["Can you separate risk signal from scanner noise?", "Can you tie technical exploit to business consequence?"]
  },
  "architecture-design": {
    prerequisites: ["System design basics", "Identity/access control models", "Threat modeling basics"],
    coreConcepts: ["Trust boundaries", "Architecture decision records", "Security-reliability tradeoffs"],
    practiceDrills: [
      "Design a secure reference architecture for a public API + internal data service.",
      "Write one ADR comparing two authentication patterns with measurable tradeoffs.",
      "Map top 10 threats (STRIDE) to controls, owners, and validation tests."
    ],
    selfCheck: ["Can you explain why this design is secure and operable?", "Can you defend tradeoffs under constraints?"]
  },
  "security-automation": {
    prerequisites: ["Scripting foundations", "CI/CD workflow concepts", "Basic API usage"],
    coreConcepts: ["Idempotent automation", "Policy-as-code", "Safe rollback and auditability"],
    practiceDrills: [
      "Automate phishing enrichment (hash/IP/domain intel checks) with explicit failure handling.",
      "Add unit tests and a dry-run mode before enabling production actions.",
      "Measure triage cycle-time change over one week and report false-action rate."
    ],
    selfCheck: ["Can your automation run safely multiple times?", "Can you prove change traceability?"]
  },
  "security-information": {
    prerequisites: ["Log formats", "JSON/CSV parsing", "Data quality basics"],
    coreConcepts: ["Normalization and schema", "Enrichment confidence", "Signal-to-noise management"],
    practiceDrills: [
      "Normalize Windows, firewall, and cloud logs into one schema with required field checks.",
      "Add CMDB and threat-intel enrichment and track confidence/lineage per field.",
      "Benchmark detection query latency before and after normalization improvements."
    ],
    selfCheck: ["Can you trust the data powering detections?", "Can you trace data lineage for key fields?"]
  },
  siem: {
    prerequisites: ["Query language basics", "Alert triage fundamentals", "MITRE ATT&CK familiarity"],
    coreConcepts: ["Hypothesis-driven detection", "Precision vs recall", "Tuning lifecycle"],
    practiceDrills: [
      "Author a T1059.001 detection in your SIEM and map required telemetry fields.",
      "Replay attack and benign datasets to measure precision and missed detections.",
      "Tune with documented suppression rationale, owner, and expiry date."
    ],
    selfCheck: ["Can you explain why this alert matters?", "Can you reduce false positives without losing coverage?"]
  },
  "security-operations": {
    prerequisites: ["Incident severity model", "Escalation protocols", "Documentation discipline"],
    coreConcepts: ["IR lifecycle execution", "Coordination under pressure", "Post-incident learning loops"],
    practiceDrills: [
      "Run a 60-minute ransomware tabletop with SOC, IT ops, legal, and communications roles.",
      "Produce a timestamped incident timeline with owner/action/evidence fields.",
      "Write a blameless post-incident report with 3 corrective actions and due dates."
    ],
    selfCheck: ["Can you lead triage with clear ownership?", "Can you communicate impact to non-technical stakeholders?"]
  },
  "threat-modeling": {
    prerequisites: ["System decomposition", "Attack surface basics", "Risk ranking models"],
    coreConcepts: ["STRIDE and abuse cases", "Control mapping", "Residual risk tracking"],
    practiceDrills: [
      "Create a threat model for an API auth flow with STRIDE and misuse cases.",
      "Prioritize risks using likelihood x impact with owner assignment per risk.",
      "Define and run validation tests for top three control assumptions."
    ],
    selfCheck: ["Can you identify attacker goals and paths?", "Can you map each risk to a control and owner?"]
  },
  "vulnerability-management": {
    prerequisites: ["CVSS basics", "Patch deployment flow", "Asset criticality mapping"],
    coreConcepts: ["Risk-based prioritization", "SLA governance", "Verification and recurrence reduction"],
    practiceDrills: [
      "Prioritize a mixed backlog using CVSS + KEV + internet exposure + asset criticality.",
      "Run pilot -> wave -> full patch rollout with rollback criteria documented.",
      "Track MTTR and recurrence rate for 30 days post-remediation."
    ],
    selfCheck: ["Can you justify why a vuln is truly urgent?", "Can you prove remediation quality over time?"]
  },
  "soc-ops-analyst-track": {
    prerequisites: ["SOC workflow fundamentals", "SIEM/EDR familiarity", "Audit/compliance context"],
    coreConcepts: ["Operational triage system", "On-call incident discipline", "IAM and audit evidence readiness"],
    practiceDrills: [
      "Run a mock 4-hour shift with overlapping phishing, IAM, and vulnerability escalations.",
      "Draft executive and technical incident updates with different depth and audience tone.",
      "Assemble an audit packet: ticket evidence, control mapping, and sign-off trail."
    ],
    selfCheck: ["Can you operate effectively under changing priorities?", "Can you connect technical events to business risk quickly?"]
  },
  "capstone-track": {
    prerequisites: ["Comfort across multiple security domains", "Project scoping and planning", "Basic metrics definition"],
    coreConcepts: ["Integrated security delivery", "Evidence-based storytelling", "Outcome measurement"],
    practiceDrills: [
      "Build one end-to-end project combining detection, response, and governance controls.",
      "Capture baseline, intervention, and post-change metrics with reproducible evidence.",
      "Publish a case-study narrative with tradeoffs, failures, and final outcomes."
    ],
    selfCheck: ["Can you explain your decisions and tradeoffs clearly?", "Can you prove impact with measurable outcomes?"]
  }
};

const studySectionExplainers = {
  "endpoint-security": {
    what: "Endpoint security is about controlling what can run, what can change, and what can access sensitive resources on laptops, servers, and managed devices. In real environments, most incidents eventually touch an endpoint through stolen credentials, malware execution, or weak local privilege controls.",
    why: "This section matters because endpoint gaps are where prevention, detection, and response all meet. If your baseline is weak, attackers move faster than your SOC can triage. If your telemetry is weak, you miss key evidence needed to contain incidents quickly.",
    how: ["Start with a baseline: patching, disk encryption, EDR, firewall, logging, and local privilege policies.", "Validate each control with a test case instead of assuming policy equals protection.", "Track drift over time so you can prove control health, not just one-time setup."],
    success: "You know this section is working when you can explain which endpoint control blocks which attacker behavior, produce before/after compliance data, and quickly diagnose why a device failed policy."
  },
  "network-security": {
    what: "Network security defines how traffic is allowed, inspected, and segmented across users, services, and environments. The goal is to make unauthorized movement expensive and visible while preserving legitimate business flows.",
    why: "Strong network controls reduce blast radius. Even when one account or host is compromised, segmentation and policy guardrails keep the incident contained instead of becoming an enterprise-wide failure.",
    how: ["Map trust boundaries and required communication paths before writing rules.", "Use deny-by-default and introduce exceptions with owner, reason, and expiry.", "Validate east-west and north-south traffic with logs or flow telemetry after each policy change."],
    success: "You are successful when every allow rule has a clear business owner, high-risk paths are segmented, and you can trace suspicious egress activity from source to containment decision."
  },
  "penetration-testing": {
    what: "Penetration testing is a controlled security assessment that validates whether your preventive and detective controls hold up against realistic attacker behavior. It is not just scanning; it is evidence-driven control verification.",
    why: "This section matters because it closes the gap between theoretical security posture and real exploitability. It helps teams prioritize fixes based on actual attack paths and business impact rather than generic vulnerability lists.",
    how: ["Define legal scope, test boundaries, and business-critical assets first.", "Document exploit path, prerequisite weaknesses, and impact chain for each finding.", "Retest remediated issues to verify the original attack path is no longer feasible."],
    success: "You are doing this well when findings clearly connect technical weakness to business risk, remediation is practical, and retesting proves measurable risk reduction."
  },
  "architecture-design": {
    what: "Security architecture design is the process of embedding controls into system structure so security is part of how the platform works, not an afterthought. It includes trust boundaries, identity patterns, data handling, and recovery design.",
    why: "Architectural decisions create long-term security outcomes. A poor design choice can generate years of security debt; a strong design reduces repetitive incidents and operational friction.",
    how: ["Identify critical assets, data flows, and trust boundaries early in design.", "Use decision records to capture tradeoffs, assumptions, and alternatives considered.", "Validate architecture with threat modeling and operational failure scenarios."],
    success: "You know this section clicked when you can justify control placement, explain tradeoffs under constraints, and show how your design supports both resilience and day-to-day operations."
  },
  "security-automation": {
    what: "Security automation turns repetitive security work into reliable workflows. This includes policy checks, data enrichment, alert triage actions, and remediation support tasks executed through scripts and pipelines.",
    why: "Automation matters because manual-only security operations do not scale. Reliable automation improves speed, consistency, and auditability, especially during high-alert periods.",
    how: ["Build idempotent workflows so reruns do not create drift or break systems.", "Add validation tests and rollback logic for privileged changes.", "Log all actions and decisions so outcomes are traceable during incident reviews and audits."],
    success: "You are successful when automation reduces cycle time without increasing risk, produces consistent outputs, and has clear ownership and rollback paths."
  },
  "security-information": {
    what: "Security information engineering focuses on log quality, normalization, enrichment, and schema consistency so detections and investigations are based on trustworthy data.",
    why: "Bad data causes false confidence. Even good detection logic fails when required fields are missing, timestamps are wrong, or enrichment is inconsistent. This section teaches how to build dependable telemetry foundations.",
    how: ["Define required fields and schema standards before onboarding new data sources.", "Normalize and enrich events with clear confidence and lineage tracking.", "Measure data quality continuously: completeness, consistency, and timeliness."],
    success: "You know this is working when analysts trust the data, detections are stable across sources, and you can quickly explain where every key field came from."
  },
  siem: {
    what: "SIEM practice combines detection design, alert triage, and tuning operations. It is the core loop for turning raw telemetry into high-confidence, actionable security signals.",
    why: "This section matters because unmanaged SIEM programs drown teams in noise. Good SIEM engineering improves analyst focus, reduces false positives, and accelerates response quality.",
    how: ["Start with a detection hypothesis tied to specific attacker behavior and required telemetry.", "Validate against both simulated attack events and known benign activity.", "Tune with governance: owner, rationale, and expiry for suppressions or exceptions."],
    success: "You are effective here when detection precision improves over time, alert queue health is stable, and your SOC can explain why each high-severity alert is truly important."
  },
  "security-operations": {
    what: "Security operations is coordinated incident handling: triage, scoping, containment, eradication, recovery, and lessons learned. It is as much communication and ownership discipline as technical execution.",
    why: "This section matters because incident quality is determined by execution under pressure. Clear processes, roles, and evidence habits prevent chaos and reduce damage when time matters most.",
    how: ["Use severity-based playbooks and communication cadence from the first signal.", "Maintain a timestamped action timeline with explicit owners and decision rationale.", "Close incidents with tracked improvement actions, not just closure statements."],
    success: "You are operating at a strong level when handoffs are clean, leadership gets clear risk updates, and post-incident actions measurably reduce repeat failures."
  },
  "threat-modeling": {
    what: "Threat modeling identifies how systems can be attacked, which paths are most likely or impactful, and which controls should be prioritized. It turns abstract security concerns into concrete design and engineering decisions.",
    why: "This section matters because it prevents building controls blindly. Threat modeling helps teams spend effort where risk is highest and justify decisions with context, not fear.",
    how: ["Define assets, entry points, trust boundaries, and attacker goals first.", "Use structured methods (like STRIDE/abuse cases) to enumerate realistic threats.", "Map each priority threat to a control, owner, and verification method."],
    success: "You know this section is internalized when you can explain residual risk clearly, defend priorities, and show how threat insights changed architecture or operations."
  },
  "vulnerability-management": {
    what: "Vulnerability management is the full lifecycle from discovery to remediation verification. It is a risk management discipline, not just scanner output review.",
    why: "This section matters because organizations often patch by volume instead of risk. Effective vulnerability management prioritizes what is exploitable and business-critical first, then verifies closure quality.",
    how: ["Prioritize using exploitability, exposure, asset criticality, and business context.", "Assign owners and SLA targets with clear escalation paths.", "Retest and track recurrence so fixes become durable process improvements."],
    success: "You are doing this well when urgent issues are fixed quickly, false positives are handled with evidence, and MTTR trends improve without overwhelming teams."
  },
  "soc-ops-analyst-track": {
    what: "This track focuses on day-to-day SOC execution: alert triage, incident communications, evidence collection, IAM governance, and audit readiness under shifting priorities.",
    why: "It matters because strong SOC operations depend on consistent, high-quality decisions during real operational pressure. You need both technical depth and disciplined process execution.",
    how: ["Practice shift workflows from first alert to closure with clear handoffs.", "Translate technical findings into business risk language for stakeholders.", "Build evidence artifacts as you work so audits and postmortems are always ready."],
    success: "You are ready when you can run a shift confidently, prioritize by risk under load, and produce clean artifacts that stand up to leadership and compliance review."
  },
  "capstone-track": {
    what: "The capstone track is where you integrate multiple skills into one end-to-end security project. It should reflect real role expectations: design, implementation, validation, and measurable impact.",
    why: "This section matters because applied capability builds genuine operational depth. A strong capstone proves you can execute across domains and communicate outcomes clearly.",
    how: ["Choose one meaningful security problem with clear baseline metrics.", "Implement controls and workflow improvements with evidence at each stage.", "Publish a concise case study covering decisions, tradeoffs, results, and next improvements."],
    success: "You have succeeded when you can present your project as a business-relevant security story with measurable before/after outcomes and defensible technical choices."
  }
};

const studyPlainEnglishMap = {
  "endpoint-security": [
    "Think of this as locking and monitoring every laptop/server door so attackers cannot move freely.",
    "You are learning how to stop common endpoint mistakes before they become incidents.",
    "If you can show baseline health and drift trends, you are doing this right."
  ],
  "network-security": [
    "This is about deciding who can talk to what, and proving why.",
    "Good segmentation means one compromise does not become a full-environment breach.",
    "You should be able to trace suspicious traffic and explain your policy decisions."
  ],
  "penetration-testing": [
    "This section teaches how to safely test if defenses really work in practice.",
    "The goal is not to look clever; the goal is to create fixable, high-value findings.",
    "Success means your reports lead to real risk reduction, verified by retesting."
  ],
  "architecture-design": [
    "This is where you design systems so security is built-in, not bolted-on later.",
    "You are deciding where controls belong and why those tradeoffs make sense.",
    "If you can defend your design under constraints, you understand this section."
  ],
  "security-automation": [
    "Automation here means turning repetitive security work into safe, repeatable workflows.",
    "You are learning how to move faster without creating hidden risk.",
    "If reruns are safe and everything is auditable, your automation is mature."
  ],
  "security-information": [
    "This section is about making sure your data is trustworthy before detections rely on it.",
    "Bad logs create bad alerts, so data quality is a core security skill.",
    "If analysts trust fields and lineage, you built this correctly."
  ],
  siem: [
    "SIEM is the engine that turns logs into actionable alerts.",
    "You are learning to reduce noise and keep only high-value detections.",
    "If your queue is healthier and alerts are explainable, you are improving."
  ],
  "security-operations": [
    "This is practical incident handling under pressure, not theory.",
    "You are training clear ownership, communication, and evidence habits.",
    "If your team can triage fast and communicate clearly, this section is working."
  ],
  "threat-modeling": [
    "Think of this as predicting how a system could be attacked before it happens.",
    "You are learning to focus effort on the highest-risk paths first.",
    "If each major threat maps to a control owner and test, you are on track."
  ],
  "vulnerability-management": [
    "This is prioritizing and fixing the right vulnerabilities, not all of them equally.",
    "You are learning to combine technical severity with business impact.",
    "If urgent exploitable issues close quickly and stay closed, you are succeeding."
  ],
  "soc-ops-analyst-track": [
    "This track is day-to-day SOC execution: triage, communication, and evidence.",
    "You are learning to make strong decisions with limited time and noisy signals.",
    "If you can run a shift and produce audit-ready artifacts, you have strong operational foundations."
  ],
  "capstone-track": [
    "This is your proof project showing you can apply multiple skills together.",
    "You are learning to tell a clear security story with measurable outcomes.",
    "If your project explains problem, tradeoffs, and impact, it demonstrates real technical depth."
  ]
};

const extendedStudyModules = {
  "aws-security-hub-and-detection": {
    navLabel: "AWS Security Hub",
    title: "AWS Security Hub, GuardDuty, and Cloud Detection Operations",
    readingTime: "90 minutes",
    overview:
      "This section builds deep AWS operational knowledge for SOC and security engineering roles. You will connect Security Hub findings, GuardDuty threat detections, CloudTrail events, IAM context, and remediation workflows so cloud incidents are triaged and closed with evidence.",
    architecture:
      "Focus on an event pipeline: CloudTrail/Config/GuardDuty -> Security Hub normalized findings -> SIEM correlation -> Jira case -> validated remediation and closure evidence. Treat each finding as a risk workflow, not a dashboard card.",
    handsOn: [
      "Enable AWS Security Hub standards (Foundational + CIS) and baseline control health.",
      "Create triage runbook for Severity/Critical findings including IAM and network context checks.",
      "Map Security Hub finding types to response playbooks and escalation rules.",
      "Build evidence template for incident records: finding ID, affected resource, blast radius, owner, remediation timestamp."
    ],
    tools: ["AWS Security Hub", "GuardDuty", "CloudTrail", "AWS Config", "CloudWatch", "Jira", "Confluence"],
    outcomes: [
      "Prioritize cloud findings by exploitable risk and business impact.",
      "Correlate finding + telemetry + identity activity quickly.",
      "Demonstrate audit-ready closure evidence for cloud controls."
    ],
    guide: {
      prerequisites: ["IAM policy basics", "CloudTrail event structure", "VPC and Security Group fundamentals"],
      coreConcepts: ["Security Hub findings lifecycle", "Cloud misconfiguration vs active threat signal", "Risk-based finding triage"],
      practiceDrills: ["Investigate one high-severity finding end-to-end", "Create mapping from finding type to response action", "Build closure checklist for cloud incidents"],
      selfCheck: ["Can you explain why this finding is urgent in business terms?", "Can you show proof that remediation was effective?"]
    },
    explainer: {
      what: "AWS Security Hub is your consolidated cloud security control and finding layer. It normalizes signals from multiple AWS services and standards so teams can triage consistently.",
      why: "Without a disciplined Security Hub workflow, teams drown in findings and miss the truly dangerous ones. This section teaches how to prioritize and close cloud risk effectively.",
      how: ["Baseline controls and account coverage first.", "Triage by severity + exposure + asset criticality.", "Document remediation evidence and re-validate controls."],
      success: "You succeed when high-risk findings are handled quickly with clear ownership, measurable MTTR, and defensible closure evidence."
    },
    plainEnglish: [
      "Security Hub is the cloud security inbox; learn what to act on first.",
      "Connect alerts to real risk, not just severity labels.",
      "Close tickets with proof, not assumptions."
    ],
    deepContent: `
<div class="deep-content">
  <h3>AWS Finding Format (ASFF): The Common Data Model</h3>
  <p>Security Hub normalizes all findings into the AWS Security Finding Format (ASFF). Every GuardDuty, Config, Inspector, Macie, and third-party finding is translated into this schema. Understanding ASFF fields is critical for building automation and consistent triage workflows.</p>
  <h4>Key ASFF Fields</h4>
  <table class="deep-table">
    <thead><tr><th>Field</th><th>Description</th><th>Operational Use</th></tr></thead>
    <tbody>
      <tr><td>Severity.Label</td><td>CRITICAL / HIGH / MEDIUM / LOW / INFORMATIONAL</td><td>Primary triage filter — start with CRITICAL and HIGH</td></tr>
      <tr><td>Severity.Normalized</td><td>0–100 numeric score</td><td>Useful for sorting and SLA thresholds in automation</td></tr>
      <tr><td>WorkflowStatus</td><td>NEW / NOTIFIED / RESOLVED / SUPPRESSED</td><td>Track investigation lifecycle; RESOLVED requires closure evidence</td></tr>
      <tr><td>RecordState</td><td>ACTIVE / ARCHIVED</td><td>ARCHIVED = resource no longer violates the condition</td></tr>
      <tr><td>Resources</td><td>Array of affected AWS resources (Type, Id, Region)</td><td>Identify affected account, region, and resource type for scoping</td></tr>
      <tr><td>Types</td><td>Namespace/Category/Classifier taxonomy</td><td>Distinguishes misconfiguration from active threat finding</td></tr>
      <tr><td>CreatedAt / UpdatedAt / FirstObservedAt</td><td>ISO 8601 timestamps</td><td>Calculate MTTD (mean time to detect) and SLA age</td></tr>
      <tr><td>AwsAccountId</td><td>AWS account ID of the affected resource</td><td>Essential for multi-account environments</td></tr>
      <tr><td>ProductArn</td><td>ARN of the originating product (GuardDuty, Inspector, etc.)</td><td>Know the source to understand finding quality and type</td></tr>
    </tbody>
  </table>

  <h3>Security Standards in Detail</h3>
  <p>Security Hub aggregates continuous compliance checks against multiple standards. Each control maps to an AWS service configuration check.</p>
  <h4>AWS Foundational Security Best Practices (FSBP)</h4>
  <p>FSBP is Palo Alto's recommended baseline. It covers ~400 controls across services including IAM, EC2, S3, RDS, Lambda, KMS, CloudTrail, and more. Controls that fail produce Security Hub findings automatically. Key controls to baseline on day one:</p>
  <ul>
    <li>IAM.1 — MFA for root account</li>
    <li>IAM.3 — Access keys rotated within 90 days</li>
    <li>S3.2 — S3 buckets should prohibit public read access</li>
    <li>CloudTrail.2 — CloudTrail should have encryption at rest enabled</li>
    <li>GuardDuty.1 — GuardDuty should be enabled</li>
    <li>Config.1 — AWS Config should be enabled</li>
    <li>EC2.6 — VPC flow logging should be enabled for all VPCs</li>
  </ul>
  <h4>CIS AWS Foundations Benchmark v1.4</h4>
  <p>58 recommendations across IAM, logging, monitoring, and networking. Notable CIS controls:</p>
  <ul>
    <li>1.1 — Maintain current contact configuration for root account</li>
    <li>1.4 — Ensure no root account access key exists</li>
    <li>3.1 through 3.14 — CloudTrail enabled, multi-region, log file validation, integration with CloudWatch Logs</li>
    <li>4.1 through 4.16 — CloudWatch metric filters and alarms for unauthorized API calls, root login, IAM policy changes, CloudTrail config changes, S3 bucket policy changes, etc.</li>
  </ul>
  <h4>PCI DSS v3.2.1 and NIST SP 800-53</h4>
  <p>PCI DSS focuses on cardholder data environment controls. NIST 800-53 provides the broadest control coverage for federal-aligned or enterprise environments. Both can be enabled simultaneously with FSBP.</p>

  <h3>GuardDuty Threat Categories and Finding Codes</h3>
  <p>GuardDuty uses ML and threat intelligence to detect active threats. Findings are organized by threat category and resource type. Understanding the finding codes helps you triage faster and correlate with log evidence.</p>
  <h4>Reconnaissance Findings</h4>
  <ul>
    <li><strong>Recon:EC2/Portscan</strong> — EC2 instance scanning ports on another host; check if instance was compromised or misused</li>
    <li><strong>Recon:EC2/PortProbeUnprotectedPort</strong> — External source probing open port; validate whether the open port is intentional</li>
    <li><strong>Recon:IAMUser/MaliciousIPCaller</strong> — IAM API calls originating from known malicious IP</li>
  </ul>
  <h4>Instance Compromise</h4>
  <ul>
    <li><strong>UnauthorizedAccess:EC2/SSHBruteForce</strong> — SSH brute force attempts to an EC2 instance; check VPC Flow Logs for volume and source</li>
    <li><strong>CryptoCurrency:EC2/BitcoinTool.B!DNS</strong> — Instance resolving known cryptomining domains; isolate and investigate process tree</li>
    <li><strong>Backdoor:EC2/C&amp;CActivity.B!DNS</strong> — Instance communicating with known C2 infrastructure via DNS; immediate isolation required</li>
    <li><strong>Trojan:EC2/DNSDataExfiltration</strong> — DNS tunneling patterns detected; indicates data exfiltration or C2 beaconing</li>
  </ul>
  <h4>Account Compromise</h4>
  <ul>
    <li><strong>UnauthorizedAccess:IAMUser/ConsoleLoginSuccess.B</strong> — Console login from unusual geography or TOR exit node</li>
    <li><strong>Stealth:IAMUser/CloudTrailLoggingDisabled</strong> — CloudTrail was disabled; assume active attacker covering tracks</li>
    <li><strong>PrivilegeEscalation:IAMUser/AdministrativePermissions</strong> — User attached AdministratorAccess or created new admin role to themselves</li>
    <li><strong>PersistenceIAMUser/UserPermissions</strong> — Attacker creating new IAM user, access keys, or role for persistence</li>
  </ul>
  <h4>S3 Threat Findings</h4>
  <ul>
    <li><strong>Policy:S3/BucketBlockPublicAccessDisabled</strong> — Block Public Access removed from a bucket; correlate with CloudTrail for who and when</li>
    <li><strong>Exfiltration:S3/MaliciousIPCaller</strong> — GetObject calls from known malicious IP to your bucket</li>
    <li><strong>UnauthorizedAccess:S3/TorIPCaller</strong> — S3 API calls originating from TOR exit nodes</li>
  </ul>

  <h3>CloudTrail Investigation Queries in Athena</h3>
  <p>Security Hub findings often require correlating with raw CloudTrail events. Athena on top of an S3-backed CloudTrail log archive enables powerful ad-hoc investigation.</p>
  <pre><code>-- Detect AssumeRole calls to look for lateral movement
SELECT eventTime, sourceIPAddress, userAgent,
       json_extract_scalar(requestParameters, '$.roleArn') AS assumed_role,
       errorCode
FROM cloudtrail_logs
WHERE eventName = 'AssumeRole'
  AND eventTime > '2024-01-01T00:00:00Z'
ORDER BY eventTime DESC LIMIT 100;

-- Find S3 GetObject calls from external IPs (potential exfiltration)
SELECT eventTime, sourceIPAddress, userIdentity.arn,
       json_extract_scalar(requestParameters, '$.bucketName') AS bucket,
       json_extract_scalar(requestParameters, '$.key') AS object_key
FROM cloudtrail_logs
WHERE eventName = 'GetObject'
  AND NOT starts_with(sourceIPAddress, '10.')
  AND NOT starts_with(sourceIPAddress, '172.')
ORDER BY eventTime DESC LIMIT 200;

-- Find root account usage
SELECT eventTime, sourceIPAddress, userAgent, eventName, errorCode
FROM cloudtrail_logs
WHERE userIdentity.type = 'Root'
ORDER BY eventTime DESC LIMIT 50;

-- Find CloudTrail disable/stop events
SELECT eventTime, sourceIPAddress, userIdentity.arn, eventName
FROM cloudtrail_logs
WHERE eventName IN ('StopLogging', 'DeleteTrail', 'UpdateTrail', 'PutEventSelectors')
ORDER BY eventTime DESC;</code></pre>

  <h3>AWS Config: Continuous Compliance Rules</h3>
  <p>AWS Config evaluates resource configurations against managed or custom rules continuously. Findings flow into Security Hub as FAILED evaluations.</p>
  <h4>High-Value Managed Config Rules</h4>
  <table class="deep-table">
    <thead><tr><th>Rule Name</th><th>What It Checks</th></tr></thead>
    <tbody>
      <tr><td>access-keys-rotated</td><td>IAM access keys older than N days (default 90)</td></tr>
      <tr><td>iam-password-policy</td><td>Account password policy meets minimum requirements</td></tr>
      <tr><td>restricted-ssh</td><td>Security groups not allowing unrestricted SSH from 0.0.0.0/0</td></tr>
      <tr><td>s3-bucket-public-read-prohibited</td><td>No S3 bucket grants public read via ACL or policy</td></tr>
      <tr><td>cloudtrail-enabled</td><td>CloudTrail is active in each region</td></tr>
      <tr><td>cloud-trail-log-file-validation-enabled</td><td>Log file integrity validation is on</td></tr>
      <tr><td>ec2-instance-no-public-ip</td><td>EC2 instances in flagged subnets don't have public IPs</td></tr>
      <tr><td>rds-instance-public-access-check</td><td>RDS instances are not publicly accessible</td></tr>
      <tr><td>kms-cmk-not-scheduled-for-deletion</td><td>Customer-managed KMS keys are not pending deletion</td></tr>
      <tr><td>guardduty-enabled-centralized</td><td>GuardDuty is enabled and delegated to the security account</td></tr>
    </tbody>
  </table>
  <p><strong>Conformance Packs</strong> bundle multiple Config rules into a single deployable unit. AWS provides pre-built Conformance Packs for CIS, NIST, and PCI DSS. Deploy via Organizations for account-wide coverage.</p>

  <h3>EventBridge: Automated Response Integration</h3>
  <p>EventBridge rules can trigger Lambda functions, SNS topics, SQS queues, and Step Functions in response to Security Hub finding events. This enables automated notification, enrichment, and remediation.</p>
  <pre><code>// EventBridge rule pattern: trigger on Security Hub HIGH/CRITICAL findings
{
  "source": ["aws.securityhub"],
  "detail-type": ["Security Hub Findings - Imported"],
  "detail": {
    "findings": {
      "Severity": {
        "Label": ["CRITICAL", "HIGH"]
      },
      "WorkflowStatus": ["NEW"],
      "RecordState": ["ACTIVE"]
    }
  }
}</code></pre>
  <p>The Lambda target can: enrich the finding with CloudTrail context, create a Jira ticket, send a PagerDuty alert, add resource tags for investigation, or invoke an isolation Step Function. Always update WorkflowStatus to NOTIFIED in Security Hub once a ticket is created to prevent duplicate alerts.</p>

  <h3>Multi-Account Aggregation and Organizations Integration</h3>
  <p>In Organizations-based environments, Security Hub should be centrally managed from a dedicated Security account.</p>
  <ul>
    <li><strong>Delegated Administrator:</strong> Designate your Security account as the Security Hub delegated admin via Organizations. This lets you see findings from all member accounts in a single Security Hub instance without manual invitations.</li>
    <li><strong>Aggregation Region:</strong> Select one primary region as the Aggregation Region. Findings from all other regions in all member accounts roll up here. This consolidates global investigation without switching regions.</li>
    <li><strong>Auto-enable:</strong> Configure Security Hub to automatically enable in new accounts as they join the organization and auto-enable standards (FSBP) on join.</li>
    <li><strong>Cross-account findings:</strong> AwsAccountId in the ASFF finding tells you which member account owns the affected resource — critical for triaging at scale.</li>
    <li><strong>Suppression at scale:</strong> Use automation rules (introduced in 2023) to auto-suppress specific finding types or update workflow status based on resource tags — reduces noise from known-exception resources across all member accounts.</li>
  </ul>
</div>`
  },
  "aws-cloud-security-engineering": {
    navLabel: "AWS Cloud Security",
    title: "AWS Cloud Security Engineering: IAM, Network, Logging, and Response",
    readingTime: "95 minutes",
    overview:
      "This is a broad AWS security engineering section covering identity boundaries, least privilege, account architecture, network controls, key management, logging, and response automation. It is designed for roles requiring practical AWS experience.",
    architecture:
      "Anchor your design on multi-account segmentation, SCP guardrails, IAM role boundaries, immutable logging, and automated detective controls. Build for both prevention and response.",
    handsOn: [
      "Design OU/account strategy with production, non-production, security, and log-archive separation.",
      "Create IAM least-privilege role policy and test with access analyzer and denied-action review.",
      "Implement VPC egress restrictions, security groups, and NACL validation checks.",
      "Configure centralized logs (CloudTrail/Config/VPC Flow Logs) with retention and integrity controls."
    ],
    tools: ["AWS Organizations", "IAM", "KMS", "CloudTrail", "Config", "VPC", "S3", "Lambda"],
    outcomes: [
      "Design secure-by-default AWS foundations.",
      "Explain cloud tradeoffs between speed and control.",
      "Operate cloud incidents with reliable telemetry and clear guardrails."
    ],
    guide: {
      prerequisites: ["AWS core service familiarity", "Basic Terraform/CloudFormation literacy", "Identity and network fundamentals"],
      coreConcepts: ["Multi-account security architecture", "Least privilege and IAM boundaries", "Centralized logging and response"],
      practiceDrills: ["Build one secure landing zone checklist", "Write one IAM role hardening playbook", "Run one cloud incident simulation"],
      selfCheck: ["Can you show how your AWS design limits blast radius?", "Can you investigate suspicious IAM behavior quickly?"]
    },
    explainer: {
      what: "This section teaches how to build and operate secure AWS environments, not just configure isolated services.",
      why: "Cloud speed amplifies both good design and bad mistakes. Strong foundations prevent recurring incidents and audit failures.",
      how: ["Start with account and identity boundaries.", "Enforce logging and control visibility everywhere.", "Automate high-value detections and response actions."],
      success: "You are successful when new workloads inherit secure defaults and incidents are investigated with complete evidence."
    },
    plainEnglish: [
      "Set up AWS so teams move fast without breaking security.",
      "Good identity and logging design prevents most cloud chaos.",
      "If you can explain and prove your guardrails, you are ready."
    ],
    deepContent: `
<div class="deep-content">
  <h3>IAM Policy Evaluation Logic: The 6-Step Decision Order</h3>
  <p>When any AWS principal makes a request, IAM evaluates a specific sequence of policy layers. Understanding this order is essential for debugging access denials and designing least-privilege correctly.</p>
  <ol>
    <li><strong>Explicit Deny</strong> — Any policy with an explicit Deny on the action wins immediately. No Allow can override an explicit Deny (except for permission boundaries, which can only restrict, never allow beyond identity policies).</li>
    <li><strong>Service Control Policy (SCP)</strong> — If the account is in an AWS Organization, the SCP must allow the action. An SCP is not a grant — it only constrains what identity policies can permit. If an SCP doesn't include the action, it's implicitly denied regardless of identity policy.</li>
    <li><strong>Resource-Based Policy</strong> — For cross-account access, a resource-based policy (e.g., S3 bucket policy) can grant access independently. For same-account, both identity and resource policy must allow or only resource policy with explicit principal match.</li>
    <li><strong>Identity-Based Policy</strong> — The IAM policies (inline or managed) attached to the user, group, or role must allow the action.</li>
    <li><strong>Permission Boundary</strong> — If a permission boundary is attached to the role or user, it must also allow the action. A boundary limits the maximum permissions — it cannot grant permissions that aren't also in the identity policy.</li>
    <li><strong>Session Policy</strong> — For roles assumed via AssumeRole with a session policy, the session policy further intersects (restricts) what the identity policy allows. Useful for delegating scoped access without changing the role's base policy.</li>
  </ol>
  <h4>Debugging Denied Actions</h4>
  <pre><code># Simulate an action to see which policy layer denies it
aws iam simulate-principal-policy \\
  --policy-source-arn arn:aws:iam::123456789012:role/MyRole \\
  --action-names s3:GetObject \\
  --resource-arns arn:aws:s3:::my-bucket/key

# Check effective permissions for a role
aws iam get-role --role-name MyRole
aws iam list-attached-role-policies --role-name MyRole
aws iam list-role-policies --role-name MyRole  # inline policies</code></pre>

  <h3>Service Control Policies: Organizational Guardrails</h3>
  <p>SCPs are preventive guardrails applied at the OU or account level in AWS Organizations. They are the highest-level enforcement mechanism — even the account's root user cannot exceed SCP boundaries.</p>
  <h4>Key SCP Patterns</h4>
  <pre><code>// Deny disabling CloudTrail (detective control protection)
{
  "Sid": "DenyCloudTrailDisable",
  "Effect": "Deny",
  "Action": [
    "cloudtrail:StopLogging",
    "cloudtrail:DeleteTrail",
    "cloudtrail:UpdateTrail"
  ],
  "Resource": "*"
}

// Deny public S3 bucket ACLs
{
  "Sid": "DenyPublicS3ACL",
  "Effect": "Deny",
  "Action": "s3:PutBucketAcl",
  "Resource": "*",
  "Condition": {
    "StringEquals": {
      "s3:x-amz-acl": ["public-read", "public-read-write", "authenticated-read"]
    }
  }
}

// Restrict operations to approved regions only
{
  "Sid": "DenyNonApprovedRegions",
  "Effect": "Deny",
  "NotAction": [
    "iam:*", "sts:*", "organizations:*",
    "support:*", "cloudfront:*", "route53:*"
  ],
  "Resource": "*",
  "Condition": {
    "StringNotEquals": {
      "aws:RequestedRegion": ["us-east-1", "us-west-2"]
    }
  }
}

// Require MFA for sensitive IAM actions
{
  "Sid": "RequireMFAForIAMChanges",
  "Effect": "Deny",
  "Action": ["iam:DeleteUserPolicy", "iam:AttachUserPolicy", "iam:CreateLoginProfile"],
  "Resource": "*",
  "Condition": {
    "BoolIfExists": { "aws:MultiFactorAuthPresent": "false" }
  }
}</code></pre>
  <p><strong>SCP gotchas:</strong> SCPs do not apply to the management (root) account of the Organization. Service-linked roles are not restricted by SCPs. Test SCPs in non-production OUs before applying to workload accounts.</p>

  <h3>Security Groups vs Network ACLs</h3>
  <table class="deep-table">
    <thead><tr><th>Property</th><th>Security Groups</th><th>Network ACLs</th></tr></thead>
    <tbody>
      <tr><td>Scope</td><td>Applied to ENI (instance level)</td><td>Applied to subnet boundaries</td></tr>
      <tr><td>Statefulness</td><td>Stateful — return traffic automatically allowed</td><td>Stateless — must explicitly allow inbound AND outbound for each flow</td></tr>
      <tr><td>Rule types</td><td>Allow rules only (implicit deny of all else)</td><td>Allow and Deny rules with numbered priority</td></tr>
      <tr><td>Rule evaluation</td><td>All rules evaluated together</td><td>Processed in ascending rule number order — first match wins</td></tr>
      <tr><td>Scope of effect</td><td>Only affects attached instances</td><td>Affects all resources in the subnet</td></tr>
      <tr><td>Best use</td><td>Service-to-service allow rules, least-privilege instance access</td><td>Blocking specific IP ranges, broad subnet-level restrictions</td></tr>
      <tr><td>Default behavior</td><td>Default SG: allow all outbound, deny all inbound</td><td>Default NACL: allow all inbound and outbound</td></tr>
    </tbody>
  </table>
  <p><strong>Operational pattern:</strong> Use Security Groups as primary controls (they are stateful and easier to manage). Use NACLs for explicit IP blocklist enforcement at subnet level — particularly useful for blocking known-malicious CIDRs identified during incidents.</p>

  <h3>VPC Flow Logs: Capture and Investigation</h3>
  <p>VPC Flow Logs capture metadata about IP traffic through ENIs. They do not capture payload content — but are invaluable for network investigation.</p>
  <h4>Key Flow Log Fields</h4>
  <p>Default fields include: version, account-id, interface-id, srcaddr, dstaddr, srcport, dstport, protocol, packets, bytes, start, end, action (ACCEPT/REJECT), log-status.</p>
  <h4>Athena Query: SSH Brute Force Investigation</h4>
  <pre><code>-- Find external sources making high-volume SSH connection attempts (REJECT)
SELECT srcaddr, COUNT(*) AS attempt_count, SUM(packets) AS total_packets
FROM vpc_flow_logs
WHERE dstport = 22
  AND action = 'REJECT'
  AND start > to_unixtime(current_timestamp - interval '1' hour)
GROUP BY srcaddr
ORDER BY attempt_count DESC
LIMIT 20;

-- Correlate accepted SSH connections with the same source IPs
SELECT srcaddr, dstaddr, dstport, start, end, bytes, action
FROM vpc_flow_logs
WHERE srcaddr IN ('203.0.113.50', '198.51.100.22')
  AND dstport = 22
  AND action = 'ACCEPT'
ORDER BY start DESC;</code></pre>

  <h3>KMS: Key Types, Envelope Encryption, and Key Policy</h3>
  <h4>Key Types Comparison</h4>
  <table class="deep-table">
    <thead><tr><th>Key Type</th><th>Management</th><th>Rotation</th><th>Cost</th><th>Use Case</th></tr></thead>
    <tbody>
      <tr><td>AWS Managed Key</td><td>AWS creates and manages automatically per service</td><td>Annual automatic</td><td>Free</td><td>Default encryption for S3, RDS, EBS without custom policy needs</td></tr>
      <tr><td>Customer Managed Key (CMK)</td><td>You create, rotate, and set key policy</td><td>Manual or annual auto-rotate</td><td>$1/month per key</td><td>Regulatory requirements, cross-account sharing, custom grant controls</td></tr>
      <tr><td>AWS CloudHSM</td><td>Your dedicated HSM hardware in your VPC</td><td>You manage</td><td>High</td><td>FIPS 140-2 Level 3, bespoke cryptographic operations</td></tr>
    </tbody>
  </table>
  <h4>Envelope Encryption</h4>
  <p>AWS services use envelope encryption: a <strong>data key</strong> encrypts the actual data, and the <strong>KMS CMK</strong> encrypts (wraps) the data key. The encrypted data key is stored alongside the ciphertext. On decrypt: KMS decrypts the data key, the service uses the data key to decrypt the object, then the data key is discarded from memory. The CMK never leaves KMS.</p>
  <h4>Key Policy Best Practice</h4>
  <pre><code>// Ensure the key admin cannot use the key for cryptographic operations
// and ensure key usage is restricted to specific roles
{
  "Sid": "AllowKeyUsageBySpecificRole",
  "Effect": "Allow",
  "Principal": {
    "AWS": "arn:aws:iam::123456789012:role/AppEncryptionRole"
  },
  "Action": ["kms:Decrypt", "kms:GenerateDataKey"],
  "Resource": "*"
}</code></pre>
  <p><strong>Key deletion protection:</strong> Schedule deletion has a 7–30 day waiting period. Use kms-cmk-not-scheduled-for-deletion Config rule to alert on pending deletion. If an attacker schedules key deletion, you have a window to cancel it.</p>

  <h3>WAF and Shield: Web Application and DDoS Protection</h3>
  <h4>AWS WAF Rule Types</h4>
  <ul>
    <li><strong>AWS Managed Rule Groups</strong> — Pre-built rule sets maintained by AWS: AWSManagedRulesCommonRuleSet (OWASP Top 10 equivalent), AWSManagedRulesKnownBadInputsRuleSet (log4j, SSRF, Local File Inclusion), AWSManagedRulesSQLiRuleSet, AWSManagedRulesBotControlRuleSet</li>
    <li><strong>Rate-Based Rules</strong> — Block source IPs exceeding a request threshold within 5 minutes. Use for brute force and scraping protection. Minimum threshold: 100 requests.</li>
    <li><strong>Geo-restriction</strong> — Block or allow based on country of origin. Useful for services with known geographic usage scope.</li>
    <li><strong>Custom Rules</strong> — Header inspection, URI path matching, query string conditions, IP set references (for allowlisting known CIDRs).</li>
  </ul>
  <h4>Shield Standard vs Advanced</h4>
  <table class="deep-table">
    <thead><tr><th>Feature</th><th>Shield Standard</th><th>Shield Advanced</th></tr></thead>
    <tbody>
      <tr><td>Cost</td><td>Free, included in AWS</td><td>~$3,000/month per org</td></tr>
      <tr><td>DDoS protection</td><td>Layer 3/4 volumetric protection automatically</td><td>Layer 7 + intelligent mitigation with DRT support</td></tr>
      <tr><td>DDoS Response Team (DRT)</td><td>Not included</td><td>24/7 AWS DRT engagement during attacks</td></tr>
      <tr><td>Cost protection</td><td>None</td><td>AWS credits for scaling costs during DDoS events</td></tr>
      <tr><td>Visibility</td><td>Basic CloudWatch metrics</td><td>Real-time attack visibility and historical reporting</td></tr>
    </tbody>
  </table>

  <h3>Amazon Inspector: Vulnerability Assessment</h3>
  <p>Amazon Inspector v2 continuously scans for software vulnerabilities and misconfigurations. Unlike the original Inspector, v2 requires no agents on EC2 (uses SSM) and integrates natively with Security Hub.</p>
  <ul>
    <li><strong>EC2 scanning:</strong> OS package vulnerabilities and network reachability findings (e.g., which ports are reachable from internet)</li>
    <li><strong>ECR container image scanning:</strong> Scans images on push and continuously for new CVEs without re-pushing</li>
    <li><strong>Lambda function scanning:</strong> Code and dependency vulnerability assessment for Lambda layers and function packages</li>
    <li><strong>SBOM generation:</strong> Inspector can export a Software Bill of Materials (SBOM) for all scanned resources in CycloneDX or SPDX format</li>
    <li><strong>Security Hub integration:</strong> All Inspector findings appear in Security Hub with ASFF format — enabling unified triage and suppression</li>
  </ul>

  <h3>EC2 Compromise: Incident Response Procedure</h3>
  <p>When GuardDuty or Security Hub signals a compromised EC2 instance, follow a structured isolation and forensic procedure. Speed matters — but so does evidence preservation.</p>
  <pre><code># Step 1: Capture instance metadata for triage
aws ec2 describe-instances --instance-ids i-0abc12345def67890 \\
  --query 'Reservations[].Instances[].[InstanceId,VpcId,SubnetId,SecurityGroups,IamInstanceProfile]'

# Step 2: Take EBS snapshot before isolation (preserve forensic evidence)
aws ec2 create-snapshot \\
  --volume-id vol-0abc12345def67890 \\
  --description "Incident-$(date +%Y%m%d-%H%M%S)-forensic-snapshot"

# Step 3: Isolate using a quarantine Security Group (deny all inbound + outbound)
aws ec2 modify-instance-attribute \\
  --instance-id i-0abc12345def67890 \\
  --groups sg-quarantine-0abc12345def67890

# Step 4: Revoke IAM role credentials if role was potentially exfiltrated
# - Get session tokens issued to the role
aws iam put-role-policy --role-name CompromisedRole \\
  --policy-name DenyAllPolicy \\
  --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":"*","Resource":"*"}]}'

# Step 5: Enable termination protection to prevent evidence destruction
aws ec2 modify-instance-attribute \\
  --instance-id i-0abc12345def67890 \\
  --disable-api-termination

# Step 6: Verify CloudTrail is intact (attacker may have tried to disable)
aws cloudtrail get-trail-status --name my-trail --query '[IsLogging,LatestDeliveryTime]'</code></pre>

  <h3>IAM Identity Center: Centralized Access for Multi-Account</h3>
  <p>IAM Identity Center (formerly AWS SSO) centralizes human access to multiple AWS accounts from a single identity source. It replaces per-account IAM user management in Organizations environments.</p>
  <ul>
    <li><strong>Permission Sets:</strong> Define what a user can do in an account. Equivalent to an IAM role. Pre-built sets include AdministratorAccess, PowerUserAccess, ReadOnlyAccess. Create custom Permission Sets for least-privilege.</li>
    <li><strong>Account Assignments:</strong> Bind users or groups from your identity source to a Permission Set in a specific account. Assignment creates a temporary role in the target account automatically.</li>
    <li><strong>ABAC (Attribute-Based Access Control):</strong> Use identity source attributes (department, team, cost-center) as session tags to make Permission Sets dynamic — one Permission Set that restricts to resources tagged with the user's team.</li>
    <li><strong>SCIM Provisioning:</strong> Sync users and groups from Okta, Azure AD, or other external IdPs automatically via SCIM. No manual user management in Identity Center during offboarding — deprovisioning in IdP removes AWS access.</li>
    <li><strong>Session duration:</strong> Set maximum session duration per Permission Set. Privileged access should use short sessions (1–4 hours). Non-interactive automation should use service accounts with role assumption, not Identity Center.</li>
  </ul>
</div>`
  },
  "siem-tooling-platform-depth": {
    navLabel: "SIEM Tooling",
    title: "SIEM Platform Depth: QRadar, Splunk, Sumo Logic, Kibana, Security Onion, ArcSight",
    readingTime: "85 minutes",
    overview:
      "This section targets 2+ years SIEM hands-on expectations by comparing query models, ingestion pipelines, detection workflow, tuning strategy, and operational strengths across major SIEM platforms.",
    architecture:
      "Treat SIEM as a lifecycle: ingest -> normalize -> detect -> triage -> tune -> report. Platform features differ, but disciplined operations are consistent.",
    handsOn: [
      "Write equivalent detection logic in at least two platforms (example: Splunk SPL and Sumo query syntax).",
      "Compare correlation rule implementation between QRadar and ArcSight style models.",
      "Tune one noisy detection and quantify before/after precision.",
      "Build analyst runbook for triage fields required across tools."
    ],
    tools: ["QRadar", "Splunk", "Sumo Logic", "Kibana", "Security Onion", "ArcSight"],
    outcomes: [
      "Move between SIEM stacks without losing detection quality.",
      "Tune detections using measurable operations metrics.",
      "Design platform-agnostic SOC workflows."
    ],
    guide: {
      prerequisites: ["Log schema basics", "Detection engineering fundamentals", "SOC triage workflow"],
      coreConcepts: ["Platform query language tradeoffs", "Correlation and enrichment strategy", "Tuning governance and ownership"],
      practiceDrills: ["Translate one rule across two SIEM tools", "Measure false-positive reduction", "Document platform migration considerations"],
      selfCheck: ["Can you explain platform-specific limitations?", "Can you defend your tuning decisions with data?"]
    },
    explainer: {
      what: "This section is practical SIEM cross-platform fluency: how to investigate, detect, and tune in multiple ecosystems.",
      why: "Most teams use mixed or evolving tool stacks. Platform-agnostic detection capability makes you resilient and valuable.",
      how: ["Map shared detection logic first.", "Account for platform-specific field mappings.", "Track tuning metrics in a consistent model."],
      success: "You succeed when you can implement equivalent detections across tools and maintain analyst effectiveness."
    },
    plainEnglish: [
      "Different SIEM tools speak different query languages but solve similar SOC problems.",
      "Learn how to move your detection thinking between platforms.",
      "Track outcomes, not just query syntax."
    ],
    deepContent: `
<div class="deep-content">
  <h3>SIEM Platform Query Language Comparison</h3>
  <table class="deep-table">
    <thead><tr><th>Platform</th><th>Language</th><th>Basic Search Example</th><th>Aggregation Pattern</th></tr></thead>
    <tbody>
      <tr><td><strong>Splunk</strong></td><td>SPL</td><td>index=windows EventCode=4625 | head 100</td><td>| stats count by Account, src_ip</td></tr>
      <tr><td><strong>Elastic/Kibana</strong></td><td>KQL/ESQL</td><td>event.code: "4625" AND host.os.type: "windows"</td><td>FROM logs-* | STATS count(*) BY user.name</td></tr>
      <tr><td><strong>Microsoft Sentinel</strong></td><td>KQL</td><td>SecurityEvent | where EventID == 4625</td><td>| summarize count() by Account, IpAddress</td></tr>
      <tr><td><strong>IBM QRadar</strong></td><td>AQL</td><td>SELECT * FROM events WHERE eventid=4625 LAST 1 HOURS</td><td>SELECT username, COUNT(*) AS cnt FROM events GROUP BY username</td></tr>
      <tr><td><strong>Sumo Logic</strong></td><td>Sumo QL</td><td>_sourceCategory=windows | where eventid=4625</td><td>| count by src_user, src_ip | sort by _count</td></tr>
    </tbody>
  </table>

  <h3>Detection Engineering Workflow (Platform-Agnostic)</h3>
  <div class="flow-steps">
    <div class="flow-step"><div class="flow-step-num">1</div><div class="flow-step-body"><strong>Hypothesis First:</strong> Define the behavior you want to detect using ATT&CK technique description, before writing any query.</div></div>
    <div class="flow-step"><div class="flow-step-num">2</div><div class="flow-step-body"><strong>Map to Log Fields:</strong> Identify which SIEM source type contains the relevant telemetry. Confirm the fields are normalized in your data model (ECS, CIM, etc.).</div></div>
    <div class="flow-step"><div class="flow-step-num">3</div><div class="flow-step-body"><strong>Write Platform-Native Query:</strong> Translate the hypothesis into the native query language of your current SIEM. Keep it simple first — no premature optimization.</div></div>
    <div class="flow-step"><div class="flow-step-num">4</div><div class="flow-step-body"><strong>Test Against Historical Data:</strong> Run query against 30-90 days of historical data. Assess: How many hits? Are they all TP or mostly FP?</div></div>
    <div class="flow-step"><div class="flow-step-num">5</div><div class="flow-step-body"><strong>Add Exclusions:</strong> Tune out known-safe patterns (admin scripts, monitoring tools, approved automation). Document each exclusion reason.</div></div>
    <div class="flow-step"><div class="flow-step-num">6</div><div class="flow-step-body"><strong>Publish with Metadata:</strong> Tag the rule with ATT&CK technique, owner, creation date, review date, expected false-positive rate.</div></div>
  </div>

  <h3>SIEM Tuning Cheat Sheet</h3>
  <div class="cheat-sheet">
    <h5>Alert Quality Improvement Commands</h5>
    <div class="cmd-row"><span class="cmd">Step 1: Measure FP rate</span><span class="cmd-desc">Count investigations last 30 days → % closed as FP. >30% FP = needs tuning</span></div>
    <div class="cmd-row"><span class="cmd">Step 2: Find top FP patterns</span><span class="cmd-desc">Group FP dispositions by field value (user, hostname, process) — find most common FP clusters</span></div>
    <div class="cmd-row"><span class="cmd">Step 3: Add targeted exclusion</span><span class="cmd-desc">NOT for known-safe: NOT (user="svc_monitoring" AND process="check_mk")</span></div>
    <div class="cmd-row"><span class="cmd">Step 4: Increase specificity</span><span class="cmd-desc">Add additional conditions to narrow scope: require 2+ signals instead of 1</span></div>
    <div class="cmd-row"><span class="cmd">Step 5: Retest after 7 days</span><span class="cmd-desc">Confirm FP rate dropped without missing real detections (validate against test data)</span></div>
    <div class="cmd-row"><span class="cmd">Step 6: Document change</span><span class="cmd-desc">Changelog: what changed, why, who approved, expected impact on TP/FP rate</span></div>
  </div>

  <h3>Cross-Platform SIEM Query Translation Example</h3>
  <div class="code-block">
Query Goal: Detect PowerShell with -EncodedCommand flag (T1059.001)

SPLUNK SPL:
index=sysmon EventCode=1 
| where like(CommandLine, "%-enc%") OR like(CommandLine, "%-EncodedCommand%")
| where Image like "%powershell%"
| stats count by Computer, User, CommandLine
| where count >= 1

ELASTIC KQL:
process.name: "powershell.exe" AND 
process.args: ("-enc" OR "-EncodedCommand" OR "-e" OR "-Encoded")

MICROSOFT SENTINEL KQL:
DeviceProcessEvents
| where FileName =~ "powershell.exe"
| where ProcessCommandLine contains "-EncodedCommand" or ProcessCommandLine contains " -enc "
| project TimeGenerated, DeviceName, AccountName, ProcessCommandLine

QRADAR AQL:
SELECT "sourceip", "username", "UTF8(payload)" 
FROM events
WHERE process_name ILIKE '%powershell%' 
AND "UTF8(payload)" ILIKE '%-enc%'
LAST 24 HOURS

Key Field Differences Across Platforms:
  Splunk:    Image, CommandLine, Computer, User
  Elastic:   process.name, process.args, host.name, user.name
  Sentinel:  FileName, ProcessCommandLine, DeviceName, AccountName
  QRadar:    process_name, username, payload (raw)
  </div>

  <h3>Platform Selection Reference</h3>
  <div class="visual-card-grid">
    <div class="visual-card">
      <h5>Choose Splunk When</h5>
      <ul>
        <li>High data volume with custom parsing needs</li>
        <li>Large team with SPL expertise investments</li>
        <li>Need mature enterprise correlation rules</li>
        <li>Enterprise Security premium app feasible</li>
      </ul>
    </div>
    <div class="visual-card">
      <h5>Choose Elastic When</h5>
      <ul>
        <li>Cost-sensitive; open source core preferred</li>
        <li>Engineering team comfortable managing clusters</li>
        <li>Need integrated EDR (Elastic Agent)</li>
        <li>ECS-normalized data pipeline already exists</li>
      </ul>
    </div>
    <div class="visual-card">
      <h5>Choose Sentinel When</h5>
      <ul>
        <li>Microsoft-heavy environment (Azure/M365/Defender)</li>
        <li>Cloud-native scaling requirements</li>
        <li>Need built-in SOAR (Logic Apps)</li>
        <li>KQL skills exist in the team</li>
      </ul>
    </div>
  </div>

  <div class="resource-links">
    <a class="resource-link" href="https://sigmahq.io/" target="_blank">SigmaHQ — Cross-Platform Detection Rules</a>
    <a class="resource-link" href="https://docs.splunk.com/Documentation/ES" target="_blank">Splunk Enterprise Security Docs</a>
    <a class="resource-link" href="https://learn.microsoft.com/en-us/azure/sentinel/" target="_blank">Microsoft Sentinel Documentation</a>
    <a class="resource-link" href="https://www.elastic.co/guide/en/security/current/" target="_blank">Elastic Security Guide</a>
  </div>
</div>`
  },
  "edr-and-edrm-operations": {
    navLabel: "EDR Operations",
    title: "EDR/EDRM Operations: Telemetry, Triage, Containment, and Recovery",
    readingTime: "70 minutes",
    overview:
      "This section provides hands-on EDR operations depth: signal interpretation, process-tree analysis, containment actions, forensic evidence collection, and recovery verification with minimal business disruption.",
    architecture:
      "Build a response loop: high-fidelity alert -> host scope validation -> containment decision -> root-cause analysis -> remediation -> post-incident hardening.",
    handsOn: [
      "Investigate suspicious process lineage and command-line behavior.",
      "Use host isolation and network containment with explicit rollback criteria.",
      "Capture triage evidence (hashes, parent-child process tree, persistence indicators).",
      "Write post-incident control-improvement actions tied to findings."
    ],
    tools: ["EDR platform", "SIEM", "Threat intel feeds", "Ticketing system"],
    outcomes: ["Faster endpoint incident triage", "Safer containment decisions", "Evidence-driven remediation verification"],
    guide: {
      prerequisites: ["Windows/Linux process model basics", "Endpoint telemetry field familiarity", "IR severity model"],
      coreConcepts: ["Detection confidence and triage prioritization", "Containment strategy", "Forensic traceability"],
      practiceDrills: ["Run one simulated malware triage", "Practice isolation + recovery decision", "Create endpoint incident checklist"],
      selfCheck: ["Can you explain containment risk tradeoffs?", "Can you prove host is clean after remediation?"]
    },
    explainer: {
      what: "EDR operations focus on quickly understanding what happened on a host and what to do next without guesswork.",
      why: "Endpoint incidents are time-sensitive. Good EDR handling reduces attacker dwell time and business impact.",
      how: ["Validate alert quality and scope.", "Contain based on risk and business criticality.", "Confirm eradication with objective evidence."],
      success: "You are successful when containment is fast, evidence is complete, and recurrence drops after lessons learned."
    },
    plainEnglish: [
      "EDR helps you see what ran on a machine and how risky it is.",
      "Contain first, investigate deeply, then prove cleanup.",
      "Always leave a clear evidence trail."
    ],
    deepContent: `
<div class="deep-content">
  <h3>EDR Platform Telemetry Comparison</h3>
  <table class="deep-table">
    <thead><tr><th>Telemetry Type</th><th>CrowdStrike Falcon</th><th>SentinelOne</th><th>Microsoft Defender</th><th>Investigation Value</th></tr></thead>
    <tbody>
      <tr><td><strong>Process Execution</strong></td><td>Full process tree with parent lineage</td><td>Storyline™ — complete behavioral context</td><td>ProcessCreated event in Device events</td><td>Critical — shows attack chain</td></tr>
      <tr><td><strong>Network Activity</strong></td><td>Network connections with process context</td><td>Network events linked to process Storyline</td><td>DeviceNetworkEvents with process link</td><td>High — identifies C2 and exfil</td></tr>
      <tr><td><strong>File Operations</strong></td><td>File create/modify/delete events</td><td>File events with hash + reputation</td><td>DeviceFileEvents with hash</td><td>High — tracks payload drops</td></tr>
      <tr><td><strong>Registry Changes</strong></td><td>Registry modification events</td><td>Registry events linked to process</td><td>DeviceRegistryEvents</td><td>Medium — identifies persistence</td></tr>
      <tr><td><strong>Memory Analysis</strong></td><td>In-memory threat detection</td><td>Behavioral AI + NGAV</td><td>Advanced hunting memory snapshots</td><td>High — fileless malware detection</td></tr>
    </tbody>
  </table>

  <h3>Endpoint Triage Investigation Flow</h3>
  <div class="flow-steps">
    <div class="flow-step"><div class="flow-step-num">1</div><div class="flow-step-body"><strong>Alert Review:</strong> Read the detection name and mapped technique. What behavior does this alert detect? Is this a high-confidence behavioral rule or a simple signature?</div></div>
    <div class="flow-step"><div class="flow-step-num">2</div><div class="flow-step-body"><strong>Process Tree Analysis:</strong> Follow the process tree: what was the parent process? Was it expected? (explorer.exe starting cmd.exe is normal; Word.exe starting PowerShell is suspicious.)</div></div>
    <div class="flow-step"><div class="flow-step-num">3</div><div class="flow-step-body"><strong>Command Line Review:</strong> Read the exact command line arguments. Encoded strings (-enc), script execution (-exec bypass), or download cradles are red flags. VirusTotal the hash.</div></div>
    <div class="flow-step"><div class="flow-step-num">4</div><div class="flow-step-body"><strong>Network Connections:</strong> Did the suspicious process make outbound connections? To where? Is the destination IP/domain known malicious? Check timing (beacon interval?)</div></div>
    <div class="flow-step"><div class="flow-step-num">5</div><div class="flow-step-body"><strong>Scope Assessment:</strong> Has this process run on other devices? Same user? Same time window? Lateral movement check: any admin share connections or RDP from this host?</div></div>
    <div class="flow-step"><div class="flow-step-num">6</div><div class="flow-step-body"><strong>Containment Decision:</strong> Based on confidence level: High = isolate immediately. Medium = isolate + notify user. Low = monitor + enrich. Document your reasoning.</div></div>
  </div>

  <h3>EDR Console Investigation Cheat Sheet</h3>
  <div class="cheat-sheet">
    <h5>CrowdStrike Falcon Event Search Examples</h5>
    <div class="cmd-row"><span class="cmd">event_platform=Win event_simpleName=ProcessRollup2 ImageFileName=*powershell* CommandLine=*enc*</span><span class="cmd-desc">Find encoded PowerShell executions</span></div>
    <div class="cmd-row"><span class="cmd">event_platform=Win event_simpleName=DnsRequest DomainName!="*microsoft.com"</span><span class="cmd-desc">Find DNS queries to non-Microsoft domains (filter based on expected)</span></div>
    <div class="cmd-row"><span class="cmd">event_platform=Win event_simpleName=NetworkConnect RemotePort=4444</span><span class="cmd-desc">Potential Metasploit C2 ports — investigate immediately</span></div>
    <div class="cmd-row"><span class="cmd">event_simpleName=PeFileWritten FilePath=*\\AppData\\* FileExtension=exe</span><span class="cmd-desc">Executables dropped to user AppData — common malware staging</span></div>
    <div class="cmd-row"><span class="cmd">ComputerName="LAPTOP-ABC" | groupby ImageFileName, CommandLine | sort count desc</span><span class="cmd-desc">Top processes on a suspect host for baselining</span></div>
  </div>

  <h3>Forensic Evidence Collection Checklist</h3>
  <div class="visual-card-grid">
    <div class="visual-card">
      <h5>Volatile Evidence (Collect First)</h5>
      <ul>
        <li>Memory dump (full RAM image if feasible)</li>
        <li>Running processes list with PIDs and hashes</li>
        <li>Active network connections (netstat -anpb)</li>
        <li>Logged-in users and recent sessions</li>
      </ul>
    </div>
    <div class="visual-card">
      <h5>Persistent Evidence (Collect Second)</h5>
      <ul>
        <li>Windows Event Logs (Security, System, Application, PowerShell)</li>
        <li>Registry export (Run/RunOnce keys, services)</li>
        <li>Prefetch files (evidence of execution)</li>
        <li>Browser history and downloads</li>
      </ul>
    </div>
    <div class="visual-card">
      <h5>Evidence Handling Rules</h5>
      <ul>
        <li>Hash all collected files (SHA256) before analysis</li>
        <li>Document collection time, tool used, analyst name</li>
        <li>Never modify the original evidence — work on copies</li>
        <li>Store evidence in encrypted, access-controlled location</li>
      </ul>
    </div>
  </div>

  <div class="visual-warning">
    <strong>Containment Mistakes to Avoid:</strong><br/>
    ✗ Isolating before capturing evidence — isolation may destroy volatile data<br/>
    ✗ Rebooting an infected device — clears volatile memory and may destroy forensic artifacts<br/>
    ✗ Containing without notifying the user — causes panic and helpdesk overload<br/>
    ✓ Always document: why you contained, when, evidence collected, rollback criteria
  </div>

  <div class="resource-links">
    <a class="resource-link" href="https://attack.mitre.org/tactics/TA0040/" target="_blank">MITRE ATT&CK — Impact Tactics (Ransomware, Wipers)</a>
    <a class="resource-link" href="https://github.com/redcanaryco/atomic-red-team" target="_blank">Atomic Red Team — Endpoint Technique Testing</a>
    <a class="resource-link" href="https://www.crowdstrike.com/blog/" target="_blank">CrowdStrike Blog — Threat Intelligence</a>
    <a class="resource-link" href="https://docs.microsoft.com/en-us/microsoft-365/security/defender-endpoint/" target="_blank">Microsoft Defender for Endpoint Docs</a>
  </div>
</div>`
  },
  "threat-intelligence-and-ioc-engineering": {
    navLabel: "Threat Intel & IOCs",
    title: "Threat Intelligence, IOC Analysis, and Detection Rule Engineering",
    readingTime: "78 minutes",
    overview:
      "This section covers converting threat intelligence into operational detections. You will prioritize feeds, validate IOC quality, map to ATT&CK behaviors, and write durable detection logic with false-positive controls.",
    architecture:
      "Use a repeatable chain: intel intake -> confidence scoring -> environment relevance -> detection authoring -> validation -> tuning -> retirement criteria.",
    handsOn: [
      "Score IOC confidence and relevancy before creating alerts.",
      "Write one behavior-based rule and one IOC-anchored rule for the same threat cluster.",
      "Map detections to ATT&CK techniques and expected evidence fields.",
      "Define expiration and review cadence for short-lived indicators."
    ],
    tools: ["Threat intel platform", "SIEM", "EDR", "MITRE ATT&CK", "Case management"],
    outcomes: ["Higher detection fidelity", "Reduced noisy IOC alerts", "Clear intel-to-detection traceability"],
    guide: {
      prerequisites: ["Basic intel feed concepts", "Detection query fundamentals", "SOC triage process"],
      coreConcepts: ["IOC confidence scoring", "Behavior vs indicator detections", "Detection lifecycle governance"],
      practiceDrills: ["Run one IOC validation exercise", "Create ATT&CK mapping for a campaign", "Tune one noisy intel-based rule"],
      selfCheck: ["Can you justify why this IOC belongs in production detections?", "Can you explain rule quality and expected false positives?"]
    },
    explainer: {
      what: "This section teaches how to turn raw threat intel into useful detections and SOC decisions.",
      why: "Unfiltered intel causes alert fatigue. Strong engineering converts intel into high-confidence operational value.",
      how: ["Validate IOC quality first.", "Prefer behavior-linked detections when possible.", "Continuously review and retire stale indicators."],
      success: "You succeed when detections catch relevant threats without flooding analysts with low-value alerts."
    },
    plainEnglish: [
      "Not every IOC should become an alert.",
      "Use threat intel to improve detection quality, not noise.",
      "Measure whether intel-driven rules actually help triage."
    ]
  },
  "palo-alto-firewall-operations": {
    navLabel: "Palo Alto",
    title: "Palo Alto Firewall Operations: Policy, Threat Prevention, and SOC Integration",
    readingTime: "68 minutes",
    overview:
      "This section focuses on Palo Alto operational depth: App-ID/User-ID policy design, threat prevention profiles, URL filtering, NAT interactions, and log-driven investigation workflows.",
    architecture:
      "Structure controls with least-privilege policy zones, explicit service/app constraints, and profile-based protection tied to logging and SOC response.",
    handsOn: [
      "Build one deny-by-default rule set with documented exception governance.",
      "Tune threat prevention profiles for malware/C2 visibility.",
      "Correlate firewall logs with SIEM detections for incident scoping.",
      "Validate policy and profile impact using controlled traffic tests."
    ],
    tools: ["Palo Alto NGFW", "Panorama", "SIEM", "Ticketing"],
    outcomes: ["Higher confidence firewall policy hygiene", "Faster network incident investigation", "Reduced lateral movement risk"],
    guide: {
      prerequisites: ["Firewall zone concepts", "Basic routing/NAT", "SOC log triage basics"],
      coreConcepts: ["App-ID and policy granularity", "Threat profile strategy", "Log-driven response"],
      practiceDrills: ["Create one controlled policy migration", "Analyze denied vs allowed suspicious flow", "Document firewall incident workflow"],
      selfCheck: ["Can you defend why a rule exists and who owns it?", "Can you investigate suspicious traffic with full context?"]
    },
    explainer: {
      what: "This section covers practical Palo Alto operations for prevention and investigation.",
      why: "Firewall quality directly impacts blast radius and incident response speed.",
      how: ["Design clear zone policies.", "Apply profile-based protections consistently.", "Use logs as incident evidence, not just counters."],
      success: "You succeed when policies are precise, exceptions are governed, and investigations are faster and clearer."
    },
    plainEnglish: [
      "Use Palo Alto rules to tightly control who can talk to what.",
      "Profiles catch known bad behavior while logs tell the story.",
      "Every exception should have an owner and end date."
    ],
    deepContent: `
<div class="deep-content">
  <h3>App-ID: Application-Layer Traffic Classification</h3>
  <p>Palo Alto's App-ID engine identifies applications before applying security policy. Classification happens in a multi-phase pipeline — not purely by port. This is why App-ID policies are significantly more precise than traditional port-based ACLs.</p>
  <h4>App-ID Classification Pipeline</h4>
  <ol>
    <li><strong>Session setup and port check</strong> — Packet headers are evaluated. Well-known ports trigger an initial application guess but this is not final.</li>
    <li><strong>Signature matching</strong> — The decoder matches packet payload against known application signatures. This catches most standard apps immediately.</li>
    <li><strong>Protocol decoding</strong> — For complex or tunneled protocols, the decoder parses protocol structure to identify the real application (e.g., HTTP carrying something else).</li>
    <li><strong>Heuristic and behavioral analysis</strong> — Traffic that evades signature and decoding is evaluated against behavioral patterns. Remaining unknowns are classified as unknown-tcp or unknown-udp until additional packets arrive.</li>
  </ol>
  <p><strong>App-ID content updates</strong> ship from Palo Alto Networks and add new application signatures. Updates should be applied on a tested schedule — validate against existing policy before auto-enabling in production.</p>
  <p><strong>Application Override</strong> lets you bypass App-ID for specific traffic and assign a custom app label. Use this sparingly (usually for in-house or encrypted applications that App-ID cannot decode). Overriding disables threat inspection on that flow.</p>

  <h3>User-ID: Mapping Traffic to Identities</h3>
  <p>User-ID associates IP addresses with Active Directory (or LDAP) usernames so policies can be written against groups and individuals rather than subnets alone. Without User-ID, you are writing IP-based policy that breaks whenever DHCP reassigns addresses.</p>
  <h4>User Mapping Methods</h4>
  <table class="deep-table">
    <thead><tr><th>Method</th><th>How it Works</th><th>Best Use</th></tr></thead>
    <tbody>
      <tr><td>Windows Security Log (WinRM)</td><td>Firewall polls DCs for login events (4768, 4769, 4770)</td><td>Standard AD environments</td></tr>
      <tr><td>Syslog from DC</td><td>DC pushes login events to firewall syslog listener</td><td>High-volume or large DC fleets</td></tr>
      <tr><td>GlobalProtect agent</td><td>GP client reports user on connect — most accurate</td><td>Remote/endpoint-centric environments</td></tr>
      <tr><td>XML API</td><td>External system pushes user-to-IP mappings via REST</td><td>Custom identity sources (NAC, VDI, MDM)</td></tr>
      <tr><td>Captive Portal</td><td>Unauthenticated browser session prompt</td><td>Guest networks, BYOD zones</td></tr>
      <tr><td>Terminal Services Agent</td><td>Runs on Citrix/RDS server to map per-user sessions on shared IP</td><td>VDI environments where many users share one server IP</td></tr>
    </tbody>
  </table>
  <p><strong>Shared IP problem:</strong> NAT environments, VDI farms, and proxy servers cause multiple users to map to one IP. The Terminal Services Agent solves this for Citrix/RDS. For NAT scenarios, ensure subnet-level rules handle the aggregate correctly, or deploy GP to authenticated endpoints.</p>

  <h3>Zone Architecture and Trust Levels</h3>
  <p>Security zones are the foundational building block of Palo Alto policy. Every interface is assigned to a zone and all policy is zone-pair based. Zones should map to trust levels — not just network segments.</p>
  <table class="deep-table">
    <thead><tr><th>Zone</th><th>Trust Level</th><th>Typical Members</th><th>Default Policy</th></tr></thead>
    <tbody>
      <tr><td>Untrust</td><td>Zero</td><td>Internet-facing interfaces</td><td>Deny all inbound</td></tr>
      <tr><td>DMZ</td><td>Low</td><td>Web servers, jump hosts, reverse proxies</td><td>Allow specific inbound, no lateral</td></tr>
      <tr><td>Trust</td><td>Medium</td><td>Corporate desktops, general workstations</td><td>Allow selected outbound, deny server reach</td></tr>
      <tr><td>Server</td><td>High sensitivity</td><td>DB servers, AD controllers, internal APIs</td><td>Allow only from known service IPs</td></tr>
      <tr><td>Management</td><td>Restricted</td><td>Firewall management interfaces</td><td>Allow only from admin VLAN</td></tr>
    </tbody>
  </table>
  <p><strong>Zone Protection Profiles</strong> are applied per-zone and defend against reconnaissance and flood attacks at the zone boundary: SYN flood protection (cookies/random early drop), UDP/ICMP flood limits, port scan and host sweep detection, and protocol anomaly enforcement.</p>

  <h3>Security Policy Processing Order</h3>
  <p>Policy rules are evaluated top-to-bottom on first match. This has significant operational implications:</p>
  <ul>
    <li><strong>First match wins:</strong> More specific rules must appear above broader rules or they are shadowed.</li>
    <li><strong>Shadow rules:</strong> A broad allow-all above a specific deny means the deny is never reached. Palo Alto's Security Policy Optimizer flags these.</li>
    <li><strong>Cleanup rule:</strong> Define an explicit deny-all at the bottom of each zone-pair with logging enabled. This captures all unmatched flows and gives you visibility into unexpected traffic rather than relying on implicit deny.</li>
    <li><strong>Hit count analysis:</strong> Rules with zero hits over 90+ days are candidates for removal, not retention. Unused rules expand attack surface without operational value.</li>
    <li><strong>Intrazone vs interzone defaults:</strong> Intrazone traffic (within same zone) is allowed by default. Interzone traffic (between zones) is denied by default. Override both explicitly in production.</li>
  </ul>

  <h3>Threat Prevention Profiles Deep Dive</h3>
  <p>Profiles are attached to security rules and define what inspection runs on matching traffic. You must attach profiles to rules — they do not apply globally by default.</p>
  <h4>Antivirus Profile</h4>
  <ul>
    <li>Scans file transfers across HTTP, FTP, SMTP, SMB, and other protocols</li>
    <li><strong>WildFire inline ML</strong> performs real-time analysis on unknown PE files and documents without requiring a WildFire cloud submission — critical for air-gapped or latency-sensitive environments</li>
    <li>File type control lets you block specific MIME types and file extensions entirely (e.g., block .exe downloads from Untrust to Trust)</li>
    <li>Decoder actions: alert, block, drop, reset-both — set malware action to block/reset-both in production</li>
  </ul>
  <h4>Anti-Spyware Profile (C2 and Exfiltration)</h4>
  <ul>
    <li>Detects command-and-control (C2) communication patterns, DNS tunneling, and data exfiltration signatures</li>
    <li><strong>DNS Sinkhole:</strong> When a client resolves a known-malicious domain, the firewall returns a sinkhole IP you control. The infected client's subsequent connection to the sinkhole IP is logged and triggers an alert — providing a reliable C2 identification mechanism without blocking DNS lookup visibility</li>
    <li>Severity-based actions: critical/high should be block or reset-client; informational/low can alert for tuning</li>
    <li>Exceptions allow you to tune noisy signatures without disabling the profile entirely</li>
  </ul>
  <h4>Vulnerability Protection Profile</h4>
  <ul>
    <li>Inspects for exploit attempts against known CVEs in services protected by the firewall</li>
    <li>Critical severity: reset-both or drop-packet to immediately terminate exploit sessions</li>
    <li><strong>Brute force protection:</strong> Signature categories include authentication brute force patterns — configure rate-based actions to block source IPs after threshold</li>
    <li><strong>Packet capture:</strong> Enable pcap on critical signatures to capture the actual exploit payload for forensic evidence. Set to single-packet or extended-capture based on storage capacity</li>
  </ul>

  <h3>WildFire: Cloud Sandboxing Integration</h3>
  <p>WildFire submits unknown files to Palo Alto's cloud sandbox (or an on-prem WF-500 appliance) for dynamic and static analysis. A verdict (benign, malware, grayware, phishing) is returned and converted to a signature update within minutes.</p>
  <ul>
    <li>Enable WildFire forwarding in the Antivirus profile and WildFire Analysis profile</li>
    <li>File size limits and file types control what is submitted — focus on executables, PDFs, Office docs, and scripts</li>
    <li>WildFire logs appear in the Monitor section and can be forwarded to SIEM for correlation</li>
    <li>Verdict updates push globally — a file flagged malware by one customer becomes a signature for all subscribers within minutes</li>
  </ul>

  <h3>Panorama: Centralized Management</h3>
  <p>Panorama provides a centralized management plane for multi-firewall environments. It introduces two key hierarchy constructs:</p>
  <h4>Device Groups</h4>
  <p>Device Groups organize firewalls that share policy. Policy within a Device Group has pre-rules (enforced before device-local rules) and post-rules (enforced after). Local firewall rules sit in between. This creates a hierarchy: Panorama pre-rule &gt; Device Group pre-rule &gt; Local rule &gt; Device Group post-rule &gt; Panorama post-rule.</p>
  <h4>Templates</h4>
  <p>Templates push network and device configuration (zone definitions, interface settings, routing, server profiles) to managed firewalls. Template Stacks allow you to layer multiple templates for shared + site-specific configurations.</p>
  <h4>Commit Discipline</h4>
  <ul>
    <li><strong>Commit</strong> saves candidate config to Panorama's running config</li>
    <li><strong>Commit and Push</strong> propagates changes to managed firewalls — always verify affected Device Groups before pushing</li>
    <li>Use commit validation before push to catch policy errors</li>
    <li>Panorama log forwarding aggregation: configure Log Collector groups to ensure centralized log retention for all managed firewalls</li>
  </ul>

  <h3>SSL/TLS Decryption</h3>
  <p>Without decryption, HTTPS traffic is opaque to threat inspection. App-ID and threat profiles cannot inspect encrypted payloads. Decryption is essential for meaningful detection in modern environments.</p>
  <h4>Forward Proxy (Outbound)</h4>
  <p>The firewall acts as a man-in-the-middle for outbound user traffic. It presents a re-signed certificate (signed by your CA, trusted by endpoints). Requires deploying the firewall CA cert to all endpoints via GPO or MDM.</p>
  <h4>Inbound Inspection</h4>
  <p>Used to inspect traffic destined for internal servers (e.g., web servers in DMZ). The server's private key is installed on the firewall. No client certificate deployment required.</p>
  <h4>Decryption Bypass</h4>
  <p>Certain traffic should not be decrypted: banking sites, medical portals, certificate-pinning apps. Use a Decryption Profile with a URL-category-based bypass list. Bypassed flows still benefit from App-ID but not content inspection.</p>
  <p><strong>Certificate validation:</strong> Enforce blocking of expired, untrusted, and self-signed certificates in the Decryption Profile — this prevents attackers from using invalid certs to avoid inspection.</p>

  <h3>Log Investigation: Types and CLI Queries</h3>
  <p>Palo Alto logs are organized by type. Each type serves a distinct investigation purpose:</p>
  <table class="deep-table">
    <thead><tr><th>Log Type</th><th>Purpose</th><th>Key Fields</th></tr></thead>
    <tbody>
      <tr><td>Traffic</td><td>All allowed and denied sessions</td><td>src/dst IP, app, rule, bytes, action, session ID</td></tr>
      <tr><td>Threat</td><td>Threat prevention hits (AV, vuln, spyware, URL)</td><td>threat-id, signature name, action, pcap-id</td></tr>
      <tr><td>URL Filtering</td><td>Web request visibility and category enforcement</td><td>URL, category, action, user</td></tr>
      <tr><td>WildFire</td><td>File submission verdicts and analysis results</td><td>file-name, sha256, verdict, src user</td></tr>
      <tr><td>Data</td><td>Data pattern matches (DLP patterns, file transfer)</td><td>data-pattern-name, direction, user</td></tr>
      <tr><td>Authentication</td><td>Captive portal, GlobalProtect auth events</td><td>user, src-ip, status, factor</td></tr>
    </tbody>
  </table>
  <h4>CLI Log Queries</h4>
  <pre><code># Show last 20 threat log entries
show log threat direction equal backward

# Filter traffic logs for a specific source IP
show log traffic source-address equal 10.1.2.50

# Show WildFire logs for malware verdicts
show log wildfire verdict equal malware

# Filter URL logs by user and blocked category
show log url srcuser equal DOMAIN\\username action equal block

# Show denied sessions in traffic log
show log traffic action equal deny</code></pre>

  <h3>GlobalProtect and HIP Checks</h3>
  <p>GlobalProtect extends firewall policy to remote and mobile endpoints by creating an always-on VPN tunnel back to an internal or cloud gateway.</p>
  <h4>Host Information Profile (HIP) Checks</h4>
  <p>HIP lets the firewall enforce endpoint posture as a condition for network access. The GP agent reports endpoint state and the gateway applies HIP-based rules:</p>
  <ul>
    <li><strong>Disk encryption:</strong> Require FileVault (macOS) or BitLocker (Windows) to be active before granting access to sensitive zones</li>
    <li><strong>OS patch level:</strong> Block devices more than N days behind on patches from reaching restricted servers</li>
    <li><strong>EDR agent presence:</strong> Verify a specific endpoint agent (CrowdStrike, SentinelOne, Cortex XDR) is running and active</li>
    <li><strong>Domain membership:</strong> Restrict access to corp-managed devices for privileged network zones</li>
    <li><strong>Antivirus definition age:</strong> Ensure AV definitions are current within a defined threshold</li>
  </ul>
  <h4>Split Tunneling</h4>
  <p>Split tunneling allows some traffic to route through the VPN while other traffic (e.g., streaming, SaaS) goes direct-to-internet. Configure include/exclude routes carefully to avoid bypassing threat inspection for business-critical SaaS apps. App-based split tunnel lets you specify which apps route inside vs outside the tunnel.</p>
  <h4>Multiple Gateways</h4>
  <p>Deploy multiple GP gateways in different regions for latency optimization. Clients automatically select the closest gateway based on latency probing. Use internal gateways for on-prem users and external gateways for remote workers.</p>
</div>`
  },
  "checkpoint-and-firewall-technologies": {
    navLabel: "Checkpoint & Firewall Tech",
    title: "Checkpoint and Firewall Technologies: Core Operations and Governance",
    readingTime: "62 minutes",
    overview:
      "This section addresses Checkpoint and broader firewall technologies requirements: rulebase governance, change management, policy lifecycle, and audit evidence practices.",
    architecture:
      "Use a policy lifecycle model: request -> risk review -> staged deployment -> validation -> periodic recertification -> retirement.",
    handsOn: [
      "Review and clean stale rules with owner and usage data.",
      "Implement change template for firewall approvals and rollback.",
      "Define quarterly recertification process for privileged rules.",
      "Produce audit packet showing policy intent, approval, and validation evidence."
    ],
    tools: ["Checkpoint", "Firewall Manager", "Change management", "Audit tooling"],
    outcomes: ["Governed firewall change process", "Reduced stale-risk surface", "Audit-ready policy traceability"],
    guide: {
      prerequisites: ["Firewall processing order basics", "Change control fundamentals", "Network path visibility"],
      coreConcepts: ["Policy lifecycle governance", "Rule recertification", "Risk-aligned exceptions"],
      practiceDrills: ["Run stale-rule cleanup simulation", "Build firewall change approval checklist", "Create quarterly policy review matrix"],
      selfCheck: ["Can you prove rule necessity with evidence?", "Can you show policy governance in an audit?" ]
    },
    explainer: {
      what: "This section teaches disciplined firewall operations with governance, not ad hoc rule growth.",
      why: "Unmanaged firewall policies become hidden risk and operational drag.",
      how: ["Track ownership for every rule.", "Require validation for every change.", "Retire unused rules on a schedule."],
      success: "You succeed when rulebases stay clean, change risk is controlled, and audits are straightforward."
    },
    plainEnglish: [
      "Firewall rules should be intentional, not historical leftovers.",
      "Every change needs review, test, and rollback planning.",
      "Good governance keeps policies secure and maintainable."
    ],
    deepContent: `
<div class="deep-content">
  <h3>Firewall Policy Lifecycle</h3>
  <div class="flow-steps">
    <div class="flow-step"><div class="flow-step-num">1</div><div class="flow-step-body"><strong>Request:</strong> Ticket submitted with business justification, source/destination, ports, protocol, and owner. Every rule needs a business reason.</div></div>
    <div class="flow-step"><div class="flow-step-num">2</div><div class="flow-step-body"><strong>Risk Review:</strong> Security team assesses: Does this create attack surface? Are there compensating controls? Could it be narrowed further?</div></div>
    <div class="flow-step"><div class="flow-step-num">3</div><div class="flow-step-body"><strong>Staged Deployment:</strong> Apply to lowest-risk environment first. Test for 48hrs. Monitor for unexpected traffic patterns before production deploy.</div></div>
    <div class="flow-step"><div class="flow-step-num">4</div><div class="flow-step-body"><strong>Validation:</strong> Requester confirms traffic works as expected. Security confirms no unintended access created. Document test results in ticket.</div></div>
    <div class="flow-step"><div class="flow-step-num">5</div><div class="flow-step-body"><strong>Quarterly Recertification:</strong> Rule owner reviews and re-approves or decommissions. Rules without active owner are flagged for removal.</div></div>
    <div class="flow-step"><div class="flow-step-num">6</div><div class="flow-step-body"><strong>Retirement:</strong> Rule disabled (logged) → monitored 30 days for complaints → permanently removed → audit trail preserved.</div></div>
  </div>

  <h3>Checkpoint SmartConsole Key Concepts</h3>
  <table class="deep-table">
    <thead><tr><th>Concept</th><th>Description</th><th>Operational Use</th></tr></thead>
    <tbody>
      <tr><td><strong>Security Policy</strong></td><td>Named collection of rulebase, threat prevention, and NAT rules</td><td>Separate policies per zone: corporate, DMZ, VPN</td></tr>
      <tr><td><strong>Access Control Policy</strong></td><td>Traffic allow/deny decisions based on source, dest, service, app</td><td>Order matters — first match wins; cleanup rule last</td></tr>
      <tr><td><strong>Threat Prevention</strong></td><td>IPS, anti-bot, anti-virus, sandboxing profiles applied per rule</td><td>Tune profiles — Prevent mode for Critical, Detect for Low</td></tr>
      <tr><td><strong>SmartLog</strong></td><td>Centralized log aggregation and search for all Checkpoint firewalls</td><td>Query: action=Drop src=suspicious_ip — correlate with SIEM</td></tr>
      <tr><td><strong>Policy Install</strong></td><td>Propagates policy from Management Server to gateway(s)</td><td>Track install history for change audit trail</td></tr>
    </tbody>
  </table>

  <h3>Firewall Rule Cleanup Cheat Sheet</h3>
  <div class="cheat-sheet">
    <h5>Stale Rule Identification Process</h5>
    <div class="cmd-row"><span class="cmd">Step 1: Pull hit count data for all rules over 90 days</span><span class="cmd-desc">Identify rules with zero hits — candidates for removal</span></div>
    <div class="cmd-row"><span class="cmd">Step 2: Contact rule owner (ticket ref or last modifier)</span><span class="cmd-desc">Confirm business need — rule may be used intermittently (e.g., DR only)</span></div>
    <div class="cmd-row"><span class="cmd">Step 3: Disable (not delete) and monitor for 30 days</span><span class="cmd-desc">If no complaints → safe to remove; if complaints → re-enable and investigate</span></div>
    <div class="cmd-row"><span class="cmd">Step 4: Remove duplicate rules</span><span class="cmd-desc">Shadowed rules (never reached due to earlier match) should be identified and eliminated</span></div>
    <div class="cmd-row"><span class="cmd">Step 5: Tighten over-permissive rules</span><span class="cmd-desc">"any" source rules — narrow to specific IPs/ranges where possible</span></div>
  </div>

  <div class="visual-tip">
    <strong>Audit Evidence Package:</strong> For each firewall rule set, maintain a document showing: rule intent (what business process it supports), approval history (ticket numbers, approver, date), last validation (test results), and recertification record (who reviewed, when). This is what auditors ask for under PCI DSS Requirement 1.
  </div>

  <div class="visual-warning">
    <strong>Firewall Governance Risks:</strong><br/>
    ✗ Permanent emergency rules with no expiry date<br/>
    ✗ No ownership metadata for legacy rules in production<br/>
    ✗ Rule recertification skipped due to operational pressure<br/>
    ✓ Enforce ticket linkage and expiry controls for all exception rules
  </div>

  <div class="visual-card-grid">
    <div class="visual-card">
      <h5>Quarterly Firewall Governance Checklist</h5>
      <ul>
        <li>Rules with no owner: 0 target</li>
        <li>Rules with no hits in 90 days: review/remove</li>
        <li>Emergency rules without expiry: blocked</li>
        <li>Recertification completion target: &gt;95%</li>
      </ul>
    </div>
  </div>

  <div class="resource-links">
    <a class="resource-link" href="https://supportcenter.checkpoint.com/" target="_blank">Checkpoint Support Center</a>
    <a class="resource-link" href="https://attack.mitre.org/datasources/DS0017/" target="_blank">MITRE ATT&CK — Firewall Data Source</a>
    <a class="resource-link" href="https://www.pcisecuritystandards.org/" target="_blank">PCI DSS — Firewall Requirements (Requirement 1)</a>
  </div>
</div>`
  },
  "atlassian-jira-confluence-security-workflows": {
    navLabel: "Jira & Confluence",
    title: "Atlassian Security Workflows: Jira and Confluence for SOC Execution",
    readingTime: "55 minutes",
    overview:
      "This section operationalizes Jira and Confluence for security teams: incident tracking, vulnerability workflows, evidence management, runbook versioning, and audit-ready documentation.",
    architecture:
      "Create linked workflows: detection/case ticket in Jira -> investigation notes and artifacts -> Confluence runbook updates -> closure metrics and retrospectives.",
    handsOn: [
      "Build Jira incident issue type with severity, owner, SLA, and evidence fields.",
      "Create Confluence playbook templates for triage, containment, and post-incident review.",
      "Map vulnerability ticket lifecycle from discovery to verified closure.",
      "Create dashboard for SLA breaches and recurring issue categories."
    ],
    tools: ["Jira", "Confluence", "SIEM/EDR integrations", "Automation rules"],
    outcomes: ["Faster cross-team coordination", "Consistent evidence capture", "Improved audit and postmortem quality"],
    guide: {
      prerequisites: ["Issue lifecycle concepts", "Incident process familiarity", "Documentation discipline"],
      coreConcepts: ["Case management structure", "Knowledge base integrity", "SLA and ownership visibility"],
      practiceDrills: ["Build one complete incident template", "Create one runbook with decision points", "Track one KPI in dashboard"],
      selfCheck: ["Can responders execute from docs without ambiguity?", "Can leadership view risk and status quickly?"]
    },
    explainer: {
      what: "This section teaches how to use Atlassian tools as operational security infrastructure, not just ticket notes.",
      why: "Strong workflows reduce confusion, speed response, and improve audit outcomes.",
      how: ["Standardize ticket fields and SLAs.", "Use reusable runbook templates.", "Close loop with metrics and retrospectives."],
      success: "You succeed when teams collaborate faster and evidence quality improves across incidents and audits."
    },
    plainEnglish: [
      "Jira tracks the work; Confluence explains how to do the work.",
      "Clear templates reduce on-call confusion.",
      "Good documentation is a security control, not busywork."
    ],
    deepContent: `
<div class="deep-content">
  <h3>Jira Incident Issue Type: Recommended Fields</h3>
  <table class="deep-table">
    <thead><tr><th>Field</th><th>Type</th><th>Purpose</th><th>Required?</th></tr></thead>
    <tbody>
      <tr><td><strong>Severity</strong></td><td>Dropdown: Critical/High/Medium/Low</td><td>Drives SLA timer and escalation routing</td><td>Yes</td></tr>
      <tr><td><strong>Incident Lead</strong></td><td>User picker</td><td>Single owner accountable for closure</td><td>Yes</td></tr>
      <tr><td><strong>SLA Due Date</strong></td><td>Auto-calculated from Create date + Severity SLA</td><td>Visible countdown; breached = manager alert</td><td>Auto</td></tr>
      <tr><td><strong>Affected Systems</strong></td><td>Multi-text</td><td>List of impacted devices/services/users</td><td>Yes</td></tr>
      <tr><td><strong>Evidence Links</strong></td><td>URL array</td><td>Links to screenshots, SIEM queries, Confluence runbook page</td><td>Recommended</td></tr>
      <tr><td><strong>Root Cause</strong></td><td>Long text</td><td>Filled at closure; required for postmortem trigger</td><td>On closure</td></tr>
      <tr><td><strong>Regulatory Scope</strong></td><td>Checkbox: GDPR / HIPAA / PCI / None</td><td>Triggers legal notification workflow if checked</td><td>Yes</td></tr>
    </tbody>
  </table>

  <h3>Confluence Security Runbook Template Structure</h3>
  <div class="cheat-sheet">
    <h5>Standard Runbook Page Sections</h5>
    <div class="cmd-row"><span class="cmd">Section 1: Objective</span><span class="cmd-desc">One sentence: what does this runbook handle? (e.g., "Phishing report triage and containment")</span></div>
    <div class="cmd-row"><span class="cmd">Section 2: Triggering Conditions</span><span class="cmd-desc">What alert, ticket type, or event triggers this runbook?</span></div>
    <div class="cmd-row"><span class="cmd">Section 3: Decision Tree</span><span class="cmd-desc">Flowchart or numbered steps with conditional branches (If X, do Y; if Z, do W)</span></div>
    <div class="cmd-row"><span class="cmd">Section 4: Required Tools &amp; Access</span><span class="cmd-desc">List tools and permissions needed before starting (SIEM access, EDR console, firewall console)</span></div>
    <div class="cmd-row"><span class="cmd">Section 5: Evidence Collection Checklist</span><span class="cmd-desc">What to capture and where to store it during the incident</span></div>
    <div class="cmd-row"><span class="cmd">Section 6: Escalation Criteria</span><span class="cmd-desc">Exactly when to escalate and to whom (with contact info)</span></div>
    <div class="cmd-row"><span class="cmd">Section 7: Closure Requirements</span><span class="cmd-desc">What must be documented before closing the ticket? What proof of resolution is needed?</span></div>
  </div>

  <h3>Vulnerability Management Ticket Lifecycle</h3>
  <div class="flow-steps">
    <div class="flow-step"><div class="flow-step-num">1</div><div class="flow-step-body"><strong>Auto-creation:</strong> Vuln scanner sends finding to Jira via webhook. Ticket pre-populated with CVE, CVSS, affected asset, SLA due date based on severity.</div></div>
    <div class="flow-step"><div class="flow-step-num">2</div><div class="flow-step-body"><strong>Triage:</strong> Security analyst validates finding (FP/TP?), records compensating control notes if applicable, and assigns to remediation team.</div></div>
    <div class="flow-step"><div class="flow-step-num">3</div><div class="flow-step-body"><strong>Remediation:</strong> Assigned team patches or mitigates. Comments document what was done, patch version, date, and any issues encountered.</div></div>
    <div class="flow-step"><div class="flow-step-num">4</div><div class="flow-step-body"><strong>Validation:</strong> Security team re-scans and posts evidence of remediation (scan report, screenshot) as attachment to ticket.</div></div>
    <div class="flow-step"><div class="flow-step-num">5</div><div class="flow-step-body"><strong>Sign-off &amp; Close:</strong> Security analyst marks Resolved. SLA compliance recorded automatically. Closed tickets feed into metrics dashboard.</div></div>
  </div>

  <div class="visual-tip">
    <strong>Jira Automation Rules for Security Teams:</strong> Set up automation rules for: (1) SLA breach warning — notify owner 2 days before SLA expires; (2) Stale ticket escalation — if no update in 5 days, notify manager; (3) Regulatory trigger — if "GDPR" checkbox ticked, auto-add legal team to watchers.
  </div>

  <div class="visual-warning">
    <strong>Workflow Hygiene Risks:</strong><br/>
    ✗ Tickets closed without evidence links or closure rationale<br/>
    ✗ Runbook pages updated without version/date/owner metadata<br/>
    ✗ SLA fields left optional on critical incident types<br/>
    ✓ Enforce required fields and review templates quarterly
  </div>

  <div class="visual-card-grid">
    <div class="visual-card">
      <h5>Operational Documentation KPI Targets</h5>
      <ul>
        <li>Critical incidents with full evidence links: 100%</li>
        <li>Runbooks reviewed in last 90 days: &gt;90%</li>
        <li>SLA breach trend: decreasing quarter-over-quarter</li>
        <li>Postmortems completed within 5 business days: &gt;95%</li>
      </ul>
    </div>
  </div>

  <div class="resource-links">
    <a class="resource-link" href="https://support.atlassian.com/jira-software-cloud/" target="_blank">Jira Software Documentation</a>
    <a class="resource-link" href="https://support.atlassian.com/confluence-cloud/" target="_blank">Confluence Documentation</a>
    <a class="resource-link" href="https://www.atlassian.com/software/jira/security" target="_blank">Atlassian Security Resources</a>
  </div>
</div>`
  },
  "xsoar-and-security-automation-platforms": {
    navLabel: "XSOAR Automation",
    title: "XSOAR and Security Orchestration Platforms: Playbooks and Automated Response",
    readingTime: "72 minutes",
    overview:
      "This section focuses on SOAR/XSOAR execution: building robust playbooks, human approval gates, enrichment pipelines, action safety controls, and measurable automation impact.",
    architecture:
      "Use layered automation: ingest alert -> enrich context -> decision branch -> optional containment action -> case update -> metrics capture.",
    handsOn: [
      "Build one triage enrichment playbook with confidence scoring.",
      "Implement approval gate before disruptive containment actions.",
      "Create rollback flow and failure-handling branch.",
      "Measure cycle-time reduction and error rates before/after automation."
    ],
    tools: ["XSOAR/SOAR platform", "SIEM", "EDR", "Threat intel", "Ticketing"],
    outcomes: ["Faster low-risk triage", "Safer automated actions", "Transparent automation governance"],
    guide: {
      prerequisites: ["API integration basics", "IR workflow understanding", "Script reliability fundamentals"],
      coreConcepts: ["Playbook branching", "Human-in-the-loop control", "Automation observability"],
      practiceDrills: ["Implement one enrichment-only workflow", "Add guarded containment action", "Publish automation KPI dashboard"],
      selfCheck: ["Can you explain why this step is automated?", "Can you safely recover from automation failure?"]
    },
    explainer: {
      what: "This section teaches how to automate security operations responsibly using SOAR platforms.",
      why: "Automation without controls creates fast mistakes. Controlled automation improves speed and consistency safely.",
      how: ["Automate enrichment first.", "Gate high-impact actions.", "Track outcomes and failure modes continuously."],
      success: "You succeed when automation reduces toil, preserves quality, and remains auditable and safe."
    },
    plainEnglish: [
      "Automate repetitive tasks, but keep risky actions gated.",
      "Every playbook needs clear success and failure paths.",
      "Measure whether automation truly helps analysts."
    ],
    deepContent: `
<div class="deep-content">
  <h3>SOAR Playbook Design Principles</h3>
  <div class="visual-card-grid">
    <div class="visual-card">
      <h5>Enrichment-Only Playbooks (Safe to Automate)</h5>
      <ul>
        <li>VirusTotal hash/IP/URL reputation lookup</li>
        <li>Threat intel feed IOC check</li>
        <li>User context lookup (HR system, CMDB)</li>
        <li>Geolocation of source IP</li>
      </ul>
    </div>
    <div class="visual-card">
      <h5>Notification Playbooks (Low Risk)</h5>
      <ul>
        <li>Slack/Teams/email alert to analyst team</li>
        <li>Jira ticket creation with enriched context</li>
        <li>User notification for suspicious activity</li>
        <li>Manager escalation for policy violation</li>
      </ul>
    </div>
    <div class="visual-card">
      <h5>Gated Action Playbooks (Require Approval)</h5>
      <ul>
        <li>Host isolation from network</li>
        <li>User account disable/password reset</li>
        <li>Firewall rule block for IP/domain</li>
        <li>Email quarantine or inbox wipe</li>
      </ul>
    </div>
  </div>

  <h3>Playbook Failure Handling Template</h3>
  <div class="code-block">
SOAR Playbook: Phishing Response Automation

TRIGGER: Email reported via phish button or SIEM alert

Step 1: ENRICH (automated)
  - Extract indicators: sender, reply-to, links, attachment hashes
  - VT lookup: attachment hash, URLs  
  - Domain age check: is sending domain <30 days old?
  - SPF/DKIM/DMARC check

Step 2: SCORE CONFIDENCE (automated)
  - High confidence (>8/10): Sender known malicious + attachment flagged + domain new
  - Medium (5-7): 2 of 3 factors
  - Low (<5): One factor; may be FP (marketing email, etc.)

Step 3: ACTION (conditional on score)
  - High: AUTO-quarantine message, create High Sev ticket, queue for analyst
  - Medium: Queue for analyst review with enrichment pre-filled
  - Low: Close as FP with note; escalate if analyst disagrees

Step 4: FAILURE HANDLING
  - If VT API fails: Log error, continue with available data, flag for manual enrichment
  - If quarantine fails: Alert analyst immediately; manual hold required
  - If any step exceeds timeout: Escalate to human analyst with all data so far

Step 5: METRICS CAPTURE
  - Log: Playbook name, alert ID, enrichment time, action taken, outcome
  - Weekly report: Automation rate, error rate, analyst time saved
  </div>

  <h3>SOAR Tool Comparison</h3>
  <table class="deep-table">
    <thead><tr><th>Platform</th><th>Strengths</th><th>Integration Ecosystem</th><th>Pricing Model</th></tr></thead>
    <tbody>
      <tr><td><strong>Palo Alto XSOAR</strong></td><td>Mature, 1000+ integrations, built-in SIEM</td><td>Deepest marketplace; Python-based integrations</td><td>Commercial; per-license</td></tr>
      <tr><td><strong>Splunk SOAR</strong></td><td>Native Splunk integration, visual playbook builder</td><td>Strong for Splunk-heavy environments</td><td>Commercial; bundled with Splunk</td></tr>
      <tr><td><strong>Microsoft Sentinel + Logic Apps</strong></td><td>Cloud-native, Azure-integrated, low code</td><td>Best for Microsoft ecosystem</td><td>Pay-per-run (Logic Apps)</td></tr>
      <tr><td><strong>IBM QRadar SOAR</strong></td><td>Good compliance workflow support, IBM ecosystem</td><td>Tight QRadar integration</td><td>Commercial</td></tr>
      <tr><td><strong>Shuffle (Open Source)</strong></td><td>Free, self-hosted, 400+ apps</td><td>Docker-based, community maintained</td><td>Free / Community</td></tr>
    </tbody>
  </table>

  <div class="resource-links">
    <a class="resource-link" href="https://xsoar.pan.dev/" target="_blank">XSOAR Developer Hub</a>
    <a class="resource-link" href="https://shuffler.io/" target="_blank">Shuffle — Open Source SOAR</a>
    <a class="resource-link" href="https://learn.microsoft.com/en-us/azure/sentinel/automation/" target="_blank">Microsoft Sentinel Automation</a>
  </div>
</div>`
  },
  "cloud-security-gcp-and-azure": {
    navLabel: "GCP & Azure Security",
    title: "Cloud Security Exposure: GCP and Azure Fundamentals for SOC Analysts",
    readingTime: "64 minutes",
    overview:
      "This section provides practical exposure to GCP and Azure security controls so analysts can investigate incidents and assess posture beyond AWS-only environments.",
    architecture:
      "Map equivalent control planes: identity, network segmentation, logging, workload security, and posture findings. Build cross-cloud investigation habits.",
    handsOn: [
      "Compare IAM privilege models across AWS, GCP, and Azure.",
      "Map logging sources to incident triage fields in each cloud.",
      "Investigate one sample cross-cloud suspicious access scenario.",
      "Create cloud-agnostic response checklist for identity abuse."
    ],
    tools: ["GCP Security Command Center", "Azure Defender/Sentinel integrations", "Cloud-native logs"],
    outcomes: ["Cross-cloud investigation readiness", "Shared mental model across providers", "Reduced blind spots in mixed environments"],
    guide: {
      prerequisites: ["Cloud IAM fundamentals", "Basic cloud networking", "SOC incident process"],
      coreConcepts: ["Cross-cloud control mapping", "Provider-specific telemetry", "Cloud incident workflow consistency"],
      practiceDrills: ["Build control-equivalency matrix", "Run identity compromise triage across providers", "Document cloud-specific caveats"],
      selfCheck: ["Can you map equivalent controls quickly?", "Can you investigate cloud incidents outside AWS?"]
    },
    explainer: {
      what: "This section builds confidence investigating and securing GCP/Azure environments alongside AWS.",
      why: "Most enterprises are multi-cloud. Analysts need cross-provider fluency to avoid blind spots.",
      how: ["Map equivalent controls first.", "Understand provider-specific telemetry differences.", "Use unified response process with cloud-specific adaptations."],
      success: "You succeed when cross-cloud incidents are handled with the same quality and speed as AWS incidents."
    },
    plainEnglish: [
      "Cloud providers differ, but core security concepts are similar.",
      "Learn what changes between AWS, GCP, and Azure during investigations.",
      "Use one consistent response mindset across all clouds."
    ],
    deepContent: `
<div class="deep-content">
  <h3>Cloud IAM Comparison: AWS vs GCP vs Azure</h3>
  <table class="deep-table">
    <thead><tr><th>Concept</th><th>AWS</th><th>GCP</th><th>Azure</th></tr></thead>
    <tbody>
      <tr><td><strong>Identity Model</strong></td><td>IAM Users, Roles, Groups</td><td>Google Accounts, Service Accounts, Groups</td><td>Azure AD Users, Service Principals, Managed Identities</td></tr>
      <tr><td><strong>Permission Assignment</strong></td><td>Policies attached to identities; resource-based policies on resources</td><td>IAM bindings on resource hierarchy (Org/Folder/Project)</td><td>Role Assignments at Scope (Management Group/Subscription/RG/Resource)</td></tr>
      <tr><td><strong>Least Privilege</strong></td><td>IAM Access Analyzer + permission boundaries</td><td>Predefined + custom roles; IAM Recommender</td><td>Azure AD PIM (Privileged Identity Management)</td></tr>
      <tr><td><strong>Cloud Audit Logs</strong></td><td>CloudTrail (API calls) + CloudWatch (metrics/logs)</td><td>Cloud Audit Logs (Admin Activity, Data Access, System Events)</td><td>Azure Activity Log + Azure Monitor + Defender for Cloud</td></tr>
      <tr><td><strong>Security Posture</strong></td><td>AWS Security Hub + Config</td><td>GCP Security Command Center (SCC)</td><td>Microsoft Defender for Cloud + Azure Policy</td></tr>
      <tr><td><strong>Network Security</strong></td><td>Security Groups, NACLs, VPC Flow Logs</td><td>VPC Firewall Rules, VPC Flow Logs</td><td>NSGs, Azure Firewall, Network Watcher</td></tr>
    </tbody>
  </table>

  <h3>Multi-Cloud Security Investigation Cheat Sheet</h3>
  <div class="cheat-sheet">
    <h5>First Questions for Any Cloud Incident</h5>
    <div class="cmd-row"><span class="cmd">Which account/project/subscription is affected?</span><span class="cmd-desc">AWS: Account ID | GCP: Project ID | Azure: Subscription ID</span></div>
    <div class="cmd-row"><span class="cmd">What principal (identity) made the suspicious action?</span><span class="cmd-desc">AWS: CloudTrail userIdentity.arn | GCP: principalEmail | Azure: caller in ActivityLog</span></div>
    <div class="cmd-row"><span class="cmd">What was the source IP?</span><span class="cmd-desc">All three: Check for TOR, VPN, or unusual geolocation</span></div>
    <div class="cmd-row"><span class="cmd">What API calls were made?</span><span class="cmd-desc">AWS: eventName | GCP: methodName | Azure: operationName</span></div>
    <div class="cmd-row"><span class="cmd">Were any privilege escalation actions taken?</span><span class="cmd-desc">AWS: AttachRolePolicy/CreateUser | GCP: setIamPolicy | Azure: roleAssignments/write</span></div>
    <div class="cmd-row"><span class="cmd">Were any resources created (C2 persistence)?</span><span class="cmd-desc">AWS: RunInstances | GCP: compute.instances.insert | Azure: virtualMachines/write</span></div>
  </div>

  <h3>GCP Security Command Center: Key Finding Types</h3>
  <div class="visual-card-grid">
    <div class="visual-card">
      <h5>Identity &amp; Access Findings</h5>
      <ul>
        <li>SERVICE_ACCOUNT_KEY_CREATED — new key outside automated process</li>
        <li>EXTERNAL_MEMBER — external identity added to project IAM</li>
        <li>KMS_KEY_ALL_USERS — encryption key accessible to all users</li>
        <li>PRIMITIVE_ROLES_USED — avoid owner/editor/viewer at project level</li>
      </ul>
    </div>
    <div class="visual-card">
      <h5>Network &amp; Data Findings</h5>
      <ul>
        <li>OPEN_FIREWALL_RULE — firewall allows 0.0.0.0/0 inbound</li>
        <li>PUBLIC_BUCKET_ACL — GCS bucket publicly accessible</li>
        <li>PUBLIC_SQL_INSTANCE — Cloud SQL accessible from internet</li>
        <li>FLOW_LOGS_DISABLED — VPC flow logs not enabled</li>
      </ul>
    </div>
  </div>

  <h3>Azure Defender for Cloud: Priority Actions</h3>
  <div class="code-block">
Azure Defender Recommendations (High Priority):
1. Enable MFA for accounts with owner permissions (reduces 99% of identity breach risk)
2. Remediate vulnerabilities in VMs (auto-assessment via Qualys/Defender built-in)
3. Restrict access to storage accounts from all networks (default deny + approved VNets)
4. Enable Azure Defender for SQL servers (detects SQL injection, unusual access patterns)
5. Enable diagnostic logging for Azure Key Vault
6. Ensure all VMs have endpoint protection (Defender for Endpoint)
7. Audit privileged access: Review service principals with Contributor/Owner roles
8. Enable just-in-time VM access (replaces always-open RDP/SSH management ports)
  </div>

  <div class="resource-links">
    <a class="resource-link" href="https://cloud.google.com/security/products/security-command-center" target="_blank">GCP Security Command Center</a>
    <a class="resource-link" href="https://learn.microsoft.com/en-us/azure/defender-for-cloud/" target="_blank">Microsoft Defender for Cloud Docs</a>
    <a class="resource-link" href="https://cloud.google.com/logging/docs/audit" target="_blank">GCP Cloud Audit Logs</a>
    <a class="resource-link" href="https://learn.microsoft.com/en-us/azure/azure-monitor/" target="_blank">Azure Monitor Documentation</a>
  </div>
</div>`
  },
  "security-scripting-programming-practice": {
    navLabel: "Security Scripting",
    title: "Security Scripting and Programming: Python, PowerShell, Bash, and Beyond",
    readingTime: "76 minutes",
    overview:
      "This section focuses on practical scripting for SOC and security engineering. It emphasizes small reliable automations, parsing telemetry, API integrations, and safe script deployment patterns.",
    architecture:
      "Use a simple engineering loop: define task -> script minimal solution -> validate output -> add error handling -> add logging -> operationalize with version control.",
    handsOn: [
      "Parse log files and extract IOC fields with Python and Bash.",
      "Write PowerShell script for endpoint compliance checks.",
      "Call SIEM or ticketing APIs and create normalized incident artifact output.",
      "Package script with README, sample input/output, and failure behavior notes."
    ],
    tools: ["Python", "PowerShell", "Bash", "Java", "C", "Ruby", "APIs", "Version control"],
    outcomes: ["Reduced manual toil", "Repeatable technical workflows", "Practical automation portfolio"],
    guide: {
      prerequisites: ["CLI fundamentals", "Basic loops/conditions/functions", "JSON parsing basics"],
      coreConcepts: ["Idempotency", "Input validation and error handling", "Operational logging"],
      practiceDrills: ["Build one log parser utility", "Build one SOC triage helper script", "Add tests for common failure cases"],
      selfCheck: ["Can someone else run your script safely?", "Does your script fail predictably with clear errors?"]
    },
    explainer: {
      what: "This section teaches practical coding for real security operations, not abstract programming exercises.",
      why: "Scripting multiplies analyst impact and unlocks reliable automation in daily workflows.",
      how: ["Solve one small operational problem at a time.", "Harden scripts for reliability and traceability.", "Document and measure workflow improvement."],
      success: "You succeed when scripts are reused by others and clearly reduce response or triage time."
    },
    plainEnglish: [
      "Write small scripts that solve real SOC pain points.",
      "Reliable scripts are better than clever but fragile scripts.",
      "Document your code so teammates can trust and reuse it."
    ],
    deepContent: `
<div class="deep-content">
  <h3>Python SOC Parsing Script Example</h3>
  <div class="code-block">
#!/usr/bin/env python3
import json
from pathlib import Path

INPUT_FILE = Path("events.jsonl")
OUTPUT_FILE = Path("suspicious_events.json")

SUSPICIOUS_PROCS = {"powershell.exe", "cmd.exe", "wscript.exe", "mshta.exe"}

def parse_events(path: Path):
    results = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        event = json.loads(line)
        proc = event.get("process_name", "").lower()
        cmd = event.get("command_line", "").lower()
        if proc in SUSPICIOUS_PROCS and any(flag in cmd for flag in ["-enc", "-nop", "downloadstring", "iex"]):
            results.append(
                {
                    "timestamp": event.get("timestamp"),
                    "host": event.get("hostname"),
                    "user": event.get("user"),
                    "process_name": proc,
                    "command_line": event.get("command_line"),
                    "risk_reason": "Suspicious scripting flags"
                }
            )
    return results

if __name__ == "__main__":
    matches = parse_events(INPUT_FILE)
    OUTPUT_FILE.write_text(json.dumps(matches, indent=2), encoding="utf-8")
    print(f"Found {len(matches)} suspicious events -> {OUTPUT_FILE}")
  </div>

  <h3>PowerShell Endpoint Check Script</h3>
  <div class="code-block">
# Endpoint baseline check: BitLocker + Defender + Firewall
$result = [ordered]@{}

$bitlocker = Get-BitLockerVolume -MountPoint "C:" -ErrorAction SilentlyContinue
$result.BitLockerEnabled = if ($bitlocker -and $bitlocker.ProtectionStatus -eq "On") { "Yes" } else { "No" }

$defender = Get-MpComputerStatus -ErrorAction SilentlyContinue
$result.DefenderRealtimeProtection = if ($defender.RealTimeProtectionEnabled) { "Enabled" } else { "Disabled" }
$result.DefenderSignatureAgeDays = if ($defender.AntispywareSignatureLastUpdated) {
    (New-TimeSpan -Start $defender.AntispywareSignatureLastUpdated -End (Get-Date)).Days
} else { "Unknown" }

$firewall = Get-NetFirewallProfile | Select-Object Name, Enabled
$result.FirewallProfiles = $firewall

$result | ConvertTo-Json -Depth 4 | Out-File -FilePath ".\endpoint_security_status.json" -Encoding utf8
Write-Host "Endpoint check complete -> endpoint_security_status.json"
  </div>

  <h3>Bash IOC Search Pipeline</h3>
  <div class="cheat-sheet">
    <h5>Fast IOC Hunt in Linux Logs</h5>
    <div class="cmd-row"><span class="cmd">grep -Rin "powershell\|cmd.exe\|mshta" /var/log/*</span><span class="cmd-desc">Find suspicious process names in logs</span></div>
    <div class="cmd-row"><span class="cmd">zgrep -Ein "(failed password|invalid user)" /var/log/auth.log*</span><span class="cmd-desc">Identify brute-force login attempts</span></div>
    <div class="cmd-row"><span class="cmd">jq -r '.source_ip' firewall.json | sort | uniq -c | sort -nr | head</span><span class="cmd-desc">Top source IPs from JSON firewall logs</span></div>
    <div class="cmd-row"><span class="cmd">awk '{print $1,$2,$3,$9}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head</span><span class="cmd-desc">Top HTTP request patterns</span></div>
  </div>

  <h3>Secure Scripting Principles</h3>
  <table class="deep-table">
    <thead><tr><th>Principle</th><th>Bad Pattern</th><th>Good Pattern</th></tr></thead>
    <tbody>
      <tr><td><strong>Input Validation</strong></td><td>Trust user-provided file paths or hostnames</td><td>Validate against allowlist and strict regex</td></tr>
      <tr><td><strong>Error Handling</strong></td><td>Silent failures or broad except blocks</td><td>Catch explicit exceptions and log actionable message</td></tr>
      <tr><td><strong>Secrets Management</strong></td><td>Hardcoded API tokens in source code</td><td>Read from env vars or secret manager</td></tr>
      <tr><td><strong>Idempotency</strong></td><td>Running script twice creates duplicate tickets</td><td>Check if object exists before create/update</td></tr>
      <tr><td><strong>Observability</strong></td><td>No logs or timestamps</td><td>Structured logging with correlation IDs</td></tr>
    </tbody>
  </table>

  <div class="visual-tip">
    <strong>Production Script Rollout Rule:</strong> Promote scripts through dev -> test -> prod with sample data replay and failure-mode tests. Require rollback instructions in README before production use.
  </div>

  <div class="resource-links">
    <a class="resource-link" href="https://docs.python.org/3/" target="_blank">Python Documentation</a>
    <a class="resource-link" href="https://learn.microsoft.com/en-us/powershell/" target="_blank">PowerShell Documentation</a>
    <a class="resource-link" href="https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/" target="_blank">OWASP Secure Coding Practices</a>
  </div>
</div>`
  },
  "certification-and-standards-roadmap": {
    navLabel: "Certs & Standards",
    title: "Certification and Standards Roadmap: CC, SSCP, Security+, GSEC, and Governance Alignment",
    readingTime: "58 minutes",
    overview:
      "This section helps you align certification study with practical security operations requirements and security standards. It prioritizes practical competency mapping rather than exam-only preparation.",
    architecture:
      "Map cert domains to operational evidence: incidents handled, detections written, cloud controls implemented, and governance artifacts produced.",
    handsOn: [
      "Create certification matrix: objective -> lab -> portfolio artifact.",
      "Map standards controls (NIST/ISO/CIS) to your current study sections.",
      "Build 12-week roadmap combining certifications with real hands-on deliverables.",
      "Document evidence for operational validation and continuous improvement."
    ],
    tools: ["Certification objectives", "NIST/CIS/ISO references", "Portfolio templates"],
    outcomes: ["Focused certification prep", "Reduced exam-study waste", "Stronger applied practical evidence"],
    guide: {
      prerequisites: ["Awareness of target role requirements", "Current skill baseline", "Time planning discipline"],
      coreConcepts: ["Exam-to-practice mapping", "Control-framework literacy", "Evidence-driven progression"],
      practiceDrills: ["Design 90-day cert + lab plan", "Link each domain to one artifact", "Run weekly competency retrospectives"],
      selfCheck: ["Can you demonstrate each domain in practice?", "Are you building applied evidence while studying?"]
    },
    explainer: {
      what: "This section aligns certifications and security standards to day-to-day operational capability.",
      why: "Certifications are strongest when paired with practical implementation and evidence.",
      how: ["Map domain objectives to hands-on labs.", "Track artifacts for each competency.", "Continuously align study with target role responsibilities."],
      success: "You succeed when cert progress directly strengthens your practical performance and portfolio."
    },
    plainEnglish: [
      "Use certifications to structure learning, not replace hands-on practice.",
      "Every cert topic should produce a real artifact you can show.",
      "Study smarter by tying exam prep to practical security skills."
    ],
    deepContent: `
<div class="deep-content">
  <h3>Certification-to-Practice Mapping Matrix</h3>
  <table class="deep-table">
    <thead><tr><th>Certification</th><th>Core Domain</th><th>Hands-On Lab</th><th>Portfolio Artifact</th></tr></thead>
    <tbody>
      <tr><td><strong>ISC2 CC</strong></td><td>Security Principles + Access Controls</td><td>Build IAM least-privilege matrix in lab</td><td>IAM role design document + screenshots</td></tr>
      <tr><td><strong>CompTIA Security+</strong></td><td>Threats, architecture, operations</td><td>Incident response tabletop and report</td><td>IR playbook + postmortem template</td></tr>
      <tr><td><strong>ISC2 SSCP</strong></td><td>Operational security administration</td><td>Vulnerability remediation cycle simulation</td><td>SLA tracking dashboard + closure evidence</td></tr>
      <tr><td><strong>GIAC GSEC</strong></td><td>Technical controls + hardening</td><td>Endpoint baseline hardening validation</td><td>Baseline checklist + script output reports</td></tr>
      <tr><td><strong>SC-200 (Microsoft)</strong></td><td>SIEM + SOAR operations</td><td>Build Sentinel detection + automation rule</td><td>KQL detections + playbook run logs</td></tr>
    </tbody>
  </table>

  <h3>12-Week Certification + Artifact Plan</h3>
  <div class="flow-steps">
    <div class="flow-step"><div class="flow-step-num">1-2</div><div class="flow-step-body"><strong>Baseline + Gap Assessment:</strong> Review role requirements and self-assess. Choose primary cert track and define two backup options.</div></div>
    <div class="flow-step"><div class="flow-step-num">3-4</div><div class="flow-step-body"><strong>Domain Study Block 1:</strong> Study two core domains. Build one practical lab aligned to each domain. Publish notes to portfolio repo.</div></div>
    <div class="flow-step"><div class="flow-step-num">5-6</div><div class="flow-step-body"><strong>Domain Study Block 2:</strong> Continue study + lab mapping. Add evidence: screenshots, scripts, and concise summaries.</div></div>
    <div class="flow-step"><div class="flow-step-num">7-8</div><div class="flow-step-body"><strong>Practice Test Cycle:</strong> Run timed practice exams. Analyze weak domains. Build targeted mini-labs to close gaps.</div></div>
    <div class="flow-step"><div class="flow-step-num">9-10</div><div class="flow-step-body"><strong>Integration Phase:</strong> Build one capstone that combines cert domains (for example: IAM + incident response + vulnerability management).</div></div>
    <div class="flow-step"><div class="flow-step-num">11-12</div><div class="flow-step-body"><strong>Exam + Portfolio Polish:</strong> Take exam. Clean up portfolio artifacts with concise executive summaries and standards mapping.</div></div>
  </div>

  <h3>Standards Alignment Cheat Sheet</h3>
  <div class="cheat-sheet">
    <h5>How to Map Study Topics to Framework Controls</h5>
    <div class="cmd-row"><span class="cmd">NIST CSF Identify (ID)</span><span class="cmd-desc">Asset inventory, governance, risk assessments</span></div>
    <div class="cmd-row"><span class="cmd">NIST CSF Protect (PR)</span><span class="cmd-desc">Identity management, endpoint hardening, awareness training</span></div>
    <div class="cmd-row"><span class="cmd">NIST CSF Detect (DE)</span><span class="cmd-desc">SIEM detection rules, telemetry quality, ATT&CK mapping</span></div>
    <div class="cmd-row"><span class="cmd">NIST CSF Respond (RS)</span><span class="cmd-desc">Incident response playbooks, communication plans, triage process</span></div>
    <div class="cmd-row"><span class="cmd">NIST CSF Recover (RC)</span><span class="cmd-desc">Backup validation, post-incident improvements, restoration testing</span></div>
    <div class="cmd-row"><span class="cmd">ISO 27001 Annex A</span><span class="cmd-desc">Control catalogue for policies, access, cryptography, operations, supplier security</span></div>
    <div class="cmd-row"><span class="cmd">CIS Controls v8</span><span class="cmd-desc">Prioritized technical safeguards (asset mgmt, secure config, continuous vuln mgmt)</span></div>
  </div>

  <div class="visual-tip">
    <strong>Certification ROI Strategy:</strong> For every 5 hours of exam study, spend at least 2 hours building evidence. Evidence-driven study improves interview performance because you can explain exactly how a concept works in an environment, not just recite definitions.
  </div>

  <div class="visual-warning">
    <strong>Certification Planning Mistakes:</strong><br/>
    ✗ Scheduling exam date before validating weak-domain readiness
    <br/>✗ Studying domains without creating matching practical artifacts
    <br/>✗ Ignoring standards mapping needed for enterprise role interviews
    <br/>✓ Tie each study week to one measurable deliverable and review checkpoint
  </div>

  <div class="visual-card-grid">
    <div class="visual-card">
      <h5>Weekly Progress Scorecard</h5>
      <ul>
        <li>Practice exam score trend: +5% every two weeks</li>
        <li>Artifacts produced per week: at least 1</li>
        <li>Standards-mapped deliverables: at least 1 per domain block</li>
        <li>Retrospective completion rate: 100%</li>
      </ul>
    </div>
  </div>

  <div class="resource-links">
    <a class="resource-link" href="https://www.isc2.org/Certifications/CC" target="_blank">ISC2 CC Certification Overview</a>
    <a class="resource-link" href="https://www.comptia.org/certifications/security" target="_blank">CompTIA Security+ Certification</a>
    <a class="resource-link" href="https://www.giac.org/certifications/security-essentials-gsec/" target="_blank">GIAC GSEC Certification</a>
    <a class="resource-link" href="https://csf.tools/" target="_blank">NIST CSF Mapping Tools</a>
    <a class="resource-link" href="https://www.cisecurity.org/controls/cis-controls-list" target="_blank">CIS Controls v8</a>
  </div>
</div>`
  }
};

function getAllStudyTopicIds() {
  return [...new Set([...Object.keys(studyGuides), ...Object.keys(extendedStudyModules)])];
}

function getStudyGuide(sectionId) {
  return studyGuides[sectionId] || extendedStudyModules[sectionId]?.guide || null;
}

const studyVisualMap = {
  default: "assets/study-mesh.svg",
  endpoint: "assets/hero-shield.svg",
  detection: "assets/case-siem-tuning.svg",
  incident: "assets/case-phishing-ir.svg",
  cloud: "assets/case-iam-escalation.svg",
  automation: "assets/labs-ops.svg",
  "aws-security-hub-and-detection": "assets/aws-security-hub.svg",
  "aws-cloud-security-engineering": "assets/aws-cloud-security.svg",
  "siem-tooling-platform-depth": "assets/siem-platforms.svg",
  "edr-and-edrm-operations": "assets/edr-operations.svg",
  "threat-intelligence-and-ioc-engineering": "assets/threat-intel-iocs.svg",
  "palo-alto-firewall-operations": "assets/palo-alto-firewall.svg",
  "checkpoint-and-firewall-technologies": "assets/firewall-governance.svg",
  "atlassian-jira-confluence-security-workflows": "assets/jira-confluence-security.svg",
  "xsoar-and-security-automation-platforms": "assets/xsoar-playbook.svg",
  "cloud-security-gcp-and-azure": "assets/multicloud-security.svg",
  "security-scripting-programming-practice": "assets/security-scripting.svg",
  "certification-and-standards-roadmap": "assets/certification-roadmap.svg"
};

const studyAppliedPlaybooks = {
  "endpoint-security": {
    category: "endpoint",
    scenarioTitle: "Real-Life Scenario: Ransomware Staging on a Sales Laptop",
    scenarioSummary: "A sales user clicks a malicious link while traveling. PowerShell launches from a browser child process, EDR flags suspicious script execution, and the device begins reaching out to newly observed domains over HTTPS.",
    situation: [
      "The user is remote and needs the laptop for a customer presentation in two hours.",
      "The SOC needs to balance fast containment with business continuity.",
      "The endpoint shows suspicious but not yet destructive behavior, so investigation speed matters."
    ],
    responseSteps: ["Validate alert lineage and command line", "Confirm whether credential theft or lateral movement has begun", "Isolate host and preserve evidence", "Reimage or remediate only after scope is understood"],
    helpfulTips: ["Look at parent-child process relationships before reacting to a single IOC.", "Check whether the same script hash appears elsewhere in the fleet.", "Document user actions and timestamps early; memory fades quickly after the call.", "Always verify that isolation still allows the response team to pull needed evidence."],
    artifacts: ["Process tree screenshot", "Hash and command-line evidence", "Containment decision log", "Post-remediation validation notes"],
    toolchain: ["EDR console", "PowerShell event logs", "SIEM correlation", "Jira incident ticket"],
    workflow: ["Alert", "Triage", "Contain", "Validate", "Recover"],
    metrics: ["Time to isolate host", "Number of related endpoints found", "False-positive vs true-positive decision speed"],
    analystNotes: "In real environments, endpoint work is rarely just about one machine. You are constantly judging whether you are dealing with a single compromised host, a phishing wave, or an early-stage broader intrusion."
  },
  "network-security": {
    category: "endpoint",
    scenarioTitle: "Real-Life Scenario: Flat VLAN Access Exposes Critical Server Segment",
    scenarioSummary: "An internal red-team exercise shows a compromised user workstation can reach file servers, legacy admin services, and domain controllers because historical firewall exceptions were never cleaned up.",
    situation: ["Operations teams depend on undocumented legacy flows.", "Security wants rapid segmentation but cannot trigger outages.", "Leadership wants proof that segmentation lowers breach impact."],
    responseSteps: ["Map real traffic and owners", "Define trust zones and deny-by-default target state", "Pilot controlled policy tightening", "Measure blocked unauthorized paths and business exceptions"],
    helpfulTips: ["Never start segmentation with a blind block list.", "Use flow data to identify which rules are truly in use.", "Tie exceptions to named owners and review dates.", "Prove success using reduced reachable assets, not just rule count."],
    artifacts: ["Traffic-flow map", "Zone matrix", "Exception register", "Post-change validation report"],
    toolchain: ["Firewall manager", "Flow logs", "DNS logs", "Change management ticket"],
    workflow: ["Discover", "Classify", "Restrict", "Validate", "Govern"],
    metrics: ["Unauthorized path reduction", "Exception count trend", "Change-induced outage count"],
    analystNotes: "Good network security work is half engineering and half stakeholder negotiation. The hardest part is often proving which traffic is still necessary."
  },
  "penetration-testing": {
    category: "incident",
    scenarioTitle: "Real-Life Scenario: External Pentest Reveals MFA Gap in Admin Portal",
    scenarioSummary: "A pentest finds that a rarely used admin portal enforces password policy but not MFA because it was excluded from a recent SSO migration. The issue is exploitable from the internet and tied to privileged access.",
    situation: ["The vulnerable portal is business-critical and cannot be shut down immediately.", "Multiple teams own pieces of the authentication flow.", "Leadership needs a fix path with short-term containment and long-term correction."],
    responseSteps: ["Validate exploit path and exposure", "Recommend interim restrictions", "Coordinate permanent identity integration fix", "Retest to prove the original path is closed"],
    helpfulTips: ["A finding is strongest when it shows exactly how an attacker would chain weaknesses.", "Always distinguish compensating controls from actual remediation.", "Retesting is where credibility is won or lost.", "Write findings so engineers can act without a follow-up meeting."],
    artifacts: ["Proof-of-concept notes", "Impact narrative", "Remediation plan", "Retest evidence"],
    toolchain: ["Recon tools", "Burp Suite", "Identity logs", "Issue tracker"],
    workflow: ["Scope", "Validate", "Report", "Remediate", "Retest"],
    metrics: ["Time to reproduce", "Time to remediate", "Retest success rate"],
    analystNotes: "The best pentest outputs are not dramatic screenshots. They are clear exploit stories that help teams fix real risks faster."
  },
  "architecture-design": {
    category: "endpoint",
    scenarioTitle: "Real-Life Scenario: Designing Secure Access for a New Internal Platform",
    scenarioSummary: "A product team launches an internal analytics platform that ingests sensitive financial data. Security must define network placement, IAM boundaries, logging, and recovery patterns before production go-live.",
    situation: ["The business deadline is tight.", "Developers want broad access during early rollout.", "Audit requirements demand traceability and data minimization."],
    responseSteps: ["Map trust boundaries and data sensitivity", "Define least-privilege roles and service-to-service auth", "Require immutable logging and recovery paths", "Capture tradeoffs in an ADR for future review"],
    helpfulTips: ["If a design choice cannot be explained in one sentence, it may not be mature enough.", "Architecture reviews should include failure and rollback scenarios, not just ideal state.", "Use diagrams to show where trust shifts, not just where services exist.", "Document assumptions that could later invalidate the design."],
    artifacts: ["Reference architecture", "ADR", "Threat model", "Control validation checklist"],
    toolchain: ["Diagramming tool", "Threat model template", "IAM policies", "Review notes"],
    workflow: ["Model", "Decide", "Review", "Implement", "Validate"],
    metrics: ["Number of unresolved high risks", "Time to review design change", "Control coverage across trust boundaries"],
    analystNotes: "Architecture is where you prevent entire classes of incidents before they happen. Good design work compounds over time."
  },
  "security-automation": {
    category: "automation",
    scenarioTitle: "Real-Life Scenario: Automating Phishing Triage Enrichment",
    scenarioSummary: "Analysts spend 12 minutes per phishing alert manually checking sender reputation, attachment hashes, URL detonation history, and mailbox spread. Security decides to automate enrichment before analyst review.",
    situation: ["Analyst queue is growing daily.", "Bad automation could quarantine legitimate mail.", "Leadership wants measurable cycle-time reduction without quality loss."],
    responseSteps: ["Automate evidence gathering only first", "Add confidence scoring and clear output", "Compare analyst decisions before/after automation", "Gate any destructive action behind approval"],
    helpfulTips: ["Automate the steps analysts repeat, not the judgment they still need to make.", "Log every API failure and timeout explicitly.", "Small reliable automations beat big fragile playbooks.", "Track error rate, not just speed improvement."],
    artifacts: ["Workflow diagram", "Sample enriched case", "Failure-path log", "Before/after queue metrics"],
    toolchain: ["SOAR", "Email security platform", "Threat intel API", "Case system"],
    workflow: ["Ingest", "Enrich", "Score", "Approve", "Close"],
    metrics: ["Minutes saved per alert", "Automation failure rate", "Analyst decision consistency"],
    analystNotes: "Automation maturity is not about how much runs without humans. It is about how much routine work is removed safely."
  },
  "security-information": {
    category: "detection",
    scenarioTitle: "Real-Life Scenario: Broken Field Mapping Silences a Detection",
    scenarioSummary: "A detection that should flag suspicious privileged logons stops firing after a new data source onboarding. The root cause is a parser change that renamed a critical username field without updating the normalized schema.",
    situation: ["Analysts trust the dashboard but alerts quietly degrade.", "The issue affects multiple downstream queries.", "Leadership assumes coverage is unchanged until an audit reveals the gap."],
    responseSteps: ["Validate field-level coverage", "Trace parser-to-schema lineage", "Restore mapping and retest detections", "Add data-quality monitoring for critical fields"],
    helpfulTips: ["Every critical detection should have a required-field checklist.", "Telemetry changes should be treated like production code changes.", "Confidence in enrichment fields should be explicit.", "Schema drift is a security problem, not just a data problem."],
    artifacts: ["Field mapping diff", "Detection retest output", "Schema checklist", "Data-quality dashboard"],
    toolchain: ["Parser pipeline", "SIEM", "Schema docs", "Monitoring alerts"],
    workflow: ["Ingest", "Normalize", "Validate", "Detect", "Review"],
    metrics: ["Critical field completeness", "Detection breakage rate", "Time to parser rollback"],
    analystNotes: "Great detections rest on boring but essential engineering discipline: schemas, parsers, and field integrity."
  },
  siem: {
    category: "detection",
    scenarioTitle: "Real-Life Scenario: Noisy Authentication Detection Burns Out the Queue",
    scenarioSummary: "A new brute-force rule correctly catches attacks but also floods analysts with password spray-like patterns caused by VPN reconnect storms and misconfigured internal scanners.",
    situation: ["The alert was created quickly after a threat bulletin.", "Analysts are starting to ignore it because of volume.", "Security leadership wants to preserve coverage without drowning the SOC."],
    responseSteps: ["Measure current precision", "Separate attack-like benign patterns", "Add bounded suppression with owner and expiry", "Replay attack and benign data to validate improvements"],
    helpfulTips: ["Tuning is not suppression by frustration.", "Always record why a suppression exists and when it should expire.", "Measure queue health after rule changes.", "Keep a test dataset so you do not tune blindly."],
    artifacts: ["Before/after precision report", "Suppression register", "Replay test output", "Rule ownership notes"],
    toolchain: ["SIEM", "Attack replay dataset", "Threat intel", "Case management"],
    workflow: ["Hypothesize", "Deploy", "Measure", "Tune", "Review"],
    metrics: ["Precision", "MTTR", "Queue age", "Alert volume trend"],
    analystNotes: "A useful detection program is built by operational discipline over time, not by writing lots of rules quickly."
  },
  "security-operations": {
    category: "incident",
    scenarioTitle: "Real-Life Scenario: Overnight Credential Theft Investigation",
    scenarioSummary: "A privileged account authenticates from an unusual location after a suspicious OAuth consent event. The on-call analyst must determine whether to disable access immediately, who to notify, and how to preserve the timeline for day-shift handoff.",
    situation: ["The affected user is an executive assistant with broad mailbox access.", "Leadership wants regular updates but facts are still emerging.", "Cloud and endpoint data both need to be correlated quickly."],
    responseSteps: ["Establish severity and initial scope", "Separate confirmed facts from assumptions", "Assign owners for identity, endpoint, and communications", "Produce handoff timeline and action log"],
    helpfulTips: ["The first 20 minutes determine incident clarity later.", "Write updates for the next responder, not just for yourself.", "Short status updates beat long speculative summaries.", "Capture exact timestamps from systems, not memory."],
    artifacts: ["Incident timeline", "Stakeholder update log", "Containment checklist", "Post-incident action register"],
    toolchain: ["SIEM", "EDR", "IAM logs", "Jira/Confluence"],
    workflow: ["Detect", "Scope", "Coordinate", "Contain", "Improve"],
    metrics: ["Time to severity classification", "Time to containment", "Post-incident action completion"],
    analystNotes: "Security operations quality is visible in the clarity of decisions, ownership, and evidence during chaos."
  },
  "threat-modeling": {
    category: "endpoint",
    scenarioTitle: "Real-Life Scenario: Threat Modeling a Public API Release",
    scenarioSummary: "A new public API will expose partner data and support machine-to-machine authentication. The team needs to identify abuse cases before launch rather than after the first security incident.",
    situation: ["The product team is focused on performance and release deadlines.", "Authentication assumptions are changing during development.", "Some risks are acceptable only with clear owner sign-off."],
    responseSteps: ["Map assets and entry points", "Enumerate attacker goals and abuse paths", "Prioritize risks by likelihood and impact", "Assign controls, owners, and validation tests"],
    helpfulTips: ["Threat models should change decisions, not just document them.", "Residual risk must always have an owner.", "Include misuse and business logic abuse, not only classic technical attacks.", "Keep outputs small and actionable so teams use them."],
    artifacts: ["Threat model diagram", "Risk register", "Control ownership matrix", "Validation test plan"],
    toolchain: ["Threat model template", "Architecture diagram", "Backlog system", "ADR notes"],
    workflow: ["Scope", "Enumerate", "Prioritize", "Map", "Validate"],
    metrics: ["High risks with owners", "Design changes caused by model", "Residual risks accepted"],
    analystNotes: "Threat modeling is powerful when it is lightweight, specific, and tied to actual engineering choices."
  },
  "vulnerability-management": {
    category: "incident",
    scenarioTitle: "Real-Life Scenario: Critical Internet-Facing Vulnerability Across Mixed Assets",
    scenarioSummary: "A new actively exploited vulnerability affects edge devices, cloud workloads, and a few internal admin systems. Security must prioritize patching based on exposure and business criticality, not just scanner count.",
    situation: ["The scanner shows hundreds of findings but only a subset are exploitable.", "Operations teams want maintenance windows; leadership wants immediate action.", "False positives are possible on legacy appliances."],
    responseSteps: ["Identify exposed and privileged assets first", "Apply SLA by exploitability and business impact", "Track exception owners and compensating controls", "Retest closure and recurrence causes"],
    helpfulTips: ["Volume is not priority.", "A verified false positive should still be documented for future audits.", "Separate patching status from remediation quality.", "Recurrence often signals a process gap, not just missed patching."],
    artifacts: ["Prioritized backlog", "Exception log", "Retest evidence", "MTTR dashboard"],
    toolchain: ["Scanner", "Asset inventory", "Ticketing", "Patch deployment tooling"],
    workflow: ["Find", "Prioritize", "Fix", "Validate", "Review"],
    metrics: ["Critical MTTR", "SLA breach count", "Repeat vuln rate"],
    analystNotes: "Good vulnerability management is a risk-reduction program, not a patch-count program."
  },
  "soc-ops-analyst-track": {
    category: "incident",
    scenarioTitle: "Real-Life Scenario: Concurrent Phishing Incident, Audit Request, and Vulnerability Escalation",
    scenarioSummary: "During one shift, the analyst must triage a phishing incident, respond to an auditor asking for evidence of privileged-access reviews, and escalate a critical internet-facing vulnerability approaching SLA breach.",
    situation: ["All three tasks are legitimate and time-sensitive.", "There is limited escalation bandwidth.", "Poor prioritization could either increase breach risk or create compliance failure."],
    responseSteps: ["Classify business risk of each workstream", "Assign immediate actions and escalation path", "Keep artifacts current while executing", "Communicate tradeoffs early to stakeholders"],
    helpfulTips: ["SOC maturity shows up in prioritization under load.", "A clean decision log prevents confusion later.", "Use templates so evidence capture does not fall apart under pressure.", "Translate technical urgency into business language for leadership."],
    artifacts: ["Decision log", "Executive status note", "Audit evidence packet", "SLA exception/escalation notes"],
    toolchain: ["SIEM", "EDR", "Jira", "Confluence", "Vulnerability platform"],
    workflow: ["Prioritize", "Escalate", "Execute", "Document", "Review"],
    metrics: ["Time to stakeholder alignment", "Number of clean handoffs", "Evidence completeness"],
    analystNotes: "SOC work is rarely serial. The real skill is making disciplined decisions across competing priorities."
  },
  "capstone-track": {
    category: "automation",
    scenarioTitle: "Real-Life Scenario: Building a Portfolio Project that Resembles Real Security Work",
    scenarioSummary: "You design a capstone that combines cloud logging, detection rules, triage automation, and an incident case study rather than a disconnected collection of screenshots.",
    situation: ["You need to show depth, not just breadth.", "Interviewers will ask why you chose each tool and what tradeoffs you made.", "The project must produce measurable outcomes and a clear narrative."],
    responseSteps: ["Choose one meaningful problem", "Establish baseline and success metrics", "Implement and document decisions", "Package final story with evidence and lessons learned"],
    helpfulTips: ["A smaller but measurable project beats a giant unfinished one.", "Capture evidence as you build, not at the end.", "Write the interview story while the project is still fresh.", "Include what went wrong and how you fixed it."],
    artifacts: ["Architecture overview", "Before/after metrics", "Case study write-up", "Demo screenshots and logs"],
    toolchain: ["Selected lab tools", "Diagram asset", "Git repo", "Presentation notes"],
    workflow: ["Scope", "Build", "Measure", "Explain", "Iterate"],
    metrics: ["Outcome vs baseline", "Number of integrated skills", "Practical understanding confidence"],
    analystNotes: "Capstones stand out when they look like work a real team would care about, not like a classroom assignment."
  }
};

Object.assign(studyAppliedPlaybooks, {
  "aws-security-hub-and-detection": {
    category: "cloud",
    scenarioTitle: "Real-Life Scenario: Security Hub Flags Public S3 Exposure During Audit Week",
    scenarioSummary: "A newly provisioned analytics bucket is exposed to the internet, Security Hub raises a high-severity finding, and the team must determine whether the bucket contains regulated data, whether public access was intentional, and how to prove closure quickly.",
    situation: ["The owning application team insists the exposure was required for a partner integration.", "Auditors are already reviewing control exceptions for cloud storage.", "Security must confirm whether the finding is misconfiguration-only or evidence of broader account hygiene issues."],
    responseSteps: ["Validate the resource, account, and region context", "Check object sensitivity, bucket policy, and public access block state", "Coordinate immediate restriction or compensating control", "Retest the finding and update audit evidence with clear owner sign-off"],
    helpfulTips: ["Always verify whether a Security Hub finding is root cause or symptom.", "Use CloudTrail to determine when the exposure was introduced and by whom.", "Document both immediate containment and long-term prevention action.", "A finding is not closed until the control state and business exception state both make sense."],
    artifacts: ["Security Hub finding record", "Bucket policy diff", "CloudTrail actor timeline", "Closure evidence with retest"],
    toolchain: ["Security Hub", "CloudTrail", "AWS Config", "Jira", "Confluence"],
    workflow: ["Review", "Trace", "Contain", "Retest", "Close"],
    metrics: ["Finding MTTR", "Repeat bucket-exposure findings", "Time to ownership confirmation"],
    analystNotes: "Security Hub becomes truly valuable when findings are treated as operational risk stories with clear ownership and evidence, not just rows in a dashboard."
  },
  "aws-cloud-security-engineering": {
    category: "cloud",
    scenarioTitle: "Real-Life Scenario: IAM Role Over-Permission Enables Cross-Account Abuse",
    scenarioSummary: "A workload role intended for logging access can also enumerate secrets and assume a downstream administrative role because of overly broad wildcard permissions and missing SCP guardrails.",
    situation: ["The role is already used by multiple production services.", "A rushed change window makes broad refactoring risky.", "Security needs a least-privilege fix without causing service outage."],
    responseSteps: ["Review actual API usage and denied-action telemetry", "Break permissions into minimum viable actions by workload", "Apply scoped role boundaries and account-level guardrails", "Validate workload health and unauthorized action denial after rollout"],
    helpfulTips: ["Least privilege is easier to defend when you have observed usage data.", "Do not fix role design without checking account-level guardrails too.", "Treat wildcard permissions as temporary design debt with expiration.", "Cloud design decisions should always include rollback and workload verification."],
    artifacts: ["IAM policy diff", "Access analyzer findings", "Denied-action validation logs", "Post-change service health report"],
    toolchain: ["IAM", "Access Analyzer", "Organizations/SCPs", "CloudTrail", "Change ticket"],
    workflow: ["Observe", "Constrain", "Guardrail", "Validate", "Review"],
    metrics: ["Roles with wildcard actions", "Privilege reduction count", "Post-change incident count"],
    analystNotes: "Real AWS security engineering is less about knowing every service and more about designing identity and logging boundaries that scale safely."
  },
  "siem-tooling-platform-depth": {
    category: "detection",
    scenarioTitle: "Real-Life Scenario: Splunk-to-QRadar Detection Migration Under Deadline",
    scenarioSummary: "A high-value lateral movement rule must be moved from Splunk to QRadar after a tooling change. The original detection relied on field aliases, custom lookups, and analyst notes that were never formally documented.",
    situation: ["Leadership expects no detection gap during migration.", "Data field names differ across platforms.", "Analysts need the same triage context on day one of cutover."],
    responseSteps: ["Write the detection logic in platform-agnostic language first", "Map required fields and enrichment dependencies", "Replay historical attack and benign events in both platforms", "Compare precision, triage steps, and queue impact before go-live"],
    helpfulTips: ["The query is not the detection; the hypothesis and required evidence are the detection.", "Preserve analyst workflow details, not just syntax.", "Migration parity testing should include false-positive behavior.", "Document assumptions that were hidden in the old platform."],
    artifacts: ["Logic mapping sheet", "Field dependency checklist", "Parity validation results", "Updated analyst runbook"],
    toolchain: ["Splunk", "QRadar", "Replay dataset", "Runbook documentation"],
    workflow: ["Abstract", "Map", "Replay", "Compare", "Cutover"],
    metrics: ["Parity success rate", "Precision delta", "Analyst triage time after migration"],
    analystNotes: "Cross-platform SIEM depth shows up when you can preserve detection quality and analyst clarity during change, not just retype a search."
  },
  "edr-and-edrm-operations": {
    category: "detection",
    scenarioTitle: "Real-Life Scenario: EDR Sees Suspicious Living-Off-the-Land Activity on an Admin Workstation",
    scenarioSummary: "An administrator workstation launches encoded PowerShell, creates scheduled task persistence, and contacts a low-reputation domain. The question is whether this is red team, legitimate admin automation, or an actual intrusion.",
    situation: ["The host has access to critical infrastructure.", "Immediate isolation may disrupt operations.", "Delaying containment increases risk if credentials are already exposed."],
    responseSteps: ["Review process tree, user context, and command-line arguments", "Check whether the behavior is expected from approved admin tooling", "Contain host with minimal business blast radius", "Collect evidence and verify clean state before restoration"],
    helpfulTips: ["Living-off-the-land activity is dangerous because it often looks partially legitimate.", "Ask whether the same behavior exists elsewhere before assuming uniqueness.", "Containment decisions are strongest when paired with rollback and communication plans.", "The absence of malware files does not mean the host is clean."],
    artifacts: ["Process tree", "Scheduled task evidence", "User communication notes", "Host recovery validation"],
    toolchain: ["EDR", "PowerShell logs", "SIEM", "Identity logs"],
    workflow: ["Inspect", "Contextualize", "Contain", "Collect", "Restore"],
    metrics: ["Time to containment", "Scope expansion count", "Repeat admin-workstation incidents"],
    analystNotes: "Strong EDR work often depends on your ability to separate suspicious administration from true compromise under time pressure."
  },
  "threat-intelligence-and-ioc-engineering": {
    category: "detection",
    scenarioTitle: "Real-Life Scenario: IOC Feed Flood Causes Low-Value Alert Storm",
    scenarioSummary: "A commercial intel feed pushes thousands of fresh domains and hashes after a campaign report, but many indicators have low relevance to your environment and begin triggering noisy SIEM alerts.",
    situation: ["Analysts are already overloaded.", "Leadership wants assurance that the team is using premium intel effectively.", "Blindly suppressing the feed could hide real exposure."],
    responseSteps: ["Score IOC confidence and environment relevance", "Separate short-lived indicators from durable behavioral detections", "Implement bounded alert logic with expiration and review", "Measure how many alerts actually lead to actionable investigation"],
    helpfulTips: ["Fresh intel is not automatically useful intel.", "Behavior-based detections often outlive IOC-only rules.", "Track which feeds actually improve triage outcomes.", "Retire stale indicators aggressively to protect queue health."],
    artifacts: ["IOC scoring matrix", "Alert-to-action analysis", "Feed review notes", "Detection retirement log"],
    toolchain: ["Threat intel feed", "ATT&CK mapping", "SIEM", "EDR"],
    workflow: ["Ingest", "Score", "Convert", "Measure", "Retire"],
    metrics: ["IOC-driven alert precision", "Actionable-alert rate", "Indicator retirement lag"],
    analystNotes: "Threat intelligence is strongest when it changes detection quality and investigation speed, not when it just increases alert count."
  },
  "palo-alto-firewall-operations": {
    category: "endpoint",
    scenarioTitle: "Real-Life Scenario: Palo Alto Rule Sprawl Enables Unnecessary East-West Access",
    scenarioSummary: "An investigation into suspicious SMB traffic reveals multiple broad inter-zone allow rules created during emergency projects and never recertified. Some rules also bypass threat profiles for convenience.",
    situation: ["Several application teams depend on loosely documented exceptions.", "Blocking too much too quickly could interrupt production services.", "SOC needs better logs and policy clarity to investigate laterally moving threats."],
    responseSteps: ["Pull hit counts and owner history for broad rules", "Rebuild policy intent around zones and approved apps", "Apply threat profiles and logging consistently", "Validate traffic outcomes before retiring old exceptions"],
    helpfulTips: ["Rule count is less important than rule clarity and ownership.", "Threat profiles without quality logging are harder to operationalize.", "Panorama governance should include review cadence, not just deployment.", "Use investigations to clean policy debt while context is fresh."],
    artifacts: ["Rule recertification sheet", "Profile attachment validation", "Traffic hit analysis", "Exception retirement record"],
    toolchain: ["Palo Alto", "Panorama", "SIEM", "Change review"],
    workflow: ["Audit", "Refine", "Protect", "Validate", "Retire"],
    metrics: ["Broad-rule reduction", "Threat-profile coverage", "Investigation clarity improvement"],
    analystNotes: "Firewall maturity improves when policy, prevention profiles, and SOC visibility are managed together rather than as separate silos."
  },
  "checkpoint-and-firewall-technologies": {
    category: "endpoint",
    scenarioTitle: "Real-Life Scenario: Audit Finds 18-Month-Old Firewall Exceptions With No Owner",
    scenarioSummary: "Checkpoint review shows many aging rules tied to past projects, no current owner, and no evidence of continued necessity. Several are highly permissive and touch sensitive networks.",
    situation: ["Security cannot prove the business need for legacy rules.", "Infrastructure teams are afraid to remove them without usage validation.", "Audit requires governance evidence, not just technical cleanup."],
    responseSteps: ["Correlate rule usage with current system ownership", "Classify high-risk exceptions first", "Create recertification and retirement workflow", "Package evidence for audit and future reviews"],
    helpfulTips: ["Firewall governance fails long before the firewall technology fails.", "Usage data should guide cleanup sequencing.", "Expired project rules are often hidden exposure pathways.", "Audit-friendly policy operations depend on traceable approval history."],
    artifacts: ["Usage review report", "Owner recertification log", "Exception retirement checklist", "Audit evidence packet"],
    toolchain: ["Checkpoint", "Usage analytics", "Change control", "Audit documentation"],
    workflow: ["Discover", "Recertify", "Prioritize", "Retire", "Evidence"],
    metrics: ["Ownerless rule count", "Retired legacy exceptions", "Audit exception reduction"],
    analystNotes: "Firewall governance is a long-term hygiene discipline; the absence of ownership is often the real risk signal."
  },
  "atlassian-jira-confluence-security-workflows": {
    category: "automation",
    scenarioTitle: "Real-Life Scenario: Incident Response Breaks Because Documentation and Ticketing Drifted Apart",
    scenarioSummary: "A phishing incident exposes that the Jira incident template lacks required evidence fields and the linked Confluence runbook is outdated, causing analysts to miss approval steps and duplicate work.",
    situation: ["On-call responders need fast, trusted documentation.", "Different teams have built their own ticket fields over time.", "Leadership wants consistent post-incident reporting across teams."],
    responseSteps: ["Standardize case fields around execution-critical evidence", "Update runbooks to reflect actual responder decisions", "Link Jira issue types directly to Confluence procedures", "Review workflow quality after the next incident simulation"],
    helpfulTips: ["If analysts do not trust the runbook, they will ignore it.", "Templates should reflect real decisions, not compliance theory.", "Use Jira automation to reduce missed fields and stale states.", "Confluence is most valuable when it stays close to actual practice."],
    artifacts: ["Updated incident template", "Runbook version log", "Workflow gap list", "Case quality checklist"],
    toolchain: ["Jira", "Confluence", "Automation rules", "Incident review notes"],
    workflow: ["Template", "Link", "Execute", "Review", "Refine"],
    metrics: ["Required-field completion", "Runbook adherence", "Post-incident documentation lag"],
    analystNotes: "Operational tooling quality is visible when responders can move fast without guessing what good documentation should look like."
  },
  "xsoar-and-security-automation-platforms": {
    category: "automation",
    scenarioTitle: "Real-Life Scenario: XSOAR Playbook Auto-Quarantines Too Broadly",
    scenarioSummary: "A new playbook that automatically disables accounts after suspicious sign-in enrichment fires against noisy travel-related alerts and causes unnecessary user disruption.",
    situation: ["The automation reduced manual work but created operational trust issues.", "Leaders now question whether broader automation is safe.", "The team must fix the playbook without abandoning automation value."],
    responseSteps: ["Reclassify which steps are safe for full automation", "Insert approval gates for high-impact actions", "Improve enrichment confidence scoring before containment", "Measure quality after controlled relaunch"],
    helpfulTips: ["Automate confidence, not confidence theater.", "The best first automation removes analyst toil without changing system state.", "Every SOAR failure is also a workflow design lesson.", "Trust in automation is earned through transparent controls and outcomes."],
    artifacts: ["Playbook version diff", "Approval-gate design", "Failure-path log", "Relaunch KPI report"],
    toolchain: ["XSOAR", "Identity platform", "SIEM", "Case tracking"],
    workflow: ["Enrich", "Score", "Approve", "Act", "Measure"],
    metrics: ["Automation-caused false actions", "Cycle-time reduction", "Playbook error rate"],
    analystNotes: "SOAR maturity depends less on the number of playbooks and more on whether automations are trusted, safe, and measurable."
  },
  "cloud-security-gcp-and-azure": {
    category: "cloud",
    scenarioTitle: "Real-Life Scenario: Cross-Cloud Identity Abuse Investigation",
    scenarioSummary: "A suspicious contractor account is seen authenticating across AWS, Azure, and GCP admin portals over a short period. Each platform logs the activity differently, and the analyst must determine whether this is misconfiguration, token abuse, or legitimate federated access.",
    situation: ["The organization recently expanded into multi-cloud.", "Each cloud team names roles and resources differently.", "A fragmented response could miss the full blast radius."],
    responseSteps: ["Map the identity and federation path across providers", "Normalize activity timeline by provider logs", "Check privilege level and resource touch points in each cloud", "Contain and review federated trust assumptions after closure"],
    helpfulTips: ["Cross-cloud incidents are easier when you normalize the investigation process even if tools differ.", "Identity events often reveal the real control weakness faster than workload events.", "Build equivalency matrices before incidents happen.", "Do not assume one provider's terminology maps cleanly to another's."],
    artifacts: ["Cross-cloud timeline", "Federation trust review", "Privilege map", "Provider-specific containment evidence"],
    toolchain: ["Cloud-native logs", "Identity provider logs", "SCC/Sentinel-style findings", "Case system"],
    workflow: ["Map", "Normalize", "Compare", "Contain", "Review"],
    metrics: ["Time to cross-cloud scope", "Identity mapping accuracy", "Post-incident trust fixes"],
    analystNotes: "Multi-cloud readiness is mostly about maintaining one strong investigative mindset across several different control planes."
  },
  "security-scripting-programming-practice": {
    category: "automation",
    scenarioTitle: "Real-Life Scenario: Building a Python + PowerShell Utility for Endpoint Compliance Checks",
    scenarioSummary: "The SOC keeps manually checking whether endpoints have encryption, EDR, and logging enabled before escalating tickets. A small utility is proposed to pull state automatically and output triage-ready evidence.",
    situation: ["Manual checks are slow and inconsistent.", "The utility may be run by analysts with mixed scripting confidence.", "A bad script could create false confidence or miss exceptions."],
    responseSteps: ["Define exact inputs and required outputs", "Write smallest viable script with clear validation", "Test against known-good and known-bad systems", "Document expected errors and sample outputs before team rollout"],
    helpfulTips: ["Security scripts should be boringly reliable.", "Sample input/output is part of the deliverable, not optional documentation.", "Validate field assumptions before shipping automation to analysts.", "Small utilities become portfolio proof when they save real time and show clean engineering."],
    artifacts: ["Script repo", "Sample output", "Validation test cases", "Adoption notes"],
    toolchain: ["Python", "PowerShell", "Bash", "API clients", "Version control"],
    workflow: ["Define", "Build", "Test", "Document", "Adopt"],
    metrics: ["Minutes saved per ticket", "Script failure rate", "Analyst reuse count"],
    analystNotes: "The most impressive security scripts are usually the ones teammates actually trust enough to reuse."
  },
  "certification-and-standards-roadmap": {
    category: "automation",
    scenarioTitle: "Real-Life Scenario: Turning Certification Study Into Applied Practice",
    scenarioSummary: "Instead of reading certification material in isolation, you build a roadmap where each cert domain produces one hands-on artifact, one lab output, and one documented study output tied to real operational work.",
    situation: ["Time is limited and the material is broad.", "It is easy to study for exams without becoming more capable in practice.", "You need a plan that improves both confidence and practical capability."],
    responseSteps: ["Map cert domains to existing study sections", "Assign one lab and one portfolio artifact per domain", "Track weekly evidence instead of only chapter completion", "Review whether study outputs build operational depth and practical speed"],
    helpfulTips: ["A cert objective without a practical artifact fades quickly.", "Standards become easier when you connect them to systems and incidents you already understand.", "Track what you can now explain or do, not only what you finished reading.", "Your roadmap should support the role you want, not just the exam date."],
    artifacts: ["90-day roadmap", "Cert-to-lab mapping", "Portfolio artifact list", "Weekly progress review"],
    toolchain: ["Certification objectives", "Study plan", "Lab tracker", "Portfolio notes"],
    workflow: ["Map", "Practice", "Capture", "Review", "Refine"],
    metrics: ["Domains with artifacts", "Weekly practical outputs", "Practical confidence trend"],
    analystNotes: "Certifications matter most when they create practical fluency and visible evidence, not just test familiarity."
  }
});

function inferStudyPlaybook(sectionId) {
  const guide = getStudyGuide(sectionId);
  const explainer = studySectionExplainers[sectionId] || extendedStudyModules[sectionId]?.explainer;
  const module = extendedStudyModules[sectionId];
  const title = sectionId.replace(/-/g, " ");
  const imageCategory = sectionId.includes("aws") || sectionId.includes("cloud") || sectionId.includes("azure") || sectionId.includes("gcp")
    ? "cloud"
    : sectionId.includes("siem") || sectionId.includes("threat") || sectionId.includes("security-information") || sectionId.includes("edr")
      ? "detection"
      : sectionId.includes("operations") || sectionId.includes("vulnerability") || sectionId.includes("incident") || sectionId.includes("soc")
        ? "incident"
        : sectionId.includes("automation") || sectionId.includes("script") || sectionId.includes("xsoar") || sectionId.includes("atlassian") || sectionId.includes("capstone")
          ? "automation"
          : "endpoint";
  return {
    category: imageCategory,
    scenarioTitle: module?.title || `Real-Life Scenario: Applied ${title.replace(/\b\w/g, c => c.toUpperCase())} Practice`,
    scenarioSummary: module?.overview || explainer?.what || `This topic affects day-to-day security work when teams need to make fast decisions with incomplete information and real business impact.`,
    situation: [
      `A production team depends on this capability to keep risk low without blocking the business.`,
      `Security must balance control quality, investigation speed, and operational realism.`,
      `Good execution requires both technical depth and clear evidence capture.`
    ],
    responseSteps: explainer?.how || ["Understand the environment", "Validate assumptions", "Implement controls", "Measure outcomes"],
    helpfulTips: [
      "Tie every technical action to a risk-reduction reason.",
      "Record assumptions, owners, and validation evidence as you go.",
      "Use one repeatable checklist so quality does not depend on memory.",
      "Measure the outcome after the change, not just whether the change was made."
    ],
    artifacts: ["Timeline or workflow notes", "Configuration or detection evidence", "Ownership and decision record", "Outcome metrics or validation output"],
    toolchain: module?.tools || ["Primary security platform", "Logs/telemetry", "Ticketing", "Documentation"],
    workflow: ["Understand", "Execute", "Validate", "Document", "Improve"],
    metrics: ["Time to validate", "Quality of evidence", "Risk reduction achieved"],
    analystNotes: explainer?.success || "Strong execution is visible when the team can explain the change, prove the result, and repeat the workflow confidently."
  };
}

Object.assign(studyAppliedPlaybooks, {
  "cloud-security": {
    category: "cloud",
    scenarioTitle: "Real-Life Scenario: Exposed Metadata Service Leads to IAM Key Exfiltration",
    scenarioSummary: "A web application on EC2 is vulnerable to SSRF. An attacker exploits the vulnerability to reach the IMDSv1 endpoint, retrieves temporary IAM credentials, and begins enumerating S3 buckets and Secrets Manager in the background. GuardDuty fires an UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration finding.",
    situation: ["The development team was unaware IMDSv1 was still enabled on the instance.", "The compromised role has broad read access across multiple AWS services.", "The incident is discovered 4 hours after the initial SSRF."],
    responseSteps: ["Isolate the GuardDuty finding and confirm IAM key activity in CloudTrail", "Revoke the compromised session immediately using deny-all policy", "Check CloudTrail for all API calls made with the stolen credentials across all regions", "Rotate instance profile, enforce IMDSv2, and validate no exfiltrated data remains accessible"],
    helpfulTips: ["GuardDuty finding confidence is high but verify the source IP and API call pattern independently.", "CloudTrail global service events must be enabled to catch IAM and STS calls outside the home region.", "Revoking session tokens on the role (not just the instance) stops all active sessions using that role.", "Document the blast radius: which services were queried, what data was accessible, and whether any writes occurred."],
    artifacts: ["GuardDuty finding JSON export", "CloudTrail event history for compromised principal", "IAM policy revocation change record", "Post-incident IMDSv2 enforcement validation"],
    toolchain: ["GuardDuty", "CloudTrail", "IAM Access Analyzer", "AWS CLI", "Jira incident ticket"],
    workflow: ["Detect", "Validate", "Revoke", "Investigate", "Harden"],
    metrics: ["Time to revoke compromised credentials", "API calls made with stolen credentials", "Number of services accessed before revocation"],
    analystNotes: "Cloud incidents move fast once credentials are exfiltrated. Speed of revocation is the most important metric. SSRF-to-IMDS is one of the highest-frequency cloud attack paths — IMDSv2 enforcement is a non-negotiable baseline control."
  },
  "identity-access-management": {
    category: "endpoint",
    scenarioTitle: "Real-Life Scenario: Stale Admin Account Used in Business Email Compromise",
    scenarioSummary: "An attacker obtains credentials for a former employee's account that was never deprovisioned. The account had direct admin access to a financial application. Using the account, the attacker modifies vendor payment details and initiates a $200K fraudulent transfer before the activity is noticed.",
    situation: ["The former employee left 6 months ago but the account was never fully removed.", "MFA was enforced for new accounts but this old account predated the policy rollout.", "Detection came from a finance team member noticing an unfamiliar change in the payment system, not from security tooling."],
    responseSteps: ["Disable the compromised account immediately and revoke all active sessions", "Investigate full activity history for the past 6 months", "Audit all accounts for similar stale or MFA-exempt conditions", "Build an automated offboarding workflow with HR system integration"],
    helpfulTips: ["Never assume HR notifies IT automatically. Build verified offboarding workflows with audit trails.", "MFA policy exceptions for legacy accounts are a critical gap — review and track all exemptions quarterly.", "Access reviews are not box-checking exercises; they prevent exactly this scenario.", "Stale accounts are low-effort targets for attackers — prioritize remediation at 30-day thresholds."],
    artifacts: ["Compromised account activity log", "Access review gap report", "Offboarding workflow design document", "MFA exemption register with remediation plan"],
    toolchain: ["Entra ID / Okta", "HR system", "SIEM", "Change management ticket"],
    workflow: ["Detect", "Disable", "Investigate", "Remediate", "Prevent"],
    metrics: ["Stale account count (>90 days inactive)", "MFA coverage rate", "Mean time from offboarding trigger to account disable"],
    analystNotes: "Identity hygiene is unglamorous but account lifecycle failures are behind a significant fraction of real breaches. Access reviews and automated provisioning workflows are higher-value than many detection tools."
  },
  "cryptography-pki": {
    category: "endpoint",
    scenarioTitle: "Real-Life Scenario: Expired Certificate Causes Production Outage and Triggers Incident",
    scenarioSummary: "A wildcard certificate for *.corp.com expires over a weekend. The internal API gateway, three microservices, and an authentication callback endpoint all go offline. On-call engineers discover the expiry was flagged in a CSPM finding 30 days earlier but never assigned an owner.",
    situation: ["Cert expiry monitoring was in place but the finding went to a shared queue with no owner.", "The teams responsible for each service all assumed another team owned the cert.", "The renewal process required a manual CSR and approval workflow that took 3 business days."],
    responseSteps: ["Issue emergency leaf certificate from internal CA while permanent renewal is processed", "Validate all affected services are back online with new cert", "Post-incident: implement automated cert renewal with alerting at 45-, 30-, and 7-day thresholds", "Assign cert ownership by system and tie to a certificate management platform"],
    helpfulTips: ["Certificate management is a shared-ownership failure waiting to happen. Assign clear owners, not team queues.", "Automate renewal where possible (Let's Encrypt + cert-manager for K8s, AWS ACM for managed services).", "Test cert rotation procedures annually so the process is not learned for the first time during an outage.", "Track the full cert inventory including internal CAs, pinned certs in mobile apps, and client certs."],
    artifacts: ["Certificate inventory spreadsheet", "Outage timeline with root cause", "Automated renewal implementation design", "Ownership assignment register"],
    toolchain: ["OpenSSL", "AWS ACM or internal CA", "Monitoring platform", "Jira"],
    workflow: ["Detect", "Mitigate", "Restore", "Root Cause", "Prevent"],
    metrics: ["Certificate coverage in inventory", "Certs expiring within 30 days without owner", "Renewal mean lead time"],
    analystNotes: "Expired certificates cause more availability incidents than most security vulnerabilities. Certificate lifecycle automation is one of the highest ROI security engineering projects available."
  },
  "malware-analysis": {
    category: "incident",
    scenarioTitle: "Real-Life Scenario: Cobalt Strike Beacon Identified in Finance Department",
    scenarioSummary: "EDR firings on a finance workstation show an unusual DLL loaded into explorer.exe via process injection. The process is beaconing to a domain registered 3 days ago. Sandbox detonation reveals Cobalt Strike default configuration with a malleable C2 profile.",
    situation: ["The workstation belongs to a finance director with access to payment systems.", "The beacon has been active for approximately 18 hours based on EDR telemetry.", "The domain hosting C2 infrastructure resolves to a fast-flux provider using multiple IPs."],
    responseSteps: ["Isolate workstation immediately while preserving memory for forensic analysis", "Extract and analyze the Cobalt Strike beacon payload to recover C2 configuration", "Hunt across the fleet for same DLL hash, injected process signatures, and C2 domain/IP contacts", "Block all C2 infrastructure at DNS, proxy, and firewall layers"],
    helpfulTips: ["Cobalt Strike artifacts in memory are recoverable with Volatility's malfind module — always dump memory before reimaging.", "Extract the beacon configuration using CobaltStrikeParser or BeaconEye to find C2 IPs, sleep time, jitter, and user-agent.", "Assume lateral movement has begun if the beacon has been active more than 4 hours without detection.", "Report ATT&CK techniques mapped to evidence, not just tool names, for threat intel and SOC improvement."],
    artifacts: ["Memory dump with extracted beacon config", "Fleet-wide hunt query results", "C2 infrastructure block list with evidence", "ATT&CK technique mapping table"],
    toolchain: ["EDR console", "Volatility 3", "Any.run / CAPE sandbox", "SIEM correlation", "Jira incident ticket"],
    workflow: ["Detect", "Isolate", "Analyze", "Hunt", "Block", "Recover"],
    metrics: ["Time from beacon activation to detection", "Number of systems reached by attacker", "C2 infrastructure takedown time"],
    analystNotes: "Cobalt Strike is the most common post-exploitation framework used in targeted attacks. Recognizing its artifacts in memory and network traffic is a baseline skill for any DFIR or threat hunting role."
  },
  "digital-forensics": {
    category: "incident",
    scenarioTitle: "Real-Life Scenario: Ransomware Root Cause Requires Full Forensic Reconstruction",
    scenarioSummary: "A mid-size company suffers a ransomware event affecting 200 servers. Leadership wants to know the initial access vector, dwell time, lateral movement path, and which data was accessed or exfiltrated before encryption. Your team is responsible for the forensic investigation.",
    situation: ["EDR only covers 60% of the affected systems — the others have no agent.", "Ransomware encrypted most log files on affected hosts.", "Insurance carrier and legal counsel require forensically sound evidence chain."],
    responseSteps: ["Collect memory and disk images from surviving unencrypted hosts before remediation proceeds", "Reconstruct initial access using perimeter firewall, email gateway, and VPN logs", "Build a lateral movement timeline from authentication logs, SMB traffic, and scheduled task artifacts", "Produce a formal report with chain of custody documentation and defensible conclusions"],
    helpfulTips: ["Do not allow IT to reimage systems before forensic copies are collected — this destroys evidence.", "Phishing is the most common ransomware initial access; check email gateway logs for 2-4 weeks before the event.", "Windows event IDs 4624, 4625, 4648, 4688, and 7045 are your lateral movement and persistence breadcrumbs.", "Timeline discrepancies between host timestamps and UTC are common in ransomware cases — normalize all timestamps to UTC first."],
    artifacts: ["Disk and memory images with hash verification", "Lateral movement timeline in chronological order", "Initial access evidence package", "Final forensic report with chain of custody"],
    toolchain: ["FTK Imager", "Volatility 3", "Plaso/log2timeline", "Autopsy", "SIEM"],
    workflow: ["Preserve", "Collect", "Parse", "Correlate", "Report"],
    metrics: ["Evidence coverage across affected systems", "Timeline completeness (gaps identified)", "Initial access vector confidence level"],
    analystNotes: "Ransomware forensics is where speed and evidence preservation conflict. The biggest mistake is letting remediation destroy evidence before the investigation scope is understood. Always image before reimaging."
  },
  "grc-compliance": {
    category: "automation",
    scenarioTitle: "Real-Life Scenario: SOC 2 Type II Audit Window Opens in 60 Days",
    scenarioSummary: "Your company is seeking SOC 2 Type II certification for the first time. The audit window covers 6 months of operations. Your security team must coordinate evidence collection across engineering, DevOps, HR, and legal — all while maintaining normal operations.",
    situation: ["Multiple teams are unfamiliar with SOC 2 requirements and what evidence looks like.", "Some key controls (access reviews, change management) have been executed manually with no audit trail.", "The external auditor is already scheduled and the timeline cannot move."],
    responseSteps: ["Map all Trust Services Criteria to existing controls and identify gaps", "Assign control owners and evidence collection templates to each team", "Implement missing controls (access review process, change log) with formal workflows", "Conduct pre-audit internal review to validate evidence quality before auditor arrival"],
    helpfulTips: ["SOC 2 auditors check operating effectiveness over time, not just policy documents. Screenshots, tickets, and logs dated within the audit window matter more than policies.", "Access reviews must show manager approval, not just IT action. Design your review process to capture both.", "Change management evidence should include approval, test results, and rollback plan — not just the change ticket.", "Start collecting evidence from day 1 of the audit period. Reconstruction after the fact always has gaps."],
    artifacts: ["Control matrix with owner and evidence type", "Access review results with manager sign-off", "Change management ticket export", "Vendor questionnaire responses with review dates"],
    toolchain: ["GRC platform (Vanta, Drata, Secureframe, or spreadsheet)", "Jira", "Confluence", "HR system", "Evidence storage"],
    workflow: ["Map", "Assign", "Implement", "Collect", "Validate", "Submit"],
    metrics: ["Controls with completed evidence", "Gap closure rate", "Days to audit readiness"],
    analystNotes: "SOC 2 audits reveal organizational maturity as much as technical security. The most common failures are not technical — they are process and documentation gaps. Start early, assign owners, and build evidence collection into normal workflows."
  },
  "application-security": {
    category: "incident",
    scenarioTitle: "Real-Life Scenario: SQL Injection in Production API Exposes Customer Records",
    scenarioSummary: "A security researcher submits a bug bounty report showing a SQL injection vulnerability in a search endpoint. The researcher was able to enumerate database tables, extract a sample of 500 customer records including emails and hashed passwords, and confirm the query runs as a privileged database user.",
    situation: ["The vulnerable endpoint has been in production for 14 months.", "SAST was not configured for this API repository and no DAST scan had been run against staging.", "The customer data exposure triggers GDPR notification requirements within 72 hours."],
    responseSteps: ["Validate the vulnerability with a controlled reproduction on a staging copy of production", "Deploy immediate WAF rule to block exploitation of the specific parameter while fix is developed", "Parameterize the query and deploy a fix through the standard emergency release process", "Notify DPA within 72 hours with evidence of scope, containment, and remediation actions"],
    helpfulTips: ["WAF rules are compensating controls, not fixes. Always pursue parameterized query remediation in parallel.", "Assess whether the database user has excessive privileges; a read-only user would have reduced blast radius.", "Check server access logs for earlier exploitation attempts before the bug report — GDPR notification scope may depend on this.", "Use the incident to mandate SAST/DAST integration and pentest coverage for all API repositories going forward."],
    artifacts: ["Vulnerability reproduction evidence", "WAF rule deployment record", "Code fix with parameterized query", "GDPR notification draft with timeline and scope"],
    toolchain: ["WAF (AWS, Cloudflare, or ModSecurity)", "SAST (Semgrep)", "Burp Suite", "Database access logs", "Jira"],
    workflow: ["Validate", "Contain", "Remediate", "Notify", "Prevent"],
    metrics: ["Time from report to WAF rule", "Time from report to code fix deployed", "Number of similar patterns found in codebase scan"],
    analystNotes: "SQL injection is 30 years old and still in OWASP Top 10 A03. The root cause is always the same: user input passed to an interpreter without parameterization. AppSec programs that catch this in code review or SAST prevent incidents that trigger regulatory notification requirements."
  },
  "container-security": {
    category: "cloud",
    scenarioTitle: "Real-Life Scenario: Cryptominer Deployed via Compromised Container Registry Credentials",
    scenarioSummary: "An attacker obtains CI/CD pipeline credentials and pushes a modified container image to a private registry. The compromised image is pulled by a Kubernetes deployment and begins mining cryptocurrency, consuming cluster resources. Falco detects the anomalous process within 8 minutes.",
    situation: ["The CI/CD credentials were found in a public GitHub repository commit from 3 months ago.", "The compromised image passed automated image scanning because the miner was staged in an init container that ran post-scan.", "Several production namespaces are affected because the image tag was shared across environments."],
    responseSteps: ["Delete compromised deployments and drain affected nodes to stop the miner", "Revoke and rotate all CI/CD credentials and registry tokens immediately", "Audit image registry for other unauthorized pushes using registry access logs", "Implement image signing (cosign) and digest pinning to prevent unsigned image deployment"],
    helpfulTips: ["Image signing prevents this attack class entirely — cosign + Kubernetes policy enforcement should be a baseline control.", "Registry access logs are critical. Ensure they are retained and monitored just like API logs.", "Post-scan staging attacks (hiding payloads in init containers or late-stage layers) require runtime detection, not just build-time scanning.", "Review all CI/CD service account permissions — they almost always have more access than necessary."],
    artifacts: ["Falco alert export with process and syscall details", "Image registry access log showing unauthorized push", "Credential revocation change records", "Image signing and digest pinning implementation design"],
    toolchain: ["Falco", "Container registry (ECR/GCR/Harbor)", "cosign", "Kubernetes audit logs", "Jira"],
    workflow: ["Detect", "Contain", "Revoke", "Investigate", "Harden"],
    metrics: ["Time to Falco detection", "Number of compromised deployments", "Time to credential revocation"],
    analystNotes: "Container supply chain attacks are increasing. The CI/CD pipeline is now a primary attack surface. Credential hygiene in pipelines, image signing, and runtime detection are three controls that work together to close this gap."
  }
});


function getStudyPlaybook(sectionId) {
  return studyAppliedPlaybooks[sectionId] || inferStudyPlaybook(sectionId);
}

function buildStudyStoryboard(sectionId) {
  const playbook = getStudyPlaybook(sectionId);
  const steps = playbook.workflow.slice(0, 5);
  const colors = ["#49c8f0", "#78e7bd", "#49c8f0", "#78e7bd", "#49c8f0"];
  const nodes = steps
    .map((step, index) => {
      const x = 82 + index * 132;
      const color = colors[index] || "#49c8f0";
      return `
        <g class="story-node" style="--node-delay:${index * 0.14}s">
          <circle cx="${x}" cy="86" r="24" fill="rgba(8,24,36,0.86)" stroke="${color}" stroke-width="2" />
          <text x="${x}" y="90" text-anchor="middle" font-size="10" fill="#d9eefb">${step}</text>
        </g>
      `;
    })
    .join("");

  const lines = steps
    .slice(0, -1)
    .map((_, index) => {
      const x = 106 + index * 132;
      return `<line x1="${x}" y1="86" x2="${x + 84}" y2="86" stroke="rgba(110,168,213,0.45)" stroke-width="2" stroke-dasharray="5 6" />`;
    })
    .join("");

  return `
    <div class="study-storyboard">
      <h5>Animated Workflow View</h5>
      <svg viewBox="0 0 700 172" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${sectionId} workflow diagram">
        <rect x="18" y="18" width="664" height="136" rx="12" fill="rgba(8,24,36,0.82)" stroke="rgba(110,168,213,0.25)" />
        <text x="38" y="48" font-size="13" fill="#d7ebf8">Operational flow for this topic</text>
        ${lines}
        ${nodes}
      </svg>
    </div>
  `;
}

function buildAppliedFieldGuide(sectionId) {
  const playbook = getStudyPlaybook(sectionId);
  const image = studyVisualMap[sectionId] || studyVisualMap[playbook.category] || studyVisualMap.default;
  return `
    <section class="applied-field-guide">
      <div class="applied-guide-head">
        <div>
          <p class="eyebrow">Applied Field Guide</p>
          <h5>${playbook.scenarioTitle}</h5>
          <p>${playbook.scenarioSummary}</p>
        </div>
        <figure class="study-image-card">
          <img src="${image}" alt="Illustration supporting ${playbook.scenarioTitle}" />
        </figure>
      </div>
      <div class="applied-guide-grid">
        <article class="applied-card">
          <h6>What the Team Is Facing</h6>
          <ul>${playbook.situation.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
        <article class="applied-card">
          <h6>Recommended Response Path</h6>
          <ol>${playbook.responseSteps.map((item) => `<li>${item}</li>`).join("")}</ol>
        </article>
        <article class="applied-card">
          <h6>Helpful Tips</h6>
          <ul>${playbook.helpfulTips.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
        <article class="applied-card">
          <h6>Artifacts You Should Capture</h6>
          <ul>${playbook.artifacts.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
      </div>
      <div class="applied-mini-grid">
        <article class="applied-strip">
          <h6>Typical Toolchain</h6>
          <div class="chip-row">${playbook.toolchain.map((item) => `<span>${item}</span>`).join("")}</div>
        </article>
        <article class="applied-strip">
          <h6>Metrics That Matter</h6>
          <ul>${playbook.metrics.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
      </div>
      ${buildStudyStoryboard(sectionId)}
      <div class="field-note-callout">
        <strong>Field Note:</strong> ${playbook.analystNotes}
      </div>
    </section>
  `;
}

function buildRealisticTrainingPackage(sectionId) {
  const playbook = getStudyPlaybook(sectionId);
  const guide = getStudyGuide(sectionId);
  if (!playbook || !guide) {
    return "";
  }

  const labContextByCategory = {
    endpoint: [
      "Lab environment: 2 Windows hosts + 1 Linux host with EDR telemetry enabled.",
      "Timebox: 90 minutes execution + 20 minutes debrief.",
      "Data sources: endpoint events, process tree, network connections, and auth logs.",
      "Constraint: maintain business continuity while containing risk."
    ],
    detection: [
      "Lab environment: SIEM with at least 7 days of normalized logs.",
      "Timebox: 60 minutes detection build + 30 minutes tuning cycle.",
      "Data sources: attack replay dataset + benign baseline traffic.",
      "Constraint: improve precision without losing high-risk coverage."
    ],
    incident: [
      "Lab environment: incident ticketing + SIEM/EDR console + communication templates.",
      "Timebox: 75 minutes scenario handling + 30 minutes postmortem.",
      "Data sources: timeline events, identity logs, endpoint and network telemetry.",
      "Constraint: prioritize containment and stakeholder clarity under pressure."
    ],
    cloud: [
      "Lab environment: multi-account cloud sandbox with CloudTrail/Audit logs enabled.",
      "Timebox: 80 minutes triage/remediation + 20 minutes evidence closure.",
      "Data sources: security findings, audit events, IAM activity, config state.",
      "Constraint: maintain least privilege and avoid service disruption."
    ],
    automation: [
      "Lab environment: staging pipeline or SOAR sandbox with dry-run mode.",
      "Timebox: 60 minutes build + 30 minutes failure-path testing.",
      "Data sources: API responses, alert payloads, ticket outcomes.",
      "Constraint: no destructive actions without approval gates and rollback path."
    ]
  };

  const context = labContextByCategory[playbook.category] || labContextByCategory.endpoint;
  const responseSteps = playbook.responseSteps || [];
  const artifacts = playbook.artifacts || [];
  const selfCheck = guide.selfCheck || [];
  const metrics = playbook.metrics || [];

  return `
    <section class="training-pack">
      <div class="training-pack-head">
        <p class="eyebrow">Realistic Training Pack</p>
        <h5>Mission: ${playbook.scenarioTitle}</h5>
        <p>${playbook.scenarioSummary}</p>
      </div>
      <div class="training-pack-grid">
        <article class="training-pack-card">
          <h6>Lab Setup</h6>
          <ul>${context.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
        <article class="training-pack-card">
          <h6>Execution Tasks</h6>
          <ol>${responseSteps.map((item) => `<li>${item}</li>`).join("")}</ol>
        </article>
        <article class="training-pack-card">
          <h6>Required Deliverables</h6>
          <ul>${artifacts.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
      </div>
      <div class="training-rubric">
        <h6>Assessment Rubric</h6>
        <table>
          <thead><tr><th>Criteria</th><th>Expected Evidence</th><th>Score</th></tr></thead>
          <tbody>
            <tr><td>Technical Accuracy</td><td>Actions align to scenario facts and controls</td><td>0-5</td></tr>
            <tr><td>Evidence Quality</td><td>Artifacts are complete, timestamped, and reproducible</td><td>0-5</td></tr>
            <tr><td>Operational Judgment</td><td>Risk, tradeoffs, and escalation decisions are justified</td><td>0-5</td></tr>
            <tr><td>Outcome Measurement</td><td>${metrics.slice(0, 2).join(" + ") || "At least two measurable improvements documented"}</td><td>0-5</td></tr>
          </tbody>
        </table>
      </div>
      <div class="training-debrief">
        <h6>Debrief Questions</h6>
        <ul>${selfCheck.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
    </section>
  `;
}

function buildStudyExplainer(sectionId) {
  const explainer = studySectionExplainers[sectionId] || extendedStudyModules[sectionId]?.explainer;
  if (!explainer) {
    return "";
  }

  const plainEnglish = studyPlainEnglishMap[sectionId] || extendedStudyModules[sectionId]?.plainEnglish || [
    "This section explains what the topic does and how to use it in real work.",
    "Focus on understanding the why behind controls, not memorizing terms.",
    "If you can explain decisions with evidence, you are progressing correctly."
  ];

  return `
    <div class="study-explainer">
      <h5>Deep Topic Explanation</h5>
      <p><strong>What this section is:</strong> ${explainer.what}</p>
      <p><strong>Why this matters:</strong> ${explainer.why}</p>
      <p><strong>How to work through it:</strong></p>
      <ul>${explainer.how.map((step) => `<li>${step}</li>`).join("")}</ul>
      <p><strong>What success looks like:</strong> ${explainer.success}</p>
      <div class="study-plain-english">
        <h6>Plain English Version</h6>
        <ul>${plainEnglish.map((line) => `<li>${line}</li>`).join("")}</ul>
      </div>
    </div>
  `;
}

const defaultLevelTracks = {
  beginner: [
    "Read this section once for concept flow and terminology.",
    "Define 5 key terms in your own words.",
    "Complete one foundational lab linked to this topic."
  ],
  intermediate: [
    "Implement one configuration or detection from this section.",
    "Measure before/after impact with at least one metric.",
    "Document one tradeoff and why you chose that path."
  ],
  advanced: [
    "Design an improvement plan for enterprise scale.",
    "Add automation and governance controls.",
    "Publish a case-study style write-up with evidence and outcomes."
  ]
};

const studyDiagramData = {
  "endpoint-security": {
    title: "Endpoint Defense Layers",
    bars: [{ label: "Prevent", value: 88 }, { label: "Detect", value: 81 }, { label: "Respond", value: 76 }],
    flow: ["Baseline", "Telemetry", "Containment"]
  },
  "network-security": {
    title: "Zero Trust Control Path",
    bars: [{ label: "Identity", value: 84 }, { label: "Device", value: 79 }, { label: "Network", value: 83 }],
    flow: ["Verify", "Segment", "Authorize"]
  },
  "penetration-testing": {
    title: "Assessment Execution Cycle",
    bars: [{ label: "Recon", value: 74 }, { label: "Validate", value: 86 }, { label: "Retest", value: 78 }],
    flow: ["Scope", "Test", "Report"]
  },
  "architecture-design": {
    title: "Secure Design Priorities",
    bars: [{ label: "Trust Boundaries", value: 82 }, { label: "Control Fit", value: 80 }, { label: "Resilience", value: 85 }],
    flow: ["Model", "Decide", "Validate"]
  },
  "security-automation": {
    title: "Automation Reliability Model",
    bars: [{ label: "Idempotency", value: 87 }, { label: "Testing", value: 75 }, { label: "Rollback", value: 71 }],
    flow: ["Automate", "Verify", "Recover"]
  },
  "security-information": {
    title: "Telemetry Data Quality",
    bars: [{ label: "Completeness", value: 77 }, { label: "Consistency", value: 82 }, { label: "Timeliness", value: 80 }],
    flow: ["Ingest", "Normalize", "Enrich"]
  },
  siem: {
    title: "Detection Program Maturity",
    bars: [{ label: "Coverage", value: 81 }, { label: "Precision", value: 72 }, { label: "Tuning", value: 78 }],
    flow: ["Hypothesis", "Deploy", "Tune"]
  },
  "security-operations": {
    title: "Incident Response Throughput",
    bars: [{ label: "Triage", value: 79 }, { label: "Contain", value: 74 }, { label: "Recover", value: 83 }],
    flow: ["Detect", "Coordinate", "Improve"]
  },
  "threat-modeling": {
    title: "Threat Prioritization Lens",
    bars: [{ label: "Likelihood", value: 76 }, { label: "Impact", value: 84 }, { label: "Mitigation", value: 73 }],
    flow: ["Map", "Rank", "Track"]
  },
  "vulnerability-management": {
    title: "Remediation Lifecycle",
    bars: [{ label: "Prioritize", value: 82 }, { label: "Patch", value: 75 }, { label: "Verify", value: 80 }],
    flow: ["Find", "Fix", "Validate"]
  },
  "soc-ops-analyst-track": {
    title: "SOC Operational Readiness",
    bars: [{ label: "Alert Quality", value: 74 }, { label: "On-Call", value: 77 }, { label: "Audit Ready", value: 81 }],
    flow: ["Monitor", "Respond", "Evidence"]
  },
  "capstone-track": {
    title: "Portfolio Capstone Impact",
    bars: [{ label: "Integration", value: 86 }, { label: "Measurability", value: 79 }, { label: "Presentation", value: 83 }],
    flow: ["Build", "Measure", "Showcase"]
  }
};

const topicQuizBank = {
  "endpoint-security": {
    questions: [
      { prompt: "Which control most directly reduces credential theft blast radius?", options: ["Disable logs", "MFA + least privilege", "Open SMB shares", "Unrestricted local admin"], answer: 1, remediation: "Review identity hardening and privilege minimization patterns." },
      { prompt: "What is the best first step before applying hardening broadly?", options: ["Push to all devices", "Pilot and validate", "Disable EDR", "Skip rollback planning"], answer: 1, remediation: "Revisit phased deployment and rollback strategy." },
      { prompt: "Which metric best reflects endpoint control effectiveness?", options: ["Wallpaper compliance", "Patch + detection + containment timing", "Number of users", "CPU model"], answer: 1, remediation: "Focus on measurable risk-reduction metrics, not vanity metrics." },
      { prompt: "When should local admin privileges be granted?", options: ["Always", "Just-in-time with approval and expiry", "Never logged", "Shared across team"], answer: 1, remediation: "Reinforce JIT elevation and least privilege governance." }
    ]
  },
  "network-security": {
    questions: [
      { prompt: "Zero trust means:", options: ["Trust internal by default", "Always verify access context", "Block all cloud traffic", "Only MFA matters"], answer: 1, remediation: "Review identity, device, and context-based access decisions." },
      { prompt: "Microsegmentation primarily reduces:", options: ["Bandwidth", "Lateral movement", "CPU temperature", "Ticket volume"], answer: 1, remediation: "Map segmentation directly to blast-radius reduction." },
      { prompt: "A mature firewall policy should be:", options: ["Allow-all with logs", "Deny-by-default with owned exceptions", "Static forever", "Anonymous"], answer: 1, remediation: "Reinforce policy ownership and exception governance." },
      { prompt: "Best practice for DNS controls in SOC context:", options: ["No logging", "Log queries + block malicious domains + review anomalies", "Allow wildcard egress", "Disable DNSSEC everywhere"], answer: 1, remediation: "Strengthen DNS logging and anomaly investigation workflows." }
    ]
  },
  "penetration-testing": {
    questions: [
      { prompt: "Primary purpose of enterprise penetration testing:", options: ["Create fear", "Validate control effectiveness", "Generate random CVEs", "Avoid remediation"], answer: 1, remediation: "Frame assessments as control validation with business impact." },
      { prompt: "Best finding statement includes:", options: ["Tool output only", "Exploit path + impact + remediation + retest", "No evidence", "Only severity word"], answer: 1, remediation: "Use structured finding narratives and verification evidence." },
      { prompt: "A high-quality retest confirms:", options: ["Ticket closed", "Vulnerability no longer exploitable", "Scanner offline", "New issue ignored"], answer: 1, remediation: "Require exploitability validation after remediation." },
      { prompt: "Most critical precondition before testing:", options: ["Aggressive scanning only", "Documented scope and authorization", "No logs", "Anonymous execution"], answer: 1, remediation: "Always validate legal scope and explicit approvals first." }
    ]
  },
  "architecture-design": {
    questions: [
      { prompt: "What should drive architecture controls first?", options: ["Aesthetic preference", "Trust boundaries and threat model", "Vendor logo", "Default templates only"], answer: 1, remediation: "Start with trust boundaries and adversary paths." },
      { prompt: "ADR is most useful for:", options: ["Code formatting", "Decision rationale and tradeoffs", "Ticket title", "Run command history"], answer: 1, remediation: "Capture why a security design was chosen over alternatives." },
      { prompt: "Resilient architecture includes:", options: ["Only prevention", "Detection + recovery + rollback paths", "No monitoring", "No ownership"], answer: 1, remediation: "Design for recoverability as well as prevention." },
      { prompt: "Best way to explain an architecture decision:", options: ["Buzzwords", "Threats, controls, tradeoffs, measurable outcome", "No numbers", "Only diagram title"], answer: 1, remediation: "Use structured explanation with measurable impact." }
    ]
  },
  "security-automation": {
    questions: [
      { prompt: "Idempotent automation means:", options: ["Runs once only", "Same safe result on repeated runs", "No logs", "Manual approval always"], answer: 1, remediation: "Refactor scripts for safe repeated execution." },
      { prompt: "Critical automation guardrail:", options: ["No validation", "Rollback + tests + audit logging", "Random execution", "No owner"], answer: 1, remediation: "Add rollback and traceability to every security workflow." },
      { prompt: "Most useful automation metric:", options: ["Script length", "Error rate + cycle time reduction", "Number of comments", "CPU brand"], answer: 1, remediation: "Track outcome metrics, not implementation vanity metrics." },
      { prompt: "Pipeline security gates should run:", options: ["After production incident", "Before merge/deploy and continuously", "Only quarterly", "Never on pull requests"], answer: 1, remediation: "Integrate gates into CI/CD entry points and continuous checks." }
    ]
  },
  "security-information": {
    questions: [
      { prompt: "First priority in telemetry engineering:", options: ["Colorful dashboards", "Data quality and schema consistency", "Random enrichment", "Skip timestamps"], answer: 1, remediation: "Establish schema and quality controls first." },
      { prompt: "Most dangerous data issue for SOC:", options: ["Lower font size", "Missing/incorrect key fields", "Too many tabs", "Dark theme"], answer: 1, remediation: "Protect field integrity and completeness for detections." },
      { prompt: "Why normalization matters:", options: ["Looks cleaner", "Enables reliable cross-source detections", "Reduces storage only", "Replaces triage"], answer: 1, remediation: "Use unified schema to improve query and correlation reliability." },
      { prompt: "Telemetry confidence should be:", options: ["Assumed", "Measured and documented", "Ignored", "Static forever"], answer: 1, remediation: "Track confidence and lineage for enrichment fields." }
    ]
  },
  siem: {
    questions: [
      { prompt: "Best detection design approach:", options: ["Copy random rules", "Hypothesis-driven + validated telemetry", "Alert on everything", "No tuning"], answer: 1, remediation: "Revisit hypothesis-first detection design." },
      { prompt: "A strong tuning practice includes:", options: ["Permanent silent suppressions", "Suppression with owner + expiry", "Ignoring false positives", "Deleting alerts"], answer: 1, remediation: "Use bounded suppressions and change logs." },
      { prompt: "Most useful SIEM metric for analyst health:", options: ["Dashboard count", "Precision + MTTR + queue age", "Font size", "License logo"], answer: 1, remediation: "Track operationally meaningful detection metrics." },
      { prompt: "Best method to validate a new detection:", options: ["Production only", "Replay synthetic attack + benign baseline", "No testing", "Email approval only"], answer: 1, remediation: "Adopt test harness validation before broad deployment." }
    ]
  },
  "security-operations": {
    questions: [
      { prompt: "Best first step during active incident:", options: ["Speculate root cause", "Establish scope and severity with evidence", "Delete logs", "Notify everyone without context"], answer: 1, remediation: "Anchor response in evidence-driven triage and scoping." },
      { prompt: "High-quality incident timeline requires:", options: ["Approximate times", "Timestamped actions + owners", "Only final summary", "No artifacts"], answer: 1, remediation: "Capture precise timeline and ownership for every key action." },
      { prompt: "Post-incident review should produce:", options: ["Blame list", "Actionable control/process improvements", "Silence", "Only screenshots"], answer: 1, remediation: "Convert lessons learned into tracked improvements." },
      { prompt: "Best comms pattern during on-call:", options: ["Ad hoc updates", "Cadenced updates by severity and stakeholders", "No updates", "Only at closure"], answer: 1, remediation: "Use predefined communication cadence with audience-appropriate detail." }
    ]
  },
  "threat-modeling": {
    questions: [
      { prompt: "A threat model should start with:", options: ["Mitigations list", "Assets, boundaries, and trust assumptions", "Patch cadence", "Vendor list"], answer: 1, remediation: "Begin with system context and trust boundaries." },
      { prompt: "Most useful threat model output:", options: ["Poster", "Prioritized risks mapped to controls and owners", "Single score", "No action"], answer: 1, remediation: "Map each risk to concrete control owners and due dates." },
      { prompt: "Residual risk means:", options: ["No risk", "Risk remaining after controls", "Unimportant risk", "Deleted risk"], answer: 1, remediation: "Track and explicitly accept residual risks with accountability." },
      { prompt: "Best cadence for threat modeling:", options: ["One-time", "At design and major change points", "Only after incidents", "Never"], answer: 1, remediation: "Run models continuously at architecture and change milestones." }
    ]
  },
  "vulnerability-management": {
    questions: [
      { prompt: "Best vuln prioritization input set:", options: ["CVSS only", "CVSS + exploitability + asset criticality + exposure", "Asset name", "Patch size"], answer: 1, remediation: "Use contextual risk model rather than score-only ranking." },
      { prompt: "SLA governance requires:", options: ["No owners", "Owner + due date + escalation path", "Monthly guess", "Manual memory"], answer: 1, remediation: "Assign clear accountability and escalations for SLA breaches." },
      { prompt: "Remediation verification means:", options: ["Ticket closed", "Re-scan and exploitability check", "Patch downloaded", "Email sent"], answer: 1, remediation: "Verify closure with objective retest evidence." },
      { prompt: "False positive handling should be:", options: ["Ignored", "Validated and documented with rationale", "Auto-closed always", "Deleted without notes"], answer: 1, remediation: "Formalize false-positive review and documentation workflow." }
    ]
  },
  "capstone-track": {
    questions: [
      { prompt: "Strong capstone success metric is:", options: ["Repo stars", "Measured security outcome over baseline", "Theme color", "Slide count"], answer: 1, remediation: "Define objective baseline and measurable post-change outcomes." },
      { prompt: "Best capstone evidence set includes:", options: ["One screenshot", "Architecture + implementation + metrics + lessons learned", "Only code", "Only summary"], answer: 1, remediation: "Package end-to-end evidence and narrative." },
      { prompt: "Capstone should demonstrate:", options: ["Single isolated skill", "Integration of multiple practical skills across domains", "Only UI", "Only logs"], answer: 1, remediation: "Build integrated workflows that mirror real operations." },
      { prompt: "A strong capstone explanation should cover:", options: ["Tools list", "Problem, approach, tradeoffs, measurable impact", "Company gossip", "No challenges"], answer: 1, remediation: "Use structured explanation with quantified outcomes." }
    ]
  },
  "soc-ops-analyst-track": {
    questions: [
      { prompt: "On-call readiness requires:", options: ["No escalation plan", "Clear severity, handoff, communications", "One-person decisions only", "No documentation"], answer: 1, remediation: "Build explicit paging, handoff, and escalation playbooks." },
      { prompt: "Audit-friendly operations depend on:", options: ["Memory-based evidence", "Traceable artifacts + ownership", "Verbal updates", "Untracked changes"], answer: 1, remediation: "Practice evidence capture during execution, not after." },
      { prompt: "IAM temporary escalation should always include:", options: ["Permanent admin", "TTL + revocation + approval trail", "Shared credentials", "No approvals"], answer: 1, remediation: "Reinforce least-privilege and expiry-based access controls." },
      { prompt: "Best SOC reporting style for leadership:", options: ["Tool-specific logs", "Risk and impact oriented with trend metrics", "No metrics", "Raw packet output only"], answer: 1, remediation: "Translate technical events to business risk and progress trends." }
    ]
  }
};

Object.assign(topicQuizBank, {
  "aws-security-hub-and-detection": {
    questions: [
      { prompt: "Best first triage action for a critical Security Hub finding:", options: ["Close immediately", "Validate finding context, resource exposure, and ownership", "Ignore if no user complaint", "Disable Security Hub"], answer: 1, remediation: "Build a deterministic Security Hub triage checklist with context validation." },
      { prompt: "GuardDuty + CloudTrail correlation primarily helps:", options: ["Theme selection", "Root-cause and scope analysis", "Cost forecasting only", "DNS formatting"], answer: 1, remediation: "Practice linking threat findings to identity and API activity evidence." },
      { prompt: "Strong finding closure evidence includes:", options: ["Status changed only", "Control retest and artifacted remediation proof", "Verbal update", "Ticket reassignment"], answer: 1, remediation: "Require closure artifacts with control validation and timestamped ownership." },
      { prompt: "Best escalation basis for cloud findings:", options: ["Raw severity only", "Severity + exploitability + asset criticality + exposure", "Queue age only", "Analyst preference"], answer: 1, remediation: "Adopt risk-context prioritization over severity labels alone." },
      { prompt: "ASFF WorkflowStatus should be set to NOTIFIED when:", options: ["Alert is auto-suppressed", "A ticket or owner notification has been sent for the finding", "The finding auto-archives", "Control passes"], answer: 1, remediation: "Use WorkflowStatus lifecycle to track investigation state: NEW > NOTIFIED > RESOLVED." },
      { prompt: "GuardDuty finding Stealth:IAMUser/CloudTrailLoggingDisabled indicates:", options: ["Misconfigured region", "Possible attacker covering tracks by disabling CloudTrail", "Normal rotation", "Cost optimization"], answer: 1, remediation: "Treat CloudTrail disable events as active incident indicators — investigate IAM actor immediately." },
      { prompt: "Multi-account Security Hub aggregation uses:", options: ["Manual CSV exports per account", "Aggregation Region + Delegated Administrator via Organizations", "CloudFormation stack sets only", "S3 cross-region replication"], answer: 1, remediation: "Configure a Security account as delegated admin and set an Aggregation Region for centralized findings." },
      { prompt: "An EventBridge rule targeting Security Hub NEW CRITICAL findings should route to:", options: ["Only dashboards", "Lambda/SNS for enrichment, ticketing, or automated response", "CloudWatch only", "S3 archive only"], answer: 1, remediation: "Design EventBridge automations to trigger enrichment and notification workflows for high-severity findings." }
    ]
  },
  "aws-cloud-security-engineering": {
    questions: [
      { prompt: "Most important AWS design primitive for blast-radius reduction:", options: ["Single account", "Multi-account segmentation with guardrails", "No IAM boundaries", "Open egress"], answer: 1, remediation: "Review account segmentation and SCP guardrail patterns." },
      { prompt: "Least-privilege IAM maturity requires:", options: ["* permissions", "Scoped roles + review + denied-action feedback loop", "Permanent admin", "No logging"], answer: 1, remediation: "Implement role refinement and periodic privilege recertification." },
      { prompt: "Cloud logging quality depends on:", options: ["Storage class only", "Coverage, integrity, retention, and access controls", "UI color", "Region name"], answer: 1, remediation: "Strengthen log coverage and integrity controls across accounts." },
      { prompt: "Best cloud response pattern:", options: ["Manual-only", "Automated enrich + governed containment + evidence capture", "Delete resources", "Silence alerts"], answer: 1, remediation: "Design automated response stages with approval and audit artifacts." },
      { prompt: "IAM policy evaluation order: which layer takes precedence above all others?", options: ["Identity-based policy", "Explicit Deny from any policy layer", "Session policy", "Resource-based policy"], answer: 1, remediation: "An explicit Deny in any policy always overrides any Allow — know the 6-step evaluation order." },
      { prompt: "A Service Control Policy (SCP) that omits an action means:", options: ["Action is allowed by default", "Action is implicitly denied regardless of identity policy", "Action requires MFA", "Action is logged only"], answer: 1, remediation: "SCPs whitelist what is possible — omission is implicit denial, not a pass-through." },
      { prompt: "AWS KMS envelope encryption stores:", options: ["Plaintext data key alongside data", "Encrypted data key alongside the ciphertext", "CMK private key in S3", "No key material"], answer: 1, remediation: "Understand data key generation, CMK wrapping, and the decrypt flow for KMS envelope encryption." },
      { prompt: "VPC Security Groups differ from Network ACLs because Security Groups are:", options: ["Stateless and subnet-level", "Stateful and instance-level with allow-only rules", "Priority-ordered line rules", "Applied only to RDS"], answer: 1, remediation: "Security Groups = stateful + instance scope + allow-only. NACLs = stateless + subnet scope + allow/deny." },
      { prompt: "When responding to an EC2 compromise, the first forensic step before isolation is:", options: ["Terminate the instance", "Take an EBS snapshot to preserve forensic evidence", "Rotate all keys immediately", "Remove the IAM role"], answer: 1, remediation: "Always snapshot before isolation — termination or policy changes can destroy volatile evidence." }
    ]
  },
  "siem-tooling-platform-depth": {
    questions: [
      { prompt: "Cross-SIEM detection portability starts with:", options: ["UI export", "Normalized field logic and detection intent mapping", "Dashboard screenshot", "Licensing model"], answer: 1, remediation: "Map detection logic to normalized schemas before platform syntax." },
      { prompt: "Best tuning KPI for SIEM operations:", options: ["Rule count", "Precision, MTTR, and queue health", "Color themes", "Ingest size only"], answer: 1, remediation: "Track triage-centric operational metrics for tuning effectiveness." },
      { prompt: "When migrating SIEM tools, highest risk is:", options: ["New logo", "Detection gaps from schema/query mismatch", "Faster searches", "Case IDs"], answer: 1, remediation: "Run parity validation for high-risk detections during migration." },
      { prompt: "Security Onion/Kibana value is strongest when:", options: ["No enrichment", "Combined with disciplined detection lifecycle and triage workflow", "Only packet capture", "No ownership"], answer: 1, remediation: "Pair telemetry visibility with owned detection and triage process." }
    ]
  },
  "edr-and-edrm-operations": {
    questions: [
      { prompt: "Best first step in high-fidelity EDR alert handling:", options: ["Immediate wipe", "Scope validation using process, host, and identity context", "Ignore", "Disable agent"], answer: 1, remediation: "Use structured EDR triage before containment actions." },
      { prompt: "Containment decisions should consider:", options: ["Only severity tag", "Business criticality, blast radius, and recovery path", "Analyst mood", "Ticket age"], answer: 1, remediation: "Practice risk-balanced containment with rollback awareness." },
      { prompt: "Post-remediation verification requires:", options: ["Ticket close", "Objective evidence host is no longer compromised", "One reboot", "Email confirmation"], answer: 1, remediation: "Collect concrete eradication evidence before closure." },
      { prompt: "EDRM maturity is shown by:", options: ["More alerts", "Consistent evidence, repeatable workflow, and lower recurrence", "Long notes", "Manual-only response"], answer: 1, remediation: "Standardize endpoint response workflows and recurrence tracking." }
    ]
  },
  "palo-alto-firewall-operations": {
    questions: [
      { prompt: "Strong Palo Alto policy model is:", options: ["Allow-all", "Deny-by-default with explicit governed exceptions", "Static forever", "No ownership"], answer: 1, remediation: "Implement deny-by-default policy and exception lifecycle controls." },
      { prompt: "Most useful incident triage artifact from NGFW:", options: ["License SKU", "Traffic/threat logs correlated with identity and app context", "Theme config", "Hostname only"], answer: 1, remediation: "Correlate firewall telemetry with SIEM/identity context for investigations." },
      { prompt: "Threat profile tuning should prioritize:", options: ["Max noise", "Risk-relevant detections with controlled false positives", "No alerts", "Random blocks"], answer: 1, remediation: "Tune profiles with measured precision and coverage impact." },
      { prompt: "Best exception governance for firewall rules:", options: ["No expiry", "Owner + reason + review date + validation", "Chat approval", "Permanent bypass"], answer: 1, remediation: "Apply full exception metadata and periodic recertification." },
      { prompt: "App-ID identifies applications using:", options: ["Port numbers only", "Multi-phase pipeline including signatures, protocol decoding, and behavioral analysis", "IP addresses only", "Vendor labels"], answer: 1, remediation: "Review App-ID classification phases: known-port, signature, decode, heuristic." },
      { prompt: "DNS Sinkhole in Anti-Spyware profile is used to:", options: ["Block all DNS", "Identify infected hosts that resolve known-malicious domains", "Speed up DNS", "Replace DNS server"], answer: 1, remediation: "Configure DNS sinkhole IP and monitor Traffic logs for hosts attempting sinkhole connections." },
      { prompt: "Panorama Device Groups are used to:", options: ["Manage hardware inventory", "Distribute shared policy to a set of managed firewalls", "Store log files", "Handle VPN routing"], answer: 1, remediation: "Understand Panorama Device Group pre-rules, post-rules, and local rule hierarchy." },
      { prompt: "SSL Forward Proxy decryption requires:", options: ["Server private key on firewall", "Firewall CA cert trusted by endpoints", "No certificate changes", "Only HTTP traffic"], answer: 1, remediation: "Deploy your CA cert to endpoints via GPO/MDM before enabling Forward Proxy decryption." },
      { prompt: "GlobalProtect HIP checks enforce:", options: ["Application performance", "Endpoint posture conditions for network access", "Bandwidth limits", "DNS speed"], answer: 1, remediation: "Configure HIP objects for disk encryption, EDR presence, and OS patch level requirements." }
    ]
  },
  "xsoar-and-security-automation-platforms": {
    questions: [
      { prompt: "Safest first SOAR automation target:", options: ["Auto-isolate all hosts", "Context enrichment and low-risk evidence gathering", "Delete accounts", "Block internet"], answer: 1, remediation: "Start with enrichment and non-disruptive automation steps." },
      { prompt: "High-impact automated actions should require:", options: ["No controls", "Approval gates and rollback path", "Single click only", "No logs"], answer: 1, remediation: "Add controlled approval and rollback design to playbooks." },
      { prompt: "Playbook reliability depends on:", options: ["Longer scripts", "Error handling, retries, and deterministic branching", "More APIs", "UI color"], answer: 1, remediation: "Harden playbooks with robust failure-path engineering." },
      { prompt: "Best automation success metric:", options: ["Step count", "Cycle-time reduction with stable quality", "Lines of YAML", "Number of integrations"], answer: 1, remediation: "Track operational outcomes, not implementation size." }
    ]
  }
});

const mockInterviewBank = {
  "endpoint-security": [
    {
      question: "A business unit demands local admin access for all developers due to productivity complaints. How would you respond as the security engineer?",
      include: ["Risk framing with abuse scenarios", "Alternative model (JIT elevation + approvals)", "Pilot plan and success metrics", "Exception governance with expiry"],
      misses: ["Binary yes/no response without alternatives", "No measurable outcome plan"]
    },
    {
      question: "Describe your endpoint hardening rollout strategy across 5,000 devices with minimal disruption.",
      include: ["Phased deployment tiers", "Rollback criteria", "Health and compliance telemetry", "Stakeholder communication plan"],
      misses: ["No pilot or rollback", "No business continuity safeguards"]
    }
  ],
  "network-security": [
    {
      question: "You discover broad allow rules between user and server VLANs. What remediation approach do you take?",
      include: ["Flow mapping and owner validation", "Deny-by-default migration", "Exception control process", "Verification tests and impact monitoring"],
      misses: ["Immediate blanket blocks", "No ownership mapping"]
    }
  ],
  siem: [
    {
      question: "Your SOC is overwhelmed with noisy alerts from a new detection rule. Walk through your tuning methodology.",
      include: ["Baseline false-positive analysis", "Suppression with owner/expiry", "Replay test validation", "Before/after precision metrics"],
      misses: ["Permanent suppressions", "No validation strategy"]
    }
  ],
  "security-operations": [
    {
      question: "During a high-severity incident at 2 AM, how do you structure response communications and ownership?",
      include: ["Severity-based update cadence", "Clear action owners", "Evidence/facts vs assumptions", "Handoff package for day shift"],
      misses: ["Ad hoc updates only", "No ownership clarity"]
    }
  ],
  "soc-ops-analyst-track": [
    {
      question: "Explain how you would run SOC operations in a regulated environment while supporting audits and on-call readiness.",
      include: ["Traceable evidence workflows", "On-call runbooks and SLAs", "IAM governance controls", "Continuous improvement metrics"],
      misses: ["No audit mapping", "No measurable SOC KPIs"]
    },
    {
      question: "How do you prioritize competing incidents, vulnerability findings, and audit requests in the same week?",
      include: ["Risk-based prioritization model", "Stakeholder alignment and escalation", "Time-boxed operational planning", "Transparent tradeoff communication"],
      misses: ["First-in-first-out handling", "No prioritization framework"]
    }
  ],
  "capstone-track": [
    {
      question: "Walk through your capstone from business problem to measurable security outcome.",
      include: ["Problem context and constraints", "Architecture and implementation choices", "Tradeoffs and lessons learned", "Outcome metrics against baseline"],
      misses: ["Tool list without reasoning", "No measurable impact evidence"]
    }
  ],
  default: [
    {
      question: "Describe your approach to balancing prevention, detection, and response in this topic area.",
      include: ["Control layering", "Operational constraints", "Metrics and validation", "Iteration/improvement loop"],
      misses: ["Single-control dependency", "No measurable outcomes"]
    }
  ]
};

Object.assign(mockInterviewBank, {
  "aws-security-hub-and-detection": [
    {
      question: "A critical Security Hub finding indicates public exposure of sensitive resources. Walk through your triage and response strategy.",
      include: ["Validate finding confidence and resource exposure", "Determine blast radius and affected data", "Assign owner + containment path", "Capture closure evidence and retest"],
      misses: ["Severity-only escalation without context", "No verification of remediation effectiveness"]
    }
  ],
  "siem-tooling-platform-depth": [
    {
      question: "How would you migrate a high-value detection from Splunk to another SIEM while preserving quality and analyst workflow?",
      include: ["Normalize fields and detection intent", "Map syntax + platform constraints", "Replay validation dataset", "Measure precision/recall delta"],
      misses: ["Syntax-only migration", "No validation plan"]
    }
  ],
  "edr-and-edrm-operations": [
    {
      question: "You receive an EDR alert for suspicious PowerShell behavior on a finance endpoint. Describe your full response process.",
      include: ["Scope and confidence validation", "Containment decision with business impact", "Forensic evidence collection", "Recovery and recurrence prevention"],
      misses: ["Immediate destructive action", "No evidence capture strategy"]
    }
  ],
  "xsoar-and-security-automation-platforms": [
    {
      question: "Design a safe XSOAR playbook for phishing triage with optional containment actions.",
      include: ["Automated enrichment steps", "Confidence-based branching", "Approval gate before high-impact actions", "Metrics and failure-path logging"],
      misses: ["Over-automation of disruptive actions", "No rollback/failure handling"]
    }
  ]
});

function getInterviewQuestions(topic) {
  if (topic === "all") {
    return getAllStudyTopicIds()
      .map((key) => (mockInterviewBank[key] || mockInterviewBank.default)[0])
      .filter(Boolean)
      .slice(0, 8);
  }
  return mockInterviewBank[topic] || mockInterviewBank.default;
}

function getExamQuestions(mode, topic) {
  if (mode === "topic") {
    return getTopicQuiz(topic).questions.map((q) => ({ ...q, topic }));
  }

  const all = getAllStudyTopicIds().flatMap((key) =>
    getTopicQuiz(key).questions.map((q) => ({ ...q, topic: key }))
  );
  return all.sort(() => Math.random() - 0.5).slice(0, 25);
}

function buildStudyDiagram(sectionId) {
  const diagram = studyDiagramData[sectionId] || studyDiagramData["endpoint-security"];
  const [a, b, c] = diagram.bars;
  return `
    <div class="study-diagram" aria-label="${diagram.title}">
      <h5>${diagram.title}</h5>
      <svg viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${diagram.title}">
        <rect x="20" y="20" width="720" height="180" rx="12" fill="rgba(10,28,43,0.75)" stroke="rgba(110,168,213,0.3)"/>
        <text x="40" y="52" font-size="14" fill="#cfe5f3">Control Maturity Snapshot</text>
        <text x="40" y="88" font-size="12" fill="#9fc2d8">${a.label}</text>
        <rect x="140" y="77" width="240" height="12" rx="6" fill="#1f4157"/>
        <rect x="140" y="77" width="${Math.round((a.value / 100) * 240)}" height="12" rx="6" fill="#49c8f0"/>
        <text x="388" y="88" font-size="11" fill="#a9cfe1">${a.value}%</text>

        <text x="40" y="120" font-size="12" fill="#9fc2d8">${b.label}</text>
        <rect x="140" y="109" width="240" height="12" rx="6" fill="#1f4157"/>
        <rect x="140" y="109" width="${Math.round((b.value / 100) * 240)}" height="12" rx="6" fill="#78e7bd"/>
        <text x="388" y="120" font-size="11" fill="#a9cfe1">${b.value}%</text>

        <text x="40" y="152" font-size="12" fill="#9fc2d8">${c.label}</text>
        <rect x="140" y="141" width="240" height="12" rx="6" fill="#1f4157"/>
        <rect x="140" y="141" width="${Math.round((c.value / 100) * 240)}" height="12" rx="6" fill="#49c8f0"/>
        <text x="388" y="152" font-size="11" fill="#a9cfe1">${c.value}%</text>

        <text x="440" y="88" font-size="12" fill="#9fc2d8">Execution Flow</text>
        <rect x="440" y="100" width="88" height="28" rx="8" fill="rgba(73,200,240,0.12)" stroke="rgba(73,200,240,0.44)"/>
        <text x="484" y="118" text-anchor="middle" font-size="11" fill="#b7d6e7">${diagram.flow[0]}</text>
        <text x="536" y="118" font-size="15" fill="#8cb5ce">→</text>
        <rect x="552" y="100" width="88" height="28" rx="8" fill="rgba(120,231,189,0.12)" stroke="rgba(120,231,189,0.44)"/>
        <text x="596" y="118" text-anchor="middle" font-size="11" fill="#b7d6e7">${diagram.flow[1]}</text>
        <text x="648" y="118" font-size="15" fill="#8cb5ce">→</text>
        <rect x="664" y="100" width="64" height="28" rx="8" fill="rgba(73,200,240,0.12)" stroke="rgba(73,200,240,0.44)"/>
        <text x="696" y="118" text-anchor="middle" font-size="11" fill="#b7d6e7">${diagram.flow[2]}</text>
      </svg>
    </div>
  `;
}

function getTopicQuiz(sectionId) {
  return topicQuizBank[sectionId] || {
    questions: [
      { prompt: "Which statement best reflects mastery of this topic?", options: ["I can repeat terms", "I can explain tradeoffs and implement controls", "I skimmed headings", "I skipped practice"], answer: 1, remediation: "Focus on explanation + implementation, not memorization." },
      { prompt: "What should follow topic study?", options: ["Nothing", "One linked practical exercise", "Delete notes", "Move on instantly"], answer: 1, remediation: "Pair every section with a practical lab to retain knowledge." },
      { prompt: "Best evidence of readiness is:", options: ["Long notes only", "Measured outcomes and clear artifacts", "No documentation", "Verbal summary only"], answer: 1, remediation: "Capture artifacts and metrics for interview and portfolio readiness." }
    ]
  };
}

function buildTopicQuiz(sectionId) {
  const quiz = getTopicQuiz(sectionId);
  const questionBlocks = quiz.questions
    .map((q, idx) => {
      const options = q.options
        .map(
          (opt, optIdx) =>
            `<label><input type="radio" name="${sectionId}-q${idx}" value="${optIdx}" /> ${opt}</label>`
        )
        .join("");
      return `<fieldset><legend>${idx + 1}. ${q.prompt}</legend>${options}</fieldset>`;
    })
    .join("");

  return `
    <div class="topic-quiz" data-topic="${sectionId}">
      <h5>Topic Quiz: Check Your Understanding</h5>
      <form class="topic-quiz-form">
        ${questionBlocks}
        <button class="btn btn-primary" type="submit">Score Topic Quiz</button>
      </form>
      <div class="topic-quiz-result" aria-live="polite"></div>
    </div>
  `;
}

function getLevelTracks(sectionId) {
  const custom = {
    "endpoint-security": {
      beginner: ["Apply 10 baseline controls on a test endpoint.", "Verify encryption, firewall, and EDR status.", "Record drift findings in a checklist."],
      intermediate: ["Automate one compliance check script.", "Create exception workflow with expiration.", "Map controls to top endpoint attack paths."],
      advanced: ["Design phased rollout + rollback plan.", "Build compliance dashboard with trends.", "Present business-risk reduction summary."]
    },
    siem: {
      beginner: ["Read and explain one detection query line-by-line.", "Identify required telemetry fields.", "Classify one alert as TP/FP with rationale."],
      intermediate: ["Tune one noisy rule and log changes.", "Replay safe test data for validation.", "Track precision/recall change."],
      advanced: ["Build ATT&CK-mapped detection bundle.", "Define retirement criteria for stale rules.", "Create SOC handoff runbook for rule ownership."]
    },
    "soc-ops-analyst-track": {
      beginner: ["Walk through on-call escalation matrix.", "Simulate one triage scenario.", "Prepare a concise incident status update."],
      intermediate: ["Run phishing analysis workflow end-to-end.", "Correlate SIEM and EDR event context.", "Draft an audit-ready evidence packet."],
      advanced: ["Lead full simulation with cross-team comms.", "Produce executive incident brief and lessons learned.", "Quantify operational improvement targets."]
    }
  };

  return custom[sectionId] || defaultLevelTracks;
}

function createExtendedStudySection(moduleId, module, indexOffset) {
  const section = document.createElement("section");
  section.id = moduleId;
  section.className = "study-section reveal";
  section.classList.add("is-visible");
  section.innerHTML = `
    <h2>${indexOffset}. ${module.title}</h2>
    <div class="study-content">
      <div class="reading-time">Reading time: ${module.readingTime} | Hands-on topic module</div>
      <h3>Section Overview</h3>
      <p>${module.overview}</p>
      <h3>Operational Architecture</h3>
      <p>${module.architecture}</p>
      <h3>Hands-On Focus Areas</h3>
      <ul>${module.handsOn.map((item) => `<li>${item}</li>`).join("")}</ul>
      <h3>Key Tools and Platforms</h3>
      <ul>${module.tools.map((item) => `<li>${item}</li>`).join("")}</ul>
      <h3>Expected Outcomes</h3>
      <ul>${module.outcomes.map((item) => `<li>${item}</li>`).join("")}</ul>
      ${module.deepContent || ""}
    </div>
  `;
  return section;
}

function ensureExtendedStudySections() {
  if (document.getElementById("aws-security-hub-and-detection")) {
    return;
  }

  const nav = document.querySelector(".study-nav");
  const firstAnchor = document.getElementById("capstone-track");
  const main = document.querySelector("main");
  let insertAfter = firstAnchor;
  let order = 13;

  Object.entries(extendedStudyModules).forEach(([moduleId, module]) => {
    if (document.getElementById(moduleId)) {
      return;
    }

    const section = createExtendedStudySection(moduleId, module, order);
    order += 1;

    if (insertAfter) {
      insertAfter.insertAdjacentElement("afterend", section);
      insertAfter = section;
    } else if (main) {
      main.appendChild(section);
      insertAfter = section;
    }

    if (nav) {
      const link = document.createElement("a");
      link.href = `#${moduleId}`;
      link.textContent = module.navLabel;
      nav.appendChild(link);
    }
  });
}

function organizeStudyNav() {
  const nav = document.querySelector(".study-nav");
  if (!nav) {
    return;
  }

  const links = [...nav.querySelectorAll("a")];
  if (!links.length) {
    return;
  }

  const byId = Object.fromEntries(
    links.map((link) => [link.getAttribute("href")?.replace("#", ""), link])
  );

  const groups = [
    {
      title: "Core Security Foundations",
      ids: [
        "endpoint-security",
        "network-security",
        "penetration-testing",
        "architecture-design",
        "security-operations",
        "threat-modeling",
        "vulnerability-management",
        "capstone-track": {
          prerequisites: ["Comfort across multiple security domains", "Project scoping and planning", "Basic metrics definition"],
          coreConcepts: ["Integrated security delivery", "Evidence-based storytelling", "Outcome measurement"],
          practiceDrills: [
            "Build one end-to-end project combining detection, response, and governance controls.",
            "Capture baseline, intervention, and post-change metrics with reproducible evidence.",
            "Publish a case-study narrative with tradeoffs, failures, and final outcomes."
          ],
          selfCheck: ["Can you explain your decisions and tradeoffs clearly?", "Can you prove impact with measurable outcomes?"]
        },
        "cloud-security": {
          prerequisites: ["Cloud platform account basics", "IAM fundamentals", "Networking concepts (VPC, subnets, security groups)"],
          coreConcepts: ["Cloud-native threat model", "Least-privilege IAM design", "Immutable logging and CSPM"],
          practiceDrills: [
            "Audit an AWS account for public S3 buckets, over-permissive IAM roles, and logging gaps using CLI commands.",
            "Write an SCP that enforces deny-CloudTrail-delete and deny-public-S3 at the organization level.",
            "Map 5 GuardDuty finding types to ATT&CK techniques and write a response playbook for each."
          ],
          selfCheck: ["Can you explain the cloud shared responsibility model for each service type?", "Can you detect and contain a compromised IAM key in under 30 minutes?"]
        },
        "identity-access-management": {
          prerequisites: ["Authentication vs authorization basics", "Active Directory or LDAP familiarity", "MFA concepts"],
          coreConcepts: ["Zero standing privilege", "Federation and SSO protocols", "Access lifecycle governance"],
          practiceDrills: [
            "Conduct a stale-account audit: find accounts inactive >90 days and build a disable/delete workflow.",
            "Design a JIT access process for admin roles using existing tooling (Azure PIM, AWS Identity Center, or equivalent).",
            "Write a Conditional Access policy that blocks legacy authentication and enforces MFA outside corporate IP."
          ],
          selfCheck: ["Can you explain the difference between SAML and OIDC and when to use each?", "Can you scope a service account to minimum viable permissions?"]
        },
        "cryptography-pki": {
          prerequisites: ["Basic networking (TLS handshake)", "Public vs private key concept", "Linux CLI comfort"],
          coreConcepts: ["Cipher suite evaluation", "PKI and certificate lifecycle", "Key management practices"],
          practiceDrills: [
            "Scan 10 internal hosts with testssl.sh and produce a remediation list grouped by risk (weak cipher, expired cert, TLS 1.0/1.1).",
            "Generate a CA, issue a server cert, and verify the full chain using OpenSSL commands.",
            "Audit a codebase for 3 common crypto mistakes: hardcoded keys, ECB mode, and MD5 password hashing."
          ],
          selfCheck: ["Can you explain why AES-GCM is preferred over AES-CBC?", "Can you identify a certificate misconfiguration from openssl s_client output?"]
        },
        "malware-analysis": {
          prerequisites: ["Basic command line (Windows and Linux)", "Understanding of PE file format", "Networking basics (DNS, HTTP)"],
          coreConcepts: ["Static triage workflow", "Behavioral analysis interpretation", "IOC extraction and ATT&CK mapping"],
          practiceDrills: [
            "Perform a full static triage on a sample from MalwareBazaar: hash, strings, PE imports, packed indicators.",
            "Submit a sample to Any.run and extract: dropped files, network IOCs, registry modifications, and ATT&CK techniques.",
            "Write a YARA rule for a malware family based on unique strings or byte patterns extracted from a sample."
          ],
          selfCheck: ["Can you explain the difference between process injection and process hollowing?", "Can you build a detection from a malware analysis report?"]
        },
        "digital-forensics": {
          prerequisites: ["Incident response basics", "Windows and Linux file systems", "Log formats (Windows Event Log, syslog)"],
          coreConcepts: ["Order of volatility", "Chain of custody", "Timeline correlation across sources"],
          practiceDrills: [
            "Practice a Windows live triage using PowerShell: running processes, network connections, recently modified files, scheduled tasks.",
            "Create a forensic disk image of a VM using FTK Imager or dc3dd and verify integrity with hashes.",
            "Use Volatility 3 to analyze a memory dump: process list, network artifacts, injected code regions."
          ],
          selfCheck: ["Can you explain chain of custody requirements for a legal investigation?", "Can you reconstruct an attacker timeline from logs, memory, and disk artifacts?"]
        },
        "grc-compliance": {
          prerequisites: ["Basic security concepts", "Risk management concepts", "Familiarity with at least one framework (NIST, ISO, SOC 2)"],
          coreConcepts: ["Risk quantification and registers", "Audit evidence management", "Control mapping across frameworks"],
          practiceDrills: [
            "Build a 10-row risk register for a fictional SaaS company with likelihood, impact, inherent risk, controls, and residual risk.",
            "Map 5 security controls to NIST CSF 2.0 functions and at least one other framework (ISO 27001, SOC 2, or PCI DSS).",
            "Write a compensating control justification for a PCI DSS requirement that cannot be met in full, including evidence plan."
          ],
          selfCheck: ["Can you explain the difference between Type I and Type II SOC 2 reports?", "Can you articulate business risk in executive-friendly language without technical jargon?"]
        },
        "application-security": {
          prerequisites: ["Basic web development concepts", "HTTP request/response model", "One scripting language (Python, JS, or similar)"],
          coreConcepts: ["OWASP Top 10 exploitation and prevention", "Secure SDLC integration", "SAST/DAST/SCA toolchain"],
          practiceDrills: [
            "Run Semgrep against an open-source app (DVWA or Juice Shop source) and triage findings by exploitability.",
            "Exploit 3 OWASP Top 10 vulnerabilities in DVWA (SQL injection, XSS, IDOR) and write a developer-facing remediation note for each.",
            "Write a GitHub Actions pipeline step that blocks PRs with HIGH or CRITICAL SAST findings."
          ],
          selfCheck: ["Can you explain IDOR and why authz checks must be server-side?", "Can you integrate a SAST tool into a CI/CD pipeline and tune it to reduce false positives?"]
        },
        "container-security": {
          prerequisites: ["Docker basics", "Kubernetes pod and deployment concepts", "YAML familiarity"],
          coreConcepts: ["Container image hardening", "Kubernetes RBAC and admission control", "Runtime detection"],
          practiceDrills: [
            "Scan a publicly available Docker image with Trivy and produce an exploitability-prioritized remediation report.",
            "Write a Kubernetes NetworkPolicy that denies all ingress by default and allows only labeled frontend pods to reach the API service.",
            "Audit a K8s cluster for privileged pods, host namespace mounts, and service accounts with cluster-admin bindings."
          ],
          selfCheck: ["Can you explain how a container breakout could escalate to node compromise?", "Can you enforce non-root and read-only file system requirements using Pod Security Admission?"]
        }
      };
    {
      title: "Firewalls and Network Controls",
      ids: ["palo-alto-firewall-operations", "checkpoint-and-firewall-technologies"]
    },
    {
      title: "Automation, Workflow, and Operations Track",
      ids: ["security-automation", "xsoar-and-security-automation-platforms", "atlassian-jira-confluence-security-workflows", "security-scripting-programming-practice", "certification-and-standards-roadmap"]
    }
  ];

  const rendered = groups
    .map((group) => {
      const items = group.ids
        .map((id) => byId[id])
        .filter(Boolean)
        .map((link) => `<a href="${link.getAttribute("href")}">${link.textContent}</a>`)
        .join("");

      if (!items) {
        return "";
      }

      return `
        <section class="study-nav-group">
          <h3>${group.title}</h3>
          <div class="study-nav-links">${items}</div>
        </section>
      `;
    })
    .join("");

  nav.classList.add("grouped-nav");
  nav.innerHTML = rendered;
}

function syncPrepTopicSelectors(sections) {
  const topics = sections
    .map((section) => {
      const heading = section.querySelector("h2")?.textContent || section.id;
      const label = heading.replace(/^\d+\.\s*/, "").trim();
      return { id: section.id, label };
    })
    .filter((item) => item.id);

  const interviewSelect = document.getElementById("interviewTopicSelect");
  if (interviewSelect) {
    interviewSelect.innerHTML = `<option value="all">All topics (mixed)</option>${topics
      .map((topic) => `<option value="${topic.id}">${topic.label}</option>`)
      .join("")}`;
  }

  const examSelect = document.getElementById("examTopicSelect");
  if (examSelect) {
    examSelect.innerHTML = topics
      .map((topic) => `<option value="${topic.id}">${topic.label}</option>`)
      .join("");
  }
}

function collapseStudySubchapters(sections) {
  sections.forEach((section) => {
    const content = section.querySelector(".study-content");
    if (!content || content.dataset.collapsedReady === "true") {
      return;
    }

    const nodes = [...content.childNodes];
    let currentDetails = null;
    let currentBody = null;
    let chapterIndex = 0;

    nodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "H3") {
        chapterIndex += 1;
        const details = document.createElement("details");
        details.className = "study-subchapter";
        if (chapterIndex === 1) {
          details.open = true;
        }

        const summary = document.createElement("summary");
        summary.textContent = node.textContent || `Section ${chapterIndex}`;

        const body = document.createElement("div");
        body.className = "study-subchapter-body";

        details.append(summary, body);
        content.insertBefore(details, node);
        node.remove();
        currentDetails = details;
        currentBody = body;
        return;
      }

      if (currentBody) {
        currentBody.appendChild(node);
      }
    });

    content.dataset.collapsedReady = "true";
  });
}

function enhanceStudiesPage() {
  ensureExtendedStudySections();
  organizeStudyNav();
  const sections = [...document.querySelectorAll(".study-section")];
  if (!sections.length) {
    return;
  }

  syncPrepTopicSelectors(sections);
  collapseStudySubchapters(sections);

  const studyStorageKey = "cyberskillforge-study-progress";
  const rawStudyState = localStorage.getItem(studyStorageKey);
  const studyState = rawStudyState
    ? JSON.parse(rawStudyState)
    : { mastered: {}, checklist: {}, quiz: {}, exam: { history: [], misses: {} }, interview: { history: [], rubricAverages: {} }, remediation: {} };
  studyState.mastered = studyState.mastered || {};
  studyState.checklist = studyState.checklist || {};
  studyState.quiz = studyState.quiz || {};
  studyState.exam = studyState.exam || { history: [], misses: {} };
  studyState.interview = studyState.interview || { history: [], rubricAverages: {} };
  studyState.remediation = studyState.remediation || {};

  function persistStudyState() {
    localStorage.setItem(studyStorageKey, JSON.stringify(studyState));
  }

  sections.forEach((section) => {
    const content = section.querySelector(".study-content");
    if (!content || content.querySelector(".study-guide")) {
      return;
    }

    const guide = getStudyGuide(section.id);
    if (!guide) {
      return;
    }

    const block = document.createElement("aside");
    block.className = "study-guide";
    const levelTracks = getLevelTracks(section.id);
    block.innerHTML = `
      <h4>Guided Learning Path for This Topic</h4>
      ${buildStudyExplainer(section.id)}
      ${buildAppliedFieldGuide(section.id)}
      ${buildRealisticTrainingPackage(section.id)}
      <div class="study-guide-grid">
        <div class="study-guide-card">
          <h5>Prerequisites</h5>
          <ul>${guide.prerequisites.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div class="study-guide-card">
          <h5>Core Concepts</h5>
          <ul>${guide.coreConcepts.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div class="study-guide-card">
          <h5>Practice Drills</h5>
          <ul>${guide.practiceDrills.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div class="study-guide-card">
          <h5>Self-Check Questions</h5>
          <ul>${guide.selfCheck.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
      </div>
      ${buildStudyDiagram(section.id)}
      <div class="level-tabs" role="tablist" aria-label="Learning level tabs">
        <button class="level-tab is-active" type="button" data-level="beginner">Beginner</button>
        <button class="level-tab" type="button" data-level="intermediate">Intermediate</button>
        <button class="level-tab" type="button" data-level="advanced">Advanced</button>
      </div>
      <div class="level-panel">
        <h5>Learning Steps by Level</h5>
        <ul>${levelTracks.beginner.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="study-checklist" data-section-id="${section.id}">
        <p>Completion checklist</p>
        <label><input type="checkbox" data-check="read" /> Read section fully and summarize key ideas.</label>
        <label><input type="checkbox" data-check="practice" /> Complete at least one linked lab activity.</label>
        <label><input type="checkbox" data-check="evidence" /> Capture evidence and write outcome notes.</label>
      </div>
      <div class="study-check">
        <p>Learning checkpoint:</p>
        <ul>
          <li>Summarize this topic in 5 sentences without notes.</li>
          <li>Execute one linked lab and capture evidence.</li>
          <li>Explain one tradeoff decision you made and why.</li>
        </ul>
      </div>
      ${buildTopicQuiz(section.id)}
    `;

    const firstParagraph = content.querySelector("p");
    if (firstParagraph) {
      firstParagraph.insertAdjacentElement("beforebegin", block);
    } else {
      content.prepend(block);
    }

    const heading = section.querySelector("h2");
    if (heading && !heading.querySelector(".study-master-toggle")) {
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "study-master-toggle";
      toggle.textContent = "Mark mastered";
      toggle.dataset.sectionId = section.id;
      heading.appendChild(toggle);
    }
  });

  const levelMap = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };
  document.querySelectorAll(".study-guide").forEach((guideBlock) => {
    const section = guideBlock.closest(".study-section");
    if (!section) {
      return;
    }
    const tracks = getLevelTracks(section.id);
    const tabs = [...guideBlock.querySelectorAll(".level-tab")];
    const panel = guideBlock.querySelector(".level-panel");
    if (!tabs.length || !panel) {
      return;
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((item) => item.classList.remove("is-active"));
        tab.classList.add("is-active");
        const level = tab.dataset.level;
        const steps = (tracks[level] || []).map((item) => `<li>${item}</li>`).join("");
        panel.innerHTML = `<h5>${levelMap[level] || "Learning"} Track</h5><ul>${steps}</ul>`;
      });
    });
  });

  sections.forEach((section) => {
    const checklist = section.querySelector(".study-checklist");
    if (!checklist) {
      return;
    }
    const sectionId = section.id;
    const savedChecks = studyState.checklist[sectionId] || {};
    checklist.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
      const key = checkbox.dataset.check;
      checkbox.checked = Boolean(savedChecks[key]);
      checkbox.addEventListener("change", () => {
        studyState.checklist[sectionId] = studyState.checklist[sectionId] || {};
        studyState.checklist[sectionId][key] = checkbox.checked;
        persistStudyState();
        updateStudySummary();
      });
    });
  });

  document.querySelectorAll(".topic-quiz").forEach((quizBlock) => {
    const topic = quizBlock.dataset.topic;
    const form = quizBlock.querySelector(".topic-quiz-form");
    const result = quizBlock.querySelector(".topic-quiz-result");
    const quiz = getTopicQuiz(topic);
    if (!form || !result) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let score = 0;
      const remediation = [];

      quiz.questions.forEach((question, idx) => {
        const checked = form.querySelector(`input[name='${topic}-q${idx}']:checked`);
        const selected = checked ? Number(checked.value) : -1;
        if (selected === question.answer) {
          score += 1;
        } else {
          remediation.push(question.remediation);
          studyState.remediation[topic] = studyState.remediation[topic] || {};
          studyState.remediation[topic][question.remediation] = (studyState.remediation[topic][question.remediation] || 0) + 1;
        }
      });

      const total = quiz.questions.length;
      const pct = Math.round((score / total) * 100);
      studyState.quiz[topic] = { score, total, pct, attemptedAt: Date.now(), missed: [...new Set(remediation)] };
      persistStudyState();
      updateStudySummary();
      renderWeakAreaPlan();

      if (score === total) {
        result.innerHTML = `<p><strong>Score: ${score}/${total} (${pct}%)</strong> Excellent. You are ready to apply this topic in hands-on labs and practice exercises.</p>`;
      } else {
        const uniqueRemediation = [...new Set(remediation)].map((item) => `<li>${item}</li>`).join("");
        result.innerHTML = `<p><strong>Score: ${score}/${total} (${pct}%)</strong> Review these remediation points:</p><ul>${uniqueRemediation}</ul>`;
      }
    });
  });

  document.querySelectorAll(".study-master-toggle").forEach((button) => {
    const sectionId = button.dataset.sectionId;
    const section = document.getElementById(sectionId);
    const mastered = Boolean(studyState.mastered[sectionId]);
    button.classList.toggle("is-mastered", mastered);
    button.textContent = mastered ? "Mastered" : "Mark mastered";
    if (section) {
      section.classList.toggle("mastered", mastered);
    }

    button.addEventListener("click", () => {
      const current = Boolean(studyState.mastered[sectionId]);
      studyState.mastered[sectionId] = !current;
      button.classList.toggle("is-mastered", !current);
      button.textContent = !current ? "Mastered" : "Mark mastered";
      if (section) {
        section.classList.toggle("mastered", !current);
      }
      persistStudyState();
      updateStudySummary();
      applyStudyFilters();
    });
  });

  const studySearch = document.getElementById("studySearch");
  const studyLevelFilter = document.getElementById("studyLevelFilter");
  const studyStatusFilter = document.getElementById("studyStatusFilter");
  const studySummary = document.getElementById("studyProgressSummary");

  function updateStudySummary() {
    const total = sections.length;
    const masteredCount = sections.filter((section) => Boolean(studyState.mastered[section.id])).length;
    const pct = total ? Math.round((masteredCount / total) * 100) : 0;
    const quizEntries = Object.values(studyState.quiz);
    const avgQuiz = quizEntries.length
      ? Math.round(quizEntries.reduce((sum, item) => sum + item.pct, 0) / quizEntries.length)
      : 0;
    if (studySummary) {
      studySummary.textContent = `Mastered ${masteredCount} / ${total} topics (${pct}%) | Avg quiz score: ${avgQuiz}%`;
    }
  }

  function renderWeakAreaPlan() {
    const weakPlan = document.getElementById("weakAreaPlan");
    if (!weakPlan) {
      return;
    }

    const topicScores = getAllStudyTopicIds().map((topic) => {
      const quizPct = studyState.quiz[topic]?.pct ?? 0;
      const mastered = Boolean(studyState.mastered[topic]);
      const examMissMap = studyState.exam.misses[topic] || {};
      const examMisses = Object.values(examMissMap).reduce((sum, value) => sum + value, 0);
      const rubric = studyState.interview.rubricAverages[topic] || 0;

      let riskScore = 0;
      riskScore += mastered ? 0 : 25;
      riskScore += Math.max(0, 75 - quizPct);
      riskScore += examMisses * 4;
      riskScore += rubric ? Math.max(0, 4 - rubric) * 10 : 8;

      return { topic, riskScore, quizPct, mastered, examMisses, rubric };
    });

    const cards = topicScores
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5)
      .map((entry) => {
        const guide = getStudyGuide(entry.topic);
        const remediations = Object.entries(studyState.remediation[entry.topic] || {})
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([text]) => `<li>${text}</li>`)
          .join("");

        const fallback = (guide?.practiceDrills || []).map((item) => `<li>${item}</li>`).join("");
        const title = entry.topic.replace(/-/g, " ");

        return `
          <div class="weak-card">
            <h4>${title}</h4>
            <ul>
              <li>Mastery: ${entry.mastered ? "Mastered" : "In progress"}</li>
              <li>Quiz average: ${entry.quizPct}%</li>
              <li>Exam misses: ${entry.examMisses}</li>
              <li>Practice score: ${entry.rubric ? entry.rubric.toFixed(1) : "Not attempted"} / 5</li>
            </ul>
            <div class="remediation-box">
              <h4>Priority Next Steps</h4>
              <ul>${remediations || fallback}</ul>
            </div>
          </div>
        `;
      })
      .join("");

    weakPlan.innerHTML = cards || "<p>No weak-area data yet. Complete topic quizzes or timed exams to generate a personalized plan.</p>";
  }

  function setupInterviewStudio() {
    const topicSelect = document.getElementById("interviewTopicSelect");
    const startBtn = document.getElementById("startInterviewBtn");
    const panel = document.getElementById("interviewPanel");
    if (!topicSelect || !startBtn || !panel) {
      return;
    }

    let interviewState = null;

    function renderInterviewQuestion() {
      if (!interviewState) {
        return;
      }

      const current = interviewState.questions[interviewState.index];
      if (!current) {
        const average = interviewState.responses.length
          ? interviewState.responses.reduce((sum, item) => sum + item.average, 0) / interviewState.responses.length
          : 0;
        const key = interviewState.topic === "all" ? "soc-ops-analyst-track" : interviewState.topic;
        studyState.interview.rubricAverages[key] = average;
        studyState.interview.history.push({ topic: interviewState.topic, average, at: Date.now() });
        persistStudyState();
        updateStudySummary();
        renderWeakAreaPlan();

        panel.innerHTML = `
          <div class="interview-result">
            <p><strong>Session complete.</strong> Average practice score: ${average.toFixed(1)} / 5.</p>
            <p>Use the weak-area study plan below to focus your next practice block.</p>
          </div>
        `;
        return;
      }

      panel.innerHTML = `
        <p class="prep-question">Q${interviewState.index + 1}. ${current.question}</p>
        <textarea class="prep-answer" id="interviewAnswer" placeholder="Write your answer as if explaining to a technical peer."></textarea>
        <div class="prep-guidance">
          <h4>Strong answer should include</h4>
          <ul>${current.include.map((item) => `<li>${item}</li>`).join("")}</ul>
          <h4>Common misses</h4>
          <ul>${current.misses.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div class="rubric-grid">
          <div class="rubric-item"><label>Technical Depth (1-5)</label><input class="rubric-score" id="rubricTech" type="number" min="1" max="5" value="3" /></div>
          <div class="rubric-item"><label>Risk Framing (1-5)</label><input class="rubric-score" id="rubricRisk" type="number" min="1" max="5" value="3" /></div>
          <div class="rubric-item"><label>Operational Practicality (1-5)</label><input class="rubric-score" id="rubricOps" type="number" min="1" max="5" value="3" /></div>
          <div class="rubric-item"><label>Metrics/Evidence (1-5)</label><input class="rubric-score" id="rubricEvidence" type="number" min="1" max="5" value="3" /></div>
        </div>
        <div class="prep-actions">
          <button class="btn btn-primary" type="button" id="saveInterviewAnswerBtn">Save and Next</button>
        </div>
      `;

      const saveBtn = document.getElementById("saveInterviewAnswerBtn");
      if (saveBtn) {
        saveBtn.addEventListener("click", () => {
          const values = ["rubricTech", "rubricRisk", "rubricOps", "rubricEvidence"].map((id) => {
            const value = Number(document.getElementById(id)?.value || 1);
            return Math.max(1, Math.min(5, value));
          });
          const average = values.reduce((sum, value) => sum + value, 0) / values.length;
          interviewState.responses.push({ average });
          interviewState.index += 1;
          renderInterviewQuestion();
        });
      }
    }

    startBtn.addEventListener("click", () => {
      const topic = topicSelect.value;
      interviewState = {
        topic,
        questions: getInterviewQuestions(topic),
        index: 0,
        responses: []
      };
      renderInterviewQuestion();
    });
  }

  function setupTimedExam() {
    const modeSelect = document.getElementById("examModeSelect");
    const topicSelect = document.getElementById("examTopicSelect");
    const startBtn = document.getElementById("startExamBtn");
    const panel = document.getElementById("examPanel");
    if (!modeSelect || !topicSelect || !startBtn || !panel) {
      return;
    }

    let examState = null;
    let timerId = null;

    function stopTimer() {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    }

    function scoreExam() {
      if (!examState) {
        return;
      }
      stopTimer();

      let score = 0;
      const missed = [];

      examState.questions.forEach((question, index) => {
        const selected = Number(examState.answers[index] ?? -1);
        if (selected === question.answer) {
          score += 1;
        } else {
          missed.push(question);
          studyState.exam.misses[question.topic] = studyState.exam.misses[question.topic] || {};
          studyState.exam.misses[question.topic][question.remediation] =
            (studyState.exam.misses[question.topic][question.remediation] || 0) + 1;
          studyState.remediation[question.topic] = studyState.remediation[question.topic] || {};
          studyState.remediation[question.topic][question.remediation] =
            (studyState.remediation[question.topic][question.remediation] || 0) + 1;
        }
      });

      const total = examState.questions.length;
      const pct = Math.round((score / total) * 100);
      studyState.exam.history.push({ mode: examState.mode, topic: examState.topic, score, total, pct, at: Date.now() });
      persistStudyState();
      updateStudySummary();
      renderWeakAreaPlan();

      const remediationList = [...new Set(missed.map((item) => item.remediation))]
        .slice(0, 8)
        .map((item) => `<li>${item}</li>`)
        .join("");

      panel.innerHTML = `
        <div class="exam-result">
          <p><strong>Exam score: ${score}/${total} (${pct}%)</strong></p>
          <div class="remediation-box">
            <h4>Targeted Remediation</h4>
            <ul>${remediationList || "<li>No remediation required. Strong result.</li>"}</ul>
          </div>
        </div>
      `;

      examState = null;
    }

    function renderExamQuestion() {
      if (!examState) {
        return;
      }

      const question = examState.questions[examState.index];
      if (!question) {
        scoreExam();
        return;
      }

      const options = question.options
        .map((option, optionIndex) => {
          const checked = Number(examState.answers[examState.index]) === optionIndex ? "checked" : "";
          return `<label><input type="radio" name="examQuestionOption" value="${optionIndex}" ${checked}/> ${option}</label>`;
        })
        .join("");

      panel.innerHTML = `
        <div class="exam-timer">Time remaining: <span id="examTimerText">${Math.floor(examState.remaining / 60)}:${String(examState.remaining % 60).padStart(2, "0")}</span></div>
        <div class="exam-question">
          <p class="prep-question">Question ${examState.index + 1} of ${examState.questions.length}</p>
          <p>${question.prompt}</p>
          <div>${options}</div>
        </div>
        <div class="prep-actions">
          <button class="btn btn-ghost" type="button" id="examPrevBtn" ${examState.index === 0 ? "disabled" : ""}>Previous</button>
          <button class="btn btn-primary" type="button" id="examNextBtn">${examState.index === examState.questions.length - 1 ? "Submit Exam" : "Next"}</button>
        </div>
      `;

      const optionInputs = panel.querySelectorAll("input[name='examQuestionOption']");
      optionInputs.forEach((input) => {
        input.addEventListener("change", () => {
          examState.answers[examState.index] = Number(input.value);
        });
      });

      const prevBtn = document.getElementById("examPrevBtn");
      if (prevBtn) {
        prevBtn.addEventListener("click", () => {
          examState.index = Math.max(0, examState.index - 1);
          renderExamQuestion();
        });
      }

      const nextBtn = document.getElementById("examNextBtn");
      if (nextBtn) {
        nextBtn.addEventListener("click", () => {
          if (examState.index === examState.questions.length - 1) {
            scoreExam();
          } else {
            examState.index += 1;
            renderExamQuestion();
          }
        });
      }
    }

    function startTimer() {
      stopTimer();
      timerId = setInterval(() => {
        if (!examState) {
          stopTimer();
          return;
        }

        examState.remaining -= 1;
        const timerText = document.getElementById("examTimerText");
        if (timerText) {
          timerText.textContent = `${Math.floor(examState.remaining / 60)}:${String(examState.remaining % 60).padStart(2, "0")}`;
        }

        if (examState.remaining <= 0) {
          scoreExam();
        }
      }, 1000);
    }

    modeSelect.addEventListener("change", () => {
      topicSelect.disabled = modeSelect.value === "full";
    });

    startBtn.addEventListener("click", () => {
      const mode = modeSelect.value;
      const topic = topicSelect.value;
      examState = {
        mode,
        topic,
        questions: getExamQuestions(mode, topic),
        index: 0,
        answers: {},
        remaining: mode === "full" ? 35 * 60 : 12 * 60
      };
      renderExamQuestion();
      startTimer();
    });
  }

  function sectionHasLevel(section, level) {
    const tracks = getLevelTracks(section.id);
    return Array.isArray(tracks[level]) && tracks[level].length > 0;
  }

  function applyStudyFilters() {
    const query = (studySearch?.value || "").toLowerCase().trim();
    const levelValue = studyLevelFilter?.value || "all";
    const statusValue = studyStatusFilter?.value || "all";

    sections.forEach((section) => {
      const text = section.textContent.toLowerCase();
      const mastered = Boolean(studyState.mastered[section.id]);

      const queryMatch = !query || text.includes(query);
      const levelMatch = levelValue === "all" || sectionHasLevel(section, levelValue);
      const statusMatch =
        statusValue === "all" ||
        (statusValue === "mastered" && mastered) ||
        (statusValue === "in-progress" && !mastered);

      section.style.display = queryMatch && levelMatch && statusMatch ? "block" : "none";
    });
  }

  if (studySearch) {
    studySearch.addEventListener("input", applyStudyFilters);
  }
  if (studyLevelFilter) {
    studyLevelFilter.addEventListener("change", applyStudyFilters);
  }
  if (studyStatusFilter) {
    studyStatusFilter.addEventListener("change", applyStudyFilters);
  }

  updateStudySummary();
  applyStudyFilters();
  setupInterviewStudio();
  setupTimedExam();
  renderWeakAreaPlan();
}

enhanceStudiesPage();

const labGuidanceByCategory = {
  endpoint: {
    prep: [
      "Snapshot your VM or create a rollback point before changes.",
      "Confirm endpoint telemetry and logging are enabled.",
      "Keep a baseline export of current policy and configuration."
    ],
    hints: [
      "Validate one control at a time so root cause is clear if behavior changes.",
      "Track performance impact (CPU, memory, startup time) with each hardening setting.",
      "Use exception workflows with expiration dates rather than permanent bypasses."
    ],
    evidence: [
      "Before/after configuration snapshots",
      "Compliance score or drift report",
      "Issue ticket and remediation notes"
    ]
  },
  network: {
    prep: [
      "Draw traffic-flow map before changing network controls.",
      "Define allowed and denied paths with business owner approval.",
      "Enable packet or flow logging for validation."
    ],
    hints: [
      "Default deny first, then add least-privilege exceptions.",
      "Test east-west and north-south paths separately.",
      "Document policy intent in plain language for audit review."
    ],
    evidence: [
      "Firewall/ACL change set",
      "Packet capture or flow evidence",
      "Access matrix with approvals"
    ]
  },
  pentesting: {
    prep: [
      "Confirm written scope and safe-testing boundaries.",
      "Prepare evidence templates before active testing.",
      "Record starting system state and defensive controls."
    ],
    hints: [
      "Prioritize reproducibility over speed.",
      "Tie each finding to business impact and exploit path.",
      "Retest after remediation to verify closure quality."
    ],
    evidence: [
      "Finding report with CVSS and business impact",
      "Proof-of-concept artifacts",
      "Retest verification log"
    ]
  },
  architecture: {
    prep: [
      "Define trust boundaries and data classifications first.",
      "List key architectural assumptions explicitly.",
      "Identify failure domains and blast-radius controls."
    ],
    hints: [
      "Use threat modeling outputs to drive architecture choices.",
      "Capture tradeoffs in ADR format.",
      "Design for operational recovery, not only prevention."
    ],
    evidence: [
      "Architecture diagram",
      "Threat model and control map",
      "Decision record with alternatives"
    ]
  },
  automation: {
    prep: [
      "Create isolated test branch and sample data set.",
      "Define expected output and failure conditions.",
      "Set guardrails for privileged automation actions."
    ],
    hints: [
      "Build idempotent steps to prevent repeated-run drift.",
      "Log every decision and action for forensic traceability.",
      "Include rollback and retry logic from the start."
    ],
    evidence: [
      "Automation workflow file",
      "Execution logs and test results",
      "Measured time saved vs manual process"
    ]
  },
  data: {
    prep: [
      "Define schema and required fields before ingestion.",
      "Set data-quality checks (nulls, timestamp format, duplicates).",
      "Identify enrichment sources and confidence levels."
    ],
    hints: [
      "Normalize fields early to simplify detection logic.",
      "Track data lineage for every transformed field.",
      "Measure query performance before and after enrichment."
    ],
    evidence: [
      "Schema documentation",
      "Quality dashboard screenshot",
      "Parser unit tests"
    ]
  },
  siem: {
    prep: [
      "Validate data source health and event latency.",
      "Define hypothesis and expected signal before writing a rule.",
      "Set severity and escalation criteria with SOC stakeholders."
    ],
    hints: [
      "Tune with representative benign traffic and simulated attacks.",
      "Add suppression carefully with owner and expiry date.",
      "Record tuning rationale for auditability."
    ],
    evidence: [
      "Detection rule or query",
      "False-positive and precision metrics",
      "SOC runbook update"
    ]
  },
  secops: {
    prep: [
      "Confirm incident severity rubric and communication chain.",
      "Prepare timeline template before simulation begins.",
      "Define containment authority and approval points."
    ],
    hints: [
      "Use consistent timestamps and ownership for every action.",
      "Separate confirmed facts from assumptions in updates.",
      "Include lessons learned and action items in closeout."
    ],
    evidence: [
      "Incident timeline",
      "Containment and recovery checklist",
      "Post-incident review summary"
    ]
  },
  threat: {
    prep: [
      "Define system boundaries and trust zones.",
      "Catalog assets and attacker objectives.",
      "Agree on prioritization framework before scoring threats."
    ],
    hints: [
      "Model abuse cases in addition to standard misuse paths.",
      "Link each threat to one or more controls and tests.",
      "Track residual risk with explicit acceptance owner."
    ],
    evidence: [
      "Threat model diagram",
      "Risk register entries",
      "Mitigation validation plan"
    ]
  },
  vulnerability: {
    prep: [
      "Validate scanner coverage and credentialed scan health.",
      "Define risk tiers with SLA targets.",
      "Create remediation ownership matrix."
    ],
    hints: [
      "Prioritize by exploitability and business criticality, not CVSS alone.",
      "Verify likely false positives before escalation.",
      "Track recurrence to identify process gaps."
    ],
    evidence: [
      "Prioritized vulnerability backlog",
      "Patch deployment and validation record",
      "SLA compliance dashboard"
    ]
  },
  soc: {
    prep: [
      "Review playbooks, escalation matrix, and on-call expectations.",
      "Prepare Jira and Confluence templates for incident artifacts.",
      "Confirm SIEM, EDR, IAM, and cloud visibility prerequisites."
    ],
    hints: [
      "Optimize for clear decision-making under time pressure.",
      "Translate technical findings into business impact statements.",
      "Build audit-ready evidence as you execute, not after."
    ],
    evidence: [
      "SOC decision log",
      "Incident/audit artifact packet",
      "KPI trend summary for leadership"
    ]
  },
  default: {
    prep: [
      "Define success criteria before starting.",
      "Capture baseline state and dependencies.",
      "Prepare rollback path if results are unexpected."
    ],
    hints: [
      "Treat each step as a hypothesis and verify outcomes.",
      "Document assumptions and unresolved questions.",
      "Prioritize repeatability and evidence quality."
    ],
    evidence: [
      "Execution notes",
      "Validation output",
      "Retrospective improvement items"
    ]
  }
};

function detectLabCategory(lab) {
  const section = lab.closest(".lab-category");
  const heading = section?.querySelector("h2")?.textContent?.toLowerCase() || "";

  if (heading.includes("endpoint")) return "endpoint";
  if (heading.includes("network")) return "network";
  if (heading.includes("penetration")) return "pentesting";
  if (heading.includes("architecture")) return "architecture";
  if (heading.includes("automation")) return "automation";
  if (heading.includes("data")) return "data";
  if (heading.includes("siem")) return "siem";
  if (heading.includes("security operations")) return "secops";
  if (heading.includes("threat")) return "threat";
  if (heading.includes("vulnerability")) return "vulnerability";
  if (heading.includes("soc analyst")) return "soc";
  return "default";
}

function getSolutionTemplate(category, labTitle) {
  const title = labTitle.toLowerCase();

  if (title.includes("windows hardening")) {
    return {
      commands: `# Run in elevated PowerShell
Set-MpPreference -EnableNetworkProtection Enabled
Set-MpPreference -PUAProtection Enabled
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
auditpol /set /subcategory:"Logon" /success:enable /failure:enable
Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol -NoRestart`,
      validation: [
        "Run Get-MpPreference and confirm network protection + PUA are enabled.",
        "Run Get-NetFirewallProfile and confirm all profiles are enabled.",
        "Run auditpol /get /subcategory:Logon and verify success/failure auditing."
      ],
      troubleshooting: [
        "If policy reverts, check GPO precedence with gpresult /h result.html.",
        "If commands fail, ensure you are in an elevated PowerShell session.",
        "If legacy apps fail, document temporary exception with owner and expiry."
      ]
    };
  }

  if (title.includes("disk encryption") || title.includes("bitlocker") || title.includes("fde")) {
    return {
      commands: `# Verify TPM and enable BitLocker
Get-Tpm
Enable-BitLocker -MountPoint "C:" -EncryptionMethod Aes256 -UsedSpaceOnly
manage-bde -protectors -get C:
manage-bde -status C:`,
      validation: [
        "Confirm conversion status reaches 100% in manage-bde -status.",
        "Verify recovery protector exists and key escrow location is documented.",
        "Test recovery process on a non-production endpoint snapshot."
      ],
      troubleshooting: [
        "If TPM is not ready, initialize TPM in BIOS/UEFI and rerun Get-Tpm.",
        "If encryption is suspended, check pending reboot and security update state.",
        "If escrow is missing, enforce policy before broad rollout."
      ]
    };
  }

  if (title.includes("usb") || title.includes("data loss prevention")) {
    return {
      commands: `# Block USB storage and audit device usage
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\USBSTOR" /v Start /t REG_DWORD /d 4 /f
auditpol /set /subcategory:"Removable Storage" /success:enable /failure:enable
Get-WinEvent -LogName Security -MaxEvents 30`,
      validation: [
        "Insert a USB drive and confirm storage mount is blocked.",
        "Confirm removable storage audit events are present in Security log.",
        "Verify approved-device exception workflow is documented and testable."
      ],
      troubleshooting: [
        "If blocking fails, verify endpoint does not have conflicting MDM policy.",
        "If keyboard/mouse blocked, adjust device-class filter allowlist.",
        "If no logs appear, recheck advanced audit policy application."
      ]
    };
  }

  if (title.includes("patch")) {
    return {
      commands: `# Sample patch compliance checks
wmic qfe list brief /format:table
powershell -Command "Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 10"
# Linux equivalent
sudo apt update && sudo apt list --upgradable`,
      validation: [
        "Baseline current missing patches and assign SLA tier by severity.",
        "Patch pilot group first, then verify endpoint health and app functionality.",
        "Rescan after deployment and record MTTR improvement."
      ],
      troubleshooting: [
        "If patch install fails, inspect pending reboots and conflicting agents.",
        "If app regression occurs, rollback using snapshot and isolate bad update.",
        "If SLA breach risk exists, escalate early with business owner."
      ]
    };
  }

  if (title.includes("edr")) {
    return {
      commands: `# Verify sensor health and event flow
sc query sense
Get-Service | findstr /i "defender crowdstrike sentinel"
# Simulate benign detection test where allowed
powershell -Command "Invoke-WebRequest https://example.com -UseBasicParsing"`,
      validation: [
        "Confirm agent is running and checking in to management console.",
        "Generate a safe test event and verify SIEM ingestion path.",
        "Document detection coverage mapped to ATT&CK techniques."
      ],
      troubleshooting: [
        "If offline sensors appear, check proxy, DNS, and outbound firewall rules.",
        "If alert noise spikes, tune rule scope with expiry-bound suppressions.",
        "If process telemetry missing, validate sensor policy profile."
      ]
    };
  }

  if (title.includes("firewall")) {
    return {
      commands: `# Validate active rules
sudo iptables -L -n -v
sudo ufw status verbose
nmap -sV <target-ip>
nc -zv <target-ip> 22 80 443`,
      validation: [
        "Confirm deny-by-default behavior and explicit allow entries.",
        "Run connectivity tests from each trust zone and record outcomes.",
        "Verify all allow rules include documented business owner."
      ],
      troubleshooting: [
        "If critical traffic breaks, diff policy changes and restore known-good set.",
        "If scan results are inconsistent, validate stateful inspection behavior.",
        "If drift recurs, enforce policy-as-code in source control."
      ]
    };
  }

  if (title.includes("dns") || title.includes("egress")) {
    return {
      commands: `# DNS and outbound checks
dig bad-domain.test
nslookup example.com
tcpdump -ni any port 53 -c 50
sudo nft list ruleset`,
      validation: [
        "Confirm blocked domains fail resolution or are sinkholed.",
        "Verify only approved egress destinations are reachable.",
        "Capture DNS logs and identify any suspicious beaconing intervals."
      ],
      troubleshooting: [
        "If legitimate domains are blocked, tune allowlist with ticket evidence.",
        "If egress bypass occurs, inspect local host firewall precedence.",
        "If DNS logs are incomplete, verify sensor placement and retention."
      ]
    };
  }

  if (title.includes("packet capture") || title.includes("wireshark")) {
    return {
      commands: `# Capture and inspect traffic
sudo tcpdump -i any -w capture.pcap
tshark -r capture.pcap -q -z io,stat,1
tshark -r capture.pcap -Y "dns || tls || http"`,
      validation: [
        "Identify at least one suspicious pattern and map to potential technique.",
        "Correlate packet timing with endpoint process execution timeline.",
        "Export key frames and add analyst interpretation notes."
      ],
      troubleshooting: [
        "If capture is empty, verify interface selection and permissions.",
        "If TLS payload is opaque, rely on metadata and behavioral anomalies.",
        "If time sync drifts, normalize timestamps before correlation."
      ]
    };
  }

  if (title.includes("active directory") || title.includes("bloodhound")) {
    return {
      commands: `# AD discovery examples (authorized labs only)
bloodhound-python -u <user> -p <pass> -d <domain> -ns <dc-ip> -c All
net group "Domain Admins" /domain
Get-ADUser -Filter * -Properties MemberOf`,
      validation: [
        "Map at least one realistic privilege escalation path.",
        "Confirm recommended remediation removes the attack path.",
        "Record before/after graph snapshots for evidence."
      ],
      troubleshooting: [
        "If collection fails, validate DNS, LDAP connectivity, and credentials.",
        "If path analysis is noisy, scope to high-value assets first.",
        "If mitigation breaks operations, stage with least-privileged pilot group."
      ]
    };
  }

  if (title.includes("web application") || title.includes("owasp")) {
    return {
      commands: `# Web testing starter sequence (authorized lab targets)
nikto -h <target>
sqlmap -u "https://target/item?id=1" --batch
gobuster dir -u https://target -w /usr/share/wordlists/dirb/common.txt`,
      validation: [
        "Reproduce finding and capture exact request/response evidence.",
        "Apply fix and rerun test to verify closure.",
        "Classify severity by exploitability + business impact."
      ],
      troubleshooting: [
        "If scans are blocked, verify test scope and WAF allowlisting for lab IP.",
        "If false positives appear, validate manually with repeatable request set.",
        "If fix fails, inspect framework-level input validation and auth layers."
      ]
    };
  }

  if (title.includes("phishing")) {
    return {
      commands: `# Header and URL analysis workflow
python3 -m email < sample.eml
grep -Ei "from:|reply-to:|received:|message-id:" sample.eml
python3 urlhaus_lookup.py --input extracted_urls.txt`,
      validation: [
        "Classify each message as malicious, suspicious, or benign with rationale.",
        "Confirm takedown/block actions were applied in mail and DNS controls.",
        "Track campaign metrics (report rate, click rate, repeat offenders)."
      ],
      troubleshooting: [
        "If headers are incomplete, retrieve original source from secure mail gateway.",
        "If IOC confidence is low, corroborate with at least two intel sources.",
        "If user reporting is poor, improve awareness prompts and report button UX."
      ]
    };
  }

  if (title.includes("iam") || title.includes("rbac") || title.includes("escalation")) {
    return {
      commands: `# Example governance checks (pseudo-commands)
python3 validate_rbac_matrix.py --input roles.csv
python3 check_expiring_access.py --hours 24
python3 audit_privilege_events.py --since 7d`,
      validation: [
        "Ensure every temporary grant has owner, purpose, and expiration.",
        "Verify automatic revocation triggers at TTL without manual intervention.",
        "Run monthly access recertification and publish exception list."
      ],
      troubleshooting: [
        "If approvals stall, define backup approvers and escalation SLA.",
        "If grants persist past TTL, audit job scheduler and identity connector sync.",
        "If SoD conflicts found, break role bundles into lower-risk units."
      ]
    };
  }

  if (title.includes("audit")) {
    return {
      commands: `# Evidence inventory template generation
python3 build_evidence_index.py --controls controls.yaml --out evidence_index.md
python3 validate_evidence_links.py --path ./evidence
python3 generate_audit_packet.py --quarter Q2 --out audit_packet.zip`,
      validation: [
        "Each control has mapped evidence, owner, and timestamped proof.",
        "Exceptions include compensating controls and closure date.",
        "Mock-auditor walkthrough can locate evidence in under 2 minutes per control."
      ],
      troubleshooting: [
        "If evidence is stale, automate collection cadence with reminders.",
        "If artifacts are inconsistent, standardize naming and folder taxonomy.",
        "If narrative is unclear, include concise control-purpose statement."
      ]
    };
  }

  if (title.includes("aws security hub") || title.includes("cloud")) {
    return {
      commands: `# AWS Security Hub sample retrieval
aws securityhub get-findings --filters '{"RecordState":[{"Value":"ACTIVE","Comparison":"EQUALS"}]}'
aws securityhub describe-hub
aws iam generate-credential-report`,
      validation: [
        "Ingest findings into SIEM with normalized severity and account context.",
        "Correlate cloud alerts with IAM and endpoint telemetry where possible.",
        "Track critical finding age and owner to closure."
      ],
      troubleshooting: [
        "If findings are missing, verify region and account aggregation settings.",
        "If enrichment fails, confirm account ID mapping and CMDB keys.",
        "If alert fatigue occurs, tune accepted-risk suppressions with expiry."
      ]
    };
  }

  const fallbackByCategory = {
    endpoint: "Apply baseline controls, validate telemetry, then document exception handling.",
    network: "Implement least-privilege network policy and verify with path testing.",
    pentesting: "Perform scoped test, capture evidence, and retest after remediation.",
    architecture: "Model trust boundaries, record tradeoffs, and validate control placement.",
    automation: "Build idempotent automation with logs, retries, and rollback handling.",
    data: "Normalize telemetry, enforce data quality gates, and benchmark query outcomes.",
    siem: "Write hypothesis-driven detections and tune for precision/recall balance.",
    secops: "Execute incident playbook with timeline discipline and clear ownership.",
    threat: "Map threats to controls and prioritize by exploitability and impact.",
    vulnerability: "Prioritize by risk context, patch in waves, and verify remediation.",
    soc: "Run SOC workflow end-to-end with triage, escalation, and evidence packaging.",
    default: "Execute the lab with clear checkpoints, verification evidence, and retrospective notes."
  };

  return {
    commands: `# Reference implementation workflow
1) Baseline current state
2) Apply targeted control changes
3) Validate expected behavior
4) Capture evidence and metrics
5) Rollback-test and finalize documentation`,
    validation: [fallbackByCategory[category] || fallbackByCategory.default, "Confirm results with objective evidence (logs, screenshots, command output).", "Publish concise summary with measurable impact."],
    troubleshooting: ["If outcomes differ, isolate one change at a time and retest.", "If tooling fails, verify permissions, connectivity, and data source health.", "If evidence is weak, rerun with timestamped artifacts and annotated output."]
  };
}

function getExpectedOutputs(category, labTitle) {
  const title = labTitle.toLowerCase();

  if (title.includes("windows hardening")) {
    return [
      "Defender network protection and PUA protection both show Enabled.",
      "All firewall profiles return Enabled=True.",
      "Audit policy for Logon shows Success and Failure enabled."
    ];
  }

  if (title.includes("disk encryption") || title.includes("bitlocker") || title.includes("fde")) {
    return [
      "BitLocker conversion status reaches 100%.",
      "Recovery protector exists and is retrievable.",
      "Endpoint reports compliant encryption posture in your management console."
    ];
  }

  if (title.includes("siem") || category === "siem") {
    return [
      "Rule triggers on simulated attack events and suppresses known benign patterns.",
      "False-positive rate decreases week-over-week after tuning.",
      "Alert payload contains actor, asset, tactic, and recommended analyst action."
    ];
  }

  if (title.includes("palo alto") || title.includes("firewall") || category === "network") {
    return [
      "Denied flows appear in threat/traffic logs with clear rule hit references.",
      "Allowed business traffic remains unaffected after policy change.",
      "Rulebase review shows no orphan or overly-broad rules for tested paths."
    ];
  }

  if (title.includes("aws security hub") || title.includes("cloud") || category === "soc") {
    return [
      "Security Hub findings are ingested and normalized into SIEM fields.",
      "Critical cloud findings show owner assignment and age tracking.",
      "Cross-correlation links cloud findings with IAM or endpoint context."
    ];
  }

  return [
    "Lab objectives are met with repeatable results.",
    "Validation commands produce expected secure-state output.",
    "Evidence package includes timestamped artifacts and final summary."
  ];
}

function getScreenshotChecklist(category, labTitle) {
  const title = labTitle.toLowerCase();

  const base = [
    "Initial baseline state before changes.",
    "Final secure-state configuration after implementation.",
    "Validation result proving objective completion.",
    "Issue/ticket or change record showing traceability."
  ];

  if (title.includes("phishing")) {
    return [
      "Campaign setup page with target group scope.",
      "Reported-message analysis view with extracted indicators.",
      "Campaign metrics dashboard (click rate, report rate).",
      "Awareness follow-up content for affected users."
    ];
  }

  if (title.includes("iam") || title.includes("rbac") || title.includes("escalation")) {
    return [
      "Access request submission and approval chain.",
      "Temporary privilege grant with TTL timestamp.",
      "Automatic revocation evidence after expiry.",
      "Recertification report snapshot with exceptions."
    ];
  }

  if (title.includes("audit")) {
    return [
      "Control-to-evidence matrix for selected controls.",
      "Exception record with compensating control rationale.",
      "Artifact index proving auditor traceability.",
      "Findings closure board with owners and due dates."
    ];
  }

  return base;
}

function getToolVariants(category, labTitle) {
  const title = labTitle.toLowerCase();

  if (category === "siem" || title.includes("siem") || title.includes("detection")) {
    return [
      "Splunk: index=security sourcetype=edr (process_name=\"powershell.exe\" OR process_name=\"cmd.exe\") | stats count by host,user,parent_process",
      "Sumo Logic: _sourceCategory=security/edr (process_name=\"powershell.exe\" or process_name=\"cmd.exe\") | count by host, user, parent_process",
      "QRadar AQL: SELECT sourceIP, username, QIDNAME(qid), COUNT(*) FROM events WHERE LOGSOURCETYPENAME(devicetype) ILIKE '%EDR%' GROUP BY sourceIP, username, qid LAST 24 HOURS"
    ];
  }

  if (title.includes("palo alto") || title.includes("firewall")) {
    return [
      "Palo Alto: Objects > Addresses/Services > Security Policies to enforce least privilege per zone.",
      "Palo Alto Query: (addr.src in 10.0.0.0/8) and (action eq deny) and (threatid neq 0)",
      "Generic fallback: Export rules to CSV and diff policy changes in version control before commit."
    ];
  }

  if (title.includes("aws security hub") || title.includes("cloud") || category === "soc") {
    return [
      "AWS Security Hub: aws securityhub get-findings --filters '{\"RecordState\":[{\"Value\":\"ACTIVE\",\"Comparison\":\"EQUALS\"}]}'",
      "Azure (Defender/Sentinel): SecurityAlert | where TimeGenerated > ago(24h) | summarize count() by AlertSeverity, CompromisedEntity",
      "Cross-cloud normalization: map account/subscription, severity, resource ID, owner, and SLA due date into common schema."
    ];
  }

  return [
    "Primary path: Use the tools named in the lab objective and capture version/config details.",
    "Fallback path: Use equivalent open-source tooling if enterprise tools are unavailable.",
    "Record tool differences so your portfolio demonstrates transferable skills."
  ];
}

function buildWalkthroughContent(labTitle, existingSteps, guidance, categoryKey) {
  const prepList = guidance.prep.map((item) => `<li>${item}</li>`).join("");
  const hintsList = guidance.hints.map((item) => `<li>${item}</li>`).join("");
  const evidenceList = guidance.evidence.map((item) => `<li>${item}</li>`).join("");

  const solution = getSolutionTemplate(categoryKey || "default", labTitle);
  const validationItems = solution.validation.map((item) => `<li>${item}</li>`).join("");
  const troubleshootingItems = solution.troubleshooting.map((item) => `<li>${item}</li>`).join("");
  const expectedOutputs = getExpectedOutputs(categoryKey || "default", labTitle)
    .map((item) => `<li>${item}</li>`)
    .join("");
  const screenshotChecklist = getScreenshotChecklist(categoryKey || "default", labTitle)
    .map((item) => `<li>${item}</li>`)
    .join("");
  const toolVariants = getToolVariants(categoryKey || "default", labTitle)
    .map((item) => `<li>${item}</li>`)
    .join("");

  const executionItems = existingSteps.length
    ? existingSteps
        .slice(0, 3)
        .map((step, index) => `<li><strong>Checkpoint ${index + 1}:</strong> ${step}</li>`)
        .join("")
    : "<li>Use the objective and success criteria to define your execution checkpoints.</li>";

  return {
    hintsList,
    walkthroughHtml: `
      <div class="walkthrough-body">
        <h5>Preparation Checklist</h5>
        <ul>${prepList}</ul>
        <h5>Execution Checkpoints</h5>
        <ol>${executionItems}</ol>
        <h5>Solution Runbook</h5>
        <pre class="solution-code">${solution.commands}</pre>
        <h5>Validation Checks</h5>
        <ul>${validationItems}</ul>
        <h5>Expected Outputs</h5>
        <ul>${expectedOutputs}</ul>
        <h5>Troubleshooting</h5>
        <ul>${troubleshootingItems}</ul>
        <h5>Tool-Specific Variants</h5>
        <ul>${toolVariants}</ul>
        <h5>Screenshot Checklist</h5>
        <ul>${screenshotChecklist}</ul>
        <h5>Validation and Evidence</h5>
        <ul>${evidenceList}</ul>
        <h5>Portfolio Upgrade</h5>
        <ul>
          <li>Publish a concise markdown case summary with architecture and outcome metrics.</li>
          <li>Attach screenshots, config snippets, and one measurable improvement value.</li>
          <li>Record what failed first and how you corrected it — this context is valuable for documentation and future retrospectives.</li>
        </ul>
      </div>
    `
  };
}

function enhanceLabsPage() {
  const labs = [...document.querySelectorAll(".lab")];
  if (!labs.length) {
    return;
  }

  const storageKey = "cyberskillforge-lab-completions";
  const stored = localStorage.getItem(storageKey);
  const completedLabs = stored ? JSON.parse(stored) : {};

  labs.forEach((lab, index) => {
    const titleEl = lab.querySelector("h3");
    const title = titleEl?.textContent?.trim() || `Lab ${index + 1}`;
    const existingSteps = [...lab.querySelectorAll(".lab-steps li")].map((li) => li.textContent.trim());
    const category = detectLabCategory(lab);
    const guidance = labGuidanceByCategory[category] || labGuidanceByCategory.default;

    const labId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index + 1}`;
    lab.dataset.labId = labId;

    const header = lab.querySelector(".lab-header");
    if (header) {
      const completeBtn = document.createElement("button");
      completeBtn.type = "button";
      completeBtn.className = "lab-complete-toggle";
      completeBtn.textContent = "Mark complete";
      completeBtn.setAttribute("aria-label", `Mark ${title} as complete`);
      header.appendChild(completeBtn);
    }

    const built = buildWalkthroughContent(title, existingSteps, guidance, category);

    const hintsBlock = document.createElement("div");
    hintsBlock.className = "lab-hints";
    hintsBlock.innerHTML = `<h4>Hints</h4><ul>${built.hintsList}</ul>`;

    const walkthrough = document.createElement("details");
    walkthrough.className = "lab-walkthrough";
    walkthrough.innerHTML = `<summary>Full Walkthrough + Solution</summary>${built.walkthroughHtml}`;

    lab.append(hintsBlock, walkthrough);
  });

  const searchInput = document.getElementById("labSearch");
  const statusFilter = document.getElementById("labStatusFilter");
  const progressSummary = document.getElementById("labProgressSummary");

  function persist() {
    localStorage.setItem(storageKey, JSON.stringify(completedLabs));
  }

  function updateProgress() {
    const total = labs.length;
    let done = 0;

    labs.forEach((lab) => {
      const id = lab.dataset.labId;
      const isComplete = Boolean(completedLabs[id]);
      const btn = lab.querySelector(".lab-complete-toggle");
      if (btn) {
        btn.textContent = isComplete ? "Completed" : "Mark complete";
        btn.classList.toggle("is-complete", isComplete);
      }
      lab.classList.toggle("walkthrough-complete", isComplete);
      if (isComplete) {
        done += 1;
      }
    });

    const pct = total ? Math.round((done / total) * 100) : 0;
    if (progressSummary) {
      progressSummary.textContent = `Completed ${done} / ${total} labs (${pct}%)`;
    }
  }

  function applyFilters() {
    const searchValue = (searchInput?.value || "").toLowerCase().trim();
    const statusValue = statusFilter?.value || "all";

    labs.forEach((lab) => {
      const id = lab.dataset.labId;
      const complete = Boolean(completedLabs[id]);
      const text = lab.textContent.toLowerCase();

      const searchMatch = !searchValue || text.includes(searchValue);
      const statusMatch =
        statusValue === "all" ||
        (statusValue === "complete" && complete) ||
        (statusValue === "incomplete" && !complete);

      lab.style.display = searchMatch && statusMatch ? "block" : "none";
    });
  }

  labs.forEach((lab) => {
    const button = lab.querySelector(".lab-complete-toggle");
    if (!button) {
      return;
    }
    button.addEventListener("click", () => {
      const id = lab.dataset.labId;
      completedLabs[id] = !completedLabs[id];
      persist();
      updateProgress();
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }
  if (statusFilter) {
    statusFilter.addEventListener("change", applyFilters);
  }

  updateProgress();
  applyFilters();
}

enhanceLabsPage();

// ── Practice Studio collapse toggle ──────────────────────────────
(function initStudioToggle() {
  const btn = document.getElementById("toggleStudioBtn");
  const body = document.getElementById("studioBody");
  if (!btn || !body) return;

  const STORAGE_KEY = "studioCollapsed";
  const isCollapsed = localStorage.getItem(STORAGE_KEY) === "true";

  function applyState(collapsed) {
    body.classList.toggle("studio-collapsed", collapsed);
    btn.setAttribute("aria-expanded", String(!collapsed));
    btn.textContent = collapsed ? "Show Practice Studio ▼" : "Hide Practice Studio ▲";
    localStorage.setItem(STORAGE_KEY, collapsed);
  }

  applyState(isCollapsed);

  btn.addEventListener("click", () => {
    applyState(!body.classList.contains("studio-collapsed"));
  });
})();
