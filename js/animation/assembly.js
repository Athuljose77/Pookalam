import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// Easing library
// ─────────────────────────────────────────────────────────────────────────────

function easeOutCubic(x)   { return 1 - Math.pow(1 - x, 3); }
function easeOutBack(x) {
    const c1 = 1.4, c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}
function easeOutElastic(x) {
    if (x === 0 || x === 1) return x;
    const c4 = (2 * Math.PI) / 3;
    return Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}
function easeOutSine(x)    { return Math.sin((x * Math.PI) / 2); }

// Per-layer easing choices
function scaleEase(layerType) {
    switch (layerType) {
        case 'center-flower':   return easeOutElastic;  // dramatic bloom
        case 'middle-petals':   return easeOutBack;     // gentle bounce
        case 'triangle-motifs': return easeOutBack;     // crisp pop
        case 'inner-fill':      return easeOutCubic;    // smooth wedge reveal
        case 'fan-segments':    return easeOutCubic;    // flowing arc settle
        default:                return easeOutSine;     // soft for border/ring
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Assembly order: center → outward, like a real artisan
// ─────────────────────────────────────────────────────────────────────────────

const LAYER_ORDER = {
    'base':           0,
    'inner-fill':     1,
    'center-flower':  2,
    'middle-petals':  3,
    'triangle-motifs':4,
    'fan-segments':   5,
    'petal-ring':     6,
    'outer-border':   7,
};

// ─────────────────────────────────────────────────────────────────────────────
// Per-layer stagger timing between individual items (seconds)
// ─────────────────────────────────────────────────────────────────────────────

function itemStagger(layerType) {
    switch (layerType) {
        case 'inner-fill':      return 0.055; // wedge-by-wedge sweep
        case 'fan-segments':    return 0.060; // one arm at a time
        case 'triangle-motifs': return 0.070; // triangle by triangle
        case 'middle-petals':   return 0.060; // petal by petal
        case 'center-flower':   return 0.030; // rapid spiral bloom
        case 'outer-border':    return 0.008; // fast dot sweep
        default:                return 0.020;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-layer animation duration
// ─────────────────────────────────────────────────────────────────────────────

function layerDuration(layerType) {
    switch (layerType) {
        case 'center-flower':   return 0.75; // elastic needs more time
        case 'inner-fill':      return 0.45;
        case 'fan-segments':    return 0.50;
        default:                return 0.50;
    }
}

// How far above final position each element starts (drop-in height)
const DROP_HEIGHT = 1.6;

// ─────────────────────────────────────────────────────────────────────────────
export function setupAssemblyAnimation(pookalamGroup) {
// ─────────────────────────────────────────────────────────────────────────────

    let elapsedTime = 0;
    let isCompleted = false;
    const animatedObjects = [];

    // Sort layer groups center-outward
    const sortedLayers = [...pookalamGroup.children].sort((a, b) => {
        const oa = LAYER_ORDER[a.userData.type] ?? 99;
        const ob = LAYER_ORDER[b.userData.type] ?? 99;
        return oa - ob;
    });

    // Brief intro pause before anything starts
    let layerStartTime = 0.3;

    sortedLayers.forEach((layerGroup) => {
        const layerType = layerGroup.userData.type;
        const stagger   = itemStagger(layerType);
        const duration  = layerDuration(layerType);
        const ease      = scaleEase(layerType);

        const itemsToAnimate =
            layerType === 'base' ? [layerGroup] : [...layerGroup.children];

        itemsToAnimate.forEach((child, idx) => {
            const finalScale = child.scale.clone();
            const baseY      = child.position.y;

            // Hide element before its time
            child.scale.set(0.001, 0.001, 0.001);
            child.position.y = baseY + DROP_HEIGHT;

            animatedObjects.push({
                object:     child,
                delay:      layerStartTime + idx * stagger,
                duration,
                ease,
                finalScale,
                baseY,
            });
        });

        // Next layer starts after this layer's first element + a gap
        const layerSpan = (itemsToAnimate.length - 1) * stagger + duration * 0.55;
        layerStartTime += layerSpan * 0.38 + 0.12;
    });

    // ── Update function (called every frame) ──────────────────────────────────
    return function updateAssembly(deltaTime) {
        if (isCompleted) return;

        elapsedTime += deltaTime;
        let allFinished = true;

        animatedObjects.forEach(item => {
            if (elapsedTime < item.delay) {
                allFinished = false;
                return;
            }

            const raw      = Math.min((elapsedTime - item.delay) / item.duration, 1.0);
            const scaleProg = item.ease(raw);

            // Scale: bloom up with per-type easing
            item.object.scale.set(
                item.finalScale.x * Math.max(0.001, scaleProg),
                item.finalScale.y * Math.max(0.001, scaleProg),
                item.finalScale.z * Math.max(0.001, scaleProg)
            );

            // Y drop: settle smoothly using cubic (independent of scale easing)
            const yProg = easeOutCubic(raw);
            item.object.position.y = item.baseY + DROP_HEIGHT * (1 - yProg);

            if (raw < 1.0) allFinished = false;
        });

        if (allFinished) {
            animatedObjects.forEach(item => {
                item.object.scale.copy(item.finalScale);
                item.object.position.y = item.baseY;
            });
            isCompleted = true;
        }
    };
}
