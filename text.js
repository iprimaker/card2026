import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { getCurrentCardType } from "./config.js";

let nameText = null;
let costumeText = null;

const TEXT_STYLE = {
    A: {
        frame1: {
            name: {
                left: 82,
                top: 62,
                angle: -30,
                fontFamily: "Zen Maru Gothic",
                fontSize: 28,
                fontWeight: 900,
                fill: "#E4D3A7",
                stroke: null,
                strokeWidth: 0
            },
            costume: {
                fontFamily: "Dela Gothic One",
                fontSize: 28,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: null,
                strokeWidth: 0
            }
        },

        frame2: {
            name: {
                fontFamily: "Zen Maru Gothic",
                fontSize: 58,
                fontWeight: 900,
                fill: "#E4D3A7",
                stroke: null,
                strokeWidth: 0
            },
            costume: {
                fontFamily: "Dela Gothic One",
                fontSize: 28,
                fontWeight: "normal",
                fill: "#ffffff",
                stroke: "#ff8ebc",
                strokeWidth: 4
            }
        },

        frame3: {
            name: {
                fontFamily: "Zen Maru Gothic",
                fontSize: 58,
                fontWeight: 900,
                fill: "#E4D3A7",
                stroke: null,
                strokeWidth: 0
            },
            costume: {
                fontFamily: "Dela Gothic One",
                fontSize: 28,
                fontWeight: "normal",
                fill: "#ffffff",
                stroke: "#ffd95a",
                strokeWidth: 4
            }
        }
    },

    B: {
        frame1: {
            name: {
                fontFamily: "B_NameFont",
                fontSize: 54,
                fontWeight: "normal",
                fill: "#E4D3A7",
                stroke: null,
                strokeWidth: 0
            },
            costume: {
                fontFamily: "B_CostumeFont",
                fontSize: 26,
                fontWeight: "normal",
                fill: "#E4D3A7",
                stroke: null,
                strokeWidth: 0
            }
        },

        frame2: {
            name: {
                fontFamily: "B_NameFont",
                fontSize: 54,
                fontWeight: "normal",
                fill: "#ffffff",
                stroke: "#7ac8ff",
                strokeWidth: 6
            },
            costume: {
                fontFamily: "B_CostumeFont",
                fontSize: 26,
                fontWeight: "normal",
                fill: "#ffffff",
                stroke: "#7ac8ff",
                strokeWidth: 4
            }
        },

        frame3: {
            name: {
                fontFamily: "B_NameFont",
                fontSize: 54,
                fontWeight: "normal",
                fill: "#ffffff",
                stroke: "#ffb36b",
                strokeWidth: 6
            },
            costume: {
                fontFamily: "B_CostumeFont",
                fontSize: 26,
                fontWeight: "normal",
                fill: "#ffffff",
                stroke: "#ffb36b",
                strokeWidth: 4
            }
        },

        frame4: {
            name: {
                fontFamily: "B_NameFont",
                fontSize: 54,
                fontWeight: "normal",
                fill: "#ffffff",
                stroke: "#ffb36b",
                strokeWidth: 6
            },
            costume: {
                fontFamily: "B_CostumeFont",
                fontSize: 26,
                fontWeight: "normal",
                fill: "#ffffff",
                stroke: "#ffb36b",
                strokeWidth: 4
            }
        }
    }
};

const NAME_BASE = {
    left: 348,
    top: 820,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false
};

const COSTUME_BASE = {
    left: 348,
    top: 900,
    originX: "center",
    originY: "center",
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

    nameText = new fabric.Text("NAME", NAME_BASE);
    nameText.layerType = "text";

    costumeText = new fabric.Text("COSTUME", COSTUME_BASE);
    costumeText.layerType = "text";

    canvas.add(nameText, costumeText);

    updateTextStyle();

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

export function updateTextStyle(){

    const canvas = getCanvas();
    const config = getCurrentCardType();
    const frameSelect = document.getElementById("frame");

    if(!canvas || !nameText || !costumeText) return;

    const frameId = frameSelect ? frameSelect.value : "frame1";

    const styleSet =
        TEXT_STYLE[config.type]?.[frameId] ||
        TEXT_STYLE[config.type]?.frame1 ||
        TEXT_STYLE.A.frame1;

    nameText.set({
        ...NAME_BASE,
        ...styleSet.name
    });

    costumeText.set({
        ...COSTUME_BASE,
        ...styleSet.costume
    });

    sortLayers();
    canvas.requestRenderAll();
}
