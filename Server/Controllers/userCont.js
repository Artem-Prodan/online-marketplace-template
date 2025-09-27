//userCont

const {User, ShopCart} = require("../Models/models");
const ApiError = require("../errors/apiError");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")
const {secret} = require("./config")
const { generateAccessToken } = require("../utils/token");


class UserCont {

    async registration(req, res) {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:"registration error", errors: errors.array()})
        }

        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const candidate = await User.findOne({ where: { email } });

        if (candidate) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashPassword = bcrypt.hashSync(password, 7);
          const user = await User.create({ 
                email, 
                password: hashPassword, 
                role: role || "USER"
            });
        await ShopCart.create({ userId: user.id });
        return res.json({ message: "User registered successfully" });

    } catch (e) {
        console.log(e);
        res.status(400).json({ message: "Registration error" });
    }
}



    async login(req,res){
        try{
            const {email, password} = req.body
            const user = await User.findOne({where:{email}})
           
            if(!user){
                return res.status(400).json({message: `User ${email} not found`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if(!validPassword){
                return res.status(400).json({message: "Invalid credentials"})
            }

            const token = generateAccessToken(user.id,[user.role])
            return res.json({token})
        }catch(e){
            console.log(e);
           res.status(500).json({ message: "Login error" });
        }
        
    }

   
//get users
  // get all users
async check(req, res, next) {
    try {
        const users = await User.findAll({
            attributes: ["id", "email", "role"]
        });

        return res.json(users);
    } catch (e) {
        console.log(e);
        return next(ApiError.internal("Failed to get users"));
    }
}


async update(req, res, next) {
    try {
        const { id } = req.params;
        const { email, password, role } = req.body;

        // find user by ID
        const user = await User.findByPk(id);
        if (!user) {
            return next(ApiError.badRequest(`User with id ${id} not found.`));
        }

        // user can update only his credentials not others
        if (req.userId !== user.id && !req.roles.includes("ADMIN")) {
            return res.status(403).json({ message: "No access" });
        }

        // email updating
        if (email) {
            const existing = await User.findOne({ where: { email } });
            if (existing && existing.id !== +id) {
                return res.status(400).json({ message: "Email is already taken" });
            }
            user.email = email;
        }

        // password updating
        if (password) {
            if (password.length < 4 || password.length > 10) {
                return res.status(400).json({ message: "Password must be 4-10 characters long" });
            }
            user.password = bcrypt.hashSync(password, 7);
        }

        // only admin can change the role
        if (role) {
            if (!req.roles.includes("ADMIN")) {
                return res.status(403).json({ message: "Only admin can change roles" });
            }
            user.role = role;
        }

        await user.save();
        return res.json({ message: `User with id ${id} updated successfully` });

    } catch (e) {
        console.error("UPDATE ERROR:", e);
        return next(ApiError.internal("Failed to update user"));
    }
}


    
   async delete(req, res, next) {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return next(ApiError.badRequest(`User with id ${id} not found.`));
        }

        await user.destroy(); //  cart will delete automaticly with the user

        return res.json({ message: `User with id ${id} has been deleted.` });
    } catch (error) {
        console.error(error);
        return next(ApiError.internal('Deleting user failed'));
    }
}


}

module.exports = UserCont;