const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    keycloakId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNr: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
