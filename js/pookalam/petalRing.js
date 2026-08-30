import * as THREE from 'three';

/**
 * Creates a decorative ring of individual flower petals between the
 * outermost fan arc band (r≈4.35) and the orange border ring (r≈4.40).
 * 24 petals, alternating orange / yellow / red, each pointing outward.
 */
export function createPetalRing() {
    const group = new THREE.Group();

    const petalCount = 24;
    const ringRadius = 4.15; // sits in the gap before the orange border
    const petalLength = 0.38;
    const petalWidth  = 0.16;
    const height      = 0.165;

    const colors = [
        0xff7518, // Orange
        0xffd72f, // Yellow
        0xd62839, // Red
        0xff7518,
        0xffd72f,
        0xd62839,
    ];

    function makePetalShape(len, wid) {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.bezierCurveTo(-wid * 0.5, len * 0.30, -wid * 0.45, len * 0.72, 0, len);
        shape.bezierCurveTo( wid * 0.45, len * 0.72,  wid * 0.5, len * 0.30, 0, 0);
        return shape;
    }

    const shape = makePetalShape(petalLength, petalWidth);

    for (let i = 0; i < petalCount; i++) {
        const angle = (Math.PI * 2 / petalCount) * i;

        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 0.015,
            bevelEnabled: true,
            bevelThickness: 0.005,
            bevelSize: 0.005,
            bevelSegments: 2,
            curveSegments: 14
        });

        const color = colors[i % colors.length];
        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.85,
            metalness: 0.0,
            side: THREE.DoubleSide
        });

        const petal = new THREE.Mesh(geometry, material);

        // Lay flat on ground plane, then rotate to point radially outward
        petal.rotation.x = -Math.PI / 2;
        petal.rotation.z = -angle - Math.PI / 2;

        // Place at ring radius, offset so petal base is at ring edge
        petal.position.x = ringRadius * Math.cos(angle);
        petal.position.z = ringRadius * Math.sin(angle);
        petal.position.y = height;

        petal.userData = { type: 'petal-ring', index: i };
        group.add(petal);
    }

    return group;
}
