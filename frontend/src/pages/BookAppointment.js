import { useNavigate, useSearchParams } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import axios from 'axios';
import './css/BookAppointment.css';

const BookAppointment = () => {
    const { keycloak } = useKeycloak();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');
    const time = searchParams.get('time');

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!doctorId || !date || !time) {
            navigate('/search');
        } else {
            fetchDoctor();
        }
    }, [doctorId, date, time]);

    const fetchDoctor = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/appointment/doc/${doctorId}`, {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`
                }
            });
            setDoctor(res.data);
        } catch (err) {
            console.error("Błąd ładowania lekarza:", err);
            toast.error('Nie udało się pobrać danych lekarza.');
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/user/appointment`, {
                doctorId,
                date,
                time
            }, {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`
                }
            });

            toast.success('Wizyta została zarezerwowana!');
            navigate('/search');
        } catch (err) {
            console.error("Błąd rezerwacji:", err);
            toast.error('Nie udało się zarezerwować wizyty. Spróbuj ponownie.');
        } finally {
            setLoading(false);
        }
    };

    if (!doctor) return <p>Ładowanie danych lekarza...</p>;

    return (
        <div className="booking-container">
            <h2>Potwierdzenie wizyty</h2>
            <div className="booking-summary">
                <p><strong>Lekarz:</strong> dr {doctor.name} {doctor.surname}</p>
                <p><strong>Specjalizacja:</strong> {doctor.specialization}</p>
                <p><strong>Data:</strong> {date}</p>
                <p><strong>Godzina:</strong> {time}</p>
            </div>

            <button className="confirm-button" onClick={handleConfirm} disabled={loading}>
                {loading ? 'Rezerwuję...' : 'Potwierdź wizytę'}
            </button>
        </div>
    );
};

export default BookAppointment;
