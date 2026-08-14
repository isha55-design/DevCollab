const Post = require("../models/post.model");

async function createPost(req, res) {
    const { caption, image } = req.body;

    if (!caption || caption.trim() === "") {
        return res.status(400).json({
            message: "Caption is required"
        });
    }

    const post = await Post.create({
        caption,
        image,
        owner: req.user.id
    });

    return res.status(201).json({
        message: "Post created successfully",
        post
    });
}

async function getPosts(req, res) {

      const posts = await Post.find()
        .populate("owner", "username email");

    return res.status(200).json({
        message: "Posts fetched successfully",
        posts
    });
}
 
async function likePost(req, res) {
    const postId = req.params.postId;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
    return res.status(404).json({
        message: "Post not found"
    });
}

    const isLiked = post.likes.some(
    (id) => id.toString() === userId.toString()
    );

   if (isLiked) {
    // Already liked → Unlike
    post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
    );
} else {
    // Not liked → Like
    post.likes.push(userId);
}

  await post.save();

  return res.status(200).json({
    message: isLiked ? "Post unliked" : "Post liked",
    likes: post.likes
   });

}

async function updatePost(req, res) {

    const postId = req.params.postId;
    const { caption } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    if (post.owner.toString() !== req.user.id.toString()) {
        return res.status(403).json({
            message: "Not authorized to update this post"
        });
    }

    post.caption = caption;

    await post.save();

    return res.status(200).json({
        message: "Post updated successfully",
        post
    });
}

async function deletePost(req, res) {

    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    if (post.owner.toString() !== req.user.id.toString()) {
        return res.status(403).json({
            message: "Not authorized to delete this post"
        });
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
        message: "Post deleted successfully"
    });
}

module.exports = { createPost , getPosts , likePost , updatePost , deletePost };