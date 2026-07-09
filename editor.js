import { startApp } from "./app.js";
import { preloadImages } from "./preload.js";

const PRELOAD_IMAGES = [
    "./backA1.png",
    "./backA1_1.png",
    "./backB2.png",

    "./flameA1.png",
    "./flameA2.png",
    "./flameA3.png",

    "./flameB1_2.png",
    "./flameB2_2.png",
    "./flameB3_2.png",
    "./flameB4_2.png",

    "./attributeA_1.png",
    "./attributeA_2.png",
    "./attributeA_3.png",
    "./attributeA_4.png",
    "./attributeA_5.png",
    "./attributeA_6.png",
    "./attributeA_7.png",
    "./attributeA_8.png",
    "./attributeA_9.png",
    "./attributeA_10.png",

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
    "./A1400.png",

    "./B_suki_900.png",
    "./B_suki_950.png",
    "./B_suki_1000.png",
    "./B_suki_1050.png",
    "./B_suki_1100.png",
    "./B_suki_1150.png",
    "./B_suki_1200.png",
    "./B_suki_1250.png",
    "./B_suki_1300.png",
    "./B_suki_1350.png",
    "./B_suki_1400.png",

    "./B_yujo_900.png",
    "./B_yujo_950.png",
    "./B_yujo_1000.png",
    "./B_yujo_1050.png",
    "./B_yujo_1100.png",
    "./B_yujo_1150.png",
    "./B_yujo_1200.png",
    "./B_yujo_1250.png",
    "./B_yujo_1300.png",
    "./B_yujo_1350.png",
    "./B_yujo_1400.png",

    "./B_yuki_900.png",
    "./B_yuki_950.png",
    "./B_yuki_1000.png",
    "./B_yuki_1050.png",
    "./B_yuki_1100.png",
    "./B_yuki_1150.png",
    "./B_yuki_1200.png",
    "./B_yuki_1250.png",
    "./B_yuki_1300.png",
    "./B_yuki_1350.png",
    "./B_yuki_1400.png",

    "./B_yume_900.png",
    "./B_yume_950.png",
    "./B_yume_1000.png",
    "./B_yume_1050.png",
    "./B_yume_1100.png",
    "./B_yume_1150.png",
    "./B_yume_1200.png",
    "./B_yume_1250.png",
    "./B_yume_1300.png",
    "./B_yume_1350.png",
    "./B_yume_1400.png"
];

window.addEventListener("DOMContentLoaded", async () => {

    if(document.fonts){
        await document.fonts.ready;
    }

    await preloadImages(PRELOAD_IMAGES);

    startApp();

    // 利用にあたって
    const noticeButton = document.getElementById("noticeButton");
    const noticeModal = document.getElementById("noticeModal");
    const closeModal = document.getElementById("closeModal");

    if(noticeButton && noticeModal && closeModal){
        noticeButton.addEventListener("click", () => {
            noticeModal.classList.add("show");
        });

        closeModal.addEventListener("click", () => {
            noticeModal.classList.remove("show");
        });
    }

    // お知らせ
    const NEWS_VERSION = "20260709-3";

    const newsButton = document.getElementById("newsButton");
    const newsModal = document.getElementById("newsModal");
    const closeNewsModal = document.getElementById("closeNewsModal");

    if(newsButton && newsModal && closeNewsModal){

        const readVersion = localStorage.getItem("newsReadVersion");

        if(readVersion === NEWS_VERSION){
            newsButton.classList.add("read");
        }else{
            newsButton.classList.remove("read");
        }

        newsButton.addEventListener("click", () => {
            newsModal.classList.add("show");

            localStorage.setItem("newsReadVersion", NEWS_VERSION);
            newsButton.classList.add("read");
        });

        closeNewsModal.addEventListener("click", () => {
            newsModal.classList.remove("show");
        });
    }

    // 使い方ガイド
    const guideButton = document.getElementById("guideButton");
    const guideModal = document.getElementById("guideModal");
    const closeGuideModal = document.getElementById("closeGuideModal");

    if(guideButton && guideModal && closeGuideModal){

        if(localStorage.getItem("guideRead") !== "true"){
            guideModal.classList.add("show");
        }

        guideButton.addEventListener("click", () => {
            guideModal.classList.add("show");
        });

        closeGuideModal.addEventListener("click", () => {
            guideModal.classList.remove("show");
            localStorage.setItem("guideRead", "true");
        });
    }

});
