import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './css/RegistrationForm.css';

const UserRegistrationForm = ({ onSubmit }) => {
  const initialValues = {
    name: '',
    surname: '',
    email: '',
    phoneNr: '',
    password: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Imię jest wymagane'),
    surname: Yup.string().required('Nazwisko jest wymagane'),
    email: Yup.string().email('Nieprawidłowy email').required('Email jest wymagany'),
    phoneNr: Yup.string()
      .matches(/^\d{3}\d{3}\d{3}$/, 'Numer telefonu powinien zawierać 9 cyfr')
      .required('Numer telefonu jest wymagany'),
    password: Yup.string().min(6, 'Hasło musi mieć przynajmniej 6 znaków').required('Hasło jest wymagane'),
  });

  return (
    <div className="registration-container">
      <h2>Rejestracja użytkownika</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form>
          <div className="form-group">
            <label htmlFor="name">Imię:</label>
            <Field type="text" name="name" />
            <ErrorMessage name="name" component="div" className="error" />
          </div>

          <div className="form-group">
            <label htmlFor="surname">Nazwisko:</label>
            <Field type="text" name="surname" />
            <ErrorMessage name="surname" component="div" className="error" />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" className="error" />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNr">Numer telefonu:</label>
            <Field type="text" name="phoneNr" />
            <ErrorMessage name="phoneNr" component="div" className="error" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Hasło:</label>
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" className="error" />
          </div>

          <button type="submit" className="submit-button">Zarejestruj</button>
        </Form>
      </Formik>
    </div>
  );
};

export default UserRegistrationForm;
