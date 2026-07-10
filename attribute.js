import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { getCurrentCardType } from "./config.js";
import { cloneCachedImage } from "./preload.js";

let attributeObject = null;
let attributeRequestId = 0;

const ATTRIBUTE_LIST = {
    A: [
        { id: "attribute1", name: "うた（通常）", path: "./attributeA_1.png" },
        { id: "attribute2", name: "ダンス（通常）", path: "./attributeA_2.png" },
        { id: "attribute3", name: "ファッション（通常）", path: "./attributeA_3.png" },
        { id: "attribute4", name: "ネオン（バズリウム）", path: "./attributeA_4.png" },
        { id: "attribute5", name: "ジュエル（バズリウム）", path: "./attributeA_5.png" },
        { id: "attribute6", name: "スペース（バズリウム）", path: "./attributeA_6.png" },
        { id: "attribute7", name: "アニマル（バズリウム）", path: "./attributeA_7.png" },
        { id: "attribute8", name: "フラワー（バズリウム）", path: "./attributeA_8.png" },
        { id: "attribute9", name: "メロディ（バズリウム）", path: "./attributeA_9.png" },
        { id: "attribute10", name: "プリンセス（バズリウム）", path: "./attributeA_10.png" }
    ],

    B: []
};

export function initAttribute(){

    const attributeArea = document.getElementById("attributeArea");
    const attributeSelect = document.getElementById("attribute");
    const config = getCurrentCardType();

    if(!attributeArea || !attributeSelect) return;

    const attributes = ATTRIBUTE_LIST[config.type] || [];

    // 前回のイベントを上書きして重複防止
    attributeSelect.onchange = null;
    attributeSelect.innerHTML = "";

    if(attributes.length === 0){

        attributeArea.style.display = "none";
        removeAllAttributeObjects();

        return;
    }

    attributeArea.style.display = "block";

    attributes.forEach(attribute => {
        const option = document.createElement("option");

        option.value = attribute.id;
        option.textContent = attribute.name;

        attributeSelect.appendChild(option);
    });

    attributeSelect.onchange = () => {
        const selected = attributes.find(
            attribute => attribute.id === attributeSelect.value
        );

        if(selected){
            drawAttribute(selected.path);
        }
    };

    attributeSelect.value = attributes[0].id;
    drawAttribute(attributes[0].path);
}

function drawAttribute(path){

    const canvas = getCanvas();

    if(!canvas) return;

    // 今回の読み込み番号
    attributeRequestId++;
    const currentRequestId = attributeRequestId;

    // 現在Canvas上にある属性を全部削除
    removeAllAttributeObjects();

    cloneCachedImage(path, img => {

        // 古い読み込み結果なら追加しない
        if(currentRequestId !== attributeRequestId){
            return;
        }

        // 念のため、追加直前にも古い属性を全削除
        removeAllAttributeObjects();

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

        img.layerType = "attribute";

        attributeObject = img;

        canvas.add(attributeObject);

        sortLayers();
        canvas.requestRenderAll();
    });
}

function removeAllAttributeObjects(){

    const canvas = getCanvas();

    if(!canvas) return;

    canvas.getObjects().forEach(object => {
        if(object.layerType === "attribute"){
            canvas.remove(object);
        }
    });

    attributeObject = null;
}
