import express from 'express';
const router = express.Router();
import {varifyJwt} from '../middlewares/auth.middleware.js';
import {getChannelStats, getChannelVideos} from '../controllers/dashboard.controller.js';

router.get('/:channelId', varifyJwt, getChannelStats);
router.get('/c/videos/:channelId', varifyJwt, getChannelVideos);

export default router;
