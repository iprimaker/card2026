const imageCache = new Map();

export function getCachedImage(path){
    return imageCache.get(path);
}

export async function preloadImages(paths){

    const progress = document.getElementById("loadingProgress");
    const percent = document.getElementById("loadingPercent");
    const loadingScreen = document.getElementById("loadingScreen");

    const uniquePaths = [...new Set(paths)];

    // 同じページ内ですでに読み込み済みならスキップ
    const unloadedPaths = uniquePaths.filter(path => !imageCache.has(path));

    // sessionStorageに読み込み済み記録があればローディング画面だけ消す
    if(sessionStorage.getItem("assetsPreloaded") === "true" && unloadedPaths.length === 0){
        hideLoadingScreen(loadingScreen);
        return;
    }

    let loaded = uniquePaths.length - unloadedPaths.length;
    const total = uniquePaths.length;

    function updateProgress(){
        const value = total === 0 ? 100 : Math.floor((loaded / total) * 100);

        if(progress) progress.style.width = value + "%";
        if(percent) percent.textContent = value + "%";
    }

    updateProgress();

    if(unloadedPaths.length === 0){
        sessionStorage.setItem("assetsPreloaded", "true");
        hideLoadingScreen(loadingScreen);
        return;
    }

    await Promise.all(unloadedPaths.map(path => {
        return new Promise(resolve => {

            fabric.Image.fromURL(path, img => {

                imageCache.set(path, img);

                loaded++;
                updateProgress();

                resolve();

            }, {
                crossOrigin: "anonymous"
            });

        });
    }));

    sessionStorage.setItem("assetsPreloaded", "true");

    hideLoadingScreen(loadingScreen);
}

function hideLoadingScreen(loadingScreen){

    if(!loadingScreen) return;

    loadingScreen.classList.add("hide");

    setTimeout(() => {
        loadingScreen.remove();
    }, 400);
}
