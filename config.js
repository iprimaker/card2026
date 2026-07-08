export const CARD_TYPES = {

    A: {
        type: "A",
        label: "ひみつのアイプリ",

        attribute: true,

        maxName: 7,
        maxCostume: 20
    },

    B: {
        type: "B",
        label: "おねがいアイプリ",

        attribute: false,

        maxName: 7,
        maxCostume: 20
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
