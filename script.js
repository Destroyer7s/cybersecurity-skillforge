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
    practiceDrills: ["Build one hardened baseline profile", "Map 5 controls to real attack techniques", "Measure compliance before/after"],
    selfCheck: ["Can you explain why each endpoint control exists?", "Can you identify which control failed in a sample incident?"]
  },
  "network-security": {
    prerequisites: ["TCP/IP and routing basics", "Firewall rule evaluation", "Identity-aware access basics"],
    coreConcepts: ["Zero trust verification", "Microsegmentation strategy", "Egress control and monitoring"],
    practiceDrills: ["Create trust-zone matrix", "Test allow/deny flows", "Trace suspicious DNS/egress path"],
    selfCheck: ["Can you justify every allow rule with business need?", "Can you explain east-west containment strategy?"]
  },
  "penetration-testing": {
    prerequisites: ["Legal scope and ethics", "Vulnerability fundamentals", "Basic scripting/CLI fluency"],
    coreConcepts: ["Assessment methodology", "Exploitability vs business impact", "Remediation verification"],
    practiceDrills: ["Run scoped recon-to-validation exercise", "Write one full finding report", "Retest after fix"],
    selfCheck: ["Can you separate risk signal from scanner noise?", "Can you tie technical exploit to business consequence?"]
  },
  "architecture-design": {
    prerequisites: ["System design basics", "Identity/access control models", "Threat modeling basics"],
    coreConcepts: ["Trust boundaries", "Architecture decision records", "Security-reliability tradeoffs"],
    practiceDrills: ["Draw one secure reference architecture", "Write ADR for a control decision", "Map design to threats"],
    selfCheck: ["Can you explain why this design is secure and operable?", "Can you defend tradeoffs under constraints?"]
  },
  "security-automation": {
    prerequisites: ["Scripting foundations", "CI/CD workflow concepts", "Basic API usage"],
    coreConcepts: ["Idempotent automation", "Policy-as-code", "Safe rollback and auditability"],
    practiceDrills: ["Automate one recurring security task", "Add validation tests", "Track time saved"],
    selfCheck: ["Can your automation run safely multiple times?", "Can you prove change traceability?"]
  },
  "security-information": {
    prerequisites: ["Log formats", "JSON/CSV parsing", "Data quality basics"],
    coreConcepts: ["Normalization and schema", "Enrichment confidence", "Signal-to-noise management"],
    practiceDrills: ["Normalize mixed telemetry set", "Add enrichment fields", "Benchmark query performance"],
    selfCheck: ["Can you trust the data powering detections?", "Can you trace data lineage for key fields?"]
  },
  siem: {
    prerequisites: ["Query language basics", "Alert triage fundamentals", "MITRE ATT&CK familiarity"],
    coreConcepts: ["Hypothesis-driven detection", "Precision vs recall", "Tuning lifecycle"],
    practiceDrills: ["Author one detection rule", "Replay test data", "Tune with change log"],
    selfCheck: ["Can you explain why this alert matters?", "Can you reduce false positives without losing coverage?"]
  },
  "security-operations": {
    prerequisites: ["Incident severity model", "Escalation protocols", "Documentation discipline"],
    coreConcepts: ["IR lifecycle execution", "Coordination under pressure", "Post-incident learning loops"],
    practiceDrills: ["Run tabletop simulation", "Create timeline artifact", "Write post-incident review"],
    selfCheck: ["Can you lead triage with clear ownership?", "Can you communicate impact to non-technical stakeholders?"]
  },
  "threat-modeling": {
    prerequisites: ["System decomposition", "Attack surface basics", "Risk ranking models"],
    coreConcepts: ["STRIDE and abuse cases", "Control mapping", "Residual risk tracking"],
    practiceDrills: ["Build one threat model", "Prioritize top risks", "Define validation plan"],
    selfCheck: ["Can you identify attacker goals and paths?", "Can you map each risk to a control and owner?"]
  },
  "vulnerability-management": {
    prerequisites: ["CVSS basics", "Patch deployment flow", "Asset criticality mapping"],
    coreConcepts: ["Risk-based prioritization", "SLA governance", "Verification and recurrence reduction"],
    practiceDrills: ["Prioritize a sample backlog", "Patch in staged waves", "Measure MTTR trend"],
    selfCheck: ["Can you justify why a vuln is truly urgent?", "Can you prove remediation quality over time?"]
  },
  "soc-ops-analyst-track": {
    prerequisites: ["SOC workflow fundamentals", "SIEM/EDR familiarity", "Audit/compliance context"],
    coreConcepts: ["Operational triage system", "On-call incident discipline", "IAM and audit evidence readiness"],
    practiceDrills: ["Run a mock analyst shift", "Write one executive-ready incident update", "Assemble mini audit packet"],
    selfCheck: ["Can you operate effectively under changing priorities?", "Can you connect technical events to business risk quickly?"]
  },
  "capstone-track": {
    prerequisites: ["Comfort across multiple security domains", "Project scoping and planning", "Basic metrics definition"],
    coreConcepts: ["Integrated security delivery", "Evidence-based storytelling", "Outcome measurement"],
    practiceDrills: ["Build one end-to-end security project", "Track baseline and post-change metrics", "Create interview-ready presentation"],
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
    why: "It matters because SOC roles are judged on consistent, high-quality decisions during real operational pressure. You need both technical depth and disciplined process execution.",
    how: ["Practice shift workflows from first alert to closure with clear handoffs.", "Translate technical findings into business risk language for stakeholders.", "Build evidence artifacts as you work so audits and postmortems are always ready."],
    success: "You are ready when you can run a shift confidently, prioritize by risk under load, and produce clean artifacts that stand up to leadership and compliance review."
  },
  "capstone-track": {
    what: "The capstone track is where you integrate multiple skills into one end-to-end security project. It should reflect real role expectations: design, implementation, validation, and measurable impact.",
    why: "This section matters because employers evaluate applied capability, not isolated theory. A strong capstone proves you can execute across domains and communicate outcomes professionally.",
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
    "If you can run a shift and produce audit-ready artifacts, you are job-ready."
  ],
  "capstone-track": [
    "This is your proof project showing you can apply multiple skills together.",
    "You are learning to tell a clear security story with measurable outcomes.",
    "If your project explains problem, tradeoffs, and impact, it is interview-ready."
  ]
};

function buildStudyExplainer(sectionId) {
  const explainer = studySectionExplainers[sectionId];
  if (!explainer) {
    return "";
  }

  const plainEnglish = studyPlainEnglishMap[sectionId] || [
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
      { prompt: "Best way to present architecture in interview:", options: ["Buzzwords", "Threats, controls, tradeoffs, measurable outcome", "No numbers", "Only diagram title"], answer: 1, remediation: "Use structured explanation with measurable impact." }
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
      { prompt: "Capstone should demonstrate:", options: ["Single isolated skill", "Integration of multiple job-relevant skills", "Only UI", "Only logs"], answer: 1, remediation: "Build integrated workflows that mirror real operations." },
      { prompt: "Interview-ready capstone explanation should cover:", options: ["Tools list", "Problem, approach, tradeoffs, measurable impact", "Company gossip", "No challenges"], answer: 1, remediation: "Use STAR-style structured explanation with quantified outcomes." }
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

function getInterviewQuestions(topic) {
  if (topic === "all") {
    return Object.keys(studyGuides)
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

  const all = Object.keys(studyGuides).flatMap((key) =>
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

function enhanceStudiesPage() {
  const sections = [...document.querySelectorAll(".study-section")];
  if (!sections.length) {
    return;
  }

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

    const guide = studyGuides[section.id];
    if (!guide) {
      return;
    }

    const block = document.createElement("aside");
    block.className = "study-guide";
    const levelTracks = getLevelTracks(section.id);
    block.innerHTML = `
      <h4>Guided Learning Path for This Topic</h4>
      ${buildStudyExplainer(section.id)}
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
        result.innerHTML = `<p><strong>Score: ${score}/${total} (${pct}%)</strong> Excellent. You are ready to apply this topic in labs and interviews.</p>`;
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

    const topicScores = Object.keys(studyGuides).map((topic) => {
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
        const guide = studyGuides[entry.topic];
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
              <li>Interview rubric: ${entry.rubric ? entry.rubric.toFixed(1) : "Not attempted"} / 5</li>
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
            <p><strong>Interview complete.</strong> Average rubric score: ${average.toFixed(1)} / 5.</p>
            <p>Use the weak-area study plan below to focus your next practice block.</p>
          </div>
        `;
        return;
      }

      panel.innerHTML = `
        <p class="prep-question">Q${interviewState.index + 1}. ${current.question}</p>
        <textarea class="prep-answer" id="interviewAnswer" placeholder="Answer this exactly as if you were in a live interview."></textarea>
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
          <li>Record what failed first and how you corrected it for interview storytelling.</li>
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
