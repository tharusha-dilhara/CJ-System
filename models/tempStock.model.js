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

const generateStockId = () => {
  return "stock" + Math.random().toString(36).substr(2, 9);
};

const stockSchema = mongoose.Schema({
  stock_order_index: {
    type: String,
    default: generateStockId,
    unique: true,
  },
  verification: {
    type: String,
    required: true,
    enum: ["pending", "verified"],
    default: "pending",
  },
  items: [
    {
      item_name: {
        type: String,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
      rate: {
        type: String,
        required: true,
      },
      price: {
        type: String,
      },
      verification: {
        type: String,
        required: true,
        enum: ["pending", "verified"],
        default: "pending",
      },
    },
  ],
  customDate: {
    type: String,
    default: getCurrentDate,
  },
  customTime: {
    type: String,
    default: getCurrentTime,
  },
});

stockSchema.pre("save", function (next) {
  this.items.forEach((item) => {
    item.price = (item.rate * item.qty).toFixed(2);
  });
  next(); // Proceed with saving the document
});

module.exports = mongoose.model("tempStock", stockSchema);
