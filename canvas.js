let canvas = null;

export const CARD_WIDTH = 697;
export const CARD_HEIGHT = 1016;

export function initCanvas(){

    if(canvas){
        canvas.dispose();
    }

    canvas = new fabric.Canvas("cardCanvas", {

        width: CARD_WIDTH,
        height: CARD_HEIGHT,

        selection: false,
        preserveObjectStacking: true,

        backgroundColor: "transparent"

    });

    canvas.setDimensions({
        width: CARD_WIDTH,
        height: CARD_HEIGHT
    });

    canvas.requestRenderAll();

    console.log(`Canvas initialized : ${CARD_WIDTH} × ${CARD_HEIGHT}`);

}

export function getCanvas(){
    return canvas;
}
