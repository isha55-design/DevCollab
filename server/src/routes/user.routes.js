const express = require("express");

const { getProfile  , updateProfile , deleteAccount , getDevelopers , getDeveloperById } = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/profile", authMiddleware , getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.delete("/profile", authMiddleware, deleteAccount);
router.get("/developers", authMiddleware, getDevelopers);
router.get("/:userId", authMiddleware, getDeveloperById);

module.exports = router;