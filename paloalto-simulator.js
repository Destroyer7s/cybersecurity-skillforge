(function () {
  "use strict";

  const STORAGE_KEY = "pa-sim-v2";
  const POINTS = { clean: 10, hint: 5, reveal: 3, complete: 30 };

  const SCENARIOS = [
    {
      id: "pan-threat-log-triage",
      name: "Threat Log Triage",
      difficulty: "Intermediate",
      objective: "Investigate high-severity threat activity and map source, destination, and blocked signatures.",
      stages: [
        { instruction: "Pull recent threat logs.", hint: "show log threat direction equal backward", pattern: /show\s+log\s+threat/i, output: "threat-log: 12 critical, 41 high (24h)" },
        { instruction: "Filter by high or critical severity.", hint: "show log threat | match severity", pattern: /(match|filter|grep).*(critical|high)|show\s+log\s+threat.*(critical|high)/i, output: "severity-filter: 8 candidate events remain" },
        { instruction: "Inspect the top destination signatures.", hint: "show log threat | match spyware", pattern: /(spyware|vulnerability|signature|threatid|match)/i, output: "top-signature: spyware-c2-beaconing (7 hits)" },
        { instruction: "Validate matching security rule behavior.", hint: "show rule-hit-count vsys vsys1 rule-base security rules all", pattern: /(show\s+rule-hit-count|security-policy-match|show\s+running\s+security-policy)/i, output: "rule-check: block-c2 outbound rule hit count increased" }
      ]
    },
    {
      id: "pan-nat-debug",
      name: "NAT Debug",
      difficulty: "Advanced",
      objective: "Debug NAT translation mismatch causing outbound app failures.",
      stages: [
        { instruction: "Find active sessions for impacted source host.", hint: "show session all filter source 10.20.40.17", pattern: /show\s+session\s+(all|id).*(source|10\.20\.40\.17)|session\s+filter/i, output: "session-view: 193 sessions from 10.20.40.17" },
        { instruction: "Review NAT policy order and hit counts.", hint: "show running nat-policy", pattern: /(show\s+running\s+nat-policy|show\s+rule-hit-count.*nat)/i, output: "nat-policy: legacy-overload rule matched before app-specific NAT" },
        { instruction: "Simulate translation for affected tuple.", hint: "test nat-policy-match from trust to untrust source 10.20.40.17 destination 198.51.100.20 protocol 6", pattern: /(test\s+nat-policy-match|nat-policy-match)/i, output: "nat-test: translated to unexpected egress address" },
        { instruction: "Validate post-change session behavior.", hint: "show session all filter destination 198.51.100.20", pattern: /(show\s+session|commit|show\s+jobs\s+all)/i, output: "post-check: sessions now use expected SNAT and app recovers" }
      ]
    },
    {
      id: "pan-ha-health",
      name: "HA Health and Failover",
      difficulty: "Intermediate",
      objective: "Verify HA sync status and failover readiness across pair.",
      stages: [
        { instruction: "Check HA state on active node.", hint: "show high-availability state", pattern: /show\s+high-availability\s+state|show\s+high-availability\s+all/i, output: "ha-state: active-primary, peer passive-secondary" },
        { instruction: "Inspect path/link monitoring health.", hint: "show high-availability link-monitoring", pattern: /show\s+high-availability\s+(link|path)-monitoring/i, output: "monitoring: all monitored links healthy" },
        { instruction: "Confirm configuration sync status.", hint: "show high-availability state | match running-sync", pattern: /(running-sync|state\s+sync|in-sync|show\s+high-availability)/i, output: "sync-state: running-config synchronized" },
        { instruction: "Queue controlled suspend test preparation.", hint: "request high-availability state suspend", pattern: /(request\s+high-availability\s+state\s+suspend|show\s+jobs\s+all)/i, output: "ha-action: suspend request queued in maintenance window" }
      ]
    },
    {
      id: "pan-globalprotect",
      name: "GlobalProtect Incident",
      difficulty: "Advanced",
      objective: "Investigate VPN authentication failures and tunnel assignment drift.",
      stages: [
        { instruction: "List active gateway users and session counts.", hint: "show global-protect-gateway current-user", pattern: /show\s+global-protect-gateway\s+current-user|global-protect/i, output: "gp-users: 321 active sessions" },
        { instruction: "Review auth failure trend metrics.", hint: "show authentication statistics", pattern: /show\s+authentication\s+statistics|authd/i, output: "auth-stats: failures +37% in last hour" },
        { instruction: "Inspect user mapping consistency.", hint: "show user ip-user-mapping all", pattern: /show\s+user\s+ip-user-mapping\s+all|ip-user-mapping/i, output: "mapping-check: 12 stale user-ip mappings detected" },
        { instruction: "Tail auth daemon logs for root cause.", hint: "tail follow yes mp-log authd.log", pattern: /(tail\s+follow\s+yes\s+mp-log\s+authd\.log|less\s+mp-log\s+authd\.log)/i, output: "authd-log: SAML assertion clock skew observed" }
      ]
    },
    {
      id: "pan-url-filtering",
      name: "URL Filtering Validation",
      difficulty: "Intermediate",
      objective: "Validate URL category enforcement and override behavior.",
      stages: [
        { instruction: "Review URL filtering profile in running config.", hint: "show running security-policy", pattern: /show\s+running\s+security-policy|url-filtering/i, output: "profile: strict-web-profile attached to outbound rule" },
        { instruction: "Confirm policy hit count for web rule.", hint: "show rule-hit-count vsys vsys1 rule-base security rules all", pattern: /show\s+rule-hit-count|security\s+rules/i, output: "hit-count: outbound-web-policy 12891 hits" },
        { instruction: "Check recent URL events in threat/url logs.", hint: "show log threat | match url", pattern: /show\s+log\s+threat|show\s+log\s+traffic|match\s+url/i, output: "url-events: 14 newly blocked high-risk domains" },
        { instruction: "Document expected action and user impact.", hint: "echo \"blocked malicious domains; no business-critical impact\"", pattern: /(echo|printf|write-output|note|document)/i, output: "note-saved: policy remains in block mode" }
      ]
    },
    {
      id: "pan-appid-troubleshoot",
      name: "App-ID Drift Troubleshoot",
      difficulty: "Advanced",
      objective: "Investigate App-ID mismatch causing policy bypass risk.",
      stages: [
        { instruction: "Inspect sessions for unknown-tcp or unknown apps.", hint: "show session all filter application unknown-tcp", pattern: /show\s+session\s+all.*(application|unknown)|unknown-tcp/i, output: "appid-view: unknown-tcp burst detected" },
        { instruction: "Correlate with traffic log entries.", hint: "show log traffic | match unknown-tcp", pattern: /show\s+log\s+traffic|match\s+unknown/i, output: "traffic-correlation: unknown traffic aligned to backup subnet" },
        { instruction: "Check security rule app/service constraints.", hint: "show running security-policy", pattern: /(show\s+running\s+security-policy|application-default|service\s+any)/i, output: "policy-check: service-any found on critical egress rule" },
        { instruction: "Queue tighter rule recommendation.", hint: "echo \"switch to application-default + explicit app allow-list\"", pattern: /(echo|printf|recommend|application-default)/i, output: "recommendation: rule hardening queued for change review" }
      ]
    },
    {
      id: "pan-management-plane",
      name: "Management Plane Hardening",
      difficulty: "Intermediate",
      objective: "Audit management plane controls and exposure.",
      stages: [
        { instruction: "Review system info and software context.", hint: "show system info", pattern: /show\s+system\s+info|show\s+system\s+resources/i, output: "system-info: PAN-OS version and uptime collected" },
        { instruction: "Check admin accounts and role assignments.", hint: "show admins", pattern: /show\s+admins|admin/i, output: "admin-audit: 6 admin accounts, 2 require review" },
        { instruction: "Verify management services baseline.", hint: "show config pushed-shared-policy", pattern: /(show\s+config|management|service|ssh|https)/i, output: "mgmt-services: HTTPS enabled, SSH restricted" },
        { instruction: "Generate hardening summary note.", hint: "echo \"enforce MFA + source IP restrictions for admin access\"", pattern: /(echo|summary|mfa|source\s+ip)/i, output: "summary: hardening actions logged" }
      ]
    },
    {
      id: "pan-threat-prevention-tuning",
      name: "Threat Prevention Tuning",
      difficulty: "Advanced",
      objective: "Tune noise-heavy threat signatures without losing high-value detections.",
      stages: [
        { instruction: "Pull high-volume threat signatures.", hint: "show log threat | match critical", pattern: /show\s+log\s+threat|match\s+(critical|signature|threat)/i, output: "signature-volume: 3 noisy signatures dominate alerts" },
        { instruction: "Correlate with policy/rule usage.", hint: "show rule-hit-count vsys vsys1 rule-base security rules all", pattern: /show\s+rule-hit-count|rule-base\s+security/i, output: "correlation: noisy signatures tied to shared egress policy" },
        { instruction: "Inspect relevant profile assignment.", hint: "show running security-policy", pattern: /show\s+running\s+security-policy|profile|threat-prevention/i, output: "profile-check: broad profile attached to low-risk segment" },
        { instruction: "Submit tuned profile action plan.", hint: "echo \"split profile by zone and keep critical signatures in block\"", pattern: /(echo|tune|block|profile|zone)/i, output: "tuning-plan: split-profile strategy documented" }
      ]
    }
  ];

  const PAN_ROOTS = [
    "show", "set", "delete", "commit", "configure", "exit", "request", "debug", "test", "less", "tail", "scp",
    "show log threat", "show log traffic", "show log system", "show running security-policy", "show running nat-policy",
    "show session all", "show session id", "show rule-hit-count", "show high-availability state", "show authentication statistics",
    "show global-protect-gateway current-user", "show user ip-user-mapping all", "show system info", "show system resources",
    "show jobs all", "show admins", "show clock", "show ntp", "show arp all", "show routing route"
  ];

  const SHELL_HELPERS = [
    "grep", "awk", "sed", "cut", "sort", "uniq", "head", "cat", "wc", "find", "jq", "python3", "echo", "printf"
  ];

  const PREFIXES = ["", "sudo ", "time ", "nohup ", "cmd /c "];
  const SUFFIXES = ["", " | head -n 20", " | tail -n 20", " | grep -i error", " | sort", " && echo done"];

  function buildSyntheticRoots(count) {
    const roots = [];
    for (let i = 1; i <= count; i += 1) {
      roots.push("panx-" + String(i).padStart(4, "0"));
    }
    return roots;
  }

  const SYNTHETIC_ROOTS = buildSyntheticRoots(2600);
  const ROOT_SET = new Set(PAN_ROOTS.concat(SHELL_HELPERS).concat(SYNTHETIC_ROOTS).map((v) => String(v).toLowerCase()));
  const COMMAND_SET = buildCommandSet();

  const ui = {
    navToggle: document.getElementById("navToggle"),
    mainNav: document.getElementById("mainNav"),
    scenarioList: document.getElementById("paScenarioList"),
    output: document.getElementById("paOutput"),
    input: document.getElementById("paInput"),
    title: document.getElementById("paTitle"),
    stats: document.getElementById("paStats"),
    objective: document.getElementById("paObjective"),
    prompt: document.getElementById("paPrompt"),
    stageInstruction: document.getElementById("paStageInstruction"),
    stageCounter: document.getElementById("paStageCounter"),
    hintState: document.getElementById("paHintState"),
    hintBtn: document.getElementById("paHintBtn"),
    revealBtn: document.getElementById("paRevealBtn"),
    skipBtn: document.getElementById("paSkipBtn"),
    resetBtn: document.getElementById("paResetBtn"),
    nextBtn: document.getElementById("paNextBtn"),
    dots: document.getElementById("paDots"),
    ref: document.getElementById("paRef"),
    overallFill: document.getElementById("paOverallFill"),
    overallLabel: document.getElementById("paOverallLabel"),
    overallPct: document.getElementById("paOverallPct")
  };

  const state = {
    scenarioIndex: -1,
    step: 0,
    accepted: 0,
    score: 0,
    hintUsed: false,
    revealUsed: false,
    history: [],
    cursor: 0,
    completed: {}
  };

  function buildCommandSet() {
    const set = new Set();
    const rootList = Array.from(ROOT_SET).slice(0, 1500);

    for (let i = 0; i < rootList.length; i += 1) {
      const root = rootList[i];
      for (let p = 0; p < PREFIXES.length; p += 1) {
        for (let s = 0; s < SUFFIXES.length; s += 1) {
          const cmd = (PREFIXES[p] + root + SUFFIXES[s]).replace(/\s+/g, " ").trim();
          set.add(cmd);
        }
      }
    }

    return set;
  }

  function line(cls, text) {
    const p = document.createElement("p");
    p.className = "line " + cls;
    p.textContent = text;
    ui.output.appendChild(p);
    ui.output.scrollTop = ui.output.scrollHeight;
  }

  function scenarioKey(index) {
    return "scn:" + index;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        completed: state.completed,
        score: state.score,
        accepted: state.accepted
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
        state.completed = parsed.completed && typeof parsed.completed === "object" ? parsed.completed : {};
        state.score = typeof parsed.score === "number" ? parsed.score : 0;
        state.accepted = typeof parsed.accepted === "number" ? parsed.accepted : 0;
      }
    } catch (_error) {
    }
  }

  function setupNav() {
    if (!ui.navToggle || !ui.mainNav) {
      return;
    }
    ui.navToggle.addEventListener("click", () => ui.mainNav.classList.toggle("open"));
  }

  function renderScenarioButtons() {
    ui.scenarioList.innerHTML = "";
    SCENARIOS.forEach((scenario, idx) => {
      const btn = document.createElement("button");
      btn.className = "pa-btn" + (idx === state.scenarioIndex ? " active" : "");
      btn.type = "button";
      btn.innerHTML = scenario.name + "<small>" + scenario.difficulty + " | " + scenario.stages.length + " stages</small>";
      btn.addEventListener("click", () => {
        state.scenarioIndex = idx;
        state.step = 0;
        state.hintUsed = false;
        state.revealUsed = false;
        renderScenarioButtons();
        renderScenario();
      });
      ui.scenarioList.appendChild(btn);
    });
  }

  function renderDots(total, current) {
    ui.dots.innerHTML = "";
    for (let i = 0; i < total; i += 1) {
      const d = document.createElement("span");
      d.className = "dot";
      if (i < current) {
        d.classList.add("done");
      } else if (i === current) {
        d.classList.add("active");
      }
      ui.dots.appendChild(d);
    }
  }

  function updateStats() {
    ui.stats.textContent = state.accepted + " accepted | score " + state.score;
  }

  function updateOverall() {
    const total = SCENARIOS.length;
    const done = Object.keys(state.completed).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    ui.overallFill.style.width = pct + "%";
    ui.overallLabel.textContent = done + " / " + total + " complete";
    ui.overallPct.textContent = pct + "%";
  }

  function renderReference() {
    const refs = [
      ["help", "Show simulator controls and stats"],
      ["hint", "Reveal stage hint"],
      ["reveal", "Reveal exact expected pattern"],
      ["skip", "Skip to next stage"],
      ["reset", "Restart current scenario"],
      ["next", "Move to next scenario"],
      ["stats", "Show command-space stats"],
      ["history", "Show recent commands"],
      ["Synthetic roots", "Examples: panx-0042, panx-1999"]
    ];

    ui.ref.innerHTML = refs.map((item) => {
      return '<div class="pa-ref-item"><div class="pa-ref-cmd">' + escapeHtml(item[0]) + '</div><div class="pa-ref-desc">' + escapeHtml(item[1]) + "</div></div>";
    }).join("");
  }

  function renderScenario() {
    const scenario = SCENARIOS[state.scenarioIndex];
    if (!scenario) {
      return;
    }

    ui.title.textContent = scenario.name;
    ui.objective.textContent = scenario.objective;
    renderStage();
    line("sys", "Scenario loaded: " + scenario.name);
    line("sys", "Objective: " + scenario.objective);
  }

  function renderStage() {
    const scenario = SCENARIOS[state.scenarioIndex];
    if (!scenario) {
      ui.stageInstruction.textContent = "No active stage";
      ui.stageCounter.textContent = "Stage 0 / 0";
      ui.hintState.textContent = "Hint: off";
      ui.hintState.className = "chip good";
      return;
    }

    const stage = scenario.stages[state.step];
    if (!stage) {
      ui.stageInstruction.textContent = "Scenario complete";
      ui.stageCounter.textContent = "Stage " + scenario.stages.length + " / " + scenario.stages.length;
      renderDots(scenario.stages.length, scenario.stages.length);
      return;
    }

    ui.stageInstruction.textContent = stage.instruction;
    ui.stageCounter.textContent = "Stage " + (state.step + 1) + " / " + scenario.stages.length;
    ui.hintState.textContent = "Hint: " + (state.hintUsed ? "used" : "off");
    renderDots(scenario.stages.length, state.step);
  }

  function normalize(input) {
    return String(input || "").replace(/\s+/g, " ").trim();
  }

  function getFirstToken(input) {
    return normalize(input).split(" ")[0].toLowerCase();
  }

  function isAcceptedCommand(input) {
    const normalized = normalize(input).toLowerCase();
    if (!normalized) {
      return false;
    }

    if (COMMAND_SET.has(normalized) || ROOT_SET.has(normalized)) {
      return true;
    }

    const first = getFirstToken(normalized);
    if (ROOT_SET.has(first)) {
      return true;
    }

    const segments = normalized.split(/\s*(?:\|\||&&|\||;)\s*/).filter(Boolean);
    for (let i = 0; i < segments.length; i += 1) {
      const token = getFirstToken(segments[i]);
      if (ROOT_SET.has(token)) {
        return true;
      }
    }

    return false;
  }

  function syntheticResponse(cmd) {
    const lower = cmd.toLowerCase();
    if (lower.indexOf("show log threat") >= 0) { return "threat-engine: logs retrieved successfully"; }
    if (lower.indexOf("show session") >= 0) { return "session-engine: active sessions and metadata returned"; }
    if (lower.indexOf("high-availability") >= 0) { return "ha-engine: peer state and sync context loaded"; }
    if (lower.indexOf("global-protect") >= 0) { return "gp-engine: user tunnel stats and auth details collected"; }
    if (lower.indexOf("show rule-hit-count") >= 0) { return "policy-engine: rule hit counters correlated"; }
    if (lower.indexOf("help") >= 0) { return "Tip: use help/hint/reveal/stats/history and guided stage commands."; }
    return "Command executed in Palo Alto simulation context.";
  }

  function completeStage() {
    const scenario = SCENARIOS[state.scenarioIndex];
    if (!scenario) {
      return;
    }

    const stage = scenario.stages[state.step];
    if (!stage) {
      return;
    }

    const points = state.revealUsed ? POINTS.reveal : state.hintUsed ? POINTS.hint : POINTS.clean;
    state.score += points;
    line("ok", "Stage complete (+" + points + " pts)");
    line("sys", stage.output);

    state.step += 1;
    state.hintUsed = false;
    state.revealUsed = false;

    if (state.step >= scenario.stages.length) {
      if (!state.completed[scenarioKey(state.scenarioIndex)]) {
        state.completed[scenarioKey(state.scenarioIndex)] = true;
        state.score += POINTS.complete;
        line("ok", "Scenario complete bonus (+" + POINTS.complete + " pts)");
      }
      line("ok", "Scenario complete: " + scenario.name);
    } else {
      line("sys", "Next stage ready.");
    }

    renderStage();
    renderScenarioButtons();
    updateStats();
    updateOverall();
    saveState();
  }

  function showHint() {
    const scenario = SCENARIOS[state.scenarioIndex];
    if (!scenario || !scenario.stages[state.step]) {
      return;
    }
    const stage = scenario.stages[state.step];
    state.hintUsed = true;
    ui.hintState.textContent = "Hint: used";
    line("hint", "Hint: " + stage.hint);
  }

  function revealPattern() {
    const scenario = SCENARIOS[state.scenarioIndex];
    if (!scenario || !scenario.stages[state.step]) {
      return;
    }
    const stage = scenario.stages[state.step];
    state.hintUsed = true;
    state.revealUsed = true;
    ui.hintState.textContent = "Hint: reveal";
    line("hint", "Expected pattern: " + stage.pattern.toString());
  }

  function skipStage() {
    const scenario = SCENARIOS[state.scenarioIndex];
    if (!scenario || !scenario.stages[state.step]) {
      return;
    }
    line("warn", "Stage skipped.");
    state.step += 1;
    state.hintUsed = false;
    state.revealUsed = false;
    if (state.step >= scenario.stages.length) {
      line("warn", "Scenario skipped to completion.");
    }
    renderStage();
    saveState();
  }

  function resetScenario() {
    if (state.scenarioIndex < 0) {
      return;
    }
    state.step = 0;
    state.hintUsed = false;
    state.revealUsed = false;
    line("sys", "Scenario reset.");
    renderStage();
  }

  function nextScenario() {
    if (!SCENARIOS.length) {
      return;
    }
    state.scenarioIndex = state.scenarioIndex < 0 ? 0 : (state.scenarioIndex + 1) % SCENARIOS.length;
    state.step = 0;
    state.hintUsed = false;
    state.revealUsed = false;
    renderScenarioButtons();
    renderScenario();
  }

  function printHelp() {
    line("sys", "Commands: help, hint, reveal, skip, reset, next, stats, history, clear");
    line("sys", "PAN-OS command roots: " + ROOT_SET.size + " | exact generated forms: " + COMMAND_SET.size);
  }

  function printHistory() {
    if (!state.history.length) {
      line("sys", "History empty.");
      return;
    }
    state.history.slice(-12).forEach((entry, idx) => line("sys", String(idx + 1).padStart(2, "0") + "  " + entry));
  }

  function processInput(raw) {
    const input = normalize(raw);
    if (!input) {
      return;
    }

    state.history.push(input);
    state.cursor = state.history.length;
    line("cmd", ui.prompt.textContent + " " + input);

    const lowered = input.toLowerCase();
    if (lowered === "help") { printHelp(); return; }
    if (lowered === "hint") { showHint(); return; }
    if (lowered === "reveal") { revealPattern(); return; }
    if (lowered === "skip") { skipStage(); return; }
    if (lowered === "reset") { resetScenario(); return; }
    if (lowered === "next") { nextScenario(); return; }
    if (lowered === "stats") { line("sys", "Accepted " + state.accepted + " commands, score " + state.score + "."); return; }
    if (lowered === "history") { printHistory(); return; }
    if (lowered === "clear" || lowered === "cls") { ui.output.innerHTML = ""; line("sys", "Terminal cleared."); return; }

    if (!isAcceptedCommand(input)) {
      line("err", "Command not recognized in Palo Alto simulator.");
      return;
    }

    state.accepted += 1;
    updateStats();
    line("sys", syntheticResponse(input));

    const scenario = SCENARIOS[state.scenarioIndex];
    if (!scenario || !scenario.stages[state.step]) {
      return;
    }

    const stage = scenario.stages[state.step];
    if (stage.pattern.test(input)) {
      completeStage();
    } else {
      line("warn", "Accepted command, but it does not satisfy current stage objective.");
    }

    saveState();
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
          state.cursor = Math.max(0, state.cursor - 1);
          ui.input.value = state.history[state.cursor] || "";
        }
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (state.history.length) {
          state.cursor = Math.min(state.history.length, state.cursor + 1);
          ui.input.value = state.history[state.cursor] || "";
        }
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        if (!ui.input.value.trim()) {
          const scenario = SCENARIOS[state.scenarioIndex];
          if (scenario && scenario.stages[state.step]) {
            ui.input.value = scenario.stages[state.step].hint;
          }
        }
      }
    });
  }

  function bindButtons() {
    ui.hintBtn.addEventListener("click", showHint);
    ui.revealBtn.addEventListener("click", revealPattern);
    ui.skipBtn.addEventListener("click", skipStage);
    ui.resetBtn.addEventListener("click", resetScenario);
    ui.nextBtn.addEventListener("click", nextScenario);
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
    setupNav();
    loadState();
    renderScenarioButtons();
    renderReference();
    bindInput();
    bindButtons();
    updateStats();
    updateOverall();

    line("sys", "Palo Alto simulator ready.");
    line("sys", "Command roots: " + ROOT_SET.size + " (including " + SYNTHETIC_ROOTS.length + " synthetic roots).");
    line("sys", "Generated command forms: " + COMMAND_SET.size + ". Select a scenario to begin.");
  }

  init();
})();
