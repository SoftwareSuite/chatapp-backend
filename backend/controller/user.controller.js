import { User } from "../model/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const {fullName, username, password, confirmPassword, gender} = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({message:"All fields are required"})
        }
        if (password !== confirmPassword) {
            return res.status(400).json({message: "password do not match"});
        }
        const user = await User.findOne({username});
        if (user) {
            return res.status(400).json({message: "Username already exists, use another one."});
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        await User.create({
            fullName, 
            username,
            password: hashedPassword,
            profilePhoto: gender === 'male' ? maleProfilePhoto : femaleProfilePhoto,
            gender
        })

        return res.status(200).json({message: 'Account created successfully', success: true });

    } catch (error) {
      console.log(error);
    }};


export const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        if (!username || !password) {
            return res.status(400).json({message:"All fields are required"})
        }
        const user = await User.findOne({username});
        if (!user) {
            return res.status(400).json({message:"User does not exist, Please sign up", success: false})
        } 

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({message:"Invalid Credentials", success: false})
        }
        const tokenData =  {
            userId: user._id
        }

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {expiresIn: "1d"})
        return res.status(200).cookie("token", token, {httpOnly: true, sameSite: "strict"}).json({
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            profilePhoto: user.profilePhoto
        })

    } catch (error) {
        console.log(error);
        
    }
};

export const logOut = (req, res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge: 0}).json({
            message: "User logged out"
        })    
    } catch (error) {
        console.log(error);   
    }
};

export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({_id:{$ne: loggedInUserId}}).select("-passwors");
        return res.status(200).json(otherUsers);
    } catch (error) {
        console.log(error);
        
    }
};