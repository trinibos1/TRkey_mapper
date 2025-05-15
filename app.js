const connectBtn = document.getElementById('connectBtn');
const grid = document.getElementById('grid');
const status = document.getElementById('status');

let port;
let reader;
let writer;
let readBuffer = '';

let keyMapping = Array(3).fill(null).map(() => Array(3).fill(''));

function logStatus(msg) {
  status.textContent = msg;
}

async function connect() {
  try {
    logStatus('Requesting port...');
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });
    logStatus('Connected!');

    writer = port.writable.getWriter();
    reader = port.readable.getReader();

    connectBtn.disabled = true;

    await sendCommand('GET_MAPPING\n');
    readLoop();

  } catch (e) {
    logStatus('Error: ' + e.message);
  }
}

async function sendCommand(cmd) {
  const data = new TextEncoder().encode(cmd);
  await writer.write(data);
}

async function readLoop() {
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        logStatus('Connection closed.');
        break;
      }
      if (value) {
        const text = new TextDecoder().decode(value);
        handleIncomingData(text);
      }
    }
  } catch (e) {
    logStatus('Read error: ' + e.message);
  }
}

function handleIncomingData(data) {
  readBuffer += data;
  let lines = readBuffer.split('\n');
  readBuffer = lines.pop();

  lines.forEach(line => {
    line = line.trim();
    if (!line) return;

    if (line === 'OK' || line === 'CONFIGURED') {
      logStatus(line);
    } else if (line.includes(',')) {
      parseMapping(line);
    } else {
      logStatus('Received: ' + line);
    }
  });
}

function parseMapping(mappingString) {
  const rows = mappingString.split('|');
  for (let r = 0; r < 3; r++) {
    const cols = rows[r].split(',');
    for (let c = 0; c < 3; c++) {
      keyMapping[r][c] = cols[c] || '';
    }
  }
  renderGrid();
  logStatus('Mapping loaded');
}

function renderGrid() {
  grid.innerHTML = '';
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const btn = document.createElement('button');
      btn.className = 'key-btn';
      btn.textContent = keyMapping[r][c] || `Key ${r},${c}`;
      btn.onclick = () => executeKey(r, c);
      grid.appendChild(btn);
    }
  }
}

async function executeKey(row, col) {
  if (!writer) {
    logStatus('Not connected');
    return;
  }
  logStatus(`Executing key (${row},${col})`);
  await sendCommand(`EXECUTE,${row},${col}\n`);
}

connectBtn.addEventListener('click', connect);
