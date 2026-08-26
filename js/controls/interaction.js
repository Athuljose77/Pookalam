import * as THREE from 'three';

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

            if (child.material) {
                child.material = child.material.clone(); // ensure unique material for hover glow
                child.userData.baseEmissive = child.material.emissive ? child.material.emissive.clone() : new THREE.Color(0, 0, 0);
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

                // Set new hovered mesh
                hoveredMesh = hit;
                domElement.style.cursor = 'pointer';

                hoveredMesh.userData.targetScale.set(1.15, 1.15, 1.15);
                hoveredMesh.userData.targetY = hoveredMesh.userData.basePosition.y + 0.08;
                hoveredMesh.userData.targetEmissive.setHex(0x442200);
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

    // Pointer down / Click listener
    function onPointerDown(event) {
        if (hoveredMesh) {
            // Trigger a quick pulse scale effect
            hoveredMesh.userData.pulseScale = 1.35;
        }
    }

    domElement.addEventListener('pointermove', onPointerMove);
    domElement.addEventListener('pointerdown', onPointerDown);

    // Update function called inside animate loop
    return function updateInteraction() {
        interactiveMeshes.forEach((mesh) => {
            // Decay pulse scale back to 1.0
            if (mesh.userData.pulseScale > 1.0) {
                mesh.userData.pulseScale += (1.0 - mesh.userData.pulseScale) * 0.15;
            }

            // Lerp scale
            const desiredScaleX = mesh.userData.targetScale.x * mesh.userData.pulseScale;
            const desiredScaleY = mesh.userData.targetScale.y * mesh.userData.pulseScale;
            const desiredScaleZ = mesh.userData.targetScale.z * mesh.userData.pulseScale;

            mesh.scale.x += (desiredScaleX - mesh.scale.x) * 0.1;
            mesh.scale.y += (desiredScaleY - mesh.scale.y) * 0.1;
            mesh.scale.z += (desiredScaleZ - mesh.scale.z) * 0.1;

            // Lerp Y position
            mesh.position.y += (mesh.userData.targetY - mesh.position.y) * 0.1;

            // Lerp emissive color
            if (mesh.material && mesh.material.emissive) {
                mesh.material.emissive.lerp(mesh.userData.targetEmissive, 0.1);
            }
        });
    };
}
