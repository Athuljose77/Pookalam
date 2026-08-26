import * as THREE from 'three';

function createTeardropPetal(length, width, depth, color) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(-width * 0.5, length * 0.3, -width * 0.5, length * 0.7, 0, length);
    shape.bezierCurveTo(width * 0.5, length * 0.7, width * 0.5, length * 0.3, 0, 0);

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: depth,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.015,
        bevelSegments: 2,
        curveSegments: 16
    });

    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.75,
        metalness: 0.05,
        side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
}

export function createCenterFlower() {
    const group = new THREE.Group();

    // 1. Outer 6 White Petals
    const whiteCount = 6;
    const whiteLength = 1.1;
    const whiteWidth = 0.52;

    for (let i = 0; i < whiteCount; i++) {
        const angle = (Math.PI * 2 / whiteCount) * i;
        const petal = createTeardropPetal(whiteLength, whiteWidth, 0.06, 0xffffff);

        petal.rotation.z = -angle - Math.PI / 2;
        petal.position.x = 0;
        petal.position.z = 0;
        petal.position.y = 0.40;

        petal.userData = { type: 'center-petal', index: i };
        group.add(petal);
    }

    // 2. Inner 6 Red Petals
    const redCount = 6;
    const redLength = 0.55;
    const redWidth = 0.28;

    for (let i = 0; i < redCount; i++) {
        const angle = (Math.PI * 2 / redCount) * i + Math.PI / 6;
        const petal = createTeardropPetal(redLength, redWidth, 0.06, 0xc8102e);

        petal.rotation.z = -angle - Math.PI / 2;
        petal.position.x = 0;
        petal.position.z = 0;
        petal.position.y = 0.46;

        petal.userData = { type: 'inner-center-petal', index: i };
        group.add(petal);
    }

    // 3. Central Red Core Cylinder
    const coreGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.10, 32);
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0x900c3f,
        roughness: 0.7
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 0.52;
    core.userData = { type: 'flower-center' };
    group.add(core);

    // 4. Central Yellow Center Dot
    const dotGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.12, 24);
    const dotMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.8
    });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.y = 0.58;
    group.add(dot);

    return group;
}
