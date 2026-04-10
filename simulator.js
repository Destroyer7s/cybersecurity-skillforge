(function () {
  "use strict";

  const STAGE_POINTS = {
    clean: 10,
    hintUsed: 5,
    revealUsed: 3,
    scenarioBonus: 25
  };

  const STORAGE_KEY = "cyberskillforge-simulator-state-v2";

  const TOPIC_META = [
    { id: "endpoint-security", name: "Endpoint Security", icon: "EP", prompt: "PS C:\\Windows\\System32>" },
    { id: "network-security", name: "Network Security", icon: "NW", prompt: "analyst@cyberlab:~$" },
    { id: "penetration-testing", name: "Penetration Testing", icon: "PT", prompt: "kali@engagement:~$" },
    { id: "architecture-design", name: "Architecture Design", icon: "AD", prompt: "analyst@workstation:~$" },
    { id: "security-automation", name: "Security Automation", icon: "SA", prompt: "devsecops@pipeline:~$" },
    { id: "security-information", name: "Security Information", icon: "SI", prompt: "analyst@dataplane:~$" },
    { id: "siem", name: "SIEM", icon: "SM", prompt: "splunk-search>" },
    { id: "security-operations", name: "Security Operations", icon: "SO", prompt: "soc@opsdesk:~$" },
    { id: "threat-modeling", name: "Threat Modeling", icon: "TM", prompt: "architect@model-lab:~$" },
    { id: "vulnerability-management", name: "Vulnerability Management", icon: "VM", prompt: "vuln@scanner:~$" },
    { id: "soc-ops-analyst-track", name: "SOC Ops Analyst Track", icon: "SC", prompt: "soc@tier1:~$" },
    { id: "capstone-track", name: "Capstone Track", icon: "CP", prompt: "portfolio@capstone:~$" },
    { id: "cloud-security", name: "Cloud Security", icon: "CL", prompt: "analyst@aws:~$" },
    { id: "identity-access-management", name: "Identity Access Management", icon: "IA", prompt: "iam@identity-hub:~$" },
    { id: "cryptography-pki", name: "Cryptography & PKI", icon: "PK", prompt: "crypto@vault:~$" },
    { id: "malware-analysis", name: "Malware Analysis", icon: "MW", prompt: "reverse@lab-vm:~$" },
    { id: "digital-forensics", name: "Digital Forensics", icon: "DF", prompt: "forensics@evidence-box:~$" },
    { id: "grc-compliance", name: "GRC & Compliance", icon: "GC", prompt: "analyst@governance:~$" },
    { id: "application-security", name: "Application Security", icon: "AS", prompt: "appsec@pipeline:~$" },
    { id: "container-security", name: "Container Security", icon: "CS", prompt: "analyst@k8s:~$" }
  ];

  const TOPIC_STAGE_TEMPLATES = {
    "endpoint-security": {
      scenarioA: {
        title: "Ransomware Staging Triage",
        difficulty: "Intermediate",
        objective: "Identify suspicious process activity, persistence, and impacted files on a Windows endpoint.",
        stages: [
          {
            instruction: "Enumerate suspicious PowerShell activity.",
            hint: "Get-Process powershell | Select-Object Id, Name, CPU",
            successPattern: /(get-process|gps|ps)\b.*powershell/i,
            output: "Id   Name       CPU\n4240 powershell 193.6\n1288 powershell 102.4\n[!] High CPU script host may indicate staging activity."
          },
          {
            instruction: "Inspect startup persistence entries.",
            hint: "Get-ItemProperty HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
            successPattern: /(get-itemproperty|gp)\b.*currentversion\\run/i,
            output: "Run entries:\nOneDrive=...\nUpdaterTask=C:\\Users\\Public\\updater.ps1\n[!] Suspicious script path found."
          },
          {
            instruction: "Search for recently modified encrypted files.",
            hint: "Get-ChildItem C:\\Users -Recurse -Filter *.locked",
            successPattern: /(get-childitem|gci|dir)\b.*(\.locked|users)/i,
            output: "C:\\Users\\Public\\Docs\\q4_plan.xlsx.locked\nC:\\Users\\Public\\Docs\\budget.csv.locked\n2 encrypted files discovered."
          },
          {
            instruction: "Contain by isolating network adapter.",
            hint: "Disable-NetAdapter -Name \"Ethernet\" -Confirm:$false",
            successPattern: /(disable-netadapter|disable-netadapter\s+-name|netsh\s+interface\s+set\s+interface)/i,
            output: "Adapter Ethernet disabled. Host network isolation complete."
          }
        ]
      },
      scenarioB: {
        title: "CIS Baseline Validation",
        difficulty: "Beginner",
        objective: "Assess baseline hardening controls and confirm local endpoint compliance.",
        stages: [
          {
            instruction: "Verify firewall profile status.",
            hint: "Get-NetFirewallProfile",
            successPattern: /(get-netfirewallprofile|netsh\s+advfirewall\s+show)/i,
            output: "Domain: ON\nPrivate: ON\nPublic: ON\nFirewall profiles are enabled."
          },
          {
            instruction: "Check local admin group members.",
            hint: "Get-LocalGroupMember -Group Administrators",
            successPattern: /(get-localgroupmember|net\s+localgroup\s+administrators)/i,
            output: "Administrator\nHelpDeskTier2\nsvc_backup\n[!] Review non-human account membership."
          },
          {
            instruction: "Inspect PowerShell script execution policy.",
            hint: "Get-ExecutionPolicy -List",
            successPattern: /(get-executionpolicy|executionpolicy)/i,
            output: "MachinePolicy: Undefined\nLocalMachine: RemoteSigned\nCurrentUser: Undefined"
          },
          {
            instruction: "Generate quick hardening summary.",
            hint: "systeminfo | findstr /B /C:\"OS Name\" /C:\"OS Version\"",
            successPattern: /(systeminfo|wmic\s+os\s+get)/i,
            output: "OS Name: Microsoft Windows 11 Enterprise\nOS Version: 10.0.22631\nSummary generated."
          }
        ]
      }
    },
    "network-security": {
      scenarioA: {
        title: "Segmentation Drift Investigation",
        difficulty: "Intermediate",
        objective: "Validate ACL behavior and find unauthorized east-west network paths.",
        stages: [
          {
            instruction: "Run a focused subnet scan for exposed ports.",
            hint: "nmap -sV -p 22,80,443,3389 10.10.20.0/24",
            successPattern: /(nmap)\b.*(10\.10\.20\.0\/24|22|3389)/i,
            output: "10.10.20.18:22 open\n10.10.20.22:3389 open\n10.10.20.31:443 open\nUnexpected RDP exposure detected."
          },
          {
            instruction: "Review active firewall chain counters.",
            hint: "sudo iptables -L -n -v",
            successPattern: /(iptables|nft\s+list\s+ruleset|ufw\s+status)/i,
            output: "Chain FORWARD policy DROP\npkts bytes target prot opt in out source destination\n5120  2M ACCEPT tcp -- vlan20 vlan30 10.10.20.0/24 10.10.30.0/24 tcp dpt:443"
          },
          {
            instruction: "Verify DNS tunneling indicators in query logs.",
            hint: "grep -Ei '([A-Za-z0-9]{40,}\.)' /var/log/dns.log | head",
            successPattern: /(grep|awk|cat)\b.*dns\.log/i,
            output: "Long subdomain bursts observed:\nq1x9v2...domain.tld\nq1x9v3...domain.tld\nPotential exfiltration channel."
          },
          {
            instruction: "Capture a short packet sample for evidence.",
            hint: "sudo tcpdump -i eth0 -c 50 host 10.10.20.22",
            successPattern: /(tcpdump|tshark)\b.*(10\.10\.20\.22| -c )/i,
            output: "50 packets captured and written to in-memory buffer. Evidence ready for case notes."
          }
        ]
      },
      scenarioB: {
        title: "Remote Office Firewall Audit",
        difficulty: "Beginner",
        objective: "Check perimeter settings and identify permissive firewall rules.",
        stages: [
          {
            instruction: "Display all listening ports on gateway host.",
            hint: "ss -tulpen",
            successPattern: /(ss\s+-tulpen|netstat\s+-an|Get-NetTCPConnection)/i,
            output: "tcp LISTEN 0 128 0.0.0.0:22\ntcp LISTEN 0 128 0.0.0.0:80\ntcp LISTEN 0 128 0.0.0.0:3306 [!] exposed"
          },
          {
            instruction: "Check policy for inbound MySQL access.",
            hint: "sudo ufw status numbered",
            successPattern: /(ufw\s+status|iptables|firewall-cmd)/i,
            output: "[ 5] 3306/tcp ALLOW IN Anywhere\n[!] Rule should be scoped to app subnet only."
          },
          {
            instruction: "Test remote reachability from audit node.",
            hint: "nc -vz 10.10.10.5 3306",
            successPattern: /(nc\s+-vz|telnet|Test-NetConnection)\b.*3306/i,
            output: "Connection to 10.10.10.5 3306 port [tcp/mysql] succeeded!"
          },
          {
            instruction: "Document and close risky exposure.",
            hint: "sudo ufw deny 3306/tcp",
            successPattern: /(ufw\s+deny\s+3306|iptables.*--dport\s+3306.*DROP|netsh\s+advfirewall)/i,
            output: "Rule updated: deny 3306/tcp from untrusted networks."
          }
        ]
      }
    }
  };

  function createGenericTopic(topic) {
    const nameTag = topic.name.toLowerCase();
    const baseCommandA = nameTag.indexOf("cloud") >= 0 ? "aws" : nameTag.indexOf("iam") >= 0 ? "az" : "grep";
    const baseCommandB = nameTag.indexOf("container") >= 0 ? "kubectl" : nameTag.indexOf("application") >= 0 ? "semgrep" : "python";

    return {
      scenarioA: {
        title: topic.name + " Scenario A",
        difficulty: "Intermediate",
        objective: "Work through detection and triage steps for " + topic.name + " using command-driven analysis.",
        stages: [
          {
            instruction: "Collect baseline telemetry relevant to this domain.",
            hint: baseCommandA + " --help",
            successPattern: new RegExp("(" + escapeRegex(baseCommandA) + "|help|cat|type)", "i"),
            output: "Telemetry baseline collected for " + topic.name + "."
          },
          {
            instruction: "Find at least one anomaly signal.",
            hint: "grep -Ei 'error|fail|denied' logs/*.log",
            successPattern: /(grep|findstr|Select-String|awk|jq)/i,
            output: "Anomaly found: elevated denied events in recent interval."
          },
          {
            instruction: "Pivot into related indicators and enrich context.",
            hint: "cat indicators.txt | head -n 10",
            successPattern: /(cat|type|head|Get-Content|jq|sort)/i,
            output: "Related indicators enriched with host, user, and process context."
          },
          {
            instruction: "Output a concise response recommendation.",
            hint: "echo \"Contain affected systems and collect volatile artifacts\"",
            successPattern: /(echo|write-output|printf|tee)/i,
            output: "Recommended action logged: contain, preserve evidence, remediate control gap."
          }
        ]
      },
      scenarioB: {
        title: topic.name + " Scenario B",
        difficulty: "Advanced",
        objective: "Execute deeper validation and hardening workflow for " + topic.name + ".",
        stages: [
          {
            instruction: "Run the primary tooling command for this domain.",
            hint: baseCommandB + " --help",
            successPattern: new RegExp("(" + escapeRegex(baseCommandB) + "|help|man|Get-Help)", "i"),
            output: "Primary tooling validated for " + topic.name + "."
          },
          {
            instruction: "Cross-check configuration state against policy.",
            hint: "cat policy.yaml",
            successPattern: /(cat|type|less|more|Get-Content|kubectl|docker|aws|az|openssl)/i,
            output: "Policy mismatch discovered and recorded."
          },
          {
            instruction: "Apply a secure corrective change.",
            hint: "sudo sed -i 's/allow_all/least_privilege/g' config.conf",
            successPattern: /(sed|Set-Content|kubectl\s+apply|docker\s+build|aws\s+iam|az\s+role|chmod|chown)/i,
            output: "Corrective change applied in simulation context."
          },
          {
            instruction: "Verify controls after remediation.",
            hint: "diff -u before.txt after.txt",
            successPattern: /(diff|compare-object|test-netconnection|nmap|trivy|semgrep|yara|volatility|splunk)/i,
            output: "Post-remediation validation completed successfully."
          }
        ]
      }
    };
  }

  function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function buildTopics() {
    return TOPIC_META.map((topic) => {
      const template = TOPIC_STAGE_TEMPLATES[topic.id] || createGenericTopic(topic);
      return {
        id: topic.id,
        name: topic.name,
        icon: topic.icon,
        prompt: topic.prompt,
        scenarios: [
          {
            id: topic.id + "-a",
            title: template.scenarioA.title,
            difficulty: template.scenarioA.difficulty,
            objective: template.scenarioA.objective,
            stages: template.scenarioA.stages
          },
          {
            id: topic.id + "-b",
            title: template.scenarioB.title,
            difficulty: template.scenarioB.difficulty,
            objective: template.scenarioB.objective,
            stages: template.scenarioB.stages
          }
        ]
      };
    });
  }

  const SIM_TOPICS = buildTopics();

  const COMMAND_LIBRARY = [
    {
      family: "filesystem_linux",
      platform: "linux",
      commands: ["ls", "find", "cat", "less", "more", "head", "tail", "stat", "du", "df", "tree", "file", "cut", "sort", "uniq", "wc", "xargs", "basename", "dirname"],
      flags: ["", "-l", "-la", "-lh", "-R", "-a", "-n", "-h", "-i", "-t", "-S", "--color=auto"],
      targets: ["", ".", "..", "/var/log", "/etc", "~/projects", "./logs", "./reports", "/tmp", "/opt", "*.log", "*.conf"]
    },
    {
      family: "filesystem_windows",
      platform: "windows",
      commands: ["dir", "type", "more", "tree", "copy", "move", "where", "findstr", "Get-ChildItem", "Get-Content", "gc", "gci", "Select-String", "Measure-Object"],
      flags: ["", "/s", "/b", "/a", "/q", "/t:w", "-Recurse", "-Force", "-File", "-Directory", "-ErrorAction SilentlyContinue"],
      targets: ["", "C:\\", "C:\\Windows", "C:\\Users", "C:\\ProgramData", ".", "..", "logs", "reports", "*.evtx", "*.ps1"]
    },
    {
      family: "network",
      platform: "cross",
      commands: ["ping", "traceroute", "tracert", "nslookup", "dig", "host", "netstat", "ss", "tcpdump", "tshark", "nmap", "nc", "curl", "wget", "arp", "route", "ip", "ifconfig", "ipconfig"],
      flags: ["", "-n", "-v", "-vv", "-c 4", "-c 10", "-sV", "-Pn", "-p 80,443", "-A", "-I", "-a"],
      targets: ["", "8.8.8.8", "1.1.1.1", "10.0.0.5", "example.com", "api.internal", "10.10.20.0/24", "eth0", "wlan0", "443"]
    },
    {
      family: "process",
      platform: "cross",
      commands: ["ps", "top", "htop", "pstree", "lsof", "Get-Process", "tasklist", "wmic", "kill", "pkill", "killall", "Stop-Process", "Start-Process"],
      flags: ["", "-ef", "aux", "-a", "-Name", "-Id", "-p", "-n", "/v", "/fi", "-IncludeUserName"],
      targets: ["", "powershell", "python", "nginx", "svchost", "1234", "explorer", "chrome", "java"]
    },
    {
      family: "auth_iam",
      platform: "cross",
      commands: ["whoami", "id", "groups", "sudo -l", "net user", "net localgroup", "Get-LocalUser", "Get-LocalGroupMember", "Get-ADUser", "aws iam", "az role", "gcloud iam"],
      flags: ["", "/domain", "list", "--all", "--output table", "--query Users[*].UserName", "--include-disabled", "--verbose"],
      targets: ["", "Administrators", "alice", "svc_ci", "--profile prod", "--profile dev", "security-auditors"]
    },
    {
      family: "cloud",
      platform: "cross",
      commands: ["aws", "az", "gcloud", "kubectl", "terraform", "helm", "kustomize", "eksctl", "docker", "podman"],
      flags: ["", "--help", "list", "describe", "get", "-o wide", "-n kube-system", "plan", "apply", "destroy", "logs"],
      targets: ["", "ec2", "iam", "s3", "pods", "deployments", "resource-groups", "state", "cluster", "namespaces", "images"]
    },
    {
      family: "security_tools",
      platform: "cross",
      commands: ["openssl", "yara", "volatility", "trivy", "semgrep", "nikto", "sqlmap", "hashcat", "john", "splunk", "kql", "snort", "suricata", "zeek", "clamav", "nuclei", "wfuzz"],
      flags: ["", "-h", "--help", "scan", "-r", "-f", "--json", "--config auto", "--severity HIGH,CRITICAL", "-A", "-T4"],
      targets: ["", "sample.bin", "memory.raw", "image.tar", "src/", "query.spl", "rules.yar", "http://target", "artifacts/", "pcap/trace.pcap"]
    },
    {
      family: "scripting",
      platform: "cross",
      commands: ["python", "python3", "pwsh", "powershell", "bash", "sh", "zsh", "node", "jq", "awk", "sed", "perl", "ruby"],
      flags: ["", "-c", "-File", "-Command", "-e", "-n", "-r", "-i", "-NoProfile", "-ExecutionPolicy Bypass"],
      targets: ["", "script.py", "script.ps1", "app.js", "input.json", "logs.txt", "pipeline.sh", "rules.json"]
    }
  ];

  const COMMAND_PREFIXES = ["", "sudo ", "time ", "nohup ", "cmd /c ", "powershell -Command "];
  const COMMAND_SUFFIXES = ["", " | sort", " | head -n 20", " | tail -n 20", " | grep -i error", " && echo done"];
  const COMMAND_CHAIN_OPERATORS = ["|", "&&", "||", ";"];
  const COMMAND_ARG_ATOMS = [
    "--help", "-h", "-v", "-vv", "-n", "-a", "-l", "-R", "-S", "-p 443", "-p 80,443",
    "--json", "--yaml", "--output table", "--profile prod", "--profile dev", "--namespace security",
    "10.0.0.0/24", "10.10.20.0/24", "127.0.0.1", "localhost", "example.com", "api.internal",
    "logs.txt", "events.log", "artifacts/", "./", "../", "C:\\Windows", "C:\\Users", "/var/log", "/etc"
  ];
  const COMMAND_ENGINE_ALIASES = {
    ll: "ls -la",
    la: "ls -a",
    grep: "grep",
    ipconfig: "ipconfig",
    ifconfig: "ifconfig",
    cat: "cat",
    type: "type",
    pwd: "pwd",
    cd: "cd",
    cls: "cls",
    clear: "clear"
  };

  function buildExtraCommandRoots(count) {
    const families = [
      "simlinux",
      "simwin",
      "simnet",
      "simsec",
      "simcloud",
      "simforensic",
      "simops",
      "simdevsec"
    ];

    const roots = [];
    for (let i = 0; i < count; i += 1) {
      const family = families[i % families.length];
      const idx = String(i + 1).padStart(4, "0");
      roots.push(family + "-" + idx);
    }
    return roots;
  }

  const EXTRA_COMMAND_ROOTS = buildExtraCommandRoots(1000);

  function buildCommandPossibilities() {
    const all = new Set();

    COMMAND_LIBRARY.forEach((family) => {
      family.commands.forEach((cmd) => {
        family.flags.forEach((flag) => {
          family.targets.forEach((target) => {
            COMMAND_PREFIXES.forEach((prefix) => {
              COMMAND_SUFFIXES.forEach((suffix) => {
                const core = [cmd, flag, target].filter(Boolean).join(" ").trim();
                if (!core) {
                  return;
                }
                const built = (prefix + core + suffix).replace(/\s+/g, " ").trim();
                all.add(built);
              });
            });
          });
        });
      });
    });

    return all;
  }

  const COMMAND_POSSIBILITIES = buildCommandPossibilities();
  const COMMAND_COUNT = COMMAND_POSSIBILITIES.size;

  function buildKnownRoots() {
    const roots = new Set();

    COMMAND_LIBRARY.forEach((family) => {
      family.commands.forEach((cmd) => {
        const token = cmd.trim().split(/\s+/)[0].toLowerCase();
        if (token) {
          roots.add(token);
        }
      });
    });

    Object.keys(COMMAND_ENGINE_ALIASES).forEach((alias) => roots.add(alias.toLowerCase()));
    EXTRA_COMMAND_ROOTS.forEach((cmd) => roots.add(cmd.toLowerCase()));
    ["echo", "printf", "pwd", "cd", "mkdir", "rm", "cp", "mv", "touch", "history", "man", "Get-Help"].forEach((cmd) => {
      roots.add(cmd.toLowerCase());
    });

    return roots;
  }

  const KNOWN_ROOTS = buildKnownRoots();

  function estimateCommandSpace() {
    const roots = BigInt(KNOWN_ROOTS.size);
    const prefixes = BigInt(COMMAND_PREFIXES.length);
    const suffixes = BigInt(COMMAND_SUFFIXES.length);
    const args = BigInt(COMMAND_ARG_ATOMS.length);
    const ops = BigInt(COMMAND_CHAIN_OPERATORS.length);

    const single = roots * prefixes * suffixes * args * args;
    const twoSegment = single * single * ops;
    const threeSegment = single * single * single * ops * ops;

    const estimated = single + twoSegment + threeSegment;

    return {
      exact: BigInt(COMMAND_COUNT),
      estimated,
      roots: Number(roots)
    };
  }

  function formatBigIntCompact(value) {
    const digits = value.toString();
    if (digits.length <= 3) {
      return digits;
    }
    if (digits.length <= 6) {
      return (Number(digits) / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    }
    if (digits.length <= 9) {
      return (Number(digits) / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (digits.length <= 12) {
      return (Number(digits) / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (digits.length <= 15) {
      return (Number(digits) / 1e12).toFixed(1).replace(/\.0$/, "") + "T";
    }
    return digits.slice(0, 4) + "e" + (digits.length - 1);
  }

  const COMMAND_SPACE = estimateCommandSpace();

  const UNIVERSAL_COMMANDS = {
    help: "Show core simulator commands.",
    clear: "Clear terminal output.",
    cls: "Clear terminal output.",
    hint: "Show current stage hint.",
    reveal: "Reveal expected command for current stage.",
    skip: "Skip current stage.",
    next: "Skip current stage.",
    history: "Show recent command history.",
    score: "Show your current score.",
    reset: "Reset current scenario.",
    topics: "List all topics.",
    scenarios: "List scenarios for current topic.",
    whoami: "Print current user context.",
    date: "Print simulation date.",
    time: "Print simulation time.",
    commands: "Show command possibility statistics."
  };

  class Simulator {
    constructor() {
      this.state = {
        topicIndex: -1,
        scenarioIndex: 0,
        stageIndex: 0,
        score: 0,
        hintsUsedForStage: false,
        revealUsedForStage: false,
        completedScenarios: {},
        completedStages: {}
      };

      this.history = [];
      this.historyCursor = 0;

      this.ui = {
        topicList: document.getElementById("topicList"),
        topicSearch: document.getElementById("topicSearch"),
        scenarioSelect: document.getElementById("scenarioSelect"),
        simScenarioTitle: document.getElementById("simScenarioTitle"),
        simObjective: document.getElementById("simObjective"),
        stageLabel: document.getElementById("stageLabel"),
        stageInstruction: document.getElementById("stageInstruction"),
        stageSection: document.getElementById("stageSection"),
        stageDots: document.getElementById("stageDots"),
        hintBox: document.getElementById("hintBox"),
        cmdRefContent: document.getElementById("cmdRefContent"),
        simActionsRow: document.getElementById("simActionsRow"),
        termOutput: document.getElementById("termOutput"),
        termInput: document.getElementById("termInput"),
        termPrompt: document.getElementById("termPrompt"),
        termTitle: document.getElementById("termTitle"),
        clearBtn: document.getElementById("clearBtn"),
        hintBtn: document.getElementById("hintBtn"),
        revealHintBtn: document.getElementById("revealHintBtn"),
        skipStageBtn: document.getElementById("skipStageBtn"),
        resetScenBtn: document.getElementById("resetScenBtn"),
        completionModal: document.getElementById("completionModal"),
        modalScore: document.getElementById("modalScore"),
        modalMessage: document.getElementById("modalMessage"),
        nextScenBtn: document.getElementById("nextScenBtn"),
        closeModalBtn: document.getElementById("closeModalBtn"),
        globalScore: document.getElementById("globalScore"),
        scoreDisplay: document.getElementById("scoreDisplay"),
        overallFill: document.getElementById("overallFill"),
        overallLabel: document.getElementById("overallLabel"),
        overallPct: document.getElementById("overallPct")
      };

      this.loadState();
      this.bindEvents();
      this.renderTopicList();
      this.refreshScore();
      this.refreshOverallProgress();
      this.setupNavToggle();

      this.writeLine("system", "CyberSkillForge Simulator ready. Exact generated forms: " + COMMAND_COUNT + ". Estimated grammar space: " + formatBigIntCompact(COMMAND_SPACE.estimated) + "+.");
      this.writeLine("system", "Select a topic from the left panel to begin.");
    }

    setupNavToggle() {
      const toggle = document.getElementById("navToggle");
      const nav = document.getElementById("mainNav");
      if (!toggle || !nav) {
        return;
      }
      toggle.addEventListener("click", () => {
        nav.classList.toggle("open");
      });
    }

    bindEvents() {
      this.ui.topicSearch.addEventListener("input", () => this.renderTopicList());

      this.ui.scenarioSelect.addEventListener("change", () => {
        this.state.scenarioIndex = Number(this.ui.scenarioSelect.value) || 0;
        this.resetStageState();
        this.renderScenario();
      });

      this.ui.termInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          const input = this.ui.termInput.value.trim();
          this.ui.termInput.value = "";
          this.processInput(input);
          return;
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          if (this.history.length) {
            this.historyCursor = Math.max(0, this.historyCursor - 1);
            this.ui.termInput.value = this.history[this.historyCursor] || "";
          }
          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          if (this.history.length) {
            this.historyCursor = Math.min(this.history.length, this.historyCursor + 1);
            this.ui.termInput.value = this.history[this.historyCursor] || "";
          }
          return;
        }

        if (event.key === "Tab") {
          event.preventDefault();
          this.autocompleteInput();
        }
      });

      this.ui.clearBtn.addEventListener("click", () => this.clearOutput());
      this.ui.hintBtn.addEventListener("click", () => this.showHint());
      this.ui.revealHintBtn.addEventListener("click", () => this.revealCommand());
      this.ui.skipStageBtn.addEventListener("click", () => this.skipStage());
      this.ui.resetScenBtn.addEventListener("click", () => this.resetScenario());
      this.ui.nextScenBtn.addEventListener("click", () => this.advanceScenario());
      this.ui.closeModalBtn.addEventListener("click", () => this.hideModal());
    }

    writeLine(type, text) {
      const line = document.createElement("p");
      line.className = "term-line " + type;
      line.textContent = text;
      this.ui.termOutput.appendChild(line);
      this.ui.termOutput.scrollTop = this.ui.termOutput.scrollHeight;
    }

    clearOutput() {
      this.ui.termOutput.innerHTML = "";
      this.writeLine("system", "Terminal cleared.");
    }

    renderTopicList() {
      const query = this.ui.topicSearch.value.trim().toLowerCase();
      this.ui.topicList.innerHTML = "";

      SIM_TOPICS.forEach((topic, index) => {
        if (query && topic.name.toLowerCase().indexOf(query) === -1) {
          return;
        }

        const done = this.getTopicCompletion(topic.id);
        const total = topic.scenarios.length;

        const btn = document.createElement("button");
        btn.className = "sim-topic-btn" + (index === this.state.topicIndex ? " active" : "");
        btn.type = "button";
        btn.innerHTML =
          '<span class="sim-topic-icon">' + topic.icon + "</span>" +
          '<span class="sim-topic-label">' + topic.name + "</span>" +
          '<span class="sim-topic-prog' + (done === total ? " done" : "") + '">' + done + "/" + total + "</span>";

        btn.addEventListener("click", () => {
          this.state.topicIndex = index;
          this.state.scenarioIndex = 0;
          this.resetStageState();
          this.renderTopicList();
          this.renderScenario();
          this.saveState();
        });

        this.ui.topicList.appendChild(btn);
      });
    }

    getCurrentTopic() {
      if (this.state.topicIndex < 0) {
        return null;
      }
      return SIM_TOPICS[this.state.topicIndex] || null;
    }

    getCurrentScenario() {
      const topic = this.getCurrentTopic();
      if (!topic) {
        return null;
      }
      return topic.scenarios[this.state.scenarioIndex] || null;
    }

    getCurrentStage() {
      const scenario = this.getCurrentScenario();
      if (!scenario) {
        return null;
      }
      return scenario.stages[this.state.stageIndex] || null;
    }

    renderScenario() {
      const topic = this.getCurrentTopic();
      if (!topic) {
        return;
      }

      const scenario = this.getCurrentScenario();
      if (!scenario) {
        return;
      }

      this.ui.simObjective.textContent = scenario.objective;
      this.ui.scenarioSelect.style.display = "inline-block";
      this.ui.scenarioSelect.innerHTML = "";
      topic.scenarios.forEach((item, idx) => {
        const opt = document.createElement("option");
        opt.value = String(idx);
        opt.textContent = (idx === 0 ? "Scenario A" : "Scenario B") + " - " + item.title;
        this.ui.scenarioSelect.appendChild(opt);
      });
      this.ui.scenarioSelect.value = String(this.state.scenarioIndex);

      const diffClass = scenario.difficulty.toLowerCase() === "advanced"
        ? "diff-advanced"
        : scenario.difficulty.toLowerCase() === "beginner"
          ? "diff-beginner"
          : "diff-intermediate";

      this.ui.simScenarioTitle.innerHTML =
        this.escapeHtml(topic.name + " - " + scenario.title) +
        '<span class="difficulty-badge ' + diffClass + '">' + this.escapeHtml(scenario.difficulty) + "</span>";

      this.ui.stageSection.style.display = "block";
      this.ui.simActionsRow.style.display = "flex";
      this.ui.termInput.disabled = false;
      this.ui.termInput.focus();

      this.ui.termPrompt.textContent = topic.prompt + " ";
      this.ui.termTitle.textContent = topic.prompt;

      this.renderStage();
      this.renderCommandReference(topic, scenario);
    }

    renderStage() {
      const scenario = this.getCurrentScenario();
      const stage = this.getCurrentStage();

      if (!scenario || !stage) {
        return;
      }

      this.ui.stageLabel.textContent =
        "Stage " + (this.state.stageIndex + 1) + " / " + scenario.stages.length;
      this.ui.stageInstruction.textContent = stage.instruction;
      this.ui.hintBox.classList.remove("visible");
      this.ui.hintBox.textContent = "";

      this.ui.stageDots.innerHTML = "";
      scenario.stages.forEach((_, idx) => {
        const dot = document.createElement("span");
        dot.className = "stage-dot";
        if (idx < this.state.stageIndex) {
          dot.classList.add("done");
        } else if (idx === this.state.stageIndex) {
          dot.classList.add("active");
        }
        this.ui.stageDots.appendChild(dot);
      });

      this.writeLine("divider", "------------------------------------------------------------");
      this.writeLine("system", "Objective: " + scenario.objective);
      this.writeLine("prompt-text", "Stage " + (this.state.stageIndex + 1) + ": " + stage.instruction);
    }

    renderCommandReference(topic, scenario) {
      const baseCommands = [
        ["help", "Show simulator command help"],
        ["hint", "Display expected direction for current stage"],
        ["reveal", "Reveal the exact command for current stage"],
        ["skip", "Move to next stage"],
        ["history", "Show recently entered commands"],
        ["commands", "Show 3000+ command-space stats"],
        ["scenario 1|2", "Switch scenario in current topic"]
      ];

      const stageHints = scenario.stages.map((s, idx) => ["Stage " + (idx + 1), s.hint]);

      const html = [];
      baseCommands.forEach((item) => {
        html.push(
          '<div class="cmd-ref-item">' +
            '<div class="cmd-ref-cmd">' + this.escapeHtml(item[0]) + "</div>" +
            '<div class="cmd-ref-desc">' + this.escapeHtml(item[1]) + "</div>" +
          "</div>"
        );
      });

      html.push('<div style="height:8px"></div>');
      html.push('<div class="cmd-ref-item"><div class="cmd-ref-cmd">Scenario Command Hints</div><div class="cmd-ref-desc">Examples expected by current stages.</div></div>');

      stageHints.forEach((item) => {
        html.push(
          '<div class="cmd-ref-item">' +
            '<div class="cmd-ref-cmd">' + this.escapeHtml(item[0]) + "</div>" +
            '<div class="cmd-ref-desc">' + this.escapeHtml(item[1]) + "</div>" +
          "</div>"
        );
      });

      this.ui.cmdRefContent.innerHTML = html.join("");

      const summary = "Loaded " + topic.name + " with " + scenario.stages.length + " guided stages.";
      this.writeLine("system", summary);
    }

    processInput(rawInput) {
      const input = String(rawInput || "").trim();
      if (!input) {
        return;
      }

      this.history.push(input);
      this.historyCursor = this.history.length;
      this.writeLine("cmd", this.ui.termPrompt.textContent + input);

      const lowered = input.toLowerCase();

      if (this.runUniversalCommand(lowered, input)) {
        return;
      }

      const stage = this.getCurrentStage();
      if (stage && stage.successPattern.test(input)) {
        this.completeStage();
        return;
      }

      const handledByEngine = this.runCommandEngine(input);
      if (handledByEngine) {
        this.writeLine("warn", "Command processed in free-explore mode, but it did not satisfy current stage objective.");
      } else {
        this.writeLine("error", "Command not recognized in simulation context. Type 'help' to see available options.");
      }
    }

    runUniversalCommand(lowered, input) {
      if (lowered === "clear" || lowered === "cls") {
        this.clearOutput();
        return true;
      }

      if (lowered === "help") {
        this.printHelp();
        return true;
      }

      if (lowered === "hint") {
        this.showHint();
        return true;
      }

      if (lowered === "reveal") {
        this.revealCommand();
        return true;
      }

      if (lowered === "skip" || lowered === "next") {
        this.skipStage();
        return true;
      }

      if (lowered === "history") {
        this.printHistory();
        return true;
      }

      if (lowered === "score") {
        this.writeLine("success", "Score: " + this.state.score + " pts");
        return true;
      }

      if (lowered === "reset") {
        this.resetScenario();
        return true;
      }

      if (lowered === "topics") {
        this.writeLine("output", "Topics: " + SIM_TOPICS.map((t) => t.name).join(" | "));
        return true;
      }

      if (lowered === "scenarios") {
        const topic = this.getCurrentTopic();
        if (!topic) {
          this.writeLine("error", "No topic selected.");
          return true;
        }
        this.writeLine("output", "Scenarios: 1) " + topic.scenarios[0].title + "  2) " + topic.scenarios[1].title);
        return true;
      }

      if (lowered === "commands") {
        this.writeLine("success", "Exact generated command possibilities: " + COMMAND_COUNT + ".");
        this.writeLine("success", "Estimated accepted grammar space: " + formatBigIntCompact(COMMAND_SPACE.estimated) + "+ using " + COMMAND_SPACE.roots + " command roots.");
        this.writeLine("output", "Includes " + EXTRA_COMMAND_ROOTS.length + " additional simulator command roots for high-variance input practice.");
        this.writeLine("output", "Try examples: sudo nmap -sV 10.10.20.0/24 | head -n 20");
        this.writeLine("output", "Try examples: powershell -Command Get-ChildItem -Recurse C:\\Windows | sort");
        this.writeLine("output", "Try examples: simsec-0420 --help && simcloud-0999 --profile prod");
        this.writeLine("output", "Try examples: aws iam list-users --profile prod && jq . < users.json");
        return true;
      }

      if (lowered === "whoami") {
        const topic = this.getCurrentTopic();
        this.writeLine("output", topic ? topic.prompt.split(" ")[0] : "analyst");
        return true;
      }

      if (lowered === "date") {
        this.writeLine("output", new Date().toDateString());
        return true;
      }

      if (lowered === "time") {
        this.writeLine("output", new Date().toLocaleTimeString());
        return true;
      }

      if (lowered.indexOf("scenario ") === 0) {
        const parts = input.trim().split(/\s+/);
        const value = Number(parts[1]);
        if (value === 1 || value === 2) {
          this.state.scenarioIndex = value - 1;
          this.resetStageState();
          this.renderScenario();
          this.saveState();
          return true;
        }
        this.writeLine("error", "Usage: scenario 1 or scenario 2");
        return true;
      }

      return false;
    }

    printHelp() {
      const lines = [
        "Simulator Commands:",
        "  help       - show this help",
        "  hint       - show stage hint",
        "  reveal     - reveal exact expected command",
        "  skip       - skip current stage",
        "  reset      - reset current scenario",
        "  history    - show entered commands",
        "  score      - show current score",
        "  topics     - list all simulator topics",
        "  scenarios  - list scenario titles",
        "  scenario 1 - switch to Scenario A",
        "  scenario 2 - switch to Scenario B",
        "  clear/cls  - clear terminal",
        "  commands   - show Linux/Windows command space stats"
      ];

      lines.forEach((line) => this.writeLine("output", line));
      this.writeLine("success", "This simulator recognizes " + COMMAND_COUNT + " exact generated forms and an estimated " + formatBigIntCompact(COMMAND_SPACE.estimated) + "+ grammar-driven inputs.");
    }

    printHistory() {
      if (!this.history.length) {
        this.writeLine("system", "History is empty.");
        return;
      }
      this.history.slice(-12).forEach((entry, idx) => {
        this.writeLine("output", String(idx + 1).padStart(2, "0") + "  " + entry);
      });
    }

    showHint() {
      const stage = this.getCurrentStage();
      if (!stage) {
        this.writeLine("error", "No active stage.");
        return;
      }
      this.state.hintsUsedForStage = true;
      this.ui.hintBox.textContent = stage.hint;
      this.ui.hintBox.classList.add("visible");
      this.writeLine("hint-shown", "Hint: " + stage.hint);
      this.saveState();
    }

    revealCommand() {
      const stage = this.getCurrentStage();
      if (!stage) {
        this.writeLine("error", "No active stage.");
        return;
      }
      this.state.revealUsedForStage = true;
      this.state.hintsUsedForStage = true;
      this.ui.hintBox.textContent = stage.hint;
      this.ui.hintBox.classList.add("visible");
      this.writeLine("hint-shown", "Reveal: expected command family -> " + stage.hint);
      this.saveState();
    }

    skipStage() {
      const stage = this.getCurrentStage();
      if (!stage) {
        return;
      }
      this.writeLine("warn", "Stage skipped.");
      this.advanceStage(false);
    }

    completeStage() {
      const stage = this.getCurrentStage();
      if (!stage) {
        return;
      }

      const points = this.state.revealUsedForStage
        ? STAGE_POINTS.revealUsed
        : this.state.hintsUsedForStage
          ? STAGE_POINTS.hintUsed
          : STAGE_POINTS.clean;

      this.state.score += points;
      this.writeLine("success", "Stage complete (+" + points + " pts)");
      this.writeLine("output", stage.output);

      this.advanceStage(true);
    }

    advanceStage(markCompleted) {
      const topic = this.getCurrentTopic();
      const scenario = this.getCurrentScenario();
      if (!topic || !scenario) {
        return;
      }

      if (markCompleted) {
        const stageKey = this.makeStageKey(topic.id, this.state.scenarioIndex, this.state.stageIndex);
        this.state.completedStages[stageKey] = true;
      }

      if (this.state.stageIndex < scenario.stages.length - 1) {
        this.state.stageIndex += 1;
        this.resetStageFlagsOnly();
        this.renderStage();
        this.refreshOverallProgress();
        this.refreshScore();
        this.renderTopicList();
        this.saveState();
        return;
      }

      const scenarioKey = this.makeScenarioKey(topic.id, this.state.scenarioIndex);
      if (!this.state.completedScenarios[scenarioKey]) {
        this.state.completedScenarios[scenarioKey] = true;
        this.state.score += STAGE_POINTS.scenarioBonus;
      }

      this.refreshScore();
      this.refreshOverallProgress();
      this.renderTopicList();
      this.showCompletionModal(topic, scenario);
      this.saveState();
    }

    showCompletionModal(topic, scenario) {
      this.ui.modalScore.textContent = "+" + STAGE_POINTS.scenarioBonus + " pts bonus";
      this.ui.modalMessage.textContent = "Completed " + topic.name + " / " + scenario.title + ". Continue to deepen your coverage.";
      this.ui.completionModal.classList.remove("hidden");
    }

    hideModal() {
      this.ui.completionModal.classList.add("hidden");
    }

    advanceScenario() {
      const topic = this.getCurrentTopic();
      if (!topic) {
        return;
      }
      this.hideModal();
      this.state.scenarioIndex = (this.state.scenarioIndex + 1) % topic.scenarios.length;
      this.resetStageState();
      this.renderScenario();
      this.saveState();
    }

    resetScenario() {
      this.resetStageState();
      this.clearOutput();
      this.renderScenario();
      this.writeLine("system", "Scenario reset.");
      this.saveState();
    }

    resetStageState() {
      this.state.stageIndex = 0;
      this.resetStageFlagsOnly();
    }

    resetStageFlagsOnly() {
      this.state.hintsUsedForStage = false;
      this.state.revealUsedForStage = false;
      this.ui.hintBox.classList.remove("visible");
      this.ui.hintBox.textContent = "";
    }

    refreshScore() {
      this.ui.globalScore.style.display = "inline-flex";
      this.ui.scoreDisplay.textContent = this.state.score + " pts";
    }

    refreshOverallProgress() {
      const total = SIM_TOPICS.length * 2;
      const done = Object.keys(this.state.completedScenarios).length;
      const pct = total ? Math.round((done / total) * 100) : 0;
      this.ui.overallFill.style.width = pct + "%";
      this.ui.overallLabel.textContent = done + " / " + total + " scenarios";
      this.ui.overallPct.textContent = pct + "%";
    }

    getTopicCompletion(topicId) {
      let count = 0;
      for (let i = 0; i < 2; i += 1) {
        if (this.state.completedScenarios[this.makeScenarioKey(topicId, i)]) {
          count += 1;
        }
      }
      return count;
    }

    makeScenarioKey(topicId, scenarioIdx) {
      return topicId + "::" + scenarioIdx;
    }

    makeStageKey(topicId, scenarioIdx, stageIdx) {
      return topicId + "::" + scenarioIdx + "::" + stageIdx;
    }

    runCommandEngine(input) {
      const normalized = input.replace(/\s+/g, " ").trim();
      const lowered = normalized.toLowerCase();

      if (COMMAND_POSSIBILITIES.has(normalized) || COMMAND_POSSIBILITIES.has(lowered)) {
        this.writeLine("output", this.syntheticOutput(normalized));
        return true;
      }

      const stripped = this.stripPrefixChain(lowered);
      const first = stripped.split(/\s+/)[0];
      if (this.findKnownRoot(first)) {
        this.writeLine("output", this.syntheticOutput(normalized));
        return true;
      }

      if (this.matchesCommandGrammar(stripped)) {
        this.writeLine("output", this.syntheticOutput(normalized));
        return true;
      }

      return false;
    }

    stripPrefixChain(input) {
      let result = input;
      const prefixes = ["sudo ", "time ", "nohup ", "cmd /c ", "powershell -command "];
      let changed = true;
      while (changed) {
        changed = false;
        for (let i = 0; i < prefixes.length; i += 1) {
          const prefix = prefixes[i];
          if (result.indexOf(prefix) === 0) {
            result = result.slice(prefix.length).trim();
            changed = true;
          }
        }
      }
      return result;
    }

    matchesCommandGrammar(input) {
      if (!input) {
        return false;
      }

      const segments = input.split(/\s*(?:\|\||&&|\||;)\s*/).filter(Boolean);
      if (!segments.length) {
        return false;
      }

      let matchedSegments = 0;
      for (let i = 0; i < segments.length; i += 1) {
        const segment = segments[i].trim();
        if (!segment) {
          continue;
        }

        const token = segment.split(/\s+/)[0].toLowerCase();
        if (this.findKnownRoot(token)) {
          matchedSegments += 1;
          continue;
        }

        const tokens = segment.split(/\s+/);
        let found = false;
        for (let t = 0; t < tokens.length; t += 1) {
          if (this.findKnownRoot(tokens[t].toLowerCase())) {
            found = true;
            break;
          }
        }

        if (found) {
          matchedSegments += 1;
        }
      }

      return matchedSegments > 0;
    }

    findKnownRoot(token) {
      const cleaned = String(token || "").trim().toLowerCase();
      if (!cleaned) {
        return null;
      }

      if (KNOWN_ROOTS.has(cleaned)) {
        return cleaned;
      }

      if (COMMAND_ENGINE_ALIASES[cleaned]) {
        return cleaned;
      }

      if (cleaned.indexOf("./") === 0 || cleaned.indexOf(".\\") === 0 || cleaned.indexOf("/") === 0) {
        return cleaned;
      }

      return null;
    }

    syntheticOutput(command) {
      const base = command.toLowerCase();

      if (base.indexOf("nmap") >= 0) {
        return "Starting Nmap 7.94\n22/tcp open ssh\n80/tcp open http\n443/tcp open https\nScan done.";
      }
      if (base.indexOf("trivy") >= 0) {
        return "trivy scan result:\nCRITICAL: 1\nHIGH: 4\nMEDIUM: 13\nRecommendation: patch base image.";
      }
      if (base.indexOf("kubectl") >= 0) {
        return "NAME                         READY   STATUS\napi-7fd8f                     1/1     Running\nworker-66a91                  1/1     Running";
      }
      if (base.indexOf("aws") >= 0) {
        return "AWS CLI response (simulated): resources listed successfully.";
      }
      if (base.indexOf("az ") >= 0 || base === "az") {
        return "Azure CLI response (simulated): role assignments and resources retrieved.";
      }
      if (base.indexOf("powershell") >= 0 || base.indexOf("get-") >= 0 || base.indexOf("gci") >= 0) {
        return "PowerShell command executed in simulation context. Objects returned: 24";
      }
      if (base.indexOf("grep") >= 0 || base.indexOf("select-string") >= 0) {
        return "3 matches found:\n[WARN] auth denied\n[WARN] token mismatch\n[ERR ] signature invalid";
      }
      if (base.indexOf("tcpdump") >= 0 || base.indexOf("tshark") >= 0) {
        return "Packet capture complete: 50 packets, 6 suspicious DNS queries.";
      }
      if (base.indexOf("semgrep") >= 0) {
        return "semgrep findings:\n- sql-injection-risk (HIGH)\n- unsafe-deserialization (MEDIUM)";
      }
      if (base.indexOf("openssl") >= 0) {
        return "Certificate:\nSubject: CN=internal-api\nNot After: 2026-09-10\nSignature Algorithm: sha256RSA";
      }
      if (base.indexOf("volatility") >= 0) {
        return "Volatility analysis:\n- suspicious process tree identified\n- injected thread in explorer.exe";
      }
      if (base.indexOf("yara") >= 0) {
        return "YARA scan complete: 1 match -> MAL_Generic_Packer";
      }
      if (base.indexOf("whoami") >= 0) {
        return "analyst";
      }

      return "Command executed successfully in simulation shell.";
    }

    autocompleteInput() {
      const stage = this.getCurrentStage();
      const current = this.ui.termInput.value.trim();
      if (!current && stage) {
        this.ui.termInput.value = stage.hint;
        return;
      }

      if (!current) {
        return;
      }

      const lower = current.toLowerCase();
      const candidates = [];

      Object.keys(UNIVERSAL_COMMANDS).forEach((cmd) => {
        if (cmd.indexOf(lower) === 0) {
          candidates.push(cmd);
        }
      });

      COMMAND_LIBRARY.forEach((family) => {
        family.commands.forEach((cmd) => {
          if (cmd.toLowerCase().indexOf(lower) === 0) {
            candidates.push(cmd);
          }
        });
      });

      if (!candidates.length) {
        return;
      }

      this.ui.termInput.value = candidates[0];
    }

    escapeHtml(text) {
      return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (error) {
        /* no-op for private mode */
      }
    }

    loadState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          return;
        }
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") {
          return;
        }

        this.state = Object.assign(this.state, {
          topicIndex: typeof parsed.topicIndex === "number" ? parsed.topicIndex : -1,
          scenarioIndex: typeof parsed.scenarioIndex === "number" ? parsed.scenarioIndex : 0,
          stageIndex: typeof parsed.stageIndex === "number" ? parsed.stageIndex : 0,
          score: typeof parsed.score === "number" ? parsed.score : 0,
          completedScenarios: parsed.completedScenarios && typeof parsed.completedScenarios === "object" ? parsed.completedScenarios : {},
          completedStages: parsed.completedStages && typeof parsed.completedStages === "object" ? parsed.completedStages : {}
        });
      } catch (error) {
        /* ignore malformed storage */
      }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    new Simulator();
  });
})();
