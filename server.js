const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/upload', upload.single('invoiceFile'), async (req, res) => {
  const { companyName, invoiceNumber } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  // Optional: Send to n8n webhook
  const webhookUrl = 'https://primary-production-6235.up.railway.app/webhook-test/1bfdb1ad-bfe4-4eb2-8741-05e23562be63';
  const formData = new FormData();
  formData.append('companyName', companyName);
  formData.append('invoiceNumber', invoiceNumber);
  formData.append('invoiceFile', fs.createReadStream(file.path));

  try {
    await axios.post(webhookUrl, formData, {
      headers: formData.getHeaders()
    });
  } catch (error) {
    console.error('n8n error:', error.message);
  }

  res.json({
    message: 'File received',
    companyName,
    invoiceNumber,
    originalFileName: file.originalname
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
