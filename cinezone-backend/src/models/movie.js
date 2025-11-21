const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./category');

const Movie = sequelize.define('Movie', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  director: { type: DataTypes.STRING },
  release_year: { type: DataTypes.INTEGER },
  rating: { type: DataTypes.DECIMAL(3,1) },
  category_id: { type: DataTypes.INTEGER, references: { model: Category, key: 'id' } }
}, { timestamps: false });

Movie.belongsTo(Category, { foreignKey: 'category_id' }); // Association un film appartient à une catégorie
Category.hasMany(Movie, { foreignKey: 'category_id' });// Association une catégorie a plusieurs films

module.exports = Movie;
