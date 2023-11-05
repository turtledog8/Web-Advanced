import * as express from 'express';
import * as login from "../controllers/login-controller.js";

const router = express.Router();

router.post("/", login.login);

export default router;