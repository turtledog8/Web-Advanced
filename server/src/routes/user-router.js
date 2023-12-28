// routes/user-routes.js
import express from 'express';
import * as controller from '../controllers/user-controller.js';
import { authenticateUser } from '../controllers/authenticate-logged-in.js';

const router = express.Router();

const authenticationMiddleware = (req, res, next) => {
    authenticateUser(req, res, next);
};

router.use('/', authenticationMiddleware);

router.post('/bid', controller.placeBid);
router.post('/bid/remove', controller.removeUserBid); // Updated endpoint
router.get('/bids/:id', controller.getBidsForUser);
router.get('/profile/:id', controller.getUserDetails);

export default router;
