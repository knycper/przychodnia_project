import { useState } from 'react';
import axios from 'axios';
import './css/SearchDoctorToEdit.css';
import { toast } from 'react-toastify';

const DeleteDoctor = ({ keycloak }) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [confirmId, setConfirmId] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/admin/doctors/search`, {
                params: { name, surname },
                headers: {
                    Authorization: `Bearer ${keycloak.token}`
                }
            });
            setSearchResults(res.data);
        } catch (err) {
            console.error("Błąd wyszukiwania:", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/admin/doctors/${id}`, {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`
                }
            });
            setSearchResults(prev => prev.filter(doc => doc._id !== id));
            setConfirmId(null);
            toast.success("Pomyślnie usunięto lekarza!")
        } catch (err) {
            console.error("Błąd usuwania:", err);
            toast.error("Błąd usuwania")
        }
    };

    return (
        <div className="search-doctor">
            <h3>Usuń lekarza</h3>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Imię"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Nazwisko"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                />
                <button type="submit">Szukaj</button>
            </form>

            {searchResults.length > 0 ? (
                <div className="search-results">
                    {searchResults.map(doc => (
                        <div key={doc._id} className="search-result">
                            <span>{doc.name} {doc.surname} ({doc.email})</span>
                            {confirmId === doc._id ? (
                                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                    <button onClick={() => handleDelete(doc._id)}>Potwierdź</button>
                                    <button
                                        type="button"
                                        onClick={() => setConfirmId(null)}
                                        style={{ backgroundColor: '#6c757d' }}
                                    >
                                        Anuluj
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setConfirmId(doc._id)}
                                    style={{ marginTop: '10px' }}
                                >
                                    Usuń
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : <div className="search-results">Nie znaleziono pasujących wyników</div>}
        </div>
    );
};

export default DeleteDoctor;
