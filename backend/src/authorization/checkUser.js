function checkUser(req, res, next) {
    const roles = req.user?.realm_access?.roles || [];

    if (roles.includes('user')) {
        next();
    } else {
        res.status(403).json({ message: 'Brak uprawnień użytkownika!' });
    }
};

module.exports = checkUser;
