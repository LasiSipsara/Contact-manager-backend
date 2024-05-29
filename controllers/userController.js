const asyncHandler=require("express-async-handler");
const User=require("../models/userModel");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
//@desc Register new user
//@route POST /api/users/register
//@access public

const registerUser=asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body;
    if(!username||!email||!password){
        res.status(400);
        throw new Error("All fields are mandetory");
    }
    const userAvailable=await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("Email has alredy taken");
    }
    //hash password
    const hashPassword= await bcrypt.hash(password,10);
    console.log("hashed password:",hashPassword);

    const user=await User.create({
       username,
       email,
       password:hashPassword, 
    });
    console.log("user created",user);
    if(user){
        res.status(201).json({_id:user.id,uesrname:user.username,email:user.email});
    }else{
        res.status(400);
        throw new Error("registration unsuccessfull");
    }
    
});



//@desc login user
//@route POST /api/users/login
//@access public

const loginUser=asyncHandler(async(req,res)=>{
    const{email,password}=req.body;
    if(!email||!password){
        res.status(400);
        throw new Error("All fields are mandetory");
    }

    const user= await User.findOne({email});
    if(user && (await bcrypt.compare(password,user.password)) ){
        const accessToken=jwt.sign({
            user:{
                username:user.username,
                email:user.email,
                id:user.id,
            }
        },process.env.ACCESS_TOKEN_SECRET,
          {expiresIn:"30m"});
        res.status(200).json({accessToken});
        throw new Error("Your email or password is not valid");
    }else{
        res.status(401);

    }

   
});

//@desc current user information
//@route GET/api/users/current
//@access private

const currentUser=asyncHandler(async(req,res)=>{
    res.json(req.user);
});



module.exports={registerUser,loginUser,currentUser}