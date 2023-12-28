import * as db from "../data/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";

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
export const registerUser = async (req, res) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
    const usernameRegex = /^[a-zA-Z0-9_]{4,}$/;

    const firstName = sanitizeInput(req.body.firstName);
    const lastName = sanitizeInput(req.body.lastName);
    const username = sanitizeInput(req.body.username);
    const email = sanitizeInput(req.body.email);
    const password = sanitizeInput(req.body.password);

    console.log("Sanitized user input:", { firstName, lastName, username, email, password });

    if (
        !firstName ||
        !lastName ||
        !username ||
        !email ||
        !password ||
        !email.match(emailRegex) ||
        !username.match(usernameRegex)
    ) {
        console.log("Invalid registration information");
        return res.status(400).send("Invalid registration information");
    }

    try {
        const userId = await db.addUser(firstName, lastName, username, email, password);

        // Return a successful registration response
        res.status(201).json({ message: "Registration successful" });
    } catch (error) {
        console.error("Error occurred during registration:", error);
        res.status(500).send("Internal server error. Please try again.");
    }
};

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

    try {
        // Hash the user's password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Add the user to the database
        const userId = await db.addAdmin(firstName, lastName, username, email, hashedPassword);

        // Return a successful registration response
        res.status(201).json({ message: "Registration successful" });
    } catch (error) {
        console.error("Error occurred during registration:", error);
        res.status(500).send("Internal server error. Please try again.");
    }
};
