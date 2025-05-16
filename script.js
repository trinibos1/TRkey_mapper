// Elements
const matrix = document.getElementById("matrix");
const output = document.getElementById("output");
const testOutput = document.getElementById("lastKey");
const statusDiv = document.getElementById("connectionStatus");
const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");
const exportBtn = document.getElementById("exportBtn");
const sendBtn = document.getElementById("sendBtn");
const saveEEPROMBtn = document.getElementById("saveEEPROM");
const genQRBtn = document.getElementById("genQR");
const qrCanvas = document.getElementById("qrCanvas");

let port = null;
let writer = null;
let reader = null;
let deviceConnected = false;

// 3x3 mapping
const mapping = Array(3).fill().map(() => Array(3).fill(""));

// Icon map for display
const iconMap = {
  "MediaPlayPause": "⏯",
  "MediaNextTrack": "⏭",
  "MediaVolumeMute": "🔇",
  "Ctrl+S": "💾",
  "Ctrl+Z": "↶",
  "Ctrl+Y": "↷"
};

// Preset shortcuts for apps
const presets = {
  fusion360: [["Ctrl+Z", "Ctrl+Y", "Ctrl+S"], ["L", "D", "C"], ["E", "X", "H"]],
  canva: [["Ctrl+C", "Ctrl+V", "Ctrl+Z"], ["T", "R", "L"], ["Delete", "G", "B"]],
  kicad: [["M", "R", "E"], ["Ctrl+S", "Ctrl+Z", "Ctrl+Y"], ["Ctrl+C", "Ctrl+V", "Del"]],
  vscode: [["Ctrl+P", "Ctrl+Shift+P", "Ctrl+B"], ["Ctrl+`", "Ctrl+F", "Ctrl+H"], ["Ctrl+S", "Alt+Up", "Alt+Down"]],
  warthunder: [["G", "F", "H"], ["V", "M", "N"], ["B", "T", "Y"]]
};

// Initialize matrix UI keys
function createMatrix() {
  matrix.innerHTML = "";
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const btn = document.createElement("div");
      btn.className = "key";
      btn.dataset.row = r;
      btn.dataset.col = c;
      btn.textContent = `${r},${c}`;
      btn.onclick = () => assignKey(btn, r, c);
      btn.draggable = true;
      btn.ondragstart = dragStart;
      btn.ondrop = dropKey;
      btn.ondragover = e => e.preventDefault();
      matrix.appendChild(btn);
    }
  }
}

// Assign key to matrix position with modifier toggles
function assignKey(btn, r, c) {
  const base = prompt("Enter key:", mapping[r][c]);
  if (base !== null) {
    let mod = "";
    if (document.getElementById("ctrlMod").checked) mod += "Ctrl+";
    if (document.getElementById("altMod").checked) mod += "Alt+";
    if (document.getElementById("shiftMod").checked) mod += "Shift+";
    const fullKey = mod + base;
    mapping[r][c] = fullKey;
    btn.textContent = iconMap[fullKey] || fullKey;
    testOutput.textContent = fullKey;
  }
}

// Drag and drop handlers for rearranging keys
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

function updateMatrixDisplay() {
  document.querySelectorAll(".key").forEach(btn => {
    const r = btn.dataset.row, c = btn.dataset.col;
    const label = mapping[r][c];
    btn.textContent = iconMap[label] || label || `${r},${c}`;
  });
}

// Export mapping JSON
exportBtn.onclick = () => {
  const result = {
    os: detectOS(),
    mapping: mapping
  };
  output.textContent = JSON.stringify(result, null, 2);
};

// Send mapping to device
sendBtn.onclick = () => {
  if (!deviceConnected) {
    alert("Connect device first!");
    return;
  }
  const payload = `SETUP:${JSON.stringify(mapping)}\n`;
  sendToDevice(payload);
};

// Save mapping to EEPROM on device
saveEEPROMBtn.onclick = () => {
  if (!deviceConnected) {
    alert("Connect device first!");
    return;
  }
  sendToDevice("SAVE\n");
};

// Generate QR code with current mapping
genQRBtn.onclick = () => {
  const data = JSON.stringify({ mapping });
  QRCode.toCanvas(qrCanvas, data, err => {
    if (err) alert("QR generation failed");
  });
};

// OS detection helper
function detectOS() {
  const platform = navigator.platform.toLowerCase();
  if (platform.includes("mac")) return "macOS";
  if (platform.includes("win")) return "Windows";
  if (platform.includes("linux")) return "Linux";
  return "Unknown";
}

// Serial connection handlers
async function connectDevice() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });

    writer = port.writable.getWriter();
    reader = port.readable.getReader();

    statusDiv.textContent = "Device connected";
    connectBtn.disabled = true;
    disconnectBtn.disabled = false;
    deviceConnected = true;

    readLoop();
  } catch (err) {
    statusDiv.textContent = "Connection failed: " + err.message;
  }
}

async function disconnectDevice() {
  try {
    if (reader) {
      await reader.cancel();
      reader.releaseLock();
      reader = null;
    }
    if (writer) {
      writer.releaseLock();
      writer = null;
    }
    if (port) {
      await port.close();
      port = null;
    }
    deviceConnected = false;
    statusDiv.textContent = "Device disconnected";
    connectBtn.disabled = false;
    disconnectBtn.disabled = true;
  } catch (err) {
    statusDiv.textContent = "Disconnection error: " + err.message;
  }
}

async function readLoop() {
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        const text = new TextDecoder().decode(value);
        console.log("Received:", text);
        // Optional: show incoming data in UI here
      }
    }
  } catch (err) {
    console.error("Read loop error:", err);
  }
}

async function sendToDevice(data) {
  if (!deviceConnected || !writer) {
    alert("Device not connected.");
    return;
  }
  try {
    const encoded = new TextEncoder().encode(data);
    await writer.write(encoded);
  } catch (err) {
    alert("Failed to send data: " + err.message);
  }
}

// Event listeners for connect/disconnect buttons
connectBtn.addEventListener("click", connectDevice);
disconnectBtn.addEventListener("click", disconnectDevice);

// Load preset app shortcuts
document.getElementById("loadPreset").onclick = () => {
  const selected = document.getElementById("presetApp").value;
  if (presets[selected]) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        mapping[r][c] = presets[selected][r][c];
      }
    }
    updateMatrixDisplay();
  }
};

// Initialize UI
createMatrix();
disconnectBtn.disabled = true;
