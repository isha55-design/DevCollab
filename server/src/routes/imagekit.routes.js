const express = require("express");

const router = express.Router();

const { getImageKitAuth } = require("../controllers/imagekit.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/auth", authMiddleware, getImageKitAuth);

module.exports = router;