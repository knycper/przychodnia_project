import UserRegistrationForm from '../components/UserRegistrationForm';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const RegisterPage = () => {
    const navigate = useNavigate();
    const keycloak = useKeycloak();

    useEffect(() => {
        return () => {
            localStorage.removeItem('redirectAfterLogin');
        };
    }, []);

    const handleRegister = async (values, { setSubmitting }) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/register`, values);
            keycloak.keycloak.login();
            const path = localStorage.getItem("redirectAfterLogin") || "/";
            navigate(path);
            localStorage.removeItem("redirectAfterLogin");
            toast.success(res.message);
        } catch (error) {
            alert('Błąd podczas rejestracji: ' + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <UserRegistrationForm onSubmit={handleRegister} />
        </div>
    );
};

export default RegisterPage;
