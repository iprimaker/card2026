import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";
import { getCurrentCardType } from "./config.js";

let nameTextA = null;
let nameLettersB = [];
let costumeLetters = [];

let currentNameStyle = null;
let currentCostumeStyle = null;

const DEFAULT_NAME = "♥なまえ♥";
const DEFAULT_COSTUME = "アイドルプリンセスポッピンハートライト";

/* ===========================
   Aタイプ name 固定位置
=========================== */

const A_NAME_FIXED = {
    left: 82,
    top: 62,
    angle: -30,

    originX: "center",
    originY: "center",

    selectable: false,
    evented: false
};

/* ===========================
   Bタイプ name 位置
=========================== */

const NAME_PATH_B = [
    { x: 180, y: 920, angle: -3 },
    { x: 195, y: 921, angle: -4 },
    { x: 210, y: 923, angle: -5 },
    { x: 225, y: 925, angle: -6 },
    { x: 240, y: 928, angle: -7 },
    { x: 255, y: 931, angle: -9 },
    { x: 270, y: 934, angle: -10 },
    { x: 285, y: 938, angle: -12 }
];

/* ===========================
   Aタイプ costume 位置
=========================== */

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
    { x:510, y:899, angle:-19 },
    { x:531, y:892, angle:-20 },
    { x:552, y:884, angle:-22 },
    { x:573, y:875, angle:-24 }
];

/* ===========================
   Bタイプ costume 位置
=========================== */

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
    { x:568, y:914, angle:3 }
];

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
                fill: "#FFFFFF",
                stroke: null,
                strokeWidth: 0,
                scaleX: 0.62,
                scaleY: 1.45,
                shadow: new fabric.Shadow({
                    color: "#C44700",
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
                fill: "#FFFFFF",
                stroke: null,
                strokeWidth: 0,
                scaleX: 0.62,
                scaleY: 1.45,
                shadow: new fabric.Shadow({
                    color: "#C44700",
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
                fontSize: 30,
                fontWeight: "normal",
                fill: "#FFFFFF",
                stroke: "#2D5FA8",
                strokeWidth: 2,
                strokeLineJoin: "round",
                paintFirst: "stroke",
                scaleX: 0.62,
                scaleY: 1.45
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
        nameInput.maxLength = config.maxName || 5;
        nameInput.value = nameInput.value || DEFAULT_NAME;
    }

    if(costumeInput){
        costumeInput.maxLength = 19;
        costumeInput.value = costumeInput.value || DEFAULT_COSTUME;
    }

    if(textVisible){
        textVisible.checked = false;
        textVisible.disabled = false;
    }

    nameTextA = new fabric.Text(DEFAULT_NAME, A_NAME_FIXED);
    nameTextA.layerType = "text";
    canvas.add(nameTextA);

    updateTextStyle();

    function applyTextVisible(){
        applyCurrentTextVisibility();

        sortLayers();
        canvas.requestRenderAll();
    }

    applyTextVisible();

    if(textVisible){
        textVisible.addEventListener("change", applyTextVisible);
    }

    if(nameInput){
        nameInput.addEventListener("input", () => {

            const text = nameInput.value || DEFAULT_NAME;

            if(getCurrentCardType().type === "A"){
                drawNameA(text, currentNameStyle);
            }else{
                drawNameB(text, currentNameStyle);
            }

            applyTextVisible();
        });
    }

    if(costumeInput){
    costumeInput.addEventListener("input", () => {

        // ひらがな・カタカナ・長音符のみ許可
        costumeInput.value = costumeInput.value.replace(
           /[^ぁ-ゖァ-ヶー0-9０-９]/g,
            ""
        );

        drawCostumeLetters(
            costumeInput.value || DEFAULT_COSTUME,
            currentCostumeStyle
        );

        applyTextVisible();
    });
}

    if(document.fonts){
        document.fonts.ready.then(() => {
            updateTextStyle();
            applyTextVisible();
        });
    }

    sortLayers();
    canvas.requestRenderAll();
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

    if(config.type === "A"){
        drawNameA(
            nameInput?.value || DEFAULT_NAME,
            currentNameStyle
        );
    }else{
        drawNameB(
            nameInput?.value || DEFAULT_NAME,
            currentNameStyle
        );
    }

    drawCostumeLetters(
        costumeInput?.value || DEFAULT_COSTUME,
        currentCostumeStyle
    );

    applyCurrentTextVisibility();

    sortLayers();
    canvas.requestRenderAll();

    if(document.fonts){
        document.fonts.ready.then(() => {
            canvas.requestRenderAll();
        });
    }
}

/* ===========================
   表示・非表示状態の反映
=========================== */

function applyCurrentTextVisibility(){

    const textVisible = document.getElementById("textVisible");
    const visible = textVisible ? textVisible.checked : false;
    const config = getCurrentCardType();

    if(nameTextA){
        nameTextA.visible = visible && config.type === "A";
    }

    nameLettersB.forEach(letter => {
        letter.visible = visible && config.type === "B";
    });

    costumeLetters.forEach(letter => {
        letter.visible = visible;
    });

    const nameArea = document.getElementById("nameArea");
    const costumeArea = document.getElementById("costumeArea");

    if(nameArea){
        nameArea.style.display = visible ? "block" : "none";
    }

    if(costumeArea){
        costumeArea.style.display = visible ? "block" : "none";
    }
}

/* ===========================
   name描画
=========================== */

function drawNameA(text, style){

    const canvas = getCanvas();

    if(!canvas || !style || !nameTextA) return;

    nameLettersB.forEach(letter => {
        canvas.remove(letter);
    });

    nameLettersB = [];

    nameTextA.set({
        text: text,

        ...A_NAME_FIXED,

        fontFamily: style.fontFamily || "Zen Maru Gothic",
        fontSize: style.fontSize || 28,
        fontWeight: style.fontWeight || 900,

        fill: style.fill || "#E4D3A7",

        stroke: style.stroke || null,
        strokeWidth: style.strokeWidth || 0,

        scaleX: style.scaleX ?? 1,
        scaleY: style.scaleY ?? 1,

        shadow: style.shadow || null
    });

    canvas.requestRenderAll();
}

function drawNameB(text, style){

    const canvas = getCanvas();

    if(!canvas || !style) return;

    if(nameTextA){
        nameTextA.visible = false;
    }

    nameLettersB = drawLetters({
        oldLetters: nameLettersB,
        text: text,
        style: style,
        path: NAME_PATH_B,
        maxLength: NAME_PATH_B.length
    });
}

/* ===========================
   costume描画
=========================== */

function drawCostumeLetters(text, style){

    const config = getCurrentCardType();
    const path = config.type === "B" ? COSTUME_PATH_B : COSTUME_PATH_A;

    costumeLetters = drawLetters({
        oldLetters: costumeLetters,
        text: text,
        style: style,
        path: path,
        maxLength: 19
    });
}

/* ===========================
   共通：1文字ずつ描画
=========================== */

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
