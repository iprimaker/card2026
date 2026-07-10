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
            path: null,
            disabled: true
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

    // イベントの重複を防止
    raritySelect.onchange = null;
    raritySelect.innerHTML = "";
    raritySelect.disabled = false;

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
        option.disabled = rarity.disabled === true;

        raritySelect.appendChild(option);
    });

    // Bタイプは準備中表示だけにする
    if(config.type === "B"){
        raritySelect.value = rarities[0].id;
        raritySelect.disabled = true;

        removeAllRarityObjects();
        return;
    }

    raritySelect.onchange = () => {
        const selected = rarities.find(
            rarity => rarity.id === raritySelect.value
        );

        if(!selected) return;

        if(selected.path){
            drawRarity(selected.path);
        }else{
            removeAllRarityObjects();
        }

        // 星数に合わせて属性素材も切り替える
        updateCurrentAttribute();
    };

    raritySelect.value = rarities[0].id;

    if(rarities[0].path){
        drawRarity(rarities[0].path);
    }

    // 初期星数の属性素材を反映
    updateCurrentAttribute();
}

function drawRarity(path){

    const canvas = getCanvas();

    if(!canvas || !path) return;

    rarityRequestId++;
    const currentRequestId = rarityRequestId;

    removeAllRarityObjects();

    cloneCachedImage(path, img => {

        // 古い画像読込の結果は無視
        if(currentRequestId !== rarityRequestId){
            return;
        }

        if(!img){
            console.error("星数素材の読み込みに失敗しました:", path);
            return;
        }

        // 念のため、追加直前にも既存素材を削除
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

        // 星数素材を最前面へ
        rarityObject.bringToFront();

        canvas.requestRenderAll();
    });
}

function removeAllRarityObjects(){

    const canvas = getCanvas();

    if(!canvas) return;

    // 実行中の古い画像読込も無効化
    rarityRequestId++;

    canvas.getObjects().forEach(object => {
        if(object.layerType === "rarity"){
            canvas.remove(object);
        }
    });

    rarityObject = null;
    canvas.requestRenderAll();
}
