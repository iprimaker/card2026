import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { getCurrentCardType } from "./config.js";
import { cloneCachedImage } from "./preload.js";

let attributeObject = null;
let attributeRequestId = 0;

const NORMAL_ATTRIBUTE_BY_FRAME = {
    frame1: "./attributeA_1.png", // うた
    frame2: "./attributeA_2.png", // ダンス
    frame3: "./attributeA_3.png"  // ファッション
};

const STAR4_ATTRIBUTE_MAP = {
    attribute4: "./attributeA_star4_4.png",
    attribute5: "./attributeA_star4_5.png",
    attribute6: "./attributeA_star4_6.png",
    attribute7: "./attributeA_star4_7.png",
    attribute8: "./attributeA_star4_8.png",
    attribute9: "./attributeA_star4_9.png",
    attribute10: "./attributeA_star4_10.png"
};

const ATTRIBUTE_LIST = {
    A: [
        {
            id: "normal",
            name: "通常",
            path: null
        },
        {
            id: "attribute4",
            name: "ネオン（バズリウム）",
            path: "./attributeA_4.png"
        },
        {
            id: "attribute5",
            name: "ジュエル（バズリウム）",
            path: "./attributeA_5.png"
        },
        {
            id: "attribute6",
            name: "スペース（バズリウム）",
            path: "./attributeA_6.png"
        },
        {
            id: "attribute7",
            name: "アニマル（バズリウム）",
            path: "./attributeA_7.png"
        },
        {
            id: "attribute8",
            name: "フラワー（バズリウム）",
            path: "./attributeA_8.png"
        },
        {
            id: "attribute9",
            name: "メロディ（バズリウム）",
            path: "./attributeA_9.png"
        },
        {
            id: "attribute10",
            name: "プリンセス（バズリウム）",
            path: "./attributeA_10.png"
        }
    ],

    B: []
};

function getCurrentStar(){

    const raritySelect = document.getElementById("rarity");

    return raritySelect ? raritySelect.value : "star2";
}

export function initAttribute(){

    const attributeArea = document.getElementById("attributeArea");
    const attributeSelect = document.getElementById("attribute");
    const config = getCurrentCardType();

    if(!attributeArea || !attributeSelect) return;

    const attributes = ATTRIBUTE_LIST[config.type] || [];

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
        updateCurrentAttribute();
    };

    attributeSelect.value = "normal";
    updateCurrentAttribute();
}

export function updateAttributeForFrame(){

    const config = getCurrentCardType();

    if(config.type !== "A") return;

    const attributeSelect = document.getElementById("attribute");

    if(!attributeSelect) return;

    if(attributeSelect.value === "normal"){
        updateCurrentAttribute();
    }
}

export function updateCurrentAttribute(){

    const config = getCurrentCardType();
    const attributeSelect = document.getElementById("attribute");
    const frameSelect = document.getElementById("frame");

    if(!attributeSelect) return;

    const attributes = ATTRIBUTE_LIST[config.type] || [];

    const selected = attributes.find(
        attribute => attribute.id === attributeSelect.value
    );

    if(!selected) return;

    let path = selected.path;

    if(config.type === "A"){

        const star = getCurrentStar();

        // 通常は☆2・☆3・☆4すべて共通
        if(selected.id === "normal"){

            const frameId = frameSelect ? frameSelect.value : "frame1";

            path =
                NORMAL_ATTRIBUTE_BY_FRAME[frameId] ||
                NORMAL_ATTRIBUTE_BY_FRAME.frame1;

        // 通常以外は☆4だけ専用素材
        }else if(star === "star4"){

            path =
                STAR4_ATTRIBUTE_MAP[selected.id] ||
                selected.path;
        }
    }

    if(path){
        drawAttribute(path);
    }
}

function drawAttribute(path){

    const canvas = getCanvas();

    if(!canvas) return;

    attributeRequestId++;
    const currentRequestId = attributeRequestId;

    removeAllAttributeObjects();

    cloneCachedImage(path, img => {

        if(currentRequestId !== attributeRequestId){
            return;
        }

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
