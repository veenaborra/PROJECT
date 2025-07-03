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
    exec(`g++ ${filePath} -o ${outPath} &&  ${outPath} < ${inputFilePath}` ,(error,stdout,stderr)=>{
        if(error){
            reject({error,stderr});
        }
         if(stderr){
            reject({stderr});
         }
         resolve(stdout);
    })
})
}
export default executeCpp;