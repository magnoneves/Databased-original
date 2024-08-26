const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Importar o middleware CORS
const app = express();

// Configuração do CORS
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.post('/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;

  if (!email || !senha || !nome) {
    return res.status(400).json({ error: 'email, nome e senha sao necessarios' });
  }
  const checkQuery = 'SELECT * FROM usuario WHERE email = ?';
  pool.query(checkQuery, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: 'Usuario ja existe' });
    }

    const insertQuery = 'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)';
    pool.query(insertQuery, [nome, email, senha], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'cadastro bem sucedido' });
    });
  });
});

app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  
  if (!email || !senha) {
    return res.status(400).json({ error: 'email e senha sao necessarios' });
  }
  const slct = 'SELECT * FROM usuario WHERE email = ? AND senha = ?';
  pool.query(slct, [email, senha], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      const user = results[0];

      return res.json({ message: 'login bem sucedido', nome: user.nome });
    }
    
    return res.status(400).json({ error: 'usuario não existente' });
  });
});

app.get('/main', (req, res) => {
  const nome = req.query.nome;
  
  if (!nome) {
    return res.status(400).json({ error: 'nome é necessário' });
  }

  res.json({ nome: nome });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
