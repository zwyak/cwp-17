const express = require('express');
const multer  = require('multer');
const path    = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const pdfStorage = multer.diskStorage({
  destination: './uploads/pdf/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });
const pdf = multer({ storage: pdfStorage });

const app = express();

app.use(express.static('public'));

app.post('/upload', upload.single('file'), (req, res, next) => {
  res.json({ succeed: true });
});

app.post('/pdf', pdf.single('file'), (req, res, next) => {
  if (path.extension(file.originalname) == '.pdf') {

  }
  res.json({ succeed: true });
});

app.listen(3000, () => console.log('Server app listening on port 3000!'));
