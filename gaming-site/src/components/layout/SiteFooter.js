"use client";

export default function SiteFooter() {
  const iconBox = {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    cursor: "pointer",
    transition: "all 0.35s ease",
    textDecoration: "none",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 8px 18px rgba(0,0,0,0.22)"
  };

  const handleMouseEnter = (e, glowColor) => {
    e.currentTarget.style.transform = "translateY(-6px) scale(1.08)";
    e.currentTarget.style.boxShadow = `0 0 22px ${glowColor}, 0 12px 24px rgba(0,0,0,0.35)`;
    e.currentTarget.style.border = `1px solid ${glowColor}`;
    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0) scale(1)";
    e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.22)";
    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.10)";
    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
  };

  const iconStyle = {
    width: "22px",
    height: "22px",
    display: "block"
  };

  return (
    <footer
      style={{
        width: "100%",
        padding: "40px 70px 28px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(7,7,10,0.72)",
        backdropFilter: "blur(12px)",
        position: "relative",
        zIndex: 2
      }}
    >
      {/* soft glow */}
      <div
        style={{
          position: "absolute",
          top: "-40px",
          left: "10%",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background: "rgba(124,58,237,0.12)",
          filter: "blur(90px)",
          pointerEvents: "none"
        }}
      />

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "24px",
          flexWrap: "wrap",
          position: "relative"
        }}
      >
        <div style={{ maxWidth: "640px" }}>
          <div
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              marginBottom: "8px",
              letterSpacing: "0.5px"
            }}
          >
            🎮 dsalksj
          </div>

          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.68)",
              lineHeight: "1.8",
              fontSize: "15px"
            }}
          >
            Premium gaming news, releases, downloads, and community content in
            one futuristic platform built for gamers.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "14px",
            alignItems: "center",
            flexWrap: "wrap"
          }}
        >
          {/* YouTube */}
          <a
            href="#"
            style={{ ...iconBox, color: "#ff4d4d" }}
            title="YouTube"
            onMouseEnter={(e) => handleMouseEnter(e, "rgba(255,77,77,0.65)")}
            onMouseLeave={handleMouseLeave}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              style={iconStyle}
              aria-hidden="true"
            >
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.7 31.7 0 0 0 24 12a31.7 31.7 0 0 0-.5-5.8ZM9.75 15.5v-7l6 3.5-6 3.5Z" />
            </svg>
          </a>

          {/* Discord */}
          <a
            href="#"
            style={{ ...iconBox, color: "#8ea1ff" }}
            title="Discord"
            onMouseEnter={(e) => handleMouseEnter(e, "rgba(142,161,255,0.65)")}
            onMouseLeave={handleMouseLeave}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              style={iconStyle}
              aria-hidden="true"
            >
              <path d="M20.3 4.37A17.4 17.4 0 0 0 16.1 3a12 12 0 0 0-.54 1.1 16.2 16.2 0 0 0-7.12 0A12 12 0 0 0 7.9 3a17.33 17.33 0 0 0-4.22 1.37C1 8.46.3 12.44.64 16.36A17.57 17.57 0 0 0 5.8 19a12.6 12.6 0 0 0 1.1-1.8 11.2 11.2 0 0 1-1.74-.84c.15-.11.3-.23.44-.35a12.25 12.25 0 0 0 10.8 0c.15.12.29.24.44.35-.56.33-1.15.62-1.75.85.31.64.68 1.25 1.1 1.81a17.48 17.48 0 0 0 5.17-2.65c.4-4.55-.69-8.49-1.06-11.99ZM8.68 13.98c-1.05 0-1.91-.96-1.91-2.14 0-1.18.84-2.14 1.9-2.14 1.07 0 1.93.97 1.91 2.14 0 1.18-.84 2.14-1.9 2.14Zm6.64 0c-1.05 0-1.9-.96-1.9-2.14 0-1.18.84-2.14 1.9-2.14 1.07 0 1.93.97 1.91 2.14 0 1.18-.84 2.14-1.9 2.14Z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="#"
            style={{ ...iconBox, color: "#ff73c6" }}
            title="Instagram"
            onMouseEnter={(e) => handleMouseEnter(e, "rgba(255,115,198,0.65)")}
            onMouseLeave={handleMouseLeave}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              style={iconStyle}
              aria-hidden="true"
            >
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm8.5 1.8h-8.5A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95ZM12 7.3A4.7 4.7 0 1 1 7.3 12 4.7 4.7 0 0 1 12 7.3Zm0 1.8A2.9 2.9 0 1 0 14.9 12 2.9 2.9 0 0 0 12 9.1Zm5.1-2.35a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1Z" />
            </svg>
          </a>

          {/* Facebook */}
          <a
            href="#"
            style={{ ...iconBox, color: "#6aa9ff" }}
            title="Facebook"
            onMouseEnter={(e) => handleMouseEnter(e, "rgba(106,169,255,0.65)")}
            onMouseLeave={handleMouseLeave}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              style={iconStyle}
              aria-hidden="true"
            >
              <path d="M13.5 22v-8.2h2.77l.41-3.2H13.5V8.55c0-.93.26-1.56 1.59-1.56h1.7V4.13A22.8 22.8 0 0 0 14.3 4c-2.46 0-4.15 1.5-4.15 4.25v2.35H7.36v3.2h2.79V22h3.35Z" />
            </svg>
          </a>
        </div>
      </div>

      <div
        style={{
          marginTop: "24px",
          paddingTop: "18px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.55)",
          fontSize: "14px",
          textAlign: "center",
          position: "relative"
        }}
      >
        © 2026 dsalksj. All rights reserved.
      </div>
    </footer>
  );
}