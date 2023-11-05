import jwt from 'jsonwebtoken';
import fs from 'fs';

const publicKey = fs.readFileSync('./src/middleware/private-key.pem', 'utf8'); // Use the public key for token verification

export const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Missing token.' });
    }

    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
        req.user = user; // Store the user information extracted from the token in the request object
        next();
    });
};

export function isAdmin(req, res, next) {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Permission denied!' });
    }
}
