const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movie');
const categoryRoutes = require('./routes/category');

const User = require('./models/user');
const Category = require('./models/category');
const Movie = require('./models/movie');

const app = express();
app.use(express.json());
// Autoriser Angular (localhost:4200)
app.use(cors({
  origin: 'http://localhost:4200',
}));
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/categories', categoryRoutes);



app.get('/', async (req, res) => {
  const movies = await Movie.findAll();
  const html = `
    <html>
      <body>
        <h1>Liste des films</h1>
        <ol>
          ${movies.map(movie => `<li>${movie.title}</li>`).join('')}
        </ol>
      </body>
    </html>
  `;
  res.send(html);
});


const PORT = process.env.PORT || 3000;

// Synchronisation Sequelize : crée les tables si elles n'existent pas
//sequelize.sync({ alter: true }) // <-- modifié ici 
sequelize.sync()

  .then(() => {
    console.log('✅ Tables synchronisées avec succès');
    app.listen(PORT, () => console.log(`🚀 Backend CineZone démarré sur le port ${PORT}`));
  })
  .catch(err => console.error('❌ Erreur Sequelize :', err));
