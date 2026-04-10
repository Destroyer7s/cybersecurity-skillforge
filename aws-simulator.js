(function () {
  "use strict";

  const STORAGE_KEY = "aws-sim-v2";
  const POINTS = { clean: 10, hint: 5, reveal: 3, complete: 30 };

  const SCENARIOS = [
    {
      id: "aws-iam-audit",
      name: "IAM Audit",
      difficulty: "Intermediate",
      objective: "Find stale IAM users and over-privileged roles.",
      stages: [
        { instruction: "List all IAM users.", hint: "aws iam list-users", pattern: /aws\s+iam\s+list-users/i, output: "users: 187 total; 21 without recent sign-in" },
        { instruction: "Pull account authorization details.", hint: "aws iam get-account-authorization-details", pattern: /aws\s+iam\s+get-account-authorization-details/i, output: "authz-details: users, groups, policies collected" },
        { instruction: "Inspect attached policies for candidate user/role.", hint: "aws iam list-attached-user-policies --user-name analyst1", pattern: /(aws\s+iam\s+list-attached-user-policies|aws\s+iam\s+list-attached-role-policies)/i, output: "policy-review: admin-level policy found on non-admin principal" },
        { instruction: "Simulate policy impact before remediation.", hint: "aws iam simulate-principal-policy --policy-source-arn arn:aws:iam::123456789012:user/analyst1 --action-names s3:*", pattern: /aws\s+iam\s+simulate-principal-policy/i, output: "simulation: broad data-plane privileges confirmed" }
      ]
    },
    {
      id: "aws-guardduty-triage",
      name: "GuardDuty Triage",
      difficulty: "Advanced",
      objective: "Inspect GuardDuty findings and map impacted resources.",
      stages: [
        { instruction: "Discover active detector IDs.", hint: "aws guardduty list-detectors", pattern: /aws\s+guardduty\s+list-detectors/i, output: "detectors: 1 active detector in region" },
        { instruction: "List recent high-severity findings.", hint: "aws guardduty list-findings --detector-id <id>", pattern: /aws\s+guardduty\s+list-findings/i, output: "findings: 9 high, 2 critical" },
        { instruction: "Pull full finding detail payload.", hint: "aws guardduty get-findings --detector-id <id> --finding-ids <id1>", pattern: /aws\s+guardduty\s+get-findings/i, output: "finding-detail: EC2 crypto-mining behavior with C2 DNS" },
        { instruction: "Correlate principal/resource in JSON output.", hint: "aws guardduty get-findings ... | jq .", pattern: /(jq|grep|awk|aws\s+guardduty\s+get-findings)/i, output: "correlation: instance i-0abc mapped to compromised IAM role" }
      ]
    },
    {
      id: "aws-s3-hardening",
      name: "S3 Hardening",
      difficulty: "Intermediate",
      objective: "Validate bucket exposure and encryption controls.",
      stages: [
        { instruction: "Enumerate all buckets.", hint: "aws s3api list-buckets", pattern: /aws\s+s3api\s+list-buckets/i, output: "buckets: 46 discovered" },
        { instruction: "Check public-access-block configuration.", hint: "aws s3api get-public-access-block --bucket corp-data", pattern: /aws\s+s3api\s+get-public-access-block/i, output: "public-access-block: incomplete on 3 buckets" },
        { instruction: "Verify encryption settings.", hint: "aws s3api get-bucket-encryption --bucket corp-data", pattern: /(aws\s+s3api\s+get-bucket-encryption|aws\s+s3api\s+put-bucket-encryption)/i, output: "encryption: SSE-KMS enabled for critical bucket set" },
        { instruction: "Apply public access block where missing.", hint: "aws s3api put-public-access-block --bucket public-test --public-access-block-configuration ...", pattern: /aws\s+s3api\s+put-public-access-block/i, output: "remediation: public block policy applied" }
      ]
    },
    {
      id: "aws-cloudtrail-ir",
      name: "CloudTrail Investigation",
      difficulty: "Advanced",
      objective: "Investigate suspicious API calls and actor identity.",
      stages: [
        { instruction: "Lookup suspicious API events.", hint: "aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=CreateAccessKey", pattern: /aws\s+cloudtrail\s+lookup-events/i, output: "events: 157 matching records in time window" },
        { instruction: "Filter output for target principal.", hint: "aws cloudtrail lookup-events ... | jq .", pattern: /(jq|grep|awk|cloudtrail\s+lookup-events)/i, output: "principal-filter: anomalous key creation from unfamiliar source IP" },
        { instruction: "Confirm caller identity context.", hint: "aws sts get-caller-identity", pattern: /aws\s+sts\s+get-caller-identity/i, output: "caller-identity: assumed role from CI runner" },
        { instruction: "Pull user details for incident account.", hint: "aws iam get-user --user-name compromised-user", pattern: /aws\s+iam\s+get-user/i, output: "user-detail: password last used from geo-anomalous region" }
      ]
    },
    {
      id: "aws-kms-key-audit",
      name: "KMS Key Audit",
      difficulty: "Intermediate",
      objective: "Audit KMS keys, rotation posture, and key policy exposure.",
      stages: [
        { instruction: "List KMS keys.", hint: "aws kms list-keys", pattern: /aws\s+kms\s+list-keys/i, output: "kms: 73 keys found" },
        { instruction: "Describe selected key metadata.", hint: "aws kms describe-key --key-id <id>", pattern: /aws\s+kms\s+describe-key/i, output: "key-meta: customer managed key with broad policy principal" },
        { instruction: "Check key rotation state.", hint: "aws kms get-key-rotation-status --key-id <id>", pattern: /aws\s+kms\s+get-key-rotation-status/i, output: "rotation: disabled on 9 non-test keys" },
        { instruction: "Review key policy document.", hint: "aws kms get-key-policy --key-id <id> --policy-name default", pattern: /aws\s+kms\s+get-key-policy/i, output: "policy-review: wildcard principal found" }
      ]
    },
    {
      id: "aws-ecs-ecr-exposure",
      name: "ECS/ECR Exposure Review",
      difficulty: "Advanced",
      objective: "Validate container image and task runtime security posture.",
      stages: [
        { instruction: "List ECR repositories.", hint: "aws ecr describe-repositories", pattern: /aws\s+ecr\s+describe-repositories/i, output: "ecr: 24 repos discovered" },
        { instruction: "Check image scan findings.", hint: "aws ecr describe-image-scan-findings --repository-name app --image-id imageTag=latest", pattern: /aws\s+ecr\s+describe-image-scan-findings/i, output: "scan-findings: 3 critical CVEs in latest tag" },
        { instruction: "Review ECS task definitions.", hint: "aws ecs list-task-definitions", pattern: /aws\s+ecs\s+list-task-definitions|aws\s+ecs\s+describe-task-definition/i, output: "task-def: privileged mode enabled in one service" },
        { instruction: "Summarize containment recommendation.", hint: "echo \"block deployment of vulnerable image tag and enforce non-privileged tasks\"", pattern: /(echo|printf|recommend|containment|non-privileged)/i, output: "recommendation: deployment gate + task hardening queued" }
      ]
    },
    {
      id: "aws-securityhub-baseline",
      name: "Security Hub Baseline",
      difficulty: "Intermediate",
      objective: "Audit Security Hub standards and unresolved controls.",
      stages: [
        { instruction: "List enabled standards subscriptions.", hint: "aws securityhub get-enabled-standards", pattern: /aws\s+securityhub\s+get-enabled-standards/i, output: "standards: CIS + AWS Foundational enabled" },
        { instruction: "Pull failed findings set.", hint: "aws securityhub get-findings --filters ...", pattern: /aws\s+securityhub\s+get-findings/i, output: "findings: 64 failed controls" },
        { instruction: "Filter by high severity and workflow status.", hint: "aws securityhub get-findings ... | jq .", pattern: /(jq|grep|awk|securityhub\s+get-findings)/i, output: "filtered: 11 high severity unresolved" },
        { instruction: "Produce prioritized remediation queue.", hint: "echo \"prioritize IAM.1, S3.8, EC2.10\"", pattern: /(echo|prioritize|queue|remediation)/i, output: "queue: prioritized remediation list created" }
      ]
    },
    {
      id: "aws-config-drift",
      name: "AWS Config Drift Hunt",
      difficulty: "Advanced",
      objective: "Detect and triage compliance drift from baseline config rules.",
      stages: [
        { instruction: "List config rules.", hint: "aws configservice describe-config-rules", pattern: /aws\s+config(service)?\s+describe-config-rules/i, output: "config-rules: 39 active rules" },
        { instruction: "Get non-compliant resources.", hint: "aws configservice get-compliance-details-by-config-rule --config-rule-name <rule>", pattern: /aws\s+config(service)?\s+get-compliance-details-by-config-rule/i, output: "non-compliant: 17 resources drifted" },
        { instruction: "Inspect timeline for one resource.", hint: "aws configservice get-resource-config-history --resource-type AWS::EC2::SecurityGroup --resource-id sg-123", pattern: /aws\s+config(service)?\s+get-resource-config-history/i, output: "timeline: permissive ingress introduced 2 days ago" },
        { instruction: "Capture remediation command plan.", hint: "echo \"revert sg ingress, enforce pipeline guardrails\"", pattern: /(echo|revert|guardrail|remediation|plan)/i, output: "plan: rollback and preventive control actions recorded" }
      ]
    }
  ];

  const AWS_ROOTS = [
    "aws", "aws iam", "aws sts", "aws s3", "aws s3api", "aws ec2", "aws cloudtrail", "aws configservice",
    "aws guardduty", "aws securityhub", "aws organizations", "aws kms", "aws logs", "aws cloudwatch",
    "aws lambda", "aws ecs", "aws eks", "aws ecr", "aws route53", "aws elbv2", "aws acm", "aws wafv2"
  ];

  const SHELL_HELPERS = [
    "jq", "grep", "awk", "sed", "sort", "uniq", "cut", "cat", "less", "head", "tail", "python3", "echo", "printf"
  ];

  const PREFIXES = ["", "time ", "nohup ", "bash -lc ", "cmd /c "];
  const SUFFIXES = ["", " | jq .", " | head -n 20", " | grep -i fail", " | sort", " && echo done"];

  function buildSyntheticRoots(count) {
    const roots = [];
    for (let i = 1; i <= count; i += 1) {
      roots.push("awssim-" + String(i).padStart(4, "0"));
    }
    return roots;
  }

  const SYNTHETIC_ROOTS = buildSyntheticRoots(3200);
  const ROOT_SET = new Set(AWS_ROOTS.concat(SHELL_HELPERS).concat(SYNTHETIC_ROOTS).map((v) => String(v).toLowerCase()));
  const COMMAND_SET = buildCommandSet();

  const ui = {
    navToggle: document.getElementById("navToggle"),
    mainNav: document.getElementById("mainNav"),
    scenarioList: document.getElementById("awsScenarioList"),
    output: document.getElementById("awsOutput"),
    input: document.getElementById("awsInput"),
    title: document.getElementById("awsTitle"),
    stats: document.getElementById("awsStats"),
    objective: document.getElementById("awsObjective"),
    prompt: document.getElementById("awsPrompt"),
    stageInstruction: document.getElementById("awsStageInstruction"),
    stageCounter: document.getElementById("awsStageCounter"),
    hintState: document.getElementById("awsHintState"),
    hintBtn: document.getElementById("awsHintBtn"),
    revealBtn: document.getElementById("awsRevealBtn"),
    skipBtn: document.getElementById("awsSkipBtn"),
    resetBtn: document.getElementById("awsResetBtn"),
    nextBtn: document.getElementById("awsNextBtn"),
    dots: document.getElementById("awsDots"),
    ref: document.getElementById("awsRef"),
    overallFill: document.getElementById("awsOverallFill"),
    overallLabel: document.getElementById("awsOverallLabel"),
    overallPct: document.getElementById("awsOverallPct")
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
    const rootList = Array.from(ROOT_SET).slice(0, 2200);

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
      btn.className = "aws-btn" + (idx === state.scenarioIndex ? " active" : "");
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
      ["Synthetic roots", "Examples: awssim-0042, awssim-2999"]
    ];

    ui.ref.innerHTML = refs.map((item) => {
      return '<div class="aws-ref-item"><div class="aws-ref-cmd">' + escapeHtml(item[0]) + '</div><div class="aws-ref-desc">' + escapeHtml(item[1]) + "</div></div>";
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

    if (normalized.indexOf("aws ") === 0) {
      return true;
    }

    const first = getFirstToken(normalized);
    if (ROOT_SET.has(first)) {
      return true;
    }

    const segments = normalized.split(/\s*(?:\|\||&&|\||;)\s*/).filter(Boolean);
    for (let i = 0; i < segments.length; i += 1) {
      const token = getFirstToken(segments[i]);
      if (ROOT_SET.has(token) || token === "aws") {
        return true;
      }
    }

    return false;
  }

  function syntheticResponse(cmd) {
    const lower = cmd.toLowerCase();
    if (lower.indexOf("guardduty") >= 0) { return "guardduty-engine: findings payload collected"; }
    if (lower.indexOf("s3api") >= 0) { return "s3-engine: bucket ACL, block, and encryption metadata returned"; }
    if (lower.indexOf("iam") >= 0) { return "iam-engine: principal and policy map generated"; }
    if (lower.indexOf("cloudtrail") >= 0) { return "trail-engine: API event timeline assembled"; }
    if (lower.indexOf("kms") >= 0) { return "kms-engine: key metadata and rotation posture loaded"; }
    if (lower.indexOf("help") >= 0) { return "Tip: use help/hint/reveal/stats/history and guided stage commands."; }
    return "Command executed in AWS simulation context.";
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
    line("sys", "AWS command roots: " + ROOT_SET.size + " | exact generated forms: " + COMMAND_SET.size);
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
      line("err", "Command not recognized in AWS simulator.");
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

    line("sys", "AWS simulator ready.");
    line("sys", "Command roots: " + ROOT_SET.size + " (including " + SYNTHETIC_ROOTS.length + " synthetic roots).");
    line("sys", "Generated command forms: " + COMMAND_SET.size + ". Select a scenario to begin.");
  }

  init();
})();
