import express from "express"
import { updateUser,deleteUser } from "../controllers/userController.js";

const userRouter=express.Router();

userRouter.patch('/:id',updateUser);

userRouter.delete('/:id',deleteUser)

export default userRouter;