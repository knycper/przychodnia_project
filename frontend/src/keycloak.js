import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost/keycloak',     // adres Keycloak
    realm: 'przychodnia',             // domena
    clientId: 'frontend-client'       // identyfikator klienta (frontend)
});

export default keycloak;