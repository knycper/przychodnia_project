const axios = require('axios');

async function createKeycloakDoctor(name, surname, username, email) {
  try {
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

    const res = await axios.post(
      'http://keycloak:8080/admin/realms/przychodnia/users',
      {
        username,
        email,
        enabled: true,
        firstName: name,
        lastName: surname,
        credentials: [
          {
            type: 'password',
            value: 'password',
            temporary: true,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const locationHeader = res.headers.location;
    const keycloakId = locationHeader.split('/').pop();

    const roleRes = await axios.get(
      'http://keycloak:8080/admin/realms/przychodnia/roles/doctor',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const role = roleRes.data;

    await axios.post(
      `http://keycloak:8080/admin/realms/przychodnia/users/${keycloakId}/role-mappings/realm`,
      [role],
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Użytkownik utworzony w Keycloaku:", keycloakId);
    return keycloakId;
  } catch (error) {
    console.error("Błąd podczas tworzenia użytkownika w Keycloak:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.errorMessage ||
      "Błąd tworzenia użytkownika w Keycloak"
    );
  }
}

module.exports = createKeycloakDoctor;
