const User = require("../models/owner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../middleware/error");

//register
exports.registerUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if all required fields are present
    if (!username || !password) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(errorHandler(400, "Username already exists"));
    }

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the hashed password
    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

//login
const generateToken = (user, secret, expiresIn) => {
  return jwt.sign({ id: user._id }, secret, { expiresIn });
};

exports.loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if all required fields are present
    if (!username || !password) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return next(errorHandler(400, "Invalid credentials"));
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(errorHandler(400, "Invalid credentials"));
    }

    // Generate access token
    const accessToken = generateToken(
      user,
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRES_IN
    );

    return res.status(200).json({ message: "Login successful", accessToken });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

// Verify token middleware
exports.verifyToken = (req, res, next) => {
  // Retrieve token from the Authorization header
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  // Extract the token from the Bearer scheme
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Bearer token missing" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    res.status(200).json({ message: "Token is valid", user });
  });
};
