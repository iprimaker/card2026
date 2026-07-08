import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { getCurrentCardType } from "./config.js";

let buzzPowerObject = null;

const BUZZ_POWER_LIST = {
    A: [
        { id: "buzz1", name: "900", path: "./A900.png" },
        { id: "buzz2", name: "950", path: "./A950.png" },
        { id: "buzz3", name: "1000", path: "./A1000.png" },
        { id: "buzz4", name: "1050", path: "./A1050.png" },
        { id: "buzz5", name: "1100", path: "./A1100.png" },
        { id: "buzz6", name: "1150", path: "./A1150.png" },
        { id: "buzz7", name: "1200", path: "./A1200.png" },
        { id: "buzz8", name: "1250", path: "./A1250.png" },
        { id: "buzz9", name: "1300", path: "./A1300.png" },
        { id: "buzz10", name: "1320", path: "./A1320.png" },
        { id: "buzz11", name: "1350", path: "./A1350.png" },
        { id: "buzz12", name: "1400", path: "./A1400.png" }
    ],

    B: {
        frame1: [
            { id: "buzz1", name: "900", path: "./B_suki_900.png" },
            { id: "buzz2", name: "950", path: "./B_suki_950.png" },
            { id: "buzz3", name: "1000", path: "./B_suki_1000.png" }
        ],

        frame2: [
            { id: "buzz1", name: "900", path: "./B_yume_900.png" },
            { id: "buzz2", name: "950", path: "./B_yume_950.png" },
            { id: "buzz3", name: "1000", path: "./B_yume_1000.png" }
        ],

        frame3: [
            { id: "buzz1", name: "900", path: "./B_yuujou_900.png" },
            { id: "buzz2", name: "950", path: "./B_yuujou_950.png" },
            { id: "buzz3", name: "1000", path: "./B_yuujou_1000.png" }
        ]
    }
};

export function initBuzzPower(){

    const buzzPowerSelect = document.getElementById("buzzPower");
    const buzzPowerArea = document.getElementById("buzzPowerArea");
    const frameSelect = document.getElementById("frame");
    const config = getCurrentCardType();

    let buzzPowers = [];

    if(config.type === "A"){
        buzzPowers = BUZZ_POWER_LIST.A;
    }else{
        const frame = frameSelect.value;
        buzzPowers = BUZZ_POWER_LIST.B[frame] || [];
    }

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

    buzzPowerSelect.onchange = () => {
        const selected = buzzPowers.find(buzz => buzz.id === buzzPowerSelect.value);

        if(selected){
            drawBuzzPower(selected.path);
        }
    };

    if(config.type === "B"){
        frameSelect.onchange = () => {
            initBuzzPower();
        };
    }

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
            left: 697 / 2,
            top: 1016 / 2,
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
