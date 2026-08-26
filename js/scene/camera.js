import * as THREE from 'three';

export const CAMERA_PRESETS = {
    top: { pos: new THREE.Vector3(0, 10.5, 0.001), target: new THREE.Vector3(0, 0.3, 0) },
    threeD: { pos: new THREE.Vector3(0, 6.5, 6.5), target: new THREE.Vector3(0, 0.3, 0) },
    low: { pos: new THREE.Vector3(0, 2.5, 8.0), target: new THREE.Vector3(0, 0.3, 0) },
    side: { pos: new THREE.Vector3(0, 1.2, 9.0), target: new THREE.Vector3(0, 0.3, 0) },
    closeup: { pos: new THREE.Vector3(0, 2.0, 3.5), target: new THREE.Vector3(0, 0.4, 0) }
};

export function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    // Initial camera view: 3D Perspective Angle
    const defaultPreset = CAMERA_PRESETS.threeD;
    camera.position.copy(defaultPreset.pos);
    camera.lookAt(defaultPreset.target);

    return camera;
}