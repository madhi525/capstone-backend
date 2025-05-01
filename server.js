const express = require('express');
const app = express();
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoute');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();
// app.use(cors({
//     origin: '',
//     credentials: true
// }));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/loss', (req, res) => {
    res.json({message: 'akses berhasil'})
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
