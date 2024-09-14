const { Router } = require("express");
const router = Router();
const authenticateToken = require("../middleware/auth");
const { getAllInvoices ,getAllStocks,getAlldailyReport,getAllMonthlyReport} = require("../controllers/excel.controller");

router.get("/getAllInvoices",authenticateToken,getAllInvoices);
router.get("/getAllStocks",authenticateToken,getAllStocks);
router.get("/getAlldailyReport",authenticateToken,getAlldailyReport);
router.get("/getAllMonthlyReport",authenticateToken,getAllMonthlyReport);

module.exports = router;