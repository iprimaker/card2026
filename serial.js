import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { getCurrentCardType } from "./config.js";

let serialText = null;

export function initSerial(){

    const canvas = getCanvas();
    const config = getCurrentCardType();

    const serialModeText = document.getElementById("serialModeText");
    const serialModeToggle = document.getElementById("serialModeToggle");
    const serialManual = document.getElementById("serialManual");
    const serialManualArea = document.getElementById("serialManualArea");

    serialText = new fabric.Text("", {
        left: 635,
        top: 25,
        originX: "center",

        fontFamily: "Zen Maru Gothic",
        fontSize: 20,
        fontWeight: 900,

        fill: "#ffffff",

        selectable: false,
        evented: false
    });

    serialText.layerType = "serial";
    canvas.add(serialText);

    function updateSerial(){

        const randomMode = serialModeToggle ? serialModeToggle.checked : true;

        if(randomMode){

            if(serialModeText){
                serialModeText.textContent = "自動設定中";
            }

            if(serialManualArea){
                serialManualArea.style.display = "none";
            }

            serialText.text = generateRandomSerial(config.type);

        }else{

            if(serialModeText){
                serialModeText.textContent = "手動設定中";
            }

            if(serialManualArea){
                serialManualArea.style.display = "block";
            }

            const value = serialManual ? serialManual.value.toUpperCase() : "";

            serialText.text = isValidSerial(value) ? value : "ABC-123";
        }

        sortLayers();
        canvas.requestRenderAll();
    }

    if(serialModeToggle){
        serialModeToggle.addEventListener("change", updateSerial);
    }

    if(serialManual){
        serialManual.addEventListener("input", () => {
            serialManual.value = formatSerialInput(serialManual.value);
            updateSerial();
        });
    }

    updateSerial();
}

function generateRandomSerial(type){

    const prefix = type === "B" ? "OAS" : "HAS";
    const number = Math.floor(Math.random() * 1000).toString().padStart(3, "0");

    return `${prefix}-${number}`;
}

function formatSerialInput(value){

    let cleaned = value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");

    cleaned = cleaned.slice(0, 6);

    if(cleaned.length > 3){
        cleaned = cleaned.slice(0, 3) + "-" + cleaned.slice(3);
    }

    return cleaned;
}

function isValidSerial(value){
    return /^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(value);
}
