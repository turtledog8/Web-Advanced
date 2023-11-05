import express from 'express';
import * as controller from "../controllers/user-controller.js";
import * as authenticate from "../controllers/authenticate-logged-in.js";

const router = express.Router();

const authenticationMiddleware = (req, res, next) => {
    authenticate.authenticateUser(req, res, next);
};

router.use("/", authenticationMiddleware);

router.post("/bid", controller.placeBid);
router.get("/bids", controller.getBidsForUser);

export default router;