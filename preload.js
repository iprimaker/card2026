const imageCache = new Map();

export function getCachedImage(path){
    return imageCache.get(path);
}

export function cloneCachedImage(path, callback){

    const cached = imageCache.get(path);

    if(cached){
        cached.clone(cloned => {
            callback(cloned);
        });
        return;
    }

    fabric.Image.fromURL(path, img => {
        imageCache.set(path, img);

        img.clone(cloned => {
            callback(cloned);
        });
    });
}

export async function preloadImages(paths){

    const progress = document.getElementById("loadingProgress");
    const percent = document.getElementById("loadingPercent");
    const loadingScreen = document.getElementById("loadingScreen");

    const uniquePaths = [...new Set(paths)];
    const unloadedPaths = uniquePaths.filter(path => !imageCache.has(path));

    let loaded = uniquePaths.length - unloadedPaths.length;
    const total = uniquePaths.length;

    function updateProgress(){
        const value = total === 0 ? 100 : Math.floor((loaded / total) * 100);

        if(progress) progress.style.width = value + "%";
        if(percent) percent.textContent = value + "%";
    }

    updateProgress();

    await Promise.all(unloadedPaths.map(path => {
        return new Promise(resolve => {
            fabric.Image.fromURL(path, img => {
                imageCache.set(path, img);
                loaded++;
                updateProgress();
                resolve();
            });
        });
    }));

    hideLoadingScreen(loadingScreen);
}

function hideLoadingScreen(loadingScreen){

    if(!loadingScreen) return;

    loadingScreen.classList.add("hide");

    setTimeout(() => {
        loadingScreen.remove();
    }, 400);
}
