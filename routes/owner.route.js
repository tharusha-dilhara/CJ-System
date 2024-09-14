const { Router } = require("express");
const router = Router();
const {
  registerUser,
  loginUser,
  verifyToken,
} = require("../controllers/owner.controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify-token", verifyToken);

module.exports = router;
