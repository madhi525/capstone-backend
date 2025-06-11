const db = require('../config/dbPromise');

const User = {
  findByEmail: async (email) => {
    try {
      const [rows] = await db.query('SELECT * FROM User WHERE email = ?', [email]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  },

  create: async (user) => {
    try {
      const [result] = await db.query('INSERT INTO User SET ?', user);
      return result;
    } catch (error) {
      throw error;
    }
  },

  updatePassword: async (email, hashedPassword) => {
    try {
      const [result] = await db.query('UPDATE User SET password = ? WHERE email = ?', [hashedPassword, email]);
      return result > 0;
    } catch (error) {
      throw error;
    } 
  },

  updateFotoProfil: async (path, email) => {
    try {
      const [result] = await db.query('UPDATE User SET fotoprofil = ? WHERE email = ?', [path, email]);
      return result > 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = User;
