import { rebuildEditor } from "./app.js";

export function initReset(){

    const resetButton = document.getElementById("resetButton");

    if(!resetButton) return;

    resetButton.onclick = () => {

        const result = confirm(
            "新しいカードを作成しますか？\n現在の編集内容はリセットされます。"
        );

        if(!result) return;

        // 引数なし = 完全リセット
        rebuildEditor();

    };
}
