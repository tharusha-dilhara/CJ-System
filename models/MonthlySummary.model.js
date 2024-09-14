// models/MonthlySummary.js

const mongoose = require('mongoose');

const MonthlySummarySchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  totalSalesAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  totalMargin: {
    type: Number,
    required: true,
    default: 0,
  },
  pieChartData: [
    {
      itemName: {
        type: String,
        required: true,
      },
      percentage: {
        type: Number,
        required: true,
      },
    },
  ],
  reportGeneratedTime: {
    type: String,
    required: true,
    default: 0,
  },
  reportGeneratedDate: {
    type: String,
    required: true,
    default: 0,
  },
});

const MonthlySummary = mongoose.model('MonthlyReport', MonthlySummarySchema);

module.exports = MonthlySummary;
