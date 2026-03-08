const SWATCHES = [
  { id: "solid-violet", type: "solid", primary: "#7C5CFF", secondary: "#7C5CFF", preview: "#7C5CFF" },
  { id: "solid-cyan", type: "solid", primary: "#25D0FF", secondary: "#25D0FF", preview: "#25D0FF" },
  { id: "solid-green", type: "solid", primary: "#19C37D", secondary: "#19C37D", preview: "#19C37D" },
  { id: "solid-yellow", type: "solid", primary: "#FFD166", secondary: "#FFD166", preview: "#FFD166" },
  { id: "solid-coral", type: "solid", primary: "#FF7A59", secondary: "#FF7A59", preview: "#FF7A59" },
  { id: "solid-pink", type: "solid", primary: "#FF5C7A", secondary: "#FF5C7A", preview: "#FF5C7A" },

  { id: "grad-aurora", type: "gradient", primary: "#7C5CFF", secondary: "#25D0FF", preview: "linear-gradient(135deg,#7C5CFF,#25D0FF)" },
  { id: "grad-lime", type: "gradient", primary: "#19C37D", secondary: "#7ED957", preview: "linear-gradient(135deg,#19C37D,#7ED957)" },
  { id: "grad-sunset", type: "gradient", primary: "#FFD166", secondary: "#FF7A59", preview: "linear-gradient(135deg,#FFD166,#FF7A59)" },
  { id: "grad-rose", type: "gradient", primary: "#FF5C7A", secondary: "#E85DFF", preview: "linear-gradient(135deg,#FF5C7A,#E85DFF)" },
  { id: "grad-ocean", type: "gradient", primary: "#5B8CFF", secondary: "#25D0FF", preview: "linear-gradient(135deg,#5B8CFF,#25D0FF)" },
  { id: "grad-plasma", type: "gradient", primary: "#A855F7", secondary: "#EC4899", preview: "linear-gradient(135deg,#A855F7,#EC4899)" }
];

const STORAGE_KEY = "aralaps_state_v12";
const HISTORY_LIMIT = 20;
const RING_RADIUS = 124;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const dom = {
  body: document.body,

  settingsBtn: document.getElementById("settingsBtn"),
  themeBtn: document.getElementById("themeBtn"),
  closeSettingsBtn: document.getElementById("closeSettingsBtn"),
  cancelSettingsBtn: document.getElementById("cancelSettingsBtn"),
  applySettingsBtn: document.getElementById("applySettingsBtn"),
  modalBackdrop: document.getElementById("modalBackdrop"),
  settingsModal: document.getElementById("settingsModal"),

  tabTimerBtn: document.getElementById("tabTimerBtn"),
  tabSoundBtn: document.getElementById("tabSoundBtn"),
  tabHistoryBtn: document.getElementById("tabHistoryBtn"),

  timerTab: document.getElementById("timerTab"),
  soundTab: document.getElementById("soundTab"),
  historyTab: document.getElementById("historyTab"),

  cycleBadge: document.getElementById("cycleBadge"),
  partTitle: document.getElementById("partTitle"),
  partMeta: document.getElementById("partMeta"),
  remainingLabel: document.getElementById("remainingLabel"),
  elapsedLabel: document.getElementById("elapsedLabel"),
  timerRingProgress: document.getElementById("timerRingProgress"),
  ringStop1: document.getElementById("ringStop1"),
  ringStop2: document.getElementById("ringStop2"),
  ambientBg: document.getElementById("ambientBg"),
  screenPulse: document.getElementById("screenPulse"),
  ringBurst: document.getElementById("ringBurst"),
  timelineBar: document.getElementById("timelineBar"),

  playPauseBtn: document.getElementById("playPauseBtn"),
  playPauseIcon: document.getElementById("playPauseIcon"),
  resetBtn: document.getElementById("resetBtn"),
  nextBtn: document.getElementById("nextBtn"),

  repeatCountInput: document.getElementById("repeatCountInput"),
  vibrateToggle: document.getElementById("vibrateToggle"),
  alertsToggle: document.getElementById("alertsToggle"),
  builtInSoundsToggle: document.getElementById("builtInSoundsToggle"),
  wheelTickToggle: document.getElementById("wheelTickToggle"),

  partsEditor: document.getElementById("partsEditor"),
  addPartBtn: document.getElementById("addPartBtn"),

  startSoundInput: document.getElementById("startSoundInput"),
  switchSoundInput: document.getElementById("switchSoundInput"),
  finishSoundInput: document.getElementById("finishSoundInput"),

  startTrimStartInput: document.getElementById("startTrimStartInput"),
  startTrimEndInput: document.getElementById("startTrimEndInput"),
  switchTrimStartInput: document.getElementById("switchTrimStartInput"),
  switchTrimEndInput: document.getElementById("switchTrimEndInput"),
  finishTrimStartInput: document.getElementById("finishTrimStartInput"),
  finishTrimEndInput: document.getElementById("finishTrimEndInput"),

  startTrimLabel: document.getElementById("startTrimLabel"),
  switchTrimLabel: document.getElementById("switchTrimLabel"),
  finishTrimLabel: document.getElementById("finishTrimLabel"),

  startWaveCanvas: document.getElementById("startWaveCanvas"),
  switchWaveCanvas: document.getElementById("switchWaveCanvas"),
  finishWaveCanvas: document.getElementById("finishWaveCanvas"),

  startTrimOverlay: document.getElementById("startTrimOverlay"),
  switchTrimOverlay: document.getElementById("switchTrimOverlay"),
  finishTrimOverlay: document.getElementById("finishTrimOverlay"),

  startTrimShadeLeft: document.getElementById("startTrimShadeLeft"),
  startTrimShadeRight: document.getElementById("startTrimShadeRight"),
  switchTrimShadeLeft: document.getElementById("switchTrimShadeLeft"),
  switchTrimShadeRight: document.getElementById("switchTrimShadeRight"),
  finishTrimShadeLeft: document.getElementById("finishTrimShadeLeft"),
  finishTrimShadeRight: document.getElementById("finishTrimShadeRight"),

  startTrimHandleStart: document.getElementById("startTrimHandleStart"),
  startTrimHandleEnd: document.getElementById("startTrimHandleEnd"),
  switchTrimHandleStart: document.getElementById("switchTrimHandleStart"),
  switchTrimHandleEnd: document.getElementById("switchTrimHandleEnd"),
  finishTrimHandleStart: document.getElementById("finishTrimHandleStart"),
  finishTrimHandleEnd: document.getElementById("finishTrimHandleEnd"),

  startPlayhead: document.getElementById("startPlayhead"),
  switchPlayhead: document.getElementById("switchPlayhead"),
  finishPlayhead: document.getElementById("finishPlayhead"),

  previewStartBtn: document.getElementById("previewStartBtn"),
  previewSwitchBtn: document.getElementById("previewSwitchBtn"),
  previewFinishBtn: document.getElementById("previewFinishBtn"),

  clearStartBtn: document.getElementById("clearStartBtn"),
  clearSwitchBtn: document.getElementById("clearSwitchBtn"),
  clearFinishBtn: document.getElementById("clearFinishBtn"),

  restoreStartBtn: document.getElementById("restoreStartBtn"),
  restoreSwitchBtn: document.getElementById("restoreSwitchBtn"),
  restoreFinishBtn: document.getElementById("restoreFinishBtn"),

  historyList: document.getElementById("historyList"),
  partEditorTemplate: document.getElementById("partEditorTemplate")
};

dom.timerRingProgress.style.strokeDasharray = `${RING_CIRCUMFERENCE}`;
dom.timerRingProgress.style.strokeDashoffset = `${RING_CIRCUMFERENCE}`;

let audioCtx = null;
let wakeLockSentinel = null;
let rafId = null;
let draftSettings = null;
let previewAudio = null;
let previewAnimationFrame = null;
let wheelCleanupFns = [];
let trimCleanupFns = [];

const defaultState = {
  theme: "dark",
  settings: {
    repeatCount: 3,
    vibrate: true,
    alertsEnabled: true,
    useBuiltInSounds: true,
    wheelTickEnabled: true,
    parts: [
      makePart("تمرین", 0, 45, "solid-coral"),
      makePart("استراحت", 0, 15, "grad-aurora")
    ],
    sounds: {
      start: emptySound(),
      switch: emptySound(),
      finish: emptySound()
    }
  },
  runtime: {
    running: false,
    completed: false,
    currentCycle: 1,
    currentPartIndex: 0,
    pausedElapsedMs: 0,
    partStartedAt: 0
  },
  history: []
};

const state = normalizeState(loadState() || defaultState);

bindEvents();
applyTheme(state.theme);
renderRuntime();
renderHistory();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

function makePart(name, minutes, seconds, colorId) {
  return {
    id: uid(),
    name,
    minutes,
    seconds,
    colorId
  };
}

function emptySound() {
  return {
    fileName: "",
    dataUrl: "",
    trimStart: 0,
    trimEnd: 0,
    duration: 0,
    peaks: []
  };
}

function uid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return String(Date.now() + Math.random());
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeState(raw) {
  const merged = structuredClone(defaultState);

  merged.theme = raw.theme === "light" ? "light" : "dark";

  if (raw.settings) {
    merged.settings.repeatCount = clampInt(raw.settings.repeatCount, 1, 999, 1);
    merged.settings.vibrate = !!raw.settings.vibrate;
    merged.settings.alertsEnabled = !!raw.settings.alertsEnabled;
    merged.settings.useBuiltInSounds = raw.settings.useBuiltInSounds !== false;
    merged.settings.wheelTickEnabled = raw.settings.wheelTickEnabled !== false;

    if (Array.isArray(raw.settings.parts) && raw.settings.parts.length) {
      merged.settings.parts = raw.settings.parts.map((part, index) => ({
        id: part.id || uid(),
        name: String(part.name || `پارت ${index + 1}`).slice(0, 24),
        minutes: clampInt(part.minutes, 0, 999, 0),
        seconds: clampInt(part.seconds, 0, 59, 0),
        colorId: getValidSwatchId(part.colorId || SWATCHES[index % SWATCHES.length].id)
      }));
    }

    if (raw.settings.sounds) {
      merged.settings.sounds.start = normalizeSound(raw.settings.sounds.start);
      merged.settings.sounds.switch = normalizeSound(raw.settings.sounds.switch);
      merged.settings.sounds.finish = normalizeSound(raw.settings.sounds.finish);
    }
  }

  if (raw.runtime) {
    merged.runtime.running = false;
    merged.runtime.completed = !!raw.runtime.completed;
    merged.runtime.currentCycle = clampInt(raw.runtime.currentCycle, 1, merged.settings.repeatCount, 1);
    merged.runtime.currentPartIndex = clampInt(raw.runtime.currentPartIndex, 0, 999, 0);
    merged.runtime.pausedElapsedMs = clampInt(raw.runtime.pausedElapsedMs, 0, 999999999, 0);
    merged.runtime.partStartedAt = 0;
  }

  if (Array.isArray(raw.history)) {
    merged.history = raw.history.slice(0, HISTORY_LIMIT);
  }

  return merged;
}

function normalizeSound(sound) {
  if (!sound) return emptySound();
  return {
    fileName: String(sound.fileName || ""),
    dataUrl: String(sound.dataUrl || ""),
    trimStart: safeNumber(sound.trimStart, 0),
    trimEnd: safeNumber(sound.trimEnd, 0),
    duration: safeNumber(sound.duration, 0),
    peaks: Array.isArray(sound.peaks) ? sound.peaks.slice(0, 240).map((n) => safeNumber(n, 0)) : []
  };
}

function safeNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clampInt(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function getValidSwatchId(id) {
  return SWATCHES.some((s) => s.id === id) ? id : SWATCHES[0].id;
}

function getSwatch(id) {
  return SWATCHES.find((s) => s.id === id) || SWATCHES[0];
}

function bindEvents() {
  dom.themeBtn.addEventListener("click", toggleTheme);

  dom.settingsBtn.addEventListener("click", openSettings);
  dom.closeSettingsBtn.addEventListener("click", closeSettings);
  dom.cancelSettingsBtn.addEventListener("click", closeSettings);
  dom.modalBackdrop.addEventListener("click", closeSettings);
  dom.applySettingsBtn.addEventListener("click", applyDraftSettings);

  dom.tabTimerBtn.addEventListener("click", () => setSettingsTab("timer"));
  dom.tabSoundBtn.addEventListener("click", () => setSettingsTab("sound"));
  dom.tabHistoryBtn.addEventListener("click", () => setSettingsTab("history"));

  dom.playPauseBtn.addEventListener("click", onPlayPause);
  dom.resetBtn.addEventListener("click", onReset);
  dom.nextBtn.addEventListener("click", onNext);

  dom.addPartBtn.addEventListener("click", addDraftPart);

  dom.previewStartBtn.addEventListener("click", () => previewDraftSound("start"));
  dom.previewSwitchBtn.addEventListener("click", () => previewDraftSound("switch"));
  dom.previewFinishBtn.addEventListener("click", () => previewDraftSound("finish"));

  dom.clearStartBtn.addEventListener("click", () => clearDraftSound("start"));
  dom.clearSwitchBtn.addEventListener("click", () => clearDraftSound("switch"));
  dom.clearFinishBtn.addEventListener("click", () => clearDraftSound("finish"));

  dom.restoreStartBtn.addEventListener("click", () => restoreBuiltInSound("start"));
  dom.restoreSwitchBtn.addEventListener("click", () => restoreBuiltInSound("switch"));
  dom.restoreFinishBtn.addEventListener("click", () => restoreBuiltInSound("finish"));

  dom.startSoundInput.addEventListener("change", (e) => onSoundFileSelected("start", e));
  dom.switchSoundInput.addEventListener("change", (e) => onSoundFileSelected("switch", e));
  dom.finishSoundInput.addEventListener("change", (e) => onSoundFileSelected("finish", e));

  document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "visible" && state.runtime.running) {
      await acquireWakeLock();
    }
  });

  window.addEventListener("beforeunload", () => {
    saveState();
  });
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  applyTheme(state.theme);
  saveState();
}

function applyTheme(theme) {
  dom.body.classList.toggle("theme-dark", theme === "dark");
  dom.body.classList.toggle("theme-light", theme === "light");
}

function setSettingsTab(tab) {
  const isTimer = tab === "timer";
  const isSound = tab === "sound";
  const isHistory = tab === "history";

  dom.tabTimerBtn.classList.toggle("active", isTimer);
  dom.tabSoundBtn.classList.toggle("active", isSound);
  dom.tabHistoryBtn.classList.toggle("active", isHistory);

  dom.timerTab.classList.toggle("active", isTimer);
  dom.soundTab.classList.toggle("active", isSound);
  dom.historyTab.classList.toggle("active", isHistory);
}

function openSettings() {
  draftSettings = structuredClone(state.settings);
  renderDraftSettings();
  renderHistory();
  setSettingsTab("timer");
  dom.settingsModal.classList.remove("hidden");
  dom.settingsModal.setAttribute("aria-hidden", "false");
}

function closeSettings() {
  stopPreviewAudio();
  cleanupWheels();
  cleanupTrimBindings();
  draftSettings = null;
  dom.settingsModal.classList.add("hidden");
  dom.settingsModal.setAttribute("aria-hidden", "true");
}

function renderDraftSettings() {
  cleanupWheels();
  cleanupTrimBindings();

  dom.repeatCountInput.value = String(draftSettings.repeatCount);
  dom.vibrateToggle.checked = draftSettings.vibrate;
  dom.alertsToggle.checked = draftSettings.alertsEnabled;
  dom.builtInSoundsToggle.checked = draftSettings.useBuiltInSounds;
  dom.wheelTickToggle.checked = draftSettings.wheelTickEnabled;

  dom.repeatCountInput.oninput = (e) => {
    draftSettings.repeatCount = clampInt(e.target.value, 1, 999, 1);
  };

  dom.vibrateToggle.onchange = (e) => {
    draftSettings.vibrate = e.target.checked;
  };

  dom.alertsToggle.onchange = (e) => {
    draftSettings.alertsEnabled = e.target.checked;
  };

  dom.builtInSoundsToggle.onchange = (e) => {
    draftSettings.useBuiltInSounds = e.target.checked;
  };

  dom.wheelTickToggle.onchange = (e) => {
    draftSettings.wheelTickEnabled = e.target.checked;
  };

  renderPartsEditor();
  prepareSoundEditor("start");
  prepareSoundEditor("switch");
  prepareSoundEditor("finish");
}

function renderPartsEditor() {
  dom.partsEditor.innerHTML = "";

  draftSettings.parts.forEach((part, index) => {
    const fragment = dom.partEditorTemplate.content.cloneNode(true);

    const badge = fragment.querySelector(".mini-badge");
    const deleteBtn = fragment.querySelector(".delete-part-btn");
    const nameInput = fragment.querySelector(".js-name");
    const minutesWheel = fragment.querySelector(".js-minutes-wheel");
    const secondsWheel = fragment.querySelector(".js-seconds-wheel");
    const swatchesRoot = fragment.querySelector(".js-swatches");

    badge.textContent = `پارت ${index + 1}`;
    nameInput.value = part.name;

    nameInput.addEventListener("input", (e) => {
      part.name = e.target.value.slice(0, 24);
    });

    buildWheel(minutesWheel, 0, 120, part.minutes, (value) => {
      part.minutes = value;
    });

    buildWheel(secondsWheel, 0, 59, part.seconds, (value) => {
      part.seconds = value;
    });

    SWATCHES.forEach((swatch) => {
      const sw = document.createElement("button");
      sw.type = "button";
      sw.className = "swatch-btn";
      sw.style.setProperty("--sw", swatch.preview);

      if (part.colorId === swatch.id) {
        sw.classList.add("selected");
      }

      sw.addEventListener("click", () => {
        part.colorId = swatch.id;
        swatchesRoot.querySelectorAll(".swatch-btn").forEach((btn) => btn.classList.remove("selected"));
        sw.classList.add("selected");
      });

      swatchesRoot.appendChild(sw);
    });

    deleteBtn.addEventListener("click", () => {
      if (draftSettings.parts.length === 1) {
        alert("حداقل یک پارت باید وجود داشته باشد.");
        return;
      }
      draftSettings.parts.splice(index, 1);
      renderPartsEditor();
    });

    dom.partsEditor.appendChild(fragment);
  });
}

function cleanupWheels() {
  wheelCleanupFns.forEach((fn) => fn());
  wheelCleanupFns = [];
}

function cleanupTrimBindings() {
  trimCleanupFns.forEach((fn) => fn());
  trimCleanupFns = [];
}

function buildWheel(root, min, max, selectedValue, onChange) {
  root.innerHTML = "";

  for (let i = min; i <= max; i += 1) {
    const item = document.createElement("div");
    item.className = "wheel-item";
    item.dataset.value = String(i);
    item.textContent = String(i).padStart(2, "0");
    root.appendChild(item);
  }

  const itemHeight = 34;
  let snapTimer = null;
  let lastValue = selectedValue;
  let allowTickAfter = performance.now() + 250;

  function updateClasses(current) {
    root.querySelectorAll(".wheel-item").forEach((el) => {
      const value = Number(el.dataset.value);
      el.classList.remove("active", "near");
      if (value === current) el.classList.add("active");
      if (Math.abs(value - current) === 1) el.classList.add("near");
    });
  }

  function currentValue() {
    return clampInt(Math.round(root.scrollTop / itemHeight) + min, min, max, min);
  }

  function setValue(value, behavior = "auto") {
    const clamped = clampInt(value, min, max, min);
    root.scrollTo({ top: (clamped - min) * itemHeight, behavior });
    updateClasses(clamped);
  }

  function onScroll() {
    const value = currentValue();
    onChange(value);
    updateClasses(value);

    if (value !== lastValue && performance.now() > allowTickAfter) {
      lastValue = value;
      playWheelTick();
    }

    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => {
      setValue(currentValue(), "smooth");
    }, 110);
  }

  root.addEventListener("scroll", onScroll, { passive: true });
  setValue(selectedValue, "auto");

  wheelCleanupFns.push(() => {
    clearTimeout(snapTimer);
    root.removeEventListener("scroll", onScroll);
  });
}

function addDraftPart() {
  draftSettings.parts.push(
    makePart(`پارت ${draftSettings.parts.length + 1}`, 0, 30, SWATCHES[draftSettings.parts.length % SWATCHES.length].id)
  );
  renderPartsEditor();
}

function getVisibleParts(settingsObj = state.settings) {
  return settingsObj.parts.filter((part) => getPartDurationMs(part) > 0);
}

function getCurrentVisiblePart() {
  const parts = getVisibleParts();
  if (!parts.length) return null;
  if (state.runtime.currentPartIndex >= parts.length) {
    state.runtime.currentPartIndex = parts.length - 1;
  }
  return parts[state.runtime.currentPartIndex] || null;
}

function getPartDurationMs(part) {
  return (clampInt(part.minutes, 0, 999, 0) * 60 + clampInt(part.seconds, 0, 59, 0)) * 1000;
}

function renderRuntime(progressOverride = null, remainingOverride = null) {
  const parts = getVisibleParts();
  const part = getCurrentVisiblePart();

  if (!part || !parts.length) {
    dom.cycleBadge.textContent = "چرخه 0 از 0";
    dom.partTitle.textContent = "پارت فعالی وجود ندارد";
    dom.partMeta.textContent = "پارت 0 / 0";
    dom.remainingLabel.textContent = "00:00.0";
    dom.elapsedLabel.textContent = "گذشته: 00:00.0";
    applySwatch(SWATCHES[0]);
    setRingProgress(0);
    dom.timelineBar.innerHTML = "";
    syncPlayPauseIcon();
    return;
  }

  const duration = getPartDurationMs(part);
  const elapsed = progressOverride === null
    ? state.runtime.pausedElapsedMs
    : Math.max(0, duration - remainingOverride);

  const remaining = remainingOverride === null
    ? Math.max(0, duration - state.runtime.pausedElapsedMs)
    : remainingOverride;

  const progress = progressOverride === null
    ? (duration > 0 ? Math.min(1, state.runtime.pausedElapsedMs / duration) : 0)
    : progressOverride;

  dom.cycleBadge.textContent = `چرخه ${state.runtime.currentCycle} از ${state.settings.repeatCount}`;
  dom.partTitle.textContent = part.name;
  dom.partMeta.textContent = `پارت ${state.runtime.currentPartIndex + 1} / ${parts.length}`;
  dom.remainingLabel.textContent = formatTime(remaining);
  dom.elapsedLabel.textContent = `گذشته: ${formatTime(elapsed)}`;

  applySwatch(getSwatch(part.colorId));
  setRingProgress(progress);
  renderTimeline(parts);
  syncPlayPauseIcon();
}

function renderTimeline(parts) {
  dom.timelineBar.innerHTML = "";

  parts.forEach((part, index) => {
    const seg = document.createElement("div");
    const swatch = getSwatch(part.colorId);
    seg.className = "timeline-seg";
    if (index === state.runtime.currentPartIndex) seg.classList.add("active");
    seg.style.setProperty("--seg", swatch.primary);
    seg.style.setProperty("--flex", Math.max(1, Math.round(getPartDurationMs(part) / 1000)));
    dom.timelineBar.appendChild(seg);
  });
}

function applySwatch(swatch) {
  document.documentElement.style.setProperty("--ring-color", swatch.primary);
  document.documentElement.style.setProperty("--ring-color-2", swatch.secondary);
  document.documentElement.style.setProperty("--accent", swatch.primary);
  document.documentElement.style.setProperty("--accent-2", swatch.secondary);

  dom.ringStop1.setAttribute("stop-color", swatch.primary);
  dom.ringStop2.setAttribute("stop-color", swatch.secondary);
  dom.ambientBg.style.background = `radial-gradient(circle, ${hexToRgba(swatch.primary, 0.30)}, transparent 70%)`;
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const int = parseInt(clean, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function setRingProgress(progress) {
  const safe = Math.max(0, Math.min(1, progress));
  dom.timerRingProgress.style.strokeDashoffset = `${RING_CIRCUMFERENCE * (1 - safe)}`;
}

function formatTime(ms) {
  const safe = Math.max(0, Math.floor(ms));
  const minutes = Math.floor(safe / 60000);
  const seconds = Math.floor((safe % 60000) / 1000);
  const tenths = Math.floor((safe % 1000) / 100);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
}

async function onPlayPause() {
  if (state.runtime.running) {
    pauseTimer();
    return;
  }

  if (!getVisibleParts().length) {
    alert("همه پارت‌ها زمان صفر دارند. حداقل یک پارت با زمان بیشتر از صفر لازم است.");
    return;
  }

  if (state.runtime.completed) {
    state.runtime.completed = false;
    state.runtime.currentCycle = 1;
    state.runtime.currentPartIndex = 0;
    state.runtime.pausedElapsedMs = 0;
    state.runtime.partStartedAt = 0;
  }

  await startTimer();
}

async function startTimer() {
  const part = getCurrentVisiblePart();
  if (!part) return;

  const duration = getPartDurationMs(part);
  if (duration <= 0) return;

  registerHistoryRunIfNeeded();

  state.runtime.running = true;
  state.runtime.completed = false;
  state.runtime.partStartedAt = performance.now() - state.runtime.pausedElapsedMs;

  await acquireWakeLock();
  void playNamedSound("start");
  maybeVibrate([60]);

  tick();
  saveState();
  syncPlayPauseIcon();
}

function pauseTimer() {
  if (!state.runtime.running) return;

  state.runtime.running = false;
  cancelAnimationFrame(rafId);
  rafId = null;

  state.runtime.pausedElapsedMs = Math.max(0, performance.now() - state.runtime.partStartedAt);

  releaseWakeLock();
  saveState();
  renderRuntime();
}

function onReset() {
  state.runtime.running = false;
  state.runtime.completed = false;
  state.runtime.currentCycle = 1;
  state.runtime.currentPartIndex = 0;
  state.runtime.pausedElapsedMs = 0;
  state.runtime.partStartedAt = 0;

  cancelAnimationFrame(rafId);
  rafId = null;

  releaseWakeLock();
  saveState();
  renderRuntime();
}

async function onNext() {
  await moveToNextPart(false);
}

function tick() {
  if (!state.runtime.running) return;

  const part = getCurrentVisiblePart();
  if (!part) {
    onReset();
    return;
  }

  const duration = getPartDurationMs(part);
  const elapsed = Math.max(0, performance.now() - state.runtime.partStartedAt);
  state.runtime.pausedElapsedMs = elapsed;

  const clamped = Math.min(elapsed, duration);
  const remaining = Math.max(0, duration - clamped);
  const progress = duration > 0 ? clamped / duration : 0;

  renderRuntime(progress, remaining);

  if (clamped >= duration) {
    void moveToNextPart(true);
    return;
  }

  rafId = requestAnimationFrame(tick);
}

async function moveToNextPart(fromAuto) {
  const visibleParts = getVisibleParts();
  const wasRunning = state.runtime.running;

  cancelAnimationFrame(rafId);
  rafId = null;

  triggerEnergyPulse(false);

  state.runtime.currentPartIndex += 1;
  state.runtime.pausedElapsedMs = 0;
  state.runtime.partStartedAt = 0;

  if (state.runtime.currentPartIndex >= visibleParts.length) {
    if (state.runtime.currentCycle < state.settings.repeatCount) {
      state.runtime.currentCycle += 1;
      state.runtime.currentPartIndex = 0;
    } else {
      state.runtime.running = false;
      state.runtime.completed = true;
      void playNamedSound("finish");
      maybeVibrate([160, 70, 160]);
      triggerEnergyPulse(true);
      releaseWakeLock();
      saveState();
      renderRuntime();
      syncPlayPauseIcon();
      return;
    }
  }

  void playNamedSound("switch");
  maybeVibrate([60, 40, 70]);

  if (wasRunning || fromAuto) {
    state.runtime.running = true;
    state.runtime.completed = false;
    state.runtime.partStartedAt = performance.now();
    renderRuntime();
    tick();
  } else {
    state.runtime.running = false;
    renderRuntime();
  }

  saveState();
}

function triggerEnergyPulse(isFinish) {
  if (dom.screenPulse) {
    dom.screenPulse.classList.remove("is-animating");
    void dom.screenPulse.offsetWidth;
    dom.screenPulse.classList.add("is-animating");
  }

  if (dom.ringBurst) {
    dom.ringBurst.classList.remove("is-animating");
    void dom.ringBurst.offsetWidth;
    dom.ringBurst.classList.add("is-animating");
  }

  if (isFinish && dom.playPauseBtn) {
    dom.playPauseBtn.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.08)" },
        { transform: "scale(0.98)" },
        { transform: "scale(1)" }
      ],
      { duration: 520, easing: "cubic-bezier(.16,.84,.18,1)" }
    );
  }
}

function syncPlayPauseIcon() {
  if (state.runtime.running) {
    dom.playPauseIcon.innerHTML = `<path d="M7 5h4v14H7V5Zm6 0h4v14h-4V5Z"/>`;
  } else {
    dom.playPauseIcon.innerHTML = `<path d="M8 5.5v13l10-6.5-10-6.5Z"/>`;
  }
}

function maybeVibrate(pattern) {
  if (!state.settings.vibrate) return;
  if ("vibrate" in navigator) navigator.vibrate(pattern);
}

async function acquireWakeLock() {
  try {
    if (!("wakeLock" in navigator)) return;
    if (wakeLockSentinel) return;
    wakeLockSentinel = await navigator.wakeLock.request("screen");
    wakeLockSentinel.addEventListener("release", () => {
      wakeLockSentinel = null;
    });
  } catch {}
}

async function releaseWakeLock() {
  try {
    if (!wakeLockSentinel) return;
    await wakeLockSentinel.release();
    wakeLockSentinel = null;
  } catch {}
}

function getAudioContext() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) audioCtx = new Ctx();
  }
  return audioCtx;
}

async function ensureAudioContext() {
  const ctx = getAudioContext();
  if (!ctx) return null;
  if (ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch {}
  }
  return ctx;
}

async function playBuiltInTone(kind) {
  const ctx = await ensureAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.value = kind === "tick" ? 0.03 : 0.05;
  master.connect(ctx.destination);

  const recipes = {
    start: [
      { f: 740, t: 0.00, d: 0.06 },
      { f: 988, t: 0.08, d: 0.09 }
    ],
    switch: [
      { f: 980, t: 0.00, d: 0.03 },
      { f: 760, t: 0.09, d: 0.03 },
      { f: 980, t: 0.18, d: 0.03 }
    ],
    finish: [
      { f: 660, t: 0.00, d: 0.08 },
      { f: 880, t: 0.11, d: 0.08 },
      { f: 1174, t: 0.23, d: 0.14 }
    ],
    tick: [
      { f: 1600, t: 0.00, d: 0.010 }
    ]
  };

  recipes[kind].forEach((tone) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = kind === "tick" ? "triangle" : "sine";
    osc.frequency.setValueAtTime(tone.f, now + tone.t);

    const peak = kind === "tick" ? 0.12 : 0.20;
    gain.gain.setValueAtTime(0.0001, now + tone.t);
    gain.gain.exponentialRampToValueAtTime(peak, now + tone.t + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.t + tone.d);

    osc.connect(gain);
    gain.connect(master);

    osc.start(now + tone.t);
    osc.stop(now + tone.t + tone.d + 0.02);
  });
}

function playWheelTick() {
  if (!draftSettings?.wheelTickEnabled) return;
  if (!draftSettings?.alertsEnabled) return;
  void playBuiltInTone("tick");
}

function playNamedSound(kind) {
  if (!state.settings.alertsEnabled) return;

  const sound = state.settings.sounds[kind];

  if (sound?.dataUrl) {
    void playAudioSegment(kind, sound.dataUrl, sound.trimStart, sound.trimEnd, false);
    return;
  }

  if (state.settings.useBuiltInSounds) {
    void playBuiltInTone(kind);
  }
}

async function onSoundFileSelected(kind, event) {
  const file = event.target.files?.[0];
  if (!file || !draftSettings) return;

  const name = file.name.toLowerCase();
  const mime = (file.type || "").toLowerCase();
  const looksAudio =
    mime.startsWith("audio/") ||
    name.endsWith(".mp3") ||
    name.endsWith(".wav") ||
    name.endsWith(".m4a") ||
    name.endsWith(".aac") ||
    name.endsWith(".ogg");

  if (!looksAudio) {
    alert("فایل انتخابی صوتی معتبر نیست.");
    event.target.value = "";
    return;
  }

  try {
    const dataUrl = await fileToDataUrl(file);
    const analysis = await analyseAudioDataUrl(dataUrl);

    draftSettings.sounds[kind] = {
      fileName: file.name,
      dataUrl,
      trimStart: 0,
      trimEnd: analysis.duration,
      duration: analysis.duration,
      peaks: analysis.peaks
    };

    prepareSoundEditor(kind);
  } catch {
    alert("خواندن یا تحلیل فایل صوتی انجام نشد.");
  } finally {
    event.target.value = "";
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function analyseAudioDataUrl(dataUrl) {
  const ctx = await ensureAudioContext();
  const response = await fetch(dataUrl);
  const buffer = await response.arrayBuffer();
  const decoded = await ctx.decodeAudioData(buffer.slice(0));

  const data = decoded.getChannelData(0);
  const samples = 180;
  const blockSize = Math.max(1, Math.floor(data.length / samples));
  const peaks = [];

  for (let i = 0; i < samples; i += 1) {
    let max = 0;
    const start = i * blockSize;
    const end = Math.min(data.length, start + blockSize);
    for (let j = start; j < end; j += 1) {
      const v = Math.abs(data[j]);
      if (v > max) max = v;
    }
    peaks.push(max);
  }

  return {
    duration: decoded.duration,
    peaks
  };
}

function prepareSoundEditor(kind) {
  const refs = getSoundRefs(kind);
  const sound = draftSettings.sounds[kind];
  const duration = sound.duration || 0;

  refs.start.max = String(duration || 100);
  refs.end.max = String(duration || 100);

  refs.start.value = String(sound.trimStart || 0);
  refs.end.value = String(sound.trimEnd || duration || 100);

  refs.start.oninput = () => {
    let start = safeNumber(refs.start.value, 0);
    let end = safeNumber(refs.end.value, 0);

    if (start > end) {
      end = start;
      refs.end.value = String(end);
    }

    sound.trimStart = start;
    sound.trimEnd = end;
    updateSoundEditor(kind);
  };

  refs.end.oninput = () => {
    let start = safeNumber(refs.start.value, 0);
    let end = safeNumber(refs.end.value, 0);

    if (end < start) {
      start = end;
      refs.start.value = String(start);
    }

    sound.trimStart = start;
    sound.trimEnd = end;
    updateSoundEditor(kind);
  };

  bindTrimHandles(kind);
  updateSoundEditor(kind);
}

function getSoundRefs(kind) {
  if (kind === "start") {
    return {
      canvas: dom.startWaveCanvas,
      label: dom.startTrimLabel,
      start: dom.startTrimStartInput,
      end: dom.startTrimEndInput,
      overlay: dom.startTrimOverlay,
      shadeLeft: dom.startTrimShadeLeft,
      shadeRight: dom.startTrimShadeRight,
      handleStart: dom.startTrimHandleStart,
      handleEnd: dom.startTrimHandleEnd,
      playhead: dom.startPlayhead
    };
  }
  if (kind === "switch") {
    return {
      canvas: dom.switchWaveCanvas,
      label: dom.switchTrimLabel,
      start: dom.switchTrimStartInput,
      end: dom.switchTrimEndInput,
      overlay: dom.switchTrimOverlay,
      shadeLeft: dom.switchTrimShadeLeft,
      shadeRight: dom.switchTrimShadeRight,
      handleStart: dom.switchTrimHandleStart,
      handleEnd: dom.switchTrimHandleEnd,
      playhead: dom.switchPlayhead
    };
  }
  return {
    canvas: dom.finishWaveCanvas,
    label: dom.finishTrimLabel,
    start: dom.finishTrimStartInput,
    end: dom.finishTrimEndInput,
    overlay: dom.finishTrimOverlay,
    shadeLeft: dom.finishTrimShadeLeft,
    shadeRight: dom.finishTrimShadeRight,
    handleStart: dom.finishTrimHandleStart,
    handleEnd: dom.finishTrimHandleEnd,
    playhead: dom.finishPlayhead
  };
}

function bindTrimHandles(kind) {
  const refs = getSoundRefs(kind);
  const sound = draftSettings.sounds[kind];
  const overlay = refs.overlay;

  const startDrag = (which, event) => {
    if (!sound.duration) return;

    event.preventDefault();

    const move = (clientX) => {
      const rect = overlay.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const seconds = ratio * sound.duration;

      if (which === "start") {
        sound.trimStart = Math.min(seconds, sound.trimEnd);
        refs.start.value = String(sound.trimStart);
      } else {
        sound.trimEnd = Math.max(seconds, sound.trimStart);
        refs.end.value = String(sound.trimEnd);
      }

      updateSoundEditor(kind);
    };

    const onPointerMove = (e) => move(e.clientX);
    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    move(event.clientX);

    trimCleanupFns.push(() => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    });
  };

  const onStartDown = (e) => startDrag("start", e);
  const onEndDown = (e) => startDrag("end", e);

  refs.handleStart.addEventListener("pointerdown", onStartDown);
  refs.handleEnd.addEventListener("pointerdown", onEndDown);

  trimCleanupFns.push(() => {
    refs.handleStart.removeEventListener("pointerdown", onStartDown);
    refs.handleEnd.removeEventListener("pointerdown", onEndDown);
  });
}

function updateSoundEditor(kind) {
  const refs = getSoundRefs(kind);
  const sound = draftSettings.sounds[kind];

  refs.label.textContent = `${Number(sound.trimStart || 0).toFixed(1)}s — ${Number(sound.trimEnd || 0).toFixed(1)}s`;

  drawWaveform(refs.canvas, sound, null);
  updateTrimOverlay(kind, null);
}

function updateTrimOverlay(kind, playheadTime = null) {
  const refs = getSoundRefs(kind);
  const sound = draftSettings.sounds[kind];
  const duration = sound.duration || 0;

  if (!duration) {
    refs.shadeLeft.style.width = "0%";
    refs.shadeRight.style.width = "0%";
    refs.handleStart.style.left = "0%";
    refs.handleEnd.style.left = "100%";
    refs.playhead.classList.add("hidden");
    return;
  }

  const startPct = Math.max(0, Math.min(100, (sound.trimStart / duration) * 100));
  const endPct = Math.max(0, Math.min(100, (sound.trimEnd / duration) * 100));

  refs.shadeLeft.style.width = `${startPct}%`;
  refs.shadeRight.style.width = `${100 - endPct}%`;
  refs.handleStart.style.left = `${startPct}%`;
  refs.handleEnd.style.left = `${endPct}%`;

  if (playheadTime === null) {
    refs.playhead.classList.add("hidden");
  } else {
    const playPct = Math.max(0, Math.min(100, (playheadTime / duration) * 100));
    refs.playhead.classList.remove("hidden");
    refs.playhead.style.left = `${playPct}%`;
  }
}

function drawWaveform(canvas, sound) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fillRect(0, 0, width, height);

  const duration = sound.duration || 0;
  const peaks = sound.peaks || [];

  if (!duration || !peaks.length) {
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    return;
  }

  const startX = (sound.trimStart / duration) * width;
  const endX = (sound.trimEnd / duration) * width;
  const barWidth = width / peaks.length;
  const mid = height / 2;

  ctx.fillStyle = "rgba(255,255,255,0.74)";
  peaks.forEach((peak, i) => {
    const x = i * barWidth;
    const h = Math.max(2, peak * (height * 0.82));
    ctx.fillRect(x, mid - h / 2, Math.max(1, barWidth - 1), h);
  });

  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fillRect(startX - 1, 0, 2, height);
  ctx.fillRect(endX - 1, 0, 2, height);
}

function clearDraftSound(kind) {
  if (!draftSettings) return;
  draftSettings.sounds[kind] = emptySound();
  prepareSoundEditor(kind);
}

function restoreBuiltInSound(kind) {
  if (!draftSettings) return;
  draftSettings.sounds[kind] = emptySound();
  draftSettings.useBuiltInSounds = true;
  renderDraftSettings();
}

async function previewDraftSound(kind) {
  if (!draftSettings) return;

  const sound = draftSettings.sounds[kind];
  await ensureAudioContext();

  if (sound.dataUrl) {
    const ok = await playAudioSegment(kind, sound.dataUrl, sound.trimStart, sound.trimEnd, true);
    if (!ok) alert("پیش‌نمایش فایل صوتی انجام نشد.");
    return;
  }

  if (draftSettings.useBuiltInSounds) {
    await playBuiltInTone(kind);
    return;
  }

  alert("برای این بخش هنوز صدایی انتخاب نشده.");
}

function stopPreviewAudio() {
  if (previewAudio) {
    try {
      previewAudio.pause();
      previewAudio.currentTime = 0;
    } catch {}
    previewAudio = null;
  }

  if (previewAnimationFrame) {
    cancelAnimationFrame(previewAnimationFrame);
    previewAnimationFrame = null;
  }

  ["start", "switch", "finish"].forEach((kind) => {
    if (draftSettings) updateTrimOverlay(kind, null);
  });
}

async function playAudioSegment(kind, dataUrl, trimStart = 0, trimEnd = 0, previewMode = true) {
  if (!dataUrl) return false;

  if (previewMode) stopPreviewAudio();

  return new Promise((resolve) => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.src = dataUrl;

    let settled = false;
    let stopAt = 0;

    const finish = (ok) => {
      if (settled) return;
      settled = true;

      if (previewMode && draftSettings) {
        updateTrimOverlay(kind, null);
      }

      resolve(ok);
    };

    audio.addEventListener("loadedmetadata", async () => {
      const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
      const start = Math.max(0, Number(trimStart) || 0);
      const end = Number(trimEnd) > start ? Math.min(Number(trimEnd), duration || Number(trimEnd)) : duration;

      stopAt = end;

      try {
        audio.currentTime = start;
      } catch {}

      const onTimeUpdate = () => {
        if (previewMode && draftSettings) {
          updateTrimOverlay(kind, audio.currentTime);
        }

        if (stopAt > start && audio.currentTime >= stopAt) {
          audio.pause();
          audio.removeEventListener("timeupdate", onTimeUpdate);
          finish(true);
        }
      };

      audio.addEventListener("timeupdate", onTimeUpdate);

      try {
        if (previewMode) {
          previewAudio = audio;
          previewAnimationFrame = requestAnimationFrame(function animate() {
            if (previewAudio && !previewAudio.paused && draftSettings) {
              updateTrimOverlay(kind, previewAudio.currentTime);
              previewAnimationFrame = requestAnimationFrame(animate);
            }
          });
        }

        await audio.play();
      } catch {
        finish(false);
      }
    }, { once: true });

    audio.addEventListener("ended", () => finish(true), { once: true });
    audio.addEventListener("error", () => finish(false), { once: true });
  });
}

function applyDraftSettings() {
  if (!draftSettings) return;

  const previousVisibleParts = getVisibleParts(state.settings);
  const previousPart = previousVisibleParts[state.runtime.currentPartIndex] || null;
  const previousPartId = previousPart?.id || null;
  const previousProgress = previousPart
    ? Math.min(1, state.runtime.pausedElapsedMs / Math.max(1, getPartDurationMs(previousPart)))
    : 0;

  draftSettings.repeatCount = clampInt(draftSettings.repeatCount, 1, 999, 1);
  draftSettings.parts = draftSettings.parts.map((part, index) => ({
    id: part.id || uid(),
    name: String(part.name || `پارت ${index + 1}`).slice(0, 24),
    minutes: clampInt(part.minutes, 0, 999, 0),
    seconds: clampInt(part.seconds, 0, 59, 0),
    colorId: getValidSwatchId(part.colorId || SWATCHES[index % SWATCHES.length].id)
  }));

  state.settings = structuredClone(draftSettings);

  const newVisibleParts = getVisibleParts(state.settings);
  const samePartIndex = previousPartId ? newVisibleParts.findIndex((p) => p.id === previousPartId) : -1;

  if (samePartIndex >= 0) {
    state.runtime.currentPartIndex = samePartIndex;
  } else if (state.runtime.currentPartIndex >= newVisibleParts.length) {
    state.runtime.currentPartIndex = Math.max(0, newVisibleParts.length - 1);
  }

  if (state.runtime.currentCycle > state.settings.repeatCount) {
    state.runtime.currentCycle = state.settings.repeatCount;
  }

  const currentPart = getCurrentVisiblePart();

  if (currentPart && samePartIndex >= 0) {
    const newDuration = getPartDurationMs(currentPart);
    state.runtime.pausedElapsedMs = Math.round(newDuration * previousProgress);

    if (state.runtime.running) {
      state.runtime.partStartedAt = performance.now() - state.runtime.pausedElapsedMs;
    }
  } else if (!currentPart) {
    state.runtime.running = false;
    state.runtime.completed = false;
    state.runtime.currentCycle = 1;
    state.runtime.currentPartIndex = 0;
    state.runtime.pausedElapsedMs = 0;
    state.runtime.partStartedAt = 0;
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  saveState();
  renderRuntime();
  if (state.runtime.running) tick();
  closeSettings();
}

function renderHistory() {
  dom.historyList.innerHTML = "";

  if (!state.history.length) {
    const empty = document.createElement("div");
    empty.className = "history-item";
    empty.textContent = "هنوز تاریخچه‌ای ثبت نشده.";
    dom.historyList.appendChild(empty);
    return;
  }

  state.history.forEach((entry) => {
    const item = document.createElement("div");
    item.className = "history-item";

    const title = document.createElement("div");
    title.textContent = `${new Date(entry.updatedAt || entry.createdAt).toLocaleString("fa-IR")} • اجرا: ${entry.runs || 1}`;

    const details = document.createElement("div");
    details.style.color = "var(--muted)";
    details.style.fontSize = "12px";
    details.textContent = entry.settings.parts
      .filter((part) => getPartDurationMs(part) > 0)
      .map((part) => `${part.name} (${String(part.minutes).padStart(2, "0")}:${String(part.seconds).padStart(2, "0")})`)
      .join(" • ");

    const btn = document.createElement("button");
    btn.className = "wide-btn";
    btn.type = "button";
    btn.textContent = "اجرای دوباره";
    btn.style.marginTop = "8px";

    btn.addEventListener("click", () => {
      state.settings = normalizeState({ ...state, settings: entry.settings }).settings;
      state.runtime.running = false;
      state.runtime.completed = false;
      state.runtime.currentCycle = 1;
      state.runtime.currentPartIndex = 0;
      state.runtime.pausedElapsedMs = 0;
      state.runtime.partStartedAt = 0;
      saveState();
      renderRuntime();
      closeSettings();
    });

    item.appendChild(title);
    item.appendChild(details);
    item.appendChild(btn);
    dom.historyList.appendChild(item);
  });
}

function registerHistoryRunIfNeeded() {
  const signature = getSettingsSignature(state.settings);

  if (state.history[0] && state.history[0].signature === signature) {
    state.history[0].runs = (state.history[0].runs || 1) + 1;
    state.history[0].updatedAt = Date.now();
  } else {
    state.history.unshift({
      id: uid(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      runs: 1,
      signature,
      settings: structuredClone(state.settings)
    });
    state.history = state.history.slice(0, HISTORY_LIMIT);
  }

  saveState();
  renderHistory();
}

function getSettingsSignature(settingsObj) {
  return JSON.stringify({
    repeatCount: settingsObj.repeatCount,
    vibrate: settingsObj.vibrate,
    alertsEnabled: settingsObj.alertsEnabled,
    useBuiltInSounds: settingsObj.useBuiltInSounds,
    wheelTickEnabled: settingsObj.wheelTickEnabled,
    parts: settingsObj.parts.map((p) => ({
      name: p.name,
      minutes: p.minutes,
      seconds: p.seconds,
      colorId: p.colorId
    })),
    sounds: {
      start: {
        fileName: settingsObj.sounds.start.fileName,
        trimStart: settingsObj.sounds.start.trimStart,
        trimEnd: settingsObj.sounds.start.trimEnd
      },
      switch: {
        fileName: settingsObj.sounds.switch.fileName,
        trimStart: settingsObj.sounds.switch.trimStart,
        trimEnd: settingsObj.sounds.switch.trimEnd
      },
      finish: {
        fileName: settingsObj.sounds.finish.fileName,
        trimStart: settingsObj.sounds.finish.trimStart,
        trimEnd: settingsObj.sounds.finish.trimEnd
      }
    }
  });
}