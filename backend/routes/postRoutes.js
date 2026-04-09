const express = require("express");
const router = express.Router();

const Post = require("../models/Post");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post(
  "/upload-image",
  adminMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No image file uploaded"
        });
      }

      res.status(200).json({
        message: "Image uploaded successfully",
        imageUrl: req.file.path
      });
    } catch (error) {
      console.error("UPLOAD IMAGE ERROR:", error);

      res.status(500).json({
        message: "Server error while uploading image",
        error: error.message
      });
    }
  }
);

router.get("/stats/dashboard", adminMiddleware, async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();
    const totalNews = await Post.countDocuments({ type: "news" });
    const totalGames = await Post.countDocuments({ type: "game" });
    const totalDownloads = await Post.countDocuments({ type: "download" });
    const totalTrending = await Post.countDocuments({ isTrending: true });
    const totalFeatured = await Post.countDocuments({ isFeatured: true });
    const totalUpcoming = await Post.countDocuments({ isUpcoming: true });

    res.status(200).json({
      totalPosts,
      totalNews,
      totalGames,
      totalDownloads,
      totalTrending,
      totalFeatured,
      totalUpcoming
    });
  } catch (error) {
    console.error("GET DASHBOARD STATS ERROR:", error);

    res.status(500).json({
      message: "Server error while fetching dashboard stats",
      error: error.message
    });
  }
});

router.post("/add", adminMiddleware, async (req, res) => {
  try {
    const {
      title,
      type,
      description,
      content,
      image,
      bannerImage,
      imageFit,
      imagePosition,
      bannerFit,
      bannerPosition,
      category,
      tags,
      externalLink,
      downloadLink,
      isTrending,
      isFeatured,
      isUpcoming,
      showOnHomepage,
      galleryImages,
      videoUrls,
      relatedGames,
      exploreMore
    } = req.body;

    if (!title || !type || !description) {
      return res.status(400).json({
        message: "Title, type, and description are required"
      });
    }

    if (!["game", "news", "download"].includes(type)) {
      return res.status(400).json({
        message: "Type must be game, news, or download"
      });
    }

    const newPost = new Post({
      title: title.trim(),
      type,
      description: description.trim(),
      content: content ? content.trim() : "",
      image: image ? image.trim() : "",
      bannerImage: bannerImage ? bannerImage.trim() : "",
      imageFit: imageFit || "cover",
      imagePosition: imagePosition || "center",
      bannerFit: bannerFit || "cover",
      bannerPosition: bannerPosition || "center",
      category: category ? category.trim() : "",
      tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
      externalLink: externalLink ? externalLink.trim() : "",
      downloadLink: downloadLink ? downloadLink.trim() : "",
      isTrending: Boolean(isTrending),
      isFeatured: Boolean(isFeatured),
      isUpcoming: Boolean(isUpcoming),
      showOnHomepage:
        showOnHomepage !== undefined ? Boolean(showOnHomepage) : true,
      galleryImages: Array.isArray(galleryImages)
        ? galleryImages.filter(Boolean)
        : [],
      videoUrls: Array.isArray(videoUrls) ? videoUrls.filter(Boolean) : [],
      relatedGames: Array.isArray(relatedGames) ? relatedGames : [],
      exploreMore: Array.isArray(exploreMore) ? exploreMore : []
    });

    await newPost.save();

    res.status(201).json({
      message: "Post added successfully",
      post: newPost
    });
  } catch (error) {
    console.error("ADD POST ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "A post with a similar slug/title already exists",
        error: error.message
      });
    }

    res.status(500).json({
      message: "Server error while adding post",
      error: error.message
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("GET ALL POSTS ERROR:", error);

    res.status(500).json({
      message: "Server error while fetching posts",
      error: error.message
    });
  }
});

router.get("/homepage", async (req, res) => {
  try {
    const posts = await Post.find({ showOnHomepage: true })
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json(posts);
  } catch (error) {
    console.error("GET HOMEPAGE POSTS ERROR:", error);

    res.status(500).json({
      message: "Server error while fetching homepage posts",
      error: error.message
    });
  }
});

router.get("/trending", async (req, res) => {
  try {
    const posts = await Post.find({ isTrending: true }).sort({
      createdAt: -1
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("GET TRENDING POSTS ERROR:", error);

    res.status(500).json({
      message: "Server error while fetching trending posts",
      error: error.message
    });
  }
});

router.get("/featured", async (req, res) => {
  try {
    const posts = await Post.find({ isFeatured: true }).sort({
      createdAt: -1
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("GET FEATURED POSTS ERROR:", error);

    res.status(500).json({
      message: "Server error while fetching featured posts",
      error: error.message
    });
  }
});

router.get("/upcoming", async (req, res) => {
  try {
    const posts = await Post.find({ isUpcoming: true }).sort({
      createdAt: -1
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("GET UPCOMING POSTS ERROR:", error);

    res.status(500).json({
      message: "Server error while fetching upcoming posts",
      error: error.message
    });
  }
});

router.get("/type/:type", async (req, res) => {
  try {
    const { type } = req.params;

    if (!["game", "news", "download"].includes(type)) {
      return res.status(400).json({
        message: "Invalid post type"
      });
    }

    const posts = await Post.find({ type }).sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("GET POSTS BY TYPE ERROR:", error);

    res.status(500).json({
      message: "Server error while fetching posts by type",
      error: error.message
    });
  }
});

router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({ slug });

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("GET SINGLE POST BY SLUG ERROR:", error);

    res.status(500).json({
      message: "Server error while fetching post",
      error: error.message
    });
  }
});

// AUTO RELATED + AUTO EXPLORE
router.get("/slug/:slug/related", async (req, res) => {
  try {
    const { slug } = req.params;

    const currentPost = await Post.findOne({ slug });

    if (!currentPost) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    const currentTags = Array.isArray(currentPost.tags)
      ? currentPost.tags.map((tag) => String(tag).toLowerCase().trim())
      : [];

    const candidates = await Post.find({
      _id: { $ne: currentPost._id }
    }).sort({ createdAt: -1 });

    const scoredPosts = candidates
      .map((candidate) => {
        let score = 0;

        if (
          currentPost.category &&
          candidate.category &&
          currentPost.category.toLowerCase().trim() ===
            candidate.category.toLowerCase().trim()
        ) {
          score += 5;
        }

        if (currentPost.type && candidate.type === currentPost.type) {
          score += 3;
        }

        const candidateTags = Array.isArray(candidate.tags)
          ? candidate.tags.map((tag) => String(tag).toLowerCase().trim())
          : [];

        const commonTags = currentTags.filter((tag) =>
          candidateTags.includes(tag)
        );

        score += commonTags.length * 4;

        const currentTitle = `${currentPost.title || ""} ${
          currentPost.description || ""
        }`.toLowerCase();
        const candidateTitle = `${candidate.title || ""} ${
          candidate.description || ""
        }`.toLowerCase();

        const currentWords = currentTitle
          .split(/\s+/)
          .map((w) => w.trim())
          .filter((w) => w.length > 3);

        const matchingWords = currentWords.filter((word) =>
          candidateTitle.includes(word)
        );

        score += Math.min(matchingWords.length, 3);

        if (candidate.isFeatured) score += 1;
        if (candidate.isTrending) score += 1;

        return {
          ...candidate.toObject(),
          _score: score
        };
      })
      .filter((item) => item._score > 0)
      .sort((a, b) => b._score - a._score);

    const related = scoredPosts.slice(0, 4);
    const explore = scoredPosts.slice(4, 8);

    res.status(200).json({
      related,
      explore
    });
  } catch (error) {
    console.error("GET AUTO RELATED POSTS ERROR:", error);

    res.status(500).json({
      message: "Server error while fetching related posts",
      error: error.message
    });
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.status(200).json([]);
    }

    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { type: { $regex: query, $options: "i" } },
        { tags: { $elemMatch: { $regex: query, $options: "i" } } }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json(posts);
  } catch (error) {
    console.error("SEARCH POSTS ERROR:", error);

    res.status(500).json({
      message: "Server error while searching posts",
      error: error.message
    });
  }
});

router.delete("/delete/:id", adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    res.status(200).json({
      message: "Post deleted successfully"
    });
  } catch (error) {
    console.error("DELETE POST ERROR:", error);

    res.status(500).json({
      message: "Server error while deleting post",
      error: error.message
    });
  }
});

router.put("/update/:id", adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      type,
      description,
      content,
      image,
      bannerImage,
      imageFit,
      imagePosition,
      bannerFit,
      bannerPosition,
      category,
      tags,
      externalLink,
      downloadLink,
      isTrending,
      isFeatured,
      isUpcoming,
      showOnHomepage,
      galleryImages,
      videoUrls,
      relatedGames,
      exploreMore
    } = req.body;

    const updatedData = {
      title,
      type,
      description,
      content,
      image,
      bannerImage,
      imageFit,
      imagePosition,
      bannerFit,
      bannerPosition,
      category,
      tags,
      externalLink,
      downloadLink,
      isTrending,
      isFeatured,
      isUpcoming,
      showOnHomepage,
      galleryImages,
      videoUrls,
      relatedGames,
      exploreMore
    };

    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] === undefined) {
        delete updatedData[key];
      }
    });

    if (updatedData.title) {
      updatedData.slug = updatedData.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    }

    const updatedPost = await Post.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    });

    if (!updatedPost) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost
    });
  } catch (error) {
    console.error("UPDATE POST ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Another post with a similar slug/title already exists",
        error: error.message
      });
    }

    res.status(500).json({
      message: "Server error while updating post",
      error: error.message
    });
  }
});

module.exports = router;