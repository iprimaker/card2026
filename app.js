import { initCanvas, getCanvas, CARD_WIDTH, CARD_HEIGHT } from "./canvas.js";
import { initImages } from "./image.js";
import { initFrame } from "./frame.js";
import { initAttribute } from "./attribute.js";
import { initText } from "./text.js";
import { initSerial } from "./serial.js";
import { initSave } from "./save.js";
import { initReset } from "./reset.js";
import { initBuzzPower } from "./buzzPower.js";
import { getCurrentCardType, setCurrentCardType } from "./config.js";

let initialized = false;

export function startApp(){

    const config = getCurrentCardType();
    const cardTypeSelect = document.getElementById("cardType");

    if(cardTypeSelect){
        cardTypeSelect.value = config.type;
    }

    initCanvas();

    buildEditor();

    initSave();
    initReset();

    resizePreview();

    if(cardTypeSelect){
        cardTypeSelect.addEventListener("change", () => {
            setCurrentCardType(cardTypeSelect.value);
            rebuildEditor();
        });
    }

    if(!initialized){
        window.addEventListener("resize", resizePreview);
        initialized = true;
    }

    console.log("Original Card Maker 起動");
}

function buildEditor(){

    initImages();
    initFrame();
    initAttribute();
    initText();
    initSerial();
    initBuzzPower();

    resizePreview();
}

function rebuildEditor(){

    const canvas = getCanvas();

    if(canvas){
        canvas.discardActiveObject();
        canvas.clear();
        canvas.requestRenderAll();
    }

    buildEditor();
}

function resizePreview(){

    const preview = document.querySelector(".preview");
    const canvas = getCanvas();

    if(!preview || !canvas) return;

    const margin = window.innerWidth <= 900 ? 24 : 40;

    const availableWidth = preview.clientWidth - margin;
    const availableHeight = preview.clientHeight - margin;

    const scale = Math.min(
        availableWidth / CARD_WIDTH,
        availableHeight / CARD_HEIGHT,
        1
    );

    canvas.setZoom(scale);

    canvas.setDimensions({
        width: CARD_WIDTH * scale,
        height: CARD_HEIGHT * scale
    });

    canvas.requestRenderAll();
}
