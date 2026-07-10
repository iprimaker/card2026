import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { cloneCachedImage } from "./preload.js";

let backgroundObject = null;
let characterObject = null;
let hideSelectionTimer = null;

const CARD_WIDTH = 697;
const CARD_HEIGHT = 1016;

const BACKGROUND_LIST = [
    { id: "background1", name: "ひみつ　　A-☆2タイプ", path: "./backA1_1.png" },
    { id: "background2", name: "ひみつ　　A-☆3タイプ", path: "./backA1.png" },
    { id: "background3", name: "おねがい　Bタイプ", path: "./backB2.png" }
];

export function initImages(){

    const backgroundSelectArea = document.getElementById("backgroundSelectArea");
    const backgroundSelect = document.getElementById("backgroundSelect");
    const characterInput = document.getElementById("character");

    if(!backgroundSelectArea || !backgroundSelect || !characterInput){
        console.error("画像関連のHTML要素が見つかりません");
        return;
    }

    setupBackgroundSelect(backgroundSelect);

    backgroundSelect.addEventListener("change", () => {
        const selected = BACKGROUND_LIST.find(bg => bg.id === backgroundSelect.value);

        if(selected){
            drawBackground(selected.path);
        }
    });

    characterInput.addEventListener("change", uploadCharacter);

    backgroundSelectArea.style.display = "block";

    backgroundSelect.value = BACKGROUND_LIST[0].id;
    drawBackground(BACKGROUND_LIST[0].path);

    const canvas = getCanvas();

    if(canvas){
        canvas.on("object:moving", startHideSelectionTimer);
        canvas.on("object:scaling", startHideSelectionTimer);
        canvas.on("object:rotating", startHideSelectionTimer);
        canvas.on("mouse:down", startHideSelectionTimer);
    }

    enableTouchZoom();
}

function setupBackgroundSelect(backgroundSelect){

    backgroundSelect.innerHTML = "";

    BACKGROUND_LIST.forEach(bg => {
        const option = document.createElement("option");

        option.value = bg.id;
        option.textContent = bg.name;

        backgroundSelect.appendChild(option);
    });
}

function drawBackground(path){

    const canvas = getCanvas();

    if(!canvas) return;

    if(backgroundObject){
        canvas.remove(backgroundObject);
        backgroundObject = null;
    }

    cloneCachedImage(path, img => {

        img.set({
            left: CARD_WIDTH / 2,
            top: CARD_HEIGHT / 2,
            originX: "center",
            originY: "center",

            selectable: false,
            evented: false,
            hasControls: false,
            hasBorders: false
        });

        img.layerType = "background";
        img.visible = true;

        backgroundObject = img;

        canvas.add(backgroundObject);

        sortLayers();
        canvas.requestRenderAll();
    });
}

function uploadCharacter(e){

    const file = e.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = () => {

        const canvas = getCanvas();

        if(!canvas) return;

        fabric.Image.fromURL(reader.result, img => {

            if(characterObject){
                canvas.remove(characterObject);
                characterObject = null;
            }

            img.set({
                left: CARD_WIDTH / 2,
                top: CARD_HEIGHT / 2,
                originX: "center",
                originY: "center",

                selectable: true,
                evented: true,

                hasControls: true,
                hasBorders: true,

                lockRotation: false,

                cornerStyle: "circle",
                transparentCorners: false,

                cornerSize: 18,
                padding: 8,

                borderColor: "#ff5fc0",
                cornerColor: "#ff5fc0",
                cornerStrokeColor: "#ffffff",
                borderScaleFactor: 3,

                rotatingPointOffset: 40
            });

            img.layerType = "character";

            characterObject = img;

            canvas.add(characterObject);
            canvas.setActiveObject(characterObject);

            sortLayers();
            canvas.requestRenderAll();

            startHideSelectionTimer();
        });
    };

    reader.readAsDataURL(file);
}

function startHideSelectionTimer(){

    const canvas = getCanvas();

    if(!canvas) return;

    if(hideSelectionTimer){
        clearTimeout(hideSelectionTimer);
    }

    hideSelectionTimer = setTimeout(() => {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
    }, 5000);
}

function enableTouchZoom(){

    const canvas = getCanvas();

    if(!canvas || !canvas.upperCanvasEl) return;

    let lastDistance = null;

    canvas.upperCanvasEl.addEventListener("touchstart", e => {

        if(e.touches.length === 2){
            e.preventDefault();

            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;

            lastDistance = Math.sqrt(dx * dx + dy * dy);
        }

    }, { passive:false });

    canvas.upperCanvasEl.addEventListener("touchmove", e => {

        if(e.touches.length !== 2) return;

        const activeObject = canvas.getActiveObject();

        if(!activeObject || activeObject.layerType !== "character") return;

        e.preventDefault();

        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if(lastDistance){
            const scaleChange = distance / lastDistance;

            activeObject.scaleX = Math.max(
                0.1,
                Math.min(activeObject.scaleX * scaleChange, 5)
            );

            activeObject.scaleY = Math.max(
                0.1,
                Math.min(activeObject.scaleY * scaleChange, 5)
            );

            activeObject.setCoords();
            canvas.requestRenderAll();

            startHideSelectionTimer();
        }

        lastDistance = distance;

    }, { passive:false });

    canvas.upperCanvasEl.addEventListener("touchend", () => {
        lastDistance = null;
    });
}

export function getCharacterState(){

    if(!characterObject) return null;

    return {
        src: characterObject.getSrc(),

        left: characterObject.left,
        top: characterObject.top,

        scaleX: characterObject.scaleX,
        scaleY: characterObject.scaleY,

        angle: characterObject.angle,

        flipX: characterObject.flipX,
        flipY: characterObject.flipY,

        skewX: characterObject.skewX,
        skewY: characterObject.skewY,

        opacity: characterObject.opacity
    };
}

export function restoreCharacterState(state){

    if(!state || !state.src) return;

    const canvas = getCanvas();

    if(!canvas) return;

    fabric.Image.fromURL(state.src, img => {

        if(characterObject){
            canvas.remove(characterObject);
        }

        img.set({
            left: state.left ?? CARD_WIDTH / 2,
            top: state.top ?? CARD_HEIGHT / 2,

            originX: "center",
            originY: "center",

            scaleX: state.scaleX ?? 1,
            scaleY: state.scaleY ?? 1,

            angle: state.angle ?? 0,

            flipX: state.flipX ?? false,
            flipY: state.flipY ?? false,

            skewX: state.skewX ?? 0,
            skewY: state.skewY ?? 0,

            opacity: state.opacity ?? 1,

            selectable: true,
            evented: true,

            hasControls: true,
            hasBorders: true,

            lockRotation: false,

            cornerStyle: "circle",
            transparentCorners: false,

            cornerSize: 18,
            padding: 8,

            borderColor: "#ff5fc0",
            cornerColor: "#ff5fc0",
            cornerStrokeColor: "#ffffff",
            borderScaleFactor: 3,

            rotatingPointOffset: 40
        });

        img.layerType = "character";

        characterObject = img;

        canvas.add(characterObject);
        canvas.setActiveObject(characterObject);

        sortLayers();
        canvas.requestRenderAll();

        startHideSelectionTimer();
    });
}

export function clearImageReferences(){

    backgroundObject = null;
    characterObject = null;

    if(hideSelectionTimer){
        clearTimeout(hideSelectionTimer);
        hideSelectionTimer = null;
    }
}
