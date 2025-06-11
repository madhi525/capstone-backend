const db = require('../config/dbPromise');

const User = {
  findByEmail: async (email) => {
    try {
      db.query('SELECT * FROM User WHERE email = ?', [email]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  create: (user) => {
    try {
      db.query('INSERT INTO User SET ?', user);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  updatePassword: (email, hashedPassword) => {
    try {
      db.query('UPDATE User SET password = ? WHERE email = ?', [hashedPassword, email]);
    } catch (error) {
      console.log(error);
      throw error;
    } 
  },

  updateFotoProfil: (path, email) => {
    try {
      db.query('UPDATE User SET fotoprofil = ? WHERE email = ?', [path,email]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};

module.exports = User;
