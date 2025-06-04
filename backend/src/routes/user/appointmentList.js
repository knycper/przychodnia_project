const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Appointment = require('../../models/Appointment');
const checkJwt = require('../../authorization/auth');
const checkUser = require('../../authorization/checkUser');

router.use(checkJwt);
router.use(checkUser);

router.get('/list', async (req, res) => {
    try {
        const keycloakId = req.user.sub;

        // Znajdź użytkownika w bazie
        const user = await User.findOne({ keycloakId });

        if (!user) {
            return res.status(404).json({ message: 'Użytkownik nie znaleziony w bazie.' });
        }

        const appointments = await Appointment.find({ patient: user._id })
            .populate('doctor', 'name surname specialization')
            .sort({ date: 1, time: 1 });

        // Zmapuj dane do prostszego formatu dla frontendu
        const result = appointments.map(appt => ({
            _id: appt._id,
            date: appt.date,
            time: appt.time,
            status: appt.status,
            doctorName: `${appt.doctor.name} ${appt.doctor.surname}`,
            specialization: appt.doctor.specialization,
        }));

        res.status(200).json(result);
    } catch (err) {
        console.error('Błąd przy pobieraniu spotkań:', err);
        res.status(500).json({ message: 'Błąd serwera przy pobieraniu spotkań.' });
    }
});

module.exports = router;