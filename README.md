# 🌸 Traditional Kerala Pookalam

An **interactive 3D Pookalam** built with Three.js — an authentic Onam flower carpet rendered in real-time WebGL.

🔗 **Live Demo:** [pookalam-one.vercel.app](https://pookalam-one.vercel.app)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎬 **Assembly Animation** | Elements assemble center-outward, dropping into place with per-type easing |
| 🌸 **Mouse Drag Interaction** | Click & drag anywhere on the pookalam to scatter tiny flower petals |
| 🌙 ☀️ **Dark / Light Mode** | Smooth theme toggle between dark charcoal and warm daylight |
| 🎥 **Camera Presets** | 5 camera angles — 3D, Top View, Low Angle, Side, Close-up |
| 🔄 **Auto-Rotation** | Gentle continuous spin for a living, breathing feel |
| 🎨 **Authentic Design** | 8 radial arms, traditional Kerala color palette, bead clusters, petal ring |

---

## 🏗️ Tech Stack

- **Three.js** (r180) — 3D rendering via WebGL
- **Vanilla JavaScript** (ES Modules)
- **CSS Custom Properties** — full dark/light theme system
- **No build step** — runs directly in the browser

---

## 🚀 Run Locally

```bash
git clone https://github.com/Athuljose77/Pookalam.git
cd Pookalam
python3 -m http.server 8080
```

Then open **http://localhost:8080** in your browser.

> ⚠️ A local server is required because the project uses ES Modules (`type="module"`).

---

## 🎮 How to Interact

- **Click & drag** on the pookalam → petals burst from your cursor
- **Camera buttons** (bottom bar) → switch between 5 view angles
- **🌙 / ☀️ button** (top-right) → toggle dark / light mode
- **Scroll / pinch** → zoom in and out
- **Right-click drag** → pan the camera

---

## 📁 Project Structure

```
├── index.html
├── css/
│   └── style.css          # Theme tokens + UI styles
└── js/
    ├── main.js             # App entry point
    ├── animation/
    │   ├── assembly.js     # Opening assembly animation
    │   └── mouseBurst.js   # Drag-to-scatter petal effect
    ├── controls/
    │   ├── controls.js     # Camera preset transitions
    │   └── interaction.js  # Hover effects
    ├── pookalam/
    │   ├── pookalam.js     # Assembles all layers
    │   ├── centerFlower.js
    │   ├── fanSegments.js
    │   ├── innerFill.js
    │   ├── middlePetals.js
    │   ├── outerBorder.js
    │   ├── petalRing.js
    │   └── triangleMotifs.js
    └── scene/
        ├── camera.js
        ├── lights.js
        └── scene.js
```

---

## 🌺 About the Design

The pookalam is based on authentic **Kerala Onam flower carpet** patterns:
- **8 radial arms** with arc band rings in yellow, orange, green, saffron
- **Star triangle motifs** with traditional red bead clusters
- **Alternating cream & red middle petals** (jasmine & hibiscus)
- **Warm maroon base disk** as the foundation
- **Orange outer border** with gold bead accents

---

*Made with ❤️ for Onam*
