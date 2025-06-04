import "./index.css"
import ReactDOM from 'react-dom/client';
import App from './App';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak.js';
import { BrowserRouter as Router } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{
      onLoad: 'check-sso',
      checkLoginIframe: false,
    }}
    onEvent={(event, error) => {
      console.log("Keycloak event", event, error);
    }}
    onTokens={(tokens) => {
      console.log("Keycloak tokens", tokens);
    }}
  >
    <Router>
      <App />
    </Router>
  </ReactKeycloakProvider>

);
