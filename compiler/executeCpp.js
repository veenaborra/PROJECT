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
    exec(`g++ ${filePath} -o ${outPath} &&  ${outPath} < ${inputFilePath}` ,{timeout:5000},(error,stdout,stderr)=>{
        if(error){
           return  reject({
                killed:error.killed,
                code:error.code,
                stderr,
                message:error.message,
                type:"execution_err"
            });
        }
         if(stderr){
           return  reject({stderr,type:"std_err"});
         }
         
         resolve(stdout);
    })
})
}
export default executeCpp;