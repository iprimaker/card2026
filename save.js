import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";

export function initSave(){

    const saveButton = document.getElementById("saveButton");

    const saveModal = document.getElementById("saveModal");
    const confirmButton = document.getElementById("confirmSaveButton");
    const cancelButton = document.getElementById("cancelSaveButton");

    saveButton.addEventListener("click", () => {
        saveModal.classList.add("show");
    });

    cancelButton.addEventListener("click", () => {
        saveModal.classList.remove("show");
    });

    confirmButton.addEventListener("click", () => {

        saveModal.classList.remove("show");

        saveImage();

    });

}

function saveImage(){

    const canvas = getCanvas();

    sortLayers();
    canvas.discardActiveObject();
    canvas.renderAll();

    const image = canvas.toDataURL({
        format:"png",
        quality:1,
        multiplier:3
    });

    const link = document.createElement("a");

    link.href = image;
    link.download = "original-card.png";

    link.click();

}
