const { Router } = require("express");
const { addNewStockRecord,getPendingStocks } = require("../controllers/s_tempStock.controller");
const router = Router();
const authenticateToken = require("../middleware/auth");

router.post("/addOrder",authenticateToken, addNewStockRecord);
router.get("/getPendingStocks",authenticateToken, getPendingStocks);

module.exports = router;
