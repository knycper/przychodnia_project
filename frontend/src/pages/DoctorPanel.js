import { useState } from 'react';
import DoctorCalendar from '../doctorComponents/DoctorCalendar';
import DoctorSchedule from '../doctorComponents/DoctorSchedule';
import './css/DoctorPanel.css';
import { useKeycloak } from '@react-keycloak/web';

const DoctorPanel = () => {
    const { keycloak } = useKeycloak();
    const [view, setView] = useState('calendar');

    return (
        <div className="doctor-panel">
            <header className="panel-header">
                <h1>Witaj, dr {keycloak.idTokenParsed?.given_name} {keycloak.idTokenParsed?.family_name}</h1>
                <p>Wybierz opcję poniżej, aby kontynuować.</p>
            </header>

            <div className="panel-buttons">
                <button
                    className={view === 'calendar' ? 'active' : ''}
                    onClick={() => setView('calendar')}
                >
                    🗓️ Wizyty
                </button>
                <button
                    className={view === 'schedule' ? 'active' : ''}
                    onClick={() => setView('schedule')}
                >
                    ⏰ Godziny pracy
                </button>
            </div>

            <section className="panel-section">
                {view === 'calendar' && <DoctorCalendar keycloak={keycloak} />}
                {view === 'schedule' && <DoctorSchedule keycloak={keycloak} />}
            </section>
        </div>
    );
};

export default DoctorPanel;
