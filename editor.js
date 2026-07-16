import { startApp } from "./app.js";
import { preloadImages } from "./preload.js";

const PRELOAD_IMAGES = [
    // 背景素材
    "./backA1.png",
    "./backA1_1.png",
    "./backB2.png",

    // フレーム素材：ひみつ
    "./flameA1.png",
    "./flameA2.png",
    "./flameA3.png",

    // フレーム素材：ひみつ（★4）
　　"./flameA1_4.png",
　　"./flameA2_4.png",
　　"./flameA3_4.png",

    // フレーム素材：おねがい
    "./flameB1_2.png",
    "./flameB2_2.png",
    "./flameB3_2.png",
    "./flameB4_2.png",
    "./flameB5_2.png",
    "./flameB6_2.png",
    
    // レアリティ素材：ひみつ
    "./A_rank2.png",
    "./A_rank3.png",
    "./A_rank4.png",
    
    //レアリティ素材：おねがい
    

    // 属性素材：ひみつ
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

        // ☆4属性素材：ひみつ
    "./attributeA2_4.png",
    "./attributeA2_5.png",
    "./attributeA2_6.png",
    "./attributeA2_7.png",
    "./attributeA2_8.png",
    "./attributeA2_9.png",
    "./attributeA2_10.png",

    // バズパワー素材：ひみつ
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

    // バズパワー素材：ひみつ（★4）
　　"./A2_900.png",
　　"./A2_950.png",
　　"./A2_1000.png",
　　"./A2_1050.png",
　　"./A2_1100.png",
　　"./A2_1150.png",
　　"./A2_1200.png",
　　"./A2_1250.png",
　　"./A2_1300.png",
　　"./A2_1320.png",
　　"./A2_1350.png",
　　"./A2_1400.png",

    // バズパワー素材：おねがい（すき）
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

    // バズパワー素材：おねがい（ゆうじょう）
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

    // バズパワー素材：おねがい（ゆうき）
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

     // バズパワー素材：おねがい（じょうねつ）
    "./B_jounetu_900.png",
    "./B_jounetu_950.png",
    "./B_jounetu_1000.png",
    "./B_jounetu_1050.png",
    "./B_jounetu_1100.png",
    "./B_jounetu_1150.png",
    "./B_jounetu_1200.png",
    "./B_jounetu_1250.png",
    "./B_jounetu_1300.png",
    "./B_jounetu_1350.png",
    "./B_jounetu_1400.png",

     // バズパワー素材：おねがい（きぼう）
    "./B_kibou_900.png",
    "./B_kibou_950.png",
    "./B_kibou_1000.png",
    "./B_kibou_1050.png",
    "./B_kibou_1100.png",
    "./B_kibou_1150.png",
    "./B_kibou_1200.png",
    "./B_kibou_1250.png",
    "./B_kibou_1300.png",
    "./B_kibou_1350.png",
    "./B_kibou_1400.png"

    // バズパワー素材：おねがい（ゆめ）
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

    try{
        console.log("フォント読み込み開始");

        if(document.fonts){
            await document.fonts.ready;
        }

        console.log("素材プリロード開始");

        await preloadImages(PRELOAD_IMAGES);

        console.log("素材プリロード完了");

    }catch(error){
        console.error("プリロード中にエラーが発生しました", error);

        // エラー時もローディング画面を閉じる
        const loadingScreen = document.getElementById("loadingScreen");

        if(loadingScreen){
            loadingScreen.classList.add("hide");

            setTimeout(() => {
                loadingScreen.remove();
            }, 400);
        }
    }

    startApp();

    // ---------- 利用にあたって ----------
    const noticeButton = document.getElementById("noticeButton");
    const noticeModal = document.getElementById("noticeModal");
    const closeModal = document.getElementById("closeModal");

    if(noticeButton && noticeModal && closeModal){

        noticeButton.onclick = () => {
            openModal(noticeModal);
        };

        closeModal.onclick = () => {
            closeModalWindow(noticeModal);
        };
    }

    // ---------- お知らせ ----------
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

        newsButton.onclick = () => {
            openModal(newsModal);

            localStorage.setItem(
                "newsReadVersion",
                NEWS_VERSION
            );

            newsButton.classList.add("read");
        };

        closeNewsModal.onclick = () => {
            closeModalWindow(newsModal);
        };
    }

    // ---------- 使い方 ----------
    const guideButton = document.getElementById("guideButton");
    const guideModal = document.getElementById("guideModal");
    const closeGuideModal = document.getElementById("closeGuideModal");

    if(guideButton && guideModal && closeGuideModal){

        if(localStorage.getItem("guideRead") !== "true"){
            openModal(guideModal);
        }

        guideButton.onclick = () => {
            openModal(guideModal);
        };

        closeGuideModal.onclick = () => {
            closeModalWindow(guideModal);
            localStorage.setItem("guideRead", "true");
        };
    }
});

function openModal(modal){

    if(!modal) return;

    modal.classList.add("show");
    document.body.classList.add("modalOpen");
}

function closeModalWindow(modal){

    if(!modal) return;

    modal.classList.remove("show");

    const openedModal =
        document.querySelector(".modal.show");

    if(!openedModal){
        document.body.classList.remove("modalOpen");
    }
}
