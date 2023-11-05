import express from 'express';
import * as register from "../controllers/register-controller.js";

const router = express.Router();

router.use(express.json());

router.post("/", register.registerUser);

export default router;