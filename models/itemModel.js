const db = require("../config/db");

const ambilBarangByIddanUser = async (id, user) => {
    try {
        const query = `SELECT * FROM barang WHERE id = ? AND user_id = ?`;
        const [row] = await db.query(query, [id, user]);
        return row[0] || null;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const ambilSemuaBarangUser = async (user, limit = 10, offset = 0) => {
    try {
        const query = `SELECT * FROM barang WHERE user = ? LIMIT ? OFFSET ?`;
        const [rows] = await db.query(query, [user, limit, offset]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const tambahBarang = async (data) => {
    try {
        const query = `INSERT INTO barang SET ?`;
        const [result] = await db.query(query, data);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const editBarang = async (id, data) => {
    try {
        const query = `UPDATE barang SET ? WHERE id = ?`;
        const [result] = await db.query(query, [data, id]);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const hapusBarang = async (id) => {
    try {
        const query = `DELETE FROM barang WHERE id = ?`;
        const [result] = await db.query(query, id);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const logPerubahanBarang = async (id, aksi, user) => {
    try {
        const query = `INSERT INTO log_perubahan_barang (id, aksi, user, tanggal) VALUES (?, ?, ?, NOW())`;
        const [result] = await db.query(query, [id, aksi, user]);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const cariBarang = async (filters) => {
    try {
        let query = `SELECT * FROM barang WHERE 1=1`; // Kondisi default yang selalu benar, agar lebih mudah menambahkannya
        let queryParams = []; // Menyimpan parameter query yang digunakan untuk mencegah SQL Injection
        
        // Menambahkan filter untuk nama barang (pencarian berdasarkan nama)
        if (filters.nama) {
            query += ` AND nama LIKE ?`;
            queryParams.push(`%${filters.nama}%`);
        }

        // Menambahkan filter untuk tipe barang
        if (filters.kategori) {
            query += ` AND kategori = ?`;
            queryParams.push(filters.kategori);
        }

        const [rows] = await db.query(query, queryParams);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports = {
    tambahBarang,
    hapusBarang,
    logPerubahanBarang,
    cariBarang,
    ambilBarangByIddanUser,
    ambilSemuaBarangUser,
    editBarang
};