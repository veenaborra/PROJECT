import fs from 'fs';
import path from 'path';
import {v4 as uuidv4} from 'uuid';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);        
const codesDir=path.join(__dirname,"codes");
if(!fs.existsSync(codesDir)){
    fs.mkdirSync(codesDir,{recursive:true})
}

const generateFile=(language,code)=>{
  const fileId=uuidv4()
  const fileName=`${fileId}.${language}`;
  console.log(fileName);
  const filePath=path.join(codesDir,fileName);
  fs.writeFileSync(filePath,code);
  return filePath;
}



export default generateFile;