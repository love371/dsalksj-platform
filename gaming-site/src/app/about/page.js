"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

const animatedTexts = [
  "Built for Gamers",
  "Designed for Growth",
  "Modern Gaming Platform"
];

export default function AboutPage() {
  const [activeTextIndex, setActiveTextIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // responsive only
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

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:5000/api/posts/search?q=${encodeURIComponent(searchQuery)}`
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
            ? "28px 16px 50px 16px"
            : isTablet
            ? "40px 24px 60px 24px"
            : "70px",
          position: "relative",
          zIndex: 2
        }}
      >
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
          about dsalksj
        </p>

        <h1
          style={{
            fontSize: isMobile ? "38px" : isTablet ? "50px" : "64px",
            margin: "0 0 16px 0",
            lineHeight: isMobile ? "1.12" : "1.05"
          }}
        >
          About Us
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

        <div
          style={{
            maxWidth: "1100px",
            borderRadius: isMobile ? "20px" : "28px",
            padding: isMobile ? "20px" : isTablet ? "26px" : "34px",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow:
              "0 14px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
            backdropFilter: "blur(14px)"
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.75)",
              lineHeight: isMobile ? "1.85" : "1.95",
              fontSize: isMobile ? "15px" : isTablet ? "16px" : "18px",
              margin: 0
            }}
          >
            dsalksj is a modern gaming platform focused on premium UI,
            discoverability, rich post pages, admin-controlled content, and a
            scalable structure for future upgrades. It is being built to feel
            like a real gaming destination where users can explore news,
            releases, downloads, and community-driven content in one place.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}