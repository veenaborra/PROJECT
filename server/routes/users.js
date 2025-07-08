import express from "express"
import { updateUser,deleteUser,readUser } from "../controllers/userController.js";
import { optionalAuth} from "../Middleware/optionalAuth.js";
const userRouter=express.Router();

userRouter.get('/me',optionalAuth,readUser);
userRouter.patch('/:id',updateUser);

userRouter.delete('/:id',deleteUser)

export default userRouter;