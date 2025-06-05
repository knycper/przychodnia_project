const jwt = require('jsonwebtoken');
const jwksRsa = require('jwks-rsa');

const client = jwksRsa({
    jwksUri: 'http://keycloak:8080/keycloak/realms/przychodnia/protocol/openid-connect/certs',
    cache: true,
    rateLimit: true,
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
        if (err) return callback(err);
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
    });
}

function tryCheckJwt(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req.user = null;
        return next();
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, getKey, {
        algorithms: ['RS256'],
        issuer: 'http://localhost/keycloak/realms/przychodnia',
        ignoreExpiration: false,
    }, (err, decoded) => {
        if (err) {
            req.user = null;
        } else {
            req.user = decoded;
        }
        next();
    });
}

module.exports = tryCheckJwt;
