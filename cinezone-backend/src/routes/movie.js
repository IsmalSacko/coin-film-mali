const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');
const Category = require('../models/category');
const { Op } = require('sequelize');

// Middlewares
const requireRole = require('../middlewares/roles');
const authMiddleware = require('../middlewares/auth');

// -----------------------------
// GET /movies → liste films avec filtres, recherche, tri, pagination
// -----------------------------
router.get('/', async (req, res) => {
  try {
    let { min_rating, limit, page, search, sort, category } = req.query;

    const where = {};
    if (min_rating) where.rating = { [Op.gte]: parseFloat(min_rating) };
    if (category) where.category_id = parseInt(category, 10); // Filtrer par catégorie
    if (search) where.title = { [Op.like]: `%${search}%` };

    limit = limit ? parseInt(limit, 10) : 10;
    page = page ? parseInt(page, 10) : 1;
    const offset = (page - 1) * limit;

    const order = [];
    if (sort === 'rating_desc') order.push(['rating', 'DESC']);
    else if (sort === 'rating_asc') order.push(['rating', 'ASC']);
    else order.push(['release_year', 'DESC']);

    // Inclure Category pour chaque film
    const { count, rows } = await Movie.findAndCountAll({
      where,
      limit,
      offset,
      order,
      include: [
        {
          model: Category,
          attributes: ['id', 'name']
        }
      ]
    });

    res.json({ total: count, page, pageSize: limit, movies: rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------
// GET /movies/:id → détail film
// -----------------------------
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id, {
      include: { model: Category, attributes: ['id', 'name'] }
    });
    if (!movie) return res.status(404).json({ message: 'Film non trouvé' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------
// POST /movies → ajouter film
// -----------------------------
router.post('/', authMiddleware, requireRole('ARTIST', 'ADMIN'), async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------
// PUT /movies/:id → modifier film
// -----------------------------
router.put('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Film non trouvé' });
    await movie.update(req.body);
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------
// DELETE /movies/:id → supprimer film
// -----------------------------
router.delete('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Film non trouvé' });
    await movie.destroy();
    res.json({ message: 'Film supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
