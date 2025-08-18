
# ⚙️ Trkey

A modern **web-based tool** to configure your **3×3 Pico-powered micropad** — and soon, full keyboards.  
Customize key bindings, layers, macros, and peripherals with an intuitive interface, and communicate directly with your device via the **Web Serial API**.

---

## ✨ Features

- **Full Key Remapping** – Assign single keys or complex shortcuts to any of the 9 keys. Drag-and-drop or click-to-assign.  
- **Multi-Layer Support** – Configure up to 10 layers for dynamic switching between keysets.  
- **Macro Management** – Create, edit, and assign custom macros to any key. Works seamlessly with [Trkey Macro](https://github.com/trinibos1/Trkey_macro).  
- **Peripheral Controls** – Control volume, scrolling, or custom QMK keycodes via potentiometers or peripherals.  
- **Persistent Profiles** – Save and load configurations in browser local storage.  
- **Configuration Export** – Export `layers.json` for Pico firmware.  
- **Web Serial API** – Connect to your device in real-time for logging & commands.  
- **Live Key Tester** – Debug keypresses and modifiers.  
- **Responsive UI** – Built with **React + Tailwind CSS**.  
- **Interactive Terminal & Logging** – Monitor device logs and send commands directly.  

---

## 🔗 Related Projects

- **[Trkey Macropad](https://github.com/trinibos1/Trkey_macro)** – Official Pico-powered macropad hardware + firmware, fully compatible with the Trkey Configurator.

---

## 🚀 How to Use

1. Open **`index.html`** in Chrome or Edge (Web Serial API must be enabled).  
2. Use the sidebar to navigate: **KEYMAP, MACROS, CONTROLS, SAVE+LOAD, TERMINAL, SETTINGS, KEY TESTER**.  
3. Configure and export your setup to `layers.json`.  
4. Drag-and-drop `layers.json` onto the **CIRCUITPY** drive (manual upload required).  

---

## 📁 File Structure

- **Single-page app** (`index.html`)  
- Includes **React + Tailwind CSS** inline (no server required)  
- Fully **client-side**  

---

## 📋 Requirements

- Chromium browser (**Chrome, Edge**) with Web Serial API enabled  
- Raspberry Pi Pico with compatible **CircuitPython firmware**  
- `layers.json` config file for keymap, macros, peripherals  

---

## 📡 Web Serial Protocol

- **Baud Rate:** `115200`  
- **Line Endings:** `\n`  
- **Response Markers:** `<EOF>` (file data), `<END>` (text response)  

### File Ops:
- **GET:** `GET layers.json\n` → Receive until `<EOF>`  
- **DEL:** `DEL layers.json\n` → Deletes file  
- **PUT:** (Manual drag required due to CircuitPython MSC mode)  

---

## ⌨️ Supported Shortcuts

Supports **hundreds of keycodes & combos**, including:  

- **Alphanumeric** (A–Z, 0–9)  
- **Function Keys** (F1–F24)  
- **Navigation** (Arrows, Home, End, PgUp, PgDn)  
- **Modifiers** (Ctrl, Shift, Alt, GUI/Command)  
- **System** (Sleep, Power, Wake)  
- **Media Controls** (Play, Pause, Volume, Track Skip)  
- **Mouse Actions** (Clicks, Scrolls, Drag shortcuts)  
- **Common Shortcuts** (Ctrl+C, Ctrl+V, Alt+Tab, etc.)  
- **App-Specific**:  
  - Minecraft  
  - KiCad  
  - Fusion360  
  - Browsers  
  - Audio/Video editors  
  - Design software  

*(See full key list in `constants.js`.)*

---

## 🛠️ Architecture & Data Flow

- **Frontend (React/Tailwind)** → User edits keymap/macros  
- **State Management (React)** → Config state stored in browser  
- **Persistence** → Saved in `localStorage`  
- **Export** → Generates `layers.json`  
- **Transfer** → Manual drag to Pico CIRCUITPY  
- **Firmware (code.py)** → Reads `layers.json`, loads mappings/macros  

---

## 🖥️ Interface Breakdown

- **KEYMAP** – Map keys, assign tap/hold, manage layers  
- **MACROS** – Create and assign text/sequence macros  
- **CONTROLS** – Configure peripherals (potentiometers, scroll, volume)  
- **SAVE + LOAD** – Save profiles in browser, export `layers.json`  
- **TERMINAL** – View Pico logs, send commands via Web Serial  
- **SETTINGS** – Import raw JSON configs  
- **KEY TESTER** – Debug HID events in-browser  

---

## 📡 `layers.json` Example

```json
[
  {
    "name": "Layer 0",
    "labels": ["A", "B", "C", "", "", "", "", "", ""],
    "keys": ["CONTROL_C", "CONTROL_V", "CONTROL_X", "A", "B", "C", "F1", "F2", "F3"],
    "macros": [
      { "name": "Hello", "sequence": "Hello, World!\n" }
    ]
  }
]
````

---

## 🤖 Firmware Role (CircuitPython `code.py`)

* Reads and parses **`layers.json`**
* Handles **3×3 key scanning + debouncing**
* Sends **USB HID reports** (keyboard + media controls)
* Runs macros, shortcuts, and layer switching
* Updates OLED with active layer and key labels

---

## 🐛 Troubleshooting

* **Serial Issues** – Check Chromium permissions, USB cable, baud `115200`
* **UI Bugs** – Refresh page
* **JSON Errors** – Ensure strict format (array of layer objects, each with `keys`, `labels`, optional `macros`)

---

## ⚖️ License

MIT License – free to use, modify, and distribute.

---

## ✉️ Contact

* Open issues on GitHub
* Email: **[Trinibos1@proton.me](mailto:Trinibos1@proton.me)**

---

## ⌨️ Coming Soon

**Trkey Keyboard Support** 🚀
*Hall affect switches**🥳

