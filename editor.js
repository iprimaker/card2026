import { startApp } from "./app.js";

window.addEventListener("DOMContentLoaded", () => {

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
    const newsButton = document.getElementById("newsButton");
    const newsModal = document.getElementById("newsModal");
    const closeNewsModal = document.getElementById("closeNewsModal");

    if(newsButton && newsModal && closeNewsModal){

        // 既読なら赤丸を消す
        if(localStorage.getItem("newsRead") === "true"){
            newsButton.classList.add("read");
        }

        newsButton.addEventListener("click", () => {

            newsModal.classList.add("show");

            localStorage.setItem("newsRead", "true");
            newsButton.classList.add("read");

        });

        closeNewsModal.addEventListener("click", () => {
            newsModal.classList.remove("show");
        });

    }

});
