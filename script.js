// main.js - Handles device connection, UI interactions, and shortcut mapping

const deviceInfoDisplay = document.getElementById('device-info');
const connectBtn = document.getElementById('connect-btn');
const osDisplay = document.getElementById('os-display');
const profileSelector = document.getElementById('profile-select');
const keyButtons = document.querySelectorAll('.key');
const saveBtn = document.getElementById('save-profile');
const testKeyDisplay = document.getElementById('key-test');

let currentProfile = {};
let activeProfile = 'profile1';
let port;
let writer;

const profiles = {
  profile1: {},
  profile2: {},
  profile3: {},
  profile4: {},
};

const detectOS = () => {
  const platform = navigator.platform.toLowerCase();
  if (platform.includes('win')) return 'Windows';
  if (platform.includes('mac')) return 'macOS';
  if (platform.includes('linux')) return 'Linux';
  return 'Unknown';
};

const updateDeviceInfo = async () => {
  const os = detectOS();
  osDisplay.textContent = os;
};

connectBtn.addEventListener('click', async () => {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });
    writer = port.writable.getWriter();
    deviceInfoDisplay.textContent = 'Micropad Connected';
    readDevice();
  } catch (err) {
    console.error('Connection failed:', err);
  }
});

const readDevice = async () => {
  while (port.readable) {
    const reader = port.readable.getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const data = new TextDecoder().decode(value);
        testKeyDisplay.textContent = `Pressed: ${data}`;
      }
    } catch (err) {
      console.error('Read failed:', err);
    } finally {
      reader.releaseLock();
    }
  }
};

profileSelector.addEventListener('change', (e) => {
  activeProfile = e.target.value;
  loadProfile(activeProfile);
});

keyButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const shortcut = prompt(`Assign shortcut to key ${btn.dataset.key}:`);
    if (shortcut) {
      profiles[activeProfile][btn.dataset.key] = shortcut;
      btn.textContent = shortcut;
    }
  });
});

saveBtn.addEventListener('click', () => {
  const profileData = JSON.stringify(profiles[activeProfile]);
  if (writer) {
    writer.write(new TextEncoder().encode(`SETUP:${profileData}\n`));
  }
});

const loadProfile = (name) => {
  currentProfile = profiles[name] || {};
  keyButtons.forEach((btn) => {
    const key = btn.dataset.key;
    btn.textContent = currentProfile[key] || key;
  });
};

document.addEventListener('DOMContentLoaded', updateDeviceInfo);
