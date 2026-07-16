import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { getCurrentCardType } from "./config.js";
import { updateTextStyle } from "./text.js";
import { cloneCachedImage } from "./preload.js";
import { updateBuzzPowerForFrame } from "./buzzPower.js";
import { updateAttributeForFrame } from "./attribute.js";

let frameObject = null;
let frameRequestId = 0;

const CARD_WIDTH = 697;
const CARD_HEIGHT = 1016;

/* ===========================
   フレーム一覧
=========================== */

const FRAME_LIST = {
    A: {
        normal: [
            { id: "frame1", name: "うた（あお）", path: "./flameA1.png" },
            { id: "frame2", name: "ダンス（あか）", path: "./flameA2.png" },
            { id: "frame3", name: "ファッション（きいろ）", path: "./flameA3.png" }
        ],

        star4: [
            { id: "frame1", name: "うた（あお）", path: "./flameA1_4.png" },
            { id: "frame2", name: "ダンス（あか）", path: "./flameA2_4.png" },
            { id: "frame3", name: "ファッション（きいろ）", path: "./flameA3_4.png" }
        ]
    },

    B: {
        normal: [
            { id: "frame1", name: "すき（ピンク）", path: "./flameB1_2.png" },
            { id: "frame2", name: "ゆめ（あお）", path: "./flameB2_2.png" },
            { id: "frame3", name: "ゆうじょう（みどり）", path: "./flameB3_2.png" },
            { id: "frame4", name: "ゆうき（きいろ）", path: "./flameB4_2.png" },
            { id: "frame5", name: "じょうねつ（あか） ※プレリリース", path: "./flameB5_2.png" }
        ],

        star4: [
            // 将来、Bタイプの★4素材ができたらここを差し替える
            { id: "frame1", name: "すき（ピンク）", path: "./flameB1_2.png" },
            { id: "frame2", name: "ゆめ（あお）", path: "./flameB2_2.png" },
            { id: "frame3", name: "ゆうじょう（みどり）", path: "./flameB3_2.png" },
            { id: "frame4", name: "ゆうき（きいろ）", path: "./flameB4_2.png" },
            { id: "frame5", name: "じょうねつ（あか） ", path: "./flameB5_2.png" },
            { id: "frame6", name: "きぼう（むらさき） ", path: "./flameB6_2.png" }
        ]
    }
};

/* ===========================
   初期化
=========================== */

export function initFrame(){

    const frameSelect = document.getElementById("frame");

    if(!frameSelect) return;

    setupFrameSelect({
        preserveSelection: false,
        updateRelatedObjects: false
    });
}

/* ===========================
   ランク変更時の更新
=========================== */

export function updateFrameForRarity(){

    setupFrameSelect({
        preserveSelection: true,
        updateRelatedObjects: true
    });
}
/* ===========================
   選択欄の構築
=========================== */

function setupFrameSelect({
    preserveSelection = true,
    updateRelatedObjects = true
} = {}){

    const frameSelect = document.getElementById("frame");

    if(!frameSelect) return;

    const frames = getCurrentFrameList();

    const previousFrameId =
        preserveSelection
            ? frameSelect.value
            : "";

    // イベントの重複を防止
    frameSelect.onchange = null;
    frameSelect.innerHTML = "";

    frames.forEach(frame => {

        const option = document.createElement("option");

        option.value = frame.id;
        option.textContent = frame.name;

        frameSelect.appendChild(option);
    });

    if(frames.length === 0){
        removeAllFrameObjects();
        return;
    }

    const selectionExists = frames.some(
        frame => frame.id === previousFrameId
    );

    frameSelect.value =
        selectionExists
            ? previousFrameId
            : frames[0].id;

    frameSelect.onchange = () => {
        applyCurrentFrame({
            updateRelatedObjects: true
        });
    };

    applyCurrentFrame({
        updateRelatedObjects
    });
}

/* ===========================
   現在使用するフレーム一覧
=========================== */

function getCurrentFrameList(){

    const config = getCurrentCardType();

    const raritySelect =
        document.getElementById("rarity");

    const rarityId =
        raritySelect
            ? raritySelect.value
            : "star3";

    const typeFrameList =
        FRAME_LIST[config.type];

    if(!typeFrameList){
        return [];
    }

    if(rarityId === "star4"){
        return typeFrameList.star4 || typeFrameList.normal || [];
    }

    return typeFrameList.normal || [];
}

/* ===========================
   現在選択中のフレームを反映
=========================== */

function applyCurrentFrame({
    updateRelatedObjects = true
} = {}){

    const frameSelect =
        document.getElementById("frame");

    if(!frameSelect) return;

    const frames = getCurrentFrameList();

    const selected = frames.find(
        frame => frame.id === frameSelect.value
    );

    if(!selected) return;

    drawFrame(selected.path);

    if(!updateRelatedObjects) return;

    // フレームごとの文字装飾を反映
    updateTextStyle();

    // Bタイプのバズパワー一覧を更新
    updateBuzzPowerForFrame();

    // Aタイプで通常属性選択中なら属性も更新
    updateAttributeForFrame();
}

/* ===========================
   フレーム描画
=========================== */

function drawFrame(path){

    const canvas = getCanvas();

    if(!canvas || !path) return;

    frameRequestId++;

    const currentRequestId =
        frameRequestId;

    removeAllFrameObjects();

    cloneCachedImage(path, img => {

        // 過去の読み込み結果は無視
        if(currentRequestId !== frameRequestId){
            return;
        }

        if(!img){
            console.error(
                "フレーム素材の読み込みに失敗しました:",
                path
            );

            return;
        }

        // 念のため追加直前にも削除
        removeAllFrameObjects();

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

        img.layerType = "frame";

        frameObject = img;

        canvas.add(frameObject);

        sortLayers();
        canvas.requestRenderAll();
    });
}

/* ===========================
   フレーム全削除
=========================== */

function removeAllFrameObjects(){

    const canvas = getCanvas();

    if(!canvas) return;

    const frameObjects = canvas
        .getObjects()
        .filter(object => {
            return object.layerType === "frame";
        });

    frameObjects.forEach(object => {
        canvas.remove(object);
    });

    frameObject = null;
}
