# 3x3 Micropad Remapper

A powerful web-based configuration tool for your 3x3 pico-powered micropad keyboard.

---

## Features

- **Full key remapping:** Click keys to assign shortcuts or single keys, with modifier toggles (Ctrl, Alt, Shift).
- **Drag-and-drop layout editing:** Rearrange keys intuitively by dragging them.
- **Preset profiles:** Quickly load predefined shortcuts for popular apps including:
  - Fusion 360
  - Canva
  - KiCad
  - VS Code
  - War Thunder
- **Serial communication:** Connect your micropad device via Web Serial API:
  - Auto-detect and auto-connect if previously paired
  - Send JSON-based mappings
  - Save mappings to device EEPROM persistently
  - Disconnect safely
- **Live key output preview:** See what key or shortcut is currently assigned/edited.
- **QR code generation:** Export your key mapping config as a scannable QR code for easy sharing or backup.
- **Responsive and interactive UI:**
  - Smooth fade-in modals and overlays
  - Hover states and active modifier indicators
  - Theme toggle between light and dark modes using CSS variables
- **Profiles support:** Save/load user profiles with custom mappings.
- **Shortcut suggestion UI:** Shows shortcut suggestions for keys and apps.
- **Gamepad/WebHID support:** (planned for extension)
- **Custom icons and themes:** Display shortcut icons like ⏯, 💾, 🔇 on keys.
- **Physical device echo:** Feedback loop showing assigned key updates in real-time.
- **Persistent profile saving:** Store profiles in local storage for quick reloading.

---

## How to Use

1. **Open `index.html`** in a modern Chromium browser (Chrome, Edge) with Web Serial API enabled.
2. **Assign keys:**
   - Click any key to open the assignment modal.
   - Enter the key or shortcut (e.g. `A`, `Ctrl+S`, `MediaPlayPause`).
   - Use modifier toggles (Ctrl, Alt, Shift) to combine modifiers.
   - Click Save.
3. **Drag & drop keys** within the 3x3 grid to rearrange layouts.
4. **Load presets:**
   - Select your app from the dropdown.
   - Click *Apply Preset* to load predefined shortcuts.
5. **Manage profiles:**
   - Save your current layout as a profile.
   - Load saved profiles from local storage.
6. **Connect your device:**
   - Click *Connect Device*.
   - Grant serial permission.
   - Auto-connect attempts on page load if previously connected.
7. **Send your layout:**
   - Click *Send to Device* to transmit JSON configuration.
   - Click *Save to EEPROM* to persist the config on hardware.
8. **Export/Share:**
   - Export the mapping JSON to a file or clipboard.
   - Generate a QR code for easy transfer.
9. **Switch themes:**
   - Click *Dark Theme* toggle to switch UI modes instantly.
10. **Disconnect:** Click *Disconnect Device* to close serial connection safely.

---

## File Structure

- `index.html`: Main app UI, layout, and markup.
- `styles.css`: Styling for grid, modal, buttons, themes, responsiveness.
- `app.js`: Logic for UI, serial communication, presets, profiles, QR code, theme toggle.

---

## Requirements

- Chromium-based browser (Chrome, Edge) with Web Serial API support.
- Micropad device connected via USB serial (baud rate 115200).
- Micropad firmware that understands JSON `SETUP` and `SAVE` commands over serial.

---

## Development Notes

- The app uses **Web Serial API** for direct USB serial communication — only supported on desktop Chromium browsers.
- Profiles are stored in **localStorage** to persist mappings between sessions.
- The **QR code generator** uses [QRCode.js](https://github.com/davidshimjs/qrcodejs).
- UI interactions use **CSS transitions** and **flexbox/grid** for responsive design.
- Drag-and-drop uses native HTML5 Drag and Drop API.
- Modifier toggles dynamically prepend to keys on assignment.
- Shortcut suggestions can be extended by editing `presets` and `iconMap` in `app.js`.

---

## Extending the App

- Add new app presets by editing the `presets` object in `app.js`.
- Add custom icons by extending the `iconMap`.
- Integrate WebHID/Gamepad support for advanced device input handling.
- Improve profiles UI with import/export JSON files.
- Add cloud sync or backend integration for profile sharing.

---

## Troubleshooting

- If serial connection fails, check browser permissions and USB device access.
- Web Serial API only works in secure contexts (https or localhost).
- Refresh page to reset state if UI misbehaves.
- Use Chrome/Edge latest stable for best compatibility.

---

## License

MIT License — free to use, modify, and distribute.

---

## Contact

For feature requests or issues, open a GitHub issue or contact the maintainer.

---

*Built for efficient, customizable keypad configuration with modern web tech.*

