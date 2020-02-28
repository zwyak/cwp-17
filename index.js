const express = require('express');
const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const pdfStorage = multer.diskStorage({
  destination: './uploads/pdf/',
  filename: function (req, file, cb) {
    const filename = uuidv4() + '.pdf';
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });
const pdf = multer({ storage: pdfStorage });

const app = express();

app.use(express.static('public'));

app.post('/upload', upload.single('file'), (req, res, next) => {
  res.json({ succeed: true });
});

app.post('/pdf', pdf.array('files', 3), (req, res, next) => {
  let counter = 0;
  req.files.forEach((item, i) => {
    if (path.extname(item.originalname) != '.pdf') {
      res.sendStatus(401);
      return;
    }else{
      counter++;
    }
  });
  res.json({ succeed: true, files: counter });
});

app.listen(3000, () => console.log('Server app listening on port 3000!'));
