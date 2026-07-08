import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";

export function initSave(){
    const saveButton = document.getElementById("saveButton");

    if(!saveButton) return;

    saveButton.addEventListener("click", saveImage);
}

function saveImage(){
    const canvas = getCanvas();

    sortLayers();
    canvas.discardActiveObject();
    canvas.renderAll();

    showSaveToast("保存中...");

    setTimeout(() => {
        const image = canvas.toDataURL({
            format: "png",
            quality: 1
        });

        const link = document.createElement("a");
        link.href = image;
        link.download = "aipri-card.png";
        link.click();

        showSaveToast("保存しました！");
    }, 400);
}

function showSaveToast(message){
    const toast = document.getElementById("saveToast");
    const text = toast.querySelector(".saveText");

    text.textContent = message;

    toast.classList.add("show");

    clearTimeout(toast.hideTimer);

    toast.hideTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 1800);
}
