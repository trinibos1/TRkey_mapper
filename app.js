// micropad.js

let serialPort;
let writer;
let selectedOS = "windows";
let selectedApp = "default";

const shortcutMappings = {
  windows: {
    default: ["Ctrl+C", "Ctrl+V", "Ctrl+Z", "Ctrl+Y", "Alt+Tab", "Win+D", "Ctrl+Alt+Del", "Ctrl+S", "Ctrl+P"],
    fusion360: ["Ctrl+1", "Ctrl+2", "Ctrl+3", "Ctrl+4", "L", "E", "D", "Q", "X"],
    kicad: ["R", "M", "Ctrl+R", "Ctrl+M", "Delete", "Ctrl+C", "Ctrl+V", "Ctrl+Z", "Ctrl+Y"],
    canva: ["T", "C", "L", "R", "Delete", "Ctrl+Z", "Ctrl+Y", "Ctrl+S", "Ctrl+Shift+K"]
  },
  macos: {
    default: ["Cmd+C", "Cmd+V", "Cmd+Z", "Cmd+Y", "Cmd+Tab", "Cmd+H", "Cmd+Option+Esc", "Cmd+S", "Cmd+P"],
    fusion360: ["Cmd+1", "Cmd+2", "Cmd+3", "Cmd+4", "L", "E", "D", "Q", "X"],
    kicad: ["R", "M", "Cmd+R", "Cmd+M", "Delete", "Cmd+C", "Cmd+V", "Cmd+Z", "Cmd+Y"],
    canva: ["T", "C", "L", "R", "Delete", "Cmd+Z", "Cmd+Y", "Cmd+S", "Cmd+Shift+K"]
  },
  linux: {
    default: ["Ctrl+C", "Ctrl+V", "Ctrl+Z", "Ctrl+Y", "Alt+Tab", "Ctrl+Alt+T", "Ctrl+Alt+Del", "Ctrl+S", "Ctrl+P"],
    fusion360: ["Ctrl+1", "Ctrl+2", "Ctrl+3", "Ctrl+4", "L", "E", "D", "Q", "X"],
    kicad: ["R", "M", "Ctrl+R", "Ctrl+M", "Delete", "Ctrl+C", "Ctrl+V", "Ctrl+Z", "Ctrl+Y"],
    canva: ["T", "C", "L", "R", "Delete", "Ctrl+Z", "Ctrl+Y", "Ctrl+S", "Ctrl+Shift+K"]
  }
};

async function connectSerial() {
  try {
    serialPort = await navigator.serial.requestPort();
    await serialPort.open({ baudRate: 115200 });
    writer = serialPort.writable.getWriter();
    console.log("Connected to serial port");
  } catch (error) {
    console.error("Serial connection failed:", error);
  }
}

function updateMicropadDisplay() {
  const grid = document.getElementById("micropad-grid");
  grid.innerHTML = "";

  const shortcuts = shortcutMappings[selectedOS][selectedApp];
  shortcuts.forEach((shortcut, index) => {
    const key = document.createElement("div");
    key.classList.add("key");
    key.textContent = shortcut;
    key.dataset.index = index;
    key.onclick = () => sendCommand(index);
    grid.appendChild(key);
  });
}

function sendCommand(index) {
  const shortcut = shortcutMappings[selectedOS][selectedApp][index];
  if (writer) {
    writer.write(new TextEncoder().encode(`EXECUTE,${Math.floor(index / 3)},${index % 3};`));
    console.log("Sent shortcut:", shortcut);
  }
}

function setOS(os) {
  selectedOS = os;
  updateMicropadDisplay();
}

function setApp(app) {
  selectedApp = app;
  updateMicropadDisplay();
}

document.getElementById("connectBtn").onclick = connectSerial;
document.getElementById("osSelector").onchange = (e) => setOS(e.target.value);
document.getElementById("appSelector").onchange = (e) => setApp(e.target.value);

window.onload = updateMicropadDisplay;
