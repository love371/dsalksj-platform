"use client";

import { useEffect, useState } from "react";
import { optimizeImage } from "@/lib/image";

export default function PostCardGrid({ posts, title, eyebrow, subtitle }) {
  const [screenWidth, setScreenWidth] = useState(1400);

  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);
    updateWidth();

    const resizeHandler = () => requestAnimationFrame(updateWidth);
    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  const isMobile = screenWidth <= 768;
  const isTablet = screenWidth > 768 && screenWidth <= 1024;

  return (
    <section
      style={{
        width: "100%",
        padding: isMobile
          ? "8px 16px 42px"
          : isTablet
          ? "10px 24px 70px"
          : "10px 70px 90px",
        position: "relative",
        zIndex: 2
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "end",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: isMobile ? "18px" : "26px"
        }}
      >
        <div>
          <p
            style={{
              margin: "0 0 8px",
              color: "#c084fc",
              fontWeight: "bold",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontSize: isMobile ? "11px" : "13px"
            }}
          >
            {eyebrow}
          </p>

          <h2
            style={{
              fontSize: isMobile ? "24px" : isTablet ? "36px" : "42px",
              margin: 0,
              lineHeight: "1.15"
            }}
          >
            {title}
          </h2>
        </div>

        <p
          style={{
            margin: 0,
            color: "rgba(255,255,255,0.65)",
            fontSize: isMobile ? "13px" : "14px",
            maxWidth: isMobile ? "100%" : "420px",
            lineHeight: "1.6"
          }}
        >
          {subtitle}
        </p>
      </div>

      {posts.length === 0 ? (
        <p style={{ color: "rgba(255,255,255,0.7)" }}>
          No posts available yet.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : isTablet
              ? "repeat(2, minmax(0, 1fr))"
              : "repeat(auto-fit, minmax(280px, 1fr))",
            gap: isMobile ? "14px" : "22px"
          }}
        >
          {posts.map((post) => {
            const optimizedImg = optimizeImage(
              post.image,
              isMobile ? 400 : 800
            );

            return (
              <div
                key={post._id}
                style={{
                  padding: isMobile ? "14px" : isTablet ? "18px" : "22px",
                  borderRadius: isMobile ? "16px" : "22px",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025))",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow:
                    "0 12px 28px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.05)",
                  backdropFilter: "blur(12px)",
                  cursor: "pointer",
                  transform: "translateZ(0)",
                  willChange: "transform",
                  contain: "layout paint"
                }}
                onClick={() => {
                  if (post.slug) {
                    window.location.href = `/post/${post.slug}`;
                  }
                }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    marginBottom: "14px",
                    borderRadius: isMobile ? "12px" : "16px",
                    overflow: "hidden",
                    background: "#0f0f18"
                  }}
                >
                  <img
                    src={
                      optimizedImg ||
                      "https://via.placeholder.com/800x450?text=No+Image"
                    }
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: post.imageFit || "cover",
                      objectPosition: post.imagePosition || "center",
                      display: "block"
                    }}
                  />
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    opacity: 0.7,
                    textTransform: "uppercase"
                  }}
                >
                  {post.type}
                </div>

                <h3
                  style={{
                    marginBottom: "8px",
                    fontSize: isMobile ? "18px" : "22px",
                    lineHeight: "1.3"
                  }}
                >
                  {post.title}
                </h3>

                <p
                  style={{
                    opacity: 0.7,
                    fontSize: isMobile ? "13px" : "15px",
                    lineHeight: "1.7"
                  }}
                >
                  {post.description}
                </p>

                {post.category && (
                  <p
                    style={{
                      marginTop: "8px",
                      fontSize: "12px",
                      color: "#c084fc",
                      fontWeight: "bold"
                    }}
                  >
                    {post.category}
                  </p>
                )}

                <div
                  style={{
                    marginTop: "14px",
                    color: "#c084fc",
                    fontWeight: "bold",
                    fontSize: isMobile ? "13px" : "14px"
                  }}
                >
                  Read More →
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}