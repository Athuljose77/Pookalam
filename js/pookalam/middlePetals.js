import * as THREE from 'three';

function createRosettePetal(length, width, color) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(-width * 0.7, length * 0.35, -width * 0.4, length * 0.8, 0, length);
    shape.bezierCurveTo(width * 0.4, length * 0.8, width * 0.7, length * 0.35, 0, 0);

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 0.05,
        bevelEnabled: true,
        bevelThickness: 0.012,
        bevelSize: 0.012,
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

export function createMiddlePetals() {
    const group = new THREE.Group();

    const count = 12;
    const radius = 1.35;
    const length = 1.15;
    const width = 0.58;

    const colors = [
        0xffd91a, // Yellow
        0xff8a00, // Orange
        0x2d6a2e, // Green
        0xc8102e, // Red
        0xffd91a,
        0xff8a00,
        0x2d6a2e,
        0xc8102e,
        0xffd91a,
        0xff8a00,
        0x2d6a2e,
        0xc8102e
    ];

    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i;
        const petal = createRosettePetal(length, width, colors[i]);

        petal.rotation.z = -angle - Math.PI / 2;
        petal.position.x = radius * Math.cos(angle);
        petal.position.z = radius * Math.sin(angle);
        petal.position.y = 0.34;

        petal.userData = { type: 'middle-petal', index: i };
        group.add(petal);
    }

    return group;
}
