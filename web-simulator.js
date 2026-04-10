(function () {
  "use strict";

  const STORAGE_KEY = "web-sim-v1";
  const POINTS = { clean: 12, hint: 6, reveal: 3, complete: 40 };
  const ACHIEVEMENTS = [
    { key: "first-stage", label: "First Blood", test: (s) => s.completedStages >= 1 },
    { key: "clean-five", label: "Precision Five", test: (s) => s.cleanStages >= 5 },
    { key: "streak-7", label: "Hot Streak", test: (s) => s.bestStreak >= 7 },
    { key: "complete-3", label: "Triad Closure", test: (s) => Object.keys(s.completed).length >= 3 },
    { key: "complete-all", label: "Web Guardian", test: (s) => Object.keys(s.completed).length >= SCENARIOS.length }
  ];

  const SCENARIOS = [
    {
      id: "ws-01",
      title: "Auth SQL Injection - Legacy Login",
      stack: "Node + MySQL",
      difficulty: "Intermediate",
      objective: "Detect injection in login flow, validate exploit path safely, apply parameterization and verify closure.",
      stages: [
        { instruction: "Profile attack surface for auth endpoints.", hint: "probe /login", pattern: /(probe|map|enumerate).*(\/login|auth)/i, output: "Surface discovered: /login, /api/session, /auth/reset" },
        { instruction: "Run safe SQLi detection simulation.", hint: "exploit sqli /login payload:auth-bypass-basic", pattern: /(exploit|test).*(sqli|sql).*(\/login|auth)/i, output: "Simulation indicates injectable parameter: username" },
        { instruction: "Correlate DB error traces from logs.", hint: "analyze logs filter:sqli endpoint:/login", pattern: /(analyze|query).*(log|trace).*(sqli|sql|login)/i, output: "Trace correlation: mysql syntax error near user lookup query" },
        { instruction: "Deploy input handling patch and re-test.", hint: "patch parameterized-query module:auth-login && verify /login suite:sqli-regression", pattern: /(patch|fix).*(parameter|prepared|query).*(verify|test|suite)/i, output: "Regression suite passed. Injection no longer reproducible." },
        { instruction: "Generate incident summary report.", hint: "report create type:incident scope:auth-sqli", pattern: /(report|summary).*(incident|sqli|auth)/i, output: "Report generated: incident-auth-sqli.md" }
      ]
    },
    {
      id: "ws-02",
      title: "Stored XSS in Admin Comment Workflow",
      stack: "Django + Redis",
      difficulty: "Advanced",
      objective: "Identify persistent XSS vector, contain impact, sanitize rendering pipeline, and validate CSP alignment.",
      stages: [
        { instruction: "Map comment ingestion and render paths.", hint: "probe /admin/comments", pattern: /(probe|map).*(comment|admin)/i, output: "Pipeline mapped: submit -> moderation queue -> admin dashboard render" },
        { instruction: "Run stored XSS simulation with safe payload signature.", hint: "exploit xss /admin/comments payload:stored-safe-signature", pattern: /(exploit|test).*(xss).*(comment|admin)/i, output: "Stored payload replayed in admin panel context" },
        { instruction: "Inspect browser security headers and CSP.", hint: "inspect headers /admin/comments", pattern: /(inspect|check).*(header|csp|security)/i, output: "CSP missing script-src nonce for dynamic components" },
        { instruction: "Apply output encoding and CSP hardening.", hint: "patch output-encoding view:comment-render && patch csp policy:strict", pattern: /(patch|fix).*(encoding|escape|csp).*(strict|render|view)/i, output: "Encoding + CSP policy updated and deployed" },
        { instruction: "Validate that stored payload no longer executes.", hint: "verify /admin/comments suite:xss-regression", pattern: /(verify|test).*(xss).*(regression|comments|admin)/i, output: "No script execution observed across replay suite" }
      ]
    },
    {
      id: "ws-03",
      title: "SSRF in PDF Report Service",
      stack: "Go + Internal Metadata Service",
      difficulty: "Advanced",
      objective: "Contain SSRF primitive, enforce outbound allow-list controls, and prove metadata endpoint isolation.",
      stages: [
        { instruction: "Identify URL-fetching features in report service.", hint: "probe /reports/render", pattern: /(probe|map).*(report|render|fetch|url)/i, output: "Potential SSRF sink found in report render URL fetcher" },
        { instruction: "Simulate SSRF attempt against internal host.", hint: "exploit ssrf /reports/render target:169.254.169.254", pattern: /(exploit|test).*(ssrf).*(169\.254\.169\.254|internal|metadata)/i, output: "Outbound request to metadata endpoint observed in simulation" },
        { instruction: "Inspect egress and DNS logs for SSRF traces.", hint: "analyze logs filter:ssrf service:report-render", pattern: /(analyze|query).*(log|dns|egress).*(ssrf|report)/i, output: "Egress anomaly confirmed from report pod" },
        { instruction: "Patch URL validator and add allow-list.", hint: "patch url-validator policy:allowlist-only", pattern: /(patch|fix).*(url|allowlist|validator|egress)/i, output: "Validator now blocks link-local and private ranges" },
        { instruction: "Re-run SSRF verification suite.", hint: "verify /reports/render suite:ssrf-regression", pattern: /(verify|test).*(ssrf).*(suite|regression|reports)/i, output: "SSRF regression suite passed" }
      ]
    },
    {
      id: "ws-04",
      title: "Broken Access Control in Invoice API",
      stack: "Spring + PostgreSQL",
      difficulty: "Intermediate",
      objective: "Find horizontal privilege escalation path, enforce object-level authorization, and test role boundaries.",
      stages: [
        { instruction: "Enumerate invoice API routes.", hint: "probe /api/invoices", pattern: /(probe|map).*(invoice|api)/i, output: "Routes: GET /api/invoices/{id}, POST /api/invoices/export" },
        { instruction: "Run access-control abuse simulation for foreign object ID.", hint: "exploit idor /api/invoices/8841 actor:user-a", pattern: /(exploit|test).*(idor|access|authorization).*(invoice|api)/i, output: "Unauthorized object access simulated successfully" },
        { instruction: "Correlate authorization middleware decisions.", hint: "analyze logs filter:authz route:/api/invoices", pattern: /(analyze|query).*(authz|middleware|policy).*(invoice|access)/i, output: "Missing ownership check identified in controller path" },
        { instruction: "Patch object-level authorization check.", hint: "patch authz object-owner-check route:/api/invoices/{id}", pattern: /(patch|fix).*(authz|owner|object|invoice)/i, output: "Ownership guard enforced for all invoice retrieval paths" },
        { instruction: "Validate role and tenant isolation suite.", hint: "verify /api/invoices suite:bac-regression", pattern: /(verify|test).*(bac|access|invoice|regression)/i, output: "All role-boundary tests passed" }
      ]
    },
    {
      id: "ws-05",
      title: "CSRF on Funds Transfer Endpoint",
      stack: "Rails + Nginx",
      difficulty: "Intermediate",
      objective: "Validate CSRF weakness, implement anti-CSRF controls, and confirm same-site behavior.",
      stages: [
        { instruction: "Map transfer endpoint and session model.", hint: "probe /transfer", pattern: /(probe|map).*(transfer|session|csrf)/i, output: "Transfer POST endpoint identified with cookie session auth" },
        { instruction: "Simulate CSRF post without token.", hint: "exploit csrf /transfer method:POST", pattern: /(exploit|test).*(csrf).*(transfer|post)/i, output: "Cross-site POST accepted when token omitted" },
        { instruction: "Inspect anti-CSRF middleware and cookie flags.", hint: "inspect headers /transfer && inspect session-policy", pattern: /(inspect|check).*(csrf|cookie|samesite|header|session)/i, output: "SameSite not strict and token validation not enforced" },
        { instruction: "Patch CSRF token verification and SameSite settings.", hint: "patch csrf token:required && patch cookie samesite:strict", pattern: /(patch|fix).*(csrf|token|samesite|cookie)/i, output: "Token + SameSite strict controls deployed" },
        { instruction: "Run transfer regression abuse tests.", hint: "verify /transfer suite:csrf-regression", pattern: /(verify|test).*(csrf|transfer|regression)/i, output: "Cross-site request blocked; valid token path succeeds" }
      ]
    },
    {
      id: "ws-06",
      title: "Path Traversal in File Download",
      stack: "Express + S3 Proxy",
      difficulty: "Intermediate",
      objective: "Detect path traversal in file resolver and enforce canonical path constraints.",
      stages: [
        { instruction: "Enumerate download handlers.", hint: "probe /download", pattern: /(probe|map).*(download|file)/i, output: "Download handler discovered with filename query parameter" },
        { instruction: "Run safe traversal simulation with signature payload.", hint: "exploit traversal /download payload:dotdot-safe", pattern: /(exploit|test).*(traversal|dotdot|path).*(download|file)/i, output: "Traversal-like resolution triggered in sandbox" },
        { instruction: "Inspect resolver normalization logs.", hint: "analyze logs filter:path-normalization", pattern: /(analyze|query).*(normalization|path|resolver|log)/i, output: "Canonicalization step missing before file read" },
        { instruction: "Patch canonicalization and deny-list bypasses.", hint: "patch file-resolver canonicalize:true", pattern: /(patch|fix).*(canonical|normalize|resolver|path)/i, output: "Canonical path enforcement enabled" },
        { instruction: "Execute file access regression suite.", hint: "verify /download suite:traversal-regression", pattern: /(verify|test).*(traversal|download|regression)/i, output: "Traversal attempts blocked, valid paths remain functional" }
      ]
    },
    {
      id: "ws-07",
      title: "JWT Validation Bypass",
      stack: "FastAPI + OAuth",
      difficulty: "Advanced",
      objective: "Assess token validation logic, prevent algorithm confusion, and enforce issuer/audience checks.",
      stages: [
        { instruction: "Map auth and token verification flow.", hint: "probe /api/private", pattern: /(probe|map).*(token|jwt|auth|private)/i, output: "JWT verification middleware identified" },
        { instruction: "Simulate alg confusion / weak validation case.", hint: "exploit jwt /api/private vector:alg-confusion-safe", pattern: /(exploit|test).*(jwt|token).*(alg|confusion|bypass)/i, output: "Validation bypass path triggered in simulation profile" },
        { instruction: "Inspect verification settings and key source.", hint: "inspect jwt-config", pattern: /(inspect|check).*(jwt|issuer|audience|key|jwks)/i, output: "Audience check disabled and algorithm list too broad" },
        { instruction: "Patch strict alg, issuer, audience validation.", hint: "patch jwt-validation alg:RS256 issuer:required audience:required", pattern: /(patch|fix).*(jwt|issuer|audience|alg|rs256)/i, output: "JWT verifier hardened with strict constraints" },
        { instruction: "Re-run token abuse regression suite.", hint: "verify /api/private suite:jwt-regression", pattern: /(verify|test).*(jwt|token|private|regression)/i, output: "All bypass attempts rejected" }
      ]
    },
    {
      id: "ws-08",
      title: "Rate-Limit Evasion on Password Reset",
      stack: "Kubernetes + API Gateway",
      difficulty: "Advanced",
      objective: "Detect rate-limit evasion path, enforce distributed counters, and validate abuse throttling.",
      stages: [
        { instruction: "Identify reset endpoint and current policy.", hint: "probe /auth/reset", pattern: /(probe|map).*(reset|rate|auth)/i, output: "Reset endpoint rate policy found: per-node counter only" },
        { instruction: "Simulate distributed reset abuse attempt.", hint: "exploit ratelimit /auth/reset mode:distributed-burst", pattern: /(exploit|test).*(rate|throttle|burst).*(reset|auth)/i, output: "Bypass observed across multi-node path" },
        { instruction: "Analyze gateway and app logs for counter drift.", hint: "analyze logs filter:ratelimit route:/auth/reset", pattern: /(analyze|query).*(log|counter|rate|gateway).*(reset)/i, output: "Counter inconsistency confirmed between edge and service" },
        { instruction: "Patch global rate limiter with shared store.", hint: "patch ratelimit backend:redis scope:global", pattern: /(patch|fix).*(rate|limiter|redis|global|throttle)/i, output: "Global throttling enabled with shared counters" },
        { instruction: "Verify lockout and reset abuse controls.", hint: "verify /auth/reset suite:ratelimit-regression", pattern: /(verify|test).*(ratelimit|reset|regression|lockout)/i, output: "Abuse burst blocked at expected threshold" }
      ]
    },
    {
      id: "ws-09",
      title: "Sensitive Data Exposure in API Responses",
      stack: "GraphQL + MongoDB",
      difficulty: "Intermediate",
      objective: "Detect overexposed fields, enforce schema-level access control, and validate response minimization.",
      stages: [
        { instruction: "Map data-returning query paths.", hint: "probe /graphql", pattern: /(probe|map).*(graphql|schema|query|field)/i, output: "Query path map generated for account and profile objects" },
        { instruction: "Run overfetch simulation for sensitive fields.", hint: "exploit overexposure /graphql field:ssn", pattern: /(exploit|test).*(overexposure|sensitive|field|graphql|data)/i, output: "Sensitive field exposure reproduced in simulation" },
        { instruction: "Inspect resolver authorization behavior.", hint: "analyze logs filter:resolver-authz", pattern: /(analyze|query).*(resolver|authz|graphql|log)/i, output: "Resolver missing role checks on profile query" },
        { instruction: "Patch field-level guards and response filtering.", hint: "patch graphql field-guard model:profile", pattern: /(patch|fix).*(field|guard|graphql|response|filter)/i, output: "Field-level authorization and projection hardening applied" },
        { instruction: "Verify data minimization regression suite.", hint: "verify /graphql suite:data-exposure-regression", pattern: /(verify|test).*(graphql|data|exposure|regression)/i, output: "Sensitive fields suppressed for unauthorized roles" }
      ]
    },
    {
      id: "ws-10",
      title: "Command Injection in Report Export",
      stack: "PHP + Legacy Worker",
      difficulty: "Advanced",
      objective: "Detect command injection sink, isolate worker execution, and enforce safe command handling.",
      stages: [
        { instruction: "Map export endpoint to worker pipeline.", hint: "probe /export", pattern: /(probe|map).*(export|worker|command|shell)/i, output: "Export endpoint linked to shell-based worker invocation" },
        { instruction: "Run injection simulation with safe marker payload.", hint: "exploit cmdi /export payload:safe-marker", pattern: /(exploit|test).*(cmdi|command|injection|shell).*(export)/i, output: "Worker command stream accepted unsafe concat pattern" },
        { instruction: "Inspect process execution telemetry.", hint: "analyze logs filter:process-exec service:export", pattern: /(analyze|query).*(process|exec|shell|log).*(export)/i, output: "Unescaped user input detected in command template" },
        { instruction: "Patch to parameterized worker invocation.", hint: "patch worker-invoke mode:safe-args", pattern: /(patch|fix).*(worker|safe|args|parameter|command)/i, output: "Worker now uses strict argument list, no shell expansion" },
        { instruction: "Run command-injection regression suite.", hint: "verify /export suite:cmdi-regression", pattern: /(verify|test).*(cmdi|command|injection|export|regression)/i, output: "No command injection path remains" }
      ]
    },
    {
      id: "ws-11",
      title: "Insecure CORS Policy on API Gateway",
      stack: "Nginx + Microservices",
      difficulty: "Intermediate",
      objective: "Correct permissive CORS configuration and verify browser-enforced origin restrictions.",
      stages: [
        { instruction: "Inspect current CORS headers on target route.", hint: "inspect headers /api/profile", pattern: /(inspect|check).*(cors|header|origin).*(profile|api)/i, output: "CORS policy observed: Access-Control-Allow-Origin: * with credentials" },
        { instruction: "Simulate cross-origin credentialed request.", hint: "exploit cors /api/profile mode:credentialed", pattern: /(exploit|test).*(cors|origin|credential).*(profile|api)/i, output: "Cross-origin response exposed with credential flow" },
        { instruction: "Correlate gateway config and request logs.", hint: "analyze logs filter:cors gateway:true", pattern: /(analyze|query).*(cors|gateway|log|origin)/i, output: "Wildcard origin inherited from default gateway template" },
        { instruction: "Patch explicit origin allow-list config.", hint: "patch cors allowlist:https://app.example.com", pattern: /(patch|fix).*(cors|allowlist|origin)/i, output: "CORS now restricted to approved origins" },
        { instruction: "Verify browser policy regression checks.", hint: "verify /api/profile suite:cors-regression", pattern: /(verify|test).*(cors|profile|regression|origin)/i, output: "Unauthorized origins blocked; trusted origin remains functional" }
      ]
    },
    {
      id: "ws-12",
      title: "Session Fixation in Legacy Session Handler",
      stack: "Tomcat + Redis",
      difficulty: "Advanced",
      objective: "Detect session fixation behavior and enforce secure session rotation on auth transitions.",
      stages: [
        { instruction: "Map session creation and auth upgrade path.", hint: "probe /session/start", pattern: /(probe|map).*(session|auth|login|start)/i, output: "Session lifecycle mapped across unauthenticated and authenticated states" },
        { instruction: "Simulate fixation flow with pre-auth token.", hint: "exploit session-fixation /login token:preauth-fixed", pattern: /(exploit|test).*(session|fixation|token).*(login|auth)/i, output: "Session ID persisted through authentication transition" },
        { instruction: "Inspect session middleware and rotation logs.", hint: "analyze logs filter:session-rotate", pattern: /(analyze|query).*(session|rotate|middleware|log)/i, output: "Rotation hook absent on successful login" },
        { instruction: "Patch forced session regeneration post-auth.", hint: "patch session regenerate:on-auth-success", pattern: /(patch|fix).*(session|regenerate|rotate|auth)/i, output: "Session regeneration enforced after login" },
        { instruction: "Verify fixation regression suite.", hint: "verify /login suite:session-fixation-regression", pattern: /(verify|test).*(session|fixation|login|regression)/i, output: "Pre-auth session IDs invalid after auth as expected" }
      ]
    }
  ];

  const WEB_ROOTS = [
    "probe", "map", "enumerate", "inspect", "analyze", "query", "exploit", "test", "patch", "fix", "verify", "report", "timeline",
    "scan", "replay", "diff", "summarize", "validate", "correlate", "triage", "mitigate", "contain", "baseline", "regress"
  ];

  const WEB_OBJECTS = [
    "/login", "/auth/reset", "/api/invoices", "/graphql", "/reports/render", "/download", "/api/private", "/api/profile", "/transfer", "/export",
    "headers", "logs", "csp", "jwt-config", "session-policy", "ratelimit", "waf-rule", "worker-invoke", "field-guard", "url-validator"
  ];

  const PREFIXES = ["", "sudo ", "time ", "nohup "];
  const SUFFIXES = ["", " --verbose", " --dry-run", " | jq .", " && echo done"];

  function buildSyntheticRoots(count) {
    const roots = [];
    for (let i = 1; i <= count; i += 1) {
      roots.push("websim-" + String(i).padStart(5, "0"));
    }
    return roots;
  }

  const SYNTHETIC_ROOTS = buildSyntheticRoots(4500);
  const ROOT_SET = new Set(WEB_ROOTS.concat(SYNTHETIC_ROOTS).map((v) => v.toLowerCase()));
  const COMMAND_SET = buildCommandSet();

  const ui = {
    navToggle: document.getElementById("navToggle"),
    mainNav: document.getElementById("mainNav"),
    scnSearch: document.getElementById("scnSearch"),
    scnDifficulty: document.getElementById("scnDifficulty"),
    hotkeysBtn: document.getElementById("webHotkeysBtn"),
    scnList: document.getElementById("scnList"),
    overallFill: document.getElementById("webOverallFill"),
    overallLabel: document.getElementById("webOverallLabel"),
    overallPct: document.getElementById("webOverallPct"),
    title: document.getElementById("webTitle"),
    score: document.getElementById("webScore"),
    accepted: document.getElementById("webAccepted"),
    dots: document.getElementById("webDots"),
    output: document.getElementById("webOutput"),
    requestBox: document.getElementById("webRequestBox"),
    responseBox: document.getElementById("webResponseBox"),
    sessionTime: document.getElementById("webSessionTime"),
    scenarioTime: document.getElementById("webScenarioTime"),
    streak: document.getElementById("webStreak"),
    bestStreak: document.getElementById("webBestStreak"),
    prompt: document.getElementById("webPrompt"),
    input: document.getElementById("webInput"),
    objective: document.getElementById("webObjective"),
    stageText: document.getElementById("webStageText"),
    stageCounter: document.getElementById("webStageCounter"),
    attackChain: document.getElementById("webAttackChain"),
    hintState: document.getElementById("webHintState"),
    hintBtn: document.getElementById("webHintBtn"),
    revealBtn: document.getElementById("webRevealBtn"),
    skipBtn: document.getElementById("webSkipBtn"),
    resetBtn: document.getElementById("webResetBtn"),
    nextBtn: document.getElementById("webNextBtn"),
    suggestBtn: document.getElementById("webSuggestBtn"),
    exportBtn: document.getElementById("webExportBtn"),
    aarBtn: document.getElementById("webAarBtn"),
    achievements: document.getElementById("webAchievements"),
    achSummary: document.getElementById("webAchSummary"),
    timeline: document.getElementById("webTimeline"),
    drawer: document.getElementById("webDrawer"),
    drawerBody: document.getElementById("webDrawerBody"),
    drawerClose: document.getElementById("webDrawerClose"),
    toastWrap: document.getElementById("webToastWrap"),
    modal: document.getElementById("webModal"),
    modalBody: document.getElementById("webModalBody"),
    modalClose: document.getElementById("webModalClose"),
    modalPrimary: document.getElementById("webModalPrimary"),
    ref: document.getElementById("webRef")
  };

  const state = {
    scenarioIndex: -1,
    stageIndex: 0,
    score: 0,
    accepted: 0,
    completedStages: 0,
    cleanStages: 0,
    hintUsed: false,
    revealUsed: false,
    streak: 0,
    bestStreak: 0,
    difficultyFilter: "all",
    events: [],
    unlocked: {},
    sessionStart: Date.now(),
    scenarioStart: Date.now(),
    timerId: null,
    history: [],
    historyCursor: 0,
    completed: {}
  };

  function buildCommandSet() {
    const set = new Set();
    const roots = Array.from(ROOT_SET).slice(0, 2600);
    for (let i = 0; i < roots.length; i += 1) {
      const root = roots[i];
      for (let p = 0; p < PREFIXES.length; p += 1) {
        for (let o = 0; o < WEB_OBJECTS.length; o += 1) {
          for (let s = 0; s < SUFFIXES.length; s += 1) {
            set.add((PREFIXES[p] + root + " " + WEB_OBJECTS[o] + SUFFIXES[s]).replace(/\s+/g, " ").trim());
          }
        }
      }
    }
    return set;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        score: state.score,
        accepted: state.accepted,
        completedStages: state.completedStages,
        cleanStages: state.cleanStages,
        bestStreak: state.bestStreak,
        unlocked: state.unlocked,
        completed: state.completed
      }));
    } catch (_error) {
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        state.score = typeof parsed.score === "number" ? parsed.score : 0;
        state.accepted = typeof parsed.accepted === "number" ? parsed.accepted : 0;
        state.completedStages = typeof parsed.completedStages === "number" ? parsed.completedStages : 0;
        state.cleanStages = typeof parsed.cleanStages === "number" ? parsed.cleanStages : 0;
        state.bestStreak = typeof parsed.bestStreak === "number" ? parsed.bestStreak : 0;
        state.unlocked = parsed.unlocked && typeof parsed.unlocked === "object" ? parsed.unlocked : {};
        state.completed = parsed.completed && typeof parsed.completed === "object" ? parsed.completed : {};
      }
    } catch (_error) {
    }
  }

  function line(type, text) {
    const p = document.createElement("p");
    p.className = "line " + type;
    p.textContent = text;
    ui.output.appendChild(p);
    ui.output.scrollTop = ui.output.scrollHeight;
  }

  function setupNavToggle() {
    if (!ui.navToggle || !ui.mainNav) {
      return;
    }
    ui.navToggle.addEventListener("click", () => {
      ui.mainNav.classList.toggle("open");
      ui.mainNav.classList.toggle("is-open");
    });
  }

  function scenarioKey(index) {
    return "ws:" + index;
  }

  function getScenario() {
    return state.scenarioIndex >= 0 ? SCENARIOS[state.scenarioIndex] : null;
  }

  function getStage() {
    const scenario = getScenario();
    if (!scenario) {
      return null;
    }
    return scenario.stages[state.stageIndex] || null;
  }

  function renderScenarioList() {
    const query = ui.scnSearch.value.trim().toLowerCase();
    const difficulty = ui.scnDifficulty ? ui.scnDifficulty.value : "all";
    state.difficultyFilter = difficulty;
    ui.scnList.innerHTML = "";

    SCENARIOS.forEach((scenario, idx) => {
      const searchable = (scenario.title + " " + scenario.stack + " " + scenario.difficulty).toLowerCase();
      if (query && searchable.indexOf(query) === -1) {
        return;
      }
      if (difficulty !== "all" && scenario.difficulty !== difficulty) {
        return;
      }

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "scn-btn" + (idx === state.scenarioIndex ? " active" : "");
      btn.innerHTML = escapeHtml(scenario.title) + "<small>" + escapeHtml(scenario.stack + " | " + scenario.difficulty + " | " + scenario.stages.length + " stages") + "</small>";
      btn.addEventListener("click", () => {
        state.scenarioIndex = idx;
        state.stageIndex = 0;
        state.hintUsed = false;
        state.revealUsed = false;
        renderScenarioList();
        renderScenarioState(true);
      });
      ui.scnList.appendChild(btn);
    });
  }

  function renderOverallProgress() {
    const total = SCENARIOS.length;
    const done = Object.keys(state.completed).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    ui.overallFill.style.width = pct + "%";
    ui.overallFill.classList.remove("pulse");
    void ui.overallFill.offsetWidth;
    ui.overallFill.classList.add("pulse");
    ui.overallLabel.textContent = done + " / " + total + " complete";
    ui.overallPct.textContent = pct + "%";
  }

  function renderStats() {
    ui.score.textContent = "score: " + state.score;
    ui.accepted.textContent = "accepted: " + state.accepted;
    ui.streak.textContent = String(state.streak);
    ui.bestStreak.textContent = String(state.bestStreak);
  }

  function renderTimeline() {
    if (!ui.timeline) {
      return;
    }
    if (!state.events.length) {
      ui.timeline.innerHTML = '<div class="timeline-item">No events yet.<small>Run commands to build your investigation chain.</small></div>';
      return;
    }
    ui.timeline.innerHTML = state.events.slice(-16).reverse().map((event) => {
      return '<div class="timeline-item">' + escapeHtml(event.message) + '<small>' + escapeHtml(event.when) + '</small></div>';
    }).join("");
  }

  function renderAchievements() {
    if (!ui.achievements) {
      return;
    }
    let unlockedCount = 0;
    ui.achievements.innerHTML = ACHIEVEMENTS.map((achievement) => {
      const on = !!state.unlocked[achievement.key];
      if (on) {
        unlockedCount += 1;
      }
      return '<span class="badge' + (on ? ' on' : '') + '">' + escapeHtml(achievement.label) + '</span>';
    }).join("");
    ui.achSummary.textContent = unlockedCount + " unlocked";
  }

  function checkAchievements() {
    for (let i = 0; i < ACHIEVEMENTS.length; i += 1) {
      const achievement = ACHIEVEMENTS[i];
      if (state.unlocked[achievement.key]) {
        continue;
      }
      if (achievement.test(state)) {
        state.unlocked[achievement.key] = true;
        line("ok", "Achievement unlocked: " + achievement.label);
        pushEvent("Achievement: " + achievement.label);
        showToast("Achievement", achievement.label);
      }
    }
    renderAchievements();
    saveState();
  }

  function formatDuration(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  }

  function updateTimers() {
    if (ui.sessionTime) {
      ui.sessionTime.textContent = formatDuration(Date.now() - state.sessionStart);
    }
    if (ui.scenarioTime) {
      ui.scenarioTime.textContent = formatDuration(Date.now() - state.scenarioStart);
    }
  }

  function pushEvent(message) {
    state.events.push({ message: message, when: new Date().toLocaleTimeString() });
    if (state.events.length > 160) {
      state.events = state.events.slice(-120);
    }
    renderTimeline();
    renderAar();
  }

  function renderDots(total, index) {
    ui.dots.innerHTML = "";
    for (let i = 0; i < total; i += 1) {
      const dot = document.createElement("span");
      dot.className = "dot";
      if (i < index) {
        dot.classList.add("done");
      } else if (i === index) {
        dot.classList.add("active");
      }
      ui.dots.appendChild(dot);
    }
  }

  function renderAttackChain() {
    if (!ui.attackChain) {
      return;
    }
    const scenario = getScenario();
    const stages = ["detect", "triage", "contain", "remediate", "verify"];
    if (!scenario) {
      ui.attackChain.innerHTML = stages.map((label) => '<div class="chain-node">' + label + '<span>pending</span></div>').join("");
      return;
    }
    const total = scenario.stages.length;
    const doneIndex = Math.min(state.stageIndex, total);
    ui.attackChain.innerHTML = stages.map((label, idx) => {
      const mapped = Math.floor((idx / stages.length) * total);
      let klass = "";
      let status = "pending";
      if (mapped < doneIndex) {
        klass = " done";
        status = "done";
      } else if (mapped === doneIndex && doneIndex < total) {
        klass = " on";
        status = "active";
      }
      return '<div class="chain-node' + klass + '">' + label + '<span>' + status + '</span></div>';
    }).join("");
  }

  function showToast(title, message) {
    if (!ui.toastWrap) {
      return;
    }
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = "<strong>" + escapeHtml(title) + "</strong>" + escapeHtml(message);
    ui.toastWrap.appendChild(toast);
    while (ui.toastWrap.children.length > 4) {
      ui.toastWrap.removeChild(ui.toastWrap.firstChild);
    }
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 2600);
  }

  function renderScenarioState(announce) {
    const scenario = getScenario();
    if (!scenario) {
      ui.title.textContent = "No scenario selected";
      ui.objective.textContent = "Select a scenario from the left to begin a multi-stage simulation.";
      ui.stageText.textContent = "No active stage";
      ui.stageCounter.textContent = "Stage 0 / 0";
      ui.hintState.textContent = "Hint: off";
      ui.requestBox.textContent = "REQUEST\n---\nMethod: GET\nPath: /\nHeaders: default";
      ui.responseBox.textContent = "RESPONSE\n---\nStatus: 200\nBody: Ready";
      ui.prompt.textContent = "websim>";
      ui.dots.innerHTML = "";
      state.scenarioStart = Date.now();
      updateTimers();
      renderAttackChain();
      return;
    }

    const stage = getStage();
    ui.title.textContent = scenario.title;
    ui.objective.textContent = scenario.objective + " [" + scenario.stack + "]";
    ui.prompt.textContent = "websim:" + scenario.id + ">";
    updateTimers();

    if (!stage) {
      ui.stageText.textContent = "Scenario complete";
      ui.stageCounter.textContent = "Stage " + scenario.stages.length + " / " + scenario.stages.length;
      renderDots(scenario.stages.length, scenario.stages.length);
      renderAttackChain();
      return;
    }

    ui.stageText.textContent = stage.instruction;
    ui.stageCounter.textContent = "Stage " + (state.stageIndex + 1) + " / " + scenario.stages.length;
    ui.hintState.textContent = "Hint: " + (state.hintUsed ? state.revealUsed ? "reveal" : "used" : "off");
    renderDots(scenario.stages.length, state.stageIndex);
    renderAttackChain();

    if (announce) {
      line("sys", "Scenario loaded: " + scenario.title);
      line("sys", "Objective: " + scenario.objective);
      line("sys", "Stage " + (state.stageIndex + 1) + ": " + stage.instruction);
      pushEvent("Loaded " + scenario.id + " - " + scenario.title);
      showToast("Scenario Loaded", scenario.id + " ready for execution");
    }
  }

  function renderReference() {
    const items = [
      ["help", "Show simulator command set"],
      ["list", "List scenario IDs and titles"],
      ["start <id>", "Jump directly to scenario by id"],
      ["hint", "Reveal hint for current stage"],
      ["reveal", "Show exact regex pattern for stage"],
      ["skip", "Skip current stage"],
      ["reset", "Reset current scenario"],
      ["next", "Next scenario"],
      ["suggest", "Print stage-aware command suggestions"],
      ["export report", "Download current simulator progress report"],
      ["stats", "Show score and command-space stats"],
      ["history", "Show recent terminal commands"],
      ["Keyboard", "Ctrl+K focus input, Ctrl+L clear, ? shortcuts"],
      ["Traffic commands", "probe|inspect|analyze|exploit|patch|verify ..."],
      ["Synthetic roots", "Examples: websim-00042, websim-03456"]
    ];

    ui.ref.innerHTML = items.map((item) => {
      return '<div class="ref-item"><div class="ref-cmd">' + escapeHtml(item[0]) + '</div><div class="ref-desc">' + escapeHtml(item[1]) + "</div></div>";
    }).join("");
  }

  function normalize(input) {
    return String(input || "").replace(/\s+/g, " ").trim();
  }

  function firstToken(input) {
    return normalize(input).split(" ")[0].toLowerCase();
  }

  function acceptedByGrammar(input) {
    const normalized = normalize(input).toLowerCase();
    if (!normalized) {
      return false;
    }

    if (COMMAND_SET.has(normalized) || ROOT_SET.has(normalized)) {
      return true;
    }

    const first = firstToken(normalized);
    if (ROOT_SET.has(first)) {
      return true;
    }

    const segments = normalized.split(/\s*(?:\|\||&&|\||;)\s*/).filter(Boolean);
    for (let i = 0; i < segments.length; i += 1) {
      const token = firstToken(segments[i]);
      if (ROOT_SET.has(token)) {
        return true;
      }
    }

    if (normalized.indexOf("start ws-") === 0 || normalized.indexOf("start ") === 0) {
      return true;
    }

    return false;
  }

  function updateTrafficPanels(command, result) {
    const scenario = getScenario();
    const path = extractPath(command);
    const method = inferMethod(command);
    const status = inferStatus(command, result);

    ui.requestBox.textContent = "REQUEST\n---\nMethod: " + method + "\nPath: " + path + "\nScenario: " + (scenario ? scenario.id : "none") + "\nCmd: " + shorten(command, 88);
    ui.responseBox.textContent = "RESPONSE\n---\nStatus: " + status + "\nSignal: " + shorten(result, 88) + "\nTrace: " + randomTraceId();
  }

  function inferMethod(command) {
    const lower = command.toLowerCase();
    if (lower.indexOf("post") >= 0 || lower.indexOf("transfer") >= 0 || lower.indexOf("login") >= 0) {
      return "POST";
    }
    if (lower.indexOf("patch") >= 0 || lower.indexOf("fix") >= 0) {
      return "PATCH";
    }
    return "GET";
  }

  function extractPath(command) {
    const match = command.match(/\/[a-zA-Z0-9_\-\/\{\}]+/);
    return match ? match[0] : "/";
  }

  function inferStatus(command, result) {
    const lower = command.toLowerCase();
    if (lower.indexOf("patch") >= 0 || lower.indexOf("fix") >= 0 || lower.indexOf("verify") >= 0) {
      return "200";
    }
    if (result.toLowerCase().indexOf("blocked") >= 0) {
      return "403";
    }
    if (lower.indexOf("exploit") >= 0 || lower.indexOf("test") >= 0) {
      return "206";
    }
    return "200";
  }

  function randomTraceId() {
    const a = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, "0");
    const b = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, "0");
    return "ws-trace-" + a + b;
  }

  function shorten(text, max) {
    if (text.length <= max) {
      return text;
    }
    return text.slice(0, max - 3) + "...";
  }

  function scenarioFromId(id) {
    const lower = String(id || "").toLowerCase();
    for (let i = 0; i < SCENARIOS.length; i += 1) {
      if (SCENARIOS[i].id.toLowerCase() === lower) {
        return i;
      }
    }
    return -1;
  }

  function completeStage() {
    const scenario = getScenario();
    const stage = getStage();
    if (!scenario || !stage) {
      return;
    }

    const gained = state.revealUsed ? POINTS.reveal : state.hintUsed ? POINTS.hint : POINTS.clean;
    state.score += gained;
    state.completedStages += 1;
    if (!state.hintUsed && !state.revealUsed) {
      state.cleanStages += 1;
      state.streak += 1;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
    } else {
      state.streak = 0;
    }
    line("ok", "Stage complete (+" + gained + " pts)");
    line("sys", stage.output);
    pushEvent("Stage " + (state.stageIndex + 1) + " completed (" + gained + " pts)");
    showToast("Stage Cleared", "+" + gained + " points");

    state.stageIndex += 1;
    state.hintUsed = false;
    state.revealUsed = false;

    if (state.stageIndex >= scenario.stages.length) {
      const key = scenarioKey(state.scenarioIndex);
      if (!state.completed[key]) {
        state.completed[key] = true;
        state.score += POINTS.complete;
        line("ok", "Scenario completion bonus ( +" + POINTS.complete + " pts )");
        pushEvent("Scenario completed: " + scenario.id);
        showToast("Scenario Complete", scenario.id + " closed successfully");
      }
      line("ok", "Scenario complete: " + scenario.title);
      openModal("Scenario Complete", "<p>You completed <strong>" + escapeHtml(scenario.title) + "</strong>.</p><p>Continue to the next scenario or export your report for review.</p>", "Next Scenario", nextScenario);
    } else {
      line("sys", "Next stage loaded.");
    }

    renderScenarioState(false);
    renderScenarioList();
    renderStats();
    checkAchievements();
    renderOverallProgress();
    saveState();
  }

  function showHint() {
    const stage = getStage();
    if (!stage) {
      line("err", "No active stage.");
      return;
    }
    state.hintUsed = true;
    ui.hintState.textContent = "Hint: used";
    line("hint", "Hint: " + stage.hint);
  }

  function revealPattern() {
    const stage = getStage();
    if (!stage) {
      line("err", "No active stage.");
      return;
    }
    state.hintUsed = true;
    state.revealUsed = true;
    ui.hintState.textContent = "Hint: reveal";
    line("hint", "Expected pattern: " + stage.pattern.toString());
  }

  function skipStage() {
    const scenario = getScenario();
    if (!scenario || !getStage()) {
      line("err", "No active stage.");
      return;
    }
    line("warn", "Stage skipped.");
    state.streak = 0;
    pushEvent("Stage skipped");
    state.stageIndex += 1;
    state.hintUsed = false;
    state.revealUsed = false;
    renderScenarioState(false);
    saveState();
  }

  function resetScenario() {
    if (state.scenarioIndex < 0) {
      line("err", "No scenario selected.");
      return;
    }
    state.stageIndex = 0;
    state.hintUsed = false;
    state.revealUsed = false;
    state.streak = 0;
    state.scenarioStart = Date.now();
    line("sys", "Scenario reset.");
    pushEvent("Scenario reset");
    renderScenarioState(false);
  }

  function nextScenario() {
    if (!SCENARIOS.length) {
      return;
    }
    state.scenarioIndex = state.scenarioIndex < 0 ? 0 : (state.scenarioIndex + 1) % SCENARIOS.length;
    state.stageIndex = 0;
    state.hintUsed = false;
    state.revealUsed = false;
    state.scenarioStart = Date.now();
    renderScenarioList();
    renderScenarioState(true);
  }

  function suggestedCommands() {
    const scenario = getScenario();
    const stage = getStage();
    if (!scenario || !stage) {
      return ["start ws-01", "list", "help"];
    }
    const id = scenario.id;
    const target = extractPath(stage.hint);
    return [
      stage.hint,
      "probe " + target + " --verbose",
      "analyze logs filter:" + id,
      "verify " + target + " suite:" + id + "-regression"
    ];
  }

  function printSuggestions() {
    const suggestions = suggestedCommands();
    line("sys", "Suggested commands:");
    for (let i = 0; i < suggestions.length; i += 1) {
      line("hint", "  - " + suggestions[i]);
    }
  }

  function openModal(title, html, primaryLabel, primaryAction) {
    if (!ui.modal || !ui.modalBody || !ui.modalPrimary) {
      return;
    }
    const heading = document.getElementById("webModalTitle");
    if (heading) {
      heading.textContent = title;
    }
    ui.modalBody.innerHTML = html;
    ui.modalPrimary.textContent = primaryLabel || "Close";
    ui.modalPrimary.onclick = function () {
      closeModal();
      if (typeof primaryAction === "function") {
        primaryAction();
      }
    };
    ui.modal.classList.add("open");
    ui.modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    if (!ui.modal) {
      return;
    }
    ui.modal.classList.remove("open");
    ui.modal.setAttribute("aria-hidden", "true");
  }

  function exportReport() {
    const report = {
      generatedAt: new Date().toISOString(),
      score: state.score,
      accepted: state.accepted,
      completedStages: state.completedStages,
      completedScenarios: Object.keys(state.completed),
      unlockedAchievements: Object.keys(state.unlocked).filter((key) => state.unlocked[key]),
      bestStreak: state.bestStreak,
      recentEvents: state.events.slice(-20)
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "web-sim-report-" + Date.now() + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    line("ok", "Report exported.");
    pushEvent("Report exported");
  }

  function renderAar() {
    if (!ui.drawerBody) {
      return;
    }
    const completedCount = Object.keys(state.completed).length;
    const totalStages = SCENARIOS.reduce((acc, s) => acc + s.stages.length, 0);
    const completionRate = totalStages ? Math.round((state.completedStages / totalStages) * 100) : 0;
    const recent = state.events.slice(-12).reverse();
    ui.drawerBody.innerHTML =
      '<div class="metric-grid">' +
      '<div class="metric-card"><div class="metric-label">Score</div><div class="metric-value">' + state.score + '</div></div>' +
      '<div class="metric-card"><div class="metric-label">Accepted Cmds</div><div class="metric-value">' + state.accepted + '</div></div>' +
      '<div class="metric-card"><div class="metric-label">Stages Cleared</div><div class="metric-value">' + state.completedStages + '/' + totalStages + '</div></div>' +
      '<div class="metric-card"><div class="metric-label">Completion Rate</div><div class="metric-value">' + completionRate + '%</div></div>' +
      '<div class="metric-card"><div class="metric-label">Scenarios</div><div class="metric-value">' + completedCount + '/' + SCENARIOS.length + '</div></div>' +
      '<div class="metric-card"><div class="metric-label">Best Streak</div><div class="metric-value">' + state.bestStreak + '</div></div>' +
      '</div>' +
      '<h4>Recent Operations</h4>' +
      '<div>' + (recent.length ? recent.map((event) => '<p>- ' + escapeHtml(event.when + ' | ' + event.message) + '</p>').join("") : '<p>No events yet.</p>') + '</div>';
  }

  function openDrawer() {
    if (!ui.drawer) {
      return;
    }
    renderAar();
    ui.drawer.classList.add("open");
    ui.drawer.setAttribute("aria-hidden", "false");
  }

  function closeDrawer() {
    if (!ui.drawer) {
      return;
    }
    ui.drawer.classList.remove("open");
    ui.drawer.setAttribute("aria-hidden", "true");
  }

  function printHistory() {
    if (!state.history.length) {
      line("sys", "History is empty.");
      return;
    }
    state.history.slice(-15).forEach((entry, idx) => line("sys", String(idx + 1).padStart(2, "0") + "  " + entry));
  }

  function printHelp() {
    line("sys", "Core commands: help, list, start <id>, hint, reveal, skip, reset, next, stats, history, clear");
    line("sys", "Advanced commands: suggest, export report, guide");
    line("sys", "Simulation verbs: probe, inspect, analyze, exploit, patch, verify, report, timeline");
    line("sys", "Command roots: " + ROOT_SET.size + " (includes " + SYNTHETIC_ROOTS.length + " synthetic roots)");
    line("sys", "Generated command forms: " + COMMAND_SET.size);
  }

  function listScenarios() {
    for (let i = 0; i < SCENARIOS.length; i += 1) {
      line("sys", SCENARIOS[i].id + "  " + SCENARIOS[i].title + "  [" + SCENARIOS[i].difficulty + "]");
    }
  }

  function commandResponse(input) {
    const lower = input.toLowerCase();
    if (lower.indexOf("probe") === 0 || lower.indexOf("map") === 0) {
      return "Discovery pipeline completed for requested surface.";
    }
    if (lower.indexOf("inspect") === 0) {
      return "Inspection complete: headers, policy, and middleware metadata loaded.";
    }
    if (lower.indexOf("analyze") === 0 || lower.indexOf("query") === 0) {
      return "Telemetry analysis complete. Relevant traces correlated.";
    }
    if (lower.indexOf("exploit") === 0 || lower.indexOf("test") === 0) {
      return "Controlled attack simulation executed in sandbox profile.";
    }
    if (lower.indexOf("patch") === 0 || lower.indexOf("fix") === 0) {
      return "Mitigation patch operation simulated successfully.";
    }
    if (lower.indexOf("verify") === 0 || lower.indexOf("validate") === 0) {
      return "Verification run complete. Regression checks reported.";
    }
    if (lower.indexOf("report") === 0) {
      return "Report draft generated with timeline and remediation details.";
    }
    if (lower.indexOf("timeline") === 0) {
      return "Incident timeline rendered: detect -> triage -> contain -> remediate -> verify.";
    }
    return "Command accepted in web simulation context.";
  }

  function processInput(raw) {
    const input = normalize(raw);
    if (!input) {
      return;
    }

    state.history.push(input);
    state.historyCursor = state.history.length;
    line("cmd", ui.prompt.textContent + " " + input);

    const lower = input.toLowerCase();

    if (lower === "help") { printHelp(); return; }
    if (lower === "list") { listScenarios(); return; }
    if (lower === "hint") { showHint(); return; }
    if (lower === "reveal") { revealPattern(); return; }
    if (lower === "skip") { skipStage(); return; }
    if (lower === "reset") { resetScenario(); return; }
    if (lower === "next") { nextScenario(); return; }
    if (lower === "suggest") { printSuggestions(); return; }
    if (lower === "aar" || lower === "report view") { openDrawer(); return; }
    if (lower === "guide") {
      openModal("Simulator Guide", "<p>Use <strong>list</strong> to browse scenarios and <strong>start ws-01</strong> to begin.</p><p>Clear stages with exact objective-aligned commands. Use <strong>hint</strong> if blocked, then recover your streak with clean completions.</p>", "Start ws-01", function () {
        processInput("start ws-01");
      });
      return;
    }
    if (lower === "export report") { exportReport(); return; }
    if (lower === "history") { printHistory(); return; }
    if (lower === "stats") { line("sys", "Score " + state.score + " | Accepted " + state.accepted + " | Completed " + Object.keys(state.completed).length + "/" + SCENARIOS.length); return; }
    if (lower === "clear" || lower === "cls") { ui.output.innerHTML = ""; line("sys", "Terminal cleared."); return; }

    if (lower.indexOf("start ") === 0) {
      const id = input.split(/\s+/)[1] || "";
      const idx = scenarioFromId(id);
      if (idx < 0) {
        line("err", "Scenario not found: " + id);
      } else {
        state.scenarioIndex = idx;
        state.stageIndex = 0;
        state.hintUsed = false;
        state.revealUsed = false;
        renderScenarioList();
        renderScenarioState(true);
      }
      return;
    }

    if (!acceptedByGrammar(input)) {
      line("err", "Command not recognized. Use 'help' to view command capabilities.");
      return;
    }

    state.accepted += 1;
    pushEvent("Accepted command: " + shorten(input, 58));
    renderAar();
    renderStats();

    const result = commandResponse(input);
    line("sys", result);
    updateTrafficPanels(input, result);

    const stage = getStage();
    if (!stage) {
      saveState();
      return;
    }

    if (stage.pattern.test(input)) {
      completeStage();
    } else {
      line("warn", "Accepted command, but it does not satisfy the current stage objective.");
      saveState();
    }
  }

  function bindInput() {
    ui.input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const value = ui.input.value;
        ui.input.value = "";
        processInput(value);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (state.history.length) {
          state.historyCursor = Math.max(0, state.historyCursor - 1);
          ui.input.value = state.history[state.historyCursor] || "";
        }
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (state.history.length) {
          state.historyCursor = Math.min(state.history.length, state.historyCursor + 1);
          ui.input.value = state.history[state.historyCursor] || "";
        }
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        if (!ui.input.value.trim()) {
          const stage = getStage();
          if (stage) {
            ui.input.value = stage.hint;
          }
        }
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        ui.input.focus();
        ui.input.select();
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "l") {
        event.preventDefault();
        ui.output.innerHTML = "";
        line("sys", "Terminal cleared.");
        return;
      }
    });
  }

  function bindShortcuts() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "?" && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        openModal("Keyboard Shortcuts", "<p><kbd>Enter</kbd> run command</p><p><kbd>Tab</kbd> stage hint fill</p><p><kbd>Up</kbd>/<kbd>Down</kbd> command history</p><p><kbd>Ctrl</kbd>+<kbd>K</kbd> focus input</p><p><kbd>Ctrl</kbd>+<kbd>L</kbd> clear output</p><p><kbd>?</kbd> open shortcuts</p>", "Close", closeModal);
      }
      if (event.key === "Escape") {
        closeModal();
        closeDrawer();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "j") {
        event.preventDefault();
        openDrawer();
      }
    });
  }

  function bindButtons() {
    ui.hintBtn.addEventListener("click", showHint);
    ui.revealBtn.addEventListener("click", revealPattern);
    ui.skipBtn.addEventListener("click", skipStage);
    ui.resetBtn.addEventListener("click", resetScenario);
    ui.nextBtn.addEventListener("click", nextScenario);
    ui.suggestBtn.addEventListener("click", printSuggestions);
    ui.exportBtn.addEventListener("click", exportReport);
    ui.aarBtn.addEventListener("click", openDrawer);
    ui.scnSearch.addEventListener("input", renderScenarioList);
    ui.scnDifficulty.addEventListener("change", renderScenarioList);
    ui.hotkeysBtn.addEventListener("click", () => {
      openModal("Keyboard Shortcuts", "<p><kbd>Enter</kbd> run command</p><p><kbd>Tab</kbd> stage hint fill</p><p><kbd>Up</kbd>/<kbd>Down</kbd> command history</p><p><kbd>Ctrl</kbd>+<kbd>K</kbd> focus input</p><p><kbd>Ctrl</kbd>+<kbd>L</kbd> clear output</p>", "Close", closeModal);
    });
    ui.modalClose.addEventListener("click", closeModal);
    ui.drawerClose.addEventListener("click", closeDrawer);
    ui.modal.addEventListener("click", (event) => {
      if (event.target === ui.modal) {
        closeModal();
      }
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function init() {
    setupNavToggle();
    loadState();
    renderScenarioList();
    renderReference();
    renderScenarioState(false);
    renderOverallProgress();
    renderStats();
    bindInput();
    bindButtons();
    bindShortcuts();
    renderTimeline();
    renderAchievements();
    renderAttackChain();
    renderAar();
    state.timerId = setInterval(updateTimers, 1000);
    updateTimers();

    line("sys", "Web Security Deep Simulator ready.");
    line("sys", "Loaded " + SCENARIOS.length + " scenarios with " + (SCENARIOS.length * 5) + " guided stages.");
    line("sys", "Command roots: " + ROOT_SET.size + " | Generated command forms: " + COMMAND_SET.size + ".");
    line("sys", "Use 'list' to browse scenarios or 'start ws-01' to begin.");
    line("sys", "Use 'aar' or Ctrl+J to open the After Action Report.");
    openModal("Welcome to Web Security Deep Simulator", "<p>Train through 12 multi-stage scenarios with scoring, streaks, achievements, and incident timeline tracking.</p><p>Use <strong>help</strong> for commands or press <strong>?</strong> for keyboard shortcuts.</p>", "Start ws-01", function () {
      processInput("start ws-01");
    });
  }

  init();
})();
