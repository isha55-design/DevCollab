const express = require("express");

const router = express.Router();

const { createPost , getPosts , likePost , updatePost , deletePost } = require("../controllers/post.controller");
const { createComment , getComments , deleteComment } = require("../controllers/comment.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/create", authMiddleware, createPost);
router.get("/", authMiddleware , getPosts);
router.post("/:postId/like", authMiddleware, likePost);
router.post("/:postId/comments", authMiddleware, createComment);
router.get("/:postId/comments", authMiddleware, getComments);
router.delete("/:postId/comments/:commentId", authMiddleware, deleteComment);
router.put("/:postId", authMiddleware, updatePost);
router.delete("/:postId", authMiddleware, deletePost);

module.exports = router;