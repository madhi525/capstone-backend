const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerConfig'); // middleware untuk upload gambar

const {
    ambilBarang,
    ambilBarangId,
    tambahBarang,
    restockBarang,
    editBarang,
    hapusBarang,
    cariBarang,
    reduceBarang
} = require('../controllers/itemController');

// Semua route ini dilindungi oleh middleware verifyToken

// GET semua barang milik user (optional: limit & offset)
router.get('/ambil/', verifyToken, ambilBarang);

// GET cari barang berdasarkan query string
router.get('/cari/search', verifyToken, cariBarang);

// GET ambil detail barang berdasarkan ID
router.get('/ambilid/:id', verifyToken, ambilBarangId);

// POST tambah barang baru (dengan upload foto)
router.post('/tambah/', verifyToken, upload.single('foto'), tambahBarang);

// PUT update barang berdasarkan ID (dengan upload foto jika diganti)
router.put('/edit/:id', verifyToken, upload.single('foto'), editBarang);

// DELETE hapus barang berdasarkan ID
router.delete('/hapus/:id', verifyToken, hapusBarang);

// PATCH untuk mengurangi stok barang
router.patch('/reduce/:id', verifyToken, reduceBarang);

// PATCH untuk restock barang
router.patch('/restock/:id', verifyToken, restockBarang);

module.exports = router;
