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

const branchSchema = mongoose.Schema({
  branchId: {
    type: String,
    required: [true, "Please Enter branch Id"],
    unique: true,
  },
  branchName: {
    type: String,
    required: [true, "Please Enter Branch Name"],
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

module.exports = mongoose.model("Branch", branchSchema);
