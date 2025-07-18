import express from "express"
import { updateUser,deleteUser,readUser, getUserStats } from "../controllers/userController.js";
import { optionalAuth} from "../Middleware/optionalAuth.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const userRouter=express.Router();

userRouter.get('/me',optionalAuth,readUser);
userRouter.patch('/:id',authMiddleware,updateUser);

userRouter.delete('/:id',authMiddleware,deleteUser);

userRouter.get('/stats',authMiddleware,getUserStats)

export default userRouter;