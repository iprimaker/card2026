import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { getCurrentCardType } from "./config.js";

let serialText = null;

export function initSerial(){

    const canvas = getCanvas();
    const config = getCurrentCardType();

    const prefix = config.type === "A" ? "HAS" : "OAS";

    const randomNumber = String(Math.floor(Math.random() * 100000)).padStart(5, "0");

    serialText = new fabric.Text(`${prefix}-${randomNumber}`, {
    left: 638,
    top: 27,
    originX: "center",

    fontFamily: "Zen Maru Gothic",

    fontSize: 18,
    fontWeight: "700",

    fill: "#ffffff",

    selectable: false,
    evented: false
});

    serialText.layerType = "serial";

    canvas.add(serialText);
    sortLayers();
}
