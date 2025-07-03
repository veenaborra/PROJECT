import express from 'express'
import dotenv from 'dotenv'
import generateFile from './generateFile.js';
import executeCpp from './executeCpp.js';
import generateInputFile from './generateInputFile.js';
import cors from 'cors'




const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

dotenv.config();
const port=process.env.PORT;

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));

app.get('/',(req,res)=>{
res.send("hello world")
})


app.post('/run',async(req,res)=>{
    const {code,language='cpp',input}=req.body;
   if(code===undefined){
    return res.status(400).json({success:false,Error:"empty code body"});
   }
   try{
   const filePath=generateFile(language,code);
   const inputFilePath=await generateInputFile(input);
   const output=await executeCpp(filePath,inputFilePath);
   res.json({filePath,inputFilePath,output})}
    catch(error){
        res.status(500).json({success:false,error:error.message});
    }
})



app.listen(port,(req,res)=>{
    console.log(`Listening on port ${port}`)
})