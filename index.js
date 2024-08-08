const express = require('express');
const qrcode = require('qrcode');
const jsBarcode = require('jsbarcode');
const { Canvas } = require("canvas");
const { barcodeFormats } = require("./barcodeDefine");
const app = express();
const port = process.env.PORT || 5000; // Use environment variable for port or default to 5000

//Example URL: https://localhost:5000/qr/test-qr-string?width=200&height=200
app.get('/qr/:data', async (req, res) => {
    const { data } = req.params;
    const { width, height } = req.query;

    // Parse width and height as integers
    let widthInt, heightInt;
    try {
        widthInt = parseInt(width);
        heightInt = parseInt(height);
    } catch (error) {
        widthInt = 400;
        heightInt = 400;
    }

    try {
        // Generate QR code data as a PNG buffer
        const pngBuffer = await qrcode.toBuffer(data, { type: 'png', scale: 4, width: widthInt, height: heightInt });  // Adjust scale if needed

        // Set content type and send response
        res.setHeader('Content-Type', 'image/png');
        res.send(pngBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating QR code');
    }
});

app.get('/barcode/:text', async (req, res) => {
    const { text } = req.params;
    const { width, height, format = "CODE128" } = req.query;
    if (!barcodeFormats.includes(format)) {
        res.statusCode = 400;
        return res.send("invalid format");
    }
    let widthInt, heightInt;
    widthInt = width ? parseInt(width) : 2;
    heightInt = height ? parseInt(height) : 80;
    const canvas = new Canvas();
    jsBarcode(canvas, text, {
        format: format,
        lineColor: "black",
        width: widthInt,
        height: `${heightInt}px`,
        displayValue: false
    });
    const imgBase64 = await new Promise((resolve, reject) => {
        canvas.toDataURL('image/png', (err, imgBase64) => {
            if (err) {
                reject(reject);
                return;
            }
            resolve(imgBase64);
        });
    });
    res.header('Content-Disposition', `inline; filename="barcode.png"`);
    res.setHeader('Content-type', 'image/png');
    const responseBase64 = Buffer.from(`${imgBase64}`.replace('data:image/png;base64,', ''), 'base64');
    return res.send(responseBase64);
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
