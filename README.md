
# ⚙️ TRKey



[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-active-success.svg)](#)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB.svg?logo=react&logoColor=white)](#)
[![Web Serial](https://img.shields.io/badge/API-Web%20Serial-blue.svg)](#)
[![CircuitPython](https://img.shields.io/badge/CircuitPython-compatible-purple.svg)](https://circuitpython.org/)

A modern web-based tool to configure your macropad — and soon, full keyboards.  
Customize key bindings, layers, macros, and physical layouts with an intuitive interface, and communicate directly with your device via the Web Serial API.

---

## ✨ Features

- **Full Key Remapping** – Assign single keys or complex shortcuts to any key. Drag-and-drop or click-to-assign.  
- **Configurable Physical Layout** – Visually define your macropad's physical button arrangement (e.g., 2x2, 3x3, etc.) and active key positions directly in the UI.  
- **Multi-Layer Support** – Configure up to 10 layers for dynamic switching between keysets.  
- **Macro Management** – Create, edit, and assign custom macros to any key. Works seamlessly with TRKey Macropad.  
- **Peripheral Controls** – Control volume, scrolling, or custom QMK keycodes via potentiometers or peripherals.  
- **Persistent Profiles** – Save and load configurations in browser local storage.  
- **Configuration Export** – Export `layers.json` for Pico firmware.  
- **Web Serial API Integration** – Connect to your device in real-time for logging, commands, and direct file transfer.  
- **Live Key Tester** – Debug keypresses and modifiers directly in the browser.  
- **Responsive UI** – Built with React + Tailwind CSS for a smooth experience on any device.  
- **Interactive Terminal & Logging** – Monitor device serial logs and send commands directly to your Pico.  

---

## 🔗 Related Projects

**TRKey Macropad** – Official Pico-powered macropad hardware + firmware, fully compatible with the TRKey Configurator. 🔗 [Macropad](https://github.com/trinibos1/Trkey_macro) 
---
Want your device added? Contact me!

---

## 📁 File Structure

- Single-page app (`index.html`)  
- Includes React + Tailwind CSS inline (no server required)  
- Fully client-side  

---

## 📋 Requirements

- Chromium browser (Chrome, Edge) with Web Serial API enabled  
- Raspberry Pi Pico with compatible CircuitPython firmware  
- Pico running the **TRKey serial handler `code.py` script** for device communication (`PUT`/`GET`/`DEL`/`LIST` commands)  
- `layers.json` config file for keymap, macros, and peripherals  

---

## 📡 Web Serial Protocol

The configurator communicates with the Pico using a custom serial protocol, implemented in your Pico's `code.py` (or `main.py`) script.

- **Baud Rate:** `115200`  
- **Line Endings:** `\n`  
- **Response Markers:**  
  - `<EOF>` – end of file data  
  - `<END>` – end of multi-line text response  

**File Operations:**

- **GET**  
```

GET <filename>\n

```
Pico sends file content until `<EOF>\n`.

- **PUT**  
```

PUT <filename>\n <file content> <EOF>\n

```
Pico confirms with `FILE RECEIVED\n`.

- **DEL**  
```

DEL <filename>\n

```
Pico confirms with `DELETED\n`.

- **LIST**  
```

LIST\n

````
Pico sends a list of files, each on a new line, until `<END>\n`.

---

## ⌨️ Supported Shortcuts

The TRKey Configurator leverages string representations that map directly to **Adafruit HID library codes** on your CircuitPython device.  

Supports hundreds of keycodes & combos, including:

- **Alphanumeric:** A–Z, 0–9  
- **Function Keys:** F1–F24  
- **Navigation:** Arrows, Home, End, PgUp, PgDn  
- **Modifiers:** Ctrl, Shift, Alt, GUI/Command  
- **System:** Power, Sleep, Wake  
- **Media Controls:** Play/Pause, Volume Up/Down, Mute, Track Skip  
- **Mouse Actions:** LEFT_BUTTON, RIGHT_BUTTON, MIDDLE_BUTTON, Scrolls, Drag shortcuts  
- **Common Shortcuts:** Ctrl+C, Ctrl+V, Alt+Tab, etc.  
- **Layer Switching:** TO(x), MO(x), TT(x), DF(x)  

**App-Specific Presets:**  
- Minecraft  
- KiCad  
- Fusion360  
- Browsers, audio/video editors, design software  

---

## 🛠️ Architecture & Data Flow

1. **Frontend (React/Tailwind):** User configures keymaps/macros in the browser UI  
2. **State Management (React):** Config state managed client-side  
3. **Persistence:** Profiles saved/loaded from `localStorage`  
4. **Export:** Generates `layers.json`  
5. **Transfer (Web Serial):** Sends `layers.json` to Pico (`PUT`)  
6. **Firmware (code.py):** Reads uploaded `layers.json` and dynamically loads mappings/macros  

---

## 🖥️ Interface Breakdown

- **KEYMAP** – Assign keys, drag-and-drop, manage layers  
- **LAYOUT** – Configure grid size, toggle active keys  
- **MACROS** – Create/edit/assign text or key sequence macros  
- **CONNECT + LOAD** – Save/load profiles, export `layers.json`, Web Serial ops (connect, upload, download, delete, list)  
- **SETTINGS** – Import raw JSON configs, set total number of active layers  
- **KEY TESTER** – Debug live keypresses/modifiers in-browser  

---

## 🗺️ Roadmap 🚀

### Phase 1: Current & Upcoming Enhancements
- ✅ Full Key Remapping  
- ✅ Configurable Physical Layout  
- ✅ Multi-Layer Support  
- ✅ Macro Management  
- ✅ Basic Peripheral Controls (media keys, scrolling)  
- ✅ Persistent Profiles  
- ✅ Configuration Export  
- ✅ Web Serial API Integration  
- ✅ Live Key Tester  
- ✅ Responsive UI  
- ✅ Interactive Terminal & Logging  
- [ ] Advanced Layout Editor  
- [ ] Improved Macro Editor (timing, conditionals, visual builder)  
- [ ] Theming Options  

### Phase 2: Expanded Hardware Support & Connectivity
- [ ] TRKey Keyboard Support (full-sized keyboards)  
- [ ] Hall Effect Switches Integration  
- [ ] QMK/KMK Firmware Compatibility  
- [ ] Wireless Connectivity (Bluetooth/BLE)  

### Phase 3: Community & Extended Ecosystem
- [ ] Community Preset Sharing  
- [ ] Documentation & Tutorials  
- [ ] Custom Firmware Generation  

---

## 🐛 Troubleshooting

- **Serial Issues** – Use Chromium-based browser, check Web Serial permissions, verify USB cable, baud rate = 115200  
- **Pico Not Responding / `UNKNOWN COMMAND`** – Ensure correct `code.py` uploaded & running on CIRCUITPY  
- **Read-only Filesystem Error** – Ensure Pico’s filesystem is writable  
- **UI Bugs** – Refresh page  
- **JSON Errors** – Imported JSON must follow strict format:  
```json
{
  "layers": [...],
  "physical_layout": [...],
  "grid_size": 3
}
````

---

## ⚖️ License

MIT License – free to use, modify, and distribute.

---

## ✉️ Contact

* Open issues on GitHub
* Email: **[Trinibos1@proton.me](mailto:Trinibos1@proton.me)**

---

## 🙌 Thanks

Huge thanks to **Adafruit** for their libraries. Without their work, projects like macropads wouldn’t be possible 💜

