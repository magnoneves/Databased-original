const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Importar o middleware CORS
const app = express();
app.use(express.urlencoded({ extended: true }));


const corsOptions = {
  origin: '*', // ou uma lista de origens permitidas
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
};
app.use(cors(corsOptions));

// Middleware para parsear JSON e lidar com CORS
app.use(express.json());
app.use(cors()); // Habilitar CORS para todas as origens

// Configuração do banco de dados
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Rota para inserção de dados
app.post('/insert', (req, res) => {
  const { email, senha } = req.body;

<<<<<<< HEAD
=======
  // Verificar se ambos email e senha estão presentes
>>>>>>> f2ea1050a2797c06c0b4f09e10dddcf0a679a96b
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email and senha are required' });
  }

  const query = 'INSERT INTO usuario (email, senha) VALUES (?, ?)';
  pool.query(query, [email, senha], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: results.insertId, email, senha });
  });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
