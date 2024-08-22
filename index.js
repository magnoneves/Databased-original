const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Importar o middleware CORS
const app = express();

// Configuração do CORS
const corsOptions = {
  origin: '*', // Permitir todas as origens; ajuste para um domínio específico em produção
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
};
app.use(cors(corsOptions));

// Middleware para parsear JSON e dados do formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Rota para inserção de dados com verificação
app.post('/cadastro', (req, res) => {
  const { email, senha } = req.body;

  // Verificar se ambos email e senha estão presentes
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email and senha are required' });
  }

  // Primeiro, verificar se o usuário já existe
  const checkQuery = 'SELECT * FROM usuario WHERE email = ? AND senha = ?';
  pool.query(checkQuery, [email, senha], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Se o usuário já existir, retornar uma mensagem de erro
    if (results.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Se o usuário não existir, inserir o novo usuário
    const insertQuery = 'INSERT INTO usuario (email, senha) VALUES (?, ?)';
    pool.query(insertQuery, [email, senha], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: results.insertId, email, senha });
    });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
