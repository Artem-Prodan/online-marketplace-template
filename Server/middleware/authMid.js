//authMid

const jwt = require("jsonwebtoken");
const {secret} = require("../Controllers/config");

//a function that decides whether secret information can be transmitted. (if user is authorized)
module.exports = function (req, res, next) {
    const token = (req.headers.authorization|| "").replace(/Bearer\s?/,"");
        
    if(token){
            try{
                const decoded = jwt.verify(token, secret);

                req.userId = decoded.id;
                req.roles = decoded.roles;

                next();
            }catch(err){
                return res.status(401).json({
                message: "Not authorized",
            });
            }
        } else {
            return res.status(401).json({
                message: "Not authorized",
            });
        }
}