const { Router } = require("express");
const { createInvoice ,getInvoicesBySalesRepIdAndDate,getTotalCashPaymentsBySalesRep,getCreditInvoicesBySalesRep,getCombinedTotalBySalesRep,getCreditInvoicesBySalesRepId,updateInvoicePaymentMethod} = require("../controllers/s_invoice.controller");
const router = Router();
const authenticateToken = require("../middleware/auth");

router.post("/createInvoice",authenticateToken, createInvoice);
router.get("/getInvoiceDate/:salesRepId",authenticateToken, getInvoicesBySalesRepIdAndDate);
router.get("/cash/:salesRepId",authenticateToken, getTotalCashPaymentsBySalesRep);
router.get("/credit/:salesRepId",authenticateToken, getCreditInvoicesBySalesRep);
router.get('/combined-total/:salesRepId',authenticateToken, getCombinedTotalBySalesRep);
router.get('/creditInvoices/:salesRepId',authenticateToken, getCreditInvoicesBySalesRepId);
router.put('/updatePaymentMethod/:salesRepId/:invoiceId',authenticateToken, updateInvoicePaymentMethod);

module.exports = router;
