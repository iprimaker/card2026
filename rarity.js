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
            name: "只今準備中です（常時★★★３）",
            path: null
        }
    ]
};

/* ===========================
   初期化
=========================== */

export function initRarity(){

    const rarityArea =
        document.getElementById("rarityArea");

    const raritySelect =
        document.getElementById("rarity");

    const config = getCurrentCardType();

    if(!rarityArea || !raritySelect){
        console.error(
            "星数選択のHTML要素が見つかりません"
        );
        return;
    }

    const rarities =
        RARITY_LIST[config.type] || [];

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

        const option =
            document.createElement("option");

        option.value = rarity.id;
        option.textContent = rarity.name;

        raritySelect.appendChild(option);
    });

    /* ===========================
       Bタイプは準備中
    =========================== */

    if(config.type === "B"){

        raritySelect.value = "preparing";
        raritySelect.disabled = true;

        cancelRarityRequest();
        removeAllRarityObjects();

        return;
    }

    /* ===========================
       星数変更
    =========================== */

    raritySelect.onchange = () => {

        const selected = rarities.find(
            rarity =>
                rarity.id === raritySelect.value
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

        /*
         * 先に属性を更新する。
         * その後レアリティを読み込み、
         * レアリティが最前面になりやすくする。
         */
        updateCurrentAttribute();

        if(selected.path){
            drawRarity(selected.path);
        }else{
            cancelRarityRequest();
            removeAllRarityObjects();
        }
    };

    /* ===========================
       初期値は星3
    =========================== */

    const defaultRarityId = "star3";

    raritySelect.value = defaultRarityId;

    const defaultRarity = rarities.find(
        rarity => rarity.id === defaultRarityId
    );

    updateCurrentAttribute();

    if(defaultRarity?.path){
        drawRarity(defaultRarity.path);
    }
}

/* ===========================
   レアリティ画像描画
=========================== */

function drawRarity(path){

    const canvas = getCanvas();

    if(!canvas || !path) return;

    rarityRequestId++;

    const currentRequestId =
        rarityRequestId;

    removeAllRarityObjects();

    console.log(
        "レアリティ素材読込開始:",
        path
    );

    cloneCachedImage(path, img => {

        /*
         * 過去の読込結果なら無視
         */
        if(currentRequestId !== rarityRequestId){

            console.log(
                "古いレアリティ読込を無視:",
                path
            );

            return;
        }

        if(!img){

            console.error(
                "レアリティ素材の読み込みに失敗:",
                path
            );

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
            hasBorders: false,

            visible: true,
            opacity: 1
        });

        img.layerType = "rarity";

        rarityObject = img;

        canvas.add(rarityObject);

        sortLayers();

        /*
         * 念のため最前面へ
         */
        rarityObject.bringToFront();

        canvas.requestRenderAll();

        console.log(
            "レアリティ素材表示完了:",
            path,
            img.width,
            img.height
        );
    });
}

/* ===========================
   読込キャンセル
=========================== */

function cancelRarityRequest(){

    rarityRequestId++;
}

/* ===========================
   レアリティ素材全削除
=========================== */

function removeAllRarityObjects(){

    const canvas = getCanvas();

    if(!canvas) return;

    const rarityObjects =
        canvas.getObjects().filter(
            object =>
                object.layerType === "rarity"
        );

    rarityObjects.forEach(object => {
        canvas.remove(object);
    });

    rarityObject = null;
}
