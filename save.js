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
    saveButtonState(true);

    try{
        canvas.discardActiveObject();

        sortLayers();
        canvas.requestRenderAll();

        await waitForRender();

        /*
         * スマホでは倍率3だとメモリ不足になりやすいため、
         * スマホは1、PCは2にする
         */
        const isMobile = window.matchMedia(
            "(max-width: 900px)"
        ).matches;

        const multiplier = isMobile ? 1 : 2;

        const dataUrl = canvas.toDataURL({
            format: "png",
            quality: 2,
            multiplier
        });

        const blob = await dataUrlToBlob(dataUrl);

        if(!blob){
            throw new Error("画像データの作成に失敗しました");
        }

        const fileName = "ipricard.png";

        /*
         * スマホでWeb Share APIが使える場合は、
         * 共有画面から「画像を保存」を選べる
         */
        if(
            isMobile &&
            navigator.share &&
            navigator.canShare
        ){
            const file = new File(
                [blob],
                fileName,
                { type: "image/png" }
            );

            if(navigator.canShare({ files: [file] })){
                await navigator.share({
                    files: [file],
                    title: "アイプリカード",
                    text: "作成したカードです"
                });

                return;
            }
        }

        /*
         * PCや共有非対応ブラウザでは通常ダウンロード
         */
        downloadBlob(blob, fileName);

    }catch(error){

        /*
         * 共有画面をユーザーが閉じただけなら
         * エラー表示しない
         */
        if(error?.name === "AbortError"){
            return;
        }

        console.error("保存処理に失敗しました:", error);

        alert(
            "画像を保存できませんでした。\n" +
            "ブラウザを最新版にして、もう一度お試しください。"
        );

    }finally{
        saving = false;
        saveButtonState(false);
    }
}

function dataUrlToBlob(dataUrl){

    return fetch(dataUrl)
        .then(response => response.blob())
        .catch(error => {
            console.error(
                "Blob変換に失敗しました:",
                error
            );

            return null;
        });
}

function downloadBlob(blob, fileName){

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
}

function waitForRender(){

    return new Promise(resolve => {
        requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
        });
    });
}

function saveButtonState(disabled){

    const saveButton = document.getElementById("saveButton");

    if(!saveButton) return;

    saveButton.disabled = disabled;
    saveButton.textContent =
        disabled ? "保存" : "保存";
}
