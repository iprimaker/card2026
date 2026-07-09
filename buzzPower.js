import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { getCurrentCardType } from "./config.js";
import { cloneCachedImage } from "./preload.js";

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
            { id: "buzz3", name: "1000", path: "./B_suki_1000.png" },
            { id: "buzz4", name: "1050", path: "./B_suki_1050.png" },
            { id: "buzz5", name: "1100", path: "./B_suki_1100.png" },
            { id: "buzz6", name: "1150", path: "./B_suki_1150.png" },
            { id: "buzz7", name: "1200", path: "./B_suki_1200.png" },
            { id: "buzz8", name: "1250", path: "./B_suki_1250.png" },
            { id: "buzz9", name: "1300", path: "./B_suki_1300.png" },
            { id: "buzz10", name: "1350", path: "./B_suki_1350.png" },
            { id: "buzz11", name: "1400", path: "./B_suki_1400.png" }
        ],

        frame2: [
            { id: "buzz1", name: "900", path: "./B_yume_900.png" },
            { id: "buzz2", name: "950", path: "./B_yume_950.png" },
            { id: "buzz3", name: "1000", path: "./B_yume_1000.png" },
            { id: "buzz4", name: "1050", path: "./B_yume_1050.png" },
            { id: "buzz5", name: "1100", path: "./B_yume_1100.png" },
            { id: "buzz6", name: "1150", path: "./B_yume_1150.png" },
            { id: "buzz7", name: "1200", path: "./B_yume_1200.png" },
            { id: "buzz8", name: "1250", path: "./B_yume_1250.png" },
            { id: "buzz9", name: "1300", path: "./B_yume_1300.png" },
            { id: "buzz10", name: "1350", path: "./B_yume_1350.png" },
            { id: "buzz11", name: "1400", path: "./B_yume_1400.png" }
        ],

        frame3: [
            { id: "buzz1", name: "900", path: "./B_yujo_900.png" },
            { id: "buzz2", name: "950", path: "./B_yujo_950.png" },
            { id: "buzz3", name: "1000", path: "./B_yujo_1000.png" },
            { id: "buzz4", name: "1050", path: "./B_yujo_1050.png" },
            { id: "buzz5", name: "1100", path: "./B_yujo_1100.png" },
            { id: "buzz6", name: "1150", path: "./B_yujo_1150.png" },
            { id: "buzz7", name: "1200", path: "./B_yujo_1200.png" },
            { id: "buzz8", name: "1250", path: "./B_yujo_1250.png" },
            { id: "buzz9", name: "1300", path: "./B_yujo_1300.png" },
            { id: "buzz10", name: "1350", path: "./B_yujo_1350.png" },
            { id: "buzz11", name: "1400", path: "./B_yujo_1400.png" }
        ],

        frame4: [
            { id: "buzz1", name: "900", path: "./B_yuki_900.png" },
            { id: "buzz2", name: "950", path: "./B_yuki_950.png" },
            { id: "buzz3", name: "1000", path: "./B_yuki_1000.png" },
            { id: "buzz4", name: "1050", path: "./B_yuki_1050.png" },
            { id: "buzz5", name: "1100", path: "./B_yuki_1100.png" },
            { id: "buzz6", name: "1150", path: "./B_yuki_1150.png" },
            { id: "buzz7", name: "1200", path: "./B_yuki_1200.png" },
            { id: "buzz8", name: "1250", path: "./B_yuki_1250.png" },
            { id: "buzz9", name: "1300", path: "./B_yuki_1300.png" },
            { id: "buzz10", name: "1350", path: "./B_yuki_1350.png" },
            { id: "buzz11", name: "1400", path: "./B_yuki_1400.png" }
        ]
    }
};

export function initBuzzPower(){

    const buzzPowerSelect = document.getElementById("buzzPower");
    const buzzPowerArea = document.getElementById("buzzPowerArea");
    const frameSelect = document.getElementById("frame");
    const config = getCurrentCardType();

    if(!buzzPowerSelect || !buzzPowerArea) return;

    let buzzPowers = [];

    if(config.type === "A"){
        buzzPowers = BUZZ_POWER_LIST.A;
    }else{
        const frame = frameSelect ? frameSelect.value : "frame1";
        buzzPowers = BUZZ_POWER_LIST.B[frame] || [];
    }

    if(buzzPowers.length === 0){
        buzzPowerArea.style.display = "none";

        const canvas = getCanvas();

        if(canvas && buzzPowerObject){
            canvas.remove(buzzPowerObject);
            buzzPowerObject = null;
            canvas.requestRenderAll();
        }

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

    buzzPowerSelect.value = buzzPowers[0].id;
    drawBuzzPower(buzzPowers[0].path);
}

export function updateBuzzPowerForFrame(){

    const config = getCurrentCardType();

    if(config.type !== "B") return;

    initBuzzPower();
}

function drawBuzzPower(path){

    const canvas = getCanvas();

    if(!canvas) return;

    if(buzzPowerObject){
        canvas.remove(buzzPowerObject);
        buzzPowerObject = null;
    }

    cloneCachedImage(path, img => {

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
        canvas.requestRenderAll();
    });
}
