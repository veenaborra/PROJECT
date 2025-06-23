import express from 'express';
import { signUp,logIn} from '../controllers/authController.js';

const authRouter=express.Router();

authRouter.post('/auth/signup',signUp);

authRouter.post('/auth/login',logIn);


export default authRouter;