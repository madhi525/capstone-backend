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

  User.findByEmail(sanitizeEmail, (err, results) => {
    if (results.length > 0) return res.status(400).json({ message: 'Email already exists' });

    User.create({ username: sanitizeUsername, email: sanitizeEmail, password: hashedPassword }, (err) => {
      if (err) return res.status(500).json({ message: 'Registration error' });
      res.status(201).json({ message: 'User registered' });
    });    
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const sanitizeEmail = sanitizeHtml(email);
  const sanitizePassword = sanitizeHtml(password);

  User.findByEmail(sanitizeEmail, async (err, results) => {
    if (results.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

    const user = results[0];
    const isMatch = await bcrypt.compare(sanitizePassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Wrong password' });

    const token = generateToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 5*60*60*1000 
    });
    res.status(200).json({ message : 'Login Berhasil', username : user.username});
  });
};

exports.forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const sanitizeEmail = sanitizeHtml(email);
  const sanitizePassword = sanitizeHtml(newPassword);
  
  if (!validator.isLength(sanitizePassword, { min: 8 })) {
    return res.status(400).json({ message: 'Password minimal 8 karakter' });
  }

  const hashedPassword = await bcrypt.hash(sanitizePassword, 10);

  User.findByEmail(sanitizeEmail, (err, result)=>{
    if (result.length === 0) return res.status(400).json({message: "Email tidak ditemukan"});
    
    User.updatePassword(sanitizeEmail, hashedPassword, (err, result) => {
      if (err || result.affectedRows === 0) return res.status(400).json({ message: 'Reset failed or email not found' });
      res.status(200).json({ message: 'Password reset successful' });
    });
  });

};

exports.changeProfilePicture = async (req, res) => {
    const email = req.body.email;
    const file = req.file;

    const sanitizeEmail = sanitizeHtml(email);

    if(!file || !sanitizeEmail) {
        return res.status(400).json({ message: 'Email atau Foto tidak terupload'});
    }

    const file_path = file.path;

    User.updateFotoProfil(file_path,email,(err, result) => {
        if (err) {
            console.error('Error updating profile picture : ', err);
            return res.status(500).json({ message:'Database Error'});
        }
        return req.status(200).json({
            message: 'Profil Picture updated!',
            filepath: file_path
        });
    })
}