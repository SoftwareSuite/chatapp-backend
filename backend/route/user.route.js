import express from'express';
import { getOtherUsers, login, logOut, register } from '../controller/user.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logOut);
router.get('/',isAuthenticated, getOtherUsers);

export default router;
 
