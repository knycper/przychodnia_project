const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment')
const tryCheckJwt = require('./authorization/tryCheckJwt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.BACKEND_PORT;

// MongoDB
const MONGO_URI = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}?authSource=admin`;
mongoose.connect(MONGO_URI).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

// Trasy użytkownika
// const userRoutes = require('./routes/user/profile');
// app.use('/user', userRoutes);
const userAppointment = require('./routes/user/appointment');
app.use('/user/appointment', userAppointment);
const userRegister = require('./routes/user/register');
app.use('/user/register', userRegister);
const userInfo = require('./routes/user/profile');
app.use('/user', userInfo);
const appointmentList = require('./routes/user/appointmentList');
app.use('/appointment', appointmentList);

// Trasy doktora
const doctorAppointments = require('./routes/doctor/appointments');
app.use('/doctor/appointments', doctorAppointments);
const doctorSchedule = require('./routes/doctor/schedule');
app.use('/doctor/schedule', doctorSchedule);

// Trasy administratora
const adminDoctorRoutes = require('./routes/admin/doctors');
app.use('/admin/doctors', adminDoctorRoutes);

// Test (z JWT)
app.get('/test', tryCheckJwt, (req, res) => {
    res.json({ message: 'Dostęp chroniony JWT działa!' });
});

app.get('/doctorsList', tryCheckJwt, async (req, res) => {
    try {
        const roles = req.user?.realm_access?.roles || [];

        if (roles.includes('admin')) {
            // admin widzi wszystko
            const doctors = await Doctor.find();
            return res.json(doctors);
        } else {
            // Zwykły użytkownik widzi tylko wybrane dane i tylko widocznych lekarzy
            const doctors = await Doctor.find(
                { visible: true },
                'name surname email specialization'
            );
            console.log(doctors)
            return res.json(doctors);
        }

    } catch (error) {
        console.error("Błąd pobierania lekarzy:", error);
        res.status(500).json({ message: 'Błąd serwera przy pobieraniu lekarzy' });
    }
});

const getWeekday = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
};

app.get('/available', async (req, res) => {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
        return res.status(400).json({ error: 'Wymagane: doctorId i date (YYYY-MM-DD)' });
    }

    try {
        // Pobierz lekarza i jego grafik
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return res.status(404).json({ error: 'Lekarz nie znaleziony' });

        const weekday = getWeekday(date); // np. "monday"
        const workingHours = doctor.schedule[weekday] || [];

        // Pobierz zajęte godziny z tej daty
        const appointments = await Appointment.find({
            doctor: doctorId,
            date
        });

        const takenHours = appointments.map(appt => appt.time);

        // Filtruj dostępne godziny
        const availableHours = workingHours.filter(hour => !takenHours.includes(hour));

        res.json({ availableHours });
    } catch (err) {
        console.error("Błąd backendu (available hours):", err);
        res.status(500).json({ error: 'Wystąpił błąd serwera' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
