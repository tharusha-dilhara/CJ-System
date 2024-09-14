const Invoice = require("../models/invoice.model");
const primaryStockModel = require("../models/primaryStock.model");

// Function to get the current date in the desired format
function getCurrentDate() {
  const currentDate = new Date();
  return (
    currentDate.getDate() +
    "/" +
    (currentDate.getMonth() + 1) +
    "/" +
    currentDate.getFullYear()
  );
}

//add new invoice

exports.createInvoice = async (req, res) => {
  try {
    const { items } = req.body;

    // Iterate over each item in the invoice
    for (let item of items) {
      const { itemName, qty } = item;

      // Find the item in the primary stock
      const stockItem = await primaryStockModel.findOne({ itemName });

      if (!stockItem) {
        return res.status(404).json({
          status: "fail",
          message: `Item '${itemName}' not found in primary stock.`,
        });
      }

      // Check if the stock is sufficient
      if (stockItem.qty < qty) {
        return res.status(400).json({
          status: "fail",
          message: `Insufficient stock for item '${itemName}'.`,
        });
      }

      // Subtract the quantity from the stock
      stockItem.qty -= qty;

      // Save the updated stock
      await stockItem.save();
    }

    // Create the invoice
    const invoice = new Invoice(req.body);
    await invoice.save();

    res.status(201).json({
      status: "success",
      data: {
        invoice,
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getInvoicesBySalesRepIdAndDate = async (req, res) => {
  const { salesRepId } = req.params;
  const currentDate = getCurrentDate();

  try {
    const invoices = await Invoice.find({
      salesRepId,
      customDate: currentDate,
    })
    .populate("salesRepId")
    .sort({ _id: -1 }); // Sort by _id in descending order
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({
      message:
        "Error fetching invoices for the sales representative on the current date",
      error,
    });
  }
};

//get cash details
exports.getTotalCashPaymentsBySalesRep = async (req, res) => {
  try {
    // Extract salesRepId from request parameters
    const { salesRepId } = req.params;

    // Get the current date in the same format used in the invoices
    const currentDate = getCurrentDate();

    // Fetch all invoices with paymentMethod 'cash', matching salesRepId, and created on the current date
    const cashInvoices = await Invoice.find({
      paymentMethod: "cash",
      salesRepId,
      customDate: currentDate, // Filter by the current date
    });

    // Calculate the total cash amount
    const totalCashAmount = cashInvoices.reduce(
      (total, invoice) => total + invoice.amount,
      0
    );

    res.status(200).json({
      success: true,
      totalCashAmount,
      invoices: cashInvoices,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//get credit details
exports.getCreditInvoicesBySalesRep = async (req, res) => {
  try {
    // Extract salesRepId from request parameters
    const { salesRepId } = req.params;

    // Get the current date in the same format used in the invoices
    const currentDate = getCurrentDate();

    // Fetch all invoices with paymentMethod 'credit' and matching salesRepId
    const creditInvoices = await Invoice.find({
      paymentMethod: "credit",
      salesRepId,
      customDate: currentDate, // Filter by the current date
    });

    // Calculate the total credit amount
    const totalCreditAmount = creditInvoices.reduce(
      (total, invoice) => total + invoice.amount,
      0
    );

    res.status(200).json({
      success: true,
      totalCreditAmount,
      invoices: creditInvoices,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get the combined total of cash and credit amounts by sales rep ID
exports.getCombinedTotalBySalesRep = async (req, res) => {
  try {
    // Extract salesRepId from request parameters
    const { salesRepId } = req.params;

    // Get the current date in the same format used in the invoices
    const currentDate = getCurrentDate();

    // Fetch all cash invoices with the specified salesRepId
    const cashInvoices = await Invoice.find({
      paymentMethod: "cash",
      salesRepId,
      customDate: currentDate, // Filter by the current date
    });

    // Fetch all credit invoices with the specified salesRepId
    const creditInvoices = await Invoice.find({
      paymentMethod: "credit",
      salesRepId,
      customDate: currentDate, // Filter by the current date
    });

    // Calculate the total cash amount
    const totalCashAmount = cashInvoices.reduce(
      (total, invoice) => total + invoice.amount,
      0
    );

    // Calculate the total credit amount
    const totalCreditAmount = creditInvoices.reduce(
      (total, invoice) => total + invoice.amount,
      0
    );

    // Calculate the combined total
    const combinedTotal = totalCashAmount + totalCreditAmount;

    res.status(200).json({
      success: true,
      totalCashAmount,
      totalCreditAmount,
      combinedTotal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//get all credits
exports.getCreditInvoicesBySalesRepId = async (req, res) => {
  try {
    const { salesRepId } = req.params; // Extract salesRepId from the request parameters

    // Find all invoices with the given salesRepId and paymentMethod 'credit'
    const invoices = await Invoice.find({
      salesRepId: salesRepId,
      paymentMethod: "credit",
    });

    // If no invoices found, return a 404 response
    if (invoices.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No credit invoices found for this sales representative.",
      });
    }

    // Return the found invoices
    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Controller to update payment method from credit to cash for a specific invoice by salesRepId and invoiceId
exports.updateInvoicePaymentMethod = async (req, res) => {
  try {
    const { salesRepId, invoiceId } = req.params; // Extract salesRepId and invoiceId from the request parameters

    // Find the specific invoice by salesRepId and invoiceId
    const invoice = await Invoice.findOneAndUpdate(
      { _id: invoiceId, salesRepId: salesRepId, paymentMethod: "credit" },
      { $set: { paymentMethod: "cash" } },
      { new: true } // Return the updated document
    );

    // If the invoice was not found or updated, return a 404 response
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "No credit invoice found for this sales representative and invoice ID.",
      });
    }

    // Return the updated invoice
    res.status(200).json({
      success: true,
      message: "Invoice payment method updated from credit to cash.",
      data: invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};