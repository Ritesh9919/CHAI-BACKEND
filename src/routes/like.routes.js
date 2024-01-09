import express from 'express';
import { varifyJwt } from '../middlewares/auth.middleware.js';
const router = express.Router();
import {toggleVideoLike, toogleCommentLike, toogleTweetLike, getLikedVideos} from '../controllers/like.controller.js';

router.post('/video/:videoId', varifyJwt, toggleVideoLike);
router.post('/comment/:commentId', varifyJwt ,toogleCommentLike);
router.post('/tweet/:tweetId', varifyJwt, toogleTweetLike);
router.get('/by-user', varifyJwt, getLikedVideos);


export default router;