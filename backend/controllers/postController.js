const Post = require("../models/Post");

// @route  GET /api/posts?page=1&limit=9&search=&tag=
const getPosts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 9, 50);
    const skip = (page - 1) * limit;

    const filter = { published: true };
    if (req.query.tag) filter.tags = req.query.tag;
    if (req.query.search) filter.$text = { $search: req.query.search };

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate("author", "name avatarUrl")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(filter),
    ]);

    res.json({
      posts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit) || 1,
        limit,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/posts/:slug
const getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate("author", "name avatarUrl bio");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ post });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/posts
const createPost = async (req, res, next) => {
  try {
    const { title, excerpt, content, coverImageUrl, coverImageAlt, tags, published } = req.body;
    if (!title || !excerpt || !content) {
      return res.status(400).json({ message: "Title, excerpt and content are required" });
    }

    const post = await Post.create({
      title,
      excerpt,
      content,
      coverImageUrl,
      coverImageAlt,
      tags: Array.isArray(tags) ? tags : (tags || "").split(",").map((t) => t.trim()).filter(Boolean),
      published: published !== undefined ? published : true,
      author: req.user._id,
    });

    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/posts/:id
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this post" });
    }

    const fields = ["title", "excerpt", "content", "coverImageUrl", "coverImageAlt", "published"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) post[field] = req.body[field];
    });
    if (req.body.tags !== undefined) {
      post.tags = Array.isArray(req.body.tags)
        ? req.body.tags
        : req.body.tags.split(",").map((t) => t.trim()).filter(Boolean);
    }

    await post.save();
    res.json({ post });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/posts/:id
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/posts/user/mine
const getMyPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPosts, getPostBySlug, createPost, updatePost, deletePost, getMyPosts };
