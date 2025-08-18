⚙️ trkey
A modern web-based tool to configure your 3x3 Pico-powered micropad and soon keyboard. Customize key bindings, layers, macros, and peripherals with an intuitive interface, and communicate directly with your device via the Web Serial API.

✨ Features
Full Key Remapping: Assign single keys or complex shortcuts to any of the 9 keys on your micropad. Drag-and-drop or click-to-assign for fast configuration.

Multi-Layer Support: Configure up to 10 layers for dynamic switching between keysets.

Macro Management: Create, edit, and assign custom macros to any key. Works seamlessly with Trkey Macro.

Peripheral Controls: Control volume, scrolling, or custom QMK keycodes via potentiometers or other peripherals.

Persistent Profiles: Save and load configurations in your browser’s local storage.

Configuration Export: Export a layers.json file compatible with Pico firmware.

Web Serial API: Connect and establish serial communication with your device (Chromium-based browsers) for real-time logging and direct command sending. Note: Direct file upload via Web Serial is not currently supported for CircuitPython's default USB Mass Storage Device (MSC) mode for layers.json. Files must be manually dragged.

Live Key Tester: See key presses and active modifiers for debugging or shortcut mapping.

Responsive UI: Smooth, interactive design using React + Tailwind CSS.

Comprehensive Logging & Interactive Terminal: Monitor communication and operations with your device in real-time, and send direct commands to the connected device.

🔗 Related Projects

Trkey Macropad – The official Pico-powered macropad hardware and firmware. This project provides the physical device and underlying firmware that works seamlessly with the Micropad Remapper, supporting key assignments, layers, macros, and peripheral controls.

🚀 How to Use
Open index.html in Chrome or Edge. Web Serial API must be enabled.

Navigate the Interface: Sidebar tabs: KEYMAP, MACROS, CONTROLS, SAVE + LOAD, TERMINAL, SETTINGS, KEY TESTER.

KEYMAP Tab:

Assign Keys: Drag shortcuts onto grid cells or click-to-assign.

Rearrange Keys: Drag within the 3x3 grid.

Clear Keys: Click the small 'X' in any key cell.

Layers: Switch and configure layers; clear current layer as needed.

MACROS Tab: Add, edit, or delete macros. Assign macros to keys.

CONTROLS Tab: Enable peripherals, configure analog pins, and select functions.

SAVE + LOAD Tab:

Save/load profiles to browser storage.

Export layers.json for USB drag-and-drop onto the CIRCUITPY drive.

Connect to your Pico via Web Serial for logging, checking, or deleting files (manual drag-and-drop for upload).

TERMINAL Tab:

View device logs in real-time.

Type commands into the input field and click "Send" (or press Enter) to interact directly with your connected Pico.

SETTINGS Tab: Paste and load an existing layers.json configuration.

KEY TESTER Tab: Press keys on your physical keyboard to see their key and code values along with active modifiers.

📁 File Structure
Single HTML file (index.html) containing all HTML, CSS, and JS/React logic.

No server required; fully client-side.

📋 Requirements
Chromium-based browser (Chrome, Edge) with Web Serial API enabled.

Pico-powered micropad running compatible firmware (e.g., CircuitPython).

layers.json file for keymap, macros, and peripheral configurations.

📡 Web Serial Communication Protocol
Baud Rate: 115200 bps

Line Endings: \n

Response Markers: <EOF> for file data, <END> for text responses

File Operations:

Upload (PUT): (Note: For layers.json, manual drag-and-drop is currently required due to CircuitPython's MSC mode.)

PUT layers.json\n
<send raw data>
<EOF>


Download (GET):

GET layers.json\n
<receive data until EOF>


Delete (DEL):

DEL layers.json\n


⌨️ Supported Shortcuts
This configurator supports a wide range of standard and specialized keycodes, organized into intuitive categories. You can assign any of these to your micropad keys.

Standard Alphanumeric
A (A)

B (B)

C (C)

D (D)

E (E)

F (F)

G (G)

H (H)

I (I)

J (J)

K (K)

L (L)

M (M)

N (N)

O (O)

P (P)

Q (Q)

R (R)

S (S)

T (T)

U (U)

V (V)

W (W)

X (X)

Y (Y)

Z (Z)

ONE (1)

TWO (2)

THREE (3)

FOUR (4)

FIVE (5)

SIX (6)

SEVEN (7)

EIGHT (8)

NINE (9)

ZERO (0)

Basic Controls
ENTER (Enter)

ESCAPE (Esc)

TAB (Tab)

SPACEBAR (Space)

BACKSPACE (Bksp)

DELETE (Del)

CAPS_LOCK (Caps)

INSERT (Ins)

HOME (Home)

PAGE_UP (PgUp)

PAGE_DOWN (PgDn)

END (End)

APPLICATION (App Key)

Function Keys
F1 (F1)

F2 (F2)

F3 (F3)

F4 (F4)

F5 (F5)

F6 (F6)

F7 (F7)

F8 (F8)

F9 (F9)

F10 (F10)

F11 (F11)

F12 (F12)

Navigation Keys
RIGHT_ARROW (R Arrow)

LEFT_ARROW (L Arrow)

DOWN_ARROW (Dn Arrow)

UP_ARROW (Up Arrow)

Numpad Keys
KEYPAD_NUMLOCK (NumLk)

KEYPAD_SLASH (Kp /)

KEYPAD_ASTERISK (Kp *)

KEYPAD_MINUS (Kp -)

KEYPAD_PLUS (Kp +)

KEYPAD_ENTER (Kp Ent)

KEYPAD_ONE (Kp 1)

KEYPAD_TWO (Kp 2)

KEYPAD_THREE (Kp 3)

KEYPAD_FOUR (Kp 4)

KEYPAD_FIVE (Kp 5)

KEYPAD_SIX (Kp 6)

KEYPAD_SEVEN (Kp 7)

KEYPAD_EIGHT (Kp 8)

KEYPAD_NINE (Kp 9)

KEYPAD_ZERO (Kp 0)

KEYPAD_PERIOD (Kp .)

Symbols & Punctuation
COMMA (Comma (,))

PERIOD (Period (.))

GRAVE_ACCENT (Grave Accent (`) / Tilde (~))

MINUS (Minus (-))

EQUAL (Equal (=))

LEFT_BRACKET (Left Bracket ([))

RIGHT_BRACKET (Right Bracket (]))

BACKSLASH (Backslash ())

SEMICOLON (Semicolon (;))

QUOTE (Quote (') / Double Quote ("))

SLASH (Slash (/))

NON_US_SLASH (Non-US Slash (|))

Modifier Keys
LEFT_CONTROL (L Ctrl)

LEFT_SHIFT (L Shift)

LEFT_ALT (L Alt)

LEFT_GUI (L GUI (Windows/Command))

RIGHT_CONTROL (R Ctrl)

RIGHT_SHIFT (R Shift)

RIGHT_ALT (R Alt)

RIGHT_GUI (R GUI (Windows/Command))

Common Combination Shortcuts
CONTROL_C (Copy)

CONTROL_V (Paste)

CONTROL_X (Cut)

CONTROL_Z (Undo)

CONTROL_Y (Redo)

CONTROL_S (Save)

CONTROL_A (Sel All)

CONTROL_F (Find)

CONTROL_P (Print)

ALT_TAB (App Switch)

GUI_D (Desktop)

CONTROL_SHIFT_ESCAPE (TaskMgr)

ALT_ENTER (Fullscreen)

ALT_F4 (Close Win)

PRINT_SCREEN (PrtSc)

SCROLL_LOCK (ScrLk)

PAUSE (Pause)

Text Editing Shortcuts
CONTROL_L (Align L)

CONTROL_R (Align R)

CONTROL_E (Align C)

CONTROL_B (Bold)

CONTROL_I (Italic)

CONTROL_U (Undrl)

SHIFT_ARROW (Nudge/Select Text)

CONTROL_SPACEBAR (Suggest)

CONTROL_FORWARD_SLASH (Comment)

ALT_UP_ARROW (Line Up)

ALT_DOWN_ARROW (Line Dn)

SHIFT_ALT_DOWN_ARROW (Copy Line)

CONTROL_SHIFT_K (Del Line)

CONTROL_ENTER (Ins Line B)

CONTROL_SHIFT_ENTER (Ins Line A)

Development Shortcuts
CONTROL_SHIFT_RIGHT_BRACKET (Jmp Brkt)

CONTROL_TAB (Next Edit)

CONTROL_SHIFT_TAB (Prev Edit)

CONTROL_W (Close Tab)

CONTROL_GRAVE_ACCENT (Term Tog)

CONTROL_B_SIDEPANEL (Side Tog)

CONTROL_J (Panel Tog)

CONTROL_SHIFT_E (Explorer)

CONTROL_SHIFT_F_SEARCH (File Srch)

CONTROL_SHIFT_G (Git)

CONTROL_SHIFT_D_DEBUG (Debug)

CONTROL_SHIFT_X_EXTENSIONS (Extens)

CONTROL_N (New File)

CONTROL_O (Open File)

Media Controls
VOLUME_INCREMENT (Vol Up)

VOLUME_DECREMENT (Vol Down)

MUTE (Mute)

PLAY_PAUSE (Play/Pse)

SCAN_PREVIOUS_TRACK (Prev Trk)

SCAN_NEXT_TRACK (Next Trk)

Mouse Actions
MOUSE_BUTTON_1 (L Click)

MOUSE_BUTTON_2 (R Click)

MOUSE_BUTTON_3 (M Click)

MOUSE_WHEEL_UP (Scroll Up)

MOUSE_WHEEL_DOWN (Scroll Dn)

ALT_DRAG (Alt Drag)

SHIFT_DRAG (Shft Drag)

CONTROL_CLICK (Ctrl Click)

CONTROL_MIDDLE_CLICK (Ctrl M Click)

SHIFT_LEFT_CLICK (Shft L Click)

SHIFT_RIGHT_CLICK (Shft R Click)

DOUBLE_CLICK (Dbl Click)

Custom Macros
MACRO_1 (Custom Macro 1)

MACRO_2 (Custom Macro 2)

MACRO_3 (Custom Macro 3)

MACRO_4 (Custom Macro 4)

MACRO_5 (Custom Macro 5)

System Controls
POWER (Power Off)

SLEEP (Sleep)

WAKE (Wake From Sleep)

Minecraft Specific
W_KEY (Move Forward)

A_KEY (Move Left)

S_KEY (Move Backward)

D_KEY (Move Right)

DOUBLE_SPACE (Toggle Fly)

NUMBER_HOVER (Hotbar Slot Select)

F3_D (Clear Chat History)

F3_N (Toggle Gamemode)

F3_C (Crash Game)

F3_A (Reload Chunks)

KiCad Specific
CONTROL_SCROLL (Zoom View)

ALT_ONE (Lyr Vw 1)

ALT_TWO (Lyr Vw 2)

ALT_THREE (Lyr Vw 3)

ALT_FOUR (Lyr Vw 4)

ALT_FIVE (Lyr Vw 5)

Fusion360 Specific
SHIFT_SCROLL (Pan View)

Web Browser Shortcuts
CONTROL_T (New Tab)

CONTROL_W_BROWSER (Close Tab)

CONTROL_SHIFT_T (Reopen Last Tab)

CONTROL_TAB_BROWSER (Next Tab)

CONTROL_SHIFT_TAB_BROWSER (Previous Tab)

CONTROL_L_ADDRESS (Focus Address Bar)

ALT_LEFT_ARROW (Back)

ALT_RIGHT_ARROW (Forward)

F5 (Reload Page)

CONTROL_PLUS (Zoom In)

CONTROL_MINUS (Zoom Out)

CONTROL_ZERO (Reset Zoom)

Audio/Video Editing
SPACEBAR_PLAY (Play/Pause)

J_KEY (Rewind)

K_KEY (Pause/Play)

L_KEY (Fast Forward)

I_KEY_IN (Mark In)

O_KEY_OUT (Mark Out)

CONTROL_ALT_Z (History Undo)

SHIFT_DELETE (Ripple Delete)

Design/Graphics
CONTROL_SHIFT_N (New Layer)

CONTROL_G_GROUP (Group Layers)

CONTROL_SHIFT_G_UNGROUP (Ungroup Layers)

CONTROL_T_TRANSFORM (Free Transform)

V_KEY_MOVE (Move Tool)

P_KEY_PEN (Pen Tool)

B_KEY_BRUSH (Brush Tool)

E_KEY_ERASER (Eraser Tool)

🛠️ Architectural Overview & Data Flow
The Trkey Configurator operates as a single-page application (SPA) built with React and styled with Tailwind CSS. Its core function is to generate and manage a .json configuration file that the CircuitPython firmware on your Pico MacroPad can interpret.

The primary data flow is as follows:

User Interaction (Frontend): You manipulate the graphical interface (keymap grid, macro editor, etc.).

State Management (React): All your configurations are held in the React component's state, providing real-time updates to the UI.

Local Persistence (Browser localStorage): Your entire profile is serialized as a JSON string and saved to your browser's localStorage for quick recall.

Export (JSON File Generation): A layers.json file, precisely formatted for the Pico firmware, is generated and made available for download.

Device Transfer (Manual CIRCUITPY Drag-and-Drop): For the Pico, direct Web Serial API upload is not currently supported for file transfer due to CircuitPython's default USB Mass Storage Device (MSC) mode. Instead, you manually drag and drop the exported layers.json file onto the Pico’s CIRCUITPY drive, which appears as a USB drive when connected to your computer.

Firmware Consumption (Pico): The CircuitPython code.py on your Pico reads this layers.json file at startup to load the keymap, macro definitions, and other settings.

🖥️ Interface Breakdown: Beyond the Buttons
a. KEYMAP Configuration: The Logical Grid
This section is where the mapping between physical key presses and their logical HID (Human Interface Device) outputs is defined across multiple layers.

Keymap Grid (3x3): Each cell (row, col) within a specific layer holds an object with tap and hold properties.

tap Action: The primary action executed upon a quick press and release of the physical button. This is the most commonly used assignment.

hold Action (Planned/Advanced): While the UI structure supports a hold action, the current Pico firmware (code.py) primarily implements tap actions. Implementing hold would require additional state tracking (e.g., time.monotonic() comparisons for press duration) within the firmware's button scanning logic.

Multi-Layer Support: The configurator supports multiple layers (e.g., Layer 0, Layer 1). The NUM_LAYERS_PICO constant in the frontend dictates how many layers are available in the UI. When exported, each layer becomes a distinct object within the layers.json array.

Drag & Drop / Click-to-Assign: These actions directly manipulate the nested keymap state, updating which shortcut object (containing combo and description) is associated with each (layer, row, col) tuple.

"SHORTCUTS" Pool: This dynamic pool of predefined actions is sourced from the presets object in constants.js.

Categories: The categories (STANDARD_KEYS, MODIFIER_KEYS, COMBINATION_SHORTCUTS, MEDIA_CONTROLS, MOUSE_ACTIONS, MACROS, LAYER_CONTROLS, SYSTEM_CONTROLS, RGB_LIGHTING_CONTROLS, MINECRAFT_SPECIFIC, WAR_THUNDER_SPECIFIC, ROBLOX_STUDIO_SPECIFIC, LINUX_COMMANDS, KICAD_SPECIFIC, FUSION360_SPECIFIC) are logical groupings for user convenience. Each combo string within these categories is designed to be directly interpretable by the Pico firmware's KEY_MAP or send_key_action logic.

Search and Filter: The integrated search and category filters efficiently narrow down the shortcutPool for rapid assignment.

b. MACRO MANAGEMENT: Pre-programmed Sequences ✍️
The "MACROS" tab allows for the creation of custom text or key sequence macros.

Macro Structure: Each macro is defined by a name (for UI reference) and a sequence string.

Sequence Interpretation: The sequence string can contain literal characters. Special characters like \n (newline/Enter) are processed by the Pico firmware's execute_macro function, which translates them into Keycode.ENTER presses. Implementing other special keys (e.g., ALT_TAB within a macro) would require custom parsing within the execute_macro function on the Pico.

Export: Macros are exported as an array of objects ({ "name": "...", "sequence": "..." }) and embedded directly into the first layer's object within the layers.json file, as per the pico-macropad-layers-json-example.

c. PERIPHERAL CONTROLS (Streamlined for Pico Compatibility) ⚙️
The "CONTROLS" tab manages potentiometer configuration.

Potentiometer Configuration: You can enable a potentiometer and configure its analog pin on the Pico.

Function Assignment: Assign common functions like volume control or scroll (mouse wheel).

Custom QMK Keycode: For advanced users, a custom function allows you to specify a QMK-like keycode. Note: The Pico firmware's handling of these custom actions is simplified and may require further development in code.py to fully interpret complex QMK keycodes or send specific HID reports beyond standard media keys.

d. SAVE + LOAD Profile: Local Persistence 💾
This tab manages the persistence of your configuration data within your browser.

localStorage Key: Your full configurator profile (keymap, macros, potentiometer config) is saved as a JSON string under the key "trkey_profile_pico" in your browser’s localStorage. This is separate from previous trkey_profile keys to avoid conflicts.

Export Configuration as layers.json: This is the primary method for transferring your configured keymap and macros to the Pico. The exported JSON rigorously adheres to the layers.json structure expected by the CircuitPython firmware.

Structure: The layers.json is an array of layer objects. Each layer object contains name, labels (for OLED display), keys (the actual HID commands), and macros (if defined for that layer, usually only the first).

Manual Upload: You must manually drag this generated layers.json file into the CIRCUITPY drive that appears when your Pico is connected in CircuitPython mode.

Upload to Device (Web Serial) (Manual for Files): This button is present in the UI but will display an error for file uploads. The Web Serial API is supported for general serial communication and reading device logs, but CircuitPython's default behavior for file transfer relies on MSC (appearing as a USB drive). A custom serial protocol for file transfer would need to be implemented in the Pico's code.py to make this button functional.

e. SETTINGS: Raw JSON Import 🛠️
The "SETTINGS" tab provides a power-user feature for direct JSON manipulation.

Direct JSON Input: You can paste an existing layers.json structure (e.g., one manually created or retrieved from another Pico) directly into the textarea.

Parsing and Loading: The application parses this JSON, attempts to match the combo strings to known presets, and reconstructs the keymap and macro states. This allows for advanced users to bypass the graphical editor for bulk edits or to import complex configurations.

Strict Format: It expects the layers.json to be a root-level JSON array containing layer objects, each with a keys array (9 elements) and an optional labels array (9 elements). Macros are expected within the first layer's object.

f. KEY TESTER: HID Event Diagnostics 🔍
The "KEY TESTER" tab is a utility for diagnosing keyboard HID events.

Raw Event Capture: It listens for keydown and keyup JavaScript events.

Detailed Output: Displays the e.key (character value) and e.code (physical key identifier) for each pressed key, along with a timestamp. This is invaluable for understanding how your operating system registers key presses, which helps in debugging complex keymap assignments.

📡 The layers.json Protocol: Bridge to the Pico 🌉
The layers.json file is the central artifact that bridges the web configurator and your Pico firmware.

a. File Structure (from example-pico-json)
[
  {
    "name": "Layer 0",
    "labels": [ /* 9 string labels for OLED */ ],
    "keys": [ /* 9 string key commands */ ],
    "macros": [ /* Array of macro objects */ ]
  },
  {
    "name": "Layer 1",
    "labels": [ /* 9 string labels for OLED */ ],
    "keys": [ /* 9 string key commands */ ]
  }
]


Root Array: The entire file is a JSON array, where each element represents a layer. The order of elements in this array corresponds directly to Layer 0, Layer 1, etc., in the firmware.

name (string): A descriptive name for the layer, displayed on the OLED.

labels (array of strings): A required 9-element array. These strings correspond to the text that the Pico's OLED display will show for each of the 9 physical buttons on that specific layer. An empty string "" is used for unlabeled keys.

keys (array of strings): A required 9-element array. Each string here is a "command" that the Pico's code.py firmware interprets. These map to:

Standard Keycodes: E.g., "M", "DELETE", "F1". The KEY_MAP in code.py translates these to adafruit_hid.keyboard_keycode.Keycode values.

Modifier Combinations: E.g., "CONTROL_C", "CONTROL_Y". The send_key_action function in code.py parses these by splitting the string (_) and pressing multiple Keycode objects simultaneously.

Media Control Codes: E.g., "PLAY_PAUSE", "VOLUME_INCREMENT". These map to adafruit_hid.consumer_control_code.ConsumerControlCode values.

Macro Calls: E.g., "MACRO_1". These strings reference entries in the macros array. The execute_macro function in code.py handles typing the associated sequence.

Layer Controls: E.g., "TG_1" (Toggle Layer 1), "MO_1" (Momentary Layer 1), "TO_0" (To Layer 0). These are special strings that the code.py explicitly recognizes and uses to modify the current_layer_index variable in the firmware.

QMK Lighting Commands: E.g., "RGB_TOG". These are custom strings. The code.py firmware includes placeholders for these, but they would require additional CircuitPython code to send custom HID reports or control attached RGB LEDs directly (as standard USB HID doesn't have native RGB controls).

macros (array of objects): This optional array should be present within the first layer’s object (Layer 0). Each object within this array defines a macro:

name (string): A human-readable identifier for the macro.

sequence (string): The exact string of characters to be "typed" when the macro is triggered. Special characters like \n (for newline/Enter) are supported.

🤖 Firmware Interaction: The code.py Role 🤖
The code.py file on your Raspberry Pi Pico is the runtime engine for your macro pad. It's written in CircuitPython and is responsible for:

Hardware Initialization: Setting up GPIO pins for button matrix scanning and I2C for the OLED display.

Configuration Loading: Reading the layers.json file at startup and parsing its content into usable layers_data and macros variables.

Matrix Scanning: Continuously scanning the 3x3 button matrix to detect button presses and releases.

Debouncing: The DEBOUNCE_DELAY (0.050 seconds) in code.py is crucial. It filters out electrical noise from mechanical buttons, ensuring a single physical press registers as a single logical event. An increased delay (as currently implemented) can make the button feel less responsive but more stable.

HID Event Dispatch: Translating button presses into USB HID (Human Interface Device) reports (keyboard key presses, consumer control events for media keys) that your connected computer understands.

KEY_MAP: This dictionary in code.py is the core translator, mapping the combo strings from layers.json to adafruit_hid.keyboard_keycode.Keycode or adafruit_hid.consumer_control_code.ConsumerControlCode objects.

Macro Execution: The execute_macro function handles the "typing" of macro sequences, character by character, with a small time.sleep(0.1) delay between each character to ensure proper registration by the host system.

Layer Switching Logic: Functions like toggle_layer, momentary_layer, and to_layer dynamically change the current_layer_index based on TG_X, MO_X, and TO_X commands, effectively changing the active keymap.

OLED Display Updates: The update_oled_display and flash_key_label functions handle rendering the current layer's name and key labels, providing visual feedback on the macro pad itself. The flash_key_label also has a 0.2 second delay for the visual flash duration.

Main Loop Delay: The time.sleep(0.02) at the end of the main_loop in code.py introduces a 20 millisecond delay in each iteration. This impacts the overall responsiveness of the button scanning and LED updates.

By understanding these intricate details, you gain the knowledge to not only use the Trkey Configurator but also to modify and extend its functionality, tailoring your macro pad to truly unique specifications.

🐛 Troubleshooting
Serial Connection Issues: Use Chromium browser, check USB connection, grant port permissions, and ensure Pico firmware supports 115200 baud.

UI Issues: Refresh browser to reset state.

JSON Import Errors: Ensure layers.json follows the expected structure strictly.

⚖️ License
MIT License – free to use, modify, and distribute.

✉️ Contact
Open issues on GitHub or contact Trinibos1@proton.me for feature requests, or questions.

Trkey Keyboard Support: Coming Soon!
