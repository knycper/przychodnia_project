const express = require('express');
const router = express.Router();
const Appointment = require('../../models/Appointment');
const Doctor = require('../../models/Doctor');
const checkDoctor = require('../../authorization/checkDoctor');
const checkJwt = require('../../authorization/tryCheckJwt');

router.use(checkJwt);
router.use(checkDoctor);

router.get('/', async (req, res) => {
    try {
        const keycloakId = req.user.sub
        const { date } = req.query;
        console.log(date)

        if (!date) {
            return res.status(400).json({ error: 'Brak daty w zapytaniu' });
        }

        const doctor = await Doctor.findOne({ keycloakId });
        if (!doctor) {
            return res.status(404).json({ error: 'Nie znaleziono lekarza' });
        }

        const appointments = await Appointment.find({
            doctor: doctor._id,
            date
        }).populate('patient', 'name surname email');

        res.json(appointments);
    } catch (err) {
        console.error('Błąd pobierania wizyt:', err);
        res.status(500).json({ error: 'Wystąpił błąd serwera' });
    }
});

module.exports = router;

