import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:8080/',     // adres Keycloak
    realm: 'przychodnia',             // domena
    clientId: 'frontend-client'       // identyfikator klienta (frontend)
});

export default keycloak;