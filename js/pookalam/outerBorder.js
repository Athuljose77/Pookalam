import * as THREE from 'three';

export function createOuterBorder() {
    const group = new THREE.Group();

    // Vibrant Orange Outer Torus Ring
    const ringGeo = new THREE.TorusGeometry(4.62, 0.24, 24, 128);
    const ringMat = new THREE.MeshStandardMaterial({
        color: 0xff7200, // Vibrant Orange
        roughness: 0.65,
        metalness: 0.1
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.18;
    group.add(ring);

    // Decorative Orange Petal Nodes along Outer Border
    const nodeCount = 36;
    const nodeGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.10, 16);
    const nodeMat = new THREE.MeshStandardMaterial({
        color: 0xff8a00,
        roughness: 0.7
    });

    for (let i = 0; i < nodeCount; i++) {
        const angle = (Math.PI * 2 / nodeCount) * i;
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.x = 4.62 * Math.cos(angle);
        node.position.z = 4.62 * Math.sin(angle);
        node.position.y = 0.28;
        group.add(node);
    }

    return group;
}
