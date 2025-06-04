import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import axios from 'axios';
import './css/AddDoctorForm.css';

const AddDoctorForm = ({ keycloak }) => {
    const initialValues = {
        name: '',
        surname: '',
        specialization: '',
        email: '',
        phoneNr: '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Imię jest wymagane!'),
        surname: Yup.string().required("Nazwisko jest wymagane!"),
        specialization: Yup.string().required('Specjalizacja jest wymagana'),
        email: Yup.string().email('Nieprawidłowy email').required('Email jest wymagany'),
        phoneNr: Yup.string()
            .matches(/^\d{3}\d{3}\d{3}$/, 'Numer musi być w formacie: 123 456 789')
            .required('Numer telefonu jest wymagany')
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/admin/doctors`,
                values,
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`
                    }
                }
            );
            toast.success(res.data.message);
            resetForm();
        } catch (error) {
            const backendMsg = error.response?.data?.message || "Nieznany błąd";
            toast.error(`Błąd: ${backendMsg}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="form-container">
            <h3 className="form-title">Dodaj nowego lekarza</h3>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
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

                        <button type="submit" disabled={isSubmitting} className="form-button">
                            Dodaj lekarza
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddDoctorForm;
