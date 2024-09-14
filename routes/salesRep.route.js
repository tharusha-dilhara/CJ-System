const { Router } = require("express");
const router = Router();
const {
  addSalesRep,
  getAllSalesReps,
  getSalesRepById,
  deleteSalesRep,
  updateSalesRep,
} = require("../controllers/salesRep.controller");
const authenticateToken = require("../middleware/auth");

router.post("/addSalesRep", authenticateToken, addSalesRep);
router.get("/getAllSalesReps", authenticateToken, getAllSalesReps);
router.get("/getSalesRepById/:id", authenticateToken, getSalesRepById);
router.delete("/deleteSalesRepById/:id", authenticateToken, deleteSalesRep);
router.put("/updateSalesRepById/:id", authenticateToken, updateSalesRep);

module.exports = router;
