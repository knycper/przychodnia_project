import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import './css/EditDoctorForm.css';
import { useKeycloak } from '@react-keycloak/web';

const EditDoctorForm = ({ doctor }) => {
    const { keycloak } = useKeycloak();

    const initialValues = {
        name: doctor.name || '',
        surname: doctor.surname || '',
        specialization: doctor.specialization || '',
        email: doctor.email || '',
        phoneNr: doctor.phoneNr || '',
        visible: doctor.visible ?? true // domyślnie true, jeśli undefined
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Imię jest wymagane!'),
        surname: Yup.string().required("Nazwisko jest wymagane!"),
        specialization: Yup.string().required('Specjalizacja jest wymagana'),
        email: Yup.string().email('Nieprawidłowy email').required('Email jest wymagany'),
        phoneNr: Yup.string()
            .matches(/^\d{3} \d{3} \d{3}$/, 'Numer musi być w formacie: 123 456 789')
            .required('Numer telefonu jest wymagany'),
        visible: Yup.boolean()
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const res = await axios.put(
                `${process.env.REACT_APP_API_URL}/admin/doctors/${doctor._id}`,
                values,
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`
                    }
                }
            );
            toast.success(res.data.message || 'Lekarz zaktualizowany!');
        } catch (error) {
            const msg = error.response?.data?.message || "Błąd podczas aktualizacji";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="form-container edit-form">
            <h3 className="form-title">Edytuj lekarza: {doctor.name} {doctor.surname}</h3>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize={true}>
                {({ isSubmitting }) => (
                    <Form className="form">
                        <div className="form-group">
                            <label>Imię:</label>
                            <Field name="name" type="text" className="form-input" />
                            <ErrorMessage name="name" component="div" className="form-error" />
                        </div>

                        <div className="form-group">
                            <label>Nazwisko:</label>
                            <Field name="surname" type="text" className="form-input" />
                            <ErrorMessage name="surname" component="div" className="form-error" />
                        </div>

                        <div className="form-group">
                            <label>Specjalizacja:</label>
                            <Field name="specialization" type="text" className="form-input" />
                            <ErrorMessage name="specialization" component="div" className="form-error" />
                        </div>

                        <div className="form-group">
                            <label>Email:</label>
                            <Field name="email" type="email" className="form-input" />
                            <ErrorMessage name="email" component="div" className="form-error" />
                        </div>

                        <div className="form-group">
                            <label>Numer telefonu:</label>
                            <Field name="phoneNr" type="text" className="form-input" placeholder="123 456 789" />
                            <ErrorMessage name="phoneNr" component="div" className="form-error" />
                        </div>

                        <div className="form-group checkbox-group">
                            <label>
                                <Field type="checkbox" name="visible" />
                                &nbsp;Lekarz widoczny dla pacjentów
                            </label>
                        </div>

                        <button type="submit" disabled={isSubmitting} className="form-button">
                            Zaktualizuj dane
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default EditDoctorForm;
