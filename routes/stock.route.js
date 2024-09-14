const { Router } = require("express");
const router = Router();
const {
  addStock,
  getPendingStocks,
  updatePendingItems,
  registerItems,
  pricingitem,
  zeroPricingItems,
  updatePricingItemByName,
  getAllStockItems,
  deleteStockItems,
  getAverage,
  getAverageItem,
  deleteRegisterItem,
} = require("../controllers/stock.controller");
const authenticateToken = require("../middleware/auth");

router.post("/addStock", authenticateToken, addStock);
router.get("/verifyItems", authenticateToken, getPendingStocks);
router.post("/updateVerifyItems", authenticateToken, updatePendingItems);
router.post("/registerItems", authenticateToken, registerItems);
router.get("/pricingitem", authenticateToken, pricingitem);
router.get("/zeroPricingItems", authenticateToken, zeroPricingItems);
router.put("/updatePricingItemByName",authenticateToken,updatePricingItemByName);
router.get("/getAllStockItems", authenticateToken,getAllStockItems);
router.get("/getAverage",authenticateToken,getAverage);
router.get("/average-quantity",authenticateToken,getAverageItem);
router.delete("/deleteStockItems/:id",authenticateToken,deleteStockItems);
router.delete("/deleteRegisterItem/:id",authenticateToken,deleteRegisterItem);

module.exports = router;
