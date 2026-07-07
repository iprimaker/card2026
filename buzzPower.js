import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { getCurrentCardType } from "./config.js";

let buzzPowerObject = null;

const BUZZ_POWER_LIST = {
    A: [
        { id: "buzz1", name: "900", path: "../assets/buzzpower/A900.png" },
        { id: "buzz2", name: "950", path: "../assets/buzzpower/A950.png" },
        { id: "buzz3", name: "1000", path: "../assets/buzzpower/A1000.png" },
        { id: "buzz4", name: "1050", path: "../assets/buzzpower/A1050.png" },
        { id: "buzz5", name: "1100", path: "../assets/buzzpower/A1100.png" },
        { id: "buzz6", name: "1150", path: "../assets/buzzpower/A1150.png" },
        { id: "buzz7", name: "1200", path: "../assets/buzzpower/A1200.png" }, 
        { id: "buzz8", name: "1250", path: "../assets/buzzpower/A1250.png" },
        { id: "buzz9", name: "1300", path: "../assets/buzzpower/A1300.png" },
        { id: "buzz10", name: "1320", path: "../assets/buzzpower/A1320.png" },
        { id: "buzz11", name: "1350", path: "../assets/buzzpower/A1350.png" },
        { id: "buzz12", name: "1400", path: "../assets/buzzpower/A1400.png" }
    ],
    B: [ 
        { id: "buzz1", name: "選択できません", path: "../assets/buzzpower/B900.png" }
    ]
};

export function initBuzzPower(){

    const buzzPowerSelect = document.getElementById("buzzPower");
    const buzzPowerArea = document.getElementById("buzzPowerArea");
    const config = getCurrentCardType();

    const buzzPowers = BUZZ_POWER_LIST[config.type] || [];

    if(buzzPowers.length === 0){
        buzzPowerArea.style.display = "none";
        return;
    }

    buzzPowerArea.style.display = "block";
    buzzPowerSelect.innerHTML = "";

    buzzPowers.forEach(buzz => {
        const option = document.createElement("option");
        option.value = buzz.id;
        option.textContent = buzz.name;
        buzzPowerSelect.appendChild(option);
    });

    buzzPowerSelect.addEventListener("change", () => {
        const selected = buzzPowers.find(buzz => buzz.id === buzzPowerSelect.value);

        if(selected){
            drawBuzzPower(selected.path);
        }
    });

    drawBuzzPower(buzzPowers[0].path);
}

function drawBuzzPower(path){

    const canvas = getCanvas();

    if(buzzPowerObject){
        canvas.remove(buzzPowerObject);
        buzzPowerObject = null;
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

        img.layerType = "buzzPower";

        buzzPowerObject = img;

        canvas.add(buzzPowerObject);
        sortLayers();
        canvas.renderAll();
    });
}
