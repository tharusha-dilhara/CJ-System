const Customer = require("../models/customer.model");

// Controller function to add a new customer
exports.addNewCustomer = async (req, res) => {
  try {
    const {
      shopName,
      ownerName,
      address,
      salesRepid,
      berNumber,
      mobileNumber,
      landNumber,
    } = req.body;

    // Create a new customer document
    const newCustomer = new Customer({
      shopName,
      ownerName,
      address,
      salesRepid,
      berNumber,
      mobileNumber,
      landNumber,
    });

    // Save the customer document to the database
    const savedCustomer = await newCustomer.save();

    // Send a response with the saved customer document
    res.status(201).json({
      message: "Customer added successfully",
      data: savedCustomer,
    });
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).json({
      message: "Failed to add customer",
      error: error.message,
    });
  }
};

//call this
// Controller function to get all customers
exports.getAllCustomersForS = async (req, res) => {
  try {
    const salesRepId = req.params.salesRepId;

    // Find customers with the matching salesRepId
    const customers = await Customer.find({ salesRepid: salesRepId },"shopName address");

    if (!customers || customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No customers found for the given sales representative ID.",
      });
    }

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getAllShopNames = async (req, res) => {
  try {
    // Find all customers and return only the shopName field
    const shops = await Customer.find({}, "shopName");

    // Respond with the shops data
    res.status(200).json({ data: shops });
  } catch (error) {
    console.error("Error fetching shop names:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getCustomersBySalesRepId = async (req, res) => {
  try {
    const salesRepId = req.params.salesRepId;

    // Find customers with the given salesRepId and exclude the _id field
    const customers = await Customer.find(
      { salesRepid: salesRepId },
      { shopName: 1, _id: 0 } // Include shopName, exclude _id
    );

    // If no customers found, send a 404 response
    if (customers.length === 0) {
      return res
        .status(404)
        .json({ message: "No customers found for this Sales Rep ID" });
    }

    // Extract shop names into an array
    const shopNames = customers.map(customer => customer.shopName);
    // Send the shop names as a response
    res.status(200).json(shopNames);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Error retrieving customers", error });
  }
};
