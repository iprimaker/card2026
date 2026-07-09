import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { getCurrentCardType } from "./config.js";

let nameText = null;
let costumeLetters = [];
let currentCostumeStyle = null;

const COSTUME_PATH_A = [
    { x:195, y:951, angle:0 },
    { x:216, y:950, angle:-1 },
    { x:237, y:949, angle:-2 },
    { x:258, y:947, angle:-3 },
    { x:279, y:945, angle:-4 },
    { x:300, y:943, angle:-5 },
    { x:321, y:940, angle:-6 },
    { x:342, y:937, angle:-7 },
    { x:363, y:934, angle:-8 },
    { x:384, y:931, angle:-10 },
    { x:405, y:928, angle:-12 },
    { x:426, y:924, angle:-13 },
    { x:447, y:919, angle:-14 },
    { x:468, y:914, angle:-15 },
    { x:489, y:908, angle:-17 },
    { x:510, y:902, angle:-19 },
    { x:531, y:895, angle:-20 },
    { x:552, y:888, angle:-22 },
    { x:573, y:881, angle:-24 },
    { x:594, y:873, angle:-26 }
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
                stroke: "#E4D3A7",
                strokeWidth: 1,
            },
            costume: {
                fontFamily: "Dela Gothic One",
                fontSize: 32,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: null,
                strokeWidth: 0,
                scaleX: 0.62,
                scaleY: 1.45,
                shadow: new fabric.Shadow({
                    color: "#2D5FA8",
                    blur: 4,
                    offsetX: 1,
                    offsetY: 2
                })
            }
        },

        frame2: {
           name: {
                left: 82,
                top: 62,
                angle: -30,
                fontFamily: "Zen Maru Gothic",
                fontSize: 28,
                fontWeight: 900,
                fill: "#E4D3A7",
                stroke: "#E4D3A7",
                strokeWidth: 1,
            },
            costume: {
                fontFamily: "Dela Gothic One",
                fontSize: 22,
                fontWeight: "normal",
                fill: "#FF1000",
                stroke: null,
                strokeWidth: 0,
                scaleX: 0.75,
                scaleY: 1.22,
                shadow: new fabric.Shadow({
                    color: "#2059D1",
                    blur: 4,
                    offsetX: 1,
                    offsetY: 2
                })
            }
        },

        frame3: {
          name: {
                left: 82,
                top: 62,
                angle: -30,
                fontFamily: "Zen Maru Gothic",
                fontSize: 28,
                fontWeight: 900,
                fill: "#E4D3A7",
                stroke: "#E4D3A7",
                strokeWidth: 1,
            },
            costume: {
                fontFamily: "Dela Gothic One",
                fontSize: 22,
                fontWeight: "normal",
                fill: "#00FF4D",
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

    nameText = new fabric.Text("♥なまえ♥", NAME_BASE);
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
                costumeInput.value || "コスチューム",
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
        costumeInput?.value || "アイドルプリンセスポッピンハートキュート",
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
