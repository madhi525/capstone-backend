const db = require("../config/dbPromise");

const ambilSemuaBarangUser = async (userId, limit, offset) => {
    try {
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM Produk
            WHERE id_user = ?
        `;
        const [countRows] = await db.query(countQuery, [userId]);
        const total = countRows[0].total;

        let dataQuery = `
            SELECT *
            FROM Produk
            WHERE id_user = ?
            ORDER BY stok DESC
        `;
        const queryParams = [userId];

        if (limit !== null && offset !== null) {
            dataQuery += ` LIMIT ? OFFSET ?`;
            queryParams.push(limit, offset);
        }

        const [dataRows] = await db.query(dataQuery, queryParams);

        return {
            count: total,
            rows: dataRows
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const ambilSemuaBarangKeluarUser = async (userId, limit, offset) => {
    try {
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM Barang_Keluar
            WHERE id_user = ?
        `;
        const [countRows] = await db.query(countQuery, [userId]);
        const total = countRows[0].total;

        let dataQuery = `
            SELECT *
            FROM Barang_Keluar
            WHERE id_user = ?
            ORDER BY jumlah DESC
        `;
        const queryParams = [userId];

        if (limit !== null && offset !== null) {
            dataQuery += ` LIMIT ? OFFSET ?`;
            queryParams.push(limit, offset);
        }

        const [dataRows] = await db.query(dataQuery, queryParams);

        return {
            count: total,
            rows: dataRows
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const ambilSemuaBarangMasukUser = async (userId, limit, offset) => {
    try {
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM Barang_Masuk
            WHERE id_user = ?
        `;
        const [countRows] = await db.query(countQuery, [userId]);
        const total = countRows[0].total;

        let dataQuery = `
            SELECT *
            FROM Barang_Masuk
            WHERE id_user = ?
            ORDER BY jumlah DESC
        `;
        const queryParams = [userId];

        if (limit !== null && offset !== null) {
            dataQuery += ` LIMIT ? OFFSET ?`;
            queryParams.push(limit, offset);
        }

        const [dataRows] = await db.query(dataQuery, queryParams);

        return {
            count: total,
            rows: dataRows
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Ambil satu barang berdasarkan ID produk
const ambilBarangById = async (id) => {
    try {
        const [rows] = await db.query('SELECT * FROM Produk WHERE id_produk = ?', [id]);
        return rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Tambah barang ke tabel Produk
const tambahBarang = async (data) => {
    try {
        const [result] = await db.query(`INSERT INTO Produk SET ?`, data);
        console.log('result insert:', result);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Input stok barang masuk
const restock = async (data) => {
    try {
        const [result] = await db.query(`INSERT INTO Barang_Masuk SET ?`, data);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Edit barang berdasarkan id_produk
const editBarang = async (id, data) => {
    try {
        const [result] = await db.query(`UPDATE Produk SET ? WHERE id_produk = ?`, [data, id]);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Hapus barang dari tabel Produk
const hapusBarang = async (id) => {
    try {
        const [result] = await db.query(`DELETE FROM Produk WHERE id_produk = ?`, [id]);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Input data barang keluar
const reduce = async (data) => {
    try {
        const [result] = await db.query(`INSERT INTO Barang_Keluar SET ?`, data);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Menghapus entri salah input pada Barang_Masuk
const salahInputMasuk = async (id) => {
    try {
        const [result] = await db.query(`DELETE FROM Barang_Masuk WHERE id_masuk = ?`, [id]);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Menghapus entri salah input pada Barang_Keluar
const salahInputKeluar = async (id) => {
    try {
        const [result] = await db.query(`DELETE FROM Barang_Keluar WHERE id_keluar = ?`, [id]);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Cari barang berdasarkan nama dan kategori
const cariBarang = async (filters) => {
    try {
        let query = `SELECT * FROM Produk WHERE 1=1`;
        let queryParams = [];

        if (filters.nama) {
            query += ` AND nama_produk LIKE ?`;
            queryParams.push(`%${filters.nama}%`);
        }

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
    ambilSemuaBarangUser,
    ambilSemuaBarangKeluarUser,
    ambilSemuaBarangMasukUser,
    tambahBarang,
    restock,
    editBarang,
    hapusBarang,
    reduce,
    cariBarang,
    salahInputMasuk,
    salahInputKeluar,
    ambilBarangById
};
