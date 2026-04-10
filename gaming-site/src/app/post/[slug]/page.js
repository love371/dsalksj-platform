"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { apiUrl } from "@/lib/api";

export default function PostDetailsPage() {
  const params = useParams();
  const slug = params?.slug;

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [explorePosts, setExplorePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const fetchPostAndRelated = async () => {
      try {
        setLoading(true);
        setNotFound(false);

        const postResponse = await fetch(
          apiUrl(`/api/posts/slug/${slug}`)
        );

        const postData = await postResponse.json();

        if (!postResponse.ok) {
          setNotFound(true);
          setPost(null);
          return;
        }

        setPost(postData);

        const relatedResponse = await fetch(
          apiUrl(`/api/posts/slug/${slug}/related`)
        );

        const relatedData = await relatedResponse.json();

        if (relatedResponse.ok) {
          setRelatedPosts(
            Array.isArray(relatedData.related) ? relatedData.related : []
          );
          setExplorePosts(
            Array.isArray(relatedData.explore) ? relatedData.explore : []
          );
        } else {
          setRelatedPosts([]);
          setExplorePosts([]);
        }
      } catch (error) {
        console.error("Error fetching single post:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPostAndRelated();
    }
  }, [slug]);

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
        console.error("Error searching posts:", error);
        setSearchResults([]);
      }
    };

    const timer = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(true);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    if (searchResults.length > 0 && searchResults[0].slug) {
      window.location.href = `/post/${searchResults[0].slug}`;
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
  };

  const badgeStyle = {
    display: "inline-block",
    padding: isMobile ? "6px 10px" : "7px 12px",
    borderRadius: "999px",
    fontSize: isMobile ? "10px" : "11px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px"
  };

  const renderAutoCards = (items, title) => {
    if (!Array.isArray(items) || items.length === 0) return null;

    return (
      <section
        style={{
          padding: isMobile ? "14px" : "18px",
          borderRadius: isMobile ? "14px" : "18px",
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow:
            "0 14px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
          backdropFilter: "blur(14px)"
        }}
      >
        <h3
          style={{
            fontSize: isMobile ? "18px" : "22px",
            marginTop: 0,
            marginBottom: isMobile ? "10px" : "14px"
          }}
        >
          {title}
        </h3>

        <div style={{ display: "grid", gap: isMobile ? "8px" : "10px" }}>
          {items.map((item) => (
            <div
              key={item._id}
              onClick={() => {
                if (item.slug) {
                  window.location.href = `/post/${item.slug}`;
                }
              }}
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "64px 1fr" : "72px 1fr",
                gap: isMobile ? "8px" : "10px",
                alignItems: "center",
                padding: isMobile ? "8px" : "10px",
                borderRadius: isMobile ? "12px" : "14px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 14px 26px rgba(0,0,0,0.28), 0 0 18px rgba(124,58,237,0.22)";
                  e.currentTarget.style.border =
                    "1px solid rgba(124,58,237,0.30)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = "translateY(0px)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.border =
                    "1px solid rgba(255,255,255,0.08)";
                }
              }}
            >
              <img
                src={
                  item.image ||
                  item.bannerImage ||
                  "https://via.placeholder.com/72x72?text=IMG"
                }
                alt={item.title}
                style={{
                  width: isMobile ? "64px" : "72px",
                  height: isMobile ? "64px" : "72px",
                  objectFit: "cover",
                  borderRadius: isMobile ? "10px" : "12px"
                }}
              />

              <div>
                <div
                  style={{
                    fontSize: isMobile ? "9px" : "10px",
                    color: "#c084fc",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    marginBottom: "4px"
                  }}
                >
                  {item.category || item.type}
                </div>

                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: isMobile ? "13px" : "14px",
                    marginBottom: "4px",
                    lineHeight: "1.4"
                  }}
                >
                  {item.title}
                </div>

                <div
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: isMobile ? "11px" : "12px",
                    lineHeight: "1.5"
                  }}
                >
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  if (loading) {
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

        <div
          style={{
            minHeight: "calc(100vh - 180px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isMobile ? "18px" : "24px",
            fontWeight: "bold",
            padding: isMobile ? "24px" : "40px"
          }}
        >
          Loading post...
        </div>

        <SiteFooter />
      </main>
    );
  }

  if (notFound || !post) {
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

        <div
          style={{
            padding: isMobile ? "32px 16px" : "60px 24px"
          }}
        >
          <div
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              textAlign: "center",
              padding: isMobile ? "28px 18px" : "50px 30px",
              borderRadius: isMobile ? "18px" : "24px",
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow:
                "0 14px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
              backdropFilter: "blur(14px)"
            }}
          >
            <h1
              style={{
                fontSize: isMobile ? "28px" : "42px",
                marginBottom: "14px"
              }}
            >
              Post not found
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: isMobile ? "15px" : "18px",
                lineHeight: "1.8",
                marginBottom: "24px"
              }}
            >
              The post you are looking for does not exist or may have been removed.
            </p>

            <button
              onClick={() => (window.location.href = "/")}
              style={{
                padding: isMobile ? "12px 18px" : "14px 24px",
                border: "none",
                borderRadius: "999px",
                cursor: "pointer",
                fontWeight: "bold",
                color: "white",
                background: "linear-gradient(90deg, #7c3aed, #ec4899)",
                boxShadow: "0 0 20px rgba(124,58,237,0.45)"
              }}
            >
              Back to Home
            </button>
          </div>
        </div>

        <SiteFooter />
      </main>
    );
  }

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

      {/* Background glow */}
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

      <div
        style={{
          maxWidth: isMobile ? "100%" : isTablet ? "860px" : "960px",
          margin: "0 auto",
          padding: isMobile
            ? "20px 14px 50px"
            : isTablet
            ? "30px 18px 60px"
            : "40px 20px 70px",
          position: "relative",
          zIndex: 2
        }}
      >
        {/* TOP BANNER ONLY FOR bannerImage */}
        {post.bannerImage && (
          <div
            style={{
              width: "100%",
              height: isMobile ? "210px" : isTablet ? "270px" : "340px",
              marginBottom: isMobile ? "16px" : "24px",
              borderRadius: isMobile ? "16px" : "22px",
              overflow: "hidden",
              background: "#0f0f18",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 18px 40px rgba(0,0,0,0.4)"
            }}
          >
            <img
              src={post.bannerImage}
              alt={post.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: post.bannerFit || "cover",
                objectPosition: post.bannerPosition || "center",
                borderRadius: isMobile ? "16px" : "22px"
              }}
            />
          </div>
        )}

        {/* Main content box */}
        <section
          style={{
            padding: isMobile ? "18px" : isTablet ? "22px" : "26px",
            borderRadius: isMobile ? "16px" : "22px",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow:
              "0 14px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
            backdropFilter: "blur(14px)",
            marginBottom: isMobile ? "16px" : "22px"
          }}
        >
          {/* Badges */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: isMobile ? "6px" : "8px",
              marginBottom: isMobile ? "12px" : "16px"
            }}
          >
            <span
              style={{
                ...badgeStyle,
                background: "rgba(255,255,255,0.08)",
                color: "white"
              }}
            >
              {post.type}
            </span>

            {post.category && (
              <span
                style={{
                  ...badgeStyle,
                  background: "rgba(124,58,237,0.16)",
                  color: "#d8b4fe"
                }}
              >
                {post.category}
              </span>
            )}

            {post.isTrending && (
              <span
                style={{
                  ...badgeStyle,
                  background: "rgba(236,72,153,0.16)",
                  color: "#f9a8d4"
                }}
              >
                Trending
              </span>
            )}

            {post.isFeatured && (
              <span
                style={{
                  ...badgeStyle,
                  background: "rgba(59,130,246,0.16)",
                  color: "#93c5fd"
                }}
              >
                Featured
              </span>
            )}

            {post.isUpcoming && (
              <span
                style={{
                  ...badgeStyle,
                  background: "rgba(16,185,129,0.16)",
                  color: "#86efac"
                }}
              >
                Upcoming
              </span>
            )}
          </div>

          <h1
            style={{
              fontSize: isMobile ? "28px" : isTablet ? "36px" : "44px",
              lineHeight: "1.08",
              margin: isMobile ? "0 0 12px 0" : "0 0 16px 0",
              fontWeight: "900"
            }}
          >
            {post.title}
          </h1>

          <p
            style={{
              fontSize: isMobile ? "14px" : "16px",
              lineHeight: "1.8",
              color: "rgba(255,255,255,0.76)",
              marginBottom: isMobile ? "16px" : "22px"
            }}
          >
            {post.description}
          </p>

          {/* NORMAL POST IMAGE ONLY BELOW TITLE */}
          {!post.bannerImage && post.image && (
            <div
              style={{
                width: "100%",
                maxHeight: isMobile ? "220px" : isTablet ? "270px" : "320px",
                marginBottom: isMobile ? "16px" : "22px",
                borderRadius: isMobile ? "14px" : "18px",
                overflow: "hidden",
                background: "#0f0f18",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.08)"
              }}
            >
              <img
                src={post.image}
                alt={post.title}
                style={{
                  width: "100%",
                  maxHeight: isMobile ? "220px" : isTablet ? "270px" : "320px",
                  objectFit: post.imageFit || "cover",
                  objectPosition: post.imagePosition || "center",
                  borderRadius: isMobile ? "14px" : "18px"
                }}
              />
            </div>
          )}

          {/* Rich content */}
          <div
            style={{
              color: "rgba(255,255,255,0.86)",
              lineHeight: isMobile ? "1.75" : "1.85",
              fontSize: isMobile ? "14px" : "15px"
            }}
            dangerouslySetInnerHTML={{
              __html: post.content || "<p>No full content available yet.</p>"
            }}
          />

          {/* Tags */}
          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <div style={{ marginTop: isMobile ? "20px" : "28px" }}>
              <h3
                style={{
                  fontSize: isMobile ? "18px" : "22px",
                  marginBottom: isMobile ? "10px" : "12px"
                }}
              >
                Tags
              </h3>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px"
                }}
              >
                {post.tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    style={{
                      padding: isMobile ? "6px 10px" : "7px 12px",
                      borderRadius: "999px",
                      background: "rgba(255,255,255,0.08)",
                      color: "white",
                      fontSize: isMobile ? "12px" : "13px",
                      fontWeight: "bold"
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {(post.externalLink || post.downloadLink) && (
            <div style={{ marginTop: isMobile ? "20px" : "28px" }}>
              <h3
                style={{
                  fontSize: isMobile ? "18px" : "22px",
                  marginBottom: isMobile ? "10px" : "12px"
                }}
              >
                Useful Links
              </h3>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: isMobile ? "10px" : "12px"
                }}
              >
                {post.externalLink && (
                  <a
                    href={post.externalLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: isMobile ? "10px 14px" : "12px 18px",
                      borderRadius: "999px",
                      textDecoration: "none",
                      color: "white",
                      fontWeight: "bold",
                      background: "linear-gradient(90deg, #7c3aed, #ec4899)",
                      boxShadow: "0 0 20px rgba(124,58,237,0.35)"
                    }}
                  >
                    Open External Link
                  </a>
                )}

                {post.downloadLink && (
                  <a
                    href={post.downloadLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: isMobile ? "10px 14px" : "12px 18px",
                      borderRadius: "999px",
                      textDecoration: "none",
                      color: "white",
                      fontWeight: "bold",
                      background: "linear-gradient(90deg, #10b981, #06b6d4)",
                      boxShadow: "0 0 20px rgba(16,185,129,0.35)"
                    }}
                  >
                    Download Now
                  </a>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Auto related + explore */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : isTablet
              ? "repeat(2, minmax(0, 1fr))"
              : "repeat(auto-fit, minmax(240px, 1fr))",
            gap: isMobile ? "14px" : "18px"
          }}
        >
          {renderAutoCards(relatedPosts, "Related Posts / Games")}
          {renderAutoCards(explorePosts, "Explore More")}
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}