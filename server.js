// JavaScript source code
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '095023',
    database: 'medical_center'
});

db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к БД:', err.message);
        return;
    }
    console.log('Подключение к MySQL успешно');
});

app.get('/', (req, res) => {
    res.json({ message: 'API works' });
});

// GET - получить всех пациентов
app.get('/patients', (req, res) => {
    db.query('SELECT * FROM patients', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// POST - добавить пациента
app.post('/patients', (req, res) => {
    const { first_name, last_name, birth_date, phone } = req.body;

    db.query(
        'INSERT INTO patients (first_name, last_name, birth_date, phone) VALUES (?, ?, ?, ?)',
        [first_name, last_name, birth_date, phone],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Patient added', id: results.insertId });
        }
    );
});

// PUT - обновить пациента
app.put('/patients/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, birth_date, phone } = req.body;

    db.query(
        'UPDATE patients SET first_name=?, last_name=?, birth_date=?, phone=? WHERE patient_id=?',
        [first_name, last_name, birth_date, phone, id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Patient updated' });
        }
    );
});

// DELETE - удалить пациента
app.delete('/patients/:id', (req, res) => {
    const { id } = req.params;

    db.query(
        'DELETE FROM patients WHERE patient_id=?',
        [id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Patient deleted' });
        }
    );
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
