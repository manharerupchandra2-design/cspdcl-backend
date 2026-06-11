// const multer = require('multer');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, uuidv4() + ext);
//   }
// });

// // const fileFilter = (req, file, cb) => {
// //   if (file.mimetype.startsWith('image/')) cb(null, true);
// //   else cb(new Error('Only images allowed'), false);
// // };

// const fileFilter = (req, file, cb) => {
//   // mimetype check ke saath extension bhi check karo
//   const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif'];
//   const allowedExts  = ['.jpg', '.jpeg', '.png', '.heic', '.heif'];
//   const ext = path.extname(file.originalname).toLowerCase();

//   if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
//     cb(null, true);
//   } else {
//     cb(null, false); // ✅ temporarily sab allow karo test ke liye
//   }
// };

// const upload = multer({ storage, fileFilter }); // ✅ variable me store karo
// module.exports = upload;                         // ✅ phir export karo

// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const multer = require('multer');

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key:    process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'meter_readings',   // Cloudinary me folder
//     allowed_formats: ['jpg', 'jpeg', 'png', 'heic'],
//     transformation: [{ quality: 'auto' }], // auto compress
//   },
// });

// const upload = multer({ storage });
// module.exports = upload;

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Ye add karo — credentials print honge Render logs me
console.log('Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ set' : '❌ missing',
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'meter_readings',
    allowed_formats: ['jpg', 'jpeg', 'png', 'heic'],
  },
});

const upload = multer({ storage });
module.exports = upload;