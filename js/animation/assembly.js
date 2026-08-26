import * as THREE from 'three';

export function setupAssemblyAnimation(pookalamGroup) {
    let elapsedTime = 0;
    let isCompleted = false;

    // Fast, snappy staggered timeline (total duration ~0.75s)
    const layerDelays = {
        'base': 0.00,
        'outer-border': 0.08,
        'fan-segments': 0.16,
        'fan-petal': 0.16,
        'inner-fill': 0.24,
        'triangle-motifs': 0.32,
        'star-triangle': 0.32,
        'middle-petals': 0.40,
        'middle-petal': 0.40,
        'center-flower': 0.48,
        'center-petal': 0.48,
        'inner-center-petal': 0.54,
        'flower-center': 0.58
    };

    const duration = 0.45; // Duration per layer
    const animatedItems = [];

    // Traverse root groups and mesh children
    pookalamGroup.children.forEach((layerGroup, layerIdx) => {
        let delay = layerIdx * 0.08;

        if (layerGroup.userData && layerGroup.userData.type && layerDelays[layerGroup.userData.type] !== undefined) {
            delay = layerDelays[layerGroup.userData.type];
        }

        animatedItems.push({
            object: layerGroup,
            delay: delay,
            duration: duration,
            finalScale: layerGroup.scale.clone()
        });

        // Set initial scale to near zero
        layerGroup.scale.set(0.001, 0.001, 0.001);
    });

    // Fast elastic ease-out
    function easeOutBack(x) {
        const c1 = 1.35;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }

    return function updateAssembly(deltaTime) {
        if (isCompleted) return;

        elapsedTime += deltaTime;
        let allFinished = true;

        animatedItems.forEach(item => {
            if (elapsedTime < item.delay) {
                allFinished = false;
                return;
            }

            const progress = Math.min((elapsedTime - item.delay) / item.duration, 1.0);
            const eased = easeOutBack(progress);

            item.object.scale.x = item.finalScale.x * Math.max(0, eased);
            item.object.scale.y = item.finalScale.y * Math.max(0, eased);
            item.object.scale.z = item.finalScale.z * Math.max(0, eased);

            if (progress < 1.0) {
                allFinished = false;
            }
        });

        if (allFinished) {
            isCompleted = true;
        }
    };
}
