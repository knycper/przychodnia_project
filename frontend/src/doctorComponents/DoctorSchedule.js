import { useState, useEffect } from 'react';
import axios from 'axios';
import './css/DoctorSchedule.css';
import { toast } from 'react-toastify';

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const dayLabels = {
    monday: "Poniedziałek",
    tuesday: "Wtorek",
    wednesday: "Środa",
    thursday: "Czwartek",
    friday: "Piątek",
    saturday: "Sobota",
    sunday: "Niedziela"
};

const DoctorSchedule = ({ keycloak }) => {
    const [schedule, setSchedule] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/doctor/schedule`, {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`
                }
            });
            setSchedule(res.data);
        } catch (err) {
            console.error("Błąd pobierania grafiku:", err);
            toast.error("Błąd pobierania grafiku")
        } finally {
            setLoading(false);
        }
    };

    const handleAddHour = (day, hour) => {
        if (!hour) return;
        const newSchedule = { ...schedule };
        newSchedule[day] = Array.from(new Set([...(newSchedule[day] || []), hour])).sort();
        setSchedule(newSchedule);
    };

    const handleRemoveHour = (day, hour) => {
        const newSchedule = { ...schedule };
        newSchedule[day] = newSchedule[day].filter(h => h !== hour);
        setSchedule(newSchedule);
    };

    const handleSave = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/doctor/schedule`, schedule, {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`
                }
            });
            toast.success("Grafik został zapisany.");
        } catch (err) {
            console.error("Błąd zapisu grafiku:", err);
            toast.error("Błąd podczas zapisywania grafiku.");
        }
    };

    if (loading) return <p>Ładowanie grafiku...</p>;

    return (
        <div className="doctor-schedule">
            <h2>Godziny przyjęć</h2>
            {days.map(day => (
                <div key={day} className="schedule-day">
                    <h4>{dayLabels[day]}</h4>
                    <ul className="hours-list">
                        {(schedule[day] || []).map(hour => (
                            <li key={hour}>
                                {hour}
                                <button onClick={() => handleRemoveHour(day, hour)}>Usuń</button>
                            </li>
                        ))}
                    </ul>
                    <AddHourInput onAdd={(hour) => handleAddHour(day, hour)} />
                </div>
            ))}
            <button className="save-btn" onClick={handleSave}>💾 Zapisz zmiany</button>
        </div>
    );
};

const AddHourInput = ({ onAdd }) => {
    const [hour, setHour] = useState("");

    return (
        <div className="add-hour">
            <input
                type="time"
                value={hour}
                onChange={(e) => setHour(e.target.value)}
            />
            <button onClick={() => { onAdd(hour); setHour(""); }}>Dodaj</button>
        </div>
    );
};

export default DoctorSchedule;
