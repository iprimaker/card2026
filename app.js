import { initCanvas } from "./canvas.js";
import { initImages } from "./image.js";
import { initFrame } from "./frame.js";
import { initAttribute } from "./attribute.js";
import { initText } from "./text.js";
import { initSerial } from "./serial.js";
import { initSave } from "./save.js";
import { initReset } from "./reset.js";
import { initBuzzPower } from "./buzzPower.js";
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

    const CARD_WIDTH = 697;
    const CARD_HEIGHT = 1016;

    let scale;

    if(window.innerWidth <= 900){
        const availableWidth = window.innerWidth - 24;

        scale = availableWidth / CARD_WIDTH;
        scale = Math.min(scale, 1);
    }else{
        scale = Math.min(
            preview.clientWidth / CARD_WIDTH,
            preview.clientHeight / CARD_HEIGHT
        ) * 0.9;
    }

    fabricContainer.style.position = "";
    fabricContainer.style.left = "";
    fabricContainer.style.top = "";
    fabricContainer.style.transform = `scale(${scale})`;
    fabricContainer.style.transformOrigin = "center center";
}
