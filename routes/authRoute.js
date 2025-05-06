const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middleware/multerConfig');

/*
register 
req : {
username: "username",
email : "emailuser@gmail.com",
password : "passworduser"
}
res : {
message : "custom message"
}
*/ 
router.post('/register', authController.register);

/* 
Login
req : {
email : "emailuser@gmail.com",
password : "passworduser"
}
res : {
massage : "custom massage" / token : token
}
*/
router.post('/login', authController.login);

// Masih tahap konstruksi mailer butuh auth gmail, bahaya
// router.post('/forgot-password', authController.forgotPassword);

// taruh di kostumisasi-user-route.js
//router.post('/change-profil-picture', upload.single('fotoprofil'), authController.changeProfilePicture);

module.exports = router;
