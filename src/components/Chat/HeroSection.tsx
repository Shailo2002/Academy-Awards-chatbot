"use client";

import React, { useEffect, useState } from "react";

const suggestions = [
    "Who won Best Picture in 2024?",
    "Which film has the most Oscar wins ever?",
    "Who has the most acting nominations?",
    "Best Director winners of the last decade?",
];

const winnerCards = [
    {
        year: "2024", category: "Best Picture", title: "Oppenheimer", winner: "Christopher Nolan",
        poster: "https://image.tmdb.org/t/p/w300/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",
    },
    {
        year: "2024", category: "Best Actor", title: "Oppenheimer", winner: "Cillian Murphy",
        poster: "https://image.tmdb.org/t/p/w300/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",
    },
    {
        year: "2023", category: "Best Picture", title: "Everything Everywhere All at Once", winner: "The Daniels",
        poster: "https://image.tmdb.org/t/p/w300/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    },
    {
        year: "2022", category: "Best Picture", title: "CODA", winner: "Sian Heder",
        poster: "https://image.tmdb.org/t/p/w300/BzVjmm8l23rPsijLiNLUzuQtyd.jpg",
    },
    {
        year: "2024", category: "Best Actress", title: "Poor Things", winner: "Emma Stone",
        poster: "https://image.tmdb.org/t/p/w300/kCGlIMHnOm8JPXIhJeFfFAhUnp7.jpg",
    },
    {
        year: "2021", category: "Best Picture", title: "Nomadland", winner: "Chloé Zhao",
        poster: "https://image.tmdb.org/t/p/w300/66qg3kHIGGjSFLiZ0e15YgSvqkr.jpg",
    },
    {
        year: "2020", category: "Best Picture", title: "Parasite", winner: "Bong Joon-ho",
        poster: "https://image.tmdb.org/t/p/w300/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    },
    {
        year: "2019", category: "Best Picture", title: "Green Book", winner: "Peter Farrelly",
        poster: "https://image.tmdb.org/t/p/w300/7BsvSuDQuoqhWmU2fL7W2GOcZHU.jpg",
    },
    {
        year: "2018", category: "Best Picture", title: "The Shape of Water", winner: "Guillermo del Toro",
        poster: "https://image.tmdb.org/t/p/w300/k4FwHlMhuRR5BISY2Gm2QZHlH5Q.jpg",
    },
    {
        year: "2024", category: "Best Supporting Actor", title: "Oppenheimer", winner: "Robert Downey Jr.",
        poster: "https://image.tmdb.org/t/p/w300/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",
    },
    {
        year: "2017", category: "Best Picture", title: "Moonlight", winner: "Barry Jenkins",
        poster: "https://image.tmdb.org/t/p/w300/qAwFbszPBYSQWgDMM1O4TGQF5uU.jpg",
    },
    {
        year: "2024", category: "Best Animated", title: "The Boy and the Heron", winner: "Hayao Miyazaki",
        poster: "https://image.tmdb.org/t/p/w300/f9A6SLFBVGRknQHbyPVzf11SFjn.jpg",
    },
];

function WinnerCard({ card }: { card: typeof winnerCards[0] }) {
    const [imgError, setImgError] = useState(false);
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                flexShrink: 0,
                width: "200px",
                height: "200px",
                borderRadius: "10px",
                overflow: "hidden",
                position: "relative",
                border: hovered
                    ? "2px solid rgba(212,175,55,0.9)"
                    : "2px solid rgba(212,175,55,0.35)",
                boxShadow: hovered
                    ? "0 0 24px rgba(212,175,55,0.25), 0 8px 32px rgba(0,0,0,0.7)"
                    : "0 4px 20px rgba(0,0,0,0.6)",
                boxSizing: "border-box",
                transition: "border-color 0.25s, box-shadow 0.25s, transform 0.25s",
                transform: hovered ? "scale(1.04)" : "scale(1)",
                cursor: "default",
            }}
        >
            {/* Corner accents */}
            <div style={{
                position: "absolute", top: 0, left: 0,
                width: "18px", height: "18px", zIndex: 3, pointerEvents: "none",
                borderTop: "2px solid #D4AF37", borderLeft: "2px solid #D4AF37",
                borderRadius: "8px 0 0 0",
            }} />
            <div style={{
                position: "absolute", top: 0, right: 0,
                width: "18px", height: "18px", zIndex: 3, pointerEvents: "none",
                borderTop: "2px solid #D4AF37", borderRight: "2px solid #D4AF37",
                borderRadius: "0 8px 0 0",
            }} />
            <div style={{
                position: "absolute", bottom: 0, left: 0,
                width: "18px", height: "18px", zIndex: 3, pointerEvents: "none",
                borderBottom: "2px solid #D4AF37", borderLeft: "2px solid #D4AF37",
                borderRadius: "0 0 0 8px",
            }} />
            <div style={{
                position: "absolute", bottom: 0, right: 0,
                width: "18px", height: "18px", zIndex: 3, pointerEvents: "none",
                borderBottom: "2px solid #D4AF37", borderRight: "2px solid #D4AF37",
                borderRadius: "0 0 8px 0",
            }} />

            {/* Poster image */}
            {!imgError ? (
                <img
                    src={card.poster}
                    alt={card.title}
                    onError={() => setImgError(true)}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center top",
                        display: "block",
                        transition: "transform 0.4s ease",
                        transform: hovered ? "scale(1.06)" : "scale(1)",
                    }}
                />
            ) : (
                <div style={{
                    width: "100%", height: "100%",
                    background: "linear-gradient(135deg, #1C1A10 0%, #0F0D06 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "40px", color: "#D4AF37", opacity: 0.3,
                }}>★</div>
            )}

            {/* Gradient overlay — always present, stronger on hover */}
            <div style={{
                position: "absolute", inset: 0,
                background: hovered
                    ? "linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.1) 100%)"
                    : "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)",
                transition: "background 0.25s",
                zIndex: 1,
            }} />

            {/* Text overlay */}
            <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "14px 12px",
                zIndex: 2,
            }}>
                {/* Category badge */}
                <div style={{
                    display: "inline-block",
                    fontSize: "8px",
                    letterSpacing: "0.14em",
                    color: "#0A0A08",
                    background: "#D4AF37",
                    padding: "2px 7px",
                    borderRadius: "3px",
                    marginBottom: "6px",
                    fontFamily: "Georgia, serif",
                    textTransform: "uppercase",
                    fontWeight: 700,
                }}>
                    {card.year} · {card.category}
                </div>

                <div style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#F0E6C8",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontStyle: "italic",
                    lineHeight: 1.25,
                    marginBottom: "4px",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                }}>
                    {card.title}
                </div>

                <div style={{
                    fontSize: "10px",
                    color: "#A89060",
                    fontFamily: "Georgia, serif",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}>
                    {card.winner}
                </div>
            </div>
        </div>
    );
}

interface HeroSectionProps {
    onSuggestionClick: (text: string) => void;
}

export default function HeroSection({ onSuggestionClick }: HeroSectionProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setVisible(true), 100);
    }, []);

    return (
        <div style={styles.wrapper}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');

                @keyframes marquee-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes spotlight-sweep {
                    0%, 100% { opacity: 0.06; transform: translateX(-50%) rotate(-8deg); }
                    50% { opacity: 0.12; transform: translateX(-50%) rotate(8deg); }
                }
                @keyframes star-twinkle {
                    0%, 100% { opacity: 0.15; }
                    50% { opacity: 0.45; }
                }
                .chip-btn:hover {
                    background: rgba(212,175,55,0.12) !important;
                    border-color: #D4AF37 !important;
                    color: #F0D060 !important;
                    transform: translateX(4px) !important;
                }
            `}</style>

            {/* Spotlight beams */}
            <div style={{
                position: "absolute", top: "-20%", left: "50%",
                width: "300px", height: "120%",
                background: "linear-gradient(180deg, rgba(212,175,55,0.1) 0%, transparent 70%)",
                transform: "translateX(-50%) rotate(-8deg)",
                animation: "spotlight-sweep 8s ease-in-out infinite",
                pointerEvents: "none", zIndex: 0,
            }} />
            <div style={{
                position: "absolute", top: "-20%", left: "50%",
                width: "200px", height: "110%",
                background: "linear-gradient(180deg, rgba(212,175,55,0.06) 0%, transparent 60%)",
                transform: "translateX(-50%) rotate(12deg)",
                animation: "spotlight-sweep 11s ease-in-out infinite reverse",
                pointerEvents: "none", zIndex: 0,
            }} />

            {/* Scattered stars */}
            {[...Array(12)].map((_, i) => (
                <div key={i} style={{
                    position: "absolute",
                    left: `${8 + (i * 137.5) % 84}%`,
                    top: `${5 + (i * 97.3) % 90}%`,
                    fontSize: `${8 + (i % 3) * 4}px`,
                    color: "#D4AF37",
                    opacity: 0.1 + (i % 4) * 0.05,
                    animation: `star-twinkle ${2 + (i % 3)}s ease-in-out infinite`,
                    animationDelay: `${i * 0.4}s`,
                    pointerEvents: "none", zIndex: 0,
                }}>★</div>
            ))}

            {/* ── Scrolling poster cards row ── */}
            <div style={{
                width: "100%",
                overflow: "hidden",
                marginBottom: "36px",
                height: "224px",
                paddingBlock: "10px",
                maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.8s ease 0.2s",
                position: "relative",
                zIndex: 1,
                boxSizing: "border-box",
            }}>
                <div style={{
                    display: "flex",
                    gap: "16px",
                    width: "max-content",
                    animation: "marquee-left 55s linear infinite",
                    alignItems: "center",
                    height: "100%",
                    paddingInline: "8px",
                }}>
                    {[...winnerCards, ...winnerCards].map((card, i) => (
                        <WinnerCard key={i} card={card} />
                    ))}
                </div>
            </div>

            {/* ── Hero center ── */}
            <div style={{
                ...styles.center,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.9s cubic-bezier(.16,1,.3,1) 0.3s, transform 0.9s cubic-bezier(.16,1,.3,1) 0.3s",
            }}>
                <div style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "11px", letterSpacing: "0.5em", color: "#D4AF37",
                    opacity: 0.8, marginBottom: "4px", textTransform: "uppercase",
                }}>The Official</div>

                <h1 style={{
                    margin: "0 0 4px",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700, fontStyle: "italic",
                    fontSize: "clamp(52px, 9vw, 80px)",
                    background: "linear-gradient(135deg, #F5E6A3 0%, #D4AF37 45%, #A07820 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                }}>
                    Envelope
                </h1>

                <div style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "11px", letterSpacing: "0.4em", color: "#D4AF37",
                    opacity: 0.6, marginBottom: "16px", textTransform: "uppercase",
                }}>Academy Awards AI</div>

                <p style={{
                    fontFamily: "Georgia, serif", fontStyle: "italic",
                    fontSize: "14px", color: "rgba(220,210,190,0.6)",
                    maxWidth: "380px", textAlign: "center", lineHeight: 1.7,
                    margin: "0 0 28px",
                }}>
                    Every winner. Every speech. Every nominee.<br />Ask anything about the Oscars.
                </p>

                {/* Divider */}
                <div style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    marginBottom: "24px", width: "100%", maxWidth: "420px",
                }}>
                    <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4))" }} />
                    <span style={{ color: "#D4AF37", fontSize: "12px", opacity: 0.6 }}>✦</span>
                    <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(212,175,55,0.4), transparent)" }} />
                </div>

                {/* Suggestion chips */}
                <div style={{
                    fontSize: "10px", letterSpacing: "0.2em", color: "rgba(212,175,55,0.45)",
                    marginBottom: "12px", textTransform: "uppercase", fontFamily: "Georgia, serif",
                }}>Ask me anything</div>

                <div style={{ display: "flex", flexDirection: "column", gap: "9px", width: "100%", maxWidth: "460px" }}>
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            className="chip-btn"
                            onClick={() => onSuggestionClick(s)}
                            style={{
                                ...styles.chip,
                                opacity: visible ? 1 : 0,
                                transform: visible ? "translateX(0)" : "translateX(-10px)",
                                transition: `opacity 0.6s ease ${0.5 + i * 0.08}s, transform 0.6s ease ${0.5 + i * 0.08}s, background 0.2s, border-color 0.2s, color 0.2s`,
                            }}
                        >
                            <span style={{ fontSize: "9px", color: "#D4AF37", opacity: 0.6, flexShrink: 0 }}>★</span>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bottom fade */}
            <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: "60px",
                background: "linear-gradient(to top, rgba(10,10,8,0.8), transparent)",
                pointerEvents: "none", zIndex: 2,
            }} />
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    wrapper: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        padding: "20px 0",
        overflow: "hidden",
        background: "transparent",
    },
    center: {
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "0 24px 32px",
        width: "100%",
    },
    chip: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 18px",
        background: "rgba(212,175,55,0.04)",
        border: "1px solid rgba(212,175,55,0.2)",
        borderRadius: "10px",
        color: "#B8984A",
        fontSize: "13px",
        fontFamily: "Georgia, serif",
        fontStyle: "italic",
        cursor: "pointer",
        textAlign: "left",
        letterSpacing: "0.01em",
        width: "100%",
        boxSizing: "border-box",
    },
};