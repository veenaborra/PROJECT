import express from 'express';
import { signUp,logIn} from '../controllers/authController.js';

const authRouter=express.Router();

authRouter.post('/signup',signUp);

authRouter.post('/login',logIn);


export default authRouter;