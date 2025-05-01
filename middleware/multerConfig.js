const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    const custom_name = req.body.filename;
    const safe_name = custom_name ? custom_name.replace(/[^a-z0-9_\-\.]/gi, '_') : Date.now() + path.extname(file.originalname);
    cb(null, safe_name);
  }
});

const upload = multer({ storage });

module.exports = upload;
