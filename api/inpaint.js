import pkg from "formidable";
const { IncomingForm } = pkg;
const API_HOST = process.env.REPLICATE_API_HOST || "https://api.replicate.com";
const API_KEY = process.env.REPLICATE_API_TOKEN;

export default async (req, res) => {
    if (req.method !== "POST") {
        return;
    }

    const data = await new Promise((resolve, reject) => {
        const form = new IncomingForm();
        form.parse(req, (err, fields, files) => {
            if (err) return reject(err);
            resolve({ fields, files });
        });
    });

    // const base64 = await readAsDataURL(data.files.image);

    // const { prompt, image, mask } = ;

    // const input = {
    //     prompt,
    //     init_image: image,
    //     mask,
    // };

    console.log(data.fields);

    const response = await fetch(`${API_HOST}/v1/predictions`, {
        method: "POST",
        headers: {
            Authorization: `Token ${API_KEY}`,
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            input: data.fields,
            version:
                "be04660a5b93ef2aff61e3668dedb4cbeb14941e62a3fd5998364a32d613e35e",
        }),
    });

    if (response.status !== 201) {
        let error = await response.text();
        res.end(JSON.stringify({ detail: error }));
        return;
    }

    const prediction = await response.json();
    res.statusCode = 201;
    res.end(JSON.stringify(prediction));
};

function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onerror = reject;
        fr.onload = () => {
            resolve(fr.result);
        };
        fr.readAsDataURL(file);
    });
}
