"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import MobileMenu from "./MobileMenu";

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
  const [showGames, setShowGames] = useState(false);

  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const isMobile = screenWidth <= 768;

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Popular", path: "/popular" },
    { label: "News", path: "/news" },
    { label: "Downloads", path: "/downloads" },
    { label: "About", path: "/about" }
  ];

  const isActivePath = (path) => pathname === path;

  return (
    <nav
      style={{
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 50,
        padding: isMobile ? "12px" : "18px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "rgba(7,7,10,0.82)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)"
      }}
    >
      {/* LOGO */}
      <div
        onClick={brandClick}
        style={{
          fontSize: isMobile ? "22px" : "30px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        🎮 dsalksj
      </div>

      {/* DESKTOP NAV */}
      {!isMobile && (
        <div style={{ display: "flex", gap: "14px" }}>
          {navItems.map((item) => (
            <span
              key={item.path}
              onClick={() => router.push(item.path)}
              style={{
                cursor: "pointer",
                padding: "10px 16px",
                borderRadius: "999px",
                background: isActivePath(item.path)
                  ? "rgba(124,58,237,0.2)"
                  : "transparent"
              }}
            >
              {item.label}
            </span>
          ))}

          {/* Games dropdown */}
          <div
            onMouseEnter={() => setShowGames(true)}
            onMouseLeave={() => setShowGames(false)}
            style={{ position: "relative" }}
          >
            <span style={{ cursor: "pointer" }}>Games ▾</span>

            {showGames && (
              <div
                style={{
                  position: "absolute",
                  top: "40px",
                  background: "#111",
                  padding: "10px",
                  borderRadius: "10px"
                }}
              >
                <div onClick={() => window.open("https://game1.dsalksj.in")}>
                  Game 1
                </div>
                <div onClick={() => window.open("https://game2.dsalksj.in")}>
                  Game 2
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MOBILE MENU BUTTON */}
      {isMobile && (
        <div
          onClick={() => setMobileMenuOpen(true)}
          style={{
            fontSize: "24px",
            cursor: "pointer"
          }}
        >
          ☰
        </div>
      )}

      <MobileMenu
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
        navItems={navItems}
        user={user}
        handleLogout={handleLogout}
      />
    </nav>
  );
}