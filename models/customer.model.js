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

const customerSchema = mongoose.Schema({
  shopName: {
    type: String,
    required: [true, "Please Enter Shop Name"],
    unique: true,
  },
  salesRepid: {
    type: String,
  },
  ownerName: {
    type: String,
    required: [true, "Please Enter Owner Name"],
  },
  address: {
    type: String,
    required: [true, "Please Enter Address"],
  },
  berNumber: {
    type: String,
    required: [true, "Please Enter BER Number"],
    unique: true,
  },
  mobileNumber: {
    type: String,
    required: [true, "Please Enter Mobile Number"],
    unique: true,
  },
  landNumber: {
    type: String,
    required: [true, "Please Enter Land Number"],
    unique: true,
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

module.exports = mongoose.model("Customer", customerSchema);
