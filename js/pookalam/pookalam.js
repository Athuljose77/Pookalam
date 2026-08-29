import * as THREE from 'three';

import { createOuterBorder } from './outerBorder.js';
import { createFanSegments } from './fanSegments.js';
import { createInnerFill } from './innerFill.js';
import { createTriangleMotifs } from './triangleMotifs.js';
import { createMiddlePetals } from './middlePetals.js';
import { createCenterFlower } from './centerFlower.js';

export function createPookalam() {
    const pookalam = new THREE.Group();

    // ========================================
    // BASE DISK (Rich Crimson Red Base)
    // ========================================
    const baseGeometry = new THREE.CylinderGeometry(4.9, 4.9, 0.04, 128);
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x8e1d38, // Rich Maroon Base
        roughness: 0.8,
        metalness: 0.1
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.13;
    base.receiveShadow = true;
    base.castShadow = true;
    base.userData = { type: 'base' };
    pookalam.add(base);


    // ========================================
    // COMPONENT 8: VIBRANT ORANGE OUTER BORDER
    // ========================================
    const outerBorder = createOuterBorder();
    outerBorder.userData = { type: 'outer-border' };
    pookalam.add(outerBorder);


    // ========================================
    // COMPONENTS 6 & 7: FAN SEGMENTS & OUTER ARCS
    // ========================================
    const fanSegments = createFanSegments();
    fanSegments.userData = { type: 'fan-segments' };
    pookalam.add(fanSegments);


    // ========================================
    // COMPONENT 3: INNER CIRCLE FILL
    // ========================================
    const innerFill = createInnerFill();
    innerFill.userData = { type: 'inner-fill' };
    pookalam.add(innerFill);


    // ========================================
    // COMPONENTS 4 & 5: 6-POINTED STAR & RED BEAD TRIANGLES
    // ========================================
    const triangleMotifs = createTriangleMotifs();
    triangleMotifs.userData = { type: 'triangle-motifs' };
    pookalam.add(triangleMotifs);


    // ========================================
    // COMPONENT 2: PETAL RING ROSETTE
    // ========================================
    const middlePetals = createMiddlePetals();
    middlePetals.userData = { type: 'middle-petals' };
    pookalam.add(middlePetals);


    // ========================================
    // COMPONENT 1: CENTER FLOWER
    // ========================================
    const centerFlower = createCenterFlower();
    centerFlower.userData = { type: 'center-flower' };
    pookalam.add(centerFlower);


    // Enable shadow casting and receiving across all child meshes
    pookalam.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return pookalam;
}
