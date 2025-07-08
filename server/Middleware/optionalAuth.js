import jwt from 'jsonwebtoken';


export const optionalAuth=(req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        req.user=null;
        return next();
    }
    try {
        const userInfo = jwt.verify(token, process.env.JWT_SECRET);
        req.user = userInfo; 
    
      } catch (err) {
        req.user = null; 
      }
      next();
}