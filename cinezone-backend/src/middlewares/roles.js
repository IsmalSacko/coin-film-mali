// middleware qui vérifie que l'utilisateur connecté a un rôle autorisé

module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    // Si pas d'utilisateur dans req (pb d'auth)
    if (!req.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    // Si le rôle n'est pas autorisé
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès interdit : rôle insuffisant" });
    }

    next();
  };
};
