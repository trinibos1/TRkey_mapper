

---

```markdown
# 🎹 Micropad Key Mapper

**Unlock the power of your 3x3 Micropad** — customize every key with your favorite shortcuts, switch between profiles, and connect effortlessly via USB serial. A sleek, modern web app designed for makers, coders, and creatives who want full control of their micro keyboard.

---

## 🚀 Features

- **Seamless Serial Connection:** Connect to your Micropad device via USB using the Web Serial API.
- **Intuitive 3x3 Key Layout:** Visualize and map all 9 keys with a clean, interactive interface.
- **4 Configurable Profiles:** Save and switch between multiple profiles to fit your workflow.
- **OS-Aware Shortcuts:** Auto-detect Windows, macOS, or Linux and adapt shortcut labels accordingly.
- **Custom Shortcut Mapping:** Assign complex key combos (e.g., Ctrl + Alt + M) to each pad button.
- **Real-Time Communication:** Changes instantly sent to your Micropad for immediate effect.
- **Persistent Storage:** Profiles saved locally in your browser for easy recall.

---

## 🔧 Getting Started

### Prerequisites

- Micropad hardware connected via USB serial port (115200 baud).
- A Chromium-based browser (Chrome, Edge, Opera) with Web Serial API support.
- Optional: Serve files over a local web server for best compatibility (e.g., `live-server`, Python's `http.server`).

### Installation

1. Clone or download this repo.
2. Serve the files or open `index.html` in a compatible browser.
3. Click **Connect to Micropad** and select your device.
4. Map your shortcuts and save profiles.

---

## 🎯 How to Use

1. **Connect:** Click the connect button and authorize your Micropad device.
2. **Select a Key:** Click any of the 9 keys in the 3x3 grid.
3. **Assign Shortcut:** Enter your desired key combo in the input box, then click **Assign**.
4. **Save Profile:** Store your mappings by clicking **Save Profile**.
5. **Switch Profiles:** Toggle between 4 profiles anytime — perfect for different apps or workflows.
6. **Disconnect:** When done, safely disconnect your Micropad.

---

## 🔌 Serial Communication Protocol

Commands sent to the device follow this format:

```

SETUP:<keyIndex>:<shortcut>\n

```

- `<keyIndex>`: Number between 0-8, representing the key on the 3x3 grid.
- `<shortcut>`: Shortcut string, e.g. `Ctrl+Alt+M`.

Example command:

```

SETUP:3\:Shift+F5

```

Ensure your Micropad firmware listens and parses these commands to update key mappings on the device.

---

## 💾 Profiles

- 4 user profiles available, labeled **1** to **4**.
- Each profile stores mappings for all keys.
- Profiles saved in browser's local storage under `micropadProfiles`.
- Persistent between sessions unless cleared.
- Switch profiles on the fly for different usage contexts.

---

## 🌐 Supported Browsers

| Browser           | Web Serial API Support |
|-------------------|-----------------------|
| Google Chrome     | ✅                    |
| Microsoft Edge    | ✅                    |
| Opera             | ✅                    |
| Firefox           | ❌                    |
| Safari            | ❌                    |

---

## 🎉 Credits

- **Developed by:** [trinibos1]  
- **Special Thanks:** trinibos1 — for invaluable insights and support.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Contribute

Feel free to open issues or pull requests! Help improve the Micropad Key Mapper for everyone.

---

Happy mapping! 🎹✨
```

---

