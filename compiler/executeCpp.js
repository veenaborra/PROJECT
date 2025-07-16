import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {exec} from 'child_process'
import { stderr } from 'process';


const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);   

const outputPath=path.join(__dirname,"outputs");

if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath,{recursive:true})
}
const executeCpp=async(filePath,inputFilePath)=>{
const jobId=path.basename(filePath).split(".")[0];
const outputFilename=`${jobId}.out`
const outPath=path.join(outputPath,outputFilename);

return new Promise((resolve,reject)=>{
    exec(`g++ ${filePath} -o ${outPath} &&  ${outPath} < ${inputFilePath}` ,{timeout:3000},(error,stdout,stderr)=>{
        const cleanedStderr = (stderr || "").replace(/\/.*\/codes\/.*?\.cpp/g, 'main.cpp');
        
  if (error) {
    console.error("Execution error:", error.message);

    if (error.killed && error.signal === 'SIGTERM' ){
        // Time Limit Exceeded)
        return reject({
            type: "time_limit_exceeded",
            message: "Execution timed out",
            details: "Execution timed out. Your code took too long to run.", 
        });
    }

    if (stderr && error.code !== 0) {
        // Compilation failed
        if (cleanedStderr.includes("undefined reference to `main'")) {
            return reject({
                type: "compiler_error",
                stderr,
                message: "Missing main function",
                details: "Your code must contain a 'main' function as the entry point.",
            });
        }
    
        return reject({
            type: "compiler_error",
           stderr,
            message: "Compilation failed",
            details: cleanedStderr, 
        });
    }

    // Other execution errors
    return reject({
        type: "execution_err",
     stderr: cleanedStderr,
        message: error.message,
        details: cleanedStderr|| error.message || "An unexpected runtime error occurred.", // Provide a more useful detail
    });
}

// Edge case: some programs output to stderr even if no error (e.g., warnings treated as errors)
if (stderr) {
   
    return reject({
        type: "std_err", 
        stderr,
        message: "Program produced output to stderr.",
        details: cleanedStderr, 
    });
}

resolve(stdout);
});
})
}
export default executeCpp;