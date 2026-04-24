"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const games = [
  { label: "Game 1", url: "https://game1.dsalksj.in" },
  { label: "Game 2", url: "https://game2.dsalksj.in" }
];

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);

  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);
    updateWidth();

    const resizeHandler = () => requestAnimationFrame(updateWidth);
    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  const isMobile = screenWidth <= 768;
  const isTablet = screenWidth > 768 && screenWidth <= 1024;

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Popular", path: "/popular" },
    { label: "News", path: "/news" },
    { label: "Games", path: "games" },
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

  const navButtonStyle = (active = false) => ({
    color: active ? "white" : "rgba(255,255,255,0.84)",
    cursor: "pointer",
    padding: isTablet ? "9px 12px" : "10px 16px",
    borderRadius: "999px",
    fontWeight: active ? "bold" : "500",
    background: active
      ? "linear-gradient(90deg, rgba(124,58,237,0.28), rgba(236,72,153,0.20))"
      : "transparent",
    border: active
      ? "1px solid rgba(255,255,255,0.16)"
      : "1px solid transparent",
    boxShadow: active ? "0 0 18px rgba(124,58,237,0.24)" : "none",
    transition: "background 0.25s ease, border 0.25s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: isTablet ? "13px" : "14px",
    whiteSpace: "nowrap"
  });

  const searchBox = (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        flex: isMobile ? "1 1 100%" : "1 1 300px",
        maxWidth: isMobile ? "100%" : "390px",
        minWidth: isMobile ? "100%" : "240px",
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
          padding: isMobile ? "8px 11px" : "10px 14px",
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
          placeholder={isMobile ? "Search..." : "Search games, news, updates..."}
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
            top: isMobile ? "46px" : "56px",
            left: 0,
            width: "100%",
            maxHeight: isMobile ? "260px" : "320px",
            overflowY: "auto",
            background: "rgba(18,18,28,0.98)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            overflowX: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
            backdropFilter: "blur(14px)",
            zIndex: 9999
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
                  padding: isMobile ? "11px 12px" : "14px 16px",
                  borderBottom:
                    index !== searchResults.length - 1
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "none",
                  cursor: "pointer"
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "4px",
                    color: "white",
                    fontSize: isMobile ? "13px" : "14px",
                    lineHeight: "1.35"
                  }}
                >
                  {item.title}
                </div>

                <div
                  style={{
                    fontSize: "11px",
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
  );

  return (
    <nav
      style={{
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 50,
        padding: isMobile ? "10px 12px" : isTablet ? "16px 24px" : "18px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: isMobile ? "10px" : "18px",
        background: "rgba(7,7,10,0.82)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        flexWrap: isMobile ? "wrap" : "nowrap"
      }}
    >
      <div
        onClick={brandClick}
        style={{
          fontSize: isMobile ? "20px" : isTablet ? "27px" : "30px",
          fontWeight: "bold",
          letterSpacing: "1px",
          whiteSpace: "nowrap",
          cursor: "pointer",
          flexShrink: 0,
          order: 1
        }}
      >
        🎮 dsalksj
      </div>

      {!isMobile && searchBox}

      {!isMobile && (
        <div
          style={{
            display: "flex",
            gap: isTablet ? "7px" : "10px",
            alignItems: "center",
            justifyContent: "center",
            order: 3,
            flexShrink: 0
          }}
        >
          {navItems.map((item) => {
            if (item.path === "games") {
              return (
                <div
                  key="games"
                  onMouseEnter={() => setGamesOpen(true)}
                  onMouseLeave={() => setGamesOpen(false)}
                  style={{ position: "relative" }}
                >
                  <span style={navButtonStyle(false)}>Games ▾</span>

                  {gamesOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "44px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        minWidth: "210px",
                        padding: "10px",
                        borderRadius: "18px",
                        background:
                          "linear-gradient(180deg, rgba(25,25,38,0.98), rgba(12,12,18,0.98))",
                        border: "1px solid rgba(255,255,255,0.10)",
                        boxShadow:
                          "0 22px 45px rgba(0,0,0,0.45), 0 0 28px rgba(124,58,237,0.22)",
                        backdropFilter: "blur(16px)",
                        zIndex: 9999
                      }}
                    >
                      {games.map((game) => (
                        <div
                          key={game.url}
                          onClick={() => window.open(game.url, "_blank")}
                          style={{
                            padding: "12px 13px",
                            borderRadius: "13px",
                            cursor: "pointer",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "14px",
                            background: "rgba(255,255,255,0.04)",
                            marginBottom: "7px",
                            border: "1px solid rgba(255,255,255,0.06)"
                          }}
                        >
                          🎮 {game.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            const active = isActivePath(item.path);

            return (
              <span
                key={item.path}
                onClick={() => router.push(item.path)}
                style={navButtonStyle(active)}
              >
                {item.label}
              </span>
            );
          })}

          {user ? (
            <div style={{ position: "relative", display: "flex", gap: "10px", alignItems: "center" }}>
              {user.role === "admin" && (
                <button
                  onClick={() => router.push("/admin")}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "999px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "14px",
                    background: "linear-gradient(90deg, #f59e0b, #ef4444)",
                    color: "white",
                    boxShadow: "0 0 16px rgba(245,158,11,0.4)"
                  }}
                >
                  Admin
                </button>
              )}

              <div
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "linear-gradient(90deg, #7c3aed, #ec4899)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px",
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
                    top: "55px",
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
                  <div style={{ fontSize: "13px", marginBottom: "8px", color: "rgba(255,255,255,0.7)" }}>
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
                padding: "12px 22px",
                border: "none",
                borderRadius: "999px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
                color: "white",
                background: "linear-gradient(90deg, #7c3aed, #ec4899)",
                boxShadow: "0 0 20px rgba(124,58,237,0.45)"
              }}
            >
              Login / Signup
            </button>
          )}
        </div>
      )}

      {isMobile && (
        <button
          onClick={() => setMobileMenuOpen(true)}
          style={{
            order: 2,
            width: "42px",
            height: "42px",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.06)",
            color: "white",
            fontSize: "24px",
            cursor: "pointer"
          }}
        >
          ☰
        </button>
      )}

      {isMobile && searchBox}

      {isMobile && mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.62)",
            zIndex: 9998
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "82%",
              maxWidth: "330px",
              height: "100vh",
              background:
                "linear-gradient(180deg, rgba(18,18,28,0.99), rgba(8,8,12,0.99))",
              borderLeft: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "-20px 0 50px rgba(0,0,0,0.45)",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{
                alignSelf: "flex-end",
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "24px",
                cursor: "pointer"
              }}
            >
              ✕
            </button>

            {navItems.map((item) => {
              if (item.path === "games") {
                return (
                  <div key="mobile-games">
                    <div
                      style={{
                        padding: "13px 14px",
                        borderRadius: "14px",
                        background:
                          "linear-gradient(90deg, rgba(124,58,237,0.20), rgba(236,72,153,0.12))",
                        border: "1px solid rgba(255,255,255,0.10)",
                        fontWeight: "bold",
                        marginBottom: "8px"
                      }}
                    >
                      Games
                    </div>

                    {games.map((game) => (
                      <div
                        key={game.url}
                        onClick={() => {
                          window.open(game.url, "_blank");
                          setMobileMenuOpen(false);
                        }}
                        style={{
                          padding: "11px 14px",
                          marginBottom: "7px",
                          marginLeft: "10px",
                          borderRadius: "12px",
                          background: "rgba(255,255,255,0.05)",
                          color: "rgba(255,255,255,0.88)",
                          fontWeight: "bold",
                          cursor: "pointer"
                        }}
                      >
                        🎮 {game.label}
                      </div>
                    ))}
                  </div>
                );
              }

              return (
                <div
                  key={item.path}
                  onClick={() => {
                    router.push(item.path);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    padding: "13px 14px",
                    borderRadius: "14px",
                    background: isActivePath(item.path)
                      ? "linear-gradient(90deg, rgba(124,58,237,0.28), rgba(236,72,153,0.18))"
                      : "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  {item.label}
                </div>
              );
            })}

            <div style={{ marginTop: "auto" }}>
              {user ? (
                <>
                  {user.role === "admin" && (
                    <button
                      onClick={() => {
                        router.push("/admin");
                        setMobileMenuOpen(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "13px",
                        borderRadius: "14px",
                        border: "none",
                        background: "linear-gradient(90deg, #f59e0b, #ef4444)",
                        color: "white",
                        fontWeight: "bold",
                        marginBottom: "10px"
                      }}
                    >
                      Admin Panel
                    </button>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "13px",
                      borderRadius: "14px",
                      border: "none",
                      background: "#ef4444",
                      color: "white",
                      fontWeight: "bold"
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowPopup?.(true);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "999px",
                    border: "none",
                    background: "linear-gradient(90deg, #7c3aed, #ec4899)",
                    color: "white",
                    fontWeight: "bold",
                    boxShadow: "0 0 20px rgba(124,58,237,0.35)"
                  }}
                >
                  Login / Signup
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}