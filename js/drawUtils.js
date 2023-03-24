import * as faceapi from "face-api.js";
import { pushValues, distanceBetweenPoints } from "./utils";
// let pointIndexes = pushValues(17, 26).concat([
//     45, 64, 55, 56, 57, 58, 59, 60, 36, 17,
// ]);
let pointIndexes = pushValues(17, 26).concat([64, 55, 56, 57, 58, 59, 60, 17]);

export function drawMask(canvas, points) {
    const ctx = canvas.getContext("2d");
    // let pointIndexes = pushValues(17, 26).concat(pushValues(16, 0));

    const mouthWidth = distanceBetweenPoints(points[60], points[64]) * 0.9;
    const mouthHeight = mouthWidth * 0.5;

    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 20;
    ctx.save();
    ctx.moveTo(points[66]._x, points[66]._y);

    ctx.beginPath();
    drawEllipse(ctx, points[66]._x, points[66]._y, mouthWidth, mouthHeight);
    drawEllipse(
        ctx,
        points[38]._x,
        points[38]._y,
        mouthWidth * 0.7,
        mouthHeight
    );

    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    drawEllipse(
        ctx,
        points[43]._x,
        points[43]._y,
        mouthWidth * 0.7,
        mouthHeight
    );
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(points[17]._x, points[17]._y);
    pointIndexes.forEach((index) => {
        const { x, y } = points[index];
        ctx.lineTo(x, y);
    });

    ctx.closePath();
    ctx.fill();

    // ctx.ellipse(
    //     points[66]._x,
    //     points[66]._y,
    //     mouthWidth,
    //     mouthHeight,
    //     0,
    //     0,
    //     2 * Math.PI
    // );

    // ctx.ellipse(
    //     points[38]._x,
    //     points[38]._y,
    //     mouthWidth,
    //     mouthHeight,
    //     0,
    //     0,
    //     2 * Math.PI
    // );

    // ctx.stroke();
}

export function createMaskCanvas(img, points) {
    const container = document.querySelector("#photo--input--container");

    const maskCanvas = document.createElement("canvas");
    maskCanvas.id = "mask--canvas";
    maskCanvas.width = img.width;
    maskCanvas.height = img.height;
    maskCanvas.classList.add("hidden");

    const ctx = maskCanvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    drawMask(maskCanvas, points);

    container.append(maskCanvas);
}

export function cropToSquare(canvas){
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    const size = Math.min(width, height);
}

export function createDetectionsCanvas(image) {
    const container = document.querySelector("#photo--input--container");
    const detectionsCanvas = faceapi.createCanvasFromMedia(image);
    detectionsCanvas.id = "detections--canvas";
    container.append(detectionsCanvas);

    return detectionsCanvas;
}

function drawEllipse(ctx, x, y, width, height) {
    ctx.ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
}
