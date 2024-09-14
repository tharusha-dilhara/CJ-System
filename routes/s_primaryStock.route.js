const { Router } = require("express");
const {
  getAllStockRecords,
  getCount,
  getItemNames,
  getItemsWithPositiveQuantity,
  getItemNameAndRate,
  pricingitemS,
} = require("../controllers/s_primaryStock.controller");
const router = Router();
const authenticateToken = require("../middleware/auth");

router.get("/getAllStockRecords", authenticateToken, getAllStockRecords);
router.get("/getCount", authenticateToken, getCount);
router.get("/getItemNames", authenticateToken, getItemNames);
router.get(
  "/getItemsWithPositiveQuantity",
  authenticateToken,
  getItemsWithPositiveQuantity
);
router.get("/getItemNameAndRate", authenticateToken, getItemNameAndRate);

router.get("/pricingitemS", authenticateToken, pricingitemS);

module.exports = router;
