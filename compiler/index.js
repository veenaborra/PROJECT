import express from 'express'
import dotenv from 'dotenv'
import generateFile from './generateFile.js';
import executeCpp from './executeCpp.js';
import generateInputFile from './generateInputFile.js';
import generateAiResponse from './generateAiResponse.js';
import cors from 'cors'
import { authMiddleware } from './authMiddleware.js';
import cookieParser from 'cookie-parser';
import fs from 'fs/promises'
import path from 'path';
import { fileURLToPath } from 'url';





const app=express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

dotenv.config();
const port=process.env.PORT || 8080;

app.use(cors({
    origin:["http://localhost:5173","http://localhost:8000"],
    credentials:true,
}));

app.get('/',(req,res)=>{
res.send("hello world")
})
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);   

const outputPath=path.join(__dirname,"outputs");
//run
app.post('/run',authMiddleware,async(req,res)=>{
  
    const {code,language='cpp',input}=req.body;
   if(code===undefined){
    return res.status(400).json({success:false,details:"empty code body"});
   }
   let inputFilePath;
   let outPath;
   let filePath;
   try{
    filePath=generateFile(language,code);
   const jobId=path.basename(filePath).split(".")[0];
   const outputFilename=`${jobId}.out`
   outPath=path.join(outputPath,outputFilename);

   inputFilePath=await generateInputFile(input);
   const output=await executeCpp(filePath,inputFilePath);
   
   return res.json({output})
   }
  catch (err) {
    console.log(err.type,err.message);
    if (err.type === "time_limit_exceeded") {
        return res.status(422).json({ 
            error: err.message, 
            details: err.details,
        });
    }

    if (err.type === "compiler_error") {
        return res.status(400).json({
            error: err.message,
            details: err.details,
        });
    }

    if (err.type === "execution_err") {
        return res.status(500).json({
            error: err.message,
            details: err.details,
        });
    }

    if (err.type === "std_err") {
        return res.status(500).json({
            error: err.message,
            details: err.details,
        });
    }

   
    return res.status(500).json({
        error: "An unexpected error occurred on the server.",
        details:"Internal Server Error",
    });
}
finally{
  try{
   if(inputFilePath) await fs.unlink(inputFilePath);
    if (outPath) await fs.unlink(outPath);
    if(filePath) await fs.unlink(filePath);
  }
  catch(err){
    console.error("file cleanup failed :",err.message);
  }
} });



//submit
app.post('/submit',(req, res, next) => {
  const token = req.headers['x-internal-token'];
  if (token !== process.env.INTERNAL_SECRET) {
    return res.status(401).json({ error: 'Unauthorized internal access' });
  }
  next();
},async(req,res)=>{
    const {language,code,testcases}=req.body;
    let filePath,relativePath;
  let outPath;
  const inputPaths = [];
  const startTime = Date.now();
    try{
    
         filePath=generateFile(language,code);
         relativePath = path.relative(path.join(__dirname, 'codes'), filePath); 
        
         const jobId = path.basename(filePath).split(".")[0];
         const outputFilename = `${jobId}.out`;
         const outputPath=path.join(__dirname,"outputs");
         outPath = path.join(outputPath, outputFilename);
         
        let output = '';
        let failedTests=[];
       
      
        for (let i = 0; i < testcases.length; i++) {
            const inputPath = await generateInputFile(testcases[i].input);
            inputPaths.push(inputPath);
        
            const execResult = await executeCpp(filePath, inputPath);
          
            const actual = execResult ? execResult.trim() : '';
            const expected = testcases[i].expectedOutput.trim();
     
            if (actual !== expected) {
             
              failedTests.push({
                index: i,
                input: testcases[i].input,
                expected,
                actual
              });
            
            }
          }
          const endTime = Date.now();
          const executionTime = endTime - startTime;
          console.log(executionTime);
          const result =failedTests.length === 0 ? 'Accepted' : 'Wrong Answer';
          console.log(relativePath,result);
          res.json({ relativePath, result, output, failedTests,executionTime});


    }
    catch (err) {
      // Handling timeout (from exec's { timeout: 5000 } option)
      const executionTime = Date.now() - startTime;
      if (err.type === "time_limit_exceeded") {
        return res.status(422).json({
          error: "Time Limit Exceeded",
          details: "Your code took too long to execute.",
          executionTime
        });
      }
      // Handling compiler errors
      if (err.stderr  && err.code !== 0) {
        return res.status(400).json({ 
          error: 'Compiler Error', 
          details: err.details ,
          executionTime
        });
      }
    
       // Handling other execution errors
  if (err.type === "std_err") {
    return res.status(500).json({
      error: "Execution Error",
      details: err.details || "Unknown execution error"
    });
  }
  if (err.type === "execution_err") {
    return res.status(500).json({
      error: "Execution Error",
      details: err.details|| "Runtime error during code execution",
      executionTime
    });
  }

  return res.status(500).json({
    error: "Unknown Error",
    details: err.message || "An unexpected error occurred",
    executionTime
  });
     

}
finally {
  try {
    for (const inputPath of inputPaths) {
      await fs.unlink(inputPath);
    }
    if (outPath) await fs.unlink(outPath); 
  } catch (cleanupErr) {
    console.error("File cleanup failed:", cleanupErr.message);
  }
}
})

//ai review

app.post('/ai-review',authMiddleware,async(req,res)=>{
  const {code,title,description,constraints}=req.body;
  if (code === undefined) {
    return res.status(404).json({ success: false, error: "Empty code! Please provide some code to review" });
}
  try{
const aiResponse=await generateAiResponse(code,title,description,constraints);
res.json({
  success:true,
  aiResponse
})
  }
  catch(err){
console.log("error executing code:",err.message)
return res.status(500).json({ success: false, error: "Failed to get AI review response" });
}

  }
)

//code

app.get('/code',authMiddleware, async (req, res) => {
  try {
    const relativePath = req.query.path;

    if (!relativePath) {
      return res.status(400).json({ error: 'Missing file path' });
    }

    const codesDir = path.join(__dirname, 'codes');
    const fullPath = path.normalize(path.join(codesDir, relativePath));

   
    if (!fullPath.startsWith(codesDir)) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const code = await fs.readFile(fullPath, 'utf-8');
    res.json({ code });
  } catch (err) {
    console.error('Error reading code file:', err.message);
    res.status(500).json({ error: 'Could not read code file' });
  }
});



app.listen(port,(req,res)=>{
    console.log(`Listening on port ${port}`)
})