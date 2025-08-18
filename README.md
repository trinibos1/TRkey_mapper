# ⚙️ 3x3 Micropad Remapper

A modern web-based tool to configure your 3x3 Pico-powered micropad keyboard. Customize key bindings, layers, macros, and peripherals with an intuitive interface, and communicate directly with your device via the Web Serial API.

---

## ✨ Features

* **Full Key Remapping:** Assign single keys or complex shortcuts to any of the 9 keys on your micropad. Drag-and-drop or click-to-assign for fast configuration.
* **Multi-Layer Support:** Configure up to 10 layers for dynamic switching between keysets.
* **Macro Management:** Create, edit, and assign custom macros to any key. Works seamlessly with [Trkey Macro](https://github.com/trinibos1/Trkey_macro).
* **Peripheral Controls:** Control volume, scrolling, or custom QMK keycodes via potentiometers or other peripherals.
* **Persistent Profiles:** Save and load configurations in your browser’s local storage.
* **Configuration Export:** Export a `layers.json` file compatible with Pico firmware.
* **Web Serial Upload:** Connect and upload your configuration directly to the micropad via Web Serial (Chromium-based browsers).
* **Live Key Tester:** See key presses and active modifiers for debugging or shortcut mapping.
* **Responsive UI:** Smooth, interactive design using React + Tailwind CSS.
* **Comprehensive Logging:** Monitor communication and operations with your device in real-time.

---

## 🔗 Related Projects

* **[Trkey Macro](https://github.com/trinibos1/Trkey_macro)** – Companion firmware and tool for advanced macros, recording, and playback, fully compatible with the Micropad Remapper.

---

## 🚀 How to Use

1. **Open `index.html`** in Chrome or Edge. Web Serial API must be enabled.
2. **Navigate the Interface:** Sidebar tabs: KEYMAP, MACROS, CONTROLS, SAVE + LOAD, SETTINGS, KEY TESTER.
3. **KEYMAP Tab:**

   * **Assign Keys:** Drag shortcuts onto grid cells or click-to-assign.
   * **Rearrange Keys:** Drag within the 3x3 grid.
   * **Clear Keys:** Click the small 'X' in any key cell.
   * **Layers:** Switch and configure layers; clear current layer as needed.
4. **MACROS Tab:** Add, edit, or delete macros. Assign macros to keys.
5. **CONTROLS Tab:** Enable peripherals, configure analog pins, and select functions.
6. **SAVE + LOAD Tab:**

   * Save/load profiles to browser storage.
   * Export `layers.json` for USB drag-and-drop.
   * Connect to your Pico via Web Serial. Upload, check, or delete `layers.json`.
   * View device logs in real-time.
7. **SETTINGS Tab:** Paste and load an existing `layers.json` configuration.
8. **KEY TESTER Tab:** Press keys on your physical keyboard to see their `key` and `code` values along with active modifiers.

---

## 📁 File Structure

* Single HTML file (`index.html`) containing all HTML, CSS, and JS/React logic.
* No server required; fully client-side.

---

## 📋 Requirements

* Chromium-based browser (Chrome, Edge) with Web Serial API.
* Pico-powered micropad running compatible firmware.
* `layers.json` file for keymap, macros, and peripheral configurations.

---

## 📡 Web Serial Communication Protocol

* **Baud Rate:** 115200 bps
* **Line Endings:** `\n`
* **Response Markers:** `<EOF>` for file data, `<END>` for text responses

**File Operations:**

**Upload (PUT):**

```
PUT layers.json\n
<send raw data>
<EOF>
```

**Download (GET):**

```
GET layers.json\n
<receive data until EOF>
```

**Delete (DEL):**

```
DEL layers.json\n
```

---

## 🛠️ Development Notes

* Built with **React + Tailwind CSS**.
* Uses **@babel/standalone** for in-browser JSX transpiling.
* Profiles saved in **localStorage** for persistence.
* Web Serial API enables USB communication without extra drivers.

---

## 🐛 Troubleshooting

* **Serial Connection Issues:** Use Chromium browser, check USB connection, grant port permissions, and ensure Pico firmware supports 115200 baud.
* **UI Issues:** Refresh browser to reset state.
* **JSON Import Errors:** Ensure `layers.json` follows the expected structure strictly.

---

## ⚖️ License

MIT License – free to use, modify, and distribute.

---

## ✉️ Contact

Open issues on GitHub or contact Trinibos1@proton.me for feature requests, or questions.


