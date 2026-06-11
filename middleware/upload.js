const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  }
});

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) cb(null, true);
//   else cb(new Error('Only images allowed'), false);
// };

const fileFilter = (req, file, cb) => {
  // mimetype check ke saath extension bhi check karo
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif'];
  const allowedExts  = ['.jpg', '.jpeg', '.png', '.heic', '.heif'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(null, false); // ✅ temporarily sab allow karo test ke liye
  }
};

const upload = multer({ storage, fileFilter }); // ✅ variable me store karo
module.exports = upload;                         // ✅ phir export karo