const Comment = require("../models/comment.model");

async function createComment(req, res) {

    const { text } = req.body;

    const postId = req.params.postId;

    const userId = req.user.id;

    const comment = await Comment.create({
    text,
    user: userId,
    post: postId
    });

    return res.status(201).json({
    message: "Comment created successfully",
    comment
   });
}

async function getComments(req, res) {

    const postId = req.params.postId;

    const comments = await Comment.find({
    post: postId
    }).populate("user", "username");

    return res.status(200).json({
    message: "Comments fetched successfully",
    comments
    });

}

async function deleteComment(req, res) {

    const commentId = req.params.commentId;

    const comment = await Comment.findById(commentId);  

    if (!comment) {
        return res.status(404).json({
            message: "Comment not found"
        });
    }

    if (comment.user.toString() !== req.user.id.toString()) {
        return res.status(403).json({
            message: "Not authorized to delete this comment"
        });
    }

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({
        message: "Comment deleted successfully"
    });

}

module.exports = {createComment , getComments, deleteComment};