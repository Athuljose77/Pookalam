import * as THREE from 'three';

export function createLights(scene) {

    // Warm, natural ambient light
    const ambientLight = new THREE.AmbientLight(
        0xfff8e7,
        1.2
    );

    scene.add(ambientLight);


    // Main key light casting soft shadows
    const directionalLight = new THREE.DirectionalLight(
        0xffffff,
        2.5
    );

    directionalLight.position.set(
        6,
        12,
        6
    );

    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 25;
    directionalLight.shadow.camera.left = -6;
    directionalLight.shadow.camera.right = 6;
    directionalLight.shadow.camera.top = 6;
    directionalLight.shadow.camera.bottom = -6;
    directionalLight.shadow.bias = -0.0005;

    scene.add(directionalLight);


    // Warm central point light to highlight the flower core
    const pointLight = new THREE.PointLight(
        0xffaa33,
        1.5,
        10
    );

    pointLight.position.set(0, 3, 0);

    scene.add(pointLight);
}