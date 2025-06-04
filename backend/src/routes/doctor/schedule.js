const express = require('express');
const router = express.Router();
const Doctor = require('../../models/Doctor');
const checkJwt = require('../../authorization/tryCheckJwt');
const checkDoctor = require('../../authorization/checkDoctor');

router.use(checkJwt);
router.use(checkDoctor);

// GET /doctor/schedule — pobierz grafik zalogowanego lekarza
router.get('/', async (req, res) => {
    try {
        const keycloakId = req.user.sub;

        const doctor = await Doctor.findOne({ keycloakId });
        if (!doctor) return res.status(404).json({ error: 'Nie znaleziono lekarza' });

        res.json(doctor.schedule || {});
    } catch (err) {
        console.error('Błąd pobierania grafiku:', err);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

// POST /doctor/schedule — zaktualizuj grafik
router.post('/', async (req, res) => {
    try {
        const keycloakId = req.user.sub;
        const newSchedule = req.body;

        const doctor = await Doctor.findOne({ keycloakId });
        if (!doctor) return res.status(404).json({ error: 'Nie znaleziono lekarza' });

        doctor.schedule = newSchedule;
        await doctor.save();

        res.json({ message: 'Grafik został zapisany.' });
    } catch (err) {
        console.error('Błąd zapisu grafiku:', err);
        res.status(500).json({ error: 'Błąd serwera przy zapisie grafiku' });
    }
});

module.exports = router;
