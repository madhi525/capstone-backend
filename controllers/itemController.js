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
        const userId = req.params.id;
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const { count, rows } = await ambilSemuaBarangUser(userId, limit, offset);

        if (count === 0) {
            return res.status(404).json({ message: 'User tidak memiliki barang' });
        }

        return res.status(200).json({
            message: 'Barang ditemukan',
            totalBarang: count,
            totalHalaman: Math.ceil(count / limit),
            halamanSekarang: page,
            barang: rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengambil barang' });
    }
};

exports.tambahBarang = async (req, res) => {
    try {
        const id_user = req.params.id;
        const { nama, kategori, satuan, stock } = req.body;

        if (!nama || !stock || !kategori || validator.isEmpty(nama) || validator.isEmpty(stock.toString()) || validator.isEmpty(kategori)) {
            return res.status(400).json({ message: 'Mohon isi Nama, Stock, dan Kategori' });
        }

        const data = {
            id_user,
            nama_produk: sanitize(nama),
            kategori: sanitize(kategori),
            satuan: sanitize(satuan),
            stock: parseInt(sanitize(stock.toString())),
            foto: req.file?.filename || null,
        };

        const result = await tambahBarang(data);
        res.status(201).json({ message: 'Barang berhasil ditambahkan', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menambahkan barang', error: error.message });
    }
};

exports.restockBarang = async (req, res) => {
    try {
        const id_user = req.params.id;
        const { id_produk, jumlah, tanggal_expired, keterangan } = req.body;

        if (!id_produk || !jumlah) {
            return res.status(400).json({ message: 'Masukkan produk dan jumlah!' });
        }

        const data = {
            id_produk,
            id_user,
            tanggal_masuk: new Date(),
            jumlah: parseInt(sanitize(jumlah.toString())),
            keterangan: sanitize(keterangan || '')
        };

        if (tanggal_expired) {
            if (!validator.isDate(tanggal_expired)) {
                return res.status(400).json({ message: 'Format tanggal tidak valid (YYYY-MM-DD)' });
            }
            data.tanggal_expired = tanggal_expired;
        }

        const result = await restock(data);
        res.status(201).json({ message: 'Barang berhasil ditambahkan', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menambahkan barang', error: error.message });
    }
};

exports.editBarang = async (req, res) => {
    try {
        const id_produk = req.params.id;
        const { nama, kategori, satuan, stock } = req.body;

        const existing = await ambilBarangById(id_produk);
        if (!existing) {
            return res.status(404).json({ message: 'Barang tidak ditemukan' });
        }

        const data = {};
        if (nama) data.nama_produk = sanitize(nama);
        if (kategori) data.kategori = sanitize(kategori);
        if (satuan) data.satuan = sanitize(satuan);
        if (stock) data.stock = parseInt(sanitize(stock.toString()));
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
            nama_produk: sanitize(req.query.nama || ''),
            kategori: sanitize(req.query.kategori || '')
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

exports.reduce = async (req, res) => {
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
            jumlah: parseInt(sanitize(jumlah.toString())),
            keterangan: sanitize(keterangan || '')
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
      
      const result = await ambilBarangId(id_produk);
      if (!result || result.length === 0){
          return res.status(404).json({message : 'Barang Tidak ditemukan'});
      }
      
      res.status(200).json({message : 'Barang ditemukan', result});
  } catch (error) {
      console.error(error);
      res.status(500).json({message: 'Gagal mencari barang', error : error.message});
  }
};


