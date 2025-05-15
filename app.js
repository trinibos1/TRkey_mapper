// script.js

const keys = [
  'K1', 'K2', 'K3',
  'K4', 'K5', 'K6',
  'K7', 'K8', 'K9'
];

const osShortcuts = {
  Windows: {
    Copy: 'Ctrl + C',
    Paste: 'Ctrl + V',
    Undo: 'Ctrl + Z',
    MediaPlayPause: 'MediaPlayPause'
  },
  macOS: {
    Copy: 'Cmd + C',
    Paste: 'Cmd + V',
    Undo: 'Cmd + Z',
    MediaPlayPause: 'F8'
  },
  Linux: {
    Copy: 'Ctrl + Shift + C',
    Paste: 'Ctrl + Shift + V',
    Undo: 'Ctrl + Z',
    MediaPlayPause: 'MediaPlayPause'
  }
};

const appShortcuts = {
  Fusion360: ['Pan', 'Orbit', 'Zoom', 'Create Sketch'],
  KiCad: ['Route Track', 'Place Via', 'Add Component'],
  Canva: ['Group', 'Ungroup', 'Bring to Front']
};

const keyboardGrid = document.getElementById('keyboardGrid');
const shortcutPanel = document.getElementById('shortcuts');
const connectBtn = document.getElementById('connectBtn');

let selectedOS = detectOS();

function detectOS() {
  const platform = navigator.platform.toLowerCase();
  if (platform.includes('mac')) return 'macOS';
  if (platform.includes('win')) return 'Windows';
  if (platform.includes('linux')) return 'Linux';
  return 'Windows'; // fallback
}

function populateKeyboard() {
  keyboardGrid.innerHTML = '';
  keys.forEach((key, i) => {
    const btn = document.createElement('button');
    btn.className = 'key';
    btn.innerText = key;
    btn.onclick = () => assignShortcut(key);
    keyboardGrid.appendChild(btn);
  });
}

function populateShortcuts() {
  shortcutPanel.innerHTML = '';
  const shortcuts = osShortcuts[selectedOS];
  for (const action in shortcuts) {
    const p = document.createElement('p');
    p.innerText = `${action}: ${shortcuts[action]}`;
    shortcutPanel.appendChild(p);
  }
}

function assignShortcut(key) {
  const assigned = prompt(`Assign shortcut for ${key}:`, 'Ctrl + Something');
  if (assigned) alert(`Shortcut for ${key} set to ${assigned}`);
}

function connectSerial() {
  alert('Simulating device connection...');
  // Implement Web Serial API if needed
}

connectBtn.onclick = connectSerial;

// Initialize
populateKeyboard();
populateShortcuts();
