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

const salesRepSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Name"],
  },
  nic: {
    type: String,
    required: [true, "Please Enter NIC"],
    unique: true,
  },
  address: {
    type: String,
    required: [true, "Please Enter Address"],
  },
  dob: {
    type: String,
    required: [true, "Please Enter DOB"],
  },
  mobileNumber: {
    type: String,
    required: [true, "Please Enter Mobile Number"],
    unique: true,
  },
  branchname: {
    type: String,
    required: [true, "Please Enter Branch Name"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Email"],
    unique: true,
  },
  branchname:{
    type: String,
  },
  password: {
    type: String,
    required: true,
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

module.exports = mongoose.model("SalesRep", salesRepSchema);
