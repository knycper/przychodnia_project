import './css/DoctorDetailsAdmin.css';

const DoctorDetailsAdmin = ({ doctor }) => {
    return (
        <div className="doctor-card">
            <h3>{doctor.name} {doctor.surname}</h3>
            <p><strong>Specjalizacja:</strong> {doctor.specialization}</p>
            <p><strong>Email:</strong> {doctor.email}</p>
            <p><strong>Telefon:</strong> {doctor.phoneNr}</p>
            <p><strong>Widoczny publicznie:</strong> {doctor.visible ? 'Tak' : 'Nie'}</p>

            <div className="schedule">
                <strong>Grafik:</strong>
                {Object.entries(doctor.schedule || {}).map(([day, hours]) => (
                    <div key={day}>
                        <em>{day}:</em> {hours.length > 0 ? hours.join(', ') : 'brak'}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorDetailsAdmin;
