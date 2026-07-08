import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { getCurrentCardType } from "./config.js";

let nameText = null;
let costumeLetters = [];
let currentCostumeStyle = null;

const COSTUME_PATH_A = [
    { x:185, y:976, angle:-8 },
    { x:209, y:973, angle:-7 },
    { x:233, y:970, angle:-6 },
    { x:257, y:967, angle:-5 },
    { x:281, y:964, angle:-4 },
    { x:305, y:961, angle:-3 },
    { x:329, y:958, angle:-2 },
    { x:353, y:955, angle:-1 },
    { x:377, y:952, angle:0 },
    { x:401, y:949, angle:1 },

    { x:425, y:946, angle:2 },
    { x:449, y:944, angle:3 },
    { x:473, y:942, angle:4 },
    { x:497, y:941, angle:5 },
    { x:521, y:940, angle:6 },
    { x:545, y:940, angle:7 },
    { x:569, y:941, angle:8 },
    { x:593, y:942, angle:9 },
    { x:617, y:944, angle:10 },
    { x:641, y:946, angle:11 }
];

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
                fontSize: 22,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: null,
                strokeWidth: 0,
                scaleX: 0.62,
                scaleY: 1.38,
                shadow: new fabric.Shadow({
                    color: "rgba(0,0,0,0.35)",
                    blur: 4,
                    offsetX: 1,
                    offsetY: 2
                })
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
                fontSize: 22,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: null,
                strokeWidth: 0,
                scaleX: 0.75,
                scaleY: 1.22,
                shadow: new fabric.Shadow({
                    color: "rgba(0,0,0,0.35)",
                    blur: 4,
                    offsetX: 1,
                    offsetY: 2
                })
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
                fontSize: 22,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: null,
                strokeWidth: 0,
                scaleX: 0.75,
                scaleY: 1.22,
                shadow: new fabric.Shadow({
                    color: "rgba(0,0,0,0.35)",
                    blur: 4,
                    offsetX: 1,
                    offsetY: 2
                })
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
                fontFamily: "Dela Gothic One",
                fontSize: 22,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: null,
                strokeWidth: 0,
                scaleX: 0.75,
                scaleY: 1.22,
                shadow: new fabric.Shadow({
                    color: "rgba(0,0,0,0.35)",
                    blur: 4,
                    offsetX: 1,
                    offsetY: 2
                })
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
                fontFamily: "Dela Gothic One",
                fontSize: 22,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: null,
                strokeWidth: 0,
                scaleX: 0.75,
                scaleY: 1.22,
                shadow: new fabric.Shadow({
                    color: "rgba(0,0,0,0.35)",
                    blur: 4,
                    offsetX: 1,
                    offsetY: 2
                })
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
                fontFamily: "Dela Gothic One",
                fontSize: 22,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: null,
                strokeWidth: 0,
                scaleX: 0.75,
                scaleY: 1.22,
                shadow: new fabric.Shadow({
                    color: "rgba(0,0,0,0.35)",
                    blur: 4,
                    offsetX: 1,
                    offsetY: 2
                })
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
                fontFamily: "Dela Gothic One",
                fontSize: 22,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: null,
                strokeWidth: 0,
                scaleX: 0.75,
                scaleY: 1.22,
                shadow: new fabric.Shadow({
                    color: "rgba(0,0,0,0.35)",
                    blur: 4,
                    offsetX: 1,
                    offsetY: 2
                })
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
        costumeInput.maxLength = 20;
    }

    if(textVisible){
        textVisible.checked = true;
        textVisible.disabled = false;
    }

    nameText = new fabric.Text("NAME", NAME_BASE);
    nameText.layerType = "text";

    canvas.add(nameText);

    updateTextStyle();

    function applyTextVisible(){
        const visible = textVisible ? textVisible.checked : true;

        nameText.visible = visible;

        costumeLetters.forEach(letter => {
            letter.visible = visible;
        });

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
            drawCostumeLetters(
                costumeInput.value || "COSTUME",
                currentCostumeStyle
            );

            applyTextVisible();
        });
    }

    sortLayers();
}

export function updateTextStyle(){

    const canvas = getCanvas();
    const config = getCurrentCardType();
    const frameSelect = document.getElementById("frame");
    const costumeInput = document.getElementById("costumeName");

    if(!canvas || !nameText) return;

    const frameId = frameSelect ? frameSelect.value : "frame1";

    const styleSet =
        TEXT_STYLE[config.type]?.[frameId] ||
        TEXT_STYLE[config.type]?.frame1 ||
        TEXT_STYLE.A.frame1;

    nameText.set({
        ...NAME_BASE,
        ...styleSet.name
    });

    currentCostumeStyle = styleSet.costume;

    drawCostumeLetters(
        costumeInput?.value || "COSTUME",
        currentCostumeStyle
    );

    sortLayers();
    canvas.requestRenderAll();
}

function drawCostumeLetters(text, style){

    const canvas = getCanvas();
    const config = getCurrentCardType();

    if(!canvas || !style) return;

    costumeLetters.forEach(letter => {
        canvas.remove(letter);
    });

    costumeLetters = [];

    const chars = [...text].slice(0, 20);

    let costumePath = COSTUME_PATH_A;

    chars.forEach((char, index) => {

        const point = costumePath[index];

        if(!point) return;

        const letter = new fabric.Text(char, {
            left: point.x,
            top: point.y,
            angle: point.angle,

            originX: "center",
            originY: "center",

            fontFamily: style.fontFamily || "Dela Gothic One",
            fontSize: style.fontSize || 22,
            fontWeight: style.fontWeight || "normal",

            fill: style.fill || "#FFFFFF",

            stroke: style.stroke || null,
            strokeWidth: style.strokeWidth || 0,

            scaleX: style.scaleX ?? 0.75,
            scaleY: style.scaleY ?? 1.22,

            shadow: style.shadow || null,

            selectable: false,
            evented: false
        });

        letter.layerType = "text";

        costumeLetters.push(letter);
        canvas.add(letter);
    });

    sortLayers();
    canvas.requestRenderAll();
}
