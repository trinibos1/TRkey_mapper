const matrix = document.getElementById("matrix");
const output = document.getElementById("output");
const qrCanvas = document.getElementById("qrCanvas");
const testOutput = document.getElementById("lastKey");
const statusDiv = document.getElementById("connectionStatus");
const mapping = Array(3).fill().map(() => Array(3).fill(""));

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
  warthunder: [["G", "F", "H"], ["V", "M", "N"], ["B", "T", "Y"]]
};

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

function createMatrix() {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const btn = document.createElement("div");
      btn.className = "key";
      btn.dataset.row = r;
      btn.dataset.col = c;
      btn.textContent = `${r},${c}`;
      btn.draggable = true;
      btn.onclick = () => assignKey(btn, r, c);
      btn.ondragstart = dragStart;
      btn.ondrop = dropKey;
      btn.ondragover = e => e.preventDefault();
      matrix.appendChild(btn);
    }
  }
}

function assignKey(btn, r, c) {
  const base = prompt("Enter key:", mapping[r][c]);
  if (base !== null) {
    let mod = "";
    if (ctrlMod.checked) mod += "Ctrl+";
    if (altMod.checked) mod += "Alt+";
    if (shiftMod.checked) mod += "Shift+";
    const fullKey = mod + base;
    mapping[r][c] = fullKey;
    btn.textContent = iconMap[fullKey] || fullKey;
    testOutput.textContent = fullKey;
  }
}

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

document.getElementById("exportBtn").onclick = () => {
  const result = {
    os: detectOS(),
    mapping: mapping
  };
  output.textContent = JSON.stringify(result, null, 2);
};

document.getElementById("genQR").onclick = () => {
  const data = JSON.stringify({ mapping });
  QRCode.toCanvas(qrCanvas, data, err => {
    if (err) alert("QR generation failed");
  });
};

function detectOS() {
  const platform = navigator.platform.toLowerCase();
  if (platform.includes("mac")) return "macOS";
  if (platform.includes("win")) return "Windows";
  if (platform.includes("linux")) return "Linux";
  return "Unknown";
}

// ----------- Web Serial + WebUSB Integration --------------

let port = null;
let writer = null;
let reader = null;
let keepReading = false;

const ctrlMod = document.getElementById("ctrlMod");
const altMod = document.getElementById("altMod");
const shiftMod = document.getElementById("shiftMod");

async function connectDevice() {
  if ("serial" in navigator) {
    try {
      port = await navigator.serial.requestPort();
      await port.open({ baudRate: 115200 });
      await setupStreams();
      statusDiv.textContent = "Serial device connected";
    } catch (e) {
      alert("Serial connection failed: " + e.message);
      statusDiv.textContent = "No device connected";
    }
  } else if ("usb" in navigator) {
    try {
      port = await navigator.usb.requestDevice({ filters: [] });
      await port.open();
      if (port.configuration === null) await port.selectConfiguration(1);
      await port.claimInterface(0);
      statusDiv.textContent = "USB device connected (WebUSB)";
      // TODO: Implement WebUSB read/write if needed
    } catch (e) {
      alert("WebUSB connection failed: " + e.message);
      statusDiv.textContent = "No device connected";
    }
  } else {
    alert("Neither Web Serial nor Web USB supported by your browser.");
  }
}

async function setupStreams() {
  const encoder = new TextEncoderStream();
  const decoder = new TextDecoderStream();

  encoder.readable.pipeTo(port.writable);
  reader = port.readable.pipeThrough(decoder).getReader();
  writer = encoder.writable.getWriter();

  keepReading = true;
  readLoop();

  port.addEventListener("disconnect", () => {
    statusDiv.textContent = "Device disconnected";
    keepReading = false;
    writer = null;
    reader = null;
    port = null;
  });
}

async function readLoop() {
  while (keepReading) {
    try {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        console.log("Received:", value);
        output.textContent += value + "\n";
        output.scrollTop = output.scrollHeight;
      }
    } catch (error) {
      console.error("Read error:", error);
      break;
    }
  }
}

async function sendToDevice(data) {
  if (!writer) {
    alert("Device not connected.");
    return;
  }
  try {
    await writer.write(data);
    console.log("Sent:", data);
  } catch (e) {
    alert("Write failed: " + e.message);
  }
}

document.getElementById("connectBtn").onclick = async () => {
  await connectDevice();
};

document.getElementById("sendBtn").onclick = async () => {
  if (!port) {
    await connectDevice();
  }
  if (port && writer) {
    const payload = `SETUP:${JSON.stringify(mapping)}\n`;
    await sendToDevice(payload);
  }
};

document.getElementById("saveEEPROM").onclick = async () => {
  if (!port) {
    alert("Connect device first");
    return;
  }
  await sendToDevice("SAVE\n");
};

// Auto-connect on page load if possible
async function autoConnect() {
  if ("serial" in navigator) {
    const ports = await navigator.serial.getPorts();
    if (ports.length > 0) {
      port = ports[0];
      await port.open({ baudRate: 115200 });
      await setupStreams();
      statusDiv.textContent = "Auto-connected to serial device";
    }
  }
}

createMatrix();
updateMatrixDisplay();
autoConnect();
