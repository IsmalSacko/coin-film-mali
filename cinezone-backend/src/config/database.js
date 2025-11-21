const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mariadb',
    logging: false,
    dialectOptions: {
      allowPublicKeyRetrieval: true
    }
  }
);

async function testDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base cineZone réussie !');
  } catch (error) {
    console.error('❌ Impossible de se connecter à la DB :', error);
  }
}

testDB();

module.exports = sequelize;
