const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Database configuration
const dbConfig = {
  server: 'homework.mssql.somee.com',
  user: 'sonlong_SQLLogin_1',
  password: '123456789',
  database: 'homework',
  options: {
    encrypt: true, // For Microsoft Azure
    trustServerCertificate: true, // Accept self-signed certificates
  },
};

// GET endpoint
app.get('/api/users', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('select * from Users');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// POST endpoint
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input('name', sql.NVarChar(50), name)
      .input('email', sql.NVarChar(100), email)
      .query('INSERT INTO Users (name, email) VALUES (@name, @email)');
    
    res.status(201).send('User added successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});