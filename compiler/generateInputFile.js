import fs from 'fs';
import path from 'path';
import {v4 as uuidv4} from 'uuid';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);        

const inputDir=path.join(__dirname,"inputs");

if (!fs.existsSync(inputDir)) {
    fs.mkdirSync(inputDir, { recursive: true });
}

const generateInputFile=async(input)=>{
const jobId=uuidv4();
const input_filename = `${jobId}.txt`;
const input_filePath=path.join(inputDir,input_filename);
await fs.writeFileSync(input_filePath, input);
return input_filePath;
};



export default generateInputFile;