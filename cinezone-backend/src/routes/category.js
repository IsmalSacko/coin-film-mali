const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Movie = require('../models/movie');

// GET /categories → toutes les catégories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /categories/:id/movies → films d’une catégorie
router.get('/:id/movies', async (req, res) => {
  try {
    const movies = await Movie.findAll({ where: { category_id: req.params.id } });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /categories → créer une nouvelle catégorie
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Le nom est requis' });

    const [category, created] = await Category.findOrCreate({ where: { name } });
    if (!created) return res.status(400).json({ message: 'Catégorie déjà existante' });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
