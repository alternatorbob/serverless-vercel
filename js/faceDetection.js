import * as faceapi from "face-api.js";
import { highlightPoints } from "./utils";
import {
    drawMask,
    createMaskCanvas,
    createDetectionsCanvas,
} from "./drawUtils";

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
    let myPrompt;
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
        const box = result.detection.box;

        const drawBox = new faceapi.draw.DrawBox(box, {
            label: `${gender}, ${Math.round(age, 0)} years`,
        });
        drawBox.draw(detectionsCanvas);

        faceapi.draw.drawFaceLandmarks(detectionsCanvas, result, {
            drawLines: true,
        });

        //nose = 27-30-35
        const points = result.landmarks.positions;

        /*
        //brow left
        //brow left
        highlightPoints(detectionsCanvas, points[17]);
        highlightPoints(detectionsCanvas, points[21]);

        //brow right
        highlightPoints(detectionsCanvas, points[22]);
        highlightPoints(detectionsCanvas, points[26]);

        //nose top
        highlightPoints(detectionsCanvas, points[27]);
        // highlightPoints(detectionsCanvas, points[35]);

        //left eye outer
        highlightPoints(detectionsCanvas, points[36]);
        //left eye center
        highlightPoints(detectionsCanvas, points[38]);
        
        //righ eye outer
        highlightPoints(detectionsCanvas, points[45]);
        //righ eye middle
        highlightPoints(detectionsCanvas, points[44]);

        //mouth left
        highlightPoints(detectionsCanvas, points[60]);
        //mouth right
        highlightPoints(detectionsCanvas, points[64]);
        //mout middle middle
        highlightPoints(detectionsCanvas, points[66]);
        //mouth middle bottom
        highlightPoints(detectionsCanvas, points[57]);
        */

        drawMask(detectionsCanvas, points);
        createMaskCanvas(image, points);

        myPrompt =
            gender === "male"
                ? `A man's face, is smiling, eyes are open, he`
                : `A woman's face, is smiling, eyes are open, she`;

        myPrompt += ` is around ${Math.round(
            age
        )} years old, detailed faces, highres, RAW photo 8k uhd, dslr`;

        // myPrompt = gender === "male" ? `A man's face` : `A woman's face`;

        console.log(myPrompt);
    });

    return myPrompt;
}
