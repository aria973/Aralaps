const SWATCHES = [
  "#7C5CFF",
  "#5B8CFF",
  "#25D0FF",
  "#19C37D",
  "#7ED957",
  "#FFD166",
  "#FFB347",
  "#FF7A59",
  "#FF5C7A",
  "#E85DFF",
  "#A78BFA",
  "#94A3B8"
];

const STORAGE_KEY = "aralaps_state_v2";

const dom = {
  body: document.body,
  settingsBtn: document.getElementById("settingsBtn"),
  themeBtn: document.getElementById("themeBtn"),
  resetBtn: document.getElementById("resetBtn"),
  playPauseBtn: document.getElementById("playPauseBtn"),
  playPauseIcon: document.getElementById("playPauseIcon"),
  nextBtn: document.getElementById("nextBtn"),

  cycleCounter: document.getElementById("cycleCounter"),
  partName: document.getElementById("partName"),
  partIndex: document.getElementById("partIndex"),
  remainingTime: document.getElementById("remainingTime"),
  elapsedTime: document.getElementById("elapsedTime"),
  timeline: document.getElementById("timeline"),
  ringProgress: document.getElementById("ringProgress"),
  gradStop1: document.getElementById("gradStop1"),
  gradStop2: document.getElementById("gradStop2"),

  settingsModal: document.getElementById("settingsModal"),
  modalBackdrop: document.getElementById("modalBackdrop"),
  closeSettingsBtn: document.getElementById("closeSettingsBtn"),
  cancelSettingsBtn: document.getElementById("cancelSettingsBtn"),
  applySettingsBtn: document.getElementById("applySettingsBtn"),

  repeatCountInput: document.getElementById("repeatCountInput"),
  vibrateToggle: document.getElementById("vibrateToggle"),
  alertsToggle: document.getElementById("alertsToggle"),
  startSoundInput: document.getElementById("startSoundInput"),
  switchSoundInput: document.getElementById("switchSoundInput"),
  finishSoundInput: document.getElementById("finishSoundInput"),
  addPartBtn: document.getElementById("addPartBtn"),
  partsEditor: document.getElementById("partsEditor"),
  partEditorTemplate: document.getElementById("partEditorTemplate")
};

const ringRadius = 124;
const ringCircumference = 2 * Math.PI * ringRadius;
dom.ringProgress.style.strokeDasharray = `${ringCircumference}`;
dom.ringProgress.style.strokeDashoffset = `${ringCircumference}`;

let wakeLockSentinel = null;
let rafId = null;
let draftSettings = null;

const defaultState = {
  theme: "dark",
  settings: {
    repeatCount: 3,
    vibrate: true,
    alertsEnabled: true,
    parts: [
      createPart("تمرین", 0, 45, SWATCHES[7]),
      createPart("استراحت", 0, 15, SWATCHES[2])
    ],
    sounds: {
      startName: "",
      startDataUrl: "",
      switchName: "",
      switchDataUrl: "",
      finishName: "",
      finishDataUrl: ""
    }
  },
  runtime: {
    running: false,
    currentCycle: 1,
    currentPartIndex: 0,
    partStartTime: 0,
    pausedElapsedMs: 0
  }
};

const state = normalizeState(loadState() || structuredCloneSafe(defaultState));

bindEvents();
renderRuntime();

function bindEvents() {
  dom.themeBtn.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    applyTheme(state.theme);
    saveState();
  });

  dom.settingsBtn.addEventListener("click", openSettingsModal);
  dom.modalBackdrop.addEventListener("click", closeSettingsModal);
  dom.closeSettingsBtn.addEventListener("click", closeSettingsModal);
  dom.cancelSettingsBtn.addEventListener("click", closeSettingsModal);
  dom.applySettingsBtn.addEventListener("click", applyDraftSettings);
  dom.addPartBtn.addEventListener("click", addDraftPart);

  dom.playPauseBtn.addEventListener("click", async () => {
    if (!state.settings.parts.length) return;

    if (state.runtime.running) {
      pauseTimer();
    } else {
      await startTimer();
    }
  });

  dom.resetBtn.addEventListener("click", () => {
    resetTimer();
  });

  dom.nextBtn.addEventListener("click", () => {
    moveToNextPart(false);
  });

  document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "visible" && state.runtime.running) {
      await acquireWakeLock();
    }
  });

  window.addEventListener("beforeunload", () => {
    saveState();
  });

  applyTheme(state.theme);
}

function createPart(name, minutes, seconds, color) {
  return {
    id: uid(),
    name,
    minutes,
    seconds,
    color
  };
}

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
}

function structuredCloneSafe(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function normalizeState(raw) {
  const merged = structuredCloneSafe(defaultState);

  if (raw.theme === "light" || raw.theme === "dark") {
    merged.theme = raw.theme;
  }

  if (raw.settings) {
    merged.settings.repeatCount = clampInt(raw.settings.repeatCount, 1, 999, 1);
    merged.settings.vibrate = !!raw.settings.vibrate;
    merged.settings.alertsEnabled = !!raw.settings.alertsEnabled;

    if (Array.isArray(raw.settings.parts) && raw.settings.parts.length) {
      merged.settings.parts = raw.settings.parts.map((p, i) => ({
        id: p.id || uid(),
        name: String(p.name || `پارت ${i + 1}`).slice(0, 24),
        minutes: clampInt(p.minutes, 0, 999, 0),
        seconds: clampInt(p.seconds, 0, 59, 30),
        color: SWATCHES.includes(p.color) ? p.color : SWATCHES[i % SWATCHES.length]
      }));
    }

    if (raw.settings.sounds) {
      merged.settings.sounds = {
        startName: raw.settings.sounds.startName || "",
        startDataUrl: raw.settings.sounds.startDataUrl || "",
        switchName: raw.settings.sounds.switchName || "",
        switchDataUrl: raw.settings.sounds.switchDataUrl || "",
        finishName: raw.settings.sounds.finishName || "",
        finishDataUrl: raw.settings.sounds.finishDataUrl || ""
      };
    }
  }

  if (raw.runtime) {
    merged.runtime.running = false;
    merged.runtime.currentCycle = clampInt(raw.runtime.currentCycle, 1, merged.settings.repeatCount, 1);
    merged.runtime.currentPartIndex = clampInt(raw.runtime.currentPartIndex, 0, merged.settings.parts.length - 1, 0);
    merged.runtime.partStartTime = 0;
    merged.runtime.pausedElapsedMs = clampInt(raw.runtime.pausedElapsedMs, 0, 999999999, 0);
  }

  return merged;
}

function clampInt(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function applyTheme(theme) {
  dom.body.classList.remove("theme-dark", "theme-light");
  dom.body.classList.add(theme === "light" ? "theme-light" : "theme-dark");
}

function getCurrentPart() {
  return state.settings.parts[state.runtime.currentPartIndex] || null;
}

function getPartDurationMs(part) {
  return (clampInt(part.minutes, 0, 999, 0) * 60 + clampInt(part.seconds, 0, 59, 0)) * 1000;
}

function renderRuntime(progressOverride = null, remainingOverride = null) {
  const part = getCurrentPart();

  if (!part) {
    dom.partName.textContent = "پارتی وجود ندارد";
    dom.partIndex.textContent = "پارت 0 / 0";
    dom.cycleCounter.textContent = "چرخه 0 از 0";
    dom.remainingTime.textContent = "00:00.0";
    dom.elapsedTime.textContent = "گذشته: 00:00.0";
    setRingProgress(0);
    renderTimeline();
    syncPlayPauseIcon();
    return;
  }

  const duration = getPartDurationMs(part);
  const elapsedMs = progressOverride === null ? state.runtime.pausedElapsedMs : Math.min(duration, duration - remainingOverride);
  const remainingMs = remainingOverride === null ? Math.max(0, duration - state.runtime.pausedElapsedMs) : remainingOverride;
  const progress = progressOverride === null ? (duration > 0 ? state.runtime.pausedElapsedMs / duration : 0) : progressOverride;

  dom.partName.textContent = part.name;
  dom.partIndex.textContent = `پارت ${state.runtime.currentPartIndex + 1} / ${state.settings.parts.length}`;
  dom.cycleCounter.textContent = `چرخه ${state.runtime.currentCycle} از ${state.settings.repeatCount}`;
  dom.remainingTime.textContent = formatTime(remainingMs);
  dom.elapsedTime.textContent = `گذشته: ${formatTime(elapsedMs)}`;

  applyPartColor(part.color);
  setRingProgress(progress);
  renderTimeline();
  syncPlayPauseIcon();
}

function applyPartColor(color) {
  const nextColor = color || SWATCHES[0];
  const nextColor2 = lightenColor(nextColor, 0.26);

  document.documentElement.style.setProperty("--ring-color", nextColor);
  document.documentElement.style.setProperty("--ring-color-2", nextColor2);
  dom.gradStop1.setAttribute("stop-color", nextColor);
  dom.gradStop2.setAttribute("stop-color", nextColor2);
}

function lightenColor(hex, amount) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);

  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  r = Math.round(r + (255 - r) * amount);
  g = Math.round(g + (255 - g) * amount);
  b = Math.round(b + (255 - b) * amount);

  return `rgb(${r}, ${g}, ${b})`;
}

function setRingProgress(progress) {
  const safe = Math.max(0, Math.min(1, progress));
  const offset = ringCircumference * (1 - safe);
  dom.ringProgress.style.strokeDashoffset = `${offset}`;
}

function renderTimeline() {
  dom.timeline.innerHTML = "";

  state.settings.parts.forEach((part, index) => {
    const seg = document.createElement("div");
    const durationMs = Math.max(1000, getPartDurationMs(part));
    seg.className = "timeline-seg";
    if (index === state.runtime.currentPartIndex) seg.classList.add("active");
    seg.style.setProperty("--seg", part.color);
    seg.style.setProperty("--flex", Math.max(1, Math.round(durationMs / 1000)));
    dom.timeline.appendChild(seg);
  });
}

function syncPlayPauseIcon() {
  if (state.runtime.running) {
    dom.playPauseIcon.innerHTML = `<path d="M7 5h4v14H7V5Zm6 0h4v14h-4V5Z"/>`;
  } else {
    dom.playPauseIcon.innerHTML = `<path d="M8 5.5v13l10-6.5-10-6.5Z"/>`;
  }
}

async function startTimer() {
  const part = getCurrentPart();
  if (!part) return;

  const duration = getPartDurationMs(part);
  if (duration <= 0) {
    alert("زمان پارت فعلی باید بیشتر از صفر باشد.");
    return;
  }

  state.runtime.running = true;
  state.runtime.partStartTime = performance.now() - state.runtime.pausedElapsedMs;

  await acquireWakeLock();
  await fireStartEffectsIfNeeded();
  tick();
  saveState();
  syncPlayPauseIcon();
}

function pauseTimer() {
  if (!state.runtime.running) return;

  state.runtime.running = false;
  cancelAnimationFrame(rafId);
  rafId = null;

  const now = performance.now();
  state.runtime.pausedElapsedMs = Math.max(0, now - state.runtime.partStartTime);

  releaseWakeLock();
  saveState();
  renderRuntime();
}

function resetTimer() {
  state.runtime.running = false;
  cancelAnimationFrame(rafId);
  rafId = null;
  releaseWakeLock();

  state.runtime.currentCycle = 1;
  state.runtime.currentPartIndex = 0;
  state.runtime.partStartTime = 0;
  state.runtime.pausedElapsedMs = 0;

  saveState();
  renderRuntime();
}

function tick() {
  if (!state.runtime.running) return;

  const part = getCurrentPart();
  if (!part) {
    resetTimer();
    return;
  }

  const duration = getPartDurationMs(part);
  if (duration <= 0) {
    moveToNextPart(true);
    return;
  }

  const now = performance.now();
  const elapsed = Math.max(0, now - state.runtime.partStartTime);
  state.runtime.pausedElapsedMs = elapsed;

  const clamped = Math.min(elapsed, duration);
  const remainingMs = Math.max(0, duration - clamped);
  const progress = clamped / duration;

  renderRuntime(progress, remainingMs);

  if (clamped >= duration) {
    moveToNextPart(true);
    return;
  }

  rafId = requestAnimationFrame(tick);
}

async function moveToNextPart(fromAuto) {
  const wasRunning = state.runtime.running;
  cancelAnimationFrame(rafId);
  rafId = null;

  state.runtime.currentPartIndex += 1;
  state.runtime.pausedElapsedMs = 0;
  state.runtime.partStartTime = 0;

  if (state.runtime.currentPartIndex >= state.settings.parts.length) {
    if (state.runtime.currentCycle < state.settings.repeatCount) {
      state.runtime.currentCycle += 1;
      state.runtime.currentPartIndex = 0;
    } else {
      state.runtime.running = false;
      await playNamedSound("finish");
      vibratePulse([180, 90, 180]);
      releaseWakeLock();
      saveState();
      renderRuntime();
      return;
    }
  }

  await playNamedSound("switch");
  vibratePulse([70]);

  if (wasRunning || fromAuto) {
    state.runtime.running = true;
    state.runtime.partStartTime = performance.now();
    tick();
  } else {
    state.runtime.running = false;
    renderRuntime();
  }

  saveState();
}

function formatTime(ms) {
  const safe = Math.max(0, Math.floor(ms));
  const minutes = Math.floor(safe / 60000);
  const seconds = Math.floor((safe % 60000) / 1000);
  const tenths = Math.floor((safe % 1000) / 100);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
}

async function acquireWakeLock() {
  try {
    if (!("wakeLock" in navigator)) return;
    if (wakeLockSentinel) return;

    wakeLockSentinel = await navigator.wakeLock.request("screen");
    wakeLockSentinel.addEventListener("release", () => {
      wakeLockSentinel = null;
    });
  } catch (err) {
    console.log("Wake Lock error:", err);
  }
}

async function releaseWakeLock() {
  try {
    if (!wakeLockSentinel) return;
    await wakeLockSentinel.release();
    wakeLockSentinel = null;
  } catch (err) {
    console.log("Wake Lock release error:", err);
  }
}

function vibratePulse(pattern) {
  if (!state.settings.vibrate) return;
  if (!("vibrate" in navigator)) return;
  navigator.vibrate(pattern);
}

async function fireStartEffectsIfNeeded() {
  await playNamedSound("start");
  vibratePulse([60]);
}

async function playNamedSound(kind) {
  if (!state.settings.alertsEnabled) return;

  const sounds = state.settings.sounds;
  let dataUrl = "";

  if (kind === "start") dataUrl = sounds.startDataUrl;
  if (kind === "switch") dataUrl = sounds.switchDataUrl;
  if (kind === "finish") dataUrl = sounds.finishDataUrl;

  if (!dataUrl) return;

  try {
    const audio = new Audio(dataUrl);
    audio.currentTime = 0;
    await audio.play();
  } catch (err) {
    console.log("Audio play error:", err);
  }
}

function openSettingsModal() {
  draftSettings = structuredCloneSafe(state.settings);
  renderDraftSettings();
  dom.settingsModal.classList.remove("hidden");
  dom.settingsModal.setAttribute("aria-hidden", "false");
}

function closeSettingsModal() {
  draftSettings = null;
  dom.settingsModal.classList.add("hidden");
  dom.settingsModal.setAttribute("aria-hidden", "true");
}

function renderDraftSettings() {
  dom.repeatCountInput.value = draftSettings.repeatCount;
  dom.vibrateToggle.checked = draftSettings.vibrate;
  dom.alertsToggle.checked = draftSettings.alertsEnabled;

  dom.partsEditor.innerHTML = "";

  draftSettings.parts.forEach((part, index) => {
    const fragment = dom.partEditorTemplate.content.cloneNode(true);
    const root = fragment.querySelector(".part-card");
    const badge = fragment.querySelector(".mini-badge");
    const deleteBtn = fragment.querySelector(".delete-part-btn");
    const nameInput = fragment.querySelector(".js-name");
    const minutesSelect = fragment.querySelector(".js-minutes");
    const secondsSelect = fragment.querySelector(".js-seconds");
    const swatchesRoot = fragment.querySelector(".js-swatches");

    badge.textContent = `پارت ${index + 1}`;
    nameInput.value = part.name;

    fillNumberOptions(minutesSelect, 0, 120, part.minutes);
    fillNumberOptions(secondsSelect, 0, 59, part.seconds);

    nameInput.addEventListener("input", (e) => {
      part.name = e.target.value.slice(0, 24);
    });

    minutesSelect.addEventListener("change", (e) => {
      part.minutes = clampInt(e.target.value, 0, 120, 0);
    });

    secondsSelect.addEventListener("change", (e) => {
      part.seconds = clampInt(e.target.value, 0, 59, 0);
    });

    SWATCHES.forEach((color) => {
      const sw = document.createElement("button");
      sw.type = "button";
      sw.className = "swatch-btn";
      sw.style.setProperty("--sw", color);
      if (part.color === color) sw.classList.add("selected");

      sw.addEventListener("click", () => {
        part.color = color;
        renderDraftSettings();
      });

      swatchesRoot.appendChild(sw);
    });

    deleteBtn.addEventListener("click", () => {
      if (draftSettings.parts.length === 1) {
        alert("حداقل یک پارت باید وجود داشته باشد.");
        return;
      }
      draftSettings.parts.splice(index, 1);
      renderDraftSettings();
    });

    dom.partsEditor.appendChild(fragment);
  });

  dom.startSoundInput.value = "";
  dom.switchSoundInput.value = "";
  dom.finishSoundInput.value = "";

  dom.repeatCountInput.oninput = (e) => {
    draftSettings.repeatCount = clampInt(e.target.value, 1, 999, 1);
  };

  dom.vibrateToggle.onchange = (e) => {
    draftSettings.vibrate = e.target.checked;
  };

  dom.alertsToggle.onchange = (e) => {
    draftSettings.alertsEnabled = e.target.checked;
  };

  dom.startSoundInput.onchange = async (e) => {
    await assignAudioFile(e.target.files?.[0], "start");
  };

  dom.switchSoundInput.onchange = async (e) => {
    await assignAudioFile(e.target.files?.[0], "switch");
  };

  dom.finishSoundInput.onchange = async (e) => {
    await assignAudioFile(e.target.files?.[0], "finish");
  };
}

function fillNumberOptions(select, start, end, selectedValue) {
  select.innerHTML = "";
  for (let i = start; i <= end; i += 1) {
    const option = document.createElement("option");
    option.value = String(i);
    option.textContent = String(i).padStart(2, "0");
    if (i === Number(selectedValue)) option.selected = true;
    select.appendChild(option);
  }
}

function addDraftPart() {
  if (!draftSettings) return;
  draftSettings.parts.push(
    createPart(
      `پارت ${draftSettings.parts.length + 1}`,
      0,
      30,
      SWATCHES[draftSettings.parts.length % SWATCHES.length]
    )
  );
  renderDraftSettings();
}

async function assignAudioFile(file, type) {
  if (!file || !draftSettings) return;

  try {
    const dataUrl = await fileToDataUrl(file);

    if (type === "start") {
      draftSettings.sounds.startName = file.name;
      draftSettings.sounds.startDataUrl = dataUrl;
    }

    if (type === "switch") {
      draftSettings.sounds.switchName = file.name;
      draftSettings.sounds.switchDataUrl = dataUrl;
    }

    if (type === "finish") {
      draftSettings.sounds.finishName = file.name;
      draftSettings.sounds.finishDataUrl = dataUrl;
    }
  } catch (err) {
    console.log("File read error:", err);
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

function applyDraftSettings() {
  if (!draftSettings) return;

  draftSettings.repeatCount = clampInt(draftSettings.repeatCount, 1, 999, 1);
  draftSettings.parts = draftSettings.parts.map((part, index) => ({
    id: part.id || uid(),
    name: String(part.name || `پارت ${index + 1}`).slice(0, 24),
    minutes: clampInt(part.minutes, 0, 999, 0),
    seconds: clampInt(part.seconds, 0, 59, 0),
    color: SWATCHES.includes(part.color) ? part.color : SWATCHES[index % SWATCHES.length]
  }));

  state.settings = structuredCloneSafe(draftSettings);

  if (state.runtime.currentPartIndex >= state.settings.parts.length) {
    state.runtime.currentPartIndex = state.settings.parts.length - 1;
  }

  if (state.runtime.currentCycle > state.settings.repeatCount) {
    state.runtime.currentCycle = state.settings.repeatCount;
  }

  state.runtime.running = false;
  cancelAnimationFrame(rafId);
  rafId = null;
  releaseWakeLock();
  state.runtime.partStartTime = 0;
  state.runtime.pausedElapsedMs = 0;

  saveState();
  renderRuntime();
  closeSettingsModal();
}

registerServiceWorker();

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./sw.js");
      console.log("Service Worker registered");
    } catch (err) {
      console.log("Service Worker registration error:", err);
    }
  });
}











