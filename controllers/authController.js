const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const sanitizeHtml = require('sanitize-html');
const User = require('../models/userModel');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.register = async (req, res) => {
  try {

    const {username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }
  
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
  
    if (!validator.isLength(password, { min: 8 })) {
      return res.status(400).json({ message: 'Password minimal 8 karakter' });
    }
  
    const sanitizeUsername = sanitizeHtml(username);
    const sanitizeEmail = sanitizeHtml(email);
    const sanitizePassword = sanitizeHtml(password);
  
    const hashedPassword = await bcrypt.hash(sanitizePassword, 10);
  
    const existingUser = await User.findByEmail(sanitizeEmail);
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah digunakan' });
    }
  
    await User.create({
      username: sanitizeUsername,
      email: sanitizeEmail,
      password: hashedPassword
    });
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    console.error('Error Register', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat Register' });
  }

};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
  
    const sanitizeEmail = sanitizeHtml(email);
    const sanitizePassword = sanitizeHtml(password);
  
    const result = User.findByEmail(sanitizeEmail);
    if (!result) {
      return res.status(400).json({ message: 'Email tidak ditemukan' });
    }
    
    const user = results[0];
    console.log(user);
    const isMatch = await bcrypt.compare(sanitizePassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Wrong password' });
  
    const token = generateToken(user);
    res.status(200).json({ message : 'Login Berhasil', id: user.id ,username : user.username, token : token, email : user.email});
    //  res.cookie('token', token, {
    //   httpOnly: true,
    //   secure: true,           // wajib true kalau sameSite: 'none'
    //   sameSite: 'none',       // gunakan lowercase 'none' di Express
    //   domain: '.nurudhi.my.id', // scope cookie ke seluruh sub-domain
    //   path: '/',              // kirim di semua path
    //   maxAge: 5 * 60 * 60 * 1000
    // });
  } catch (error) {
    console.error('Error login', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat login' });
  }

};

exports.forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const sanitizeEmail = sanitizeHtml(email);
    const sanitizePassword = sanitizeHtml(newPassword);

    if (!validator.isLength(sanitizePassword, { min: 8 })) {
      return res.status(400).json({ message: 'Password minimal 8 karakter' });
    }

    const hashedPassword = await bcrypt.hash(sanitizePassword, 10);
    
    const existingUser = await User.findByEmail(sanitizeEmail);
    if (!existingUser) {
      return res.status(400).json({ message: "Email tidak ditemukan" });
    }

    const result = await User.updatePassword(sanitizeEmail, hashedPassword);
    res.status(200).json({ message: 'Password berhasil direset' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat reset password' });
  }
};


exports.changeProfilePicture = async (req, res) => {
  try {
    const email = req.body.email;
    const file = req.file;

    const sanitizeEmail = sanitizeHtml(email);

    if (!file || !sanitizeEmail) {
      return res.status(400).json({ message: 'Email atau Foto tidak terupload' });
    }

    const file_path = file.path;

    await User.updateFotoProfil(file_path, sanitizeEmail);
    
    res.status(200).json({
      message: 'Foto profil berhasil diperbarui',
      filepath: file_path
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengupdate foto profil' });
  }
};
