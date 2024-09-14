const Customer = require("../models/customer.model");
const { errorHandler } = require("../middleware/error");

//add new customer
exports.addCustomer = async (req, res, next) => {
  try {
    const {
      shopName,
      ownerName,
      address,
      berNumber,
      mobileNumber,
      landNumber,
    } = req.body;

    // Check if all required fields are present
    if (
      !shopName ||
      !ownerName ||
      !address ||
      !berNumber ||
      !mobileNumber ||
      !landNumber
    ) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    // Check if the ber already exists
    const existingCustomer = await Customer.findOne({ berNumber });
    if (existingCustomer) {
      return next(errorHandler(400, "BER already exists"));
    }

    // Create a new customer document
    const newCustomer = new Customer({
      shopName,
      ownerName,
      address,
      berNumber,
      mobileNumber,
      landNumber,
    });

    await newCustomer.save();
    return res.status(201).json({ message: "customer added successfully" });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

// Get all customers
exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find();
    return res.status(200).json(customers);
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

// Get customer by ID
exports.getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) {
      return next(errorHandler(404, "Customer not found"));
    }
    return res.status(200).json(customer);
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

//Delete customer by ID
exports.deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return next(errorHandler(404, "Customer not found"));
    }
    return res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

// Update customer by ID
exports.updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      shopName,
      ownerName,
      address,
      berNumber,
      mobileNumber,
      landNumber,
    } = req.body;

    // Check if all required fields are present
    if (
      !shopName ||
      !ownerName ||
      !address ||
      !berNumber ||
      !mobileNumber ||
      !landNumber
    ) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    // Check if the berNumber already exists (excluding the current customer being updated)
    const existingCustomer = await Customer.findOne({
      berNumber,
      _id: { $ne: id },
    });
    if (existingCustomer) {
      return next(errorHandler(400, "BER already exists"));
    }

    // Update the customer document
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        shopName,
        ownerName,
        address,
        berNumber,
        mobileNumber,
        landNumber,
      },
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return next(errorHandler(404, "Customer not found"));
    }

    return res.status(200).json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};
