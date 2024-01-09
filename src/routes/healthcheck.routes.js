import express from 'express';
const router = express.Router();
import {healthcheck} from '../controllers/healthcheck.controller.js';

router.get('/', healthcheck);


export default router;