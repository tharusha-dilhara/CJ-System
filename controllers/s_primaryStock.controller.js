const primaryStock = require("../models/primaryStock.model");

exports.getAllStockRecords = async (req, res) => {
  try {
    // Fetch all stock records with non-null prices from the database, including only itemName and price fields
    const stocks = await primaryStock.find(
      { price: { $ne: null } },
      "itemName price"
    );

    // Send a response with the fetched stock records
    res.status(200).json({
      message: "Stock records retrieved successfully",
      data: stocks,
    });
  } catch (error) {
    console.error("Error retrieving stock records:", error);
    res.status(500).json({
      message: "Failed to retrieve stock records",
      error: error.message,
    });
  }
};

exports.getCount = async (req, res) => {
  try {
    // Fetch all stock records with non-null prices from the database, including only itemName and price fields
    const stocks = await primaryStock.find({}, "itemName qty");

    // Send a response with the fetched stock records
    res.status(200).json({
      message: "Stock records retrieved successfully",
      data: stocks,
    });
  } catch (error) {
    console.error("Error retrieving stock records:", error);
    res.status(500).json({
      message: "Failed to retrieve stock records",
      error: error.message,
    });
  }
};

exports.getItemNames = async (req, res) => {
  try {
    // Fetch all stock records with non-null prices from the database, including only itemName and price fields
    const stocks = await primaryStock.find({}, "itemName");

    // Send a response with the fetched stock records
    res.status(200).json({
      message: "Stock records retrieved successfully",
      data: stocks,
    });
  } catch (error) {
    console.error("Error retrieving stock records:", error);
    res.status(500).json({
      message: "Failed to retrieve stock records",
      error: error.message,
    });
  }
};

exports.getItemsWithPositiveQuantity = async (req, res) => {
  try {
    // Find items with qty > 0 and specified fields are not null
    const items = await primaryStock.find(
      {
        qty: { $gt: 0 },
        itemName: { $ne: null },
        price: { $ne: null },
      },
      "itemName price qty"
    );

    // Send the retrieved items as a response
    res.status(200).json(items);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Error retrieving items", error });
  }
};

exports.getItemNameAndRate = async (req, res) => {
  try {
    // Fetch all stock items
    const stockItems = await primaryStock.find({}, "itemName rate");
    res.status(200).json({
      success: true,
      stockItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//new
exports.pricingitemS = async (req, res) => {
  try {
    // Fetch all documents from the primaryStock collection
    const allStocks = await primaryStock.find({}, "itemName price qty");

    // Filter out stocks where price is null
    const filteredStocks = allStocks.filter((stock) => stock.price !== null);

    // Send the retrieved data as the response
    res.status(200).json({
      success: true,
      message: "All stock data retrieved successfully.",
      data: filteredStocks,
    });
  } catch (error) {
    // Handle any errors that occur during the fetch operation
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving stock data.",
      error: error.message,
    });
  }
};
