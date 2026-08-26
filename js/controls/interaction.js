import * as THREE from 'three';

// Large-area mesh types that should NEVER scale on hover
// (scaling them would cover the entire pookalam)
const NO_SCALE_TYPES = new Set(['base', 'outer-border']);

export function setupInteraction(camera, scene, domElement, pookalamGroup) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let hoveredMesh = null;
    const interactiveMeshes = [];

    // Traverse scene to collect all interactive meshes
    pookalamGroup.traverse((child) => {
        if (child.isMesh && child.userData && child.userData.type) {
            interactiveMeshes.push(child);

            // Store default transform & material properties
            child.userData.basePosition = child.position.clone();
            child.userData.baseScale = child.scale.clone();
            child.userData.targetScale = new THREE.Vector3(1, 1, 1);
            child.userData.targetY = child.position.y;
            child.userData.pulseScale = 1.0;

            // Flag whether this mesh type is allowed to scale
            child.userData.allowScale = !NO_SCALE_TYPES.has(child.userData.type);

            if (child.material) {
                child.material = child.material.clone();
                child.userData.baseEmissive = child.material.emissive
                    ? child.material.emissive.clone()
                    : new THREE.Color(0, 0, 0);
                child.userData.targetEmissive = child.userData.baseEmissive.clone();
            }
        }
    });

    // Pointer move listener
    function onPointerMove(event) {
        const rect = domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveMeshes, false);

        if (intersects.length > 0) {
            const hit = intersects[0].object;
            if (hoveredMesh !== hit) {
                // Reset previous hovered mesh
                if (hoveredMesh) {
                    hoveredMesh.userData.targetScale.set(1, 1, 1);
                    hoveredMesh.userData.targetY = hoveredMesh.userData.basePosition.y;
                    hoveredMesh.userData.targetEmissive.copy(hoveredMesh.userData.baseEmissive);
                }

                hoveredMesh = hit;
                domElement.style.cursor = 'pointer';

                // Only scale meshes that are small enough (not base/outer-border)
                if (hoveredMesh.userData.allowScale) {
                    hoveredMesh.userData.targetScale.set(1.06, 1.06, 1.06);
                    hoveredMesh.userData.targetY = hoveredMesh.userData.basePosition.y + 0.03;
                }
                // All meshes get a subtle emissive glow regardless
                hoveredMesh.userData.targetEmissive.setHex(0x331100);
            }
        } else {
            if (hoveredMesh) {
                hoveredMesh.userData.targetScale.set(1, 1, 1);
                hoveredMesh.userData.targetY = hoveredMesh.userData.basePosition.y;
                hoveredMesh.userData.targetEmissive.copy(hoveredMesh.userData.baseEmissive);
                hoveredMesh = null;
            }
            domElement.style.cursor = 'default';
        }
    }

    // Click: tiny pulse only on small meshes
    function onPointerDown(event) {
        if (hoveredMesh && hoveredMesh.userData.allowScale) {
            hoveredMesh.userData.pulseScale = 1.05;
        }
    }

    domElement.addEventListener('pointermove', onPointerMove);
    domElement.addEventListener('pointerdown', onPointerDown);

    // Update function called inside animate loop
    return function updateInteraction() {
        interactiveMeshes.forEach((mesh) => {
            // Decay pulse scale back to 1.0
            if (mesh.userData.pulseScale > 1.0) {
                mesh.userData.pulseScale += (1.0 - mesh.userData.pulseScale) * 0.18;
                if (Math.abs(mesh.userData.pulseScale - 1.0) < 0.001) {
                    mesh.userData.pulseScale = 1.0;
                }
            }

            // Lerp scale only if allowed
            if (mesh.userData.allowScale) {
                const desiredX = mesh.userData.targetScale.x * mesh.userData.pulseScale;
                const desiredY = mesh.userData.targetScale.y * mesh.userData.pulseScale;
                const desiredZ = mesh.userData.targetScale.z * mesh.userData.pulseScale;
                mesh.scale.x += (desiredX - mesh.scale.x) * 0.12;
                mesh.scale.y += (desiredY - mesh.scale.y) * 0.12;
                mesh.scale.z += (desiredZ - mesh.scale.z) * 0.12;

                // Lerp Y position
                mesh.position.y += (mesh.userData.targetY - mesh.position.y) * 0.12;
            }

            // Lerp emissive color for all meshes
            if (mesh.material && mesh.material.emissive) {
                mesh.material.emissive.lerp(mesh.userData.targetEmissive, 0.12);
            }
        });
    };
}
