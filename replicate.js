
import { delay } from '/utils'
export async function inPaint(canvas64, mask64, progressCB) {

    const formData = new FormData();
    formData.append('image', canvas64);
    formData.append('mask', mask64);
    formData.append('prompt', 'person');
    // Post via axios or other transport method
    // fetch post formdata
    const { id } = await fetch('/api/inpaint', {
        method: 'POST',
        body: formData
    }).then(res => res.json())

    let fulfilled = false;
    let output;

    while (!fulfilled) {
        const data = await fetch(`/api/${id}`).then(res => res.json())

        // fulfilled = true;
        if (data.status === 'succeeded') {
            fulfilled = true;
            output = data.output[0]
            break;
        } else {
            progressCB(data.logs)
        }

        await delay(1000)
    }

    return output
}