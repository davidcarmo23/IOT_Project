const jwt = require('jsonwebtoken');
const {TOKEN_SECRET} =  require("../../env")

const verifyToken=(req,res,next)=>{
    const token = req.headers["x-access-token"];
    if(!token){
        return res.status(403).json("token é necessário para Autenticação");   
    }

    try{
        const decode = jwt.verify(token, TOKEN_SECRET);
        req.user = decode;
    } catch(err){
        return res.status(401).json("Token Inválido");
    }
    return next();
}

module.exports=verifyToken;