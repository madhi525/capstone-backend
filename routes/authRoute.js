const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middleware/multerConfig');
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Terlalu banyak percobaan register, coba lagi sebentar lagi.'
});

router.post('/register',limiter, authController.register);

router.post('/login', authController.login);

// router.post('/forgot-password', authController.forgotPassword);

//router.post('/change-profil-picture', upload.single('fotoprofil'), authController.changeProfilePicture);

module.exports = router;
