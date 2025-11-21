const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middlewares/auth');

require('dotenv').config();

// Inscription
// Regex mot de passe fort : min 8 caractères, majuscule, minuscule, chiffre et caractère spécial
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation champs
    if (!username || username.length < 3) 
      return res.status(400).json({ message: 'Le username doit faire au moins 3 caractères' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) 
      return res.status(400).json({ message: 'Email invalide' });

    if (!passwordRegex.test(password))
      return res.status(400).json({ message: 'Mot de passe trop faible (8 caractères, majuscule, minuscule, chiffre, caractère spécial)' });

    // Vérification si utilisateur existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email déjà utilisé' });

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création utilisateur
    const user = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ message: 'Utilisateur créé', user: { id: user.id, username, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier utilisateur
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

    // Vérifier mot de passe
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

    // Générer JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Connecté', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Récupérer profil utilisateur connecté
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ['id', 'username', 'email', 'role'] });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Modifier profil utilisateur connecté
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await User.findByPk(req.user.id);

    if (username && username.length >= 3) user.username = username;
    else if (username) return res.status(400).json({ message: 'Le username doit faire au moins 3 caractères' });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple validation email
    if (email && emailRegex.test(email)) user.email = email;
    else if (email) return res.status(400).json({ message: 'Email invalide' });
    if (password) {
      if (!passwordRegex.test(password))
        return res.status(400).json({ message: 'Mot de passe trop faible (8 caractères, majuscule, minuscule, chiffre, caractère spécial)' });
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: 'Profil mis à jour', user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Logout (côté client, supprimer le token)
router.post('/logout', authMiddleware, (req, res) => {
  // Le logout se gère côté client en supprimant le token
  res.json({ message: 'Déconnecté' });

  
});

module.exports = router;
