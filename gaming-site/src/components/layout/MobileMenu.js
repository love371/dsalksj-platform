"use client";

import { useRouter } from "next/navigation";

export default function MobileMenu({
  isOpen,
  setIsOpen,
  navItems,
  user,
  handleLogout
}) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "75%",
        maxWidth: "300px",
        height: "100vh",
        background: "rgba(10,10,15,0.98)",
        backdropFilter: "blur(16px)",
        borderLeft: "1px solid rgba(255,255,255,0.1)",
        padding: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}
    >
      <button
        onClick={() => setIsOpen(false)}
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: "22px",
          alignSelf: "flex-end",
          cursor: "pointer"
        }}
      >
        ✕
      </button>

      {navItems.map((item) => (
        <div
          key={item.path}
          onClick={() => {
            router.push(item.path);
            setIsOpen(false);
          }}
          style={{
            padding: "12px",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.05)",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {item.label}
        </div>
      ))}

      {/* Games Section */}
      <div style={{ marginTop: "10px" }}>
        <p style={{ opacity: 0.7, fontSize: "12px" }}>Games</p>

        {[
          { name: "Game 1", url: "https://game1.dsalksj.in" },
          { name: "Game 2", url: "https://game2.dsalksj.in" }
        ].map((game) => (
          <div
            key={game.name}
            onClick={() => window.open(game.url, "_blank")}
            style={{
              padding: "10px",
              marginTop: "6px",
              borderRadius: "8px",
              background: "rgba(124,58,237,0.15)",
              cursor: "pointer"
            }}
          >
            {game.name}
          </div>
        ))}
      </div>

      {user && (
        <button
          onClick={handleLogout}
          style={{
            marginTop: "auto",
            padding: "12px",
            borderRadius: "10px",
            background: "#ef4444",
            border: "none",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      )}
    </div>
  );
}