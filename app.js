const keyboard = document.getElementById('keyboard');
const shortcutInput = document.getElementById('shortcutInput');
const saveShortcutBtn = document.getElementById('saveShortcutBtn');
const connectBtn = document.getElementById('connectBtn');
const osDisplay = document.getElementById('osDisplay');

const ROWS = 3;
const COLS = 3;

let selectedKey = null;
let currentMode = 'default';

// Predefined shortcuts by mode and OS
const shortcuts = {
  default: {
    windows: [
      ['Copy', 'Paste', 'Cut'],
      ['Undo', 'Redo', 'Save'],
      ['Find', 'Open', 'Print'],
    ],
    macos: [
      ['Cmd+C', 'Cmd+V', 'Cmd+X'],
      ['Cmd+Z', 'Shift+Cmd+Z', 'Cmd+S'],
      ['Cmd+F', 'Cmd+O', 'Cmd+P'],
    ],
    linux: [
      ['Ctrl+C', 'Ctrl+V', 'Ctrl+X'],
      ['Ctrl+Z', 'Ctrl+Shift+Z', 'Ctrl+S'],
      ['Ctrl+F', 'Ctrl+O', 'Ctrl+P'],
    ],
  },
  fusion360: {
    windows: [
      ['S', 'Q', 'W'],
      ['E', 'R', 'T'],
      ['Y', 'U', 'I'],
    ],
    macos: [
      ['S', 'Q', 'W'],
      ['E', 'R', 'T'],
      ['Y', 'U', 'I'],
    ],
    linux: [
      ['S', 'Q', 'W'],
      ['E', 'R', 'T'],
      ['Y', 'U', 'I'],
    ],
  },
  kicad: {
    windows: [
      ['Ctrl+M', 'Ctrl+N', 'Ctrl+O'],
      ['Ctrl+P', 'Ctrl+Q', 'Ctrl+R'],
      ['Ctrl+S', 'Ctrl+T', 'Ctrl+U'],
    ],
    macos: [
      ['Cmd+M', 'Cmd+N', 'Cmd+O'],
      ['Cmd+P', 'Cmd+Q', 'Cmd+R'],
      ['Cmd+S', 'Cmd+T', 'Cmd+U'],
    ],
    linux: [
      ['Ctrl+M', 'Ctrl+N', 'Ctrl+O'],
      ['Ctrl+P', 'Ctrl+Q', 'Ctrl+R'],
      ['Ctrl+S', 'Ctrl+T', 'Ctrl+U'],
    ],
  },
  canva: {
    windows: [
      ['Ctrl+Z', 'Ctrl+Y', 'Ctrl+C'],
      ['Ctrl+V', 'Ctrl+X', 'Ctrl+B'],
      ['Ctrl+I', 'Ctrl+U', 'Ctrl+L'],
    ],
    macos: [
      ['Cmd+Z', 'Cmd+Y', 'Cmd+C'],
      ['Cmd+V', 'Cmd+X', 'Cmd+B'],
      ['Cmd+I', 'Cmd+U', 'Cmd+L'],
    ],
    linux: [
      ['Ctrl+Z', 'Ctrl+Y', 'Ctrl+C'],
      ['Ctrl+V', 'Ctrl+X', 'Ctrl+B'],
      ['Ctrl+I', 'Ctrl+U', 'Ctrl+L'],
    ],
  },
};

// Detect OS
function detectOS() {
  const platform = navigator.platform.toLowerCase();
  if (platform.includes('win')) return 'windows';
  if (platform.includes('mac')) return 'macos';
  if (platform.includes('linux')) return 'linux';
  return 'windows'; // default fallback
}

let currentOS = detectOS();
osDisplay.textContent = `Detected OS: ${currentOS}`;

// Generate keyboard keys
function generateKeyboard() {
  keyboard.innerHTML = '';
  for (let r = 0; r < ROWS; r++) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('key-row');
    for (let c = 0; c < COLS; c++) {
      const key = document.createElement('div');
      key.classList.add('key');
      key.dataset.row = r;
      key.dataset.col = c;
      key.textContent = shortcuts[currentMode][currentOS][r][c];
      key.addEventListener('click', () => {
        selectKey(key);
      });
      rowDiv.appendChild(key);
    }
    keyboard.appendChild(rowDiv);
  }
}

// Select a key to edit
function selectKey(key) {
  if (selectedKey) {
    selectedKey.classList.remove('selected');
  }
  selectedKey = key;
  selectedKey.classList.add('selected');
  shortcutInput.value = selectedKey.textContent;
  shortcutInput.focus();
}

// Save edited shortcut
saveShortcutBtn.addEventListener('click', () => {
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
});

// Mode switching
document.querySelectorAll('.mode-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;
    generateKeyboard();
  });
});

// Initial setup
document.querySelector('.mode-btn[data-mode="default"]').classList.add('active');
generateKeyboard();

// Connect button logic placeholder
connectBtn.addEventListener('click', () => {
  alert('Connect functionality to be implemented');
});
