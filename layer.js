import { getCanvas } from "./canvas.js";

const LAYER_ORDER = {
    background: 1,
    character: 2,
    frame: 3,
    attribute: 4,
    text: 5,
    serial: 6,
    buzzPower: 7,
    rarity: 8
};

export function sortLayers(){

    const canvas = getCanvas();

    if(!canvas) return;

    const objects = canvas.getObjects();

    objects.sort((a, b) => {
        return (LAYER_ORDER[a.layerType] || 0) - (LAYER_ORDER[b.layerType] || 0);
    });

    objects.forEach((obj, index) => {
        canvas.moveTo(obj, index);
    });

    canvas.requestRenderAll();
}
