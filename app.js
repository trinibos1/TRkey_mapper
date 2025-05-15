// Elements
const connectBtn = document.getElementById('connect-btn');
const statusEl = document.getElementById('status');
const keypadEl = document.getElementById('keypad');
const shortcutInput = document.getElementById('shortcut-input');
const assignBtn = document.getElementById('assign-btn');
const profileButtons = document.querySelectorAll('.profile-btn');
const saveProfileBtn = document.getElementById('save-profile-btn');

let osName = 'unknown';
let selectedKey = null;
let currentProfileIndex = 0;

const NUM_KEYS = 9;

// Serial related
let port = null;
let writer = null;
let reader = null;
let keepReading = false;

// Load profiles from localStorage or init empty
let profiles = [];

function loadProfiles() {
  const stored = localStorage.getItem('micropadProfiles');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length === 4) {
        profiles = parsed;
        return;
      }
    } catch {}
  }
  // Init empty profiles (each with 9 empty shortcuts)
  profiles = Array(4).fill(null).map(() => Array(NUM_KEYS).fill(''));
}

function saveProfiles() {
  localStorage.setItem('micropadProfiles', JSON.stringify(profiles));
}

// Utility to detect OS
function detectOS() {
  const platform = navigator.platform.toLowerCase();
  if (platform.indexOf('win') >= 0) return 'windows';
  if (platform.indexOf('mac') >= 0) return 'macos';
  if (platform.indexOf('linux') >= 0) return 'linux';
  return 'unknown';
}

function updateStatus(msg) {
  statusEl.textContent = msg;
}

// Render keypad with shortcuts from current profile
function renderKeypad() {
  keypadEl.innerHTML = '';
  const shortcuts = profiles[currentProfileIndex];
  for (let i = 0; i < NUM_KEYS; i++) {
    const keyDiv = document.createElement('div');
    keyDiv.className = 'key';
    keyDiv.dataset.index = i;
    keyDiv.tabIndex = 0;
    keyDiv.setAttribute('role', 'button');
    keyDiv.setAttribute('aria-pressed', 'false');
    keyDiv.textContent = `Key ${i + 1}`;

    // Add shortcut label inside key if assigned
    if (shortcuts[i]) {
      const shortcutLabel = document.createElement('div');
      shortcutLabel.className = 'shortcut';
      shortcutLabel.textContent = shortcuts[i];
      keyDiv.appendChild(shortcutLabel);
    }

    // Click to select key
    keyDiv.addEventListener('click', () => {
      // Unselect previous
      if (selectedKey !== null) {
        const prev = keypadEl.querySelector(`.key[data-index="${selectedKey}"]`);
        if (prev) {
          prev.classList.remove('selected');
          prev.setAttribute('aria-pressed', 'false');
        }
      }
      selectedKey = i;
      keyDiv.classList.add('selected');
      keyDiv.setAttribute('aria-pressed', 'true');

      shortcutInput.value = '';
      assignBtn.disabled = true;
      pressedKeys.clear();
      shortcutInput.placeholder = 'Press keys here (e.g. Ctrl + Alt + M)';
      shortcutInput.focus();
    });

    keypadEl.appendChild(keyDiv);
  }
}

// Shortcut input handlers
let pressedKeys = new Set();

function normalizeKey(key) {
  if (key === 'Control') return 'Ctrl';
  if (key === 'AltGraph') return 'AltGr';
  if (key === ' ') return 'Space';
  if (key === 'Meta') return osName === 'macos' ? 'Cmd' : 'Meta';
  return key.length === 1 ? key.toUpperCase() : key;
}

function handleKeyDown(event) {
  if (selectedKey === null) return;

  event.preventDefault();

  pressedKeys.add(event.key);

  // Sort modifiers first for consistency
  const sortedKeys = Array.from(pressedKeys).sort((a, b) => {
    const order = ['Control', 'Shift', 'Alt', 'Meta'];
    const aIdx = order.indexOf(a);
    const bIdx = order.indexOf(b);
    if (aIdx === -1) return 1;
    if (bIdx === -1) return -1;
    return aIdx - bIdx;
  });

  const shortcutStr = sortedKeys.map(normalizeKey).join(' + ');
  shortcutInput.value = shortcutStr;
  assignBtn.disabled = false;
}

function handleKeyUp(event) {
  if (selectedKey === null) return;
  pressedKeys.delete(event.key);
}

async function assignShortcut() {
  if (selectedKey === null) return;

  const shortcutText = shortcutInput.value.trim();
  profiles[currentProfileIndex][selectedKey] = shortcutText;
  renderKeypad();

  // Send the mapping to micropad device over serial
  if (writer) {
    // Compose command string, e.g.:
    // SETUP:keyIndex:shortcut\n
    // For your device, you might want a specific protocol, adjust accordingly.
    // Example: "SETUP:0:Ctrl+Alt+M\n"
    const command = `SETUP:${selectedKey}:${shortcutText.replace(/ /g, '')}\n`;
    try {
      await writer.write(new TextEncoder().encode(command));
      console.log('Sent to device:', command);
    } catch (err) {
      console.error('Error sending command:', err);
      updateStatus('Error sending data to device.');
    }
  }

  shortcutInput.value = '';
  assignBtn.disabled = true;
  selectedKey = null;
  pressedKeys.clear();
}

// Profile buttons
profileButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('active')) return;

    profileButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    currentProfileIndex = parseInt(btn.dataset.profile, 10);
    selectedKey = null;
    shortcutInput.value = '';
    assignBtn.disabled = true;
    pressedKeys.clear();

    renderKeypad();
  });
});

// Save profile to localStorage
saveProfileBtn.addEventListener('click', () => {
  saveProfiles();
  updateStatus(`Profile ${currentProfileIndex + 1} saved locally.`);
});

// Serial connect/disconnect logic
async function connectSerial() {
  if (!('serial' in navigator)) {
    updateStatus('Web Serial API not supported in this browser.');
    return;
  }

  try {
    // Request port
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });

    writer = port.writable.getWriter();

    keepReading = true;
    readLoop();

    updateStatus('Connected to Micropad');
    connectBtn.textContent = 'Disconnect from Micropad';

    // Optionally send all current profile mappings to device on connect
    await sendFullProfile();

  } catch (err) {
    console.error(err);
    updateStatus('Failed to connect: ' + err.message);
  }
}

async function disconnectSerial() {
  keepReading = false;

  if (reader) {
    try {
      await reader.cancel();
      await reader.releaseLock();
    } catch {}
    reader = null;
  }

  if (writer) {
    try {
      await writer.close();
      await writer.releaseLock();
    } catch {}
    writer = null;
  }

  if (port) {
    try {
      await port.close();
    } catch {}
    port = null;
  }

  updateStatus('Disconnected');
  connectBtn.textContent = 'Connect to Micropad';
}

async function readLoop() {
  try {
    const decoder = new TextDecoderStream();
    const inputDone = port.readable.pipeTo(decoder.writable);
    const inputStream = decoder.readable;
    reader = inputStream.getReader();

    while (keepReading) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        console.log('Received from device:', value);
        // Optionally process device messages here
      }
    }
  } catch (err) {
    console.error('Read error:', err);
  } finally {
    reader = null;
  }
}

// Send all shortcuts of current profile to device
async function sendFullProfile() {
  if (!writer) return;

  const shortcuts = profiles[currentProfileIndex];
  for (let i = 0; i < shortcuts.length; i++) {
    const sc = shortcuts[i].replace(/ /g, '');
    const command = `SETUP:${i}:${sc}\n`;
    try {
      await writer.write(new TextEncoder().encode(command));
      await delay(30); // small delay to avoid flooding serial buffer
    } catch (err) {
      console.error('Error sending full profile:', err);
      updateStatus('Error sending full profile to device.');
      break;
    }
  }
}

// Utility delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Connect button click handler
connectBtn.addEventListener('click', async () => {
  if (port) {
    await disconnectSerial();
  } else {
    await connectSerial();
  }
});

// Shortcut input event listeners
shortcutInput.addEventListener('keydown', handleKeyDown);
shortcutInput.addEventListener('keyup', handleKeyUp);

// Assign button click
assignBtn.addEventListener('click', assignShortcut);

// Init
osName = detectOS();
updateStatus(`Detected OS: ${osName}`);
loadProfiles();
renderKeypad();
