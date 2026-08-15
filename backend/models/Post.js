const mongoose = require("mongoose");
const slugify = require("slugify");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 140,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    excerpt: {
      type: String,
      maxlength: 220,
      required: [true, "Excerpt is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    coverImageUrl: {
      type: String,
      default: "",
    },
    coverImageAlt: {
      type: String,
      default: "",
      maxlength: 160,
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    published: {
      type: Boolean,
      default: true,
    },
    readTimeMinutes: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

postSchema.index({ title: "text", content: "text", tags: "text" });

postSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + "-" + Date.now().toString(36);
  }
  if (this.content) {
    const words = this.content.trim().split(/\s+/).length;
    this.readTimeMinutes = Math.max(1, Math.round(words / 200));
  }
  next();
});

module.exports = mongoose.model("Post", postSchema);
