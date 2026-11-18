const express = require("express");
const router = express.Router();

const { register, login, logout } = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected API
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Authenticated successfully",
    userId: req.user.userId,
  });
});

module.exports = router;
