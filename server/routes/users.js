import express from "express"
import { updateUser,deleteUser } from "../controllers/userController.js";

const userRouter=express.Router();

userRouter.patch('/users/:id',updateUser);

userRouter.delete('/users/:id',deleteUser)

export default userRouter;