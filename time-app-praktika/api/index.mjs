import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const port = 5555;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
});

app.use(cors());
app.use(express.json());

app.get('/times', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM times ORDER BY id DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/times', async (req, res) => {
    const { time } = req.body;
    if (!time) return res.status(400).json({ error: 'Missing time' });
    try {
        const [result] = await pool.query('INSERT INTO times (time) VALUES (?)', [time]);
        res.json({ insertId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/time/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM times WHERE id = ?', [id]);
        res.json({ affectedRows: result.affectedRows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`API запущен на порту ${port}`);
});