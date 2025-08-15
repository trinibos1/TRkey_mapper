# ⚙️ 3x3 Micropad Remapper

A powerful web-based configuration tool for your 3x3 Pico-powered micropad keyboard. This tool provides an intuitive interface for customizing your micropad's key bindings, including advanced features like macros and peripheral controls, and allows direct communication with your device via Web Serial API.

---

## ✨ Features

* **Full Key Remapping:** Easily assign single keys or complex shortcuts to any of the 9 keys on your micropad. The intuitive drag-and-drop interface or a simple click-and-assign method makes configuration straightforward.
* **Multi-Layer Support:** Configure up to 2 distinct layers for your keymap, allowing you to switch between different sets of commands on the fly.
* **Drag-and-Drop Layout Editing:** Rearrange key assignments intuitively by dragging them from one cell to another within the 3x3 grid.
* **Macro Management:** Create and manage custom **macros** with specific key sequences. These can be assigned to any key, enabling complex actions with a single press.
* **Peripheral Controls:** Configure external peripherals like potentiometers to control **volume**, **scrolling**, or even **custom QMK keycodes**, enhancing your micropad's versatility.
* **Persistent Profile Saving:** Your keymap, macro definitions, and peripheral configurations can be **saved and loaded directly from your browser's local storage**, ensuring your settings are retained between sessions.
* **Configuration Export:** Export your entire configuration as a **`layers.json`** file, compatible with your Pico-powered micropad firmware. This file defines all layers, key assignments, and macros.
* **Web Serial Device Upload:** Directly connect to your Pico-powered micropad device via the **Web Serial API** (supported on Chromium-based browsers) to upload your `layers.json` configuration. You can also **check the existing file** on your device or **delete it**.
* **Live Key Tester:** Use the integrated **Key Tester** to see detailed information about any key pressed on your physical keyboard, which is helpful for debugging and identifying keycodes.
* **Responsive and Interactive UI:** The user interface is designed to be responsive, providing a consistent experience across various screen sizes. It features smooth modals, clear hover states, and easy navigation.
* **Comprehensive Logging:** A **device log** is available to monitor the communication and operations performed with your Pico, aiding in troubleshooting.

---

## 🚀 How to Use

1.  **Open `index.html`** in a modern Chromium-based browser (like Chrome or Edge). Ensure Web Serial API is enabled in your browser settings if you encounter issues.
2.  **Navigate the Interface:**
    * Use the **sidebar** on the left to switch between different configuration tabs: KEYMAP, MACROS, CONTROLS, SAVE + LOAD, SETTINGS, and KEY TESTER.
3.  **Configure Your Keymap (KEYMAP Tab):**
    * The central **3x3 grid** represents your micropad.
    * **Assign Keys:**
        * **Drag and Drop:** Drag a desired shortcut from the "SHORTCUTS" section (below the grid) directly onto a key cell in the 3x3 grid.
        * **Click-to-Assign:** Click a key cell in the 3x3 grid to select it (it will highlight). Then, click any shortcut in the "SHORTCUTS" list to assign it to the selected cell.
    * **Rearrange Keys:** Drag keys within the 3x3 grid to swap their positions.
    * **Clear a Key:** Click the small 'X' button in the top-right corner of any assigned key cell to clear its assignment.
    * **Manage Layers:** Use the "Layer 0", "Layer 1", etc., buttons above the grid to switch between and configure different layers. You can also click "Clear Current Layer" to clear all assignments on the active layer.
4.  **Manage Macros (MACROS Tab):**
    * Click **"Add New Macro"** to define a custom macro by providing a name and a key sequence (e.g., "Hello World!").
    * **Edit** or **Delete** existing macros using the respective buttons next to each macro entry.
5.  **Configure Peripherals (CONTROLS Tab):**
    * Enable the **potentiometer** and configure its assigned **analog pin** and **function** (Volume Control, Scroll, or Custom QMK Keycode).
6.  **Save, Load & Transfer (SAVE + LOAD Tab):**
    * **Save Profile to Browser:** Saves your current configuration to your browser's local storage.
    * **Load Profile from Browser:** Loads your last saved configuration from browser storage.
    * **Export Configuration as layers.json:** Generates a `layers.json` file for you to download. You can then **drag this file onto your `CIRCUITPY` drive** when your Pico is connected to your computer in USB Mass Storage mode.
    * **Connect to Device:** Click to establish a serial connection with your Pico-powered micropad. You may be prompted to select the device.
    * **Upload layers.json to Device:** Sends your current configuration directly to the connected Pico via Web Serial.
    * **Check layers.json on Device:** Retrieves the `layers.json` file from your connected Pico and displays its content in the Settings tab.
    * **Delete layers.json on Device:** Removes the `layers.json` file from your connected Pico.
    * **Show Device Log:** Toggle to view a real-time log of communication with your connected device.
7.  **Import Configuration (SETTINGS Tab):**
    * Paste an existing `layers.json` configuration into the text area and click **"Load JSON"** to apply it to the configurator.
8.  **Test Your Keys (KEY TESTER Tab):**
    * Simply press keys on your physical keyboard to see their `key` and `code` values, along with active modifier keys (Ctrl, Shift, Alt, Meta).

---

## 📁 File Structure

This application is provided as a **single HTML file (`index.html`)** for ease of use. All HTML markup, CSS styling, and JavaScript/React logic are embedded within this file.

---

## 📋 Requirements

* **Chromium-based browser (Chrome, Edge):** The Web Serial API, crucial for direct device communication, is primarily supported by these browsers.
* **Micropad device:** A Pico-powered micropad keyboard.
* **Micropad firmware:** Your device must be running compatible firmware that understands JSON configuration commands over serial (specifically, expecting a `layers.json` file containing keymap, peripheral, and macro data).

---

## 📡 Communication Protocol (Web Serial)

The web application communicates with the Pico via a simple command-based serial protocol.

* **Baud Rate:** $115200$ bps
* **Line Endings:** All commands sent from the host (web app) to the Pico must be terminated with a newline character (`\n`).
* **Response Termination:** Responses from the Pico are terminated by specific markers:
    * `<EOF>`: End of File marker, used after sending file data (e.g., during `GET`).
    * `<END>`: End of message marker, used after sending text-based responses (e.g., during `DEL` success/failure).

Here's how specific file operations work:

### ⬆️ Upload (PUT)

The host initiates a file upload, then sends the raw byte data of the file.

1.  **Host sends:** `PUT <filename>\n` (e.g., `PUT layers.json\n`)
2.  **Host sends:** Raw binary data of the file in chunks.
3.  **Host sends:** `<EOF>` marker after all data is sent.
4.  **Pico Response:** The Pico processes the incoming data. A typical response after successful reception would be a simple confirmation message, often terminated by `<END>`.

### ⬇️ Download (GET)

The host requests a file from the Pico, and the Pico responds by sending the file's raw byte data.

1.  **Host sends:** `GET <filename>\n` (e.g., `GET layers.json\n`)
2.  **Pico sends:** Raw binary data of the requested file in chunks.
3.  **Pico sends:** `<EOF>` marker after all data is sent.
4.  **Host Processing:** The web application reads data until `<EOF>` is received, then reconstructs the file from the received chunks.

### 🗑️ Delete (DEL)

The host requests the Pico to delete a specified file.

1.  **Host sends:** `DEL <filename>\n` (e.g., `DEL layers.json\n`)
2.  **Pico Response:** The Pico attempts to delete the file. It sends a message indicating success or failure.
    * **Success Example:** `File layers.json deleted successfully.<END>`
    * **Failure Example:** `Error: File not found or could not be deleted.<END>`

---

## 🛠️ Development Notes

* **Web Serial API:** Enables direct USB serial communication between the browser and your Pico.
* **Local Storage:** User profiles are persisted locally in your browser for quick access.
* **React & Tailwind CSS:** The UI is built using React for component-based development and styled efficiently with Tailwind CSS for a modern, responsive design.
* **`@babel/standalone`:** Used to transpile JSX directly in the browser, allowing the single-file React setup.

---

## 🐛 Troubleshooting

* **Serial Connection Fails:**
    * Ensure your browser is Chromium-based (Chrome, Edge).
    * Verify your Pico is properly connected via USB.
    * Check browser permissions and ensure you've granted access to the serial port.
    * The Web Serial API typically requires a secure context (HTTPS) or localhost.
    * Confirm your Pico's firmware is correctly set up for serial communication at **115200 baud rate**.
* **UI Misbehaves:** Try refreshing the page to reset the application state.
* **JSON Import Errors:** Ensure the pasted JSON strictly follows the `layers.json` structure expected by the application.

---

## ⚖️ License

This project is open-source, distributed under the **MIT License**. Feel free to use, modify, and distribute it as you see fit.

---

## ✉️ Contact

For feature requests, bug reports, or any questions, please open an issue on the GitHub repository or contact the project maintainer.

---

*Built for efficient, customizable keypad configuration with modern web tech.*
