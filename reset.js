export function initReset(){

    const resetButton = document.getElementById("resetButton");

    if(!resetButton) return;

    resetButton.addEventListener("click", resetEditor);

}

function resetEditor(){

    const result = confirm("現在の内容をリセットしますか？");

    if(!result){
        return;
    }

    // カード設定のみリセット
    localStorage.removeItem("cardType");
    localStorage.removeItem("background");
    localStorage.removeItem("frame");
    localStorage.removeItem("attribute");
    localStorage.removeItem("buzzPower");

    location.reload();

}
