const matrix = document.getElementById("matrix");
const output = document.getElementById("output");
const qrCanvas = document.getElementById("qrCanvas");
const testOutput = document.getElementById("lastKey");
const statusDiv = document.getElementById("connectionStatus");

const ctrlMod = document.getElementById("ctrlMod");
const altMod = document.getElementById("altMod");
const shiftMod = document.getElementById("shiftMod");

const presetSelect = document.getElementById("presetApp");
const loadPresetBtn = document.getElementById("loadPreset");

const exportBtn = document.getElementById("exportBtn");
const sendBtn = document.getElementById("sendBtn");
const saveEEPROMBtn = document.getElementById("saveEEPROM");
const genQRBtn = document.getElementById("genQR");

const themeToggle = document.getElementById("themeToggle");

let port = null;
let writer = null;
let reader = null;
let keepReading = false;

const mapping = Array(3).fill().map(() => Array(3).fill(""));

const iconMap = {
  "MediaPlayPause": "⏯",
  "MediaNextTrack": "⏭",
  "MediaVolumeMute": "🔇",
  "Ctrl+S": "💾",
  "Ctrl+Z": "↶",
  "Ctrl+Y": "↷",
  "Ctrl+C": "📋",
  "Ctrl+V": "📥",
  "Delete": "⌫",
  "Shift+Delete": "❌"
};

const presets = {
  fusion360: [["Ctrl+Z", "Ctrl+Y", "Ctrl+S"], ["L", "D", "C"], ["E", "X", "H"]],
  canva: [["Ctrl+C", "Ctrl+V", "Ctrl+Z"], ["T", "R", "L"], ["Delete", "G", "B"]],
  kicad: [["M", "R", "E"], ["Ctrl+S", "Ctrl+Z", "Ctrl+Y"], ["Ctrl+C", "Ctrl+V", "Del"]],
  vscode: [["Ctrl+P", "Ctrl+Shift+P", "Ctrl+B"], ["Ctrl+`", "Ctrl+F", "Ctrl+H"], ["Ctrl+S", "Alt+Up", "Alt+Down"]],
  warthunder: [["G", "F", "H"], ["V", "M", "N"], ["B", "T", "Y"]]
};

// Create grid keys
function createMatrix() {
  matrix.innerHTML = "";
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const btn = document.createElement("div");
      btn.className = "key";
      btn.dataset.row = r;
      btn.dataset.col = c;
      btn.draggable = true;
      btn.onclick = () => assignKey(btn, r, c);
      btn.ondragstart = dragStart;
      btn.ondrop = dropKey;
      btn.ondragover = e => e.preventDefault();
      matrix.appendChild(btn);
    }
  }
  updateMatrixDisplay();
}

// Assign key prompt
function assignKey(btn, r, c) {
  const base = prompt("Enter key or shortcut:", mapping[r][c]);
  if (base !== null) {
    let mod = "";
    if (ctrlMod.checked) mod += "Ctrl+";
    if (altMod.checked) mod += "Alt+";
    if (shiftMod.checked) mod += "Shift+";
    const fullKey = mod + base;
    mapping[r][c] = fullKey;
    btn.textContent = iconMap[fullKey] || fullKey || `${r},${c}`;
    testOutput.textContent = fullKey;
  }
}

// Drag & drop support
function dragStart(e) {
  e.dataTransfer.setData("text/plain", JSON.stringify({
    row: e.target.dataset.row,
    col: e.target.dataset.col
  }));
}

function dropKey(e) {
  e.preventDefault();
  const src = JSON.parse(e.dataTransfer.getData("text/plain"));
  const tgt = { row: e.target.dataset.row, col: e.target.dataset.col };
  const tmp = mapping[src.row][src.col];
  mapping[src.row][src.col] = mapping[tgt.row][tgt.col];
  mapping[tgt.row][tgt.col] = tmp;
  updateMatrixDisplay();
}

// Refresh UI keys display
function updateMatrixDisplay() {
  document.querySelectorAll(".key").forEach(btn => {
    const r = btn.dataset.row, c = btn.dataset.col;
    const label = mapping[r][c];
    btn.textContent = iconMap[label] || label || `${r},${c}`;
  });
}

// Load preset shortcuts
loadPresetBtn.onclick = () => {
  const selected = presetSelect.value;
  if (presets[selected]) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        mapping[r][c] = presets[selected][r][c];
      }
    }
    updateMatrixDisplay();
  }
};

// Export JSON mapping
exportBtn.onclick = () => {
  const result = {
    os: detectOS(),
    mapping
  };
  output.textContent = JSON.stringify(result, null, 2);
};

// Generate QR code
genQRBtn.onclick = () => {
  const data = JSON.stringify({ mapping });
  QRCode.toCanvas(qrCanvas, data, err => {
    if (err) alert("QR generation failed");
  });
};

// Detect OS
function detectOS() {
  const platform = navigator.platform.toLowerCase();
  if (platform.includes("mac")) return "macOS";
  if (platform.includes("win")) return "Windows";
  if (platform.includes("linux")) return "Linux";
  return "Unknown";
}

// Theme toggle
themeToggle.onclick = () => {
  document.body.classList.toggle("dark-theme");
  themeToggle.textContent = document.body.classList.contains("dark-theme") ? "Light Theme" : "Dark Theme";
};

// ==== Web Serial ====

async function connectDevice() {
  if (port) {
    output.textContent = "Already connected.";
    return;
  }
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });

    const encoder = new TextEncoderStream();
    encoder.readable.pipeTo(port.writable);
    writer = encoder.writable.getWriter();

    const decoder = new TextDecoderStream();
    port.readable.pipeTo(decoder.writable);
    reader = decoder.readable.getReader();

    statusDiv.textContent = "Device connected";

    keepReading = true;
    readLoop();

  } catch (err) {
    output.textContent = "Connection failed: " + err;
  }
}

async function readLoop() {
  while (keepReading && reader) {
    try {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        output.textContent += "\nDevice: " + value.trim();
        output.scrollTop = output.scrollHeight;
      }
    } catch (err) {
      output.textContent += "\nRead error: " + err;
      break;
    }
  }
}

async function sendToDevice(data) {
  if (!writer) {
    alert("Device not connected");
    return;
  }
  try {
    await writer.write(data);
    output.textContent += `\nSent: ${data.trim()}`;
    output.scrollTop = output.scrollHeight;
  } catch (err) {
    alert("Send failed: " + err);
  }
}

async function disconnectDevice() {
  keepReading = false;
  if (reader) {
    await reader.cancel();
    reader.releaseLock();
    reader = null;
  }
  if (writer) {
    await writer.close();
    writer.releaseLock();
    writer = null;
  }
  if (port) {
    await port.close();
    port = null;
  }
  statusDiv.textContent = "Device disconnected";
}

// Button event bindings
document.getElementById("connectBtn").onclick = connectDevice;

sendBtn.onclick = async () => {
  const payload = "SETUP:" + JSON.stringify(mapping) + "\n";
  await sendToDevice(payload);
};

saveEEPROMBtn.onclick = async () => {
  await sendToDevice("SAVE\n");
};

// Disconnect device on unload
window.addEventListener("beforeunload", async () => {
  if (port) await disconnectDevice();
});

// Initialization
createMatrix();
