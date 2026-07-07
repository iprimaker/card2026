import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { getCurrentCardType } from "./config.js";

let frameObject = null;

const FRAME_LIST = {
    A: [
        { id: "frame1", name: "うた（青）", path: "./flameA1.png" },
        { id: "frame2", name: "ダンス（赤）", path: "./flameA2.png" },
        { id: "frame3", name: "ファッション（黄）", path: "./flameA3.png" }
    ],
    B: [
        { id: "frame1", name: "すき", path: "./flameB1.png" },
        { id: "frame2", name: "ゆめ", path: "./flameB2.png" },
        { id: "frame3", name: "ゆうじょう", path: "./flameB3.png" }
    ]
};

export function initFrame() {

    const frameSelect = document.getElementById("frame");
    const config = getCurrentCardType();

    const frames = FRAME_LIST[config.type] || [];

    frameSelect.innerHTML = "";

    frames.forEach(frame => {

        const option = document.createElement("option");

        option.value = frame.id;
        option.textContent = frame.name;

        frameSelect.appendChild(option);

    });

    frameSelect.addEventListener("change", () => {

        const selected = frames.find(frame => frame.id === frameSelect.value);

        if (selected) {
            drawFrame(selected.path);
        }

    });

    if (frames.length > 0) {
        drawFrame(frames[0].path);
    }

}

function drawFrame(path){
    function drawFrame(path){

    console.log("フレーム読込開始:", path);

    const canvas = getCanvas();

    if(frameObject){
        console.log("古いフレーム削除");
        canvas.remove(frameObject);
        frameObject = null;
    }

    fabric.Image.fromURL(path, img => {

        console.log("フレーム画像読込成功", img.width, img.height);

        img.set({
            left: canvas.getWidth() / 2,
            top: canvas.getHeight() / 2,
            originX: "center",
            originY: "center",
            selectable: false,
            evented: false
        });

        img.layerType = "frame";

        frameObject = img;

        canvas.add(frameObject);

        console.log("フレーム追加完了");

        sortLayers();
        canvas.renderAll();

    }, () => {

        console.error("フレーム画像読込失敗:", path);

    });

}
    const canvas = getCanvas();

    if(frameObject){
        canvas.remove(frameObject);
        frameObject = null;
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

        img.layerType = "frame";

        frameObject = img;

        canvas.add(frameObject);
        sortLayers();
        canvas.renderAll();
    });
}
