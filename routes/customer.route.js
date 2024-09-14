const { Router } = require("express");
const router = Router();
const {
  addCustomer,
  getAllCustomers,
  getCustomerById,
  deleteCustomer,
  updateCustomer,
} = require("../controllers/customer.controller");
const authenticateToken = require("../middleware/auth");

router.post("/addCustomer", authenticateToken, addCustomer);
router.get("/getAllCustomers", authenticateToken, getAllCustomers);
router.get("/getCustomerById/:id", authenticateToken, getCustomerById);
router.delete("/deleteCustomer/:id", authenticateToken, deleteCustomer);
router.put("/updateCustomer/:id", authenticateToken, updateCustomer);

module.exports = router;
