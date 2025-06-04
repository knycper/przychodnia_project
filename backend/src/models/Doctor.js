const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    keycloakId: String,
    name: String,
    surname: String,
    specialization: String,
    email: String,
    phoneNr: String,
    visible: {
        type: Boolean,
        default: true,
    },
    schedule: {
        monday: [String],
        tuesday: [String],
        wednesday: [String],
        thursday: [String],
        friday: [String],
        saturday: [String],
        sunday: [String]
    }
});

module.exports = mongoose.model('Doctor', doctorSchema);
