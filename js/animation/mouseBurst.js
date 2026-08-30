import * as THREE from 'three';

/**
 * Mouse-drag flower burst effect.
 *
 * When the user moves/drags their mouse over the pookalam, tiny glowing
 * flower petals erupt from the exact 3D point the cursor touches and fly
 * outward + upward, fading away — like disturbing a real flower carpet.
 */

const POOL_SIZE   = 100;   // max simultaneous particles
const BURST_COUNT = 5;     // petals spawned per mouse-move event
const LIFE        = 1.0;   // seconds a petal lives
const SPEED       = 2.0;   // outward launch speed

const PETAL_COLORS = [
    0xff7518, // orange
    0xffd72f, // yellow
    0xd62839, // red
    0xfff4e0, // cream
    0xff4444, // bright red
    0xffb347, // light orange
];

// Shared geometry: a delicate narrow teardrop petal
// Natural proportions: length ~3× width, very thin depth (paper-like)
const petalShape = (() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    // Narrow base widening gently then tapering to a fine tip
    s.bezierCurveTo(-0.018, 0.018, -0.025, 0.055, 0, 0.085);
    s.bezierCurveTo( 0.025, 0.055,  0.018, 0.018, 0, 0);
    return s;
})();

const petalGeo = (() => {
    const g = new THREE.ExtrudeGeometry(petalShape, {
        depth: 0.001,      // paper-thin — no visible block thickness
        bevelEnabled: false,
        curveSegments: 12,
    });
    g.center();
    return g;
})();

function makePetalMaterial(colorHex) {
    return new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: new THREE.Color(colorHex),
        emissiveIntensity: 0.2,   // subtle glow, not neon
        roughness: 0.80,
        metalness: 0.0,
        transparent: true,
        opacity: 0.0,
        depthWrite: false,
        side: THREE.DoubleSide,
    });
}

// Particle pool entry
function makeParticle() {
    const colorHex = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
    const mesh = new THREE.Mesh(petalGeo, makePetalMaterial(colorHex));
    mesh.visible = false;
    return {
        mesh,
        active: false,
        life:   0,
        maxLife: LIFE,
        velocity: new THREE.Vector3(),
        spin: new THREE.Vector3(),
    };
}

export function setupMouseBurst(scene, camera, domElement, pookalamGroup) {
    const raycaster = new THREE.Raycaster();
    const mouse     = new THREE.Vector2();
    const pool      = [];
    let   poolIdx   = 0;

    // Build particle pool
    for (let i = 0; i < POOL_SIZE; i++) {
        const p = makeParticle();
        scene.add(p.mesh);
        pool.push(p);
    }

    // Collect all pookalam meshes as raycast targets (including ground)
    const targets = [];
    pookalamGroup.traverse(child => { if (child.isMesh) targets.push(child); });

    // Ground plane hit-plane for when raycasting misses individual meshes
    const hitPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide })
    );
    hitPlane.rotation.x = -Math.PI / 2;
    hitPlane.position.y = 0.18;
    scene.add(hitPlane);

    let isDragging = false;
    let lastBurstTime = 0;

    function spawnBurst(worldPoint) {
        for (let b = 0; b < BURST_COUNT; b++) {
            const p = pool[poolIdx % POOL_SIZE];
            poolIdx++;

            // Reset mesh appearance
            const colorHex = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
            p.mesh.material.color.setHex(colorHex);
            p.mesh.material.emissive.setHex(colorHex);
            p.mesh.material.opacity = 0.95;
            p.mesh.visible = true;
            p.active  = true;
            p.life    = 0;
            p.maxLife = LIFE * (0.7 + Math.random() * 0.6);

            // Position at cursor world-point with tiny random offset
            p.mesh.position.set(
                worldPoint.x + (Math.random() - 0.5) * 0.15,
                worldPoint.y + 0.05 + Math.random() * 0.08,
                worldPoint.z + (Math.random() - 0.5) * 0.15
            );

            // Random spin
            p.spin.set(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8
            );

            // Random outward + upward velocity
            const outAngle = Math.random() * Math.PI * 2;
            const outSpeed = SPEED * (0.4 + Math.random() * 0.8);
            p.velocity.set(
                Math.cos(outAngle) * outSpeed,
                SPEED * (0.5 + Math.random() * 1.2),  // strong upward
                Math.sin(outAngle) * outSpeed
            );

            // Random initial rotation
            p.mesh.rotation.set(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2
            );
        }
    }

    function tryBurst(event, forceSpawn = false) {
        const now = performance.now();
        if (!forceSpawn && now - lastBurstTime < 40) return; // throttle to ~25/s
        lastBurstTime = now;

        const rect = domElement.getBoundingClientRect();
        mouse.x =  ((event.clientX - rect.left) / rect.width)  * 2 - 1;
        mouse.y = -((event.clientY - rect.top)  / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // Try pookalam meshes first
        const hits = raycaster.intersectObjects(targets, false);
        if (hits.length > 0) {
            spawnBurst(hits[0].point);
            return;
        }

        // Fallback: hit the invisible ground plane
        const planeHits = raycaster.intersectObject(hitPlane, false);
        if (planeHits.length > 0) {
            const pt = planeHits[0].point;
            // Only burst if within pookalam radius
            const r = Math.sqrt(pt.x * pt.x + pt.z * pt.z);
            if (r < 5.0) spawnBurst(pt);
        }
    }

    domElement.addEventListener('pointermove', (e) => {
        if (isDragging) tryBurst(e);
    });

    domElement.addEventListener('pointerdown', (e) => {
        isDragging = true;
        tryBurst(e, true); // always spawn on click
    });

    domElement.addEventListener('pointerup',   () => { isDragging = false; });
    domElement.addEventListener('pointerleave',() => { isDragging = false; });

    const gravity = -3.5; // downward pull

    return function updateMouseBurst(deltaTime) {
        for (const p of pool) {
            if (!p.active) continue;

            p.life += deltaTime;
            const t = p.life / p.maxLife; // 0 → 1

            if (t >= 1.0) {
                p.active = false;
                p.mesh.visible = false;
                continue;
            }

            // Physics: gravity pulls down
            p.velocity.y += gravity * deltaTime;
            p.mesh.position.addScaledVector(p.velocity, deltaTime);

            // Spin
            p.mesh.rotation.x += p.spin.x * deltaTime;
            p.mesh.rotation.y += p.spin.y * deltaTime;
            p.mesh.rotation.z += p.spin.z * deltaTime;

            // Fade out in the last 40% of life
            const fade = t > 0.6 ? 1.0 - (t - 0.6) / 0.4 : 1.0;
            p.mesh.material.opacity = 0.95 * fade;
            p.mesh.material.emissiveIntensity = 0.5 * fade;
        }
    };
}
