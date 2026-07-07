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

    const backgroundVisible = document.getElementById("backgroundVisible");
    const backgroundSelectArea = document.getElementById("backgroundSelectArea");
    const backgroundSelect = document.getElementById("backgroundSelect");
    const characterInput = document.getElementById("character");

    if(!backgroundVisible || !backgroundSelectArea || !backgroundSelect || !characterInput){
        console.error("画像関連のHTML要素が見つかりません");
        return;

    enableTouchZoom();
        
    }

    setupBackgroundSelect(backgroundSelect);

    backgroundSelect.addEventListener("change", () => {
        const selected = BACKGROUND_LIST.find(bg => bg.id === backgroundSelect.value);

        if(selected){
            drawBackground(selected.path);
        }
    });

    backgroundVisible.addEventListener("change", () => {
        const visible = backgroundVisible.checked;

        backgroundSelectArea.style.display = visible ? "block" : "none";

        if(backgroundObject){
            backgroundObject.visible = visible;
            sortLayers();
        }
    });

    characterInput.addEventListener("change", uploadCharacter);

    backgroundSelectArea.style.display = backgroundVisible.checked ? "block" : "none";

    if(BACKGROUND_LIST.length > 0){
        backgroundSelect.value = BACKGROUND_LIST[0].id;
        drawBackground(BACKGROUND_LIST[0].path);
    }

    const canvas = getCanvas();

    canvas.on("object:moving", startHideSelectionTimer);
    canvas.on("object:scaling", startHideSelectionTimer);
    canvas.on("object:rotating", startHideSelectionTimer);
    canvas.on("mouse:down", startHideSelectionTimer);
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
            left: canvas.getWidth() / 2,
            top: canvas.getHeight() / 2,
            originX: "center",
            originY: "center",
            selectable: false,
            evented: false
        });

        img.layerType = "background";
        img.visible = document.getElementById("backgroundVisible").checked;

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

    if(!canvas) return;

    let lastDistance = null;

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

            activeObject.scaleX *= scaleChange;
            activeObject.scaleY *= scaleChange;

            activeObject.setCoords();

            canvas.requestRenderAll();

        }

        lastDistance = distance;

    }, { passive:false });

    canvas.upperCanvasEl.addEventListener("touchend", () => {
        lastDistance = null;
    });

}
