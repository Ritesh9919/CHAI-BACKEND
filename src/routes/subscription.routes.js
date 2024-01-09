import express from 'express';
const router = express.Router();
import {varifyJwt} from '../middlewares/auth.middleware.js';
import {toggleSubscription, getUserChannelSubscribers, getSubscribedChannels} from '../controllers/subscription.controller.js';

router.post('/:channelId', varifyJwt, toggleSubscription);
router.get('/subscribers/:channelId', varifyJwt, getUserChannelSubscribers);
router.get('/subscribedTo/:subscriberId', varifyJwt, getSubscribedChannels);

export default router;