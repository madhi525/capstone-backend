const validator = require('validator');
const sanitizeHtml = require('sanitize-html');
const {
    ambilSemuaBarangUser,
    tambahBarang,
    restock,
    editBarang,
    hapusBarang,
    reduce,
    cariBarang,
    salahInputMasuk,
    salahInputKeluar,
    ambilBarangById
} = require('../models/itemModel');

exports.ambilBarang = async (req, res) => {
    try {
        const userId = req.user.id;
        const limitParam = req.query.limit;

        let limit, offset;

        if (limitParam === 'all') {
            limit = null;
            offset = null;
        } else {
            limit = parseInt(limitParam) || 10;
            const page = parseInt(req.query.page) || 1;
            offset = (page - 1) * limit;
        }

        const { count, rows } = await ambilSemuaBarangUser(userId, limit, offset);

        if (count === 0) {
            return res.status(404).json({ 
                message: 'User tidak memiliki barang',
                status: 'fail',
                data: {}
                
            });
        }

        const responseData = {
            totalBarang: count,
            data: rows
        };

        if (limit !== null) {
            responseData.totalHalaman = Math.ceil(count / limit);
            responseData.halamanSekarang = parseInt(req.query.page) || 1;
        }

        return res.status(200).json({
            message: 'Barang ditemukan',
            status: 'success',
            data: responseData
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Gagal mengambil barang',
            status: 'error',
            data: { error: error.message }
        });
    }
};

exports.tambahBarang = async (req, res) => {
    try {
        const id_user = req.params.id;
        const { nama, kategori, satuan, stock } = req.body;

        if (!nama || !stock || !kategori || validator.isEmpty(nama) || validator.isEmpty(stock.toString()) || validator.isEmpty(kategori)) {
            return res.status(400).json({
                message: 'Semua field harus diisi',
                status: 'fail',
                data: {}
            });
        }

        const data = {
            id_user,
            nama_produk: sanitizeHtml(nama),
            kategori: sanitizeHtml(kategori),
            satuan: sanitizeHtml(satuan),
            stock: parseInt(sanitizeHtml(stock.toString())),
            foto: req.file?.filename || null,
        };

        const result = await tambahBarang(data);
        return res.status(201).json({
            message: 'Barang berhasil ditambahkan',
            status: 'success',
            data: result
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Gagal menambahkan barang',
            status: 'error',
            data: { error: error.message }
        });
    }
};

exports.restockBarang = async (req, res) => {
    try {
        const id_user = req.params.id;
        const { id_produk, jumlah, tanggal_expired, keterangan } = req.body;

        if (!id_produk || !jumlah) {
            return res.status(400).json({ 
                message: 'Masukkan produk dan jumlah!',
                status: 'fail',
                data: {}
            });
        }

        const data = {
            id_produk,
            id_user,
            tanggal_masuk: new Date(),
            jumlah: parseInt(sanitizeHtml(jumlah.toString())),
            keterangan: sanitizeHtml(keterangan || '')
        };

        if (tanggal_expired) {
            if (!validator.isDate(tanggal_expired)) {
                return res.status(400).json({ 
                    message: 'Format tanggal tidak valid (YYYY-MM-DD)',
                    status: 'fail',
                    data: {}
                });
            }
            data.tanggal_expired = tanggal_expired;
        }

        const result = await restock(data);
        res.status(201).json({ 
            message: 'Barang berhasil ditambahkan', 
            status: 'success',
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Gagal menambahkan barang', 
            status: 'error',
            data: { error: error.message }
        });
    }
};

exports.editBarang = async (req, res) => {
    try {
        const id_produk = req.params.id;
        const { nama, kategori, satuan, stock } = req.body;

        const existing = await ambilBarangById(id_produk);

        if (!existing) {
            return res.status(404).json({ 
                message: 'Barang tidak ditemukan' ,
                status: 'fail',
                data: {}
            });
        }

        const data = {};
        if (nama) data.nama_produk = sanitizeHtml(nama);
        if (kategori) data.kategori = sanitizeHtml(kategori);
        if (satuan) data.satuan = sanitizeHtml(satuan);
        if (stock) data.stock = parseInt(sanitizeHtml(stock.toString()));
        if (req.file) data.foto = req.file.filename;

        await editBarang(id_produk, data);

        res.status(200).json({ message: 'Barang berhasil diperbarui' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal memperbarui barang', error: error.message });
    }
};

exports.hapusBarang = async (req, res) => {
    try {
        const id_produk = req.params.id;

        const existing = await ambilBarangById(id_produk);
        if (!existing) {
            return res.status(404).json({ message: 'Barang tidak ditemukan' });
        }

        await hapusBarang(id_produk);
        res.status(200).json({ message: 'Barang berhasil dihapus' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menghapus barang', error: error.message });
    }
};

exports.cariBarang = async (req, res) => {
    try {
        const filters = {
            nama_produk: sanitizeHtml(req.query.nama || ''),
            kategori: sanitizeHtml(req.query.kategori || '')
        };

        const results = await cariBarang(filters);
        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'Barang tidak ditemukan' });
        }

        res.status(200).json({ message: 'Barang ditemukan', results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mencari barang', error: error.message });
    }
};

exports.reduceBarang = async (req, res) => {
    try {
        const id_user = req.params.id;
        const { id_produk, jumlah, keterangan } = req.body;

        if (!id_produk || !jumlah) {
            return res.status(400).json({ message: 'Masukkan produk dan jumlah!' });
        }

        const sisa = await ambilBarangById(id_produk);
        if (!sisa || sisa.stock < jumlah) {
            return res.status(400).json({ message: 'Sisa stok kurang dari jumlah' });
        }

        const data = {
            id_produk,
            id_user,
            tanggal_keluar: new Date(),
            jumlah: parseInt(sanitizeHtml(jumlah.toString())),
            keterangan: sanitizeHtml(keterangan || '')
        };

        const result = await reduce(data);
        res.status(201).json({ message: 'Barang berhasil dikurangi', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengurangi barang', error: error.message });
    }
};

exports.ambilBarangId = async (req, res) => {
  try {
      const id_produk = req.params.id;
      
      const result = await ambilBarangById(id_produk);
        if (!result) {
            return res.status(404).json({
                message: 'Barang tidak ditemukan',
                status: 'fail',
                data: {}
            });
        }
      
        return res.status(200).json({
            message: 'Barang ditemukan',
            status: 'success',
            data: result
        });
  } catch (error) {
      console.error(error);
        return res.status(500).json({
            message: 'Gagal mengambil barang',
            status: 'error',
            data: { error: error.message }
        });
  }
};


