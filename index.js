const express = require('express');
const multer  = require('multer');
const path =    require('path');
const sharp =   require('sharp');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const pdfStorage = multer.diskStorage({
  destination: './uploads/pdf/',
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.pdf');
  }
});

const imageStorage = multer.diskStorage({
  destination: './uploads/images/',
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);

    sharp(file)
    .resize(800, 600)
    .then( data => { cb(null, 'preview' + Date.now() + ext); })
    .catch( err => { console.error(err);});

    sharp(file)
    .resize(300, 180)
    .then( data => { cb(null, 'thumbnail' + Date.now() + ext); })
    .catch( err => { console.error(err);});
  }
});

const upload = multer({ storage: storage });
const pdf = multer(
  {
    storage: pdfStorage,
    fileFilter: (req, files, cb) => {
      req.files.forEach((file, i) => {
        if(file.mimetype !== 'application/pdf') {
          return cb(null, false);
        }else{
          cb(null, true)
        }
      });
    }
});

const image = multer(
  {
    storage: imageStorage,
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      if(ext !== '.png' && ext != '.jpg') {
        return cb(null, false);
      }else{
        cb(null, true)
      }
    }
});

const app = express();

app.use(express.static('public'));
app.use(express.static('uploads/images'));

app.post('/upload', upload.single('file'), (req, res, next) => {
  res.json({ succeed: true });
});

app.post('/pdf', pdf.array('files', 3), (req, res, next) => {
    if (req.files.length == 0){
      res.sendStatus(404);
      return;
    }
    res.json({ succeed: true, files: req.files });
});

app.post('/images', image.single('image'), (req, res, next) => {
    res.json({ images: req.file });
});

app.listen(3000, () => console.log('Server app listening on port 3000!'));
