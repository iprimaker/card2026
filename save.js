import { getCanvas } from "./canvas.js";
import { sortLayers } from "./layer.js";

let saving = false;

export function initSave() {

    const saveButton = document.getElementById("saveButton");

    if (!saveButton) {
        console.error("保存ボタンが見つかりません");
        return;
    }

    saveButton.onclick = saveImage;
}

async function saveImage() {

    if (saving) return;

    const canvas = getCanvas();

    if (!canvas) {
        console.error("Canvasが取得できません");
        return;
    }

    saving = true;
    setSaveButtonState(true);

    try {

        canvas.discardActiveObject();

        sortLayers();
        canvas.requestRenderAll();

        await waitForRender();

        const isMobile = /iPhone|iPad|iPod|Android/i.test(
            navigator.userAgent
        );

        const dataUrl = createHighQualityImage(canvas, isMobile);

        const blob = await dataUrlToBlob(dataUrl);

        if (!blob) {
            throw new Error("Blobの作成に失敗しました");
        }

        const fileName = "ipricard.png";

        // スマホは共有画面を開く
        if (
            isMobile &&
            navigator.share &&
            navigator.canShare
        ) {

            const file = new File(
                [blob],
                fileName,
                {
                    type: "image/png"
                }
            );

            if (navigator.canShare({ files: [file] })) {

                await navigator.share({
                    files: [file],
                    title: "アイプリカード",
                    text: "作成したカードです"
                });

                return;
            }
        }

        // PC・共有非対応
        downloadBlob(blob, fileName);

    } catch (error) {

        if (error.name === "AbortError") {
            return;
        }

        console.error(error);

        alert(
            "保存に失敗しました。\nもう一度お試しください。"
        );

    } finally {

        saving = false;
        setSaveButtonState(false);
    }
}

function createHighQualityImage(canvas, isMobile) {

    const multipliers = isMobile
        ? [3, 2, 1]
        : [3];

    for (const multiplier of multipliers) {

        try {

            console.log(
                `${multiplier}倍で画像生成`
            );

            const dataUrl = canvas.toDataURL({
                format: "png",
                quality: 1,
                multiplier,
                enableRetinaScaling: true
            });

            if (
                typeof dataUrl === "string" &&
                dataUrl.startsWith("data:image/png")
            ) {
                return dataUrl;
            }

        } catch (e) {

            console.warn(
                `${multiplier}倍失敗`,
                e
            );
        }
    }

    throw new Error("画像生成に失敗しました");
}

async function dataUrlToBlob(dataUrl) {

    const response = await fetch(dataUrl);

    return await response.blob();
}

function downloadBlob(blob, fileName) {

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
}

function waitForRender() {

    return new Promise(resolve => {

        requestAnimationFrame(() => {

            requestAnimationFrame(resolve);

        });

    });
}

function setSaveButtonState(disabled) {

    const saveButton =
        document.getElementById("saveButton");

    if (!saveButton) return;

    saveButton.disabled = disabled;

    saveButton.textContent = disabled
        ? "保存"
        : "保存";
}
