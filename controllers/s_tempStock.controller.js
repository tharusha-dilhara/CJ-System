const TempStock = require("../models/tempStock.model");

exports.addNewStockRecord = async (req, res) => {
  try {
    const { verification, items } = req.body;

    // Create a new stock document
    const newStock = new TempStock({
      verification,
      items,
    });

    // Save the stock document to the database
    const savedStock = await newStock.save();

    // Send a response with the saved stock document
    res.status(201).json({
      message: "Stock record added successfully",
      data: savedStock,
    });
  } catch (error) {
    console.error("Error adding stock record:", error);
    res.status(500).json({
      message: "Failed to add stock record",
      error: error.message,
    });
  }
};

exports.getPendingStocks = async (req, res) => {
  try {
    // Find all documents with verification set to "pending"
    const pendingStocks = await TempStock.find({ verification: "pending" });

    // Send the results in the response
    res.status(200).json({
      success: true,
      data: pendingStocks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


