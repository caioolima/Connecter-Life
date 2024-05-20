const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const express = require('express');


// Função para registrar usuário
exports.registerUser = async (req, res) => {
  try {
    const { username, email, phone, password, confirmPassword, firstName, lastName, dob, gender } = req.body;

    // Verifica se o usuário, email ou telefone já existem no banco
    const existingUser = await User.findOne({ $or: [{ username }, { email }, { phone }] });

    if (existingUser) {
      const errors = {};

      if (existingUser.username === username) {
        errors.username = 'Nome de usuário já em uso.';
      }

      if (existingUser.email === email) {
        errors.email = 'Endereço de email já em uso.';
      }

      if (existingUser.phone === phone) {
        errors.phone = 'Número de telefone já em uso.';
      }

      return res.status(400).json({ success: false, errors, message: 'Falha ao registrar usuário.' });
    }

    // Verifica se a senha e a confirmação de senha coincidem
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'As senhas não coincidem.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      email,
      phone,
      firstName,
      lastName,
      dob,
      gender,
      biography: '' // Você pode inicializar a biografia como uma string vazia
    });
    

    await user.save();

    // Alteração na resposta do backend
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Erro interno ao registrar usuário.' });
  }
};


// Função para fazer login
exports.loginUser = async (req, res) => {
  try {
      const { email, password } = req.body;

      // Verifica se o email e a senha foram fornecidos
      if (!email || !password) {
          return res.status(400).json({ error: 'Email e senha são campos obrigatórios.' });
      }

      // Verifica se o usuário existe com o email fornecido
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(401).json({ error: 'Credenciais inválidas. Email não encontrado.' });
      }

      // Verifica se a senha é correta
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
          return res.status(401).json({ error: 'Credenciais inválidas. Senha incorreta.' });
      }

      // Gera o token de autenticação
      const token = jwt.sign({ userId: user._id }, 'seuSegredoDoToken');

      res.status(200).json({ token, userId: user._id,  });
  } catch (error) {
      console.error('Erro durante o login:', error);
      res.status(500).json({ error: 'Erro interno ao fazer login. Tente novamente mais tarde.' });
  }
};

exports.checkFieldAvailability = async (req, res) => {
  try {
    const { fieldName, value } = req.body;

    // Define os campos que requerem verificação de disponibilidade
    const fieldsToCheck = ['username', 'email', 'phone'];

    // Verifica se o campo fornecido requer verificação
    if (!fieldsToCheck.includes(fieldName)) {
      return res.status(400).json({ error: 'Campo não suportado para verificação de disponibilidade.' });
    }

    // Constrói a consulta do usuário ignorando a diferença entre maiúsculas e minúsculas
    const caseInsensitiveQuery = new RegExp(`^${value}$`, 'i');

    // Verifica se já existe um usuário com o valor fornecido no campo específico (ignorando maiúsculas e minúsculas)
    const existingUser = await User.findOne({ [fieldName]: caseInsensitiveQuery });

    // Retorna se o campo está disponível ou não
    res.json({ available: !existingUser });
  } catch (error) {
    console.error(`Erro ao verificar a disponibilidade de ${fieldName}:`, error);
    res.status(500).json({ available: false }); // Em caso de erro, considerar como não disponível
  }
};


// Função para buscar e retornar o nome de usuário pelo ID
exports.getUsernameById = async (req, res) => {
  const { userId } = req.params; // Obtém o userId dos parâmetros da solicitação

  try {
    // Busca o usuário no banco de dados pelo ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Retorna o nome de usuário
    res.json({ username: user.username });
  } catch (error) {
    console.error('Erro ao buscar nome de usuário:', error);
    res.status(500).json({ error: 'Erro interno ao buscar nome de usuário.' });
  }
};