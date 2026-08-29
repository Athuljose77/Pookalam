import * as THREE from 'three';

export function setupAssemblyAnimation(pookalamGroup) {
    let elapsedTime = 0;
    let isCompleted = false;

    const animatedObjects = [];

    // Beautiful organic bounce for scaling
    function easeOutBack(x) {
        const c1 = 1.2;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }

    let layerDelay = 0.0;

    // We animate every piece individually so it visually forms the pookalam
    pookalamGroup.children.forEach((layerGroup) => {
        const layerType = layerGroup.userData.type;
        let itemDelay = 0;

        // Base layer is a single Mesh, so layerGroup.children is empty.
        // We handle the layerGroup directly if it's the base.
        const itemsToAnimate = layerType === 'base' ? [layerGroup] : layerGroup.children;

        itemsToAnimate.forEach((child) => {
            const finalScale = child.scale.clone();

            // We ONLY animate scale. We do not modify position to avoid
            // breaking the complex radial geometries!
            let startScale = new THREE.Vector3(0.001, 0.001, 0.001);

            let delay = layerDelay + itemDelay;
            let duration = 0.6;

            if (layerType === 'base') {
                itemDelay += 0.0;
            }
            else if (layerType === 'outer-border' || layerType === 'fan-segments') {
                itemDelay += 0.02; // Sweeping circular bloom
            }
            else if (layerType === 'triangle-motifs') {
                itemDelay += 0.08; // Pop in triangle by triangle
            }
            else if (layerType === 'inner-fill' || layerType === 'middle-petals') {
                itemDelay += 0.05;
            }
            else if (layerType === 'center-flower') {
                itemDelay += 0.03; // Fast spiral bloom for the flower center
            }

            // Apply starting state
            child.scale.copy(startScale);

            animatedObjects.push({
                object: child,
                delay: delay,
                duration: duration,
                startScale: startScale,
                finalScale: finalScale
            });
        });

        layerDelay += 0.40; // Wait before the next layer starts forming
    });

    return function updateAssembly(deltaTime) {
        if (isCompleted) return;

        elapsedTime += deltaTime;
        let allFinished = true;

        animatedObjects.forEach(item => {
            if (elapsedTime < item.delay) {
                allFinished = false;
                return;
            }

            const rawProgress = Math.min((elapsedTime - item.delay) / item.duration, 1.0);

            const scaleProgress = easeOutBack(rawProgress);

            // Interpolate Scale (blooming into place)
            item.object.scale.set(
                item.finalScale.x * Math.max(0.001, scaleProgress),
                item.finalScale.y * Math.max(0.001, scaleProgress),
                item.finalScale.z * Math.max(0.001, scaleProgress)
            );

            if (rawProgress < 1.0) {
                allFinished = false;
            }
        });

        if (allFinished) {
            // Snap cleanly to final state
            animatedObjects.forEach(item => {
                item.object.scale.copy(item.finalScale);
            });
            isCompleted = true;
        }
    };
}
