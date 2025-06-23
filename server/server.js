import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import DbConnection from './database/db.js';
import authRouterouter from './routes/auth.js';
import router from './routes/users.js';
import cookieParser from 'cookie-parser';

dotenv.config();


const app=express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));
app.use(express.json());
app.use('/api',router);
app.use(cookieParser());
const port=process.env.PORT;

DbConnection();

app.listen(port,(req,res)=>{
    console.log(`Listening on port ${port}`)
})