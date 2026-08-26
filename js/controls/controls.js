import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CAMERA_PRESETS } from '../scene/camera.js';

export function createControls(camera, domElement) {
    const controls = new OrbitControls(camera, domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent going below ground plane
    controls.minDistance = 3;
    controls.maxDistance = 20;

    controls.target.set(0, 0.3, 0);
    controls.update();

    let isTransitioning = false;
    let targetPos = null;
    let targetLookAt = null;

    // Smooth camera transition to a target preset
    controls.setPreset = function(presetKey) {
        const preset = CAMERA_PRESETS[presetKey];
        if (!preset) return;

        targetPos = preset.pos.clone();
        targetLookAt = preset.target.clone();
        isTransitioning = true;
    };

    controls.updateTransition = function() {
        if (!isTransitioning || !targetPos || !targetLookAt) return;

        camera.position.lerp(targetPos, 0.08);
        controls.target.lerp(targetLookAt, 0.08);

        if (camera.position.distanceTo(targetPos) < 0.05) {
            camera.position.copy(targetPos);
            controls.target.copy(targetLookAt);
            isTransitioning = false;
        }

        controls.update();
    };

    return controls;
}
