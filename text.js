import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { getCurrentCardType } from "./config.js";

let nameLetters = [];
let costumeLetters = [];

let currentNameStyle = null;
let currentCostumeStyle = null;

const DEFAULT_NAME = "♥なまえ♥";
const DEFAULT_COSTUME = "アイドルプリンセスポッピンハートキュート";

/* ===========================
   文字位置テーブル
=========================== */

// Aタイプ：名前位置 共通
const NAME_PATH_A = [
    { x: 45, y: 92, angle: -31 },
    { x: 63, y: 82, angle: -30 },
    { x: 81, y: 72, angle: -29 },
    { x: 99, y: 62, angle: -28 },
    { x:117, y: 52, angle: -27 },
    { x:135, y: 42, angle: -26 },
    { x:153, y: 32, angle: -25 },
    { x:171, y: 22, angle: -24 }
];

// Aタイプ：衣装名位置 共通
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
    { x:384, y:930, angle:-10 },
    { x:405, y:926, angle:-12 },
    { x:426, y:921, angle:-13 },
    { x:447, y:916, angle:-14 },
    { x:468, y:911, angle:-15 },
    { x:489, y:905, angle:-17 },
    { x:510, y:989, angle:-19 },
    { x:531, y:893, angle:-20 },
    { x:552, y:887, angle:-22 },
    { x:573, y:880, angle:-24 },
    { x:594, y:878, angle:-26 }
];

// Bタイプ：名前位置 共通
const NAME_PATH_B = [
    { x: 90, y: 105, angle: -18 },
    { x:115, y: 98, angle: -15 },
    { x:140, y: 92, angle: -12 },
    { x:165, y: 88, angle: -9 },
    { x:190, y: 85, angle: -6 },
    { x:215, y: 83, angle: -3 },
    { x:240, y: 82, angle: 0 },
    { x:265, y: 83, angle: 3 }
];

// Bタイプ：衣装名位置 共通
const COSTUME_PATH_B = [
    { x:190, y:950, angle:-6 },
    { x:211, y:948, angle:-6 },
    { x:232, y:946, angle:-5 },
    { x:253, y:944, angle:-5 },
    { x:274, y:942, angle:-4 },
    { x:295, y:940, angle:-4 },
    { x:316, y:938, angle:-3 },
    { x:337, y:936, angle:-3 },
    { x:358, y:934, angle:-2 },
    { x:379, y:932, angle:-2 },
    { x:400, y:930, angle:-1 },
    { x:421, y:928, angle:-1 },
    { x:442, y:926, angle:0 },
    { x:463, y:924, angle:0 },
    { x:484, y:922, angle:1 },
    { x:505, y:920, angle:1 },
    { x:526, y:918, angle:2 },
    { x:547, y:916, angle:2 },
    { x:568, y:914, angle:3 },
    { x:589, y:912, angle:3 }
];

/* ===========================
   フレーム別文字装飾
=========================== */

const TEXT_STYLE = {
    A: {
        frame1: {
            name: {
                fontFamily: "Zen Maru Gothic",
                fontSize: 28,
                fontWeight: 900,
                fill: "#E4D3A7",
                stroke: "#E4D3A7",
                strokeWidth: 1,
                scaleX: 1,
                scaleY: 1
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
                fontFamily: "Zen Maru Gothic",
                fontSize: 28,
                fontWeight: 900,
                fill: "#E4D3A7",
                stroke: "#E4D3A7",
                strokeWidth: 1,
                scaleX: 1,
                scaleY: 1
            },
            costume: {
                fontFamily: "Dela Gothic One",
                fontSize: 32,
                fontWeight: "normal",
                fill: "#FF1000",
                stroke: null,
                strokeWidth: 0,
                scaleX: 0.62,
                scaleY: 1.45,
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
                fontFamily: "Zen Maru Gothic",
                fontSize: 28,
                fontWeight: 900,
                fill: "#E4D3A7",
                stroke: "#E4D3A7",
                strokeWidth: 1,
                scaleX: 1,
                scaleY: 1
            },
            costume: {
                fontFamily: "Dela Gothic One",
                fontSize: 32,
                fontWeight: "normal",
                fill: "#00FF4D",
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
        }
    },

    B: {
        frame1: {
            name: {
                fontFamily: "Dela Gothic One",
                fontSize: 28,
                fontWeight: "normal",
                fill: "#E4D3A7",
                stroke: null,
                strokeWidth: 0,
                scaleX: 0.8,
                scaleY: 1.25
            },
            costume: {
                fontFamily: "Dela Gothic One",
                fontSize: 30,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: null,
                strokeWidth: 0,
                scaleX: 0.65,
                scaleY: 1.4,
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
                fontFamily: "Dela Gothic One",
                fontSize: 28,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: "#7AC8FF",
                strokeWidth: 2,
                scaleX: 0.8,
                scaleY: 1.25
            },
            costume: {
                fontFamily: "Dela Gothic One",
                fontSize: 30,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: null,
                strokeWidth: 0,
                scaleX: 0.65,
                scaleY: 1.4,
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
                fontFamily: "Dela Gothic One",
                fontSize: 28,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: "#FFB36B",
                strokeWidth: 2,
                scaleX: 0.8,
                scaleY: 1.25
            },
            costume: {
                fontFamily: "Dela Gothic One",
                fontSize: 30,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: null,
                strokeWidth: 0,
                scaleX: 0.65,
                scaleY: 1.4,
                shadow: new fabric.Shadow({
                    color: "#2D5FA8",
                    blur: 4,
                    offsetX: 1,
                    offsetY: 2
                })
            }
        },

        frame4: {
            name: {
                fontFamily: "Dela Gothic One",
                fontSize: 28,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: "#FFB36B",
                strokeWidth: 2,
                scaleX: 0.8,
                scaleY: 1.25
            },
            costume: {
                fontFamily: "Dela Gothic One",
                fontSize: 30,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: null,
                strokeWidth: 0,
                scaleX: 0.65,
                scaleY: 1.4,
                shadow: new fabric.Shadow({
                    color: "#2D5FA8",
                    blur: 4,
                    offsetX: 1,
                    offsetY: 2
                })
            }
        }
    }
};

/* ===========================
   初期化
=========================== */

export function initText(){

    const canvas = getCanvas();
    const config = getCurrentCardType();

    const textVisible = document.getElementById("textVisible");
    const nameArea = document.getElementById("nameArea");
    const costumeArea = document.getElementById("costumeArea");

    const nameInput = document.getElementById("cardName");
    const costumeInput = document.getElementById("costumeName");

    if(nameInput){
        nameInput.maxLength = config.maxName || 8;
        nameInput.value = nameInput.value || DEFAULT_NAME;
    }

    if(costumeInput){
        costumeInput.maxLength = 20;
        costumeInput.value = costumeInput.value || DEFAULT_COSTUME;
    }

    if(textVisible){
        textVisible.checked = true;
        textVisible.disabled = false;
    }

    updateTextStyle();

    function applyTextVisible(){
        const visible = textVisible ? textVisible.checked : true;

        nameLetters.forEach(letter => {
            letter.visible = visible;
        });

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
            drawNameLetters(
                nameInput.value || DEFAULT_NAME,
                currentNameStyle
            );

            applyTextVisible();
        });
    }

    if(costumeInput){
        costumeInput.addEventListener("input", () => {
            drawCostumeLetters(
                costumeInput.value || DEFAULT_COSTUME,
                currentCostumeStyle
            );

            applyTextVisible();
        });
    }

    sortLayers();
}

/* ===========================
   スタイル更新
=========================== */

export function updateTextStyle(){

    const canvas = getCanvas();
    const config = getCurrentCardType();
    const frameSelect = document.getElementById("frame");

    const nameInput = document.getElementById("cardName");
    const costumeInput = document.getElementById("costumeName");

    if(!canvas) return;

    const frameId = frameSelect ? frameSelect.value : "frame1";

    const styleSet =
        TEXT_STYLE[config.type]?.[frameId] ||
        TEXT_STYLE[config.type]?.frame1 ||
        TEXT_STYLE.A.frame1;

    currentNameStyle = styleSet.name;
    currentCostumeStyle = styleSet.costume;

    drawNameLetters(
        nameInput?.value || DEFAULT_NAME,
        currentNameStyle
    );

    drawCostumeLetters(
        costumeInput?.value || DEFAULT_COSTUME,
        currentCostumeStyle
    );

    sortLayers();
    canvas.requestRenderAll();
}

/* ===========================
   1文字ずつ描画
=========================== */

function drawNameLetters(text, style){

    const config = getCurrentCardType();
    const path = config.type === "B" ? NAME_PATH_B : NAME_PATH_A;

    nameLetters = drawLetters({
        oldLetters: nameLetters,
        text: text,
        style: style,
        path: path,
        maxLength: path.length
    });
}

function drawCostumeLetters(text, style){

    const config = getCurrentCardType();
    const path = config.type === "B" ? COSTUME_PATH_B : COSTUME_PATH_A;

    costumeLetters = drawLetters({
        oldLetters: costumeLetters,
        text: text,
        style: style,
        path: path,
        maxLength: 20
    });
}

function drawLetters({ oldLetters, text, style, path, maxLength }){

    const canvas = getCanvas();

    if(!canvas || !style || !path) return [];

    oldLetters.forEach(letter => {
        canvas.remove(letter);
    });

    const newLetters = [];
    const chars = [...text].slice(0, maxLength);

    chars.forEach((char, index) => {

        const point = path[index];

        if(!point) return;

        const letter = new fabric.Text(char, {
            left: point.x,
            top: point.y,
            angle: point.angle,

            originX: "center",
            originY: "center",

            fontFamily: style.fontFamily || "Dela Gothic One",
            fontSize: style.fontSize || 24,
            fontWeight: style.fontWeight || "normal",

            fill: style.fill || "#FFFFFF",

            stroke: style.stroke || null,
            strokeWidth: style.strokeWidth || 0,

            scaleX: style.scaleX ?? 1,
            scaleY: style.scaleY ?? 1,

            shadow: style.shadow || null,

            selectable: false,
            evented: false
        });

        letter.layerType = "text";

        newLetters.push(letter);
        canvas.add(letter);
    });

    sortLayers();
    canvas.requestRenderAll();

    return newLetters;
}
