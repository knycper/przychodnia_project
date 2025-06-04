const axios = require('axios');

async function deleteKeycloakUser(keycloakId) {
    try {
        // 1. Pobierz token admina
        const tokenRes = await axios.post(
            'http://keycloak:8080/realms/master/protocol/openid-connect/token',
            new URLSearchParams({
                username: process.env.KEYCLOAK_ADMIN,
                password: process.env.KEYCLOAK_ADMIN_PASSWORD,
                grant_type: 'password',
                client_id: 'admin-cli',
            }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
        );

        const token = tokenRes.data.access_token;

        await axios.delete(
            `http://keycloak:8080/admin/realms/przychodnia/users/${keycloakId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log(`Użytkownik ${keycloakId} usunięty z Keycloaka.`);
    } catch (err) {
        console.error('Błąd podczas usuwania użytkownika z Keycloaka:', err.response?.data || err.message);
        throw new Error('Błąd usuwania konta z Keycloaka');
    }
}

module.exports = deleteKeycloakUser;
