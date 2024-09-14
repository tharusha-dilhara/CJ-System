const { Router } = require("express");
const { getDailySales, getInvoiceItemMargins, getInvoiceItemMarginsitems, getItemPercentages, getSalesAndMargins, getMonthlyReport, findAllMonthlySummaries, findAllDailyReports, getTotalSalesAndMargin, getBranchWiseSalesAndMargin, getSalesDataForSalesReps } = require("../controllers/report.controller");
const authenticateToken = require("../middleware/auth");
const router = Router();

router.get("/getDailySales",authenticateToken, getSalesAndMargins);
router.get("/getMonthlyReport",authenticateToken, getMonthlyReport);
router.get("/findAllMonthlySummaries",authenticateToken, findAllMonthlySummaries);
router.get("/findAllDailyReports",authenticateToken, findAllDailyReports);
router.get("/getTotalSalesAndMargin",authenticateToken, getBranchWiseSalesAndMargin);
router.get("/getSalesDataForSalesReps",authenticateToken, getSalesDataForSalesReps);

module.exports = router;
