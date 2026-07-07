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

    const cardTypeSelect = document.getElementById("cardType");
    const config = getCurrentCardType();

    cardTypeSelect.value = config.type;

    initCanvas();
    initImages();
    initFrame();
    initAttribute();
    initText();
    initSerial();
    initBuzzPower();
    initSave();
    initReset();

    cardTypeSelect.addEventListener("change", () => {
        setCurrentCardType(cardTypeSelect.value);
        location.reload();
    });

    resizePreview();

    console.log("Original Card Maker 起動");

}

window.addEventListener("resize", resizePreview);

function resizePreview(){

    const preview = document.querySelector(".preview");
    const fabricContainer = document.querySelector(".canvas-container");

    if(!preview || !fabricContainer){
        return;
    }

    const padding = window.innerWidth <= 900 ? 40 : 80;

    const availableWidth = preview.clientWidth - padding;
    const availableHeight = preview.clientHeight - padding;

    const scale = Math.min(
        availableWidth / 697,
        availableHeight / 1016
    );

    fabricContainer.style.transform = `scale(${scale})`;
    fabricContainer.style.transformOrigin = "center center";
}
