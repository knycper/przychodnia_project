import { useState } from 'react';
import axios from 'axios';
import EditDoctorForm from './EditDoctorForm';
import './css/SearchDoctorToEdit.css';

const SearchDoctorToEdit = ({ keycloak }) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

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
            console.error("Błąd wyszukiwania lekarzy:", err);
        }
    };

    return (
        <div className="search-doctor">
            <h3>Wyszukaj lekarza do edycji</h3>
            <form onSubmit={handleSearch} className="search-form">
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

            <div className="search-results">
                {searchResults.length !== 0 ? (
                    searchResults.map(doc => (
                        <div key={doc._id} onClick={() => setSelectedDoctor(doc)} className="search-result">
                            {doc.name} {doc.surname} ({doc.email})
                        </div>
                    ))
                ) : "Nie znaleziono lekarzy pasujacych do wpisanych danych"}
            </div>

            {selectedDoctor && (
                <EditDoctorForm doctor={selectedDoctor} />
            )}
        </div>
    );
};

export default SearchDoctorToEdit;
