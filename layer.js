import { getCanvas } from "./canvas.js";

const LAYER_ORDER = {
    background: 0,
    character: 10,
    frame: 20,
    attribute: 30,
    buzzPower: 40,
    text: 50,
    serial: 60,
    rarity: 70,
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
