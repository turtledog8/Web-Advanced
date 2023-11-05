import * as db from "../data/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";

const privateKey = fs.readFileSync('./src/middleware/private-key.pem', 'utf8');

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

export const registerUser = async (req, res) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
    const usernameRegex = /^[a-zA-Z0-9_]{4,}$/;
    if (
        !firstName ||
        !lastName ||
        !username ||
        !email ||
        !password ||
        !email.match(emailRegex) ||
        !username.match(usernameRegex)
    ) {
        return res.status(400).send("Invalid registration information");
    }

    const firstName = sanitizeInput(req.body.firstName);
    const lastName = sanitizeInput(req.body.lastName);
    const username = sanitizeInput(req.body.username);
    const email = sanitizeInput(req.body.email);
    const password = sanitizeInput(req.body.password);

    // Check if the user already exists in the database (by username or email)
    if (db.findUser(username) || db.findUser(email)) {
        return res.status(409).send("User already exists");
    }

    try {
        // Hash the user's password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Add the user to the database
        await db.addUser(firstName, lastName, username, email, hashedPassword);

        const isAdmin = false;

        // Log the user in and create a JWT token
        const token = jwt.sign({ username, isAdmin }, privateKey, { algorithm: 'RS256' });

        // Return a successful registration and login response with the JWT token
        res.status(201).json({ message: "Registration and login successful", token: token });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error. Please try again.");
    }
};

// A bit of a lazy method, just copied the user and used registerAdmin in db (which I also copied from the addUser)
// Since usually I'd just manually run a sql command to register an admin.
export const registerAdmin = async (req, res) => {
    const firstName = sanitizeInput(req.body.firstName);
    const lastName = sanitizeInput(req.body.lastName);
    const username = sanitizeInput(req.body.username);
    const email = sanitizeInput(req.body.email);
    const password = sanitizeInput(req.body.password);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
    const usernameRegex = /^[a-zA-Z0-9_]{4,}$/;

    if (
        !firstName ||
        !lastName ||
        !username ||
        !email ||
        !password ||
        !email.match(emailRegex) ||
        !username.match(usernameRegex)
    ) {
        return res.status(400).send("Invalid registration information");
    }

    // Check if the user already exists in the database (by username or email)
    if (db.findUser(username) || db.findUser(email)) {
        return res.status(409).send("User already exists");
    }

    try {
        // Hash the user's password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Add the user to the database
        await db.addAdmin(firstName, lastName, username, email, hashedPassword);

        const isAdmin = true;

        // Log the user in and create a JWT token
        const token = jwt.sign({ username, isAdmin }, privateKey, { algorithm: 'RS256' });

        // Return a successful registration and login response with the JWT token
        res.status(201).json({ message: "Registration and login successful", token: token });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error. Please try again.");
    }
};