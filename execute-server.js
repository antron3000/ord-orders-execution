const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const port = 4000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Temporarily store files in the 'uploads' directory before inscribing
  },
  filename: function (req, file, cb) {
    const filename = file.originalname;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

app.post('/executeOrder', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file provided.');
  }

  const filePath = path.join(__dirname, 'uploads', req.file.filename);
  
  // Construct the bash command
  const cmd = `ord wallet inscribe --fee-rate 15 "${filePath}"`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Failed to inscribe the file.');
    }

    // If you want to capture and send back the command's output:
    res.send(`File inscribed successfully. Command output: ${stdout}`);
  });
});

app.listen(port, () => {
  console.log(`Execute server is running on http://localhost:${port}`);
});
