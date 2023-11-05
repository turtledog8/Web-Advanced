import fs from "fs";
import * as db from "../data/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

export const login = async (req, res) => {
    const username = sanitizeInput(req.body.username);
    const password = sanitizeInput(req.body.password);

    if (!username || !password) {
        return res.status(400).send("Invalid login information");
    }

    // Find the user by username or email
    const user = db.findUser(username);

    if (!user) {
        console.log("Wrong username")
        return res
            .status(401)
            .json({message: "Login failed. Please check username and password"}); // User not found.
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        console.log("Wrong password")
        return res
            .status(401)
            .json({message: "Login failed. Please check username and password"}); // Wrong password.
    }

    // Create a JWT token for the authenticated user
    const token = jwt.sign({username}, privateKey, {algorithm: 'RS256'})
    // Return a successful login response with the JWT token
    res
        .status(200)
        .json({message: "Login successful", token: token});
}