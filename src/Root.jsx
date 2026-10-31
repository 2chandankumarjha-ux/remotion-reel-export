/* ============================================================
   TOP 10 POPULATION — Count-up Bar Reel (1080x1920, 30fps | 60s)
   Theme: Neo-Data / Glassmorphic Dashboard
   Effects: Staggered Wave Animation, Tabular Counting
   Dependencies: remotion, @remotion/google-fonts (package.json me pinned)
   ============================================================ */
import React from "react";
import {
  AbsoluteFill,
  Composition,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadNotoSans } from "@remotion/google-fonts/NotoSansDevanagari";

/* ---------- Fonts & Data Dashboard Palette ---------- */
const hindiFont = loadNotoSans("normal", {
  weights: ["600", "700", "800"],
  subsets: ["devanagari", "latin"],
}).fontFamily;

const dataFont = loadInter("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin"],
}).fontFamily;

const C = {
  bg: "#0B0F19",         // Deep Navy Black
  panel: "#111827",      // Dark Glass Panel
  text: "#F8FAFC",       // Crisp White
  muted: "#94A3B8",      // Slate Grey
  accent: "#38BDF8",     // Cyan Data Accent
  grid: "#1E293B",       // Subtle Grid Line
};

const FPS = 30;
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };

/* easeOutExpo, 0 se 1 tak pura normalize kiya hua.
   (Pehle formula 1 tak pahunchta hi nahi tha, isliye number 1-2 kam dikhta tha.) */
const easeOutExpo = (p) =>
  p >= 1 ? 1 : (1 - Math.pow(2, -10 * p)) / (1 - Math.pow(2, -10));

/* ---------- Top 10 Population Data (2024 Approx) ----------
   NOTE: numbers ek hi source (UN WPP 2024 / World Bank) se verify karke update karein. */
const DATA = [
  { name: "India", value: 1441, color: "#FF5722" },      // Deep Orange
  { name: "China", value: 1425, color: "#F44336" },      // Red
  { name: "USA", value: 341, color: "#2196F3" },         // Blue
  { name: "Indonesia", value: 278, color: "#E91E63" },   // Pink
  { name: "Pakistan", value: 240, color: "#4CAF50" },    // Green
  { name: "Nigeria", value: 223, color: "#8BC34A" },     // Light Green
  { name: "Brazil", value: 216, color: "#FFEB3B" },      // Yellow
  { name: "Bangladesh", value: 173, color: "#00BCD4" },  // Cyan
  { name: "Russia", value: 144, color: "#3F51B5" },      // Indigo
  { name: "Mexico", value: 128, color: "#9C27B0" },      // Purple
];

const maxValue = Math.max(...DATA.map((d) => d.value));

/* ---------- Timed Hindi Captions ---------- */
const CAPTION_CUES = [
  { startFrame: 10, endFrame: 400, text: "दुनिया के टॉप 10 सबसे ज्यादा आबादी वाले देश" },
  { startFrame: 410, endFrame: 800, text: "बार चार्ट रेस: देखिए कैसे बढ़ रही है आबादी" },
  { startFrame: 810, endFrame: 1200, text: "टॉप 10 में से 5 देश अकेले एशिया के हैं" },
  { startFrame: 1210, endFrame: 1600, text: "2023 में भारत ने चीन को पीछे छोड़ दिया" },
  { startFrame: 1610, endFrame: 1800, text: "क्या आपका देश इस लिस्ट में है? कमेंट करें" },
];

/* ---------- Globe icon (inline SVG, lucide-react ki zarurat nahi) ---------- */
const GlobeIcon = ({ size = 18, color = "#fff" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

/* ---------- DATA: Clean Word-by-Word Caption ---------- */
const DataCaption = () => {
  const frame = useCurrentFrame();

  const activeCue = CAPTION_CUES.find(
    (c) => frame >= c.startFrame && frame <= c.endFrame
  );

  if (!activeCue) return null;

  const words = activeCue.text.split(" ");
  const duration = activeCue.endFrame - activeCue.startFrame;
  const progressFrames = frame - activeCue.startFrame;
  const progressRatio = Math.min(Math.max(progressFrames / duration, 0), 1);
  const activeWordIndex = Math.floor(progressRatio * words.length);

  const pop = spring({
    frame: progressFrames,
    fps: FPS,
    config: { damping: 20, stiffness: 120 },
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 140,
        display: "flex",
        justifyContent: "center",
        padding: "0 40px",
        zIndex: 90,
      }}
    >
      <div
        style={{
          background: "rgba(17, 24, 39, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRadius: "16px",
          padding: "16px 32px",
          maxWidth: "920px",
          border: `1px solid ${C.grid}`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: "12px",
          rowGap: "8px",
          transform: `scale(${0.96 + 0.04 * pop})`,
          opacity: interpolate(pop, [0, 1], [0, 1], CLAMP),
        }}
      >
        {words.map((word, idx) => {
          const isCurrent = idx === activeWordIndex;
          const isPassed = idx < activeWordIndex;

          return (
            <span
              key={idx}
              style={{
                fontFamily: hindiFont,
                fontWeight: isCurrent ? 800 : 600,
                fontSize: "38px",
                lineHeight: 1.3,
                color: isCurrent ? C.accent : isPassed ? C.text : C.muted,
                textShadow: isCurrent ? `0 0 15px ${C.accent}60` : "none",
                transform: isCurrent ? "scale(1.05)" : "scale(1)",
                /* CSS transition hata diya: Remotion frame-by-frame render
                   karta hai, transition render me kaam nahi karta. */
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- HEAVY EFFECT: Racing Bar Item ---------- */
const BarItem = ({ item, index }) => {
  const frame = useCurrentFrame();

  const raceStart = 120; // Start race at 4 seconds
  const raceDuration = 900; // 30 seconds race
  const staggerDelay = index * 15; // Wave effect

  const progress = interpolate(
    frame,
    [raceStart + staggerDelay, raceStart + staggerDelay + raceDuration],
    [0, 1],
    CLAMP
  );

  const eased = easeOutExpo(progress);

  const widthPct = (item.value / maxValue) * 80; // Max 80% width
  const currentWidth = widthPct * eased;
  const currentVal = Math.round(item.value * eased);

  const isTop = index === 0;
  const raceFinished = frame > raceStart + staggerDelay + raceDuration + 60;

  // Pulse effect for #1 when race finishes
  const pulse = raceFinished && isTop ? 1 + Math.sin(frame / 10) * 0.03 : 1;

  const fadeIn = interpolate(
    frame,
    [raceStart + staggerDelay - 30, raceStart + staggerDelay],
    [0, 1],
    CLAMP
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 70,
        marginBottom: 16,
        opacity: fadeIn,
        transform: `scale(${pulse})`,
        transformOrigin: "left center",
      }}
    >
      {/* Rank */}
      <div
        style={{
          width: 50,
          fontSize: 28,
          fontWeight: 800,
          color: C.muted,
          fontFamily: dataFont,
          textAlign: "center",
        }}
      >
        {index + 1}
      </div>

      {/* Country Name */}
      <div
        style={{
          width: 180,
          fontSize: 24,
          fontWeight: 700,
          color: C.text,
          fontFamily: dataFont,
          paddingRight: 10,
        }}
      >
        {item.name}
      </div>

      {/* Bar Container */}
      <div
        style={{
          flex: 1,
          height: 46,
          background: C.grid,
          borderRadius: 23,
          position: "relative",
          overflow: "hidden",
          border: `1px solid ${C.grid}`,
        }}
      >
        {/* The Racing Bar */}
        <div
          style={{
            width: `${currentWidth}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${item.color}cc, ${item.color})`,
            borderRadius: 23,
            boxShadow: `0 0 20px ${item.color}80`,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: 16,
          }}
        >
          {/* Inner Glass Highlight */}
          <div
            style={{
              position: "absolute",
              top: 4,
              left: 4,
              height: 12,
              background: "rgba(255,255,255,0.25)",
              borderRadius: 10,
              width: `${Math.max(0, currentWidth - 2)}%`,
            }}
          />
        </div>
      </div>

      {/* Counting Value */}
      <div
        style={{
          width: 110,
          textAlign: "right",
          fontSize: 26,
          fontWeight: 800,
          color: item.color,
          fontFamily: dataFont,
          fontVariantNumeric: "tabular-nums", // Prevents jitter while counting
          paddingLeft: 16,
          textShadow: `0 0 10px ${item.color}60`,
        }}
      >
        {currentVal}M
      </div>
    </div>
  );
};

/* ---------- Dashboard Backdrop ---------- */
const DashboardBackdrop = () => {
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {/* Subtle Data Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          opacity: 0.4,
        }}
      />

      {/* Glowing Data Orbs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accent}20, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, #FF572220, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------- Top Chrome: Progress & Title ---------- */
const Chrome = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progressPct = (frame / durationInFrames) * 100;

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 4,
          width: `${progressPct}%`,
          background: `linear-gradient(90deg, ${C.accent}, ${C.text})`,
          boxShadow: `0 0 15px ${C.accent}80`,
          zIndex: 100,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 100,
        }}
      >
        <div
          style={{
            fontFamily: dataFont,
            fontWeight: 700,
            fontSize: 22,
            color: C.text,
            padding: "8px 24px",
            background: "rgba(17, 24, 39, 0.8)",
            border: `1px solid ${C.grid}`,
            borderRadius: 24,
            letterSpacing: 1,
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <GlobeIcon size={18} color={C.accent} />
          TOP 10 POPULATION 2024
        </div>
      </div>
    </>
  );
};

/* ---------- Master Composition ---------- */
export const PopulationRaceReel = () => {
  const frame = useCurrentFrame();

  // Title animation
  const titleOpacity = interpolate(frame, [0, 60], [0, 1], CLAMP);
  const titleY = interpolate(frame, [0, 60], [30, 0], CLAMP);

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <DashboardBackdrop />
      <Chrome />

      {/* Intro Title */}
      <div
        style={{
          position: "absolute",
          top: 140,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: hindiFont,
            fontWeight: 800,
            fontSize: 56,
            color: C.text,
            textShadow: `0 0 30px ${C.accent}40`,
          }}
        >
          जनसंख्या की दौड़
        </span>
      </div>

      {/* The Bar Chart Container */}
      <div
        style={{
          position: "absolute",
          top: 260,
          left: 60,
          right: 60,
          bottom: 320,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          zIndex: 5,
        }}
      >
        {DATA.map((item, index) => (
          <BarItem key={item.name} item={item} index={index} />
        ))}
      </div>

      <DataCaption />
    </AbsoluteFill>
  );
};

/* ---------- Root ---------- */
export const Root = () => (
  <Composition
    id="PopulationRaceReel"
    component={PopulationRaceReel}
    durationInFrames={1800} // 60s @ 30 FPS
    fps={FPS}
    width={1080}
    height={1920}
  />
);
