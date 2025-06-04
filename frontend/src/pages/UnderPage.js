import { useKeycloak } from '@react-keycloak/web';

function UnderPage() {
    const { keycloak } = useKeycloak();
    const isAdmin = keycloak?.authenticated && keycloak.hasRealmRole('admin');

    return <h2>pod strona {isAdmin ? "nico" : "nic"}</h2>;
}

export default UnderPage;