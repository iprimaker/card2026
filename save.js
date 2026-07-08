import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";

export function initSave(){
    const saveButton = document.getElementById("saveButton");

    if(!saveButton) return;

    saveButton.addEventListener("click", saveImage);
}

function saveImage(){

    const canvas = getCanvas();

    if(!canvas) return;

    sortLayers();
    canvas.discardActiveObject();
    canvas.renderAll();

    const image = canvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 3,
        enableRetinaScaling: true
    });

    const link = document.createElement("a");
    link.href = image;
    link.download = "original-card.png";
    link.click();

}
