import * as THREE from 'three';

import { createScene } from './scene/scene.js';
import { createCamera } from './scene/camera.js';
import { createLights } from './scene/lights.js';
import { createPookalam } from './pookalam/pookalam.js';
import { createControls } from './controls/controls.js';
import { setupInteraction } from './controls/interaction.js';
import { setupAssemblyAnimation } from './animation/assembly.js';


// ----------------------------------------
// SCENE & CAMERA
// ----------------------------------------

const scene = createScene();
const camera = createCamera();


// ----------------------------------------
// RENDERER
// ----------------------------------------

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

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
// POOKALAM ASSEMBLY
// ----------------------------------------

const pookalam = createPookalam();
scene.add(pookalam);


// ----------------------------------------
// ANIMATION & INTERACTION SETUP
// ----------------------------------------

const updateAssembly = setupAssemblyAnimation(pookalam);
const updateInteraction = setupInteraction(camera, scene, renderer.domElement, pookalam);
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
// ANIMATION LOOP
// ----------------------------------------

function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();

    controls.update();
    controls.updateTransition();

    updateAssembly(deltaTime);
    updateInteraction();

    renderer.render(scene, camera);
}

animate();


// ----------------------------------------
// WINDOW RESIZE
// ----------------------------------------

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});