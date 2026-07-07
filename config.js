export const CARD_TYPES = {

    A: {
        type: "A",
        label: "ひみつのアイプリ",

        attribute: true,

        maxName: 4,
        maxCostume: 15
    },

    B: {
        type: "B",
        label: "おねがいアイプリ",

        attribute: false,

        maxName: 4,
        maxCostume: 15
    }

};

export function getCurrentCardType(){

    const type = localStorage.getItem("cardType") || "A";

    return CARD_TYPES[type] ?? CARD_TYPES.A;

}

export function setCurrentCardType(type){

    if(CARD_TYPES[type]){
        localStorage.setItem("cardType", type);
    }

}
