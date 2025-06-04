const express = require('express');
const router = express.Router();
const createKeycloakUser = require('../../keycloakUsers/createKeycloakUser');
const User = require('../../models/User');

router.post("/", async (req, res) => {
    try {
        const { name, surname, email, phoneNr, password } = req.body;

        if (!name || !surname || !email || !phoneNr || !password) {
            return res.status(400).json({ message: "Brakuje wymaganych danych." });
        }

        const username = name.slice(0, 2) + surname.slice(0, 2) + phoneNr.slice(0, 3)

        const keycloakId = await createKeycloakUser(name, surname, username, email, password);

        const newUser = new User({
            keycloakId,
            name,
            surname,
            email,
            phoneNr
        });

        await newUser.save();

        console.log("poprawnie dodano do mongo")

        res.status(201).json({ message: "Poprawnie stworzono uzytkownika!" })
    } catch (error) {
        res.status(500).json({ message: "Błąd serwera przy dodawaniu użytkownika" })
    }

})

module.exports = router;