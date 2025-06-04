import './css/AdminPanel.css';
import { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import axios from 'axios';
import AddDoctorForm from '../components/adminComponents/AddDoctorForm';
import DoctorDetailsAdmin from '../components/adminComponents/DoctorDetailsAdmin';
import { toast } from 'react-toastify';
import SearchDoctorToEdit from '../components/adminComponents/SearchDoctorToEdit';
import DeleteDoctor from '../components/adminComponents/DeleteDoctor';

const AdminPanel = () => {
    const { keycloak } = useKeycloak();
    const [activePanel, setActivePanel] = useState(null);
    const [doctors, setDoctors] = useState([])

    const getDoctors = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/doctorsList`, {
            headers: {
                Authorization: `Bearer ${keycloak.token}`
            }
        })
            .then(res => {
                setDoctors(res.data);
                setActivePanel('show')
            })
            .catch(error => {
                const backendMsg = error.response?.data?.message || "Nieznany błąd";
                toast.error(`Błąd: ${backendMsg}`);
            })
    }

    return (
        <div className="admin-panel">
            <h2 className="admin-title">Panel administratora</h2>
            <p className="admin-subtitle">Wybierz operację:</p>

            <div className="admin-actions">
                <button onClick={() => setActivePanel('add')} className="admin-btn add">
                    ➕ Dodaj lekarza
                </button>
                <button onClick={() => setActivePanel('edit')} className="admin-btn edit">
                    ✏️ Edytuj lekarza
                </button>
                <button onClick={() => setActivePanel('delete')} className="admin-btn delete">
                    🗑️ Usuń lekarza
                </button>
                <button onClick={getDoctors} className="admin-btn show">
                    🧑‍⚕️ Wyswietl lekarzy
                </button>
            </div>

            {/* Tu dynamicznie renderujemy odpowiedni komponent */}
            <div className="admin-content">
                {activePanel === 'add' && <AddDoctorForm keycloak={keycloak} />}
                {activePanel === 'edit' && <SearchDoctorToEdit keycloak={keycloak} />}
                {activePanel === 'delete' && <DeleteDoctor keycloak={keycloak} />}
                {activePanel === 'show' && (
                    <div className="doctor-grid">
                        {doctors.length === 0 ? "Nie dodano jeszcze lekarzy" : (
                            doctors.map(doc => (
                                <DoctorDetailsAdmin key={doc._id} doctor={doc} />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
