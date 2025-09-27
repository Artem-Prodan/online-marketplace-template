//roleMid

const jwt = require("jsonwebtoken");
const {secret} = require("../Controllers/config");

//a function that checks if user's role have permisions to do something
module.exports = function(roles){
    return function(req,res,next){

const token = (req.headers.authorization|| "").replace(/Bearer\s?/,"");
        if(token){
            try{
                const decoded = jwt.verify(token, secret);
                req.userId = decoded.id;
                req.roles = decoded.roles;

                let hasRole = decoded.roles.some(role => roles.includes(role));

                if(!hasRole){
                    return res.status(403).json({message:"no access"})
                }
                next();
            }catch(err){
                return res.status(403).json({
                message: "No access",
            });
            }
        } else {
            return res.status(403).json({
                message: "No access",
            });
        }
    }
};