(function () {
  "use strict";

  var MODE_KEY = "cyberskillforge-theme-mode-v2";
  var MANUAL_KEY = "cyberskillforge-theme-manual-v2";
  var LEGACY_KEY = "cyberskillforge-theme-v1";

  var THEMES = [
    { id: "ocean", label: "Ocean", swatch: ["#50d4ff", "#6affbc", "#10243a"] },
    { id: "slate", label: "Slate", swatch: ["#9bc2ff", "#ffc38f", "#212838"] },
    { id: "arctic", label: "Arctic", swatch: ["#1975c1", "#11806a", "#d7ecfb"] },
    { id: "ember", label: "Ember", swatch: ["#ff8f5e", "#ffd47d", "#3b2219"] },
    { id: "terminal", label: "Terminal", swatch: ["#4dffb2", "#73f7d0", "#0d251a"] }
  ];

  var state = {
    mode: "system",
    manualTheme: "ocean",
    appliedTheme: "ocean"
  };

  var switchers = [];
  var colorQuery = null;
  var animationTimer = null;
  var toastTimer = null;
  var toastWrap = null;
  var pulseThemeId = null;
  var viewportTicking = false;
  var diagnosticsNode = null;

  function validTheme(themeId) {
    for (var i = 0; i < THEMES.length; i += 1) {
      if (THEMES[i].id === themeId) {
        return true;
      }
    }
    return false;
  }

  function getSystemTheme() {
    try {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
        return "arctic";
      }
    } catch (_error) {
    }
    return "ocean";
  }

  function loadState() {
    try {
      var mode = localStorage.getItem(MODE_KEY);
      var manual = localStorage.getItem(MANUAL_KEY);
      var legacy = localStorage.getItem(LEGACY_KEY);

      if (mode === "manual" || mode === "system") {
        state.mode = mode;
      }

      if (manual && validTheme(manual)) {
        state.manualTheme = manual;
      } else if (legacy && validTheme(legacy)) {
        state.manualTheme = legacy;
        state.mode = "manual";
      }
    } catch (_error) {
    }
  }

  function saveState() {
    try {
      localStorage.setItem(MODE_KEY, state.mode);
      localStorage.setItem(MANUAL_KEY, state.manualTheme);
    } catch (_error) {
    }
  }

  function applyTheme(themeId) {
    var theme = validTheme(themeId) ? themeId : "ocean";
    document.documentElement.classList.add("theme-animating");
    if (animationTimer) {
      clearTimeout(animationTimer);
    }
    if (theme === "ocean") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    animationTimer = setTimeout(function () {
      document.documentElement.classList.remove("theme-animating");
    }, 360);
    state.appliedTheme = theme;
  }

  function syncTheme() {
    var next = state.mode === "system" ? getSystemTheme() : state.manualTheme;
    applyTheme(next);
    saveState();
  }

  function ensureToastWrap() {
    if (toastWrap) {
      return toastWrap;
    }
    toastWrap = document.createElement("div");
    toastWrap.className = "theme-toast-wrap";
    document.body.appendChild(toastWrap);
    return toastWrap;
  }

  function showThemeToast(message) {
    var wrap = ensureToastWrap();
    wrap.innerHTML = '<div class="theme-toast"><strong>Theme updated</strong> ' + message + "</div>";
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(function () {
      wrap.innerHTML = "";
    }, 1700);
  }

  function buildSwatch(swatchColors) {
    var wrap = document.createElement("span");
    wrap.className = "theme-swatch";
    for (var i = 0; i < swatchColors.length; i += 1) {
      var dot = document.createElement("i");
      dot.style.backgroundColor = swatchColors[i];
      wrap.appendChild(dot);
    }
    return wrap;
  }

  function setOpen(switcher, isOpen) {
    switcher.panel.classList.toggle("hidden", !isOpen);
    switcher.toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  function closeAll() {
    for (var i = 0; i < switchers.length; i += 1) {
      setOpen(switchers[i], false);
    }
  }

  function renderSwitcher(switcher) {
    var panel = switcher.panel;
    panel.innerHTML = "";

    var systemOption = document.createElement("button");
    systemOption.type = "button";
    systemOption.className = "theme-option" + (state.mode === "system" ? " active" : "");
    systemOption.textContent = "System";
    systemOption.appendChild(buildSwatch(["#8caec8", "#d7ecfb", "#1d2b3a"]));
    systemOption.addEventListener("click", function () {
      state.mode = "system";
      syncTheme();
      pulseThemeId = "system";
      renderAll();
      showThemeToast("Following system appearance");
    });
    panel.appendChild(systemOption);

    for (var i = 0; i < THEMES.length; i += 1) {
      var theme = THEMES[i];
      var option = document.createElement("button");
      option.type = "button";
      var isManualActive = state.mode === "manual" && state.manualTheme === theme.id;
      var isPulseTarget = theme.id === pulseThemeId;
      option.className = "theme-option" + (isManualActive || isPulseTarget ? " active" : "");
      option.setAttribute("data-theme-id", theme.id);
      option.setAttribute("data-theme-label", theme.label);
      option.textContent = theme.label;
      option.appendChild(buildSwatch(theme.swatch));
      option.addEventListener("click", function (event) {
        var target = event.currentTarget;
        var next = target.getAttribute("data-theme-id") || "ocean";
        var label = target.getAttribute("data-theme-label") || next;
        state.mode = "manual";
        state.manualTheme = validTheme(next) ? next : "ocean";
        syncTheme();
        pulseThemeId = state.manualTheme;
        renderAll();
        showThemeToast("Switched to " + label);
      });
      panel.appendChild(option);
    }

    switcher.toggle.textContent = state.mode === "system" ? "Theme: System" : "Theme: " + state.manualTheme;
    pulseThemeId = null;
  }

  function renderAll() {
    for (var i = 0; i < switchers.length; i += 1) {
      renderSwitcher(switchers[i]);
    }
  }

  function createSwitcher(className, mountNode) {
    var host = document.createElement("div");
    host.className = "theme-switcher " + className;

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "theme-toggle";
    toggle.setAttribute("aria-expanded", "false");

    var panel = document.createElement("div");
    panel.className = "theme-panel hidden";

    var switcher = { host: host, toggle: toggle, panel: panel };

    toggle.addEventListener("click", function () {
      var open = panel.classList.contains("hidden");
      closeAll();
      setOpen(switcher, open);
    });

    host.appendChild(toggle);
    host.appendChild(panel);
    mountNode.appendChild(host);
    switchers.push(switcher);
    renderSwitcher(switcher);
  }

  function setupKeyboardShortcuts() {
    document.addEventListener("keydown", function (event) {
      if ((event.altKey || event.metaKey) && event.key.toLowerCase() === "t") {
        event.preventDefault();
        if (!switchers.length) {
          return;
        }
        var target = switchers[0];
        var isHidden = target.panel.classList.contains("hidden");
        closeAll();
        setOpen(target, isHidden);
      }
      if (event.key === "Escape") {
        closeAll();
      }
    });
  }

  function setupOutsideClickClose() {
    document.addEventListener("click", function (event) {
      for (var i = 0; i < switchers.length; i += 1) {
        if (switchers[i].host.contains(event.target)) {
          return;
        }
      }
      closeAll();
    });
  }

  function observeSystemTheme() {
    if (!window.matchMedia) {
      return;
    }
    colorQuery = window.matchMedia("(prefers-color-scheme: light)");
    var handler = function () {
      if (state.mode === "system") {
        syncTheme();
        renderAll();
      }
    };
    if (typeof colorQuery.addEventListener === "function") {
      colorQuery.addEventListener("change", handler);
    } else if (typeof colorQuery.addListener === "function") {
      colorQuery.addListener(handler);
    }
  }

  function setPageKind() {
    var path = "";
    try {
      path = (window.location.pathname || "").toLowerCase();
    } catch (_error) {
    }

    var kind = "content";
    if (path.indexOf("/index.html") >= 0 || path === "/" || path.endsWith("/cybersecurity-skillforge") || path.endsWith("/cybersecurity-skillforge/")) {
      kind = "home";
    } else if (path.indexOf("studies.html") >= 0 || path.indexOf("labs.html") >= 0) {
      kind = "learning";
    } else if (path.indexOf("simulator") >= 0) {
      kind = "simulator";
    }

    document.documentElement.setAttribute("data-page-kind", kind);
  }

  function mount() {
    setPageKind();
    setPlatformFlags();
    syncViewportHeightVar();
    var nav = document.querySelector(".site-header .main-nav");
    if (nav) {
      createSwitcher("theme-inline", nav);
    }
    createSwitcher("theme-floating", document.body);

    setupKeyboardShortcuts();
    setupOutsideClickClose();
    observeSystemTheme();
    bindViewportListeners();
    maybeMountDiagnostics();
  }

  function setPlatformFlags() {
    var ua = "";
    try {
      ua = (navigator.userAgent || "").toLowerCase();
    } catch (_error) {
    }

    var platform = "other";
    if (ua.indexOf("windows") >= 0) {
      platform = "windows";
    } else if (ua.indexOf("mac os") >= 0 || ua.indexOf("macintosh") >= 0) {
      platform = "mac";
    } else if (ua.indexOf("android") >= 0) {
      platform = "android";
    } else if (ua.indexOf("iphone") >= 0 || ua.indexOf("ipad") >= 0 || ua.indexOf("ipod") >= 0) {
      platform = "ios";
    }

    var touch = false;
    try {
      touch = ("ontouchstart" in window) || (navigator.maxTouchPoints > 0);
    } catch (_error) {
    }

    document.documentElement.setAttribute("data-platform", platform);
    document.documentElement.setAttribute("data-touch", touch ? "true" : "false");
  }

  function syncViewportHeightVar() {
    var vh = window.innerHeight || document.documentElement.clientHeight || 0;
    if (vh > 0) {
      document.documentElement.style.setProperty("--app-vh", vh + "px");
    }
  }

  function bindViewportListeners() {
    var handler = function () {
      if (viewportTicking) {
        return;
      }
      viewportTicking = true;
      runLater(function () {
        syncViewportHeightVar();
        viewportTicking = false;
      });
    };
    addWindowListener("resize", handler);
    addWindowListener("orientationchange", handler);
  }

  function runLater(callback) {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(callback);
    } else {
      setTimeout(callback, 16);
    }
  }

  function addWindowListener(name, handler) {
    try {
      window.addEventListener(name, handler, { passive: true });
    } catch (_error) {
      window.addEventListener(name, handler, false);
    }
  }

  function supportsCss(property, value) {
    try {
      return !!(window.CSS && CSS.supports && CSS.supports(property, value));
    } catch (_error) {
      return false;
    }
  }

  function shouldShowDiagnostics() {
    try {
      return /(?:\?|&)(diag|compat)=1(?:&|$)/i.test(window.location.search || "");
    } catch (_error) {
      return false;
    }
  }

  function shouldAutoRunDiagnostics() {
    try {
      return /(?:\?|&)(autotest|runchecks)=1(?:&|$)/i.test(window.location.search || "");
    } catch (_error) {
      return false;
    }
  }

  function diagLine(label, ok) {
    return '<p><strong>' + label + ':</strong> <span class="' + (ok ? 'compat-ok' : 'compat-bad') + '">' + (ok ? 'yes' : 'no') + '</span></p>';
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function runBrowserSanityChecks() {
    var checks = [];
    var add = function (name, pass, detail) {
      checks.push({ name: name, pass: !!pass, detail: detail || "" });
    };

    add("DOM ready", !!document.body, "document.body exists");
    add("Theme switcher mounted", switchers.length >= 1, "switchers: " + switchers.length);
    add("Viewport var set", !!getComputedStyle(document.documentElement).getPropertyValue("--app-vh").trim(), "--app-vh is present");
    add("matchMedia available", typeof window.matchMedia === "function", "required for system mode sync");

    var storageOk = false;
    try {
      var key = "__csf_browser_test__";
      localStorage.setItem(key, "ok");
      storageOk = localStorage.getItem(key) === "ok";
      localStorage.removeItem(key);
    } catch (_error) {
      storageOk = false;
    }
    add("localStorage roundtrip", storageOk, "set/get/remove test");

    var hasHorizontalOverflow = false;
    try {
      hasHorizontalOverflow = document.documentElement.scrollWidth > (window.innerWidth + 2);
    } catch (_error) {
      hasHorizontalOverflow = true;
    }
    add("No horizontal overflow", !hasHorizontalOverflow, "scrollWidth vs viewport width");

    add("CSS color-mix support", supportsCss("background", "color-mix(in srgb, black 50%, white 50%)"), "fallbacks provided when unsupported");
    add("Backdrop filter support", supportsCss("backdrop-filter", "blur(8px)") || supportsCss("-webkit-backdrop-filter", "blur(8px)"), "UI remains usable if unavailable");

    var passCount = 0;
    for (var i = 0; i < checks.length; i += 1) {
      if (checks[i].pass) {
        passCount += 1;
      }
    }
    return {
      checks: checks,
      passCount: passCount,
      total: checks.length
    };
  }

  function renderBrowserSanityResults(target) {
    if (!target) {
      return;
    }
    var result = runBrowserSanityChecks();
    var rows = [];
    rows.push('<p><strong>Sanity score:</strong> <span class="' + (result.passCount === result.total ? 'compat-ok' : 'compat-bad') + '">' + result.passCount + '/' + result.total + '</span></p>');
    for (var i = 0; i < result.checks.length; i += 1) {
      var item = result.checks[i];
      rows.push('<p><strong>' + escapeHtml(item.name) + ':</strong> <span class="' + (item.pass ? 'compat-ok' : 'compat-bad') + '">' + (item.pass ? 'pass' : 'fail') + '</span> <span>' + escapeHtml(item.detail) + '</span></p>');
    }
    target.innerHTML = rows.join("");
  }

  function maybeMountDiagnostics() {
    if (!shouldShowDiagnostics()) {
      return;
    }
    diagnosticsNode = document.createElement("div");
    diagnosticsNode.className = "compat-diag";

    var ua = "unknown";
    try {
      ua = navigator.userAgent || "unknown";
    } catch (_error) {
    }

    var supports = {
      matchMedia: typeof window.matchMedia === "function",
      localStorage: (function () {
        try {
          var key = "__diag_test__";
          localStorage.setItem(key, "1");
          localStorage.removeItem(key);
          return true;
        } catch (_error) {
          return false;
        }
      })(),
      colorMix: supportsCss("background", "color-mix(in srgb, black 50%, white 50%)"),
      dvh: supportsCss("height", "100dvh"),
      backdropFilter: supportsCss("backdrop-filter", "blur(8px)") || supportsCss("-webkit-backdrop-filter", "blur(8px)")
    };

    diagnosticsNode.innerHTML =
      '<div class="compat-diag-head">Compatibility Diagnostics <button type="button" id="compatDiagClose">Close</button></div>' +
      '<div class="compat-diag-body">' +
      '<p><strong>Platform:</strong> ' + (document.documentElement.getAttribute("data-platform") || "other") + '</p>' +
      '<p><strong>Touch:</strong> ' + (document.documentElement.getAttribute("data-touch") || "false") + '</p>' +
      '<p><strong>Theme mode:</strong> ' + state.mode + '</p>' +
      '<p><strong>Applied theme:</strong> ' + state.appliedTheme + '</p>' +
      '<p><strong>Viewport:</strong> ' + (window.innerWidth || 0) + ' x ' + (window.innerHeight || 0) + '</p>' +
      diagLine('matchMedia', supports.matchMedia) +
      diagLine('localStorage', supports.localStorage) +
      diagLine('color-mix', supports.colorMix) +
      diagLine('100dvh', supports.dvh) +
      diagLine('backdrop-filter', supports.backdropFilter) +
      '<p><strong>UA:</strong> ' + escapeHtml(ua) + '</p>' +
      '<div class="compat-diag-actions"><button type="button" id="compatRunChecks">Run Browser Checks</button></div>' +
      '<div class="compat-results" id="compatDiagResults"></div>' +
      '</div>';

    document.body.appendChild(diagnosticsNode);

    var close = document.getElementById("compatDiagClose");
    if (close) {
      close.addEventListener("click", function () {
        if (diagnosticsNode && diagnosticsNode.parentNode) {
          diagnosticsNode.parentNode.removeChild(diagnosticsNode);
          diagnosticsNode = null;
        }
      });
    }

    var run = document.getElementById("compatRunChecks");
    var output = document.getElementById("compatDiagResults");
    if (run && output) {
      run.addEventListener("click", function () {
        renderBrowserSanityResults(output);
      });
      if (shouldAutoRunDiagnostics()) {
        renderBrowserSanityResults(output);
      }
    }
  }

  loadState();
  syncTheme();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
