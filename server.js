const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });
const PORT = process.env.PORT || 3000;

app.use(cors());

app.post("/convert", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;

  try {
    const response = await axios.post(
      "https://api.cloudmersive.com/convert/pdf/to/word",
      fs.createReadStream(filePath),
      {
        headers: {
          "Content-Type": "application/pdf",
          "Apikey": process.env.CLOUDMERSIVE_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    res.setHeader("Content-Disposition", "attachment; filename=converted.docx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.send(response.data);

    fs.unlinkSync(filePath);
  } catch (error) {
    console.error("Conversion failed:", error);
    res.status(500).send("Conversion failed");
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});