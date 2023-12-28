import jwt from 'jsonwebtoken';
import fs from 'fs';

const publicKey = fs.readFileSync('./src/middleware/public.pem', 'utf8'); // Use the public key for token verification

export const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;


    if (!token) {
        return res.status(401).json({ message: 'Access denied. Missing token.' });
    }

    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, user) => {
        if (err) {
            console.error("Token Verification Error:", err);
            return res.status(403).json({ message: 'Invalid token.' });
        }

        console.log("Token Verified. User:", user);

        req.user = user;
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
