const validator = require('validator');
const sanitizeHtml = require('sanitize-html');
const {
    tambahBarang,
    hapusBarang,
    logPerubahanBarang,
    cariBarang,
    ambilBarangByIddanUser,
    ambilSemuaBarangUser,
    editBarang
} = require('../models/itemModel');

exports.ambilBarang = async (req, res) => {
    try {
        const user = req.user.id;
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        const barang = await ambilSemuaBarangUser(user, limit, offset);
        if (barang.length === 0) {
            return res.status(404).json({ message: 'Barang tidak ditemukan' });
        }

        res.status(200).json({ message: 'Barang ditemukan', barang });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengambil barang' });
    }
};

exports.tambahBarang = async (req, res) => {
    try {
        const user = req.user.id;
        const { nama, stock, kategori, expired_date } = req.body;

        if ( validator.isEmpty(nama) || validator.isEmpty(stock) || validator.isEmpty(kategori) ) {
            return res.status(400).json({ message: 'Mohon Nama, Stock, dan Kategori' });
        };

        const namaBersih = sanitizeHtml(nama);
        const stockBersih = sanitizeHtml(stock);
        const kategoriBersih = sanitizeHtml(kategori);

        const data = {
            user_id: user,
            nama: namaBersih,
            stock: parseInt(stockBersih),
            kategori: kategoriBersih,
            foto: req.file?.filename || null,
        };

        if (expired_date) {
            if(!validator.isDate(expired_date)){
                return res.status(400).json({ message: 'Format tanggal tidak valid (YYYY-MM-DD)' });
            }
            data.expired_date = expired_date;
        }

        const result = await tambahBarang(data);
        res.status(201).json({message: 'Barang berhasil ditambahkan', result});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menambahkan barang' });
    }
};

exports.ambilBarangId = async (req, res) => {
    try{
        const id = req.params.id;
        const user = req.user.id;

        const result = ambilBarangByIddanUser(id,user);
        if(!result){
            return res.status(404).json({ message: 'Barang tidak ditemukan' });
        }
        res.status(200).json({message: 'Barang berhasil diambil', result});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengambil barang' });
    }
}

exports.editBarang = async (req, res) => {
    try {
        const user = req.user.id;
        const id = req.params.id;
        const { nama, stock, kategori, expired_date } = req.body;

        const existing = await ambilBarangByIddanUser(id, user);
        if (!existing) {
            return res.status(404).json({ message: 'Barang tidak ditemukan' });
        }

        const data = {};
        if (nama) data.nama = sanitizeHtml(nama);
        if (stock) data.stock = parseInt(sanitizeHtml(stock));
        if (kategori) data.kategori = sanitizeHtml(kategori);
        if (req.file) data.foto = req.file.filename;
        if (expired_date) {
            if (!validator.isDate(expired_date)) {
                return res.status(400).json({ message: 'Format tanggal tidak valid (YYYY-MM-DD)' });
            }
            data.expired_date = expired_date;
        }

        await editBarang(id, data);
        await logPerubahanBarang(id, 'edit', user);

        res.status(200).json({ message: 'Barang berhasil diperbarui' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal memperbarui barang' });
    }
};

exports.hapusBarang = async (req, res) => {
    try {
        const user = req.user.id;
        const id = req.params.id;

        const existing = await ambilBarangByIddanUser(id, user);
        if (!existing) {
            return res.status(404).json({ message: 'Barang tidak ditemukan' });
        }

        await hapusBarang(id);
        await logPerubahanBarang(id, 'hapus', user);

        res.status(200).json({ message: 'Barang berhasil dihapus' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menghapus barang' });
    }
};

exports.cariBarang = async (req, res) => {
    try {
        const filters = {
            nama: req.query.nama || '',
            kategori: req.query.kategori || ''
        };

        const results = await cariBarang(filters);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Barang tidak ditemukan' });
        }

        res.status(200).json({ message: 'Barang ditemukan', results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mencari barang' });
    }
};