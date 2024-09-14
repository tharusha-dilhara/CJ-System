const SalesRep = require("../models/salesRep.model");
const { errorHandler } = require("../middleware/error");
const bcrypt = require("bcryptjs");

//register new sales rep
exports.addSalesRep = async (req, res, next) => {
  try {
    const {
      name,
      nic,
      address,
      dob,
      mobileNumber,
      email,
      password,
      branchname,
    } = req.body;

    // Check if all required fields are present
    if (
      !name ||
      !nic ||
      !address ||
      !dob ||
      !mobileNumber ||
      !branchname ||
      !email ||
      !password
    ) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    // Check if the nic already exists
    const existingSalesRep = await SalesRep.findOne({ nic });
    if (existingSalesRep) {
      return next(errorHandler(400, "NIC already exists"));
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new SalesRep document
    const newSalesRep = new SalesRep({
      name,
      nic,
      address,
      dob,
      mobileNumber,
      branchname,
      email,
      password: hashedPassword,
    });

    await newSalesRep.save();
    return res.status(201).json({ message: "Sales rep added successfully" });
    console.log("Hashed Password:", hashedPassword);
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

// Get all sales reps
exports.getAllSalesReps = async (req, res, next) => {
  try {
    const salesReps = await SalesRep.find();
    return res.status(200).json(salesReps);
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

// Get sales rep by ID
exports.getSalesRepById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const salesRep = await SalesRep.findById(id);
    if (!salesRep) {
      return next(errorHandler(404, "Sales rep not found"));
    }
    return res.status(200).json(salesRep);
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

exports.deleteSalesRep = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedSalesRep = await SalesRep.findByIdAndDelete(id);
    if (!deletedSalesRep) {
      return next(errorHandler(404, "Sales rep not found"));
    }
    return res.status(200).json({ message: "Sales rep deleted successfully" });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

// Update sales rep by ID
// exports.updateSalesRep = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { name, nic, address, dob, mobileNumber, email, branchname  } =
//       req.body;

//     // Check if all required fields are present
//     if (
//       !name ||
//       !nic ||
//       !address ||
//       !dob ||
//       !mobileNumber ||
//       !email ||
//       !branchname
//     ) {
//       return next(errorHandler(400, "Please provide all required fields"));
//     }

//     // Check if the NIC already exists (excluding the current sales rep being updated)
//     const existingSalesRep = await SalesRep.findOne({ nic, _id: { $ne: id } });
//     if (existingSalesRep) {
//       return next(errorHandler(400, "NIC already exists"));
//     }

//     // Update the sales rep document
//     const updatedSalesRep = await SalesRep.findByIdAndUpdate(
//       id,
//       { name, nic, address, dob, mobileNumber, email, branchname },
//       { new: true, runValidators: true }
//     );

//     if (!updatedSalesRep) {
//       return next(errorHandler(404, "Sales rep not found"));
//     }

//     return res.status(200).json({
//       message: "Sales rep updated successfully",
//       salesRep: updatedSalesRep,
//     });
//   } catch (error) {
//     return next(errorHandler(500, error.message));
//   }
// };




// Update sales rep by ID
exports.updateSalesRep = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, nic, address, dob, mobileNumber, email, branchname, password } =
      req.body;

    // Check if all required fields are present
    if (
      !name ||
      !nic ||
      !address ||
      !dob ||
      !mobileNumber ||
      !email ||
      !branchname
    ) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    // Check if the NIC already exists (excluding the current sales rep being updated)
    const existingSalesRep = await SalesRep.findOne({ nic, _id: { $ne: id } });
    if (existingSalesRep) {
      return next(errorHandler(400, "NIC already exists"));
    }

    let updatedData = { name, nic, address, dob, mobileNumber, email, branchname };

    // If password is provided, hash it before saving
    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updatedData.password = hashedPassword;
    }

    // Update the sales rep document
    const updatedSalesRep = await SalesRep.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedSalesRep) {
      return next(errorHandler(404, "Sales rep not found"));
    }

    return res.status(200).json({
      message: "Sales rep updated successfully",
      salesRep: updatedSalesRep,
    });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

