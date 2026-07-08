import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";

let backgroundObject = null;
let characterObject = null;
let hideSelectionTimer = null;

const BACKGROUND_LIST = [
    { id: "background1", name: "ひみつ　Aタイプ", path: "./backA1.png" },
    { id: "background2", name: "おねがい　Bタイプ", path: "./backB2.png" }
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

    if(BACKGROUND_LIST.length > 0){
        backgroundSelect.value = BACKGROUND_LIST[0].id;
        drawBackground(BACKGROUND_LIST[0].path);
    }

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

    fabric.Image.fromURL(path, img => {

       img.set({
    left: 697 / 2,
    top: 1016 / 2,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false
});

        img.layerType = "background";
        img.visible = true;

        backgroundObject = img;

        canvas.add(backgroundObject);
        sortLayers();

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
                left: canvas.getWidth() / 2,
                top: canvas.getHeight() / 2,
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

    canvas.upperCanvasEl.addEventListener("touchstart", (e) => {

        if(e.touches.length === 2){
            e.preventDefault();

            const touch1 = e.touches[0];
            const touch2 = e.touches[1];

            const dx = touch1.clientX - touch2.clientX;
            const dy = touch1.clientY - touch2.clientY;

            lastDistance = Math.sqrt(dx * dx + dy * dy);
        }

    }, { passive:false });

    canvas.upperCanvasEl.addEventListener("touchmove", (e) => {

        if(e.touches.length !== 2) return;

        e.preventDefault();

        const activeObject = canvas.getActiveObject();

        if(!activeObject || activeObject.layerType !== "character") return;

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if(lastDistance){
            const scaleChange = distance / lastDistance;

            let newScaleX = activeObject.scaleX * scaleChange;
            let newScaleY = activeObject.scaleY * scaleChange;

            newScaleX = Math.max(0.1, Math.min(newScaleX, 5));
            newScaleY = Math.max(0.1, Math.min(newScaleY, 5));

            activeObject.scaleX = newScaleX;
            activeObject.scaleY = newScaleY;

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
