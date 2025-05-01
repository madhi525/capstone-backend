const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  User.findByEmail(email, (err, results) => {
    if (results.length > 0) return res.status(400).json({ message: 'Email already exists' });

    User.create({ email, password: hashedPassword }, (err) => {
      if (err) return res.status(500).json({ message: 'Registration error' });
      res.status(201).json({ message: 'User registered' });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, async (err, results) => {
    if (results.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Wrong password' });

    const token = generateToken(user);
    res.json({ token });
  });
};

exports.forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  User.updatePassword(email, hashedPassword, (err, result) => {
    if (err || result.affectedRows === 0) return res.status(400).json({ message: 'Reset failed or email not found' });
    res.json({ message: 'Password reset successful' });
  });
};

exports.changeProfilePicture = async (req, res) => {
    const email = req.body.email;
    const file = req.file;

    if(!file || !email) {
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
        })
    })
}