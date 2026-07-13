import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { getCurrentCardType } from "./config.js";
import { updateTextStyle } from "./text.js";
import { cloneCachedImage } from "./preload.js";
import { updateBuzzPowerForFrame } from "./buzzPower.js";
import { updateAttributeForFrame } from "./attribute.js";

let frameObject = null;
let frameRequestId = 0;

const FRAME_LIST = {
    A: [
        { id: "frame1", name: "うた（あお）", path: "./flameA1.png" },
        { id: "frame2", name: "ダンス（あか）", path: "./flameA2.png" },
        { id: "frame3", name: "ファッション（きいろ）", path: "./flameA3.png" }
    ],

    B: [
        { id: "frame1", name: "すき（ピンク）", path: "./flameB1_2.png" },
        { id: "frame2", name: "ゆめ（あお）", path: "./flameB2_2.png" },
        { id: "frame3", name: "ゆうじょう（みどり）", path: "./flameB3_2.png" },
        { id: "frame4", name: "ゆうき（きいろ）", path: "./flameB4_2.png" },
        { id: "frame5", name: "じょうねつ（あか） ※プレリリース", path: "./flameB5_2.png" }
    ]
};

export function initFrame(){

    const frameSelect = document.getElementById("frame");
    const config = getCurrentCardType();

    if(!frameSelect) return;

    const frames = FRAME_LIST[config.type] || [];

    // イベント重複防止
    frameSelect.onchange = null;
    frameSelect.innerHTML = "";

    frames.forEach(frame => {
        const option = document.createElement("option");

        option.value = frame.id;
        option.textContent = frame.name;

        frameSelect.appendChild(option);
    });

    frameSelect.onchange = () => {
        const selected = frames.find(
            frame => frame.id === frameSelect.value
        );

        if(!selected) return;

        drawFrame(selected.path);

        // フレームごとのテキスト装飾を更新
        updateTextStyle();

        // Bタイプのバズパワー候補を更新
        updateBuzzPowerForFrame();

        // Aタイプで「通常」選択中なら、
        // フレームに対応する通常属性へ更新
        updateAttributeForFrame();
    };

    if(frames.length > 0){
        frameSelect.value = frames[0].id;
        drawFrame(frames[0].path);
    }
}

function drawFrame(path){

    const canvas = getCanvas();

    if(!canvas) return;

    frameRequestId++;
    const currentRequestId = frameRequestId;

    removeAllFrameObjects();

    cloneCachedImage(path, img => {

        // 古い非同期処理の結果なら追加しない
        if(currentRequestId !== frameRequestId){
            return;
        }

        // 念のため追加直前にも削除
        removeAllFrameObjects();

        img.set({
            left: 697 / 2,
            top: 1016 / 2,

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

function removeAllFrameObjects(){

    const canvas = getCanvas();

    if(!canvas) return;

    canvas.getObjects().forEach(object => {
        if(object.layerType === "frame"){
            canvas.remove(object);
        }
    });

    frameObject = null;
}
