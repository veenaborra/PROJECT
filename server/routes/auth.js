import express from 'express';
import { signUp,logIn} from '../controllers/authController.js';

const router=express.Router();

router.post('/signup',signUp);

router.post('/login',logIn);


export default router;