import * as THREE from 'three';

export function createScene() {
    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x111111);

    return scene;
}