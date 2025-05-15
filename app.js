// app.js

const modes = ['default', 'fusion360', 'kicad', 'canva'];
const osList = ['windows', 'macos', 'linux'];

let currentMode = 'default';
let currentOS = detectOS();

let shortcuts = {};

// Initialize shortcuts object with empty strings
for (const mode of modes) {
  shortcuts[mode] = {};
  for (const os of osList) {
    shortcuts[mode][os] = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
  }
}

const keyboard = document.getElementById('keyboard');
const modeSelect = document.getElementById('modeSelect');
const osDisplay = document.getElementById('osDisplay');
const shortcutInput = document.getElementById('shortcutInput');
const saveShortcutBtn = document.getElementById('saveShortcutBtn');
const connectBtn = document.getElementById('connectBtn');
const statusSpan = document.getElementById('status');

let selectedKey = null;

// Detect OS
function detectOS() {
  const platform = navigator.platform.toLowerCase();
  if (platform.includes('win')) return 'windows';
  if (platform.includes('mac')) return 'macos';
  if (platform.includes('linux')) return 'linux';
  return 'windows'; // default fallback
}

// Update OS display
function updateOSDisplay() {
  osDisplay.textContent = currentOS.charAt(0).toUpperCase() + currentOS.slice(1);
}

// Build keyboard UI
function buildKeyboard() {
  keyboard.innerHTML = '';
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const btn = document.createElement('button');
      btn.classList.add('key');
      btn.dataset.row = r;
      btn.dataset.col = c;
      btn.textContent = shortcuts[currentMode][currentOS][r][c] || `K${r}${c}`;
      btn.addEventListener('click', () => selectKey(btn));
      keyboard.appendChild(btn);
    }
  }
}

// Select key for editing shortcut
function selectKey(btn) {
  if (selectedKey) selectedKey.classList.remove('selected');
  selectedKey = btn;
  btn.classList.add('selected');
  const r = btn.dataset.row;
  const c = btn.dataset.col;
  shortcutInput.value = shortcuts[currentMode][currentOS][r][c] || '';
  shortcutInput.focus();
}

// Save shortcut for selected key
saveShortcutBtn.addEventListener('click', async () => {
  if (!selectedKey) return alert('Select a key first!');
  const newShortcut = shortcutInput.value.trim();
  if (!newShortcut) return alert('Shortcut cannot be empty!');

  const r = selectedKey.dataset.row;
  const c = selectedKey.dataset.col;
  shortcuts[currentMode][currentOS][r][c] = newShortcut;
  selectedKey.textContent = newShortcut;
  shortcutInput.value = '';
  selectedKey.classList.remove('selected');
  selectedKey = null;

  // Send updated shortcut to device
  const command = `SETUP,${currentMode},${currentOS},${r},${c},${newShortcut}`;
  await sendData(command);
});

// Handle mode change
modeSelect.addEventListener('change', () => {
  currentMode = modeSelect.value;
  buildKeyboard();
  shortcutInput.value = '';
  if (selectedKey) {
    selectedKey.classList.remove('selected');
    selectedKey = null;
  }
});

// Web Serial API variables
let port;
let reader;
let outputStream;
let keepReading = false;

connectBtn.addEventListener('click', async () => {
  if (port) {
    // Disconnect
    keepReading = false;
    if (reader) {
      await reader.cancel();
      reader.releaseLock();
    }
    await port.close();
    port = null;
    connectBtn.textContent = 'Connect';
    statusSpan.textContent = 'Disconnected';
    return;
  }

  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });
    statusSpan.textContent = 'Connected';
    connectBtn.textContent = 'Disconnect';

    outputStream = port.writable.getWriter();
    keepReading = true;
    readLoop();
  } catch (err) {
    alert('Error connecting to serial port: ' + err);
  }
});

async function readLoop() {
  while (port.readable && keepReading) {
    reader = port.readable.getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          const textDecoder = new TextDecoder();
          const data = textDecoder.decode(value);
          console.log('Received:', data);
          // You can add logic to parse device responses here
        }
      }
    } catch (error) {
      console.error('Read error:', error);
    } finally {
      reader.releaseLock();
    }
  }
}

// Send data to the serial device
async function sendData(data) {
  if (!outputStream) {
    alert('Serial port not connected!');
    return;
  }
  const textEncoder = new TextEncoder();
  const encoded = textEncoder.encode(data + '\n');
  await outputStream.write(encoded);
  console.log('Sent:', data);
}

// Initialize UI
updateOSDisplay();
buildKeyboard();
