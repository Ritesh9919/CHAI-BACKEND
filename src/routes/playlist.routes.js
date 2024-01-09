

import express from 'express';
const router = express.Router();

import {varifyJwt} from '../middlewares/auth.middleware.js';
import {createPlaylist, getUserPlaylists, getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist, updatePlaylist, deletePlaylist} from '../controllers/playlist.controller.js';

router.post('/create', varifyJwt ,createPlaylist);
router.get('/by-user/:userId', varifyJwt, getUserPlaylists);
router.get('/by-id/:playlistId', varifyJwt, getPlaylistById);
router.post('/add-video', varifyJwt, addVideoToPlaylist);
router.post('/remove-video', varifyJwt, removeVideoFromPlaylist);
router.put('/update/:playlistId', varifyJwt, updatePlaylist);
router.delete('/delete/:playlistId', varifyJwt, deletePlaylist);



export default router;