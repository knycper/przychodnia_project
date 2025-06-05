const jwt = require('jsonwebtoken');
const jwksRsa = require('jwks-rsa');

const issuer = 'http://localhost/keycloak/realms/przychodnia';


// Klucz publiczny pobierany z Keycloaka do weryfikacji podpisu tokena
const client = jwksRsa({
    jwksUri: 'http://keycloak:8080/keycloak/realms/przychodnia/protocol/openid-connect/certs',
    cache: true,
    rateLimit: true,
});

function getKey(header, callback) {
    console.log("chce pobrac klucz")
    client.getSigningKey(header.kid, function (err, key) {
        if (err) {
            console.error("Błąd pobierania klucza:", err);
            return callback(err);
        }
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
    });
}

function checkJwt(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Brak tokena' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, getKey, {
        algorithms: ['RS256'],
        issuer: issuer,
        ignoreExpiration: false,
    }, (err, decoded) => {
        if (err) {
            console.error("JWT verify error:", err);
            return res.status(401).json({ error: 'Nieprawidłowy token' });
        }

        console.log("Token poprawny. Dane użytkownika:", decoded);
        req.user = decoded;
        next();
    });
}

module.exports = checkJwt;
