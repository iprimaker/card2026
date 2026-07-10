import {
    initCanvas,
    getCanvas,
    CARD_WIDTH,
    CARD_HEIGHT
} from "./canvas.js";

import {
    initImages,
    getCharacterState,
    restoreCharacterState,
    clearImageReferences
} from "./image.js";

import { initFrame } from "./frame.js";
import { initRarity } from "./rarity.js";
import { initAttribute } from "./attribute.js";
import { initText } from "./text.js";
import { initSerial } from "./serial.js";
import { initSave } from "./save.js";
import { initReset } from "./reset.js";
import { initBuzzPower } from "./buzzPower.js";

import {
    getCurrentCardType,
    setCurrentCardType
} from "./config.js";

let initialized = false;

export function startApp(){

    const config = getCurrentCardType();
    const cardTypeToggle =
        document.getElementById("cardTypeToggle");

    if(cardTypeToggle){
        cardTypeToggle.checked = config.type === "B";
    }

    initCanvas();
    buildEditor();

    initSave();
    initReset();

    resizePreview();

    if(cardTypeToggle){

        cardTypeToggle.onchange = () => {

            const editorState = captureEditorState();

            const nextType =
                cardTypeToggle.checked ? "B" : "A";

            setCurrentCardType(nextType);

            rebuildEditor({
                ...editorState,
                preserveCharacter: true,
                preserveText: true
            });
        };
    }

    if(!initialized){
        window.addEventListener(
            "resize",
            resizePreview
        );

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
    initRarity();

    resizePreview();
}

function captureEditorState(){

    const nameInput =
        document.getElementById("cardName");

    const costumeInput =
        document.getElementById("costumeName");

    const textVisible =
        document.getElementById("textVisible");

    return {
        character: getCharacterState(),

        name:
            nameInput
                ? nameInput.value
                : "",

        costume:
            costumeInput
                ? costumeInput.value
                : "",

        textVisible:
            textVisible
                ? textVisible.checked
                : false
    };
}

export function rebuildEditor(options = {}){

    const {
        preserveCharacter = false,
        preserveText = false
    } = options;

    const savedState = {
        character:
            preserveCharacter
                ? options.character ?? getCharacterState()
                : null,

        name:
            preserveText
                ? options.name ?? ""
                : "",

        costume:
            preserveText
                ? options.costume ?? ""
                : "",

        textVisible:
            preserveText
                ? Boolean(options.textVisible)
                : false
    };

    const canvas = getCanvas();

    const characterInput =
        document.getElementById("character");

    if(characterInput){
        characterInput.value = "";
    }

    if(canvas){
        canvas.discardActiveObject();
        canvas.clear();
        canvas.requestRenderAll();
    }

    clearImageReferences();

    buildEditor();

    if(savedState.character){
        restoreCharacterState(savedState.character);
    }

    if(preserveText){
        restoreTextState(savedState);
    }
}

function restoreTextState(state){

    const nameInput =
        document.getElementById("cardName");

    const costumeInput =
        document.getElementById("costumeName");

    const textVisible =
        document.getElementById("textVisible");

    if(nameInput){
        nameInput.value = state.name;

        nameInput.dispatchEvent(
            new Event("input", {
                bubbles: true
            })
        );
    }

    if(costumeInput){
        costumeInput.value = state.costume;

        costumeInput.dispatchEvent(
            new Event("input", {
                bubbles: true
            })
        );
    }

    if(textVisible){
        textVisible.checked =
            state.textVisible;

        textVisible.dispatchEvent(
            new Event("change", {
                bubbles: true
            })
        );
    }
}

function resizePreview(){

    const preview =
        document.querySelector(".preview");

    const canvas = getCanvas();

    if(!preview || !canvas) return;

    const margin =
        window.innerWidth <= 900
            ? 24
            : 40;

    const availableWidth =
        preview.clientWidth - margin;

    const availableHeight =
        preview.clientHeight - margin;

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
