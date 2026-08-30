import * as THREE from 'three';

export function createLights(scene) {

    // ── Ambient: warm natural Kerala daylight ──────────────────────────────
    const ambientLight = new THREE.AmbientLight(
        0xfff3d6,
        0.9           // slightly dimmer so accent lights have more impact
    );
    scene.add(ambientLight);


    // ── Key Light: main directional from upper-left (morning sun angle) ────
    const directionalLight = new THREE.DirectionalLight(0xfff0d0, 2.2);
    directionalLight.position.set(5, 10, 3);

    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width  = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near   = 0.5;
    directionalLight.shadow.camera.far    = 25;
    directionalLight.shadow.camera.left   = -6;
    directionalLight.shadow.camera.right  =  6;
    directionalLight.shadow.camera.top    =  6;
    directionalLight.shadow.camera.bottom = -6;
    directionalLight.shadow.bias = -0.0005;

    scene.add(directionalLight);


    // ── Warm Amber Fill: opposite corner from key (wraps pookalam in warmth) ─
    const amberLight = new THREE.PointLight(0xff6600, 1.4, 14);
    amberLight.position.set(-5, 2.5, -5);
    scene.add(amberLight);


    // ── Cool Rim Light: subtle blue-tinted backlight for depth separation ──
    const rimLight = new THREE.PointLight(0x4488ff, 0.55, 12);
    rimLight.position.set(0, 1.5, -8);
    scene.add(rimLight);


    // ── Centre Point Light: warms the flower core ─────────────────────────
    const pointLight = new THREE.PointLight(0xffaa33, 1.6, 10);
    pointLight.position.set(0, 3, 0);
    scene.add(pointLight);
}