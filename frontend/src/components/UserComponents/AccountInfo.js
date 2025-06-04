import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/AccountInfo.css';

const AccountInfo = ({ keycloak }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/user/info`, {
            headers: {
                Authorization: `Bearer ${keycloak.keycloak.token}`
            }
        })
            .then(res => setUser(res.data))
            .catch(err => console.error('Błąd pobierania danych:', err));
    }, []);

    if (!user) return <p>Ładowanie danych użytkownika...</p>;

    return (
        <div className="info-box">
            <h3>Dane użytkownika</h3>
            <p><strong>Imię:</strong> {user.name}</p>
            <p><strong>Nazwisko:</strong> {user.surname}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Telefon:</strong> {user.phoneNr}</p>
        </div>
    );
};

export default AccountInfo;
