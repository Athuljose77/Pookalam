import * as THREE from 'three';

export function createInnerFill() {
    const group = new THREE.Group();

    const count = 12;
    const innerRadius = 0.4;
    const outerRadius = 2.25;
    const angleStep = (Math.PI * 2) / count;

    const colors = [
        0xffd91a, // Yellow
        0xff8a00, // Orange
        0x2d6a2e, // Green
        0x800020, // Maroon
        0xffd91a,
        0xff8a00,
        0x2d6a2e,
        0x800020,
        0xffd91a,
        0xff8a00,
        0x2d6a2e,
        0x800020
    ];

    for (let i = 0; i < count; i++) {
        const startAngle = i * angleStep;
        const endAngle = (i + 1) * angleStep;

        const shape = new THREE.Shape();
        shape.absarc(0, 0, outerRadius, startAngle, endAngle, false);
        shape.absarc(0, 0, innerRadius, endAngle, startAngle, true);

        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 0.04,
            bevelEnabled: true,
            bevelThickness: 0.008,
            bevelSize: 0.008,
            bevelSegments: 2,
            curveSegments: 16
        });

        const material = new THREE.MeshStandardMaterial({
            color: colors[i],
            roughness: 0.75,
            metalness: 0.05,
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.y = 0.22;
        mesh.userData = { type: 'inner-fill', index: i };
        group.add(mesh);
    }

    return group;
}
