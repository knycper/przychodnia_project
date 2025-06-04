import { useEffect, useState } from 'react';
import axios from 'axios';
import './css/AppointmentList.css';

const AppointmentList = ({ keycloak }) => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/appointment/list`, {
            headers: {
                Authorization: `Bearer ${keycloak.keycloak.token}`
            }
        })
            .then(res => setAppointments(res.data))
            .catch(err => console.error('Błąd pobierania spotkań:', err));
    }, []);

    return (
        <div className="info-box">
            <h3>Zaplanowane spotkania</h3>
            {appointments.length > 0 ? (
                <ul>
                    {appointments.map(appt => (
                        <li key={appt._id}>
                            {appt.date} {appt.time} - {appt.doctorName} ({appt.specialization}) {appt.ttime}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Brak zaplanowanych spotkań.</p>
            )}
        </div>
    );
};

export default AppointmentList;
