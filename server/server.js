import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import DbConnection from './database/db.js';
import authRouter from './routes/auth.js';
import problemsRouter from './routes/problems.js';
import userRouter from './routes/users.js';
import cookieParser from 'cookie-parser';
import submitRouter from './routes/submit.js';
dotenv.config();


const app=express();
app.use(cookieParser());
app.use(cors({
    origin:["https://www.algonest.online",'https://compiler.algonest.online'],
    credentials:true,
}));


app.use(express.json());
//routersss
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/problems',problemsRouter);
app.use('/api',submitRouter);

const port=process.env.PORT;

DbConnection();

app.listen(port,(req,res)=>{
    console.log(`Listening on port ${port}`)
})