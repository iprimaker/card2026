import { rebuildEditor } from "./app.js";

export function initReset(){

    const resetButton = document.getElementById("resetButton");

    if(!resetButton) return;

    resetButton.addEventListener("click", () => {

        const result = confirm("新しいカードを作成しますか？\n現在の編集内容はリセットされます。");

        if(!result) return;

        rebuildEditor();

    });
}
