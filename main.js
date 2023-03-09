import "./style.css";
import "./css/ui.css";
import { inPaint } from "./js/replicate";
import { getDetections } from "./js/faceDetection";

const canvas = document.querySelector("#image--canvas");
const imgResults = document.querySelector("#result");
const ctx = canvas.getContext("2d");

const form = document.querySelector("#form");

const imageInput = form.querySelector('input[type="file"]');
let canvas64, mask64, myPrompt;

imageInput.onchange = (e) => {
    const file = e.target.files[0];

    // check if file empty
    const reader = new FileReader();

    reader.onload = (e) => {
        const img = new Image();
        img.onload = async () => {
            // const min = Math.min(img.width, img.height);
            canvas.width = img.width;
            canvas.height = img.height;
            // canvas.width = min;
            // canvas.height = min;
            ctx.save();

            const ratio = img.width / img.height;
            // ctx.drawImage(img, 0, 0, canvas.width, canvas.height / ratio);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas64 = canvas.toDataURL();

            myPrompt = await getDetections(file);

            // force clear canvas by resizing it
            // canvas.width = canvas.width;
            // ctx.fillStyle = "white";
            // ctx.fillRect(0, 0, canvas.width, canvas.height);

            // ctx.beginPath();
            // let radius = canvas.width * 0.4;
            // ctx.arc(
            //     canvas.width / 2,
            //     canvas.height / 2,
            //     radius,
            //     0,
            //     2 * Math.PI
            // );
            // ctx.fillStyle = "black";
            // ctx.fill();
            // ctx.restore();
            const maskCanvas = document.querySelector("#mask--canvas");
            mask64 = maskCanvas.toDataURL();
        };
        img.src = e.target.result;
    };
    if (file) {
        reader.readAsDataURL(file);
    }
};

form.onsubmit = async (e) => {
    e.preventDefault();

    // create formdata
    // canvas to file

    console.log("Prompt: ", myPrompt);

    const output = await inPaint(canvas64, mask64, myPrompt, (value) => {
        console.log("progression:", value);
    });

    const img = new Image();
    img.src = output;
    imgResults.appendChild(img);
};
