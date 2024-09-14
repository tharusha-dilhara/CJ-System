const mongoose = require("mongoose");

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

// Function to get the current time in the desired format
function getCurrentTime() {
  const currentDate = new Date();
  return (
    currentDate.getHours() +
    ":" +
    currentDate.getMinutes() +
    ":" +
    currentDate.getSeconds()
  );
}

const stockSchema = mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
    default: "company name",
  },
  companyAddress: {
    type: String,
    required: true,
    default: "company Address",
  },
  qty: {
    type: Number,
    default: 0,
  },
  rate: {
    type: String,
    default: 0,
  },
  amountOfItems: {
    type: String,
    required: true,
    default: 0,
  },
  discount: {
    type: String,
    default: null,
  },
  margin: {
    type: String,
    default: null,
  },
  price: {
    type: String,
    default: null,
  },
  customDate: {
    type: String,
    default: getCurrentDate,
  },
  customTime: {
    type: String,
    default: getCurrentTime,
  },
});

// Virtual for calculating price
stockSchema.virtual("calculatedPrice").get(function () {
  return this.qty * this.rate;
});

// Pre-save middleware to update the price field
stockSchema.pre("save", function (next) {
  this.amountOfItems = this.calculatedPrice;
  next();
});

module.exports = mongoose.model("primaryStock", stockSchema);
