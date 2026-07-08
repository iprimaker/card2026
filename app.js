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

    const fabricContainer = document.querySelector(".canvas-container");
    const header = document.querySelector("header");

    if(!fabricContainer || !header) return;

    const CARD_WIDTH = 697;
    const CARD_HEIGHT = 1016;

    const margin = 16;

    let availableWidth;
    let availableHeight;

    if(window.innerWidth <= 900){

        // スマホ
        availableWidth = window.innerWidth - margin * 2;
        availableHeight = window.innerHeight - header.offsetHeight - margin * 2;

    }else{

        const preview = document.querySelector(".preview");

        availableWidth = preview.clientWidth - 40;
        availableHeight = preview.clientHeight - 40;

    }

    const scale = Math.min(
        availableWidth / CARD_WIDTH,
        availableHeight / CARD_HEIGHT,
        1
    );

    fabricContainer.style.transform = `translate(-50%, -50%) scale(${scale})`;
    fabricContainer.style.position = "absolute";
    fabricContainer.style.left = "50%";
    fabricContainer.style.top = "50%";
    fabricContainer.style.transformOrigin = "center center";
}
