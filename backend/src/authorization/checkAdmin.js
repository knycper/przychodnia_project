// checkAdmin.js
function checkAdmin(req, res, next) {
    const roles = req.user?.realm_access?.roles || [];

    if (roles.includes('admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Brak uprawnień administratora' });
    }
};

module.exports = checkAdmin;
