const PrimaryStock = require("../models/primaryStock.model");
const tempStock = require("../models/tempStock.model");
const Stock = require("../models/tempStock.model"); // Adjust the path as needed

// Controller function to add new stock items
exports.addStock = async (req, res) => {
  try {
    // Fixing rate to 2 decimal places in req.body
    req.body.items = req.body.items.map(item => {
      return {
        ...item,
        rate: parseFloat(item.rate).toFixed(2),
      };
    });

    const newStock = new Stock(req.body);
    await newStock.save();

    res.status(201).json({
      message: 'Stock saved successfully',
      stock: newStock,
    });
  } catch (error) {
    console.error('Error saving stock:', error);
    res.status(500).json({
      message: 'Something went wrong while saving stock',
      error: error.message,
    });
  }
};

// Controller function to find all stocks with verification set to "pending"
exports.getPendingStocks = async (req, res) => {
  try {
    // Find all documents with verification set to "pending"
    const pendingStocks = await Stock.find({ verification: "pending" });

    // Send the results in the response
    res.status(200).json({
      success: true,
      data: pendingStocks,
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Controller function to update items' verification and their rate and qty
exports.updatePendingItems = async (req, res) => {
  const { id, itemsUpdates } = req.body; // stockId is the ID of the stock document to update, itemsUpdates contains the updates for items

  try {
    // Find the stock document by ID
    const stock = await Stock.findById(id);

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }
    if (stock.verification == "pending") {
      // Update items based on the provided updates
      for (const item of stock.items) {
        const update = itemsUpdates.find(
          (update) => update.item_name === item.item_name
        );

        if (update) {
          if (update.verification === "verified") {
            item.verification = "verified";
          } else {
            if (update.rate) {
              item.rate = update.rate !== undefined ? update.rate : item.rate;
            }
            if (update.qty) {
              item.qty = update.qty !== undefined ? update.qty : item.qty;
            }
            item.price = item.rate * item.qty;
            item.verification = "verified";
          }
        }

        // Update the stock verification status outside the else block
        stock.verification = "verified";

        // Update PrimaryStock only if the item verification is 'verified'
        if (item.verification === "verified") {
          const existingStock = await PrimaryStock.findOne({
            itemName: item.item_name,
          });

          if (
            existingStock &&
            (existingStock.rate == item.rate || existingStock.rate == 0)
          ) {
            // Update the existing stock item
            existingStock.qty += item.qty;
            existingStock.rate = item.rate;
            existingStock.amountOfItems = parseFloat(existingStock.calculatedPrice).toFixed(2);
            await existingStock.save();
          } else {
            // Create a new stock item
            const newStockItem = new PrimaryStock({
              itemName: item.item_name + " - " + item.rate,
              companyName: stock.companyName, // Adjust as necessary
              companyAddress: stock.companyAddress, // Adjust as necessary
              qty: item.qty,
              rate: item.rate,
              amountOfItems: parseFloat(item.price).toFixed(2),
            });
            await newStockItem.save();
          }
        }
      }

      // Save the updated stock document after the loop
      await stock.save();

      res.status(200).json({
        success: true,
        data: stock,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Stock verification not pending",
      });
    }
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Controller to add a new stock item
exports.registerItems = async (req, res) => {
  try {
    // Extracting stock item details from the request body
    const { itemName, companyName, companyAddress } = req.body;

    // Validating required fields
    if (!itemName || !companyName || !companyAddress) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Creating a new stock item using the stockSchema model
    const newStockItem = new PrimaryStock({
      itemName,
      companyName,
      companyAddress,
    });

    // Save the new stock item to the database
    await newStockItem.save();

    // Respond with the newly created stock item
    return res.status(201).json({
      message: "Stock item added successfully",
      data: newStockItem,
    });
  } catch (error) {
    // Error handling
    console.error("Error adding stock item:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while adding the stock item." });
  }
};

// Controller function to get all data from the primaryStock collection
exports.pricingitem = async (req, res) => {
  try {
    // Fetch all documents from the primaryStock collection
    const allStocks = await PrimaryStock.find({}, "itemName price");

    // Send the retrieved data as the response
    res.status(200).json({
      success: true,
      message: "All stock data retrieved successfully.",
      data: allStocks,
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

// Controller function to find items with a price of 0 and return only itemName
exports.zeroPricingItems = async (req, res) => {
  try {
    // Query to find all items with price 0
    const itemsWithZeroPrice = await PrimaryStock.find();

    // Check if any items are found
    if (itemsWithZeroPrice.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No items found with a price of 0.",
      });
    }

    // Send the retrieved item names as the response
    res.status(200).json({
      success: true,
      message: "Items with price 0 retrieved successfully.",
      data: itemsWithZeroPrice.map((item) => item.itemName),
    });
  } catch (error) {
    // Handle any errors that occur during the fetch operation
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving items with price 0.",
      error: error.message,
    });
  }
};

// Controller function to update items by itemName
exports.updatePricingItemByName = async (req, res) => {
  try {
    // Extract itemName and fields to be updated from request body
    const { itemName, rate, discount, price, margin } = req.body;

    // Validate the required input
    if (!itemName) {
      return res.status(400).json({
        success: false,
        message: "Item name is required to perform the update.",
      });
    }

    // Find and update the item by itemName
    const updatedItem = await PrimaryStock.findOneAndUpdate(
      { itemName },
      { discount, price, margin },
      { new: true, runValidators: true } // Options to return the updated document and run validators
    );

    // Check if the item was found and updated
    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: `No item found with the name "${itemName}".`,
      });
    }

    // Respond with the updated item
    res.status(200).json({
      success: true,
      message: "Item updated successfully.",
      data: updatedItem,
    });
  } catch (error) {
    // Handle any errors that occur during the update operation
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the item.",
      error: error.message,
    });
  }
};

//get all stock items
exports.getAllStockItems = async (req, res) => {
  try {
    const primaryStock = await PrimaryStock.find();
    res.status(200).json(primaryStock);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//delete atock items
exports.deleteStockItems = async (req, res) => {
  try {
    const { id } = req.params;
    const primaryStock = await PrimaryStock.findByIdAndDelete(id);
    if (!primaryStock) {
      return res.status(404).json({ message: "Stock item not found" });
    }
    res.status(200).json({ message: "Stock item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get price average
exports.getAverage = async (req, res) => {
  try {
    // Fetch verified items
    const verifiedItems = await tempStock.find({ verification: "verified" });

    // Calculate average price per month
    const monthlyAverages = {};

    verifiedItems.forEach((entry) => {
      const date = new Date(entry.customDate);
      const month = `${date.getFullYear()}-${date.getMonth() + 1}`; // Format YYYY-MM

      if (!monthlyAverages[month]) {
        monthlyAverages[month] = { totalPrice: 0, totalCount: 0 };
      }

      entry.items.forEach((item) => {
        monthlyAverages[month].totalPrice += item.price;
        monthlyAverages[month].totalCount += 1;
      });
    });

    // Calculate average price
    for (const month in monthlyAverages) {
      monthlyAverages[month].averagePrice =
        monthlyAverages[month].totalPrice / monthlyAverages[month].totalCount;
    }
    res.json(monthlyAverages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
};

//get average item
// exports.getAverageItem = async (req, res) => {
//   try {
//     // Calculate average quantities from verified stocks
//     const verifiedStocks = await tempStock.find({ verification: "verified" });

//     const itemQuantities = {};

//     verifiedStocks.forEach((stock) => {
//       stock.items.forEach((item) => {
//         if (!itemQuantities[item.item_name]) {
//           itemQuantities[item.item_name] = { totalQty: 0, count: 0 };
//         }
//         itemQuantities[item.item_name].totalQty += item.qty;
//         itemQuantities[item.item_name].count += 1;
//       });
//     });

//     const averageQuantities = {};
//     for (const itemName in itemQuantities) {
//       const { totalQty, count } = itemQuantities[itemName];
//       averageQuantities[itemName] = totalQty / count;
//     }

//     // Fetch primary stock data
//     const primaryStocks = await PrimaryStock.find();

//     // Calculate differences
//     const differences = {};

//     primaryStocks.forEach((stock) => {
//       const averageQty = averageQuantities[stock.itemName] || 0;
//       const difference = averageQty - stock.qty;
//       differences[stock.itemName] = {
//         currentQty: stock.qty,
//         averageQty: averageQty,
//         difference: difference,
//       };
//     });

//     res.json(differences);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error calculating quantity differences", error });
//   }
// };

exports.getAverageItem = async (req, res) => {
  try {
    // Calculate average quantities from verified stocks
    const verifiedStocks = await tempStock.find({ verification: "verified" });

    const itemQuantities = {};

    verifiedStocks.forEach((stock) => {
      stock.items.forEach((item) => {
        // Split the item name and take the first word
        const itemKey = item.item_name.split('-')[0];

        if (!itemQuantities[itemKey]) {
          itemQuantities[itemKey] = { totalQty: 0, count: 0 };
        }
        itemQuantities[itemKey].totalQty += item.qty;
        itemQuantities[itemKey].count += 1;
      });
    });

    const averageQuantities = {};
    for (const itemKey in itemQuantities) {
      const { totalQty, count } = itemQuantities[itemKey];
      averageQuantities[itemKey] = totalQty / count;
    }

    // Fetch primary stock data
    const primaryStocks = await PrimaryStock.find();

    // Calculate differences
    const differences = {};

    primaryStocks.forEach((stock) => {
      // Split the item name and take the first word
      const itemKey = stock.itemName.split('-')[0];
      
      const averageQty = averageQuantities[itemKey] || 0;
      const difference = averageQty - stock.qty;
      differences[itemKey] = {
        currentQty: stock.qty,
        averageQty: averageQty,
        difference: difference,
      };
    });

    res.json(differences);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error calculating quantity differences", error });
  }
};


//delete register items.if items < 0
exports.deleteRegisterItem = async (req, res) => {
  const { id } = req.params; // Get the id from the request parameters

  try {
    // Find the item by id and check if qty is 0
    const item = await PrimaryStock.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (item.qty !== 0) {
      return res.status(400).json({
        success: false,
        message: "Item qty is not 0, cannot delete",
      });
    }

    // If qty is 0, delete the item
    await PrimaryStock.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `Item with id ${id} was deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting item",
      error: error.message,
    });
  }
};

