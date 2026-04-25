"use client";

import { useEffect, useMemo, useState } from "react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import PostCardGrid from "@/components/shared/PostCardGrid";
import { apiUrl } from "@/lib/api";
import { optimizeImage } from "@/lib/image";

const animatedTexts = [
  "Latest Game News",
  "Popular Game Updates",
  "Discover New Releases",
  "Download Your Favorites"
];

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [activeTextIndex, setActiveTextIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [screenWidth, setScreenWidth] = useState(1400);

  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);
    updateWidth();

    let frameId = null;

    const resizeHandler = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updateWidth);
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  const isMobile = screenWidth <= 768;
  const isTablet = screenWidth > 768 && screenWidth <= 1024;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTextIndex((prev) => (prev + 1) % animatedTexts.length);
    }, isMobile ? 3500 : 2200);

    return () => clearInterval(interval);
  }, [isMobile]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (!authChecked || user) return;

    const popupTimer = setTimeout(() => {
      setShowPopup(true);
    }, 12000);

    return () => clearTimeout(popupTimer);
  }, [authChecked, user]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPosts = async () => {
      try {
        setPostsLoading(true);

        const response = await fetch(apiUrl("/api/posts/homepage"), {
          cache: "no-store",
          signal: controller.signal
        });

        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error.name !== "AbortError") {
          setPosts([]);
        }
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPosts();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(
          apiUrl(`/api/posts/search?q=${encodeURIComponent(searchQuery)}`),
          { signal: controller.signal }
        );

        const data = await response.json();
        setSearchResults(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error.name !== "AbortError") {
          setSearchResults([]);
        }
      }
    };

    const timer = setTimeout(fetchSearchResults, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  const heroFeaturedPost = useMemo(() => {
    if (!posts.length) return null;
    return posts.find((post) => post.isFeatured) || posts[0];
  }, [posts]);

  const latestPosts = useMemo(() => posts.slice(0, 6), [posts]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const scrollToResult = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setShowSearchResults(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(true);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    if (searchResults.length > 0) {
      if (searchResults[0].slug) {
        window.location.href = `/post/${searchResults[0].slug}`;
      }
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const url = isLogin
        ? apiUrl("/api/auth/login")
        : apiUrl("/api/auth/signup");

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setShowPopup(false);
        setShowDropdown(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        position: "relative",
        background:
          "radial-gradient(circle at top, #18182f 0%, #09090f 40%, #040406 100%)",
        color: "white"
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "-180px",
          left: "-140px",
          width: isMobile ? "280px" : "420px",
          height: isMobile ? "280px" : "420px",
          borderRadius: "50%",
          background: "rgba(124,58,237,0.18)",
          filter: isMobile ? "blur(70px)" : "blur(95px)",
          pointerEvents: "none"
        }}
      />

      <SiteHeader
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        handleSearchKeyDown={handleSearchKeyDown}
        handleSearch={handleSearch}
        showSearchResults={showSearchResults}
        searchResults={searchResults}
        scrollToResult={scrollToResult}
        user={user}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        handleLogout={handleLogout}
        setShowPopup={setShowPopup}
        brandClick={() => (window.location.href = "/")}
      />

      {/* HERO IMAGE OPTIMIZED */}
      {heroFeaturedPost && (
        <img
          src={
            optimizeImage(
              heroFeaturedPost.bannerImage ||
                heroFeaturedPost.image,
              isMobile ? 700 : 1200
            ) ||
            "https://via.placeholder.com/800x450?text=Featured"
          }
          alt={heroFeaturedPost.title}
          loading="eager"
          fetchPriority="high"
          style={{ width: "100%" }}
        />
      )}

      <PostCardGrid posts={latestPosts} />

      <SiteFooter />
    </main>
  );
}