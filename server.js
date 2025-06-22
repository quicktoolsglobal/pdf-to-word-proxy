const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = process.env.PORT || 3000;

app.post('/convert', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send('No file uploaded');

  try {
    const result = await axios({
      method: 'post',
      url: 'https://api.cloudmersive.com/convert/pdf/to/word',
      headers: {
        'Apikey': process.env.CLOUDMERSIVE_API_KEY,
        'Content-Type': 'application/pdf'
      },
      data: fs.createReadStream(file.path),
      responseType: 'arraybuffer'
    });
    fs.unlinkSync(file.path);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename="converted.docx"',
    });
    res.send(result.data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Conversion error');
  }
});

app.listen(PORT, ()=> console.log('Server running', PORT));
