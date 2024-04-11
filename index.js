const express = require('express');
const qrcode = require('qrcode');

const app = express();
const port = process.env.PORT || 5000; // Use environment variable for port or default to 5000

app.get('/qr/:data', async (req, res) => {
  const { data } = req.params;

  try {
    // Generate QR code data as a PNG buffer for text data
    const pngBuffer = await qrcode.toBuffer(data, { type: 'png', scale: 8 });

    // Set content type and send response
    res.setHeader('Content-Type', 'image/png');
    res.send(pngBuffer);
  } catch (error) {
    console.error(error);
    res.status(5000).send('Error generating QR code');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
