const connectBtn = document.getElementById('connectBtn');
const profileSelect = document.getElementById('profileSelect');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const keys = document.querySelectorAll('.key');
const shortcutInput = document.getElementById('shortcutInput');
const assignBtn = document.getElementById('assignBtn');
const selectedKeyLabel = document.getElementById('selectedKeyLabel');
const statusEl = document.getElementById('status');
const deviceInfoEl = document.getElementById('deviceInfo');

let selectedKey = null;
let profiles = [
  {}, {}, {}, {}
];
let currentProfileIndex = 0;

let osName = 'Unknown';

function detectOS() {
  const platform = window.navigator.platform.toLowerCase();
  if (platform.includes('mac')) return 'macOS';
  if (platform.includes('win')) return 'Windows';
  if (platform.includes('linux')) return 'Linux';
  return 'Unknown';
}

osName = detectOS();
console.log('Detected OS:', osName);

function formatShortcut(shortcut) {
  // Format shortcut string depending on OS
  if (osName === 'macOS') {
    return shortcut
      .replace(/Control/gi, '⌃')
      .replace(/Alt/gi, '⌥')
      .replace(/Shift/gi, '⇧')
      .replace(/Meta/gi, '⌘');
  } else {
    return shortcut.replace(/Meta/gi, 'Win');
  }
}

function updateKeyLabel(keyEl) {
  const row = keyEl.dataset.row;
  const col = keyEl.dataset.col;
  const profile = profiles[currentProfileIndex];
  const shortcut = profile[`${row},${col}`];
  if (shortcut) {
    keyEl.classList.add('assigned');
    keyEl.dataset.shortcut = formatShortcut(shortcut);
    keyEl.textContent = `K${parseInt(row) * 3 + parseInt(col) + 1}`;
  } else {
    keyEl.classList.remove('assigned');
    keyEl.dataset.shortcut = '';
    keyEl.textContent = `K${parseInt(row) * 3 + parseInt(col) + 1}`;
  }
}

function renderKeys() {
  keys.forEach(updateKeyLabel);
}

function clearSelected() {
  keys.forEach(k => k.classList.remove('selected'));
  selectedKey = null;
  selectedKeyLabel.textContent = 'None';
  shortcutInput.value = '';
  assignBtn.disabled = true;
}

keys.forEach(key => {
  key.addEventListener('click', () => {
    clearSelected();
    selectedKey = key;
    key.classList.add('selected');
    selectedKeyLabel.textContent = `Key ${parseInt(key.dataset.row) * 3 + parseInt(key.dataset.col) + 1}`;
    const currentShortcut = profiles[currentProfileIndex][`${key.dataset.row},${key.dataset.col}`];
    shortcutInput.value = currentShortcut || '';
    assignBtn.disabled = false;
  });
});

let currentShortcut = '';

shortcutInput.addEventListener('keydown', e => {
  e.preventDefault();
});

shortcutInput.addEventListener('focus', () => {
  shortcutInput.value = '';
  currentShortcut = '';
});

shortcutInput.addEventListener('keyup', e => {
  e.preventDefault();
  let keysPressed = [];
  if (e.ctrlKey) keysPressed.push(osName === 'macOS' ? 'Control' : 'Ctrl');
  if (e.altKey) keysPressed.push('Alt');
  if (e.shiftKey) keysPressed.push('Shift');
  if (e.metaKey) keysPressed.push(osName === 'macOS' ? 'Cmd' : 'Meta');
  // Add last key if it's a valid key (exclude modifiers)
  const key = e.key;
  if (
    key.length === 1 || 
    ['Enter', 'Tab', 'Escape', 'Backspace', 'Delete', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(key)
  ) {
    if (!['Control', 'Shift', 'Alt', 'Meta'].includes(key)) {
      keysPressed.push(key.length === 1 ? key.toUpperCase() : key);
    }
  }
  currentShortcut = keysPressed.join(' + ');
  shortcutInput.value = currentShortcut;
});

assignBtn.addEventListener('click', () => {
  if (!selectedKey) return alert('Select a key first');
  if (!currentShortcut) return alert('Type a shortcut first');
  const row = selectedKey.dataset.row;
  const col = selectedKey.dataset.col;
  profiles[currentProfileIndex][`${row},${col}`] = currentShortcut;
  updateKeyLabel(selectedKey);
  shortcutInput.value = '';
  assignBtn.disabled = true;

  // Send shortcut mapping to device via serial
  if (port && writer) {
    const cmd = `SET ${row},${col},${currentShortcut}\n`;
    writer.write(new TextEncoder().encode(cmd));
  }
});

profileSelect.addEventListener('change', () => {
  currentProfileIndex = parseInt(profileSelect.value);
  renderKeys();
  clearSelected();
  statusEl.textContent = `Status: Loaded Profile ${currentProfileIndex + 1}`;
});

// Save profile to localStorage
saveProfileBtn.addEventListener('click', () => {
  localStorage.setItem('micropad_profiles', JSON.stringify(profiles));
  statusEl.textContent = `Status: Profile ${currentProfileIndex + 1} saved locally.`;
});

// Load profiles from localStorage
function loadProfiles() {
  const saved = localStorage.getItem('micropad_profiles');
  if (saved) {
    profiles = JSON.parse(saved);
    renderKeys();
    statusEl.textContent = 'Status: Profiles loaded from localStorage.';
  }
}

loadProfiles();
renderKeys();

/////// Serial Communication Setup ////////

let port = null;
let reader = null;
let writer = null;
let keepReading = false;

async function connect() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });
    statusEl.textContent = 'Status: Connected to Micropad';
    deviceInfoEl.textContent = `Device: ${port.getInfo().usbVendorId || 'Unknown Vendor'} : ${port.getInfo().usbProductId || 'Unknown Product'}`;
    writer = port.writable.getWriter();
    keepReading = true;
    readLoop();
  } catch (err) {
    alert('Connection failed: ' + err.message);
  }
}

async function disconnect() {
  keepReading = false;
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
  statusEl.textContent = 'Status: Disconnected';
  deviceInfoEl.textContent = '';
}

async function readLoop() {
  const textDecoder = new TextDecoder();
  reader = port.readable.getReader();
  while (keepReading) {
    try {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        const text = textDecoder.decode(value);
        processDeviceData(text);
      }
    } catch (error) {
      console.error('Read error:', error);
      break;
    }
  }
  reader.releaseLock();
}

function processDeviceData(data) {
  // Example device data: "KEYDOWN,0,1" or "KEYUP,2,2"
  const lines = data.trim().split('\n');
  lines.forEach(line => {
    const parts = line.split(',');
    if (parts.length === 3) {
      const [event, row, col] = parts;
      highlightKey(row, col, event === 'KEYDOWN');
    }
  });
}

function highlightKey(row, col, active) {
  const key = [...keys].find(k => k.dataset.row === row && k.dataset.col === col);
  if (!key) return;
  if (active) key.classList.add('active');
  else key.classList.remove('active');
}

connectBtn.addEventListener('click', () => {
  if (port) {
    disconnect();
    connectBtn.textContent = 'Connect to Micropad';
  } else {
    connect().then(() => {
      connectBtn.textContent = 'Disconnect Micropad';
    });
  }
});
