const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {

    const { username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
    return res.status(400).json({
        message: "Please enter a valid email"
    });
}

    const existingUser = await User.findOne({
        email
    });

    if (existingUser) {
    return res.status(409).json({
        message: "User already exists"
    });
}

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });

    const token = jwt.sign(
    {
        id: user._id
    },
    process.env.JWT_SECRET
);

   return res.status(201).json({
    message: "User Registered Successfully",
    token,
    user
});


}

async function loginUser(req, res) {
   const { email, password } = req.body;

   const user = await User.findOne({
    email
});

    if (!user) {
    return res.status(401).json({
        message: "Invalid email or password"
    });
}

    const isMatch = await bcrypt.compare(
    password,
    user.password
);

    if (!isMatch) {
    return res.status(401).json({
        message: "Invalid email or password"
    });
}

    const token = jwt.sign(
    {
        id: user._id
    },
    process.env.JWT_SECRET
);

    return res.status(200).json({
    message: "Login Successful",
    token,
    user
});

}

async function getProfile(req, res) {
    return res.status(200).json({
        message: "Profile accessed successfully",
        user: req.user
    });
}

module.exports = { registerUser , loginUser , getProfile };