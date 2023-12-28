import express from 'express';
import * as auctionsRouter from "../controllers/auction-controller.js";

const router = express.Router();

router.get("/", auctionsRouter.getAllAuctions);
router.get("/:id", auctionsRouter.getAuctionById)
router.get("/time/:id", auctionsRouter.getAuctionClosingTime)        ///change closing time n shieee

export default router;