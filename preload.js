const imageCache = new Map();

const PRELOAD_TIMEOUT = 20000;

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

        if(!img){
            callback(null);
            return;
        }

        imageCache.set(path, img);

        img.clone(cloned => {
            callback(cloned);
        });
    });
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

    let loaded = 0;
    let failed = 0;

    const total = uniquePaths.length;

    function updateProgress(){

        const value =
            total === 0
                ? 100
                : Math.floor((loaded / total) * 100);

        if(progress){
            progress.style.width = value + "%";
        }

        if(percent){
            percent.textContent = value + "%";
        }
    }

    function showMaintenance(error){

        console.error(
            "プリロードに失敗しました:",
            error
        );

        document.body.classList.remove("isLoading");

        if(loadingText){
            loadingText.textContent =
                "起動に失敗しました";
        }

        if(percent){
            percent.textContent =
                "しばらく時間をおいてから再度お試しください";
        }

        if(progress){
            progress.style.width = "100%";
            progress.classList.add("maintenance");
        }

        if(loadingScreen){
            loadingScreen.classList.add(
                "maintenanceMode"
            );
        }
    }

    updateProgress();

    try{

        await Promise.race([

            Promise.all(
                uniquePaths.map(path => {
                    return preloadSingleImage(path)
                        .then(img => {

                            if(!img){
                                failed++;
                            }else{
                                imageCache.set(path, img);
                            }

                            loaded++;
                            updateProgress();
                        });
                })
            ),

            new Promise((_, reject) => {
                setTimeout(() => {
                    reject(
                        new Error(
                            "プリロードがタイムアウトしました"
                        )
                    );
                }, PRELOAD_TIMEOUT);
            })
        ]);

        if(failed > 0){
            throw new Error(
                `${failed}件の素材を読み込めませんでした`
            );
        }

        hideLoadingScreen(loadingScreen);

    }catch(error){

        showMaintenance(error);
        throw error;
    }
}

function preloadSingleImage(path){

    return new Promise(resolve => {

        const image = new Image();

        image.onload = () => {

            fabric.Image.fromURL(
                path,
                fabricImage => {
                    resolve(fabricImage || null);
                },
                {
                    crossOrigin: "anonymous"
                }
            );
        };

        image.onerror = () => {
            console.error(
                "素材読込失敗:",
                path
            );

            resolve(null);
        };

        image.src = path;
    });
}

function hideLoadingScreen(loadingScreen){

    document.body.classList.remove("isLoading");

    if(!loadingScreen) return;

    loadingScreen.classList.add("hide");

    setTimeout(() => {
        loadingScreen.remove();
    }, 400);
}
