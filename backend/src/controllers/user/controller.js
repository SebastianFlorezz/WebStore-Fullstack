const confirmPassword = require("../../utils/confirmPassword")
const { PrismaClient} = require("@prisma/client")
const jwt = require("jsonwebtoken")
const jwtSecret = process.env.JWT_SECRET
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");


    //CHANGE ALL THE JSON RESPONSES

const register = async (req, res) => {
  try {
    const { name, email, password, passwordMatch } = req.body;

    // validate password confirmation
    if (!confirmPassword(password, passwordMatch)){
        return res.status(400).json({ message: "Passwords do not match" });          
    }

    // put ZOD Validations for the inputs



    // user existence check
    const existingUser = await prisma.User.findUnique({
        where: {email}
    })

    if(existingUser){
        return res.status(400).json({ message: "User already exists" });
    }

    // password encryptation
    const hashedpassword = await bcrypt.hash(password, 10)


    // user creation in the database
    const newUser = await prisma.User.create({
        data: {
            name,
            email,
            password: hashedpassword
        }
    })
    await prisma.$disconnect();

    //jwt token generation

    const jwtPayload = {
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email
    }

    const accessToken = jwt.sign(jwtPayload, jwtSecret, { expiresIn: '1h' });

    //json response and http code
    return res.status(201).json({ 
        status: "success",
        timestamp: new Date().toISOString(),
        data: {
            user:{
                userId: newUser.id,
                name: newUser.name,
                email: newUser.email,
                isVerified: false
            },
            tokens: {
                access: accessToken,
                refresh: "to be implemented",
                expires_in: "1h"
            }},
        meta: { version: "1.0.0" },
        error: null
    });    

    // add that when the user is created, he needs to verify his email address
    
  } catch (error){
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" }); // need to change json responses 
  }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // zod validations for email and password
        // to be implemented

        // user existence check 

        const user = await prisma.User.findUnique({
            where: { email }
        });
        
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // password verification
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // jwt token generation
        const jwtPayload = {
            userId: user.id,
            name: user.name,
            email: user.email
        };

        const accessToken = jwt.sign(jwtPayload, jwtSecret, { expiresIn: '1h' });
    
        // json response and http code
        return res.status(200).json({ 
            status: "success",
            timestamp: new Date().toISOString(),
            data: {
                user:{
                    userId: user.id,
                    name: user.name,
                    email: user.email,
                    isVerified: false
                },
                tokens: {
                    access: accessToken,
                    refresh: "to be implemented",
                    expires_in: "1h"
                }},
            meta: { version: "1.0.0" },
            error: null
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}





module.exports = {
    register,
    login
}