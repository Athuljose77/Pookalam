import * as THREE from 'three';

import { createScene } from './scene/scene.js';
import { createCamera } from './scene/camera.js';
import { createLights } from './scene/lights.js';
import { createPookalam } from './pookalam/pookalam.js';
import { createControls } from './controls/controls.js';
import { setupInteraction } from './controls/interaction.js';
import { setupAssemblyAnimation } from './animation/assembly.js';
import { setupMouseBurst } from './animation/mouseBurst.js';


// ----------------------------------------
// SCENE & CAMERA
// ----------------------------------------

const scene = createScene();
const camera = createCamera();


// ----------------------------------------
// RENDERER
// ----------------------------------------

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('app').appendChild(renderer.domElement);


// ----------------------------------------
// CONTROLS & LIGHTS
// ----------------------------------------

const controls = createControls(camera, renderer.domElement);
createLights(scene);


// ----------------------------------------
// POOKALAM
// ----------------------------------------

const pookalam = createPookalam();
scene.add(pookalam);


// ----------------------------------------
// ANIMATION & INTERACTION SETUP
// ----------------------------------------

const updateInteraction = setupInteraction(camera, scene, renderer.domElement, pookalam);
const updateAssembly    = setupAssemblyAnimation(pookalam);
const updateMouseBurst  = setupMouseBurst(scene, camera, renderer.domElement, pookalam);
const clock = new THREE.Clock();


// ----------------------------------------
// CAMERA PRESET BUTTONS
// ----------------------------------------

document.querySelectorAll('.camera-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const preset = e.currentTarget.dataset.preset;
        if (preset) {
            controls.setPreset(preset);
            document.querySelectorAll('.camera-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
        }
    });
});


// ----------------------------------------
// DARK / LIGHT MODE THEME TOGGLE
// ----------------------------------------

const THEMES = {
    dark:  { bg: new THREE.Color(0x111111), ambientIntensity: 0.9  },
    light: { bg: new THREE.Color(0xfdf5e6), ambientIntensity: 1.7  },
};

const ambientLight = scene.children.find(c => c.isAmbientLight);
let targetBg    = THEMES.light.bg.clone();
let currentTheme = 'light';

const themeToggleBtn = document.getElementById('theme-toggle');
themeToggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    const t = THEMES[currentTheme];
    targetBg.copy(t.bg);
    if (ambientLight) ambientLight.intensity = t.ambientIntensity;
});


// ----------------------------------------
// ANIMATION LOOP
// ----------------------------------------

function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();

    controls.update();
    controls.updateTransition();

    updateInteraction();
    updateAssembly(deltaTime);  // runs last — overrides interaction during animation
    updateMouseBurst(deltaTime);

    // Slow gentle auto-rotation
    pookalam.rotation.y += 0.0008;

    // Smooth background color transition
    scene.background.lerp(targetBg, 0.05);

    renderer.render(scene, camera);
}

animate();


// ----------------------------------------
// DRAG HINT — shows after animation, hides on first drag
// ----------------------------------------

const dragHint = document.getElementById('drag-hint');
let hintDismissed = false;

function dismissHint() {
    if (hintDismissed) return;
    hintDismissed = true;
    dragHint.classList.remove('visible');
    dragHint.classList.add('hidden');
}

// Show after 3.5s (animation finishes ~3s)
setTimeout(() => {
    if (!hintDismissed) dragHint.classList.add('visible');
}, 3500);

// Auto-dismiss after 8s regardless
setTimeout(dismissHint, 8500);

// Dismiss on first drag
renderer.domElement.addEventListener('pointerdown', dismissHint, { once: true });


// ----------------------------------------
// WINDOW RESIZE
// ----------------------------------------

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});