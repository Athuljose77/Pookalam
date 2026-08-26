import * as THREE from 'three';

// Create Component 4: 3D Red Chethi Flower Bud Bead
function createChethiFlowerBud() {
    const group = new THREE.Group();

    // Red petal head
    const budGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.08, 16);
    const budMat = new THREE.MeshStandardMaterial({
        color: 0xc8102e,
        roughness: 0.7,
        metalness: 0.05
    });
    const bud = new THREE.Mesh(budGeo, budMat);
    group.add(bud);

    // Yellow center dot
    const centerGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.09, 12);
    const centerMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.8
    });
    const center = new THREE.Mesh(centerGeo, centerMat);
    center.position.y = 0.01;
    group.add(center);

    return group;
}

// Create Component 4: Red Bead Triangle Cluster
function createRedTriangleCluster(angle) {
    const cluster = new THREE.Group();
    const rows = 4;
    const spacing = 0.20;
    const baseRadius = 2.45;

    for (let r = 0; r < rows; r++) {
        const countInRow = rows - r;
        const rowRadialOffset = baseRadius + r * 0.32;
        const rowWidth = (countInRow - 1) * spacing;

        for (let c = 0; c < countInRow; c++) {
            const sideOffset = -rowWidth / 2 + c * spacing;

            const dirX = Math.cos(angle);
            const dirZ = Math.sin(angle);
            const sideX = -Math.sin(angle);
            const sideZ = Math.cos(angle);

            const posX = dirX * rowRadialOffset + sideX * sideOffset;
            const posZ = dirZ * rowRadialOffset + sideZ * sideOffset;

            const bud = createChethiFlowerBud();
            bud.position.set(posX, 0.32, posZ);

            cluster.add(bud);
        }
    }

    return cluster;
}

// Create Component 5: Clean 3D Orange Star Triangle
function createStarTriangle(angle, radiusInner, radiusOuter, width) {
    const shape = new THREE.Shape();
    const halfWidth = width / 2;
    shape.moveTo(-halfWidth, radiusInner);
    shape.lineTo(halfWidth, radiusInner);
    shape.lineTo(0, radiusOuter);
    shape.closePath();

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 0.05,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelSegments: 2,
        curveSegments: 12
    });

    const material = new THREE.MeshStandardMaterial({
        color: 0xff7200, // Bright Orange
        roughness: 0.7,
        metalness: 0.05,
        side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = -angle - Math.PI / 2;
    mesh.position.y = 0.26;

    return mesh;
}

export function createTriangleMotifs() {
    const group = new THREE.Group();
    const count = 6;
    const angleStep = (Math.PI * 2) / count;

    // Component 5: Orange Star Triangles (forming 6-pointed star / hexagram)
    for (let i = 0; i < count; i++) {
        const angle = i * angleStep;
        const starTriangle = createStarTriangle(angle, 2.2, 4.25, 1.45);
        starTriangle.userData = { type: 'star-triangle', index: i };
        group.add(starTriangle);
    }

    // Component 4: Red Flower Bud Triangle Clusters
    for (let i = 0; i < count; i++) {
        const angle = i * angleStep;
        const redCluster = createRedTriangleCluster(angle);
        redCluster.userData = { type: 'triangle-motif', index: i };
        group.add(redCluster);
    }

    return group;
}
