import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import VCode from '../models/VCode.js';
import dotenv from 'dotenv';
import { mailOptions } from '../models/Mailing.js'

dotenv.config();

export const registerUser = async (req, res) => {
  try {
    console.log("Registering User with:", req.body);

    const { firstName, lastName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      if (userExists.verified == true)
      {
        console.log("Register failed: User exists and is verified");
        return res.status(400).json({ message: 'User already exists' });
      }
      else
      {
        await User.findOneAndDelete({ email });
        console.log("Old document removed. Creating new user...")
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed:", hashedPassword);

    const user = await User.create({
      firstName,
      lastName,
      password: hashedPassword,
      email
    });

    console.log("User Created:", user);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const vExists = await VCode.findOne({ email });
      if (vExists)
      {
        await VCode.findOneAndDelete({ email });
        console.log("Old verification code removed. Creating new code...")
      }
      
      var newCode = 0;
      while (newCode == 0 || (await VCode.findOne({ newCode })))
        newCode = Math.floor(Math.random() * 899999 + 100000);
      const vcode = VCode.create({
        verificationCode: newCode,
        email,
        used: false
      });

      const transporter = nodemailer.createTransport({
        host: "mail.smtp2go.com",
        port: 2525,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD
        },
      });
  
      transporter.verify(function (error, success) {
        if (error) {
          console.log("SMTP authentication failed", error);
          res.status(401).json({ message: "SMTP authentication failed", error })
        }
        else {
          console.log("SMTP authenticated");
        }
      });
  
      transporter.sendMail(mailOptions(newCode, email), function(error, res) {
        if(error){
          console.log(error);
        } else {
          console.log("Message sent!");
        }
      });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
        }
      });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  console.log("Verifying User with:", req.body);

  try
  {
    const { email, verificationCode } = req.body;

    const vcode = await VCode.findOne({ email });
    if (vcode.used == true)
    {
      console.log("Code already processed");
      return res.status(400).json({ message: 'Code already processed' });
    }

    if (vcode.verificationCode == verificationCode)
    {
      await User.updateOne({ email }, { verified: true});
      await VCode.updateOne({ email }, { used: true});
      const user = await User.findOne({ email });
      console.log("User Successfully Verified:", user);

      res.status(200).json({
        message: 'User Successfully Verified',
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          verified: user.verified
        }
      });
    }
    else
    {
      console.log("Invalid credentials");
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  }
  catch (error)
  {
    console.log("Error in verifyEmail:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export const loginUser = async (req, res) => {
  console.log("Registering User with:", req.body);

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.verified == true)
    {
      console.log("User Logged In:", user);

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          verified: user.verified
        }
      });
    } 
    else
    {
      console.log("User Verification Incomplete:", user);

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      const vExists = await VCode.findOne({ email });
      if (vExists)
      {
        await VCode.findOneAndDelete({ email });
        console.log("Old verification code removed. Creating new code...")
      }
      
      var newCode = 0;
      while (newCode == 0 || (await VCode.findOne({ newCode })))
        newCode = Math.floor(Math.random() * 899999 + 100000);
      const vcode = VCode.create({
        verificationCode: newCode,
        email,
        used: false
      });

      const transporter = nodemailer.createTransport({
        host: "mail.smtp2go.com",
        port: 2525,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD
        },
      });
  
      transporter.verify(function (error, success) {
        if (error) {
          console.log("SMTP authentication failed", error);
          res.status(401).json({ message: "SMTP authentication failed", error })
        }
        else {
          console.log("SMTP authenticated");
        }
      });
  
      transporter.sendMail(mailOptions(newCode, email), function(error, res) {
        if(error){
          console.log(error);
        } else {
          console.log("Message sent!");
        }
      });

      res.status(202).json({
        message: 'Login incomplete',
        token,
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    }
  } catch (error) {
    console.log("Error in loginUser:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const checkExists = async (req, res) => 
{
  const { email } = req.body;

  try 
  {
    const userExists = await User.findOne({ email });

    if (userExists)
      return res.status(400).json({ message: "Email already in use" });
    else
      return res.status(202).json({ message: "Email is unique" });         
  }
  catch (error)
  {
    res.status(500).json({ message: "Server error", error});
  }
};


export const forgotPassword = async (req, res) => {
  console.log("Forgot password request for:", req.body);
  const { email } = req.body;

  try
  {
    const user = await User.findOne({ email });
    if (!user)
    {
      console.log("Email not in use");
      return res.status(404).json({ message: "Email not in use" });
    }
    if (user.verified == false)
    {
      console.log("Email not verified");
      return res.status(400).json({ message: "Email not verified. Please re-register" });
    }

    const vExists = await VCode.findOne({ email });
    if (vExists)
    {
      await VCode.findOneAndDelete({ email });
      console.log("Old verification code removed. Creating new code...")
    }

    var newCode = 0;
    while (newCode == 0 || (await VCode.findOne({ newCode })))
      newCode = Math.floor(Math.random() * 899999 + 100000);
    const vcode = VCode.create({
      verificationCode: newCode,
      email,
      used: false
    });

    const transporter = nodemailer.createTransport({
      host: "mail.smtp2go.com",
      port: 2525,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
      },
    });

    transporter.verify(function (error, success) {
      if (error) {
        console.log("SMTP authentication failed", error);
        res.status(401).json({ message: "SMTP authentication failed", error })
      }
      else {
        console.log("SMTP authenticated");
      }
    });

    transporter.sendMail(mailOptions(newCode, email), function(error, res) {
      if(error){
        console.log(error);
      } else {
        console.log("Message sent!");
      }
    });

    res.status(201).json({ message: "Verification code created"});
  }
  catch (error)
  {
    res.status(500).json({ message: "Server error", error});
  }
};

export const verifyForgot = async (req, res) => {
  console.log("Verifying User with:", req.body);

  try
  {
    const { email, verificationCode } = req.body;

    const vcode = await VCode.findOne({ email });
    if (vcode.used == true)
    {
      console.log("Code already processed");
      return res.status(400).json({ message: 'Code already processed' });
    }

    if (vcode.verificationCode == verificationCode)
    {
      await VCode.updateOne({ email }, { used: true});
      const user = await User.findOne({ email });
      console.log("User Successfully Verified:", user);

      res.status(200).json({
        message: 'User Successfully Verified',
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    }
    else
    {
      console.log("Invalid credentials");
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  }
  catch (error)
  {
    console.log("Error in verifyEmail:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  const { email, password } = req.body;
  try{
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed:", hashedPassword);

    await User.updateOne({ email }, { password: hashedPassword });
    console.log("Password has been updated");
    const user = await User.findOne({});
    res.status(200).json({ message: 'Password successfully updated'});
  }
  catch (error)
  {
    console.log("Error with updatePassword:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};