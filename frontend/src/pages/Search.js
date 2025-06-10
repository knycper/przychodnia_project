import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './css/Search.css';
import { useKeycloak } from '@react-keycloak/web';
import { toast } from 'react-toastify';

const Search = () => {
    const keycloak = useKeycloak();
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const filteredDoctors = doctors.filter(doc =>
        `${doc.name} ${doc.surname}`.toLowerCase().includes(searchTerm)
    );
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableHours, setAvailableHours] = useState([]);
    const [loginRemember, setLoginRemember] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/doctorsList`)
            .then(res => setDoctors(res.data))
            .catch(err => console.error("Błąd ładowania lekarzy:", err));
    }, []);

    const handleDateChange = async (date) => {
        setSelectedDate(date);

        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/available`, {
                params: {
                    doctorId: selectedDoctor._id,
                    date: date.toISOString().split('T')[0],
                    weekday: weekday
                }
            });
            setAvailableHours(res.data.availableHours);
        } catch (err) {
            console.error("Błąd pobierania dostępnych godzin:", err);
        }
    };

    const handleHourClick = (hour) => {
        if (keycloak.keycloak.authenticated) {
            if (keycloak.keycloak.hasRealmRole('user')) {
                setLoginRemember(false);
                navigate(`/search/book?doctorId=${selectedDoctor._id}&date=${selectedDate.toISOString().split('T')[0]}&time=${hour}`);
            } else {
                toast.error("posiadasz nieodpowiednią rolę do tego zadania");
            }
        } else {
            setLoginRemember(true);
        }
    };

    const handleRegister = () => {
        localStorage.setItem("redirectAfterLogin", window.location.pathname);
        navigate('/register');
    }

    return (
        <div className="search-page">
            <h2>Umów wizytę</h2>
            <div className="search-content">
                {/* Lista lekarzy */}
                <div className="doctor-list">
                    <input
                        type="text"
                        className="searchbar"
                        placeholder="Wyszukaj lekarza po imieniu lub nazwisku..."
                        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                    />
                    {filteredDoctors.map(doc => (
                        <div
                            key={doc._id}
                            className={`doctor-card ${selectedDoctor?._id === doc._id ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedDoctor(doc);
                                setAvailableHours([]);
                                setSelectedDate(new Date());
                            }}
                        >
                            <h3>dr {doc.name} {doc.surname}</h3>
                            <p>{doc.specialization}</p>
                        </div>
                    ))}
                </div>

                {/* Kalendarz i godziny */}
                <div className="calendar-section">
                    {selectedDoctor ? (
                        <>
                            <h3>dr {selectedDoctor.name} {selectedDoctor.surname}</h3>
                            <div className="calendar-wrapper">
                                <Calendar onChange={handleDateChange}
                                    value={selectedDate}
                                    tileDisabled={({ date }) => date < new Date(new Date().setHours(0, 0, 0, 0))} />
                            </div>

                            <div className="hours-list">
                                <h4>Dostępne godziny na {selectedDate.toLocaleDateString()}:</h4>
                                {availableHours.length > 0 ? (
                                    <div className="hour-cards">
                                        {availableHours.map(hour => (
                                            <div
                                                key={hour}
                                                className="hour-card"
                                                onClick={() => handleHourClick(hour)}
                                            >
                                                {hour}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>Brak dostępnych godzin w wybranym dniu.</p>
                                )}
                                {loginRemember && (
                                    <div className="login-prompt">
                                        Aby umówić się na wizytę <button onClick={() => keycloak.keycloak.login()}>Zaloguj się</button> bądź <button onClick={handleRegister}>Zarejestruj</button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <p>Wybierz lekarza, aby zobaczyć dostępne godziny.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
