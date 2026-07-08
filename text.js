import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { getCurrentCardType } from "./config.js";

let nameText = null;
let costumeLetters = [];
let currentCostumeStyle = null;

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
                left: 205,
                top: 945,
                angle: -4,
                spacing: 25,
                curve: 5,

                fontFamily: "Dela Gothic One",
                fontSize: 24,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: null,
                strokeWidth: 0,

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
                left: 205,
                top: 945,
                angle: -4,
                spacing: 25,
                curve: 5,

                fontFamily: "Dela Gothic One",
                fontSize: 24,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: null,
                strokeWidth: 0,

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
                left: 205,
                top: 945,
                angle: -4,
                spacing: 25,
                curve: 5,

                fontFamily: "Dela Gothic One",
                fontSize: 24,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: null,
                strokeWidth: 0,

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
                left: 205,
                top: 945,
                angle: -4,
                spacing: 25,
                curve: 5,

                fontFamily: "Dela Gothic One",
                fontSize: 24,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: null,
                strokeWidth: 0,

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
                left: 205,
                top: 945,
                angle: -4,
                spacing: 25,
                curve: 5,

                fontFamily: "Dela Gothic One",
                fontSize: 24,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: null,
                strokeWidth: 0,

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
                left: 205,
                top: 945,
                angle: -4,
                spacing: 25,
                curve: 5,

                fontFamily: "Dela Gothic One",
                fontSize: 24,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: null,
                strokeWidth: 0,

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
                left: 205,
                top: 945,
                angle: -4,
                spacing: 25,
                curve: 5,

                fontFamily: "Dela Gothic One",
                fontSize: 24,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: null,
                strokeWidth: 0,

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
        costumeInput.maxLength = config.maxCostume;
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

    if(!canvas || !style) return;

    costumeLetters.forEach(letter => {
        canvas.remove(letter);
    });

    costumeLetters = [];

    const startX = style.left ?? 205;
    const startY = style.top ?? 945;
    const baseAngle = style.angle ?? -4;
    const curve = style.curve ?? 5;

    const chars = [...text];
    const maxWidth = style.maxWidth ?? 270;

    let spacing = style.spacing ?? 25;

    if(chars.length > 1){
        spacing = Math.min(spacing, maxWidth / (chars.length - 1));
    }

    chars.forEach((char, index) => {

        const x = startX + index * spacing;

        const curveY = Math.sin(index / Math.max(chars.length - 1, 1) * Math.PI) * curve;
        const y = startY - curveY;

        const letterAngle = baseAngle + index * 0.25;

        const letter = new fabric.Text(char, {
            left: x,
            top: y,
            angle: letterAngle,

            originX: "center",
            originY: "center",

            fontFamily: style.fontFamily || "Dela Gothic One",
            fontSize: style.fontSize || 24,
            fontWeight: style.fontWeight || "normal",

            fill: style.fill || "#FFFFFF",

            stroke: style.stroke || null,
            strokeWidth: style.strokeWidth || 0,

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
