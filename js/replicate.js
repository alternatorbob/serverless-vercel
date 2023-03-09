import { delay } from "/js/utils";
export async function inPaint(canvas64, mask64, prompt, progressCB) {
    const formData = new FormData();
    formData.append("image", canvas64);
    formData.append("mask", mask64);
    formData.append("prompt", prompt);
    // Post via axios or other transport method
    // fetch post formdata
    const { id } = await fetch("/api/inpaint", {
        method: "POST",
        body: formData,
    }).then((res) => res.json());

    let succeeded = false;
    let output;

    while (!succeeded) {
        const data = await fetch(`/api/${id}`).then((res) => res.json());

        // succeeded = true;
        if (data.status === "succeeded") {
            succeeded = true;
            output = data.output[0];
            break;
        } else {
            progressCB(data.logs);
        }

        await delay(1000);
    }

    return output;
}
