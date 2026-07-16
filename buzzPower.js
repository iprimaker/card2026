import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { getCurrentCardType } from "./config.js";
import { cloneCachedImage } from "./preload.js";

let buzzPowerObject = null;
let buzzPowerRequestId = 0;

const CARD_WIDTH = 697;
const CARD_HEIGHT = 1016;

/* ===========================
   バズパワー一覧
=========================== */

const BUZZ_POWER_LIST = {

    /* ===========================
       Aタイプ
    =========================== */

    A: {

        // ★2・★3
        normal: [
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

        // ★4
        star4: [
            { id: "buzz1", name: "900", path: "./A2_900.png" },
            { id: "buzz2", name: "950", path: "./A2_950.png" },
            { id: "buzz3", name: "1000", path: "./A2_1000.png" },
            { id: "buzz4", name: "1050", path: "./A2_1050.png" },
            { id: "buzz5", name: "1100", path: "./A2_1100.png" },
            { id: "buzz6", name: "1150", path: "./A2_1150.png" },
            { id: "buzz7", name: "1200", path: "./A2_1200.png" },
            { id: "buzz8", name: "1250", path: "./A2_1250.png" },
            { id: "buzz9", name: "1300", path: "./A2_1300.png" },
            { id: "buzz10", name: "1320", path: "./A2_1320.png" },
            { id: "buzz11", name: "1350", path: "./A2_1350.png" },
            { id: "buzz12", name: "1400", path: "./A2_1400.png" }
        ]
    },

    /* ===========================
       Bタイプ
    =========================== */

    B: {

        // 現在の★3用
        normal: {

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
            ],

            frame5: [
                { id: "buzz11", name: "1400", path: "./B_jounetu_1400.png"}
            ],

            frame6: [
                { id: "buzz11", name: "1400", path: "./B_kibou_1400.png"}
            ],
        },

        /*
         * 将来のBタイプ★4用。
         * 現在は空にしてあります。
         *
         * 素材追加後は、normalと同じ形式で
         * frame1～frame5を設定してください。
         */
        star4: {}
    }
};

/* ===========================
   初期化
=========================== */

export function initBuzzPower(){

    setupBuzzPowerSelect({
        preserveSelection: false
    });
}

/* ===========================
   フレーム変更時
=========================== */

export function updateBuzzPowerForFrame(){

    setupBuzzPowerSelect({
        preserveSelection: true
    });
}

/* ===========================
   レアリティ変更時
=========================== */

export function updateBuzzPowerForRarity(){

    setupBuzzPowerSelect({
        preserveSelection: true
    });
}

/* ===========================
   選択欄の構築
=========================== */

function setupBuzzPowerSelect({
    preserveSelection = true
} = {}){

    const buzzPowerSelect =
        document.getElementById("buzzPower");

    const buzzPowerArea =
        document.getElementById("buzzPowerArea");

    if(!buzzPowerSelect || !buzzPowerArea){
        return;
    }

    const previousValue =
        preserveSelection
            ? buzzPowerSelect.value
            : "";

    const buzzPowers =
        getCurrentBuzzPowerList();

    // イベント重複を防止
    buzzPowerSelect.onchange = null;
    buzzPowerSelect.innerHTML = "";

    if(buzzPowers.length === 0){

        buzzPowerArea.style.display = "none";

        cancelBuzzPowerRequest();
        removeAllBuzzPowerObjects();

        return;
    }

    buzzPowerArea.style.display = "block";

    buzzPowers.forEach(buzz => {

        const option =
            document.createElement("option");

        option.value = buzz.id;
        option.textContent = buzz.name;

        buzzPowerSelect.appendChild(option);
    });

    const previousExists = buzzPowers.some(
        buzz => buzz.id === previousValue
    );

    buzzPowerSelect.value =
        previousExists
            ? previousValue
            : buzzPowers[0].id;

    buzzPowerSelect.onchange = () => {
        applyCurrentBuzzPower();
    };

    applyCurrentBuzzPower();
}

/* ===========================
   現在のバズパワー一覧を取得
=========================== */

function getCurrentBuzzPowerList(){

    const config = getCurrentCardType();

    const raritySelect =
        document.getElementById("rarity");

    const frameSelect =
        document.getElementById("frame");

    const rarityId =
        raritySelect
            ? raritySelect.value
            : "star3";

    const rarityGroup =
        rarityId === "star4"
            ? "star4"
            : "normal";

    /* ===========================
       Aタイプ
    =========================== */

    if(config.type === "A"){

        const typeList = BUZZ_POWER_LIST.A;

        return (
            typeList[rarityGroup] ||
            typeList.normal ||
            []
        );
    }

    /* ===========================
       Bタイプ
    =========================== */

    if(config.type === "B"){

        const frameId =
            frameSelect
                ? frameSelect.value
                : "frame1";

        const typeList =
            BUZZ_POWER_LIST.B;

        /*
         * ★4素材が未登録の場合は
         * normalへ自動的にフォールバック
         */
        const rarityList =
            typeList[rarityGroup] &&
            Object.keys(typeList[rarityGroup]).length > 0
                ? typeList[rarityGroup]
                : typeList.normal;

        return (
            rarityList?.[frameId] ||
            typeList.normal?.[frameId] ||
            []
        );
    }

    return [];
}

/* ===========================
   選択中のバズパワーを反映
=========================== */

function applyCurrentBuzzPower(){

    const buzzPowerSelect =
        document.getElementById("buzzPower");

    if(!buzzPowerSelect) return;

    const buzzPowers =
        getCurrentBuzzPowerList();

    const selected = buzzPowers.find(
        buzz => buzz.id === buzzPowerSelect.value
    );

    if(!selected){
        cancelBuzzPowerRequest();
        removeAllBuzzPowerObjects();
        return;
    }

    drawBuzzPower(selected.path);
}

/* ===========================
   バズパワー画像描画
=========================== */

function drawBuzzPower(path){

    const canvas = getCanvas();

    if(!canvas || !path) return;

    buzzPowerRequestId++;

    const currentRequestId =
        buzzPowerRequestId;

    removeAllBuzzPowerObjects();

    cloneCachedImage(path, img => {

        // 古い画像読み込み結果は無視
        if(currentRequestId !== buzzPowerRequestId){
            return;
        }

        if(!img){
            console.error(
                "バズパワー素材の読み込みに失敗しました:",
                path
            );

            return;
        }

        removeAllBuzzPowerObjects();

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

        img.layerType = "buzzPower";

        buzzPowerObject = img;

        canvas.add(buzzPowerObject);

        sortLayers();
        canvas.requestRenderAll();
    });
}

/* ===========================
   読み込みキャンセル
=========================== */

function cancelBuzzPowerRequest(){

    buzzPowerRequestId++;
}

/* ===========================
   バズパワー素材を全削除
=========================== */

function removeAllBuzzPowerObjects(){

    const canvas = getCanvas();

    if(!canvas) return;

    const buzzObjects =
        canvas.getObjects().filter(
            object =>
                object.layerType === "buzzPower"
        );

    buzzObjects.forEach(object => {
        canvas.remove(object);
    });

    buzzPowerObject = null;
}
