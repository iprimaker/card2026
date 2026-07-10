import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { getCurrentCardType } from "./config.js";
import { cloneCachedImage } from "./preload.js";

let rarityObject = null;
let rarityRequestId = 0;

const CARD_WIDTH = 697;
const CARD_HEIGHT = 1016;

const RARITY_LIST = {
    A: [
        {
            id: "star2",
            name: "★★ 2",
            path: "./A_rank2.png"
        },
        {
            id: "star3",
            name: "★★ 3",
            path: "./A_rank3.png"
        },
        {
            id: "star4",
            name: "★★ 4",
            path: "./A_rank4.png"
        }
    ],

    B: [
        {
            id: "star2",
            name: "只今準備中です",
            path: "./B_star2.png"
        }
    ]
};

export function initRarity(){

    const rarityArea = document.getElementById("rarityArea");
    const raritySelect = document.getElementById("rarity");
    const config = getCurrentCardType();

    if(!rarityArea || !raritySelect){
        console.error("星数選択のHTML要素が見つかりません");
        return;
    }

    const rarities = RARITY_LIST[config.type] || [];

    raritySelect.onchange = null;
    raritySelect.innerHTML = "";

    if(rarities.length === 0){
        rarityArea.style.display = "none";
        removeAllRarityObjects();
        return;
    }

    rarityArea.style.display = "block";

    rarities.forEach(rarity => {
        const option = document.createElement("option");

        option.value = rarity.id;
        option.textContent = rarity.name;

        raritySelect.appendChild(option);
    });

    raritySelect.onchange = () => {
        const selected = rarities.find(
            rarity => rarity.id === raritySelect.value
        );

        if(selected){
            drawRarity(selected.path);
        }
    };

    raritySelect.value = rarities[0].id;
    drawRarity(rarities[0].path);
}

function drawRarity(path){

    const canvas = getCanvas();

    if(!canvas) return;

    rarityRequestId++;
    const currentRequestId = rarityRequestId;

    removeAllRarityObjects();

    cloneCachedImage(path, img => {

        if(currentRequestId !== rarityRequestId){
            return;
        }

        removeAllRarityObjects();

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

        img.layerType = "rarity";

        rarityObject = img;

        canvas.add(rarityObject);

        sortLayers();

        // 念のため確実に最前面へ
        rarityObject.bringToFront();

        canvas.requestRenderAll();
    });
}

function removeAllRarityObjects(){

    const canvas = getCanvas();

    if(!canvas) return;

    canvas.getObjects().forEach(object => {
        if(object.layerType === "rarity"){
            canvas.remove(object);
        }
    });

    rarityObject = null;
}
