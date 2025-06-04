import { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AccountInfo from '../components/UserComponents/AccountInfo';
import AccountEditForm from '../components/UserComponents/AccountEditForm';
import AppointmentList from '../components/UserComponents/AppointmentList';
import axios from 'axios';
import './css/AccountPage.css';

const AccountPage = () => {
    const navigate = useNavigate();
    const keycloak = useKeycloak();
    const [activeView, setActiveView] = useState(null);

    const handleDelete = async () => {
        if (window.confirm('Czy na pewno chcesz usunąć swoje konto?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/user/delete`, {
                    headers: {
                        Authorization: `Bearer ${keycloak.keycloak.token}`
                    }
                });
                toast.success('Konto zostało usunięte pomyślnie.');
                keycloak.keycloak.logout();
                navigate('/');
            } catch (err) {
                console.error('Błąd podczas usuwania konta:', err);
                toast.error("Wystąpił błąd podczas usuwania konta");
            }
        }
    };

    return (
        <div className="account-container">
            <h2>Wybierz zadanie</h2>

            <div className="button-group">
                <button onClick={() => setActiveView('info')}>Informacje o koncie</button>
                <button onClick={() => setActiveView('edit')}>Aktualizuj dane</button>
                <button onClick={handleDelete} className="danger">Usuń konto</button>
                <button onClick={() => setActiveView('appointments')}>Zaplanowane spotkania</button>
            </div>

            {activeView === 'info' && <AccountInfo keycloak={keycloak} />}
            {activeView === 'edit' && <AccountEditForm keycloak={keycloak} />}
            {activeView === 'appointments' && <AppointmentList keycloak={keycloak} />}
        </div>
    );
};

export default AccountPage;
