const SalesRep = require("../models/salesRep.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../middleware/error");

//login
const generateToken = (salesRep, secret, expiresIn) => {
  return jwt.sign({ id: salesRep._id }, secret, { expiresIn });
};

exports.loginSalesRep = async (req, res, next) => {
  try {
    const { name, password } = req.body;

    // Check if all required fields are present
    if (!name || !password) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    // Find the user by name
    const salesRep = await SalesRep.findOne({ email:name });
    if (!salesRep) {
      return next(errorHandler(400, "Invalid credentials"));
    }

    // Compare hashed password with provided password
    const isMatch = await bcrypt.compare(password, salesRep.password);
    if (!isMatch) {
      return next(errorHandler(400, "Invalid credentials"));
    }

    // Generate access token
    const accessToken = generateToken(
      salesRep,
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRES_IN
    );

    return res
      .status(200)
      .json({ message: "Login successful", accessToken, salesRep });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

exports.getSalesRepById = async (req, res) => {
  const salesRepId = req.params.salesRepId; // Extracts the salesRep ID from the request parameters
  try {
    const salesRep = await SalesRep.findById(salesRepId); // Queries the database for the salesRep by ID

    if (!salesRep) {
      return res.status(404).json({ message: "SalesRep not found" }); // Returns a 404 status if the salesRep isn't found
    }

    res.status(200).json(salesRep); // Returns the salesRep data with a 200 status if found
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid SalesRep ID' });
    }
    res.status(500).json({ message: "Server error", error: error.message }); // Handles any server errors
  }
};

