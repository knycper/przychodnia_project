const express = require('express');
const router = express.Router();
const checkJwt = require('../../authorization/auth');
const checkUser = require('../../authorization/checkUser');
const User = require('../../models/User');
const deleteKeycloakUser = require('../../keycloakUsers/deleteKeycloakUser');
const Appointment = require('../../models/Appointment');

router.use(checkJwt);
router.use(checkUser);

router.get('/info', async (req, res) => {
    try {
        const keycloakId = req.user.sub;

        console.log(keycloakId);

        const user = await User.findOne({ keycloakId });

        if (!user) {
            return res.status(404).json({ message: 'Użytkownik nie został znaleziony w bazie danych.' });
        }

        res.json({
            name: user.name,
            surname: user.surname,
            email: user.email,
            phoneNr: user.phoneNr,
        });
    } catch (error) {
        console.error('Błąd serwera przy pobieraniu danych użytkownika:', err);
        res.status(500).json({ message: 'Błąd serwera' });
    }
})

router.put('/update', async (req, res) => {
    try {
        const keycloakId = req.user.sub;
        const { name, surname, email, phoneNr } = req.body;

        const user = await User.findOne({ keycloakId });

        if (!user) {
            return res.status(404).json({ message: 'Użytkownik nie został znaleziony' });
        }

        if (name !== undefined) user.name = name;
        if (surname !== undefined) user.surname = surname;
        if (email !== undefined) user.email = email;
        if (phoneNr !== undefined) user.phoneNr = phoneNr;

        await user.save();

        res.status(200).json({ message: 'Dane użytkownika zostały zaktualizowane' });

    } catch (err) {
        console.error('Błąd przy aktualizacji danych użytkownika:', err);
        res.status(500).json({ message: 'Błąd serwera podczas aktualizacji' });
    }
});

router.delete('/delete', async (req, res) => {
    try {
        const keycloakId = req.user.sub;

        deleteKeycloakUser(keycloakId);

        const user = await User.findOne({ keycloakId });
        if (!user) {
            return res.status(404).json({ message: 'Użytkownik nie znaleziony.' });
        }

        await Appointment.deleteMany({ patient: user._id });

        await User.deleteOne({ _id: user._id });

        console.log("poprawnie usunieto z mongo");

        res.status(200).json({ message: 'Konto zostało usunięte.' });

    } catch (err) {
        console.error('Błąd podczas usuwania użytkownika:', err);
        res.status(500).json({ message: 'Błąd serwera przy usuwaniu konta.' });
    }
});

module.exports = router;