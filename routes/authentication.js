import express from "express";
import {getUserByEmail} from "../userControll.js";
import { generateToken, User } from "../userModal.js";
import { Color } from "../colorModal.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";



const router = express.Router();

const transporter = nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
    }
})

router.post("/register", async (req, res) => {
    try{
        if (!req.body.email) {
            return res.status(400).send({ message: "Email is required" });
        }
        let user = await getUserByEmail(req);
        console.log(user)
        if(user){
            res.status(400).send({message:"User Already Exist!"})
        }

        const salt = await bcrypt.genSalt(13);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        user = await new User({
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            password: hashedPassword
        }).save();

        const token = generateToken(user._id);
        res.status(201).send({message:"User Registration Completed.", user, token});

    }catch(error){
        res.status(500).send(error.message);
    }
});

router.post("/login", async (req, res) => {
    try{
        const user = await getUserByEmail(req);
        if(!user){
            return res.status(404).send({message:"Please check your Email"});
        }

        const validatePassword = await bcrypt.compare(req.body.password, user.password);
        if(!validatePassword){
            return res.status(404).send({message:"Invalid Password"});
        }

        const token = generateToken(user._id);
        res.status(200).send({message:"Logged in Successfully", token});
        ``
    }catch(error){
        res.status(500).send({message:"Internal Server Error", error});
    }
});

router.post("/forgotPassword", async (req, res) => {
    try{
        const {email} = req.body;
        if(!email){
            res.status(400).send({message:"Email is Required"});
        }
        const user = await User.findOne({email});
        if(!user){ 
            res.status(404).send({message:"User Not Found"});
        }
        const resetToken = jwt.sign({id:user._id}, process.env.SECRET_KEY, {expiresIn:"1h"});
        const resetLink = `http://localhost:3000/resetpassword/${resetToken}`;

        const mailOptions= {
            from: process.env.ADMIN_EMAIL,
            to: user.email,
            subject: "Password reset Request",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.Please copy this token and past token input field to update the password.(This link will expire in 1 hour). ${resetToken}</p>`
        };
         await transporter.sendMail(mailOptions);
         res.status(200).send({message:"Password reset request sent to your MailID"})
    }catch(error){
        res.status(500).send(error.message);
    }
});

router.post("/resetPassword/:token", async (req, res) => {
    try{
        const {token} = req.params;
        const {password} = req.body;

        if(!password){
            return res.status(400).send({ message: "New password is required" });
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decode.id);

        if(!user){
            return res.status(404).send({ message: "Invalid or expired token" });
        }

        const salt = await bcrypt.genSalt(13);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.status(200).send({ message: "Password reset successful!" })
    }catch(error){
        res.status(500).send(error.message)
    }
});

router.post("/saveColor", async (req, res) => {
    try{
        const {name, link, dresstype} = req.body;
        if (!name) {
            return res.status(400).send({ message: "Color name is required" });
        }else if(!link){
            return res.status(400).send({ message: "Link is required" });
        }else if(!dresstype){
            return res.status(400).send({ message: "Dress type is required" });
        }

        const newColor = new Color({name, link, dresstype});
        await newColor.save();
        res.status(201).send({ message: "Color saved successfully!", color: newColor });
    }catch(error){
        res.status(500).send(error.message);
    }
})

router.get("/colors",  async (req, res) => {
    try{
        const count = await Color.countDocuments();
        if(count === 0){
            return res.status(404).send({ message: "No colors found" });
        }
        const randomIndex = Math.floor(Math.random() * count);
        const randomColor = await Color.findOne().skip(randomIndex);
        res.status(200).send({randomColor });

    }catch(error){
        res.status(500).send(error.message);
    }
});

export const userAuthRouter = router;