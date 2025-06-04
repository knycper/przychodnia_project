const express = require('express');
const router = express.Router();
const Appointment = require('../../models/Appointment');
const Doctor = require('../../models/Doctor');
const User = require('../../models/User');
const tryCheckJwt = require('../../authorization/tryCheckJwt');
const checkJwt = require('../../authorization/auth');
const checkUser = require('../../authorization/checkUser');

router.get('/doc/:id', tryCheckJwt, async (req, res) => {
    const doctorId = req.params.id;

    try {
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({ message: 'Lekarz nie został znaleziony.' });
        }

        res.json(doctor);
    } catch (err) {
        console.error("Błąd pobierania lekarza:", err);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

router.post('/', checkJwt, checkUser, async (req, res) => {
    try {
        const { doctorId, date, time } = req.body;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Nie znaleziono lekarza" });
        }

        const keycloakId = req.user.sub;
        const user = await User.findOne({ keycloakId });
        if (!user) {
            return res.status(404).json({ message: "Nie znaleziono użytkownika" });
        }

        const appointment = new Appointment({
            doctor: doctor._id,
            patient: user._id,
            date,
            time,
            status: "confirmed",
        });

        await appointment.save();

        return res.status(201).json({ message: "Wizyta została zaplanowana." });
    } catch (error) {
        console.error("Błąd przy tworzeniu wizyty:", error);
        res.status(500).json({ message: "Błąd serwera w trakcie tworzenia wizyty" });
    }
});


module.exports = router;
