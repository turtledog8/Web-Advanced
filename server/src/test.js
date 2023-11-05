import bcrypt from "bcrypt";

async function hashPassword(password) {
    try {
        const saltRounds = 12; // Number of salt rounds for bcrypt hashing
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("Hashed Password:", hashedPassword);
    } catch (error) {
        console.error("Error hashing password:", error);
    }
}

const passwordToHash = "joe"; // Replace this with the password you want to hash
hashPassword(passwordToHash);
