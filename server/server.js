import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import DbConnection from './database/db.js';
import authRouter from './routes/auth.js';
import problemsRouter from './routes/problems.js';
import userRouter from './routes/users.js';
import cookieParser from 'cookie-parser';
import submitRouter from './routes/submit.js';
import compilerRouter from './routes/compiler.js';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

dotenv.config();


const app=express();
 app.use(cookieParser());
 app.use(cors({
     origin:["http://localhost:5173",'http://localhost:8080','https://www.algonest.online','https://compiler.algonest.online',],
     credentials:true,
 }));
//  app.use(express.static(path.join(__dirname, 'client', 'dist')));

 app.use(express.json());
 //routersss
 app.use('/api/auth',authRouter);
 app.use('/api/user',userRouter);
 app.use('/api/problems',problemsRouter);
 app.use('/api/compiler',compilerRouter);
 app.use('/api/submissions',submitRouter);
//  app.use( (req, res,next) => {
//      if (req.method === 'GET' && !req.path.startsWith('/api')) {
//          res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
//        } else {
//          next();
//        }
//    });
const port=process.env.PORT;

 DbConnection();

 app.listen(port,(req,res)=>{
     console.log(`Listening on port ${port}`)
 })