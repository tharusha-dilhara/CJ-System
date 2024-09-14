const { Router } = require("express");
const router = Router();
const {
  addBranch,
  getAllBranches,
  getBranchById,
  deleteBranch,
  updateBranch,
  getBranchNames,
  getAllBranchesB
} = require("../controllers/branch.controller");
const authenticateToken = require("../middleware/auth");

router.post("/addBranch", authenticateToken, addBranch);
router.get("/getAllBranches", authenticateToken, getAllBranches);
router.get("/getAllBranchesB", authenticateToken, getAllBranchesB);
router.get("/getBranchNames",authenticateToken, getBranchNames);
router.get("/getBranchById/:branchId", authenticateToken, getBranchById);
router.delete("/deleteBranch/:branchId", authenticateToken, deleteBranch);
router.put("/updateBranch/:branchId", authenticateToken, updateBranch);

module.exports = router;
