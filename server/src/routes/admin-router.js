import express from "express";
import * as authenticate from "../controllers/authenticate-logged-in.js"
import * as controller from "../controllers/admin-controller.js"

const router = express.Router();

const authenticationMiddleware = (req, res, next) => {
    authenticate.authenticateAdmin(req, res, next);
};

router.use("/", authenticationMiddleware);
router.post("/add-auction", controller.addAuction);
router.post("/edit-auction/:id", controller.editAuction);
router.post("/delete-auction/:id", controller.deleteAuction);

export default router;