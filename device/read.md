
# ⚙️ Trkey Macropad Firmware

This is the **Trkey macropad firmware**, designed for a 3×3 macropad with full USB HID support.  
It integrates seamlessly with **Trkey Mapper** via WebSerial for layer/keymap configuration.

---

## 📂 Firmware Files

* **`code.py`** → main firmware (handles keys, HID, layers).  
* **`webserial_fs.py`** → USB CDC file server for Trkey Mapper.  
* **`layers.json`** → keymap definition uploaded by the user.  
* **`adafruit_hid`**
> All three files must reside on the **CIRCUITPY** drive.

---

## 1️⃣ Layers & JSON

The firmware loads `layers.json` at startup and whenever a `RELOAD` command is received via USB.

### Example `layers.json`

```json
{
  "layers": [
    {
      "name": "Default",
      "labels": ["A", "B", "C", "Copy", "Paste", "Mute", "Next", "Prev", "Vol+"],
      "keys":   ["A", "B", "C", "CONTROL_C", "CONTROL_V", "MUTE", "MEDIA_NEXT", "MEDIA_PREVIOUS", "VOLUME_UP"]
    },
    {
      "name": "Nav",
      "labels": ["←", "→", "↑", "↓", "TO(0)", "MO(2)", "TT(2)", "DF(1)", " "],
      "keys":   ["LEFT_ARROW", "RIGHT_ARROW", "UP_ARROW", "DOWN_ARROW", "TO(0)", "MO(2)", "TT(2)", "DF(1)", "NO_OP"]
    },
    {
      "name": "Gaming",
      "labels": ["W", "A", "S", "D", " ", " ", " ", " ", " "],
      "keys":   ["W", "A", "S", "D", "SPACE", "NO_OP", "NO_OP", "NO_OP", "NO_OP"]
    }
  ]
}
````

### JSON Rules

* Each layer must have `name`, `labels[]`, and `keys[]`.
* Length of `labels[]` and `keys[]` must match.
* Keys can be:

  * Standard HID (`A`, `B`, `ENTER`)
  * Combos (`CONTROL_C`, `CONTROL_V`)
  * Media keys (`MUTE`, `PLAY_PAUSE`, `VOLUME_UP`)
  * Layer commands (`TO(x)`, `MO(x)`, `TT(x)`, `DF(x)`)
  * `NO_OP` → empty key

---

## 2️⃣ Layer Switching

Software-based layer switching is supported:

| Command | Behavior                                          |
| ------- | ------------------------------------------------- |
| `TO(x)` | Switch permanently to layer `x`                   |
| `MO(x)` | Momentary layer switch (active while key held)    |
| `TT(x)` | Toggle layer `x` on/off                           |
| `DF(x)` | Set default layer to `x` (persists until next DF) |

> Internally, the firmware maintains a **layer stack**:
>
> * `get_current_layer()` → top of stack
> * `DF(x)` → resets stack to `[x]`
> * `MO(x)` → pushes/pops layers on press/release

---

## 3️⃣ Key Processing Pipeline

When a button is pressed:

```python
keyname = layers[current_layer]["keys"][i]
send_key(keyname)
```

### `send_key()` Behavior

1. Layer switching (`TO`, `MO`, `TT`, `DF`)
2. Combos (`CONTROL_C`, etc.) → sent via `keycode_map`
3. Media keys → sent via `consumer_map`
4. Regular HID key (`A`, `ENTER`) → mapped via `adafruit_hid.keycode.Keycode`
5. `NO_OP` → ignored

---

## 4️⃣ HID Devices

* `Keyboard(usb_hid.devices)` → standard keys
* `ConsumerControl(usb_hid.devices)` → media controls
```python
keycode_map = {
    "CONTROL_C": (Keycode.CONTROL, Keycode.C),
    "CONTROL_V": (Keycode.CONTROL, Keycode.V),
    "CONTROL_Z": (Keycode.CONTROL, Keycode.Z),
    "CONTROL_X": (Keycode.CONTROL, Keycode.X),
    "CONTROL_S": (Keycode.CONTROL, Keycode.S),
    "CONTROL_F": (Keycode.CONTROL, Keycode.F),
    "CONTROL_Y": (Keycode.CONTROL, Keycode.Y),
}

consumer_map = {
    "PLAY_PAUSE": ConsumerControlCode.PLAY_PAUSE,
    "MUTE": ConsumerControlCode.MUTE,
    "VOLUME_DECREMENT": ConsumerControlCode.VOLUME_DECREMENT,
    "VOLUME_INCREMENT": ConsumerControlCode.VOLUME_INCREMENT,
    "SCAN_NEXT_TRACK": ConsumerControlCode.SCAN_NEXT_TRACK,
    "SCAN_PREVIOUS_TRACK": ConsumerControlCode.SCAN_PREVIOUS_TRACK,
}
---
```
## 5️⃣ Key Repeat

* Each button tracks: `repeat_active[i]`, `repeat_start[i]`, `repeat_last[i]`
* Behavior:

  * Delay before repeat: **0.4s**
  * Repeat rate: **0.05s**

---

## 6️⃣ WebSerial File Server

Trkey Mapper communicates via **`webserial_fs.py`**:

| Command      | Action                                          |
| ------------ | ----------------------------------------------- |
| `LIST`       | List files in root                              |
| `DEL <file>` | Delete file                                     |
| `PUT <file>` | Upload file (terminated with `<EOF>`)           |
| `GET <file>` | Download file                                   |

> Used for updating layers or firmware directly from the browser.

---

## 7️⃣ Extension Points

### 🔹 Macros

```json
"keys": ["MACRO_1"],
"macros": [{ "name": "Sig", "sequence": "Best,\nTrkey Dev" }]
```

```python
if keyname.startswith("MACRO_"):
    idx = int(keyname.split("_")[1]) - 1
    sequence = layers[0]["macros"][idx]["sequence"]
    type_text(sequence)
```


### 🔹 Advanced Layer Switching

Supports `TO`, `MO`, `TT`, `DF`. Could extend with:

* `LT(x, KC)` → Layer-Tap
* `TG(x)` → Toggle layer shortcut
* Combos or tap/hold detection

---

## 🔑 Developer Summary

* Layers → `layers.json`
* HID events → `send_key()`
* Layer switching → `TO`, `MO`, `TT`, `DF`
* WebSerial → `webserial_fs.py`



```
