const mongoose = require("mongoose");

const RelatedItemSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", trim: true },
    subtitle: { type: String, default: "", trim: true },
    image: { type: String, default: "", trim: true },
    link: { type: String, default: "", trim: true },
    label: { type: String, default: "", trim: true }
  },
  { _id: false }
);

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    slug: {
      type: String,
      unique: true,
      trim: true,
      index: true
    },

    type: {
      type: String,
      required: true,
      enum: ["game", "news", "download"],
      index: true
    },

    description: { type: String, required: true, trim: true },
    content: { type: String, default: "", trim: true },

    image: { type: String, default: "", trim: true },
    bannerImage: { type: String, default: "", trim: true },

    imageFit: {
      type: String,
      enum: ["cover", "contain"],
      default: "cover"
    },

    imagePosition: {
      type: String,
      enum: ["center", "top", "bottom", "left", "right"],
      default: "center"
    },

    bannerFit: {
      type: String,
      enum: ["cover", "contain"],
      default: "cover"
    },

    bannerPosition: {
      type: String,
      enum: ["center", "top", "bottom", "left", "right"],
      default: "center"
    },

    category: {
      type: String,
      default: "",
      trim: true,
      index: true
    },

    tags: [{ type: String, trim: true, index: true }],

    externalLink: { type: String, default: "", trim: true },
    downloadLink: { type: String, default: "", trim: true },

    isTrending: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isUpcoming: { type: Boolean, default: false, index: true },
    showOnHomepage: { type: Boolean, default: true, index: true },

    galleryImages: [{ type: String, trim: true }],
    videoUrls: [{ type: String, trim: true }],

    relatedGames: [RelatedItemSchema],
    exploreMore: [RelatedItemSchema]
  },
  {
    timestamps: true
  }
);

PostSchema.index({ createdAt: -1 });
PostSchema.index({ title: "text", description: "text", category: "text", tags: "text" });

PostSchema.pre("save", function () {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
});

module.exports = mongoose.model("Post", PostSchema);