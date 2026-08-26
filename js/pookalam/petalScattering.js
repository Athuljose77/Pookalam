import * as THREE from 'three';
import { createPetalNormalMap } from './petalTexture.js';

// Shared realistic 3D flower petal chip geometry (organic curved petal contour)
const petalChipGeo = (() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(-0.045, 0.035, -0.055, 0.095, 0, 0.13);
    shape.bezierCurveTo(0.055, 0.095, 0.045, 0.035, 0, 0);

    const geo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.006,
        bevelEnabled: true,
        bevelThickness: 0.002,
        bevelSize: 0.002,
        bevelSegments: 1,
        curveSegments: 8
    });

    // Center geometry origin so rotation is around the petal center
    geo.center();
    return geo;
})();

const normalMap = createPetalNormalMap();

// Ray-casting algorithm to test if (px, py) is inside a 2D polygon
function isPointInPolygon(px, py, polygonPoints) {
    let inside = false;
    for (let i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
        const xi = polygonPoints[i].x, yi = polygonPoints[i].y;
        const xj = polygonPoints[j].x, yj = polygonPoints[j].y;
        const intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

export function createInstancedPetalCluster(shape, count, mainHex, altHex = null, baseHeight = 0.20, options = {}) {
    const mat = new THREE.MeshStandardMaterial({
        color: mainHex,
        roughness: 0.88,
        metalness: 0,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(0.3, 0.3),
        side: THREE.DoubleSide
    });

    const instancedMesh = new THREE.InstancedMesh(petalChipGeo, mat, count);
    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;

    // Extract outer polygon points & hole polygon points from 2D shape
    const points = shape.getPoints(32);
    const holePolygons = (shape.holes || []).map(h => h.getPoints(16));

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    points.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
    });

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    const baseColor = new THREE.Color(mainHex);
    const altColor = altHex ? new THREE.Color(altHex) : baseColor;

    let placed = 0;
    let attempts = 0;
    const maxAttempts = count * 30;

    while (placed < count && attempts < maxAttempts) {
        attempts++;

        const sampleX = minX + Math.random() * (maxX - minX);
        const sampleY = minY + Math.random() * (maxY - minY);

        // Check if point is inside outer boundary and outside any holes
        let isInside = isPointInPolygon(sampleX, sampleY, points);
        if (isInside && holePolygons.length > 0) {
            for (const holePts of holePolygons) {
                if (isPointInPolygon(sampleX, sampleY, holePts)) {
                    isInside = false;
                    break;
                }
            }
        }

        if (isInside) {
            // Position on 3D X-Z carpet plane with subtle height variation
            const px = sampleX;
            const py = baseHeight + (Math.random() - 0.5) * 0.015;
            const pz = -sampleY;

            dummy.position.set(px, py, pz);

            // Lay FLAT on horizontal ground:
            // rotX = -PI/2 lays local XY flat on XZ
            // rotZ = random spins petal flat on ground plane
            const rotX = -Math.PI / 2 + (Math.random() - 0.5) * 0.15;
            const rotY = (Math.random() - 0.5) * 0.15;
            const rotZ = Math.random() * Math.PI * 2;
            dummy.rotation.set(rotX, rotY, rotZ, 'ZXY');

            // Random scale variation
            const scaleJitter = 0.75 + Math.random() * 0.5;
            dummy.scale.set(scaleJitter, scaleJitter, scaleJitter);

            dummy.updateMatrix();
            instancedMesh.setMatrixAt(placed, dummy.matrix);

            // Natural color shade variation
            color.copy(baseColor);
            const shadeJitter = (Math.random() - 0.5) * 0.12;
            color.r = Math.min(1, Math.max(0, color.r + shadeJitter));
            color.g = Math.min(1, Math.max(0, color.g + shadeJitter));
            color.b = Math.min(1, Math.max(0, color.b + shadeJitter));

            if (altHex && Math.random() < 0.25) {
                color.lerp(altColor, 0.4);
            }

            instancedMesh.setColorAt(placed, color);
            placed++;
        }
    }

    instancedMesh.count = placed;
    instancedMesh.instanceMatrix.needsUpdate = true;
    if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

    return instancedMesh;
}
