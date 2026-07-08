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

    resizePreview();

    cardTypeSelect.addEventListener("change", () => {
        setCurrentCardType(cardTypeSelect.value);
        location.reload();
    });

    window.addEventListener("resize", resizePreview);

    console.log("Original Card Maker 起動");
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

app.jsは変える必要ある？
