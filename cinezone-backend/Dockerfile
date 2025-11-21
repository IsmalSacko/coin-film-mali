# Dockerfile pour backend Node.js
FROM node:20

# Crée le dossier de travail dans le container
WORKDIR /usr/src/app

# Copie package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le code
COPY . .

# Expose le port utilisé par ton app
EXPOSE 3000

# Commande pour lancer ton app
CMD ["npm", "run", "dev"]
