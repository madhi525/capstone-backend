# capstone-backend

API ini menyediakan endpoint untuk **register**, **login** . Autentikasi dilakukan menggunakan **JWT** yang dikirim dalam bentuk **cookie** agar aman dan mendukung frontend/backend lintas domain.

---
## ⚙️ Untuk menggunakan ini di local

lakukan instalasi setelah pull

```
pnpm install
```

Lalu, jalankan developmen servernya:

```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

---

## 🔗 Base URL

Kalau Mau Pakai hubungi Developer

http://api.nurudhi.my.id/api/auth

---

## 🧾 Endpoints

### 📥 1. Register

**POST** `/register`

**Request Body:**
```
{
  "username" : "username:,
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```
{
  "message": "User registered"
}
```

---

### 🔐 2. Login

**POST** `/login`

**Request Body:**
```
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```
{
  "message": "Login Berhasil"
}
```

**Catatan:**
- Jika berhasil, JWT token akan otomatis dikirim sebagai HttpOnly Cookie.
- Token akan expired dalam 1 jam.

---

## ⚙️ Konfigurasi untuk Frontend (Cross-Origin)

### ✅ Pastikan frontend mengirim cookie

Gunakan fetch seperti ini:
```
fetch('http://api.nurudhi.my.id/api/auth/login', {
  method: 'POST',
  credentials: 'include', // <- kecuali untuk register
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
     email, 
     password 
    })
});
```

---

## 🛡️ Keamanan
- CORS diaktifkan dan disesuaikan agar bisa digunakan lintas domain.

---
## ⚠️⚠️ Apabila terjadi masalah **CORS** harap kontak Developer untuk mendaftarkan domain frontend mu 

## 📬 Kontak Developer
Jika ada masalah atau permintaan fitur tambahan silahkan langsung Hubungi.
