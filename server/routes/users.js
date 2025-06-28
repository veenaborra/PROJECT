import express from "express"
import { updateUser,deleteUser,readUser } from "../controllers/userController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";
const userRouter=express.Router();

userRouter.get('/me',authMiddleware,readUser);
userRouter.patch('/:id',updateUser);

userRouter.delete('/:id',deleteUser)

export default userRouter;