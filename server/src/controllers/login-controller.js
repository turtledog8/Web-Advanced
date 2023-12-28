import fs from "fs";
import * as db from "../data/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const privateKey = fs.readFileSync('./src/middleware/private.pem', 'utf8');

const sanitizeInput = (input) => {
    if (typeof input !== 'string') {
        return '';
    }

    input = input.replace(/'/g, "\\'");
    input = input.replace(/"/g, '\\"');
    input = input.replace(/</g, '&lt;');
    input = input.replace(/>/g, '&gt;');
    input = input.replace(/&/g, '&amp;');
    input = input.replace(/'/g, '&#39;');
    input = input.replace(/"/g, '&quot;');

    return input;
}
export const login = async (req, res) => {
    const username = sanitizeInput(req.body.username);
    const password = req.body.password; // Temporarily remove sanitization for password during login

    console.log("Received Password (Length):", password.length);
    console.log("Received Password:", password);

    if (!username || !password) {
        return res.status(400).send("Invalid login information");
    }

    try {
        // Find the user by username or email
        const user = db.findUser(username);
        console.log("DECRYPTED PASSWORD: " , )
        if (!user) {
            console.log("Wrong username")
            return res.status(401).json({ message: "Login failed. Please check username and password" });
        }
        console.log("Database Hashed Password during login log:", user.password);
        console.log("Database Hashed Password (Length) when logging in:", user.password.length);

        // Compare the sanitized provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log("Password comparison : " , user.password , "    ", password)
        console.log("Password Match:", passwordMatch);

        if (!passwordMatch) {
            console.log("Wrong password")
            return res.status(401).json({ message: "Login failed. Please check username and password" });
        }

        // Create a JWT token for the authenticated user, including user ID in the payload
        const tokenPayload = {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin
        };

        const token = jwt.sign(tokenPayload, privateKey, { algorithm: 'RS256' });

        // Return a successful login response with the JWT token
        res.status(200).json({ message: "Login successful", token: token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal server error. Please try again.");
    }
};