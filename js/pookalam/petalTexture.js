import * as THREE from 'three';

// Generate procedural canvas texture representing dense scattered flower petal flecks
export function createFlowerPetalTexture(mainHex, spotHex, noiseIntensity = 0.3) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base color
    ctx.fillStyle = '#' + new THREE.Color(mainHex).getHexString();
    ctx.fillRect(0, 0, 512, 512);

    const spotColor = new THREE.Color(spotHex);

    // Draw thousands of tiny organic petal flecks/flakes
    const numFlecks = 3500;
    for (let i = 0; i < numFlecks; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const rx = 2 + Math.random() * 6;
        const ry = 1 + Math.random() * 3;
        const angle = Math.random() * Math.PI * 2;

        // Color jitter
        const jitter = (Math.random() - 0.5) * noiseIntensity;
        const col = new THREE.Color(mainHex);
        col.r = Math.min(1, Math.max(0, col.r + jitter));
        col.g = Math.min(1, Math.max(0, col.g + jitter));
        col.b = Math.min(1, Math.max(0, col.b + jitter));

        if (Math.random() < 0.25) {
            col.lerp(spotColor, 0.4);
        }

        ctx.fillStyle = '#' + col.getHexString();

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);

    return texture;
}

// Generate procedural normal bump map for tactile flower petal roughness
export function createPetalNormalMap() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgb(128, 128, 255)'; // Flat normal
    ctx.fillRect(0, 0, 256, 256);

    const numBumps = 1200;
    for (let i = 0; i < numBumps; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const radius = 2 + Math.random() * 5;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, 'rgb(200, 180, 255)');
        grad.addColorStop(1, 'rgb(128, 128, 255)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);

    return texture;
}
