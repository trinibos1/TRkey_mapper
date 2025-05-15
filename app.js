// Globals
const connectBtn = document.getElementById('connect-btn');
const modeSelect = document.getElementById('mode-select');
const statusEl = document.getElementById('status');
const keypadEl = document.getElementById('keypad');
const shortcutInput = document.getElementById('shortcut-input');
const assignBtn = document.getElementById('assign-btn');

let osName = 'unknown';
let selectedKey = null;
let keyMappings = {
  default: Array(9).fill(''), // 9 keys, empty shortcuts
  fusion360: Array(9).fill(''),
  kicad: Array(9).fill(''),
  canva: Array(9).fill('')
};

let pressedKeys = new Set();

// Utility to detect OS
function detectOS() {
  const platform = navigator.platform.toLowerCase();
  if (platform.indexOf('win') >= 0) return 'windows';
  if (platform.indexOf('mac') >= 0) return 'macos';
  if (platform.indexOf('linux') >= 0) return 'linux';
  return 'unknown';
}

// Update status with OS info
function updateStatus() {
  statusEl.textContent = `Detected OS: ${osName}`;
}

// Render 3x3 keypad keys
function renderKeypad() {
  keypadEl.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const keyDiv = document.createElement('div');
    keyDiv.className = 'key';
    keyDiv.dataset.index = i;
    keyDiv.tabIndex = 0;
    keyDiv.setAttribute('role', 'button');
    keyDiv.setAttribute('aria-pressed', 'false');

    keyDiv.innerHTML = `
      <div class="key-label">Key ${i + 1}</div>
      <div class="shortcut">${keyMappings[modeSelect.value][i] || ''}</div>
    `;

    // Click to select key
    keyDiv.addEventListener('click', () => {
      if (selectedKey !== null) {
        // Unselect previous
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

// Listen for key combos for shortcut input
function handleKeyDown(event) {
  if (selectedKey === null) return;

  event.preventDefault();

  // Track pressed keys
  pressedKeys.add(event.key);

  // Format pressed keys to a string
  const keysArray = Array.from(pressedKeys);

  // Normalize names for common keys (example)
  const normalizeKey = (key) => {
    if (key === 'Control') return 'Ctrl';
    if (key === 'AltGraph') return 'AltGr';
    if (key === ' ') return 'Space';
    if (key === 'Meta') return osName === 'macos' ? 'Cmd' : 'Meta';
    return key.length === 1 ? key.toUpperCase() : key;
  };

  const shortcutStr = keysArray
    .map(normalizeKey)
    .sort() // Sort so modifiers always first (basic)
    .join(' + ');

  shortcutInput.value = shortcutStr;
  assignBtn.disabled = false;
}

function handleKeyUp(event) {
  if (selectedKey === null) return;
  pressedKeys.delete(event.key);
}

// Assign shortcut to selected key
function assignShortcut() {
  if (selectedKey === null) return;
  const mode = modeSelect.value;
  keyMappings[mode][selectedKey] = shortcutInput.value;
  renderKeypad();
  shortcutInput.value = '';
  assignBtn.disabled = true;
  // Optionally, send mapping to micropad device here
}

// Change mode updates displayed shortcuts
modeSelect.addEventListener('change', () => {
  selectedKey = null;
  renderKeypad();
  shortcutInput.value = '';
  assignBtn.disabled = true;
});

// Connect button dummy handler (you can replace with actual serial connection)
connectBtn.addEventListener('click', () => {
  statusEl.textContent = 'Connected to Micropad (simulated)';
});

// Shortcut input key handlers
shortcutInput.addEventListener('keydown', handleKeyDown);
shortcutInput.addEventListener('keyup', handleKeyUp);

// Initialization
osName = detectOS();
updateStatus();
renderKeypad();
