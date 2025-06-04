import { Link, useNavigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import './css/NavBar.css';

function NavBar() {
    const { keycloak } = useKeycloak();
    const navigate = useNavigate();

    const handleLogin = () => keycloak.login();
    const handleLogout = () => keycloak.logout();
    const handleAccount = () => navigate("/account");

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/">Strona główna</Link>
                <Link to="/underPage">Podstrona</Link>
                <Link to="/about">O Nas</Link>
                <Link to="/search">Umów się</Link>
                {keycloak.hasRealmRole("admin") && (
                    <Link to="/admin">Panel admina</Link>
                )}
                {keycloak.hasRealmRole("doctor") && (
                    <Link to="/doctor">Panel lekarza</Link>
                )}
            </div>

            <div className="navbar-right">
                {keycloak.authenticated ? (
                    <>
                        {keycloak.hasRealmRole('user') && (
                            <button onClick={handleAccount}>Moje konto</button>
                        )}
                        <button onClick={handleLogout}>Wyloguj</button>
                    </>
                ) : (
                    <>
                        <button onClick={handleLogin}>Zaloguj</button>
                        <button onClick={() => navigate('/register')}>Zarejestruj się</button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default NavBar;
