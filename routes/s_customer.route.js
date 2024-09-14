const { Router } = require("express");
const { addNewCustomer ,getAllCustomersForS,getAllShopNames,getCustomersBySalesRepId} = require("../controllers/s_customer.controller");
const router = Router();
const authenticateToken = require("../middleware/auth");

router.post("/addNewCustomer",authenticateToken, addNewCustomer);
router.get("/getAllCustomersF/:salesRepId",authenticateToken, getAllCustomersForS);
router.get("/getAllShopNames",authenticateToken, getAllShopNames);
router.get("/customers/:salesRepId",authenticateToken, getCustomersBySalesRepId);

module.exports = router;
