const PRELOAD_IMAGES = [
    "./backA1.png",
    "./backB2.png",

    "./flameA1.png",
    "./flameA2.png",
    "./flameA3.png",
    "./flameB1_2.png",
    "./flameB2_2.png",
    "./flameB3_2.png",
    "./flameB4_2.png",

    "./A900.png",
    "./A950.png",
    "./A1000.png",
    "./A1050.png",
    "./A1100.png",
    "./A1150.png",
    "./A1200.png",
    "./A1250.png",
    "./A1300.png",
    "./A1320.png",
    "./A1350.png",
    "./A1400.png"
];

export function preloadImages(){
    PRELOAD_IMAGES.forEach(path => {
        const img = new Image();
        img.src = path;
    });
}
