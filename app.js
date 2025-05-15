// ==== DOM Elements ====
const connectBtn = document.getElementById('connect-btn');
const deviceInfo = document.getElementById('device-info');
const connectionStatus = document.getElementById('connection-status') || createStatusElement();
const osInfo = document.getElementById('os-info');
const keys = [...document.querySelectorAll('.key')];
const shortcutInput = document.getElementById('shortcut-input');
const assignBtn = document.getElementById('assign-btn');
const profileSelect = document.getElementById('profile-select');
const saveProfileBtn = document.getElementById('save-profile-btn');
const loadProfileBtn = document.getElementById('load-profile-btn');

let port = null;
let writer = null;
let reader = null;
let keepReading = false;
let selectedKeyIndex = null;

let profiles = [{}, {}, {}, {}];
let currentProfileIndex = 0;

const OS = detectOS();
osInfo.textContent = `Detected OS: ${OS}`;

// Media icons for media keys
const mediaKeyIcons = {
  'play': '▶️',
  'pause': '⏸️',
  'stop': '⏹️',
  'next': '⏭️',
  'prev': '⏮️',
  'volup': '🔊',
  'voldown': '🔉',
  'mute': '🔇',
  'mediaplaypause': '⏯️'
};

// --- Initialize ---
loadProfiles();
updateKeyLabels();
assignBtn.disabled = true;
shortcutInput.disabled = true;

// ==== Functions ====

function createStatusElement() {
  const el = document.createElement('div');
  el.id = 'connection-status';
  document.getElementById('status-section').appendChild(el);
  return el;
}

function detectOS() {
  const platform = navigator.platform.toLowerCase();
  if (platform.includes('win')) return 'Windows';
  if (platform.includes('mac')) return 'macOS';
  if (platform.includes('linux')) return 'Linux';
  return 'Unknown';
}

function loadProfiles() {
  try {
    const saved = localStorage.getItem('micropadProfiles');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === 4) {
        profiles = parsed;
      }
    }
  } catch {
    profiles = [{}, {}, {}, {}];
  }
}

function saveProfiles() {
  localStorage.setItem('micropadProfiles', JSON.stringify(profiles));
}

// Return label with media icon if applicable
function getDisplayLabel(shortcut) {
  if (!shortcut) return '';
  const keyLower = shortcut.trim().toLowerCase();
  if (mediaKeyIcons[keyLower]) return mediaKeyIcons[keyLower];
  return shortcut;
}

function updateKeyLabels() {
  keys.forEach(key => {
    const idx = key.dataset.key;
    key.textContent = getDisplayLabel(profiles[currentProfileIndex][idx]);
  });
}

function selectKey(index) {
  selectedKeyIndex = index;
  keys.forEach(k => k.classList.remove('selected'));
  keys[index].classList.add('selected');

  shortcutInput.value = profiles[currentProfileIndex][index] || '';
  assignBtn.disabled = false;
  shortcutInput.disabled = false;
  shortcutInput.focus();
}

function validateShortcut(shortcut) {
  if (!shortcut) return false;
  const parts = shortcut.split('+').map(s => s.trim().toLowerCase());
  const validModifiers = ['ctrl', 'alt', 'shift', 'meta', 'cmd', 'command', 'win'];
  const validKeys = [
    'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
    '0','1','2','3','4','5','6','7','8','9',
    'f1','f2','f3','f4','f5','f6','f7','f8','f9','f10','f11','f12',
    'enter','space','tab','escape','esc','backspace','delete','insert','home','end','pageup','pagedown',
    'left','right','up','down',
    // media keys
    'play','pause','stop','next','prev','volup','voldown','mute','mediaplaypause'
  ];

  let hasKey = false;
  for (const p of parts) {
    if (validModifiers.includes(p)) continue;
    if (validKeys.includes(p)) {
      if (hasKey) return false; // only one main key allowed
      hasKey = true;
    } else {
      return false; // unknown key
    }
  }
  return hasKey;
}

// Send command to device
async function sendCommand(cmd) {
  if (!writer) {
    alert('Not connected!');
    return;
  }
  await writer.write(new TextEncoder().encode(cmd + '\n'));
}

// Flash key on keypress event
function flashKeyPress(idx) {
  if (idx < 0 || idx >= keys.length) return;
  keys[idx].classList.add('pressed');
  setTimeout(() => {
    keys[idx].classList.remove('pressed');
  }, 300);
}

// Handle incoming device lines
function handleLine(line) {
  if (!line) return;
  //console.log('Device:', line);
  if (line.startsWith('KEYPRESS:')) {
    const idx = parseInt(line.split(':')[1]);
    if (!isNaN(idx)) flashKeyPress(idx);
  } else if (line.startsWith('STATUS:')) {
    connectionStatus.textContent = line.substring(7);
  }
}

// Read loop for serial
async function readLoop() {
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (keepReading) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) handleLine(line.trim());
    }
  } catch (e) {
    console.error(e);
  }
}

// Connect to serial device
async function connect() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });

    writer = port.writable.getWriter();
    reader = port.readable.getReader();

    keepReading = true;
    readLoop();

    connectionStatus.textContent = 'Connected';
    connectBtn.disabled = true;

    const info = port.getInfo ? port.getInfo() : {};
    deviceInfo.textContent = `Device info: USB Vendor ${info.usbVendorId || 'N/A'}, Product ${info.usbProductId || 'N/A'}`;

  } catch (e) {
    alert('Failed to connect: ' + e.message);
  }
}

// Assign shortcut on selected key
async function assignShortcut() {
  if (selectedKeyIndex === null) {
    alert('Select a key first!');
    return;
  }
  const shortcut = shortcutInput.value.trim();
  if (!shortcut) {
    alert('Enter a shortcut!');
    return;
  }

  if (!validateShortcut(shortcut)) {
    alert('Invalid shortcut format for ' + OS);
    return;
  }

  profiles[currentProfileIndex][selectedKeyIndex] = shortcut;
  updateKeyLabels();

  await sendCommand(`SETUP:${selectedKeyIndex}:${shortcut}`);
}

// Save/load profiles from localStorage
function saveProfile() {
  saveProfiles();
  alert(`Profile ${currentProfileIndex + 1} saved.`);
}

function loadProfile() {
  loadProfiles();
  updateKeyLabels();
  alert(`Profile ${currentProfileIndex + 1} loaded.`);
}

// Profile change
function changeProfile() {
  currentProfileIndex = parseInt(profileSelect.value);
  updateKeyLabels();
  selectedKeyIndex = null;
  assignBtn.disabled = true;
  shortcutInput.value = '';
  shortcutInput.disabled = true;
}

// ==== Event Listeners ====
connectBtn.addEventListener('click', connect);
assignBtn.addEventListener('click', assignShortcut);
saveProfileBtn.addEventListener('click', saveProfile);
loadProfileBtn.addEventListener('click', loadProfile);
profileSelect.addEventListener('change', changeProfile);

keys.forEach((key, idx) => {
  key.addEventListener('click', () => selectKey(idx));
});

// Select key function exposed for event
function selectKey(idx) {
  selectedKeyIndex = idx;
  keys.forEach(k => k.classList.remove('selected'));
  keys[idx].classList.add('selected');
  shortcutInput.value = profiles[currentProfileIndex][idx] || '';
  assignBtn.disabled = false;
  shortcutInput.disabled = false;
  shortcutInput.focus();
}
