const { Router } = require("express");
const router = Router();
const {loginSalesRep,
    getSalesRepById
} = require("../controllers/s_salesRep.controller");

router.post("/loginSalesRep", loginSalesRep);
router.get("/verifySalesRep/:salesRepId", getSalesRepById);

module.exports = router;
