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

const invoiceSchema = mongoose.Schema({
  salesRepId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SalesRep",
    required: true,
  },
  branchname: {
    type: String,
    ref: "SalesRep",
    required: true,
  },
  shopName: {
    type: String,
    required: [true, "Please Enter shopName"],
  },
  shopAddress: {
    type: String,
  },
  amount: {
    type: Number,
    default: 0, // Default value to ensure it's a number
  },
  quantity: {
    type: Number,
    default: 0, // Default value to ensure it's a number
  },
  items: [
    {
      itemName: {
        type: String,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: true,
      },
    },
  ],
  paymentMethod: {
    type: String,
    enum: ["cash", "credit"],
    required: [true, "Please Enter paymentMethod"],
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

// Pre-save middleware to calculate the total amount and count of items
invoiceSchema.pre("save", function (next) {
  let totalAmount = 0;

  this.items.forEach((item) => {
    const itemTotal = item.qty * item.price * ((100 - item.discount) / 100);
    totalAmount += itemTotal;
  });

  this.amount = Math.round(totalAmount * 100) / 100; // Round to 2 decimal places
  this.quantity = this.items.length; // Count of items
  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);
