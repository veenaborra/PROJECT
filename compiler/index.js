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
        let result='Accepted';
        let output = '';
        let failedTest = null;

        for (let i = 0; i < testcases.length; i++) {
            const inputPath = await generateInputFile(testcases[i].input);
            const execResult = await executeCpp(filePath, inputPath);
      console.log(filePath,inputPath)
            const actual = execResult ? execResult.trim() : '';
            const expected = testcases[i].expectedOutput.trim();
      
            if (actual !== expected) {
              result = 'Wrong Answer';
              output = actual;
              failedTest = {
                index: i,
                input: testcases[i].input,
                expected,
                actual
              };
              break;
            }
          }
          res.json({ filePath, result, output, failedTest });


    }
    catch (err) {
      console.log("compiler error :",err.stderr)
        res.status(500).json({ error: 'Execution error', details: err.stderr || "unkonown compiler failure" });
      }

})









app.listen(port,(req,res)=>{
    console.log(`Listening on port ${port}`)
})