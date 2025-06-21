import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import DbConnection from './database/db.js';
import router from './routes/auth.js';
import cookieParser from 'cookie-parser';

dotenv.config();


const app=express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));
app.use(express.json());
app.use('/api/auth',router);
app.use(cookieParser());
const port=process.env.PORT;

DbConnection();

app.listen(port,(req,res)=>{
    console.log(`Listening on port ${port}`)
})