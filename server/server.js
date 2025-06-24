import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import DbConnection from './database/db.js';
import authRouter from './routes/auth.js';
import problemsRouter from './routes/problems.js';
import userRouter from './routes/users.js';
import cookieParser from 'cookie-parser';

dotenv.config();


const app=express();
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));


app.use(express.json());
//routersss
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/problems',problemsRouter);

const port=process.env.PORT;

DbConnection();

app.listen(port,(req,res)=>{
    console.log(`Listening on port ${port}`)
})