const matrix = document.getElementById("matrix");
const output = document.getElementById("output");
const qrCanvas = document.getElementById("qrCanvas");
const testOutput = document.getElementById("lastKey");
const statusDiv = document.getElementById("connectionStatus");
const activeModifiersDiv = document.getElementById("activeModifiers");

const iconMap = {
  "MediaPlayPause": "⏯",
  "MediaNextTrack": "⏭",
  "MediaVolumeMute": "🔇",
  "Ctrl+S": "💾",
  "Ctrl+Z": "↶",
  "Ctrl+Y": "↷"
};

const presets = {
  fusion360: [["Ctrl+Z", "Ctrl+Y", "Ctrl+S"], ["L", "D", "C"], ["E", "X", "H"]],
  canva: [["Ctrl+C", "Ctrl+V", "Ctrl+Z"], ["T", "R", "L"], ["Delete", "G", "B"]],
  kicad: [["M", "R", "E"], ["Ctrl+S", "Ctrl+Z", "Ctrl+Y"], ["Ctrl+C", "Ctrl+V", "Del"]],
  vscode: [["Ctrl+P", "Ctrl+Shift+P", "Ctrl+B"], ["Ctrl+`", "Ctrl+F", "Ctrl+H"], ["Ctrl+S", "Alt+Up", "Alt+Down"]],
  warthunder: [["G", "H", "J"], ["Ctrl+1", "Ctrl+2", "Ctrl+3"], ["Ctrl+4", "Ctrl+5", "Ctrl+6"]],
};

let mapping = Array(3)
  .fill()
  .map(() => Array(3).fill(""));

let currentEditBtn = null;
let currentEditPos = null;

const modal = document.getElementById("keyAssignModal");
const overlay = document.getElementById("modalOverlay");

function updateActiveModifiers() {
  let mods = [];
  if (document.getElementById("ctrlMod").checked) mods.push("Ctrl");
  if (document.getElementById("altMod").checked) mods.push("Alt");
  if (document.getElementById("shiftMod").checked) mods.push("Shift");
  activeModifiersDiv.textContent = mods.length ? "Active Modifiers: " + mods.join(" + ") : "";
}
["ctrlMod", "altMod", "shiftMod"].forEach(id => {
  document.getElementById(id).addEventListener("change", updateActiveModifiers);
});
updateActiveModifiers();

function displayMapping() {
  matrix.innerHTML = "";
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const keyVal = mapping[r][c] || "";
      const btn = document.createElement("button");
      btn.className = "key";
      btn.dataset.row = r;
      btn.dataset.col = c;

      btn.textContent = iconMap[keyVal] || keyVal || `Key ${r + 1},${c + 1}`;

      btn.addEventListener("click", () => assignKey(btn, r, c));

      matrix.appendChild(btn);
    }
  }
}

function assignKey(btn, r, c) {
  currentEditBtn = btn;
  currentEditPos = { r, c };

  let currentVal = mapping[r][c] || "";

  let base = currentVal,
    ctrl = false,
    alt = false,
    shift = false;

  ["Ctrl+", "Alt+", "Shift+"].forEach(mod => {
    if (currentVal.startsWith(mod)) {
      if (mod === "Ctrl+") ctrl = true;
      if (mod === "Alt+") alt = true;
      if (mod === "Shift+") shift = true;
      base = base.replace(mod, "");
    }
  });

  document.getElementById("modalBaseKey").value = base;
  document.getElementById("modalCtrl").checked = ctrl;
  document.getElementById("modalAlt").checked = alt;
  document.getElementById("modalShift").checked = shift;

  showModal();
}

function showModal() {
  modal.classList.add("show");
  overlay.classList.add("show");
}

function closeModal() {
  modal.classList.remove("show");
  overlay.classList.remove("show");
  currentEditBtn = null;
  currentEditPos = null;
}

document.getElementById("modalSaveBtn").addEventListener("click", () => {
  if (!currentEditPos) return;

  let base = document.getElementById("modalBaseKey").value.trim();
  let ctrl = document.getElementById("modalCtrl").checked;
  let alt = document.getElementById("modalAlt").checked;
  let shift = document.getElementById("modalShift").checked;

  if (!base) {
    alert("Base key cannot be empty.");
    return;
  }

  let combined = "";
  if (ctrl) combined += "Ctrl+";
  if (alt) combined += "Alt+";
  if (shift) combined += "Shift+";
  combined += base;

  mapping[currentEditPos.r][currentEditPos.c] = combined;

  displayMapping();
  closeModal();
});

document.getElementById("modalCancelBtn").addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// Preset loader
document.getElementById("loadPreset").addEventListener("click", () => {
  let app = document.getElementById("presetApp").value;
  if (!app || !presets[app]) {
    alert("Select a valid preset.");
    return;
  }
  mapping = presets[app].map(row => row.slice());
  displayMapping();
});

// Export mapping as JSON
document.getElementById("exportBtn").addEventListener("click", () => {
  const jsonStr = JSON.stringify(mapping);
  navigator.clipboard.writeText(jsonStr).then(() => {
    alert("Mapping copied to clipboard!");
  });
});

// Generate QR code
document.getElementById("genQR").addEventListener("click", () => {
  const jsonStr = JSON.stringify(mapping);
  QRCode.toCanvas(qrCanvas, jsonStr, { width: 200 }, err => {
    if (err) alert("QR generation failed: " + err);
  });
});

// Save to EEPROM (simulate)
document.getElementById("saveEEPROM").addEventListener("click", () => {
  alert("Save to EEPROM command sent (simulate).");
});

// Send to device (simulate)
document.getElementById("sendBtn").addEventListener("click", () => {
  alert("Send to device command sent (simulate).");
});

// Show last key output (simulate)
function showKeyOutput(key) {
  testOutput.textContent = key;
}

// Initial display
displayMapping();

// Theme toggle
const themeToggleBtn = document.getElementById("themeToggle");
themeToggleBtn.onclick = () => {
  if (document.documentElement.getAttribute("data-theme") === "dark") {
    document.documentElement.removeAttribute("data-theme");
    themeToggleBtn.textContent = "Switch to Dark Theme";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggleBtn.textContent = "Switch to Light Theme";
  }
};
if (document.documentElement.getAttribute("data-theme") === "dark") {
  themeToggleBtn.textContent = "Switch to Light Theme";
} else {
  themeToggleBtn.textContent = "Switch to Dark Theme";
}
