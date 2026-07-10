import { getCanvas } from "./canvas.js";

let watermarkObject = null;

export function initWatermark(){

    const canvas = getCanvas();

    if(!canvas) return;

    if(watermarkObject){
        canvas.remove(watermarkObject);
    }

    watermarkObject = new fabric.Text("ipricardmaker", {
        left: 680,
        top: 1000,

        originX: "right",
        originY: "bottom",

        fontSize: 11,
        fontFamily: "Arial",
        fontWeight: "bold",

        fill: "#ffffff",
        opacity: 0.75,

        selectable: false,
        evented: false
    });

    watermarkObject.layerType = "watermark";

    canvas.add(watermarkObject);
}
