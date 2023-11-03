var jwt = require("jsonwebtoken");

const fetchdata = (req, res, next)=>{
    const token = req.header("auth-token");
    if(!token){
        res.status(401).send({error : "kindly authenticate using a valid token"})
    }
    try{
        
        const data = jwt.verify(token , "youcantguessit");
        req.user = data.user
        next();
    }
    catch(error){
        res.status(401).send({error : "internal server error"})
    }
}

module.exports = fetchdata;