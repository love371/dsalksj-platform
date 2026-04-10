"use client";

import { useEffect, useMemo, useState } from "react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import PostCardGrid from "@/components/shared/PostCardGrid";
import { apiUrl } from "@/lib/api"; // ✅ ADDED

const animatedTexts = [
  "Fresh Gaming Headlines",
  "Patch Notes and Launches",
  "Breaking Game News"
];

export default function NewsPage() {
  const [activeTextIndex, setActiveTextIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [screenWidth, setScreenWidth] = useState(1400);

  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const isMobile = screenWidth <= 768;
  const isTablet = screenWidth > 768 && screenWidth <= 1024;

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTextIndex((prev) => (prev + 1) % animatedTexts.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // ✅ FIXED: Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(apiUrl("/api/posts"));
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setPosts([]);
      }
    };
    fetchPosts();
  }, []);

  // ✅ FIXED: Search API
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const response = await fetch(
          apiUrl(`/api/posts/search?q=${encodeURIComponent(searchQuery)}`)
        );
        const data = await response.json();
        setSearchResults(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setSearchResults([]);
      }
    };

    const timer = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const newsPosts = useMemo(
    () => posts.filter((post) => post.type === "news"),
    [posts]
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(true);
  };

  const handleSearch = () => {
    if (searchResults.length > 0 && searchResults[0].slug) {
      window.location.href = `/post/${searchResults[0].slug}`;
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #18182f 0%, #09090f 40%, #040406 100%)",
        color: "white"
      }}
    >
      <SiteHeader
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        handleSearchKeyDown={handleSearchKeyDown}
        handleSearch={handleSearch}
        showSearchResults={showSearchResults}
        searchResults={searchResults}
        user={user}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        handleLogout={handleLogout}
        brandClick={() => (window.location.href = "/")}
      />

      <section
        style={{
          padding: isMobile
            ? "28px 16px 40px 16px"
            : isTablet
            ? "40px 24px 50px 24px"
            : "70px",
          position: "relative",
          zIndex: 2
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p
            style={{
              color: "#c084fc",
              fontWeight: "bold",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: isMobile ? "12px" : "16px",
              fontSize: isMobile ? "11px" : "inherit"
            }}
          >
            news hub
          </p>

          <h1
            style={{
              fontSize: isMobile ? "38px" : isTablet ? "50px" : "64px",
              margin: "0 0 16px 0",
              lineHeight: isMobile ? "1.12" : "1.05"
            }}
          >
            Gaming News
          </h1>

          <div
            style={{
              minHeight: isMobile ? "36px" : "52px",
              fontSize: isMobile ? "20px" : isTablet ? "24px" : "28px",
              fontWeight: "bold",
              color: "#f472b6",
              marginBottom: isMobile ? "14px" : "18px"
            }}
          >
            {animatedTexts[activeTextIndex]}
          </div>

          <p
            style={{
              maxWidth: "900px",
              color: "rgba(255,255,255,0.74)",
              lineHeight: "1.8",
              fontSize: isMobile ? "15px" : isTablet ? "16px" : "18px",
              margin: 0
            }}
          >
            Stay on top of launches, updates, patch notes, and all the latest
            gaming stories in a dedicated news page.
          </p>
        </div>
      </section>

      <PostCardGrid
        posts={newsPosts}
        eyebrow="latest updates"
        title="News Feed"
        subtitle="All your news posts in one dedicated place."
      />

      <SiteFooter />
    </main>
  );
}