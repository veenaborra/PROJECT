import jwt from 'jsonwebtoken';



export const authMiddleware=(req,res,next)=>{
    try{
const token=req.cookies.token;
if(!token){
    return res.status(401).json({ error: 'Access denied. No token provided.' });
}
 const userInfo=jwt.verify(token,process.env.JWT_SECRET);
console.log(userInfo);
 req.user=userInfo;
 next();
}
catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
}