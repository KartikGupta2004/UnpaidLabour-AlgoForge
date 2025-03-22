import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import  Individual from "../models/indivisual_users.js";
import  Kitchen  from "../models/Kitchens.js"
import  Ngo  from "../models/Ngo.js";
import validator from "validator";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Login Controller
const loginController = async (req, res) => {
  try {
    // if (req.body.googleToken) {
    //   const googleToken = req.body.googleToken;
    //   const role = req.body.role;
    //   // Verify Google token
    //   const ticket = await client.verifyIdToken({
    //     idToken: googleToken,
    //     audience: process.env.GOOGLE_CLIENT_ID,
    //   });
    //   const payload = ticket.getPayload();

    //   if (!payload) {
    //     return res.status(400).send({ message: "Google Auth Failed", success: false });
    //   }

    //   // Check if user exists based on Google email
    //   let existingUser = await user.findOne({ email: payload.email });

    //   // If user doesn't exist, create a new user
    //   if (!existingUser) {
    //     existingUser = new user({
    //       email: payload.email,
    //       name: payload.name,
    //       password: "", // Google doesn't need a password
    //       authProvider: 'google',
    //       role : role
    //     });
    //     await existingUser.save();
    //   }

    //   // Generate JWT for authentication
    //   const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
    //     expiresIn: "1d", // Token expires in 1 day
    //   });

    //   res.status(200).json({
    //     success: true,
    //     message: "Logged in successfully with Google",
    //     token,
    //     userType: role, // Based on role
    //   });

    // } else {
      // Email/password login
      const { email, password, role } = req.body;
      const existingUser = await Individual.findOne({ email }) || await Kitchen.findOne({ email }) || await Ngo.findOne({ email });
      
      if (!existingUser) {
        return res.status(400).send({ message: "Invalid Email", success: false });
      }

      // Check if password matches (hashed password)
      const isMatch = await bcrypt.compare(password, existingUser.password);

      if (!isMatch) {
        return res.status(400).send({ message: "Invalid Password", success: false });
      }

      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.status(200).json({
        success: true,
        message: "Logged in successfully",
        token,
        userType: role,
      });
    // }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in", success: false });
  }
};

// Register Controller
const registerController = async (req, res) => {
  try {
    const { email, password, role, name, location, contact, fssaiId } = req.body;
    console.log("\n\n\nname: ",name);
    
    if (!validator.isEmail(email)) {
      return res.status(400).send({ message: "Invalid email format", success: false });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).send({
        message:
          "Password must contain at least 8 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 symbol",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;
    let existingUser;

    if (role === "individual") {
      existingUser = await Individual.findOne({ email });
      if (existingUser) return res.status(400).send({ message: "Email already in use", success: false });

      newUser = new Individual({
        name : name, // Fixed field name
        email,
        password: hashedPassword,
        contact,
        location,
        role
      });
    } else if (role === "kitchen") {
      existingUser = await Kitchen.findOne({ email });
      if (existingUser) return res.status(400).send({ message: "Email already in use", success: false });

      newUser = new Kitchen({
        fssaiId, // Fixed required field
        email,
        password: hashedPassword,
        location,
      });
    } else if (role === "ngo") {
      existingUser = await Ngo.findOne({ email });
      if (existingUser) return res.status(400).send({ message: "Email already in use", success: false });

      newUser = new Ngo({
        ngoId: name, // Assuming NGO name is stored in ngoId
        email,
        password: hashedPassword,
        location,
        contact,
      });
    } else {
      return res.status(400).send({ message: "Invalid role", success: false });
    }

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      success: true,
      message: "Signed up successfully",
      token,
      userType: role,
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};


// Auth Controller (for getting user info)
// const authController = async (req, res) => {
//   console.log(req.body)
//   try {
//     const users = await user.findById({ _id: req.body.userId });
//     if (!users) {
//       return res.status(200).send({
//         message: "User not found",
//         success: false,
//       });
//     }
//     res.status(200).send({
//       success: true,
//       data: {
//         name: users.name,
//         email: users.email,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       message: "Auth error",
//       success: false,
//       error,
//     });
//   }
// };

export { loginController, registerController};
