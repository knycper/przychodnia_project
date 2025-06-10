const createKeycloakDoctor = require('../../keycloakUsers/createKeycloakDoctor');
const express = require('express');
const router = express.Router();
const checkJwt = require('../../authorization/auth');
const checkAdmin = require('../../authorization/checkAdmin');
const Doctor = require('../../models/Doctor');
const Appointment = require('../../models/Appointment');
const deleteKeycloakDoctor = require('../../keycloakUsers/deleteKeycloakUser');

router.use(checkJwt);
router.use(checkAdmin);

// POST /admin/doctors
router.post('/', async (req, res) => {
    try {
        const { name, surname, specialization, email, phoneNr } = req.body;

        const username = name.slice(0, 2) + surname.slice(0, 2) + phoneNr.slice(0, 3)

        const keycloakId = await createKeycloakDoctor(name, surname, username, email)
        console.log(keycloakId, "id z keycloaka")

        const newDoctor = new Doctor({
            keycloakId,
            name,
            surname,
            specialization,
            email,
            phoneNr,
        });

        await newDoctor.save();

        console.log("dodano poprawnie w mongo")

        res.status(201).json({ message: 'Lekarz dodany!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Błąd serwera przy dodawaniu lekarza' });
    }
});

// GET /admin/doctors/search?name=Jan&surname=Kowalski
router.get('/search', checkJwt, checkAdmin, async (req, res) => {
    const { name, surname } = req.query;
    const filter = {};

    if (name) filter.name = { $regex: new RegExp(name, 'i') };
    if (surname) filter.surname = { $regex: new RegExp(surname, 'i') };

    try {
        const doctors = await Doctor.find(filter);
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: 'Błąd serwera przy wyszukiwaniu lekarzy' });
    }
});


router.put('/:id', checkJwt, checkAdmin, async (req, res) => {
    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDoctor) return res.status(404).json({ message: "Lekarz nie znaleziony" });
        res.json({ message: "Dane lekarza zaktualizowane!", doctor: updatedDoctor });
    } catch (error) {
        console.error("Błąd podczas aktualizacji lekarza:", error);
        res.status(500).json({ message: 'Błąd serwera przy aktualizacji' });
    }
});

// DELETE /admin/doctors/:id
router.delete('/:id', checkJwt, checkAdmin, async (req, res) => {
    try {
        await Appointment.deleteMany({ doctor: req.params.id });
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Lekarz nie został znaleziony.' });
        }
        deleteKeycloakDoctor(doctor.keycloakId);
        res.json({ message: 'Lekarz został usunięty.' });
    } catch (err) {
        console.error("Błąd usuwania lekarza:", err);
        res.status(500).json({ message: 'Błąd serwera.' });
    }
});


module.exports = router;
