import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { getCurrentCardType } from "./config.js";

let nameText = null;
let costumeText = null;

const NAME_STYLE = {
    left: 348,
    top: 820,
    originX: "center",
    originY: "center",

    fontFamily: "A_name.ttf",
    fontSize: 58,
    fontWeight: "bold",

    fill: "#ffffff",
    stroke: "#ffcf4f",
    strokeWidth: 8,

    selectable: false,
    evented: false
};

const COSTUME_STYLE = {
    left: 348,
    top: 900,
    originX: "center",
    originY: "center",

    fontFamily: "A_costume.ttf",
    fontSize: 28,
    fontWeight: "bold",

    fill: "#444444",

    selectable: false,
    evented: false
};

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

    if(textVisible){
        textVisible.checked = true;
        textVisible.disabled = false;
    }

    nameText = new fabric.Text("NAME", NAME_STYLE);
    nameText.layerType = "text";

    costumeText = new fabric.Text("COSTUME", COSTUME_STYLE);
    costumeText.layerType = "text";

    canvas.add(nameText, costumeText);

    function applyTextVisible(){
        const visible = textVisible ? textVisible.checked : true;

        nameText.visible = visible;
        costumeText.visible = visible;

        if(nameArea) nameArea.style.display = visible ? "block" : "none";
        if(costumeArea) costumeArea.style.display = visible ? "block" : "none";

        sortLayers();
        canvas.requestRenderAll();
    }

    applyTextVisible();

    if(textVisible){
        textVisible.addEventListener("change", applyTextVisible);
    }

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
