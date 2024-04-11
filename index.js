const express = require('express');
const qrcode = require('qrcode');

const app = express();
const port = process.env.PORT || 5000; // Use environment variable for port or default to 5000

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

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
