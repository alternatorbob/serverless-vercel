import "./style.css";
import { inPaint } from "./replicate";

const canvas = document.querySelector("#canvas");
const imgResults = document.querySelector("#result");
const ctx = canvas.getContext("2d");

const form = document.querySelector("#form");

const imageInput = form.querySelector('input[type="file"]');
let canvas64, mask64;

imageInput.onchange = (e) => {
    const file = e.target.files[0];

    // check if file empty
    const reader = new FileReader();

    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const min = Math.min(img.width, img.height);
            canvas.width = min;
            canvas.height = min;

            ctx.save();

            const ratio = img.width / img.height;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height / ratio);

            canvas64 = canvas.toDataURL();

            // force clear canvas by resizing it
            // canvas.width = canvas.width;

            // ctx.fillStyle = "white";
            // ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.beginPath();
            let radius = canvas.width * 0.3;
            ctx.arc(
                canvas.width / 2,
                canvas.height / 2,
                radius,
                0,
                2 * Math.PI
            );
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.restore();

            mask64 = canvas.toDataURL();
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

    const output = await inPaint(canvas64, mask64, (value) => {
        console.log("progression:", value);
    });

    const img = new Image();
    img.src = output;
    imgResults.appendChild(img);
};
