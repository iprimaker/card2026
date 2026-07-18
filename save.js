import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";

let saving = false;

export function initSave(){

    const saveButton = document.getElementById("saveButton");

    if(!saveButton){
        console.error("保存ボタンが見つかりません");
        return;
    }

    saveButton.onclick = saveImage;
}

async function saveImage(){

    if(saving) return;

    const canvas = getCanvas();

    if(!canvas){
        console.error("Canvasが取得できません");
        return;
    }

    saving = true;

    try{
        canvas.discardActiveObject();

        sortLayers();
        canvas.requestRenderAll();

        await waitForRender();

        const imageData = canvas.toDataURL({
            format: "png",
            quality: 1,
            multiplier: 1
        });

        const link = document.createElement("a");

        link.href = imageData;
        link.download = "ipricard.png";

        document.body.appendChild(link);
        link.click();
        link.remove();

    }catch(error){
        console.error("保存処理に失敗しました:", error);

    }finally{
        saving = false;
    }
}

function waitForRender(){

    return new Promise(resolve => {
        requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
        });
    });
}
