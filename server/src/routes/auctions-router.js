import express from 'express';
import * as auctionsRouter from "../controllers/auction-controller.js";

const router = express.Router();

router.get("/", auctionsRouter.getAllAuctions);
router.get("/:id", auctionsRouter.getAuctionById)

export default router;