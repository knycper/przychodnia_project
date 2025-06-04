import { useKeycloak } from '@react-keycloak/web';
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UnderPage from './pages/UnderPage';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import AdminPanel from './pages/AdminPanel';
import DoctorPanel from './pages/DoctorPanel';
import AboutPage from './pages/AboutPage';
import Search from './pages/Search';
import BookAppointment from './pages/BookAppointment';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import keycloak from './keycloak';

function App() {
  const { initialized } = useKeycloak();

  if (!initialized) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/underPage" element={<UnderPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search/book" element={<BookAppointment />} />
        <Route
          path="/register"
          element={
            keycloak.authenticated
              ? <Navigate to="/" />
              : <RegisterPage />}
        />
        <Route
          path="/admin"
          element={
            keycloak.authenticated && keycloak.hasRealmRole('admin')
              ? <AdminPanel />
              : <Navigate to="/" />
          }
        />
        <Route
          path="/doctor"
          element={
            keycloak.authenticated && keycloak.hasRealmRole('doctor')
              ? <DoctorPanel />
              : <Navigate to="/" />
          }
        />
        <Route
          path="/account"
          element={keycloak.authenticated && keycloak.hasRealmRole('user')
            ? <AccountPage />
            : <Navigate to="/" />
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

    </div>
  );
}

export default App;
