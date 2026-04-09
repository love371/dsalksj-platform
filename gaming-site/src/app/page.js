"use client";

import { useEffect, useMemo, useState } from "react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import PostCardGrid from "@/components/shared/PostCardGrid";

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
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  // ✅ responsive only
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
    const interval = setInterval(() => {
      setActiveTextIndex((prev) => (prev + 1) % animatedTexts.length);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

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
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/posts");
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      }
    };

    fetchPosts();
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
        console.error("Error searching posts:", error);
        setSearchResults([]);
      }
    };

    const timer = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(timer);
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
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setShowSearchResults(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(true);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert("Please enter something to search.");
      return;
    }

    if (searchResults.length > 0) {
      if (searchResults[0].slug) {
        window.location.href = `/post/${searchResults[0].slug}`;
      } else {
        scrollToResult(`post-${searchResults[0]._id}`);
      }
    } else {
      alert("No results found.");
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/signup";

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
        setFormData({ username: "", email: "", password: "" });
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    setShowPopup(false);
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
          filter: "blur(120px)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      <div
        style={{
          position: "fixed",
          top: isMobile ? "160px" : "220px",
          right: "-120px",
          width: isMobile ? "260px" : "380px",
          height: isMobile ? "260px" : "380px",
          borderRadius: "50%",
          background: "rgba(236,72,153,0.16)",
          filter: "blur(120px)",
          pointerEvents: "none",
          zIndex: 0
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

      <section
        style={{
          width: "100%",
          minHeight: isMobile ? "auto" : "calc(100vh - 88px)",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "1.05fr 0.95fr",
          alignItems: "center",
          gap: isMobile ? "24px" : isTablet ? "28px" : "34px",
          padding: isMobile ? "28px 16px" : isTablet ? "40px 24px" : "70px",
          position: "relative",
          zIndex: 2
        }}
      >
        <div style={{ maxWidth: isMobile ? "100%" : "760px" }}>
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
            modern gaming portal
          </p>

          <h1
            style={{
              fontSize: isMobile ? "40px" : isTablet ? "54px" : "72px",
              lineHeight: isMobile ? "1.12" : "1.05",
              margin: isMobile ? "0 0 14px 0" : "0 0 18px 0",
              fontWeight: "900"
            }}
          >
            Explore the
            <br />
            world of
            <br />
            gaming.
          </h1>

          <div
            style={{
              minHeight: isMobile ? "36px" : "52px",
              fontSize: isMobile ? "20px" : isTablet ? "24px" : "30px",
              fontWeight: "bold",
              color: "#f472b6",
              marginBottom: isMobile ? "16px" : "22px"
            }}
          >
            {animatedTexts[activeTextIndex]}
          </div>

          <p
            style={{
              fontSize: isMobile ? "15px" : isTablet ? "17px" : "19px",
              lineHeight: "1.8",
              color: "rgba(255,255,255,0.74)",
              maxWidth: isMobile ? "100%" : "650px",
              marginBottom: isMobile ? "22px" : "32px"
            }}
          >
            dsalksj is your premium destination for the latest game news,
            trending titles, popular releases, gaming updates, and discovering
            or downloading your favorite games with a futuristic experience.
          </p>
        </div>

        <div
          style={{
            width: "100%",
            minHeight: isMobile ? "auto" : isTablet ? "460px" : "530px",
            borderRadius: isMobile ? "22px" : "30px",
            padding: isMobile ? "16px" : "22px",
            background:
              "linear-gradient(180deg, rgba(124,58,237,0.18), rgba(236,72,153,0.10))",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 0 40px rgba(124,58,237,0.24)",
            backdropFilter: "blur(16px)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {heroFeaturedPost ? (
            <div
              onClick={() => {
                if (heroFeaturedPost.slug) {
                  window.location.href = `/post/${heroFeaturedPost.slug}`;
                }
              }}
              style={{ width: "100%", height: "100%", cursor: "pointer" }}
            >
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
                FEATURED SPOTLIGHT
              </div>

              <div
                style={{
                  width: "100%",
                  height: isMobile ? "190px" : isTablet ? "220px" : "260px",
                  borderRadius: isMobile ? "16px" : "22px",
                  overflow: "hidden",
                  marginBottom: isMobile ? "14px" : "20px",
                  background: "#0f0f18"
                }}
              >
                <img
                  src={
                    heroFeaturedPost.bannerImage ||
                    heroFeaturedPost.image ||
                    "https://via.placeholder.com/800x400?text=Featured+Post"
                  }
                  alt={heroFeaturedPost.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit:
                      heroFeaturedPost.bannerFit ||
                      heroFeaturedPost.imageFit ||
                      "cover",
                    objectPosition:
                      heroFeaturedPost.bannerPosition ||
                      heroFeaturedPost.imagePosition ||
                      "center"
                  }}
                />
              </div>

              <h3
                style={{
                  fontSize: isMobile ? "24px" : isTablet ? "28px" : "34px",
                  margin: isMobile ? "0 0 8px 0" : "0 0 12px 0"
                }}
              >
                {heroFeaturedPost.title}
              </h3>

              <p
                style={{
                  color: "rgba(255,255,255,0.75)",
                  lineHeight: "1.8",
                  fontSize: isMobile ? "14px" : "16px"
                }}
              >
                {heroFeaturedPost.description}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <PostCardGrid
        posts={latestPosts}
        eyebrow="fresh content"
        title="Latest Posts"
        subtitle="The same rich homepage content stays here."
      />

      <section
        style={{
          width: "100%",
          padding: isMobile
            ? "10px 16px 40px 16px"
            : isTablet
            ? "10px 24px 50px 24px"
            : "10px 70px 60px 70px",
          position: "relative",
          zIndex: 2
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? "28px" : isTablet ? "34px" : "42px",
            marginBottom: isMobile ? "18px" : "26px"
          }}
        >
          Featured Sections
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : isTablet
              ? "repeat(2, minmax(0, 1fr))"
              : "repeat(auto-fit, minmax(250px, 1fr))",
            gap: isMobile ? "16px" : "22px"
          }}
        >
          {[
            {
              icon: "🔥",
              title: "Popular Games",
              text: "Discover the hottest games people are playing right now.",
              glow: "rgba(236,72,153,0.30)"
            },
            {
              icon: "📰",
              title: "Latest News",
              text: "Stay updated with gaming headlines, updates, and launches.",
              glow: "rgba(59,130,246,0.30)"
            },
            {
              icon: "⬇️",
              title: "Download Games",
              text: "Find downloadable gaming content faster.",
              glow: "rgba(16,185,129,0.30)"
            },
            {
              icon: "ℹ️",
              title: "About Us",
              text: "Learn what dsalksj is building for gamers.",
              glow: "rgba(245,158,11,0.30)"
            }
          ].map((item, index) => (
            <div
              key={item.title}
              style={{
                position: "relative",
                padding: isMobile ? "20px" : "28px",
                borderRadius: isMobile ? "18px" : "24px",
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow:
                  "0 14px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
                backdropFilter: "blur(14px)",
                overflow: "hidden",
                cursor: "pointer",
                transition:
                  "transform 0.35s ease, box-shadow 0.35s ease, border 0.35s ease"
              }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform =
                    index % 2 === 0
                      ? "perspective(1000px) rotateX(6deg) rotateY(-8deg) translateY(-12px)"
                      : "perspective(1000px) rotateX(6deg) rotateY(8deg) translateY(-12px)";

                  e.currentTarget.style.boxShadow = `0 30px 50px rgba(0,0,0,0.5), 0 0 40px ${item.glow}`;
                  e.currentTarget.style.border = "1px solid rgba(255,255,255,0.25)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform =
                    "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";

                  e.currentTarget.style.boxShadow =
                    "0 14px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)";
                  e.currentTarget.style.border = "1px solid rgba(255,255,255,0.10)";
                }
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-25px",
                  right: "-25px",
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: item.glow,
                  filter: "blur(25px)"
                }}
              />

              <div style={{ fontSize: isMobile ? "28px" : "34px", marginBottom: "14px" }}>
                {item.icon}
              </div>

              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "12px",
                  fontSize: isMobile ? "21px" : "25px"
                }}
              >
                {item.title}
              </h3>

              <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: "1.75" }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          width: "100%",
          padding: isMobile
            ? "10px 16px 60px 16px"
            : isTablet
            ? "10px 24px 70px 24px"
            : "10px 70px 90px 70px",
          position: "relative",
          zIndex: 2
        }}
      >
        <div
          style={{
            borderRadius: isMobile ? "20px" : "28px",
            padding: isMobile ? "20px" : isTablet ? "24px" : "34px",
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
              margin: "0 0 8px 0",
              color: "#c084fc",
              fontWeight: "bold",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontSize: "13px"
            }}
          >
            about platform
          </p>

          <h2
            style={{
              fontSize: isMobile ? "28px" : isTablet ? "34px" : "42px",
              margin: "0 0 18px 0"
            }}
          >
            About dsalksj
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,0.75)",
              lineHeight: "1.9",
              fontSize: isMobile ? "14px" : "17px",
              maxWidth: "1000px"
            }}
          >
            dsalksj is a modern gaming content platform built to showcase game
            news, popular releases, updates, and rich single-post experiences in
            one stylish place.
          </p>
        </div>
      </section>

      <SiteFooter />

      {showPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.74)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: isMobile ? "100%" : "430px",
              borderRadius: isMobile ? "18px" : "24px",
              background: "linear-gradient(180deg, #161621, #0f0f18)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 0 40px rgba(124,58,237,0.35)",
              padding: isMobile ? "20px" : "28px",
              position: "relative"
            }}
          >
            <button
              onClick={() => setShowPopup(false)}
              style={{
                position: "absolute",
                right: "16px",
                top: "16px",
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "22px",
                cursor: "pointer"
              }}
            >
              ✕
            </button>

            <h2
              style={{
                marginTop: "8px",
                marginBottom: "8px",
                fontSize: isMobile ? "24px" : "32px"
              }}
            >
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,0.68)",
                marginBottom: "22px",
                lineHeight: "1.6"
              }}
            >
              {isLogin
                ? "Login to continue exploring the gaming world."
                : "Sign up to unlock personalized gaming experiences."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {!isLogin && (
                <input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.05)",
                    color: "white",
                    outline: "none",
                    fontSize: "15px"
                  }}
                />
              )}

              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  padding: "14px 16px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  outline: "none",
                  fontSize: "15px"
                }}
              />

              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  padding: "14px 16px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  outline: "none",
                  fontSize: "15px"
                }}
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  marginTop: "6px",
                  padding: "15px 18px",
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
                {loading ? "Please wait..." : isLogin ? "Login" : "Signup"}
              </button>
            </div>

            <p
              onClick={() => setIsLogin(!isLogin)}
              style={{
                marginTop: "20px",
                textAlign: "center",
                color: "#c084fc",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {isLogin
                ? "Don't have an account? Switch to Signup"
                : "Already have an account? Switch to Login"}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}