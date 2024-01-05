const express = require('express');
const qr = require('qrcode');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/qrcrud.html');
});

app.post('/generateQR', (req, res) => {
  const { barcodeNumber, type, barcodeKey, barcode } = req.body;

  // 입력된 정보를 바탕으로 텍스트 생성
  const text = `Barcode Number: ${barcodeNumber}\nType: ${type}\nBarcode Key: ${barcodeKey}\nBarcode: ${barcode}`;

  // QR 코드 생성 및 이미지로 변환 후 전송
  qr.toDataURL(text, (err, url) => {
    if (err) {
      res.status(500).send('Failed to generate QR code');
    } else {
      res.send(`<img src="${url}" alt="QR Code">`);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
