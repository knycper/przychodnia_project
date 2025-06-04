import './css/AboutPage.css';

const AboutPage = () => {
    return (
        <div className="about-page">
            <section className="about-section">
                <h1>O naszej przychodni</h1>
                <p>
                    Zdrowie24 to nowoczesna przychodnia online, która łączy pacjentów z lekarzami w prosty i bezpieczny sposób.
                    Zapewniamy szybki dostęp do konsultacji, pełną kontrolę nad terminami oraz przyjazny interfejs zarówno dla lekarzy, jak i pacjentów.
                </p>
                <p>
                    Nasza platforma działa 24/7 i stale się rozwija – abyś Ty nie musiał czekać w kolejkach. Zaufaj doświadczeniu i technologii.
                </p>
            </section>

            <section className="features-section">
                <h2>Dlaczego warto?</h2>
                <ul>
                    <li>✅ Intuicyjna rejestracja online</li>
                    <li>✅ Podgląd wizyt i historii</li>
                    <li>✅ Godziny przyjęć aktualizowane na bieżąco</li>
                    <li>✅ Bezpieczna komunikacja z lekarzem</li>
                </ul>
            </section>

            <section className="contact-section">
                <h2>Kontakt</h2>
                <p>📍 Warszawa, ul. Zdrowia 1</p>
                <p>📞 123 456 789</p>
                <p>✉️ kontakt@zdrowie24.pl</p>
            </section>
        </div>
    );
};


export default AboutPage;
