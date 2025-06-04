function checkDoctor(req, res, next) {
    const roles = req.user?.realm_access?.roles || [];

    if (roles.includes('doctor')) {
        next();
    } else {
        res.status(403).json({ message: 'Brak uprawnień lekarza!' });
    }
};

module.exports = checkDoctor;
