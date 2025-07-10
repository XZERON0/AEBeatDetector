# 🎧 AE Beat Marker — Automatic Beat Markers for After Effects

> A fast, lightweight, and free solution for automatically placing markers on audio peaks (beats) directly in After Effects.

---

## ⚠️ Important

This script is written in **Russian**.  
If your After Effects interface uses a different language (e.g., English), please **translate the field values manually** in the script UI so they match the names in your composition.

If markers do not appear:
- Check that all layer and property names in the script match your composition
- Ensure the correct audio channel and amplitude parameter are used
- Verify the amplitude threshold is not too high

---

## 🚀 Features

- ⚡ Automatically adds markers to a composition based on audio peaks  
- 🔧 Adjustable sensitivity threshold and minimum interval between beats  
- 🧠 Uses values from `Audio Amplitude` → `Both Channels`  
- 🪄 No external libraries, licenses, or dependencies required  
- ✅ Compatible with AE 2024+ (works even on cracked versions)

---

## ⚙️ Parameters Overview

When you run the script, you’ll see several input fields. Here’s what each one does:

1. **Layer name** – Name of the `Audio Amplitude` layer.  
   Usually `"Audio Amplitude"` by default. If you're using a non-Russian version of AE, replace this with the actual name in your composition.

2. **Effect name** – The audio channel to analyze.  
   Common values: `"Both Channels"`, `"Left Channel"`, or `"Right Channel"`. Adjust if your AE language differs.

3. **Property name** – The property used for amplitude detection.  
   Typically `"Slider"` or localized equivalent.

4. **Amplitude threshold** – Minimum peak level required to place a marker.  
   Useful values might be 25, 45, 60 — test your audio to determine a good threshold.

5. **Minimum interval (frames)** – Minimum number of frames between beats.  
   Prevents overcrowding of markers.

6. **Marker name** – Text that will appear on each marker.

7. **Enable numbering** – If enabled, markers will be numbered sequentially.

8. **Marker color** – (Optional) Choose a custom marker color.

---

## 📦 Installation

1. Download the [`beatMarker.jsx`](./beatMarker.jsx) file  
2. In After Effects, go to `File > Scripts > Run Script File…`  
3. Select the composition that includes an `Audio Amplitude` layer  
4. Run the script — markers will appear automatically!

💡 **Pro tip:** For easier access, place the script in the `Scripts` or `ScriptUI Panels` folder.

---

## 📝 Notes

- The script is standalone — no setup or dependencies required  
- Works best with clearly defined audio peaks  
- Perfect for editors, motion designers, and VFX artists needing fast beat syncing

---

## 📃 License

This project is released under the [MIT License](./LICENSE).
