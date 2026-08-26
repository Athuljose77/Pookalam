import * as THREE from 'three';

export function setupAssemblyAnimation(pookalamGroup) {
    let elapsedTime = 0;
    let isCompleted = false;

    // Each layer gets a different entrance style:
    //   'fly-in-radial'  — slides from far outside inward to final position
    //   'rise'           — appears from below (Y offset) and rises into place
    //   'bloom'          — scales up from center (center flower)
    //   'fade-in'        — just fades opacity in (base disk)

    const layerConfigs = [
        // [0] Base disk — fade up from below
        { style: 'rise',           delay: 0.00, duration: 0.40, offsetY: -0.4 },
        // [1] Outer border ring — fly in from far outside
        { style: 'fly-in-radial',  delay: 0.20, duration: 0.50, flyDistance: 3.5 },
        // [2] Fan segments (concentric arcs) — fly in from outside
        { style: 'fly-in-radial',  delay: 0.45, duration: 0.55, flyDistance: 2.5 },
        // [3] Inner fill sectors — rise up from below
        { style: 'rise',           delay: 0.60, duration: 0.45, offsetY: -0.5 },
        // [4] Triangle motifs — fly in radially
        { style: 'fly-in-radial',  delay: 0.80, duration: 0.50, flyDistance: 1.8 },
        // [5] Middle petals (rosette) — bloom from center
        { style: 'bloom',          delay: 1.00, duration: 0.45 },
        // [6] Center flower — bloom last, biggest impact
        { style: 'bloom',          delay: 1.20, duration: 0.50 }
    ];

    const animatedLayers = [];

    pookalamGroup.children.forEach((layerGroup, i) => {
        const cfg = layerConfigs[i] || { style: 'bloom', delay: i * 0.15, duration: 0.45 };

        const finalPos = layerGroup.position.clone();
        const finalScale = layerGroup.scale.clone();

        let startPos = finalPos.clone();
        let startScale = finalScale.clone();

        if (cfg.style === 'fly-in-radial') {
            // Start scaled to 0 and at the same position — then grow outward
            startScale.set(0.001, 0.001, 0.001);
        } else if (cfg.style === 'rise') {
            startPos.y = finalPos.y + (cfg.offsetY || -0.6);
            startScale.set(0.001, 0.001, 0.001);
        } else if (cfg.style === 'bloom') {
            startScale.set(0.001, 0.001, 0.001);
        }

        // Apply initial state
        layerGroup.position.copy(startPos);
        layerGroup.scale.copy(startScale);

        animatedLayers.push({
            object: layerGroup,
            style: cfg.style,
            delay: cfg.delay,
            duration: cfg.duration,
            startPos: startPos.clone(),
            finalPos: finalPos.clone(),
            startScale: startScale.clone(),
            finalScale: finalScale.clone()
        });
    });

    // Elastic ease-out for snappy organic feel
    function easeOutBack(x) {
        const c1 = 1.2;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }

    // Smooth ease-out for rising layers
    function easeOutCubic(x) {
        return 1 - Math.pow(1 - x, 3);
    }

    return function updateAssembly(deltaTime) {
        if (isCompleted) return;

        elapsedTime += deltaTime;
        let allFinished = true;

        animatedLayers.forEach(item => {
            if (elapsedTime < item.delay) {
                allFinished = false;
                return;
            }

            const rawProgress = Math.min((elapsedTime - item.delay) / item.duration, 1.0);

            let easedScale, easedPos;

            if (item.style === 'fly-in-radial') {
                easedScale = easeOutBack(rawProgress);
                item.object.scale.x = item.finalScale.x * Math.max(0, easedScale);
                item.object.scale.y = item.finalScale.y * Math.max(0, easedScale);
                item.object.scale.z = item.finalScale.z * Math.max(0, easedScale);

            } else if (item.style === 'rise') {
                easedPos = easeOutCubic(rawProgress);
                easedScale = easeOutBack(rawProgress);
                item.object.position.y = item.startPos.y + (item.finalPos.y - item.startPos.y) * easedPos;
                item.object.scale.x = item.finalScale.x * Math.max(0, easedScale);
                item.object.scale.y = item.finalScale.y * Math.max(0, easedScale);
                item.object.scale.z = item.finalScale.z * Math.max(0, easedScale);

            } else if (item.style === 'bloom') {
                easedScale = easeOutBack(rawProgress);
                item.object.scale.x = item.finalScale.x * Math.max(0, easedScale);
                item.object.scale.y = item.finalScale.y * Math.max(0, easedScale);
                item.object.scale.z = item.finalScale.z * Math.max(0, easedScale);
            }

            if (rawProgress < 1.0) {
                allFinished = false;
            }
        });

        if (allFinished) {
            // Snap all to exact final state
            animatedLayers.forEach(item => {
                item.object.position.copy(item.finalPos);
                item.object.scale.copy(item.finalScale);
            });
            isCompleted = true;
        }
    };
}
