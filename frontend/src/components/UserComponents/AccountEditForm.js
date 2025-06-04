import { useEffect, useState } from 'react';
import axios from 'axios';
import './css/AccountEditForm.css';
import { toast } from "react-toastify";

const AccountEditForm = ({ keycloak }) => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        phoneNr: '',
        email: '',
    });

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/user/info`, {
            headers: {
                Authorization: `Bearer ${keycloak.keycloak.token}`
            }
        })
            .then(res => {
                setFormData(prev => ({
                    ...prev,
                    name: res.data.name,
                    surname: res.data.surname,
                    phoneNr: res.data.phoneNr,
                    email: res.data.email,
                }));
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                name: formData.name,
                surname: formData.surname,
                phoneNr: formData.phoneNr,
                email: formData.email,
            };

            await axios.put(`${process.env.REACT_APP_API_URL}/user/update`, payload, {
                headers: {
                    Authorization: `Bearer ${keycloak.keycloak.token}`
                }
            });
            toast.success('Dane zostały zaktualizowane.');
        } catch (err) {
            console.error('Błąd aktualizacji danych:', err);
            toast.error('Wystąpił błąd podczas aktualizacji danych.');
        }
    };

    return (
        <div className="info-box">
            <h3>Edytuj dane konta</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Imię:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Nazwisko:</label>
                    <input type="text" name="surname" value={formData.surname} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Telefon:</label>
                    <input type="text" name="phoneNr" value={formData.phoneNr} onChange={handleChange} required />
                </div>

                <hr />

                <button type="submit" className="submit-button">Zapisz zmiany</button>
            </form>
        </div>
    );
};

export default AccountEditForm;
