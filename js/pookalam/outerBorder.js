import * as THREE from 'three';

export function createOuterBorder() {
    const group = new THREE.Group();

    // Flat orange annular ring (NOT a torus tube — a flat disc ring)
    const outerR = 4.88;
    const innerR = 4.40;

    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, innerR, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 0.018,
        bevelEnabled: false,
        curveSegments: 64
    });

    const material = new THREE.MeshStandardMaterial({
        color: 0xff7200,
        roughness: 0.90,
        metalness: 0.0
    });

    const ring = new THREE.Mesh(geometry, material);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.17;
    group.add(ring);

    // Small alternating decorative dots (yellow/red) around the ring edge
    const dotCount = 48;
    const dotRadius = 4.64;
    for (let i = 0; i < dotCount; i++) {
        const angle = (Math.PI * 2 / dotCount) * i;
        const dotColor = i % 2 === 0 ? 0xffd91a : 0xb51e2b;
        const dotGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.025, 12);
        const dotMat = new THREE.MeshStandardMaterial({ color: dotColor, roughness: 0.9, metalness: 0 });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.x = dotRadius * Math.cos(angle);
        dot.position.z = dotRadius * Math.sin(angle);
        dot.position.y = 0.20;
        group.add(dot);
    }

    return group;
}
