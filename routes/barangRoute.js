const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerConfig'); // jika kamu pakai multer untuk upload foto

const {
    ambilBarang,
    ambilBarangId,
    tambahBarang,
    editBarang,
    hapusBarang,
    cariBarang
} = require('../controllers/itemController');

// Semua route ini dilindungi oleh middleware verifyToken

// GET semua barang milik user (dengan optional limit & offset)
router.get('/', verifyToken, ambilBarang);

// GET cari barang berdasarkan query string
router.get('/search', verifyToken, cariBarang);

// GET barang by ID untuk user yang login
router.get('/:id', verifyToken, ambilBarangId);

// POST tambah barang (bisa upload foto juga jika perlu)
router.post('/', verifyToken, upload.single('foto'), tambahBarang);

// PUT edit barang berdasarkan ID
router.put('/:id', verifyToken, upload.single('foto'), editBarang);

// DELETE hapus barang berdasarkan ID
router.delete('/:id', verifyToken, hapusBarang);

module.exports = router;
