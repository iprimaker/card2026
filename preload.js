const imageCache = new Map();

export function getCachedImage(path){
    return imageCache.get(path);
}

export async function preloadImages(paths){

    const progress = document.getElementById("loadingProgress");
    const percent = document.getElementById("loadingPercent");
    const loadingScreen = document.getElementById("loadingScreen");

    let loaded = 0;
    const total = paths.length;

    function updateProgress(){
        const value = total === 0 ? 100 : Math.floor((loaded / total) * 100);

        if(progress) progress.style.width = value + "%";
        if(percent) percent.textContent = value + "%";
    }

    updateProgress();

    await Promise.all(paths.map(path => {
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

    if(loadingScreen){
        loadingScreen.classList.add("hide");

        setTimeout(() => {
            loadingScreen.remove();
        }, 400);
    }
}
