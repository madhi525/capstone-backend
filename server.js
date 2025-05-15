const express = require('express');
const app = express();
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoute');
const barangRoutes = require('./routes/barangRoute');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();
app.use(cors({
    origin: 'https://frontend-capstone-orcin.vercel.app',
    credentials: true
}));

// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/barang', barangRoutes);
app.use('/loss', (req, res) => {
    res.json({message: 'akses berhasil'})
});

const PORT = process.env.PORT;
const IP_SERVER = process.env.IP_SERVER
app.listen(PORT,  IP_SERVER,() => console.log(`Server running on port ${PORT}`));