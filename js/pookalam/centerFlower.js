import * as THREE from 'three';

function createFloralPetal(length, width, depth, color) {
    const shape = new THREE.Shape();
    // Organic petal shape: tapered base, natural curved body, gently rounded tip
    shape.moveTo(0, 0);
    shape.bezierCurveTo(-width * 0.35, length * 0.25, -width * 0.55, length * 0.65, 0, length);
    shape.bezierCurveTo(width * 0.55, length * 0.65, width * 0.35, length * 0.25, 0, 0);

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: depth,
        bevelEnabled: true,
        bevelThickness: 0.006,
        bevelSize: 0.006,
        bevelSegments: 3,
        curveSegments: 20
    });

    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.85,
        metalness: 0.0,
        side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
}

export function createCenterFlower() {
    const group = new THREE.Group();

    // 1. Layer 1: Outer 12 White/Cream Petals (Base floral layer)
    const layer1Count = 12;
    const layer1Length = 1.05;
    const layer1Width = 0.42;

    for (let i = 0; i < layer1Count; i++) {
        const angle = (Math.PI * 2 / layer1Count) * i;
        const petal = createFloralPetal(layer1Length, layer1Width, 0.025, 0xfffaf0);

        petal.rotation.z = -angle - Math.PI / 2;
        petal.position.x = 0;
        petal.position.z = 0;
        petal.position.y = 0.40;

        petal.userData = { type: 'center-petal-l1', index: i };
        group.add(petal);
    }

    // 2. Layer 2: Middle 12 Golden Yellow Petals (Interleaved, slightly smaller)
    const layer2Count = 12;
    const layer2Length = 0.80;
    const layer2Width = 0.34;
    const layer2Offset = Math.PI / layer2Count; // Interleave petals

    for (let i = 0; i < layer2Count; i++) {
        const angle = (Math.PI * 2 / layer2Count) * i + layer2Offset;
        const petal = createFloralPetal(layer2Length, layer2Width, 0.025, 0xffb700);

        petal.rotation.z = -angle - Math.PI / 2;
        petal.position.x = 0;
        petal.position.z = 0;
        petal.position.y = 0.43;

        petal.userData = { type: 'center-petal-l2', index: i };
        group.add(petal);
    }

    // 3. Layer 3: Inner 12 Vibrant Orange / Red Accent Petals
    const layer3Count = 12;
    const layer3Length = 0.58;
    const layer3Width = 0.26;

    for (let i = 0; i < layer3Count; i++) {
        const angle = (Math.PI * 2 / layer3Count) * i;
        const petal = createFloralPetal(layer3Length, layer3Width, 0.025, 0xe63946);

        petal.rotation.z = -angle - Math.PI / 2;
        petal.position.x = 0;
        petal.position.z = 0;
        petal.position.y = 0.46;

        petal.userData = { type: 'center-petal-l3', index: i };
        group.add(petal);
    }

    // 4. Layer 4: Small Central Yellow Flower Core / Seed Disk
    const coreGeo = new THREE.CylinderGeometry(0.18, 0.20, 0.04, 32);
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0xffa500,
        roughness: 0.9,
        metalness: 0.0
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 0.48;
    core.userData = { type: 'flower-center' };
    group.add(core);

    // 5. Central Seed Detail / Stigma Dot
    const dotGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.05, 24);
    const dotMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.85,
        metalness: 0.0
    });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.y = 0.51;
    group.add(dot);

    return group;
}

