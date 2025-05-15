const db = require('../config/db');

const User = {
  findByEmail: (email, callback) => {
    db.query('SELECT * FROM User WHERE email = ?', [email], callback);
  },

  create: (user, callback) => {
    db.query('INSERT INTO User SET ?', user, callback);
  },

  updatePassword: (email, hashedPassword, callback) => {
    db.query('UPDATE User SET password = ? WHERE email = ?', [hashedPassword, email], callback);
  },

  updateFotoProfil: (path, email, callback) => {
    db.query('UPDATE User SET fotoprofil = ? WHERE email = ?', [path,email],callback);
  }
};

module.exports = User;
