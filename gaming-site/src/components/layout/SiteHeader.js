"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function SiteHeader({
  searchQuery = "",
  handleSearchChange = () => {},
  handleSearchKeyDown = () => {},
  handleSearch = () => {},
  showSearchResults = false,
  searchResults = [],
  scrollToResult,
  user,
  showDropdown = false,
  setShowDropdown = () => {},
  handleLogout = () => {},
  setShowPopup,
  brandClick
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [screenWidth, setScreenWidth] = useState(1400);

  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const isMobile = screenWidth <= 768;
  const isTablet = screenWidth > 768 && screenWidth <= 1024;

  const getNavItemStyle = (isActive) => ({
    color: isActive ? "white" : "rgba(255,255,255,0.84)",
    cursor: "pointer",
    padding: isMobile ? "8px 12px" : "10px 16px",
    borderRadius: "999px",
    fontWeight: isActive ? "bold" : "500",
    background: isActive
      ? "linear-gradient(90deg, rgba(124,58,237,0.28), rgba(236,72,153,0.20))"
      : "transparent",
    border: isActive
      ? "1px solid rgba(255,255,255,0.16)"
      : "1px solid transparent",
    boxShadow: isActive ? "0 0 18px rgba(124,58,237,0.24)" : "none",
    transition: "all 0.3s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: isMobile ? "13px" : "14px",
    whiteSpace: "nowrap"
  });

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Popular", path: "/popular" },
    { label: "News", path: "/news" },
    { label: "Downloads", path: "/downloads" },
    { label: "About", path: "/about" }
  ];

  const isActivePath = (path) => {
    if (path === "/") return pathname === "/";
    return pathname === path;
  };

  const handleResultOpen = (item) => {
    if (!item) return;

    if (item.slug) {
      router.push(`/post/${item.slug}`);
      return;
    }

    if (scrollToResult && item._id) {
      scrollToResult(`post-${item._id}`);
    }
  };

  return (
    <nav
      style={{
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 50,
        padding: isMobile ? "14px 16px" : isTablet ? "16px 24px" : "18px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: isMobile ? "14px" : "20px",
        background: "rgba(7,7,10,0.82)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        flexWrap: "wrap"
      }}
    >
      <div
        onClick={brandClick}
        style={{
          fontSize: isMobile ? "24px" : isTablet ? "27px" : "30px",
          fontWeight: "bold",
          letterSpacing: "1px",
          whiteSpace: "nowrap",
          cursor: "pointer",
          flexShrink: 0
        }}
      >
        🎮 dsalksj
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flex: isMobile ? "1 1 100%" : "1 1 320px",
          maxWidth: isMobile ? "100%" : "420px",
          minWidth: isMobile ? "100%" : "260px",
          order: isMobile ? 3 : 2,
          zIndex: 200
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "999px",
            padding: isMobile ? "9px 12px" : "10px 14px",
            backdropFilter: "blur(10px)"
          }}
        >
          <span
            onClick={handleSearch}
            style={{
              marginRight: "10px",
              cursor: "pointer",
              fontSize: isMobile ? "14px" : "16px",
              color: "rgba(255,255,255,0.75)"
            }}
          >
            🔍
          </span>

          <input
            type="text"
            placeholder="Search games, news, updates..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (searchResults.length > 0) {
                  handleResultOpen(searchResults[0]);
                } else {
                  handleSearchKeyDown(e);
                }
              } else {
                handleSearchKeyDown(e);
              }
            }}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: isMobile ? "13px" : "14px"
            }}
          />
        </div>

        {showSearchResults && searchQuery.trim() && (
          <div
            style={{
              position: "absolute",
              top: isMobile ? "50px" : "56px",
              left: 0,
              width: "100%",
              background: "rgba(18,18,28,0.98)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
              backdropFilter: "blur(14px)",
              zIndex: 9999,
              pointerEvents: "auto"
            }}
          >
            {searchResults.length > 0 ? (
              searchResults.map((item, index) => (
                <div
                  key={item._id || item.slug || index}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleResultOpen(item);
                  }}
                  style={{
                    padding: isMobile ? "12px 14px" : "14px 16px",
                    borderBottom:
                      index !== searchResults.length - 1
                        ? "1px solid rgba(255,255,255,0.06)"
                        : "none",
                    cursor: "pointer",
                    userSelect: "none"
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      marginBottom: "4px",
                      color: "white",
                      fontSize: isMobile ? "13px" : "14px"
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.6)",
                      textTransform: "uppercase",
                      letterSpacing: "1px"
                    }}
                  >
                    {item.type}
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: isMobile ? "12px 14px" : "14px 16px",
                  color: "rgba(255,255,255,0.65)"
                }}
              >
                No results found
              </div>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: isMobile ? "8px" : "12px",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: isMobile ? "flex-start" : "center",
          width: isMobile ? "100%" : "auto",
          order: isMobile ? 2 : 3
        }}
      >
        {navItems.map((item) => {
          const isActive = isActivePath(item.path);

          return (
            <span
              key={item.path}
              onClick={() => router.push(item.path)}
              style={getNavItemStyle(isActive)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.border =
                    "1px solid rgba(255,255,255,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.border = "1px solid transparent";
                }
              }}
            >
              {item.label}
            </span>
          );
        })}

        {user ? (
          <div
            style={{
              position: "relative",
              display: "flex",
              gap: isMobile ? "8px" : "12px",
              alignItems: "center",
              marginLeft: isMobile ? "0" : "4px"
            }}
          >
            {user.role === "admin" && (
              <button
                onClick={() => router.push("/admin")}
                style={{
                  padding: isMobile ? "9px 12px" : "10px 16px",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: isMobile ? "12px" : "14px",
                  background: "linear-gradient(90deg, #f59e0b, #ef4444)",
                  color: "white",
                  boxShadow: "0 0 16px rgba(245,158,11,0.4)"
                }}
              >
                Admin Panel
              </button>
            )}

            <div
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                width: isMobile ? "38px" : "42px",
                height: isMobile ? "38px" : "42px",
                borderRadius: "50%",
                background: "linear-gradient(90deg, #7c3aed, #ec4899)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: isMobile ? "14px" : "16px",
                color: "white",
                boxShadow: "0 0 18px rgba(124,58,237,0.35)"
              }}
              title={user.username}
            >
              {user.username?.[0]?.toUpperCase()}
            </div>

            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: isMobile ? "48px" : "55px",
                  right: 0,
                  background: "rgba(18,18,28,0.95)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "10px",
                  minWidth: "140px",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 14px 30px rgba(0,0,0,0.35)",
                  zIndex: 9999
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    marginBottom: "8px",
                    color: "rgba(255,255,255,0.7)"
                  }}
                >
                  {user.username}
                </div>

                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    background: "#ef4444",
                    color: "white",
                    fontWeight: "bold"
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowPopup?.(true)}
            style={{
              padding: isMobile ? "10px 16px" : "12px 22px",
              border: "none",
              borderRadius: "999px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: isMobile ? "13px" : "14px",
              color: "white",
              background: "linear-gradient(90deg, #7c3aed, #ec4899)",
              boxShadow: "0 0 20px rgba(124,58,237,0.45)"
            }}
          >
            Login / Signup
          </button>
        )}
      </div>
    </nav>
  );
}