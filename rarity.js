import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { getCurrentCardType } from "./config.js";
import { cloneCachedImage } from "./preload.js";
import { updateCurrentAttribute } from "./attribute.js";

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
            name: "★★★ 3",
            path: "./A_rank3.png"
        },
        {
            id: "star4",
            name: "★★★★ 4",
            path: "./A_rank4.png"
        }
    ],

    B: [
        {
            id: "preparing",
            name: "只今準備中です",
            path: null
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
    raritySelect.disabled = false;

    if(rarities.length === 0){
        rarityArea.style.display = "none";
        cancelRarityRequest();
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

    if(config.type === "B"){
        raritySelect.value = "preparing";
        raritySelect.disabled = true;

        cancelRarityRequest();
        removeAllRarityObjects();

        return;
    }

    raritySelect.onchange = () => {

    const selected = rarities.find(
        rarity => rarity.id === raritySelect.value
    );

    if(!selected){
        console.error(
            "選択されたレアリティが見つかりません:",
            raritySelect.value
        );
        return;
    }

    console.log(
        "レアリティ変更:",
        selected.id,
        selected.path
    );

    if(selected.path){
        drawRarity(selected.path);
    }else{
        cancelRarityRequest();
        removeAllRarityObjects();
    }

    updateCurrentAttribute();
};
    // 初期値は星3
    raritySelect.value = "star3";

    const defaultRarity = rarities.find(
        rarity => rarity.id === "star3"
    );

    if(defaultRarity?.path){
        drawRarity(defaultRarity.path);
    }

    updateCurrentAttribute();
}

function drawRarity(path){

    const canvas = getCanvas();

    if(!canvas || !path) return;

    rarityRequestId++;
    const currentRequestId = rarityRequestId;

    // ここではリクエスト番号を増やさず、表示中の素材だけ削除
    removeAllRarityObjects();

    cloneCachedImage(path, img => {

        if(currentRequestId !== rarityRequestId){
            return;
        }

        if(!img){
            console.error("星数素材の読み込みに失敗しました:", path);
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
        rarityObject.bringToFront();

        canvas.requestRenderAll();
    });
}

function cancelRarityRequest(){
    rarityRequestId++;
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
