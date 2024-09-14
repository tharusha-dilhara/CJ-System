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

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please Enter Username"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please add a Password"],
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

module.exports = mongoose.model("Owner", userSchema);
