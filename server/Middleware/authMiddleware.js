import jwt from 'jsonwebtoken';



export const authMiddleware=(req,res,next)=>{
    try{
        console.log("🛡️  authMiddleware triggered"); 
const token=req.cookies.token;
if(!token){
    return res.status(401).json({ error: 'Access denied. No token provided.' });
}
 const userInfo=jwt.verify(token,process.env.JWT_SECRET);
 console.log("Decoded token:", userInfo);

 req.user=userInfo;
 req.userId=userInfo.userId;
 console.log("✅ Auth passed:", userInfo);
 next();
}
catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
}