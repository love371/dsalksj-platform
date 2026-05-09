"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { apiUrl } from "@/lib/api";

const editorButtonStyle = {
  padding: "8px 12px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold"
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  outline: "none",
  fontSize: "15px",
  boxSizing: "border-box"
};

const cardStyle = {
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "24px",
  padding: "24px",
  backdropFilter: "blur(14px)",
  boxShadow: "0 14px 30px rgba(0,0,0,0.35)"
};

const createListItem = () => ({
  title: "",
  subtitle: "",
  image: "",
  link: "",
  label: ""
});

export default function AdminPage() {
  const editorRef = useRef(null);

  const singleEditorImageInputRef = useRef(null);
  const multiEditorImageInputRef = useRef(null);
  const twoEditorImageInputRef = useRef(null);
  const fourEditorImageInputRef = useRef(null);

  const selectedEditorElementRef = useRef(null);

  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);

  const [selectedEditorElement, setSelectedEditorElement] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    type: "news",
    description: "",
    content: "",
    image: "",
    bannerImage: "",
    imageFit: "cover",
    imagePosition: "center",
    bannerFit: "cover",
    bannerPosition: "center",
    category: "",
    tags: "",
    externalLink: "",
    downloadLink: "",
    isTrending: false,
    isFeatured: false,
    isUpcoming: false,
    showOnHomepage: true,
    galleryImages: [],
    videoUrls: [""],
    relatedGames: [createListItem()],
    exploreMore: [createListItem()]
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingEditorImage, setUploadingEditorImage] = useState(false);
  const [uploadingEditorMultiImage, setUploadingEditorMultiImage] =
    useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (!savedUser || !savedToken) {
      window.location.href = "/";
      return;
    }

    const parsedUser = JSON.parse(savedUser);

    if (parsedUser.role !== "admin") {
      window.location.href = "/";
      return;
    }

    setUser(parsedUser);
    setToken(savedToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    const loadAdminData = async () => {
      try {
        setPageLoading(true);

        const [statsRes, postsRes] = await Promise.all([
          fetch(apiUrl("/api/posts/stats/dashboard"), {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          fetch(apiUrl("/api/posts/admin/all"), {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
        ]);

        const statsData = await statsRes.json();
        const postsData = await postsRes.json();

        if (statsRes.ok) setStats(statsData);
        if (postsRes.ok) setPosts(Array.isArray(postsData) ? postsData : []);
      } catch (error) {
        console.error("Admin page load error:", error);
        setPosts([]);
      } finally {
        setPageLoading(false);
      }
    };

    loadAdminData();
  }, [token]);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== formData.content) {
      editorRef.current.innerHTML = formData.content || "";
    }
  }, [formData.content]);

  const previewTags = useMemo(
    () => formData.tags.split(",").map((item) => item.trim()).filter(Boolean),
    [formData.tags]
  );

  const refreshPostsAndStats = async () => {
    try {
      const [statsRes, postsRes] = await Promise.all([
        fetch(apiUrl("/api/posts/stats/dashboard"), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        fetch(apiUrl("/api/posts/admin/all"), {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
      ]);

      const statsData = await statsRes.json();
      const postsData = await postsRes.json();

      if (statsRes.ok) setStats(statsData);
      if (postsRes.ok) setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (error) {
      console.error("Refresh admin data error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleEditorInput = () => {
    setFormData((prev) => ({
      ...prev,
      content: editorRef.current?.innerHTML || ""
    }));
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    handleEditorInput();
  };

  const insertHtmlAtCursor = (html) => {
    editorRef.current?.focus();
    document.execCommand("insertHTML", false, html);
    handleEditorInput();
  };

  const uploadImageToServer = async (file) => {
    if (!file) throw new Error("No file selected");

    const form = new FormData();
    form.append("image", file);

    const response = await fetch(apiUrl("/api/posts/upload-image"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: form
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Image upload failed");
    }

    return data.imageUrl;
  };

  const clearSelectedEditorElement = () => {
    const current = selectedEditorElementRef.current;
    if (current) {
      current.style.outline = "none";
      current.style.boxShadow = "none";
    }
    selectedEditorElementRef.current = null;
    setSelectedEditorElement(null);
  };

  const applyEditorSelectionStyle = (element) => {
    clearSelectedEditorElement();
    element.style.outline = "3px solid #a855f7";
    element.style.boxShadow = "0 0 0 4px rgba(168,85,247,0.15)";
    selectedEditorElementRef.current = element;
    setSelectedEditorElement(element);
  };

  const handleEditorClick = (e) => {
    const selectable = e.target.closest(
      'img, video, iframe, a[data-editor-button="true"]'
    );

    if (selectable && editorRef.current?.contains(selectable)) {
      applyEditorSelectionStyle(selectable);
    } else {
      clearSelectedEditorElement();
    }
  };

  const deleteSelectedEditorElement = () => {
    const current = selectedEditorElementRef.current;
    if (!current) return;

    const parent = current.parentElement;
    current.remove();

    if (
      parent &&
      parent !== editorRef.current &&
      parent.innerHTML.replace(/<br\s*\/?>/gi, "").trim() === ""
    ) {
      parent.remove();
    }

    clearSelectedEditorElement();
    handleEditorInput();
  };

  const increaseSelectedImageSize = () => {
    const current = selectedEditorElementRef.current;
    if (!current || current.tagName !== "IMG") return;

    const currentWidth =
      parseInt(current.style.width || "100", 10) || 100;

    const nextWidth = Math.min(currentWidth + 10, 100);
    current.style.width = `${nextWidth}%`;
    current.style.maxWidth = "100%";
    current.style.height = "auto";

    handleEditorInput();
  };

  const decreaseSelectedImageSize = () => {
    const current = selectedEditorElementRef.current;
    if (!current || current.tagName !== "IMG") return;

    const currentWidth =
      parseInt(current.style.width || "100", 10) || 100;

    const nextWidth = Math.max(currentWidth - 10, 20);
    current.style.width = `${nextWidth}%`;
    current.style.maxWidth = "100%";
    current.style.height = "auto";

    handleEditorInput();
  };

  const setSelectedImageRatio = (ratio) => {
    const current = selectedEditorElementRef.current;
    if (!current || current.tagName !== "IMG") return;

    if (ratio === "auto") {
      current.style.aspectRatio = "auto";
      current.style.objectFit = "contain";
    } else if (ratio === "1:1") {
      current.style.aspectRatio = "1 / 1";
      current.style.objectFit = "cover";
    } else if (ratio === "4:3") {
      current.style.aspectRatio = "4 / 3";
      current.style.objectFit = "cover";
    } else if (ratio === "16:9") {
      current.style.aspectRatio = "16 / 9";
      current.style.objectFit = "cover";
    }

    handleEditorInput();
  };

  const handleInsertImageUrl = () => {
    const url = window.prompt("Enter image URL");
    if (!url) return;

    insertHtmlAtCursor(`
      <div style="margin:18px 0;">
        <img 
          src="${url}" 
          alt="Inserted Media" 
          style="width:100%; max-width:100%; height:auto; border-radius:16px; display:block;" 
        />
      </div>
    `);
  };

  const handleInsertEditorImageFromDevice = async (file) => {
    try {
      if (!file) return;

      setUploadingEditorImage(true);
      const imageUrl = await uploadImageToServer(file);

      insertHtmlAtCursor(`
        <div style="margin:18px 0;">
          <img 
            src="${imageUrl}" 
            alt="Inserted Media" 
            style="width:100%; max-width:100%; height:auto; border-radius:16px; display:block;" 
          />
        </div>
      `);
    } catch (error) {
      console.error("Editor image upload error:", error);
      alert(error.message || "Server error while uploading image");
    } finally {
      setUploadingEditorImage(false);
      if (singleEditorImageInputRef.current) {
        singleEditorImageInputRef.current.value = "";
      }
    }
  };

  const handleInsertMultiImage = () => {
    const urls = window.prompt("Enter image URLs separated by comma");
    if (!urls) return;

    const images = urls
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean);

    if (!images.length) return;

    const html = `
      <div style="display:flex; gap:10px; margin:18px 0; flex-wrap:wrap; align-items:flex-start;">
        ${images
          .map(
            (img) => `
          <img 
            src="${img}" 
            alt="Inserted Multi Media"
            style="flex:1 1 220px; max-width:100%; height:auto; border-radius:12px; display:block;" 
          />
        `
          )
          .join("")}
      </div>
    `;

    insertHtmlAtCursor(html);
  };

  const handleInsertMultiImageFromDevice = async (files) => {
    try {
      const selectedFiles = Array.from(files || []);
      if (!selectedFiles.length) return;

      setUploadingEditorMultiImage(true);

      const uploadedUrls = await Promise.all(
        selectedFiles.map((file) => uploadImageToServer(file))
      );

      const html = `
        <div style="display:flex; gap:10px; margin:18px 0; flex-wrap:wrap; align-items:flex-start;">
          ${uploadedUrls
            .map(
              (img) => `
            <img 
              src="${img}" 
              alt="Inserted Multi Media"
              style="flex:1 1 220px; max-width:100%; height:auto; border-radius:12px; display:block;" 
            />
          `
            )
            .join("")}
        </div>
      `;

      insertHtmlAtCursor(html);
    } catch (error) {
      console.error("Editor multi image upload error:", error);
      alert(error.message || "Server error while uploading multiple images");
    } finally {
      setUploadingEditorMultiImage(false);
      if (multiEditorImageInputRef.current) {
        multiEditorImageInputRef.current.value = "";
      }
    }
  };

  const handleInsertTwoImageUrls = () => {
    const urls = window.prompt("Enter exactly 2 image URLs separated by comma");
    if (!urls) return;

    const images = urls
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean)
      .slice(0, 2);

    if (images.length < 2) {
      alert("Please enter exactly 2 image URLs.");
      return;
    }

    insertHtmlAtCursor(`
      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:10px; margin:18px 0;">
        ${images
          .map(
            (img) => `
          <img 
            src="${img}" 
            alt="2-image layout"
            style="width:100%; max-width:100%; height:auto; border-radius:12px; display:block;" 
          />
        `
          )
          .join("")}
      </div>
    `);
  };

  const handleInsertFourImageUrls = () => {
    const urls = window.prompt("Enter exactly 4 image URLs separated by comma");
    if (!urls) return;

    const images = urls
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean)
      .slice(0, 4);

    if (images.length < 4) {
      alert("Please enter exactly 4 image URLs.");
      return;
    }

    insertHtmlAtCursor(`
      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:10px; margin:18px 0;">
        ${images
          .map(
            (img) => `
          <img 
            src="${img}" 
            alt="4-image layout"
            style="width:100%; max-width:100%; height:auto; border-radius:12px; display:block;" 
          />
        `
          )
          .join("")}
      </div>
    `);
  };

  const handleInsertTwoImageFromDevice = async (files) => {
    try {
      const selectedFiles = Array.from(files || []).slice(0, 2);
      if (selectedFiles.length < 2) {
        alert("Please select exactly 2 images.");
        return;
      }

      setUploadingEditorMultiImage(true);

      const uploadedUrls = await Promise.all(
        selectedFiles.map((file) => uploadImageToServer(file))
      );

      insertHtmlAtCursor(`
        <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:10px; margin:18px 0;">
          ${uploadedUrls
            .map(
              (img) => `
            <img 
              src="${img}" 
              alt="2-image layout"
              style="width:100%; max-width:100%; height:auto; border-radius:12px; display:block;" 
            />
          `
            )
            .join("")}
        </div>
      `);
    } catch (error) {
      console.error("2 image upload error:", error);
      alert(error.message || "Server error while uploading 2 images");
    } finally {
      setUploadingEditorMultiImage(false);
      if (twoEditorImageInputRef.current) {
        twoEditorImageInputRef.current.value = "";
      }
    }
  };

  const handleInsertFourImageFromDevice = async (files) => {
    try {
      const selectedFiles = Array.from(files || []).slice(0, 4);
      if (selectedFiles.length < 4) {
        alert("Please select exactly 4 images.");
        return;
      }

      setUploadingEditorMultiImage(true);

      const uploadedUrls = await Promise.all(
        selectedFiles.map((file) => uploadImageToServer(file))
      );

      insertHtmlAtCursor(`
        <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:10px; margin:18px 0;">
          ${uploadedUrls
            .map(
              (img) => `
            <img 
              src="${img}" 
              alt="4-image layout"
              style="width:100%; max-width:100%; height:auto; border-radius:12px; display:block;" 
            />
          `
            )
            .join("")}
        </div>
      `);
    } catch (error) {
      console.error("4 image upload error:", error);
      alert(error.message || "Server error while uploading 4 images");
    } finally {
      setUploadingEditorMultiImage(false);
      if (fourEditorImageInputRef.current) {
        fourEditorImageInputRef.current.value = "";
      }
    }
  };

  const getYouTubeEmbed = (url) => {
    if (!url) return "";

    if (url.includes("youtube.com/watch?v=")) {
      const id = url.split("v=")[1]?.split("&")[0];
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    return "";
  };

  const handleInsertVideoUrl = () => {
    const url = window.prompt("Enter video URL or YouTube link");
    if (!url) return;

    const embed = getYouTubeEmbed(url);

    if (embed) {
      insertHtmlAtCursor(`
        <div style="margin:18px 0;">
          <iframe
            src="${embed}"
            style="width:100%; aspect-ratio:16/9; border:none; border-radius:16px; display:block;"
            allowfullscreen
          ></iframe>
        </div>
      `);
    } else {
      insertHtmlAtCursor(`
        <div style="margin:18px 0;">
          <video controls style="width:100%; height:auto; border-radius:16px; display:block;">
            <source src="${url}" />
          </video>
        </div>
      `);
    }
  };

  const handleInsertButton = () => {
    const text = window.prompt("Enter button text");
    const link = window.prompt("Enter button link");

    if (!text || !link) return;

    insertHtmlAtCursor(`
      <div style="margin:20px 0; text-align:center;">
        <a 
          href="${link}" 
          target="_blank" 
          rel="noreferrer"
          data-editor-button="true"
          style="
            display:inline-block;
            padding:12px 20px;
            border-radius:10px;
            background:linear-gradient(90deg,#7c3aed,#ec4899);
            color:white;
            font-weight:bold;
            text-decoration:none;
          "
        >
          ${text}
        </a>
      </div>
    `);
  };

  const resetForm = () => {
    clearSelectedEditorElement();
    setEditingPostId(null);
    setFormData({
      title: "",
      type: "news",
      description: "",
      content: "",
      image: "",
      bannerImage: "",
      imageFit: "cover",
      imagePosition: "center",
      bannerFit: "cover",
      bannerPosition: "center",
      category: "",
      tags: "",
      externalLink: "",
      downloadLink: "",
      isTrending: false,
      isFeatured: false,
      isUpcoming: false,
      showOnHomepage: true,
      galleryImages: [],
      videoUrls: [""],
      relatedGames: [createListItem()],
      exploreMore: [createListItem()]
    });

    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  };

  const uploadSingleImage = async (file, targetField) => {
    try {
      if (!file) return;

      if (targetField === "image") setUploadingImage(true);
      if (targetField === "bannerImage") setUploadingBanner(true);

      const imageUrl = await uploadImageToServer(file);

      setFormData((prev) => ({
        ...prev,
        [targetField]: imageUrl
      }));
    } catch (error) {
      console.error("Upload image error:", error);
      alert(error.message || "Server error while uploading image");
    } finally {
      if (targetField === "image") setUploadingImage(false);
      if (targetField === "bannerImage") setUploadingBanner(false);
    }
  };

  const uploadGalleryImage = async (file) => {
    try {
      if (!file) return;

      setUploadingGallery(true);

      const imageUrl = await uploadImageToServer(file);

      setFormData((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, imageUrl]
      }));
    } catch (error) {
      console.error("Upload gallery image error:", error);
      alert(error.message || "Server error while uploading gallery image");
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }));
  };

  const updateVideoUrl = (index, value) => {
    setFormData((prev) => {
      const next = [...prev.videoUrls];
      next[index] = value;
      return {
        ...prev,
        videoUrls: next
      };
    });
  };

  const addVideoUrlField = () => {
    setFormData((prev) => ({
      ...prev,
      videoUrls: [...prev.videoUrls, ""]
    }));
  };

  const removeVideoUrlField = (index) => {
    setFormData((prev) => ({
      ...prev,
      videoUrls:
        prev.videoUrls.length > 1
          ? prev.videoUrls.filter((_, i) => i !== index)
          : [""]
    }));
  };

  const updateListItem = (section, index, field, value) => {
    setFormData((prev) => {
      const next = [...prev[section]];
      next[index] = {
        ...next[index],
        [field]: value
      };

      return {
        ...prev,
        [section]: next
      };
    });
  };

  const addListItem = (section) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], createListItem()]
    }));
  };

  const removeListItem = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]:
        prev[section].length > 1
          ? prev[section].filter((_, i) => i !== index)
          : [createListItem()]
    }));
  };

  const buildPayload = () => ({
    ...formData,
    tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
    galleryImages: formData.galleryImages.filter(Boolean),
    videoUrls: formData.videoUrls.map((v) => v.trim()).filter(Boolean),
    relatedGames: formData.relatedGames.filter(
      (item) =>
        item.title?.trim() ||
        item.subtitle?.trim() ||
        item.image?.trim() ||
        item.link?.trim() ||
        item.label?.trim()
    ),
    exploreMore: formData.exploreMore.filter(
      (item) =>
        item.title?.trim() ||
        item.subtitle?.trim() ||
        item.image?.trim() ||
        item.link?.trim() ||
        item.label?.trim()
    )
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = buildPayload();

      const url = editingPostId
        ? apiUrl(`/api/posts/update/${editingPostId}`)
        : apiUrl("/api/posts/add");

      const method = editingPostId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          editingPostId
            ? "Post updated successfully ✅"
            : "Post created successfully 🚀"
        );
        resetForm();
        refreshPostsAndStats();
      } else {
        alert(data.message || "Error saving post");
      }
    } catch (error) {
      console.error("Submit post error:", error);
      alert("Server error while saving post");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = (post) => {
    clearSelectedEditorElement();
    setEditingPostId(post._id);

    setFormData({
      title: post.title || "",
      type: post.type || "news",
      description: post.description || "",
      content: post.content || "",
      image: post.image || "",
      bannerImage: post.bannerImage || "",
      imageFit: post.imageFit || "cover",
      imagePosition: post.imagePosition || "center",
      bannerFit: post.bannerFit || "cover",
      bannerPosition: post.bannerPosition || "center",
      category: post.category || "",
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
      externalLink: post.externalLink || "",
      downloadLink: post.downloadLink || "",
      isTrending: Boolean(post.isTrending),
      isFeatured: Boolean(post.isFeatured),
      isUpcoming: Boolean(post.isUpcoming),
      showOnHomepage:
        post.showOnHomepage !== undefined ? Boolean(post.showOnHomepage) : true,
      galleryImages: Array.isArray(post.galleryImages) ? post.galleryImages : [],
      videoUrls:
        Array.isArray(post.videoUrls) && post.videoUrls.length > 0
          ? post.videoUrls
          : [""],
      relatedGames:
        Array.isArray(post.relatedGames) && post.relatedGames.length > 0
          ? post.relatedGames.map((item) => ({
              title: item.title || "",
              subtitle: item.subtitle || "",
              image: item.image || "",
              link: item.link || "",
              label: item.label || ""
            }))
          : [createListItem()],
      exploreMore:
        Array.isArray(post.exploreMore) && post.exploreMore.length > 0
          ? post.exploreMore.map((item) => ({
              title: item.title || "",
              subtitle: item.subtitle || "",
              image: item.image || "",
              link: item.link || "",
              label: item.label || ""
            }))
          : [createListItem()]
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(apiUrl(`/api/posts/delete/${postId}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert("Post deleted successfully");
        refreshPostsAndStats();
      } else {
        alert(data.message || "Error deleting post");
      }
    } catch (error) {
      console.error("Delete post error:", error);
      alert("Server error while deleting post");
    }
  };

  const renderListEditor = (sectionName, title) => (
    <div style={cardStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
          gap: "12px",
          flexWrap: "wrap"
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "18px" }}>{title}</div>
        <button
          type="button"
          onClick={() => addListItem(sectionName)}
          style={editorButtonStyle}
        >
          + Add Item
        </button>
      </div>

      <div style={{ display: "grid", gap: "14px" }}>
        {formData[sectionName].map((item, index) => (
          <div
            key={`${sectionName}-${index}`}
            style={{
              padding: "16px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)"
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "12px"
              }}
            >
              <input
                placeholder="Title"
                value={item.title}
                onChange={(e) =>
                  updateListItem(sectionName, index, "title", e.target.value)
                }
                style={inputStyle}
              />
              <input
                placeholder="Subtitle"
                value={item.subtitle}
                onChange={(e) =>
                  updateListItem(sectionName, index, "subtitle", e.target.value)
                }
                style={inputStyle}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "12px"
              }}
            >
              <input
                placeholder="Image URL"
                value={item.image}
                onChange={(e) =>
                  updateListItem(sectionName, index, "image", e.target.value)
                }
                style={inputStyle}
              />
              <input
                placeholder="Link URL"
                value={item.link}
                onChange={(e) =>
                  updateListItem(sectionName, index, "link", e.target.value)
                }
                style={inputStyle}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "12px",
                alignItems: "center"
              }}
            >
              <input
                placeholder="Small label (optional)"
                value={item.label}
                onChange={(e) =>
                  updateListItem(sectionName, index, "label", e.target.value)
                }
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => removeListItem(sectionName, index)}
                style={{
                  ...editorButtonStyle,
                  background: "rgba(239,68,68,0.18)"
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (!user || pageLoading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top, #18182f 0%, #09090f 40%, #040406 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          fontWeight: "bold"
        }}
      >
        Loading admin dashboard...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px",
        background:
          "radial-gradient(circle at top, #18182f 0%, #09090f 40%, #040406 100%)",
        color: "white",
        overflowX: "hidden"
      }}
    >
      <div style={{ maxWidth: "1500px", margin: "0 auto" }}>
        <section
          style={{
            ...cardStyle,
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap"
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color: "#c084fc",
                fontWeight: "bold",
                letterSpacing: "2px",
                textTransform: "uppercase"
              }}
            >
              dsalksj admin
            </p>
            <h1 style={{ margin: "10px 0 8px 0", fontSize: "42px" }}>
              Premium Content Dashboard
            </h1>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.7)" }}>
              Create, preview, edit, delete, and manage your gaming content from
              one place.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={() => (window.location.href = "/")}
              style={{
                ...editorButtonStyle,
                background: "linear-gradient(90deg, #7c3aed, #ec4899)",
                border: "none"
              }}
            >
              Back to Home
            </button>

            <button onClick={resetForm} style={editorButtonStyle}>
              New Post
            </button>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "18px",
            marginBottom: "24px"
          }}
        >
          {[
            ["Total Posts", stats?.totalPosts ?? 0],
            ["News", stats?.totalNews ?? 0],
            ["Games", stats?.totalGames ?? 0],
            ["Downloads", stats?.totalDownloads ?? 0],
            ["Trending", stats?.totalTrending ?? 0],
            ["Featured", stats?.totalFeatured ?? 0],
            ["Upcoming", stats?.totalUpcoming ?? 0]
          ].map(([label, value]) => (
            <div key={label} style={cardStyle}>
              <div
                style={{ color: "rgba(255,255,255,0.65)", marginBottom: "8px" }}
              >
                {label}
              </div>
              <div style={{ fontSize: "32px", fontWeight: "900" }}>{value}</div>
            </div>
          ))}
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: "24px",
            alignItems: "start"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "18px",
                  flexWrap: "wrap",
                  gap: "12px"
                }}
              >
                <h2 style={{ margin: 0, fontSize: "30px" }}>
                  {editingPostId ? "Edit Post" : "Create Post"}
                </h2>

                {editingPostId && (
                  <button onClick={resetForm} style={editorButtonStyle}>
                    Cancel Editing
                  </button>
                )}
              </div>

              <div style={{ display: "grid", gap: "14px" }}>
                <input
                  name="title"
                  placeholder="Post title"
                  value={formData.title}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px"
                  }}
                >
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    style={{ ...inputStyle, background: "#141421" }}
                  >
                    <option value="news">News</option>
                    <option value="game">Game</option>
                    <option value="download">Download</option>
                  </select>

                  <input
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                <textarea
                  name="description"
                  placeholder="Short description for cards and search results"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
                />

                <div style={{ ...cardStyle, padding: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginBottom: "12px"
                    }}
                  >
                    <button
                      type="button"
                      style={editorButtonStyle}
                      onClick={() => applyFormat("bold")}
                    >
                      B
                    </button>
                    <button
                      type="button"
                      style={editorButtonStyle}
                      onClick={() => applyFormat("italic")}
                    >
                      I
                    </button>
                    <button
                      type="button"
                      style={editorButtonStyle}
                      onClick={() => applyFormat("underline")}
                    >
                      U
                    </button>
                    <button
                      type="button"
                      style={editorButtonStyle}
                      onClick={() => applyFormat("insertUnorderedList")}
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      style={editorButtonStyle}
                      onClick={() => applyFormat("insertOrderedList")}
                    >
                      1. List
                    </button>
                    <button
                      type="button"
                      style={editorButtonStyle}
                      onClick={() => applyFormat("formatBlock", "<h2>")}
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      style={editorButtonStyle}
                      onClick={() => applyFormat("formatBlock", "<blockquote>")}
                    >
                      Quote
                    </button>

                    <button
                      type="button"
                      style={editorButtonStyle}
                      onClick={handleInsertImageUrl}
                    >
                      + Image URL
                    </button>

                    <button
                      type="button"
                      style={editorButtonStyle}
                      onClick={() => singleEditorImageInputRef.current?.click()}
                    >
                      + Image Device
                    </button>

                    <button
                      type="button"
                      style={editorButtonStyle}
                      onClick={handleInsertMultiImage}
                    >
                      + Multi Image URL
                    </button>

                    <button
                      type="button"
                      style={editorButtonStyle}
                      onClick={() => multiEditorImageInputRef.current?.click()}
                    >
                      + Multi Image Device
                    </button>

                    <button
                      type="button"
                      style={editorButtonStyle}
                      onClick={handleInsertTwoImageUrls}
                    >
                      + 2 Images URL
                    </button>

                    <button
                      type="button"
                      style={editorButtonStyle}
                      onClick={() => twoEditorImageInputRef.current?.click()}
                    >
                      + 2 Images Device
                    </button>

                    <button
                      type="button"
                      style={editorButtonStyle}
                      onClick={handleInsertFourImageUrls}
                    >
                      + 4 Images URL
                    </button>

                    <button
                      type="button"
                      style={editorButtonStyle}
                      onClick={() => fourEditorImageInputRef.current?.click()}
                    >
                      + 4 Images Device
                    </button>

                    <button
                      type="button"
                      style={editorButtonStyle}
                      onClick={handleInsertVideoUrl}
                    >
                      + Video
                    </button>

                    <button
                      type="button"
                      style={editorButtonStyle}
                      onClick={handleInsertButton}
                    >
                      + Button
                    </button>

                    <input
                      ref={singleEditorImageInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        handleInsertEditorImageFromDevice(e.target.files?.[0])
                      }
                    />

                    <input
                      ref={multiEditorImageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: "none" }}
                      onChange={(e) =>
                        handleInsertMultiImageFromDevice(e.target.files)
                      }
                    />

                    <input
                      ref={twoEditorImageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: "none" }}
                      onChange={(e) =>
                        handleInsertTwoImageFromDevice(e.target.files)
                      }
                    />

                    <input
                      ref={fourEditorImageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: "none" }}
                      onChange={(e) =>
                        handleInsertFourImageFromDevice(e.target.files)
                      }
                    />
                  </div>

                  {selectedEditorElement && (
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                        marginBottom: "12px",
                        padding: "10px",
                        borderRadius: "12px",
                        background: "rgba(168,85,247,0.12)",
                        border: "1px solid rgba(168,85,247,0.25)"
                      }}
                    >
                      <button
                        type="button"
                        style={{
                          ...editorButtonStyle,
                          background: "rgba(239,68,68,0.18)"
                        }}
                        onClick={deleteSelectedEditorElement}
                      >
                        🗑 Delete
                      </button>

                      <button
                        type="button"
                        style={editorButtonStyle}
                        onClick={decreaseSelectedImageSize}
                        disabled={selectedEditorElement.tagName !== "IMG"}
                      >
                        ◀ Smaller
                      </button>

                      <button
                        type="button"
                        style={editorButtonStyle}
                        onClick={increaseSelectedImageSize}
                        disabled={selectedEditorElement.tagName !== "IMG"}
                      >
                        Bigger ▶
                      </button>

                      <button
                        type="button"
                        style={editorButtonStyle}
                        onClick={() => setSelectedImageRatio("auto")}
                        disabled={selectedEditorElement.tagName !== "IMG"}
                      >
                        Ratio Auto
                      </button>

                      <button
                        type="button"
                        style={editorButtonStyle}
                        onClick={() => setSelectedImageRatio("1:1")}
                        disabled={selectedEditorElement.tagName !== "IMG"}
                      >
                        1:1
                      </button>

                      <button
                        type="button"
                        style={editorButtonStyle}
                        onClick={() => setSelectedImageRatio("4:3")}
                        disabled={selectedEditorElement.tagName !== "IMG"}
                      >
                        4:3
                      </button>

                      <button
                        type="button"
                        style={editorButtonStyle}
                        onClick={() => setSelectedImageRatio("16:9")}
                        disabled={selectedEditorElement.tagName !== "IMG"}
                      >
                        16:9
                      </button>
                    </div>
                  )}

                  {(uploadingEditorImage || uploadingEditorMultiImage) && (
                    <p style={{ color: "#c084fc", marginTop: 0 }}>
                      Uploading editor media...
                    </p>
                  )}

                  <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleEditorInput}
                    onClick={handleEditorClick}
                    suppressContentEditableWarning
                    style={{
                      minHeight: "260px",
                      borderRadius: "16px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.04)",
                      padding: "16px",
                      outline: "none",
                      lineHeight: "1.8",
                      color: "white"
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px"
                  }}
                >
                  <div style={cardStyle}>
                    <div style={{ marginBottom: "12px", fontWeight: "bold" }}>
                      Thumbnail Upload
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        uploadSingleImage(e.target.files?.[0], "image")
                      }
                      style={{ marginBottom: "12px" }}
                    />
                    <input
                      name="image"
                      placeholder="Thumbnail URL"
                      value={formData.image}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                    {uploadingImage && (
                      <p style={{ color: "#c084fc" }}>Uploading image...</p>
                    )}
                  </div>

                  <div style={cardStyle}>
                    <div style={{ marginBottom: "12px", fontWeight: "bold" }}>
                      Banner Upload
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        uploadSingleImage(e.target.files?.[0], "bannerImage")
                      }
                      style={{ marginBottom: "12px" }}
                    />
                    <input
                      name="bannerImage"
                      placeholder="Banner URL"
                      value={formData.bannerImage}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                    {uploadingBanner && (
                      <p style={{ color: "#c084fc" }}>Uploading banner...</p>
                    )}
                  </div>
                </div>

                <div style={cardStyle}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                      gap: "12px",
                      flexWrap: "wrap"
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>Gallery Images</div>
                    <label
                      style={{
                        ...editorButtonStyle,
                        display: "inline-flex",
                        alignItems: "center"
                      }}
                    >
                      Upload Gallery
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          uploadGalleryImage(e.target.files?.[0])
                        }
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>

                  {uploadingGallery && (
                    <p style={{ color: "#c084fc", marginTop: 0 }}>
                      Uploading gallery image...
                    </p>
                  )}

                  {formData.galleryImages.length === 0 ? (
                    <p style={{ color: "rgba(255,255,255,0.65)", margin: 0 }}>
                      No gallery images added yet.
                    </p>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                        gap: "12px"
                      }}
                    >
                      {formData.galleryImages.map((img, index) => (
                        <div
                          key={`${img}-${index}`}
                          style={{
                            padding: "10px",
                            borderRadius: "16px",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)"
                          }}
                        >
                          <img
                            src={img}
                            alt={`Gallery ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "12px",
                              marginBottom: "8px"
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            style={{
                              ...editorButtonStyle,
                              width: "100%",
                              background: "rgba(239,68,68,0.18)"
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={cardStyle}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                      gap: "12px",
                      flexWrap: "wrap"
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>Video URLs</div>
                    <button
                      type="button"
                      onClick={addVideoUrlField}
                      style={editorButtonStyle}
                    >
                      + Add Video
                    </button>
                  </div>

                  <div style={{ display: "grid", gap: "12px" }}>
                    {formData.videoUrls.map((url, index) => (
                      <div
                        key={`video-${index}`}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr auto",
                          gap: "12px",
                          alignItems: "center"
                        }}
                      >
                        <input
                          placeholder="Video URL or YouTube link"
                          value={url}
                          onChange={(e) =>
                            updateVideoUrl(index, e.target.value)
                          }
                          style={inputStyle}
                        />
                        <button
                          type="button"
                          onClick={() => removeVideoUrlField(index)}
                          style={{
                            ...editorButtonStyle,
                            background: "rgba(239,68,68,0.18)"
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px"
                  }}
                >
                  <div style={cardStyle}>
                    <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
                      Thumbnail Settings
                    </div>

                    <select
                      name="imageFit"
                      value={formData.imageFit}
                      onChange={handleChange}
                      style={{ ...inputStyle, background: "#141421" }}
                    >
                      <option value="cover">Cover (Crop)</option>
                      <option value="contain">Contain (Fit Full)</option>
                    </select>

                    <select
                      name="imagePosition"
                      value={formData.imagePosition}
                      onChange={handleChange}
                      style={{
                        ...inputStyle,
                        marginTop: "10px",
                        background: "#141421"
                      }}
                    >
                      <option value="center">Center</option>
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  <div style={cardStyle}>
                    <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
                      Banner Settings
                    </div>

                    <select
                      name="bannerFit"
                      value={formData.bannerFit}
                      onChange={handleChange}
                      style={{ ...inputStyle, background: "#141421" }}
                    >
                      <option value="cover">Cover (Crop)</option>
                      <option value="contain">Contain (Fit Full)</option>
                    </select>

                    <select
                      name="bannerPosition"
                      value={formData.bannerPosition}
                      onChange={handleChange}
                      style={{
                        ...inputStyle,
                        marginTop: "10px",
                        background: "#141421"
                      }}
                    >
                      <option value="center">Center</option>
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>

                <input
                  name="tags"
                  placeholder="Tags (comma separated)"
                  value={formData.tags}
                  onChange={handleChange}
                  style={inputStyle}
                />

                {renderListEditor("relatedGames", "Related Games / Posts")}
                {renderListEditor("exploreMore", "Explore More")}

                <input
                  name="externalLink"
                  placeholder="External link"
                  value={formData.externalLink}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <input
                  name="downloadLink"
                  placeholder="Download link"
                  value={formData.downloadLink}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <div
                  style={{
                    ...cardStyle,
                    padding: "18px",
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "12px"
                  }}
                >
                  {[
                    ["isTrending", "Trending"],
                    ["isFeatured", "Featured"],
                    ["isUpcoming", "Upcoming"],
                    ["showOnHomepage", "Show on Homepage"]
                  ].map(([name, label]) => (
                    <label
                      key={name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontWeight: "bold"
                      }}
                    >
                      <input
                        type="checkbox"
                        name={name}
                        checked={formData[name]}
                        onChange={handleChange}
                      />
                      {label}
                    </label>
                  ))}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    padding: "16px 18px",
                    borderRadius: "14px",
                    border: "none",
                    background: "linear-gradient(90deg, #7c3aed, #ec4899)",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "16px",
                    cursor: "pointer",
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading
                    ? "Saving..."
                    : editingPostId
                    ? "Update Post ✅"
                    : "Publish Post 🚀"}
                </button>
              </div>
            </div>

            <div style={cardStyle}>
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "18px",
                  fontSize: "30px"
                }}
              >
                Manage Posts
              </h2>

              {posts.length === 0 ? (
                <p style={{ color: "rgba(255,255,255,0.7)" }}>
                  No posts found.
                </p>
              ) : (
                <div style={{ display: "grid", gap: "14px" }}>
                  {posts.map((post) => (
                    <div
                      key={post._id}
                      style={{
                        borderRadius: "18px",
                        padding: "18px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                          gap: "16px",
                          flexWrap: "wrap"
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: "inline-block",
                              padding: "6px 12px",
                              borderRadius: "999px",
                              background: "rgba(255,255,255,0.08)",
                              fontSize: "12px",
                              fontWeight: "bold",
                              marginBottom: "10px",
                              textTransform: "uppercase"
                            }}
                          >
                            {post.type}
                          </div>

                          <h3 style={{ margin: "0 0 8px 0" }}>{post.title}</h3>
                          <p
                            style={{
                              margin: "0 0 8px 0",
                              color: "rgba(255,255,255,0.72)"
                            }}
                          >
                            {post.description}
                          </p>

                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              flexWrap: "wrap"
                            }}
                          >
                            {post.isTrending && (
                              <span style={{ color: "#f472b6" }}>
                                Trending
                              </span>
                            )}
                            {post.isFeatured && (
                              <span style={{ color: "#60a5fa" }}>
                                Featured
                              </span>
                            )}
                            {post.isUpcoming && (
                              <span style={{ color: "#34d399" }}>
                                Upcoming
                              </span>
                            )}
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            onClick={() => handleEditPost(post)}
                            style={{
                              ...editorButtonStyle,
                              background: "rgba(59,130,246,0.18)"
                            }}
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeletePost(post._id)}
                            style={{
                              ...editorButtonStyle,
                              background: "rgba(239,68,68,0.18)"
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ position: "sticky", top: "20px" }}>
            <div style={cardStyle}>
              <div
                style={{
                  display: "inline-block",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  background: "rgba(168,85,247,0.16)",
                  color: "#d8b4fe",
                  fontSize: "13px",
                  fontWeight: "bold",
                  marginBottom: "18px"
                }}
              >
                LIVE PREVIEW
              </div>

              <h2
                style={{
                  marginTop: 0,
                  fontSize: "28px",
                  lineHeight: 1.2,
                  marginBottom: "14px"
                }}
              >
                {formData.title || "Your post title will appear here"}
              </h2>

              {formData.bannerImage && (
                <div
                  style={{
                    width: "100%",
                    height: "180px",
                    borderRadius: "18px",
                    marginBottom: "16px",
                    overflow: "hidden",
                    background: "#0f0f18",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <img
                    src={formData.bannerImage}
                    alt="Banner Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: formData.bannerFit,
                      objectPosition: formData.bannerPosition,
                      borderRadius: "18px"
                    }}
                  />
                </div>
              )}

              <div
                style={{
                  display: "inline-block",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.08)",
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginBottom: "12px",
                  textTransform: "uppercase"
                }}
              >
                {formData.type || "news"}
              </div>

              <p
                style={{
                  color: "rgba(255,255,255,0.74)",
                  lineHeight: "1.8",
                  marginBottom: "16px"
                }}
              >
                {formData.description ||
                  "Your short description will appear here for cards and previews."}
              </p>

              {formData.image && (
                <div
                  style={{
                    width: "100%",
                    maxHeight: "220px",
                    marginBottom: "18px",
                    overflow: "hidden",
                    background: "#0f0f18",
                    borderRadius: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <img
                    src={formData.image}
                    alt="Thumbnail Preview"
                    style={{
                      width: "100%",
                      maxHeight: "220px",
                      objectFit: formData.imageFit,
                      objectPosition: formData.imagePosition,
                      borderRadius: "18px"
                    }}
                  />
                </div>
              )}

              {formData.galleryImages.length > 0 && (
                <div style={{ marginBottom: "18px" }}>
                  <h4>Gallery</h4>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "10px"
                    }}
                  >
                    {formData.galleryImages.slice(0, 4).map((img, index) => (
                      <img
                        key={`${img}-${index}`}
                        src={img}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "90px",
                          objectFit: "cover",
                          borderRadius: "12px"
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div
                dangerouslySetInnerHTML={{
                  __html:
                    formData.content ||
                    "<p>Your rich text content preview will appear here.</p>"
                }}
                style={{
                  color: "rgba(255,255,255,0.82)",
                  lineHeight: "1.8",
                  marginBottom: "18px"
                }}
              />

              {previewTags.length > 0 && (
                <div style={{ marginBottom: "18px" }}>
                  <h4>Tags</h4>
                  <div
                    style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                  >
                    {previewTags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "999px",
                          background: "rgba(255,255,255,0.08)"
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {formData.relatedGames.some(
                (item) => item.title || item.subtitle || item.image
              ) && (
                <div style={{ marginBottom: "18px" }}>
                  <h4>Related Games / Posts</h4>
                  <div style={{ display: "grid", gap: "10px" }}>
                    {formData.relatedGames
                      .filter((item) => item.title || item.subtitle || item.image)
                      .slice(0, 3)
                      .map((item, index) => (
                        <div
                          key={`preview-related-${index}`}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "72px 1fr",
                            gap: "12px",
                            alignItems: "center",
                            padding: "10px",
                            borderRadius: "14px",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)"
                          }}
                        >
                          <img
                            src={
                              item.image ||
                              "https://via.placeholder.com/72x72?text=IMG"
                            }
                            alt={item.title || "Related"}
                            style={{
                              width: "72px",
                              height: "72px",
                              objectFit: "cover",
                              borderRadius: "12px"
                            }}
                          />
                          <div>
                            {item.label && (
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "#c084fc",
                                  fontWeight: "bold",
                                  textTransform: "uppercase",
                                  marginBottom: "4px"
                                }}
                              >
                                {item.label}
                              </div>
                            )}
                            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                              {item.title}
                            </div>
                            <div
                              style={{
                                color: "rgba(255,255,255,0.65)",
                                fontSize: "13px"
                              }}
                            >
                              {item.subtitle}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {formData.exploreMore.some(
                (item) => item.title || item.subtitle || item.image
              ) && (
                <div style={{ marginBottom: "18px" }}>
                  <h4>Explore More</h4>
                  <div style={{ display: "grid", gap: "10px" }}>
                    {formData.exploreMore
                      .filter((item) => item.title || item.subtitle || item.image)
                      .slice(0, 3)
                      .map((item, index) => (
                        <div
                          key={`preview-explore-${index}`}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "72px 1fr",
                            gap: "12px",
                            alignItems: "center",
                            padding: "10px",
                            borderRadius: "14px",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)"
                          }}
                        >
                          <img
                            src={
                              item.image ||
                              "https://via.placeholder.com/72x72?text=IMG"
                            }
                            alt={item.title || "Explore"}
                            style={{
                              width: "72px",
                              height: "72px",
                              objectFit: "cover",
                              borderRadius: "12px"
                            }}
                          />
                          <div>
                            {item.label && (
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "#c084fc",
                                  fontWeight: "bold",
                                  textTransform: "uppercase",
                                  marginBottom: "4px"
                                }}
                              >
                                {item.label}
                              </div>
                            )}
                            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                              {item.title}
                            </div>
                            <div
                              style={{
                                color: "rgba(255,255,255,0.65)",
                                fontSize: "13px"
                              }}
                            >
                              {item.subtitle}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {formData.isTrending && (
                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: "999px",
                      background: "rgba(244,114,182,0.2)"
                    }}
                  >
                    Trending
                  </span>
                )}
                {formData.isFeatured && (
                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: "999px",
                      background: "rgba(96,165,250,0.2)"
                    }}
                  >
                    Featured
                  </span>
                )}
                {formData.isUpcoming && (
                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: "999px",
                      background: "rgba(52,211,153,0.2)"
                    }}
                  >
                    Upcoming
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}