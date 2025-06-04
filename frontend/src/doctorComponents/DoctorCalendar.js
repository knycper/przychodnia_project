import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import './css/DoctorCalendar.css';
import { toast } from 'react-toastify';

const DoctorCalendar = ({ keycloak }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetchAppointments(selectedDate);
    }, [selectedDate]);

    const fetchAppointments = async (date) => {
        const isoDate = date.toISOString().split('T')[0];
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/doctor/appointments`, {
                params: { date: isoDate },
                headers: {
                    Authorization: `Bearer ${keycloak.token}`
                }
            });
            setAppointments(res.data);
        } catch (err) {
            console.error("Błąd pobierania wizyt:", err);
            toast.error(err.error);
        }
    };

    return (
        <div className="doctor-dashboard">
            <h2>Panel lekarza</h2>
            <div className="calendar-appointments-wrapper">
                <div className="calendar-section">
                    <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                    />
                </div>

                <div className="appointments-section">
                    <h3>Wizyty na {selectedDate.toLocaleDateString()}</h3>
                    {appointments.length > 0 ? (
                        <ul className="appointments-list">
                            {appointments.map((appt) => (
                                <li key={appt._id}>
                                    <strong>{appt.time}</strong> - {appt.patient?.name} {appt.patient?.surname} ({appt.status})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Brak wizyt w tym dniu.</p>
                    )}
                </div>
            </div>
        </div>
    );

};

export default DoctorCalendar;
