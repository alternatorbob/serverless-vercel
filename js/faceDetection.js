import * as faceapi from "face-api.js";
import { highlightPoints, pushValues } from "./utils";

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
    faceapi.nets.ageGenderNet.loadFromUri("/models"),
]).then(start);

function start() {
    console.log("models were loaded");
}

export async function getDetections(img) {
    const image = await faceapi.bufferToImage(img);
    const detectionsCanvas = createDetectionsCanvas(image);
    const displaySize = { width: image.width, height: image.height };
    faceapi.matchDimensions(detectionsCanvas, displaySize);

    const detections = await faceapi
        .detectAllFaces(image)
        .withFaceLandmarks()
        .withAgeAndGender();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    resizedDetections.forEach((result) => {
        const { age, gender } = result;
        console.log(age, gender);

        const box = result.detection.box;

        const drawBox = new faceapi.draw.DrawBox(box, {
            label: `${gender}, ${Math.round(age, 0)} years`,
        });
        drawBox.draw(detectionsCanvas);

        // faceapi.draw.drawFaceLandmarks(detectionsCanvas, result, {
        //     drawLines: true,
        // });

        const points = result.landmarks.positions;
        drawMask(detectionsCanvas, points);
    });
}

function drawMask(canvas, points) {
    const ctx = canvas.getContext("2d");
    let pointIndexes = pushValues(17, 26).concat(pushValues(16, 0));
    console.log(pointIndexes);

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(points[0]._x, points[0]._y);
    pointIndexes.forEach((index) => {
        const { x, y } = points[index];
        ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
}

function createDetectionsCanvas(image) {
    const container = document.querySelector("#photo--input--container");
    const detectionsCanvas = faceapi.createCanvasFromMedia(image);
    detectionsCanvas.id = "detections--canvas";
    container.append(detectionsCanvas);

    return detectionsCanvas;
}
