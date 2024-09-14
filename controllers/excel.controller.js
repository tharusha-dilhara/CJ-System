const Invoice = require("../models/invoice.model");
const Stock  = require("../models/primaryStock.model");
const dailyReport  = require("../models/dailyReport.model");
const monthlyReport  = require("../models/MonthlySummary.model");

exports.getAllInvoices = async (req, res) => {
    try {
      const invoices = await Invoice.find();
      return res.status(200).json(invoices);
    } catch (err) {
      res.status(500).json({message: "error fetching data"});
    }
  };

exports.getAllStocks  = async (req, res) => {
    try {
      const invoices = await Stock.find();
      return res.status(200).json(invoices);
    } catch (err) {
      res.status(500).json({message: "error fetching data"});
    }
  };

exports.getAlldailyReport  = async (req, res) => {
    try {
      const invoices = await dailyReport.find();
      return res.status(200).json(invoices);
    } catch (err) {
      res.status(500).json({message: "error fetching data"});
    }
  };

exports.getAllMonthlyReport  = async (req, res) => {
    try {
      const invoices = await monthlyReport.find();
      return res.status(200).json(invoices);
    } catch (err) {
      res.status(500).json({message: "error fetching data"});
    }
  };