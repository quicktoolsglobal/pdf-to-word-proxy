const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.CLOUDMERSIVE_API_KEY;

app.post('/convert', upload.single('file'), async (req, res) => {
  if (!API_KEY) return res.status(500).json({ error: 'Missing API Key' });

  const filePath = req.file.path;
  const fileBuffer = fs.readFileSync(filePath);

  try {
    const response = await fetch('https://api.cloudmersive.com/convert/pdf/to/docx', {
      method: 'POST',
      headers: {
        'Apikey': API_KEY,
        'Content-Type': 'application/pdf'
      },
      body: fileBuffer
    });

    const result = await response.buffer();
    fs.unlinkSync(filePath);
    res.setHeader('Content-Disposition', 'attachment; filename=converted.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(result);

  } catch (err) {
    res.status(500).send('Conversion failed');
  }
});

app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});
