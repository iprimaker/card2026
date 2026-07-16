const imageCache = new Map();

const PRELOAD_TIMEOUT = 20000;

export function getCachedImage(path){
    return imageCache.get(path) || null;
}

export function cloneCachedImage(path, callback){

    const cached = imageCache.get(path);

    if(cached){
        cached.clone(cloned => {
            callback(cloned);
        });

        return;
    }

    fabric.Image.fromURL(
        path,
        img => {

            if(!img){
                console.error("画像読込失敗:", path);
                callback(null);
                return;
            }

            imageCache.set(path, img);

            img.clone(cloned => {
                callback(cloned);
            });
        },
        {
            crossOrigin: "anonymous"
        }
    );
}

export async function preloadImages(paths){

    const progress =
        document.getElementById("loadingProgress");

    const percent =
        document.getElementById("loadingPercent");

    const loadingScreen =
        document.getElementById("loadingScreen");

    const loadingText =
        document.querySelector(".loadingBox p");

    const uniquePaths = [...new Set(paths)];

    let completed = 0;
    let failed = 0;

    const total = uniquePaths.length;

    function updateProgress(){

        const value =
            total === 0
                ? 100
                : Math.floor((completed / total) * 100);

        if(progress){
            progress.style.width = `${value}%`;
        }

        if(percent){
            percent.textContent = `${value}%`;
        }
    }

    function loadOne(path){

        return new Promise(resolve => {

            let finished = false;

            const finish = img => {

                if(finished) return;

                finished = true;
                completed++;

                if(img){
                    imageCache.set(path, img);
                }else{
                    failed++;
                }

                updateProgress();
                resolve();
            };

            try{
                fabric
