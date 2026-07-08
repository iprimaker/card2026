import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";

export function initSave(){
    const saveButton = document.getElementById("saveButton");

    saveButton.addEventListener("click", saveImage);
}

function saveImage(){

    const canvas = getCanvas();

    sortLayers();
    canvas.discardActiveObject();
    canvas.renderAll();

    const image = canvas.toDataURL({
        format: "png",
        quality: 1
    });

    const link = document.createElement("a");
    link.href = image;
    link.download = "original-card.png";
    link.click();

    alert("保存しました！");
}
}
