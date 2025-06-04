import { Link } from 'react-router-dom';
import './css/HomePage.css';
import clinicImage from './pngs/clinik.png';

const HomePage = () => {
    return (
        <div className="home-page-content">
            <section className="hero-image" style={{ backgroundImage: `url(${clinicImage})` }}>
                <div className="overlay">
                    <div className="hero-text">
                        <h1>Witamy w Przychodni Zdrowie24</h1>
                        <p>Zadbaj o zdrowie – zdalnie, wygodnie, bezpiecznie.</p>
                        <Link to="/search" className="cta-button">
                            Chcesz umówić się na wizytę? Kliknij tutaj!
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
