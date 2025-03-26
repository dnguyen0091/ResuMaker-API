import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  try {
    console.log("Registering User with:", req.body);

    const { firstName, lastName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    // console.log(userExists.verified);
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
          lastName: user.lastName
        }
      });
    } 
    else
    {
      console.log("User Verification Incomplete:", user);

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

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
  
}
