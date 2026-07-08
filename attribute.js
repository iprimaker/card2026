import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { getCurrentCardType } from "./config.js";

let attributeObject = null;

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

    const attribute = ATTRIBUTE_LIST[config.type] || [];

    if(attribute.length === 0){
        attributeArea.style.display = "none";
        return;
    }

    attributeArea.style.display = "block";
    attributeSelect.innerHTML = "";

    attribute.forEach(attribute => {

        const option = document.createElement("option");

        option.value = attribute.id;
        option.textContent = attribute.name;

        attributeSelect.appendChild(option);

    });

    attributeSelect.addEventListener("change", () => {

        const selected = attribute.find(attribute => attribute.id === attributeSelect.value);

        if(selected){
            drawAttribute(selected.path);
        }

    });

    drawAttribute(attribute[0].path);

}

function drawAttribute(path){
    const canvas = getCanvas();

    if(attributeObject){
        canvas.remove(attributeObject);
        attributeObject = null;
    }

    fabric.Image.fromURL(path, img => {

        img.set({
    left: 697 / 2,
    top: 1016 / 2,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false
});

        img.layerType = "attribute";

        attributeObject = img;

        canvas.add(attributeObject);
        sortLayers();
        canvas.renderAll();
    });
}
