// app/app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const routes = require('./src/routes')

const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/profile', profileRoutes);

app.use(routes)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
