const db = require("../config/db");

const Barang = {
    findByRequest: (what, callback) => {
        db.query('SELECT * FROM barang WHERE')
    }
};