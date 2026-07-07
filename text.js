import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { getCurrentCardType } from "./config.js";

let nameText = null;
let costumeText = null;

export function initText(){

    const canvas = getCanvas();
    const config = getCurrentCardType();

    const textVisible = document.getElementById("textVisible");

    const nameArea = document.getElementById("nameArea");
    const costumeArea = document.getElementById("costumeArea");

    const nameInput = document.getElementById("cardName");
    const costumeInput = document.getElementById("costumeName");

    if(nameInput){
        nameInput.maxLength = config.maxName;
    }

    if(costumeInput){
        costumeInput.maxLength = config.maxCostume;
    }

    // テキスト機能は準備中のため、OFF固定
    if(textVisible){
        textVisible.checked = false;
        textVisible.disabled = true;
    }

    nameText = new fabric.Text("NAME", {
        left: 30,
        top: 30,
        originX: "center",
        fontSize: 20,
        fontWeight: "bold",
        fill: "#ffffff",
        stroke: "#fffc5f",
        strokeWidth: 3,
        selectable: false,
        evented: false
    });
    nameText.layerType = "text";

    costumeText = new fabric.Text("COSTUME", {
        left: 175,
        top: 425,
        originX: "center",
        fontSize: 18,
        fill: "#333333",
        selectable: false,
        evented: false
    });
    costumeText.layerType = "text";

    canvas.add(nameText, costumeText);

    function applyTextVisible(){
        const visible = false;

        nameText.visible = visible;
        costumeText.visible = visible;

        if(nameArea) nameArea.style.display = "none";
        if(costumeArea) costumeArea.style.display = "none";

        sortLayers();
        canvas.requestRenderAll();
    }

    applyTextVisible();

    if(nameInput){
        nameInput.addEventListener("input", () => {
            nameText.text = nameInput.value || "NAME";
            canvas.requestRenderAll();
        });
    }

    if(costumeInput){
        costumeInput.addEventListener("input", () => {
            costumeText.text = costumeInput.value || "COSTUME";
            canvas.requestRenderAll();
        });
    }

    sortLayers();
}
