const Branch = require("../models/branch.model");
const { errorHandler } = require("../middleware/error");

//add new customer
exports.addBranch = async (req, res, next) => {
  try {
    const { branchId, branchName } = req.body;

    // Check if all required fields are present
    if (!branchId || !branchName) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    // Check if the ber already exists
    const existingBranchID = await Branch.findOne({ branchId });
    if (existingBranchID) {
      return next(errorHandler(400, "Branch Is already exists"));
    }

    // Create a new customer document
    const newBranch = new Branch({
      branchId,
      branchName,
    });

    await newBranch.save();
    return res.status(201).json({ message: "branch added successfully" });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

//get all branches for add sales rep
exports.getAllBranches = async (req, res, next) => {
  try {
    // Find all branches and select only the 'branchName' field
    const branches = await Branch.find({}, "branchName");
    
    // Transform the branches data to an array of branch names
    const branchNames = branches.map(branch => branch.branchName);
    
    // Return the array of branch names as the response
    return res.status(200).json(branchNames);
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

//get all branches for view branches list
exports.getAllBranchesB = async (req, res, next) => {
  try {
    const branches = await Branch.find();
    return res.status(200).json(branches);
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

// Get branch by ID
exports.getBranchById = async (req, res, next) => {
  try {
    const { branchId } = req.params;
    const branch = await Branch.findOne({ branchId: branchId });
    if (!branch) {
      return next(errorHandler(404, "Branch not found"));
    }
    return res.status(200).json(branch);
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

// Delete branch by ID
exports.deleteBranch = async (req, res, next) => {
  try {
    const { branchId } = req.params;
    const deletedBranch = await Branch.findOneAndDelete({ branchId });
    if (!deletedBranch) {
      return next(errorHandler(404, "Branch not found"));
    }
    return res.status(200).json({ message: "Branch deleted successfully" });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

// Update branch by branchId
exports.updateBranch = async (req, res, next) => {
  try {
    const { branchId } = req.params;
    const { branchName } = req.body;

    console.log("Received branchId:", branchId);
    console.log("Received branchName:", branchName);

    // Check if all required fields are present
    if (!branchId || !branchName) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    // Update the branch document
    const updatedBranch = await Branch.findOneAndUpdate(
      { branchId },
      { branchName },
      { new: true, runValidators: true }
    );

    if (!updatedBranch) {
      return next(errorHandler(404, "Branch not found"));
    }

    return res
      .status(200)
      .json({ message: "Branch updated successfully", branch: updatedBranch });
  } catch (error) {
    console.error("Error updating branch:", error);
    return next(errorHandler(500, error.message));
  }
};



exports.getBranchNames = async (req, res) => {
  try {
    // Find all branches and select only the branchName field
    const branches = await Branch.find().select('branchName -_id'); // `-_id` to exclude the `_id` field

    // Map the result to extract only the branch names as an array
    const branchNames = branches.map(branch => branch.branchName);

    // Send the branch names as the response
    res.status(200).json(branchNames);
  } catch (error) {
    // Handle any potential errors
    res.status(500).json({ error: 'Failed to retrieve branch names' });
  }
};
