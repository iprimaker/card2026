import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";

let watermark = null;

export function initWatermark(){

    const canvas = getCanvas();

    watermark = new fabric.Text("ipricardmaker",{

        left:665,
        top:995,

        originX:"right",
        originY:"bottom",

        fontSize:16,
        fontFamily:"Arial",

        fill:"rgba(255,255,255,0.45)",

        selectable:false,
        evented:false
    });

    watermark.layerType = "watermark";

    canvas.add(watermark);

    sortLayers();
}
