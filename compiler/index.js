import express from 'express'
import dotenv from 'dotenv'
import generateFile from './generateFile.js';
import executeCpp from './executeCpp.js';
import generateInputFile from './generateInputFile.js';
import generateAiResponse from './generateAiResponse.js';
import cors from 'cors'





const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

dotenv.config();
const port=process.env.PORT;

app.use(cors({
    origin:["http://localhost:5173","http://localhost:8000"],
    credentials:true,
}));

app.get('/',(req,res)=>{
res.send("hello world")
})

//run
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
   catch (error) {
    res.status(500).json({
      error: 'Compiler Error',
      details: error.stderr || error.message || 'Unknown compiler error'
    });
  }
})



//submit
app.post('/submit',async(req,res)=>{
    const {language,code,testcases}=req.body;
    try{

        const filePath=generateFile(language,code);
        
        let output = '';
        let failedTests=[];
       

        for (let i = 0; i < testcases.length; i++) {
            const inputPath = await generateInputFile(testcases[i].input);
            const execResult = await executeCpp(filePath, inputPath);
      console.log(filePath,inputPath)
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
          const result =failedTests.length === 0 ? 'Accepted' : 'Wrong Answer';
          res.json({ filePath, result, output, failedTests});


    }
    catch (err) {
      // Handling timeout (from exec's { timeout: 5000 } option)
      if (err.type === "execution_err" && err.killed) {
        return res.status(408).json({
          error: "Time Limit Exceeded",
          details: "Your code took too long to execute."
        });}
    
      // Handling compiler errors
      if (err.stderr  && err.code !== 0) {
        return res.status(400).json({ 
          error: 'Compiler Error', 
          details: err.stderr 
        });
      }
    
       // Handling other execution errors
  if (err.type === "std_err") {
    return res.status(500).json({
      error: "Execution Error",
      details: err.stderr || "Unknown execution error"
    });
  }
  return res.status(500).json({
    error: "Unknown Error",
    details: err.message || "An unexpected error occurred"
  });
     

}
})

//ai review

app.post('/ai-review',async(req,res)=>{
  const {code,title,description,constraints}=req.body;
  if (code === undefined) {
    return res.status(404).json({ success: false, error: "Empty code!PLease provide some code to review" });
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
  }
})









app.listen(port,(req,res)=>{
    console.log(`Listening on port ${port}`)
})