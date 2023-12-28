import jwt from "jsonwebtoken";
import fs from "fs";

const publicKey = fs.readFileSync('./src/middleware/public.pem', 'utf8');

export const authenticateAdmin = (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({ message: "No token sent in request header. " });
    }

    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));

        if (!decodedToken.isAdmin) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.headers.username = decodedToken.username;
        req.headers.isAdmin = decodedToken.isAdmin;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Invalid token" });
    }
};

export const authenticateUser = (req, res, next) => {
    const token = req.headers.token;
    let decodedToken;

    if (!token) {
        return res.status(401).json({ message: "No token sent in request header. " });
    }

    new Promise((resolve, reject) => {
        jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err) {
                console.error('JWT verification failed:', err);
                reject(err);
            } else {
                console.log('Decoded payload:', decoded);
                decodedToken = decoded;
                resolve(decoded);
            }
        });
    })
        .then(() => {
            req.headers.username = decodedToken.username;
            req.headers.isAdmin = decodedToken.isAdmin;
            next();
        })
        .catch((err) => {
            console.log(err);
            return res.status(401).json({ message: "Invalid token" });
        });
};
