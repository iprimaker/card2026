import { initCanvas } from "./canvas.js";
import { initImages } from "./image.js";
import { initFrame } from "./frame.js";
import { initAttribute } from "./attribute.js";
import { initText } from "./text.js";
import { initSerial } from "./serial.js";
import { initSave } from "./save.js";
import { initReset } from "./reset.js";
import { initBuzzPower } from "./buzzPower.js";
import { initWatermark } from "./watermark.js";
import { getCurrentCardType, setCurrentCardType } from "./config.js";

export function startApp(){
    const config = getCurrentCardType();
    const cardTypeSelect = document.getElementById("cardType");

    cardTypeSelect.value = config.type;

    initCanvas();
    initImages();
    initFrame();
    initAttribute();
    initText();
    initSerial();
    initSave();
    initWatermark();
    initBuzzPower();
    initReset();

    cardTypeSelect.addEventListener("change", () => {
        setCurrentCardType(cardTypeSelect.value);
        location.reload();
    });

    console.log("Original Card Maker 起動");
}

window.addEventListener("resize", resizePreview);

setTimeout(resizePreview, 100);

function resizePreview(){
    const preview = document.querySelector(".preview");
    const fabricContainer = document.querySelector(".canvas-container");

    if(!preview || !fabricContainer) return;

    const scale = Math.min(
        preview.clientWidth / 697,
        preview.clientHeight / 1016
    ) * 0.9;

    if(window.innerWidth <= 900){
        fabricContainer.style.position = "absolute";
        fabricContainer.style.left = "50%";
        fabricContainer.style.top = "50%";
        fabricContainer.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }else{
        fabricContainer.style.position = "";
        fabricContainer.style.left = "";
        fabricContainer.style.top = "";
        fabricContainer.style.transform = `scale(${scale})`;
    }

    fabricContainer.style.transformOrigin = "center center";
}
