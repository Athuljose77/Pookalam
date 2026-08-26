import * as THREE from 'three';

function createArcBand(innerRadius, outerRadius, startAngle, endAngle, color, depth, height) {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerRadius, startAngle, endAngle, false);
    shape.absarc(0, 0, innerRadius, endAngle, startAngle, true);

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: depth,
        bevelEnabled: true,
        bevelThickness: 0.008,
        bevelSize: 0.008,
        bevelSegments: 2,
        curveSegments: 24
    });

    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.75,
        metalness: 0.05,
        side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = height;
    return mesh;
}

export function createFanSegments() {
    const group = new THREE.Group();

    const count = 6;
    const angleStep = (Math.PI * 2) / count;
    const fanAngularWidth = angleStep * 0.72;

    const bands = [
        { rIn: 2.25, rOut: 2.65, color: 0x800020, depth: 0.04, height: 0.20 }, // Maroon / Dark Red
        { rIn: 2.65, rOut: 3.05, color: 0x2d6a2e, depth: 0.045, height: 0.21 }, // Green
        { rIn: 3.05, rOut: 3.45, color: 0xff7200, depth: 0.05, height: 0.22 }, // Orange
        { rIn: 3.45, rOut: 3.85, color: 0xffd91a, depth: 0.055, height: 0.23 }, // Yellow
        { rIn: 3.85, rOut: 4.30, color: 0xf5eee0, depth: 0.06, height: 0.24 }  // White/Cream Outer Arc
    ];

    for (let i = 0; i < count; i++) {
        const centerAngle = i * angleStep + angleStep / 2;
        const startAngle = centerAngle - fanAngularWidth / 2;
        const endAngle = centerAngle + fanAngularWidth / 2;

        const fanGroup = new THREE.Group();

        bands.forEach((band, bandIdx) => {
            const arcMesh = createArcBand(
                band.rIn, band.rOut,
                startAngle, endAngle,
                band.color, band.depth, band.height
            );
            arcMesh.userData = { type: 'fan-petal', index: i, band: bandIdx };
            fanGroup.add(arcMesh);
        });

        group.add(fanGroup);
    }

    return group;
}
