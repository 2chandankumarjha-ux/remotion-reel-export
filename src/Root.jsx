/* ============================================================
   TILOTTAMA EPIC - STORY-DRIVEN THEMES (1080x1920, 30fps | 90s)
   Dynamic Backgrounds: Divine, Demonic, Forest, War, Cosmic
   Dependencies: @remotion/shapes, @remotion/transitions, lucide-react
   ============================================================ */
import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Composition,
  useCurrentFrame,
  interpolate,
  spring,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { loadFont as loadMukta } from "@remotion/google-fonts/Mukta";
import { Eye, Flame, Crown, Wind, Swords, Sparkles, Moon } from "lucide-react";
import { Star as RemotionStar, Polygon } from "@remotion/shapes";

/* ---------- Fonts & Dynamic Color System ---------- */
const hindiFont = loadMukta("normal", {
  weights: ["400", "600", "800"],
  subsets: ["devanagari", "latin"],
}).fontFamily;

const C = {
  // Themes
  voidBlack: "#050204",
  pureWhite: "#ffffff",
  textMuted: "#e2c4c4",
  // Divine (Gods, Creation)
  divineGold: "#ffcc00",
  magicPink: "#ff2a85",
  shivaBlue: "#00b7ff",
  // Demonic (Sund, Upsund, War)
  demonRed: "#b80000",
  darkBlood: "#2b0000",
  // Nature (Vindhyachal)
  mysticGreen: "#0a3a20",
  emerald: "#00ff88",
};

const FPS = 30;
const T_FRAMES = 15; // 0.5s transitions
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };

/* ---------- Hindi Script Cues (90s / 2700 Frames) ---------- */
const CAPTION_CUES = [
  // Scene 1: Divine Reaction (Heavenly Vibe)
  { startFrame: 10, endFrame: 130, text: "सोचिए एक ऐसी स्त्री जिसे देखने के लिए" },
  { startFrame: 135, endFrame: 260, text: "देवराज इंद्र के पूरे शरीर पर 1000 आंखें फूट पड़ी" },
  { startFrame: 265, endFrame: 390, text: "और शांत रहने वाले भगवान शिव के एक साथ चार मुख प्रकट हो गए।" },
  { startFrame: 395, endFrame: 540, text: "एक ऐसी अप्सरा जिसने बिना कोई तलवार उठाए सिर्फ अपनी एक मुस्कान से दो अजय दैत्यों का कत्लेआम करवा दिया।" },
  
  // Scene 2: The Demons (Dark & Fiery Vibe)
  { startFrame: 560, endFrame: 660, text: "यह कहानी है दो महाशक्तिशाली दैत्य भाइयों की। सुंद और उपसुंध" },
  { startFrame: 665, endFrame: 800, text: "दोनों के बीच इतना गहरा प्रेम था कि वे एक ही थाली में खाते, साथ सोते और एक ही विचार रखते थे।" },
  
  // Scene 3: The Boon (Aggressive Red/Gold)
  { startFrame: 820, endFrame: 970, text: "उन्होंने ब्रह्मा जी की घोर तपस्या करके एक ऐसा वरदान हासिल कर लिया जिसने स्वर्ग से पाताल तक हड़कंप मचा दिया।" },
  { startFrame: 975, endFrame: 1100, text: "तीनों लोकों का कोई भी देवता, दानव या अस्त्र उन्हें मार नहीं सकता था।" },
  { startFrame: 1105, endFrame: 1180, text: "उनकी मृत्यु केवल और केवल एक दूसरे के हाथों ही संभव थी।" },
  { startFrame: 1185, endFrame: 1290, text: "बस इसी घमंड में उन्होंने तीनों लोकों को श्मशान बना दिया। स्वर्ग छीन लिया। देवता बेघर हो गए।" },
  
  // Scene 4: Creation of Tilottama (Magical Pink/Gold Vibe)
  { startFrame: 1310, endFrame: 1420, text: "जब देवताओं की तलवारें और अस्त्र बेकार हो गए, तब ब्रह्मा जी ने चली सृष्टि की सबसे खतरनाक चाल।" },
  { startFrame: 1425, endFrame: 1560, text: "उन्होंने देव शिल्पी विश्वकर्मा को बुलाया और आदेश दिया। ब्रह्मांड की हर खूबसूरत चीज में से एक-एक तिल के समान कण निकालो..." },
  { startFrame: 1565, endFrame: 1690, text: "...और एक ऐसी स्त्री की रचना करो, जिसे देखकर काल भी अपनी सुधबुध खो बैठे।" },
  { startFrame: 1695, endFrame: 1780, text: "हर उत्तम वस्तु के तिल-तिल अंश से बनने के कारण उनका नाम पड़ा 'तिलोत्तमा'।" },

  // Scene 5: Vindhyachal Forest (Deep Green Mystical Vibe)
  { startFrame: 1800, endFrame: 1910, text: "जिस सौंदर्य के आगे देव और महादेव भी निशब्द थे। अब उसी सौंदर्य को भेजा गया दैत्यों के डेरे पर।" },
  { startFrame: 1915, endFrame: 2030, text: "विंध्याचल के घने जंगलों में जब तिलोत्तमा मंद-मंद कदमों से उतरी तो हवाओं की दिशा बदल गई।" },
  
  // Scene 6: Lust & Destruction (Bloody Pulsing War Vibe)
  { startFrame: 2050, endFrame: 2190, text: "सुंद और उपसुंध की नजर उस पर पड़ी और हजारों सालों का भाईचारा, मर्यादा और शक्ति सब कुछ सिर्फ एक सेकंड में खाक हो गया।" },
  { startFrame: 2195, endFrame: 2280, text: "सुंद ने झपट कर उसका दायां हाथ पकड़ा और चिल्लाया—'यह मेरी रानी बनेगी।'" },
  { startFrame: 2285, endFrame: 2380, text: "उपसुंध ने बायां हाथ खींचा और दहाड़ा—'इसे पहले मैंने देखा। यह मेरी रानी बनेगी।'" },
  { startFrame: 2385, endFrame: 2470, text: "तिलोत्तमा ने पलकें झुकाई और मासूमियत से कहा, 'जो सबसे ज्यादा बलवान हो, मैं उसी की रानी बनूंगी।'" },
  { startFrame: 2475, endFrame: 2560, text: "वासना और अहंकार में दोनों ने उसी भाई की गर्दन काटने के लिए गदाएं उठा लीं, जिसके लिए वो जान दे सकते थे।" },
  
  // Scene 7: Conclusion (Cosmic Calm Vibe)
  { startFrame: 2580, endFrame: 2680, text: "कुछ ही मिनटों में दोनों अजय दैत्य लहूलुहान होकर एक दूसरे की गदा से वहीं ढेर हो गए।" },
  { startFrame: 2685, endFrame: 2790, text: "सनातन इतिहास की इस अनसुनी गाथा के लिए वीडियो को लाइक करें और कमेंट में 'हर हर महादेव' जरूर लिखें।" },
];

/* ---------- Themed Backgrounds ---------- */
const DivineBg = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 30%, #3a2200 0%, ${C.voidBlack} 80%)` }}>
    <div style={{ position: "absolute", top: "-10%", left: "10%", width: "80%", height: "60%", background: `radial-gradient(circle, ${C.divineGold}33, transparent 70%)`, filter: "blur(60px)" }} />
  </AbsoluteFill>
);

const DemonBg = () => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.darkBlood} 0%, ${C.voidBlack} 100%)` }}>
    <div style={{ position: "absolute", bottom: "0", left: "0", width: "100%", height: "50%", background: `radial-gradient(circle at 50% 100%, ${C.demonRed}44, transparent 70%)`, filter: "blur(40px)" }} />
  </AbsoluteFill>
);

const MagicBg = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.voidBlack }}>
      <div style={{ position: "absolute", top: "20%", left: "20%", width: "60%", height: "60%", background: `radial-gradient(circle, ${C.magicPink}44, transparent 70%)`, filter: "blur(80px)", transform: `scale(${1 + Math.sin(frame / 30) * 0.1})` }} />
      <div style={{ position: "absolute", bottom: "20%", right: "20%", width: "50%", height: "50%", background: `radial-gradient(circle, ${C.divineGold}33, transparent 70%)`, filter: "blur(60px)" }} />
    </AbsoluteFill>
  );
};

const ForestBg = () => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.mysticGreen} 0%, ${C.voidBlack} 100%)` }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%", background: "repeating-linear-gradient(45deg, rgba(0,255,136,0.03) 0px, rgba(0,255,136,0.03) 10px, transparent 10px, transparent 20px)", opacity: 0.5 }} />
    <div style={{ position: "absolute", top: "10%", left: "10%", width: "80%", height: "80%", background: `radial-gradient(circle, ${C.emerald}22, transparent 60%)`, filter: "blur(50px)" }} />
  </AbsoluteFill>
);

const WarBg = () => {
  const frame = useCurrentFrame();
  const pulse = Math.abs(Math.sin(frame / 5)); // Aggressive fast pulse
  return (
    <AbsoluteFill style={{ background: C.voidBlack }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 50%, rgba(184, 0, 0, ${0.2 + pulse * 0.2}) 0%, ${C.darkBlood} 100%)` }} />
    </AbsoluteFill>
  );
};

/* ---------- Decorative Elements ---------- */
const Chakra = ({ color, size = 700, speed = 0.5 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", width: size, height: size, display: "flex", justifyContent: "center", alignItems: "center", opacity: 0.15, zIndex: 0 }}>
      <RemotionStar points={12} innerRadius={size * 0.3} outerRadius={size * 0.45} fill="none" stroke={color} strokeWidth={4} style={{ position: "absolute", transform: `rotate(${frame * speed}deg)` }} />
      <circle cx={size/2} cy={size/2} r={size * 0.25} fill="none" stroke={color} strokeWidth={2} style={{ position: "absolute", border: `2px dashed ${color}`, borderRadius: "50%", width: size * 0.5, height: size * 0.5 }} />
    </div>
  );
};

const FloatIn = ({ delay = 0, children, y = 50 }) => {
  const frame = useCurrentFrame();
  const s = spring({ frame: frame - delay, fps: FPS, config: { damping: 12, stiffness: 100 } });
  return <div style={{ opacity: s, transform: `translateY(${(1 - s) * y}px)`, zIndex: 10 }}>{children}</div>;
};

/* ---------- Story-Driven Captions ---------- */
const StoryCaptions = () => {
  const frame = useCurrentFrame();
  const activeCue = useMemo(() => CAPTION_CUES.find((c) => frame >= c.startFrame && frame <= c.endFrame), [frame]);

  if (!activeCue) return null;

  const words = activeCue.text.split(" ");
  const duration = activeCue.endFrame - activeCue.startFrame;
  const progressRatio = Math.min(Math.max((frame - activeCue.startFrame) / duration, 0), 1);
  const activeWordIndex = Math.floor(progressRatio * words.length);
  const pop = spring({ frame: frame - activeCue.startFrame, fps: FPS, config: { damping: 16, stiffness: 140 } });

  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 220, display: "flex", justifyContent: "center", alignItems: "center", padding: "0 60px", zIndex: 100 }}>
      <div style={{
        background: "rgba(10, 5, 8, 0.75)", backdropFilter: "blur(20px)",
        borderRadius: "24px", padding: "24px 45px", maxWidth: "900px",
        border: `1px solid rgba(255, 255, 255, 0.1)`,
        boxShadow: `0 20px 50px rgba(0,0,0,0.9)`,
        display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: "16px", rowGap: "8px",
        transform: `scale(${0.9 + 0.1 * pop}) translateY(${(1 - pop) * 20}px)`, opacity: pop
      }}>
        {words.map((word, idx) => {
          const isCurrent = idx === activeWordIndex;
          const isPassed = idx < activeWordIndex;
          
          let color = isCurrent ? C.divineGold : (isPassed ? C.pureWhite : C.textMuted);
          
          // Theme-based word highlighting
          if (isCurrent) {
            if (["शिव", "महादेव", "इंद्र", "ब्रह्मा"].some(g => word.includes(g))) color = C.shivaBlue;
            if (["राक्षस", "दैत्य", "सुंद", "उपसुंध", "कत्लेआम", "लहूलुहान", "गर्दन", "अहंकार", "गदाएं"].some(d => word.includes(d))) color = C.demonRed;
            if (["अप्सरा", "तिलोत्तमा", "सौंदर्य", "मुस्कान", "रानी", "खूबसूरत"].some(b => word.includes(b))) color = C.magicPink;
            if (["जंगलों", "विंध्याचल", "हवाओं"].some(f => word.includes(f))) color = C.emerald;
          }

          return (
            <span key={idx} style={{
              fontFamily: hindiFont, fontWeight: isCurrent ? 800 : 600, fontSize: "48px", lineHeight: 1.35,
              color: color, transform: isCurrent ? "scale(1.1)" : "scale(1)", transition: "all 0.1s ease-out",
              textShadow: isCurrent ? `0 0 20px ${color}` : "0 2px 5px rgba(0,0,0,0.8)"
            }}>
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- Scene Generator ---------- */
const SceneLayout = ({ BgComponent, chakraColor, icon: Icon, iconColor, title, subTitle }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", paddingBottom: "100px" }}>
      <BgComponent />
      {chakraColor && <Chakra color={chakraColor} />}
      
      <FloatIn delay={5} y={80}>
        <div style={{
          width: 200, height: 200, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          background: `radial-gradient(circle, ${iconColor}33, transparent)`, border: `2px solid ${iconColor}66`,
          boxShadow: `0 0 60px ${iconColor}44`, transform: `translateY(${Math.sin(frame/15)*15}px)`
        }}>
          <Icon size={100} color={iconColor} style={{ filter: `drop-shadow(0 0 15px ${iconColor})` }} />
        </div>
      </FloatIn>
      
      <FloatIn delay={15}>
        <span style={{ display: "block", fontFamily: hindiFont, fontWeight: 800, fontSize: "90px", color: C.pureWhite, textShadow: `0 0 40px ${iconColor}`, marginTop: 60, textAlign: "center", lineHeight: 1.1 }}>
          {title}
        </span>
      </FloatIn>
      
      <FloatIn delay={22}>
        <span style={{ display: "block", fontFamily: hindiFont, fontWeight: 600, fontSize: "44px", color: iconColor, marginTop: 20, textAlign: "center" }}>
          {subTitle}
        </span>
      </FloatIn>
    </AbsoluteFill>
  );
};

/* ---------- Specific Themed Scenes ---------- */
const Scene1_Intro = () => <SceneLayout BgComponent={DivineBg} chakraColor={C.divineGold} icon={Eye} iconColor={C.divineGold} title="दिव्य अप्सरा" subTitle="इंद्र और महादेव भी निशब्द" />;
const Scene2_Demons = () => <SceneLayout BgComponent={DemonBg} chakraColor={C.demonRed} icon={Flame} iconColor={C.demonRed} title="सुंद और उपसुंध" subTitle="महाशक्तिशाली दैत्य भाई" />;
const Scene3_Boon = () => <SceneLayout BgComponent={DemonBg} chakraColor={C.divineGold} icon={Crown} iconColor={C.divineGold} title="अमरता का वरदान" subTitle="तीनों लोक श्मशान बन गए" />;
const Scene4_Creation = () => <SceneLayout BgComponent={MagicBg} chakraColor={C.magicPink} icon={Sparkles} iconColor={C.magicPink} title="तिलोत्तमा की रचना" subTitle="ब्रह्मांड का सबसे घातक अस्त्र" />;
const Scene5_Forest = () => <SceneLayout BgComponent={ForestBg} chakraColor={C.emerald} icon={Wind} iconColor={C.emerald} title="विंध्याचल के जंगल" subTitle="हवाओं का रुख बदल गया" />;
const Scene6_War = () => <SceneLayout BgComponent={WarBg} icon={Swords} iconColor={C.demonRed} title="वासना और मौत" subTitle="हजारों साल का प्रेम खाक हो गया" />;
const Scene7_Outro = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", background: C.voidBlack }}>
    <DivineBg />
    <Chakra color={C.shivaBlue} size={900} speed={0.8} />
    <FloatIn delay={10}>
      <Moon size={120} color={C.shivaBlue} style={{ marginBottom: 40, filter: `drop-shadow(0 0 20px ${C.shivaBlue})` }} />
    </FloatIn>
    <FloatIn delay={15}>
      <span style={{ fontFamily: hindiFont, fontWeight: 800, fontSize: "140px", color: C.shivaBlue, textShadow: `0 0 60px ${C.shivaBlue}` }}>
        हर हर महादेव
      </span>
    </FloatIn>
  </AbsoluteFill>
);

/* ---------- Progress Bar ---------- */
const StoryProgressBar = () => {
  const frame = useCurrentFrame();
  const progress = (frame / 2800) * 100;
  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0, height: 12, width: `${progress}%`, background: `linear-gradient(90deg, ${C.demonRed}, ${C.divineGold}, ${C.emerald})`, zIndex: 100 }} />
      <div style={{ position: "absolute", top: 60, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 100 }}>
        <div style={{ fontFamily: hindiFont, fontWeight: 800, fontSize: "28px", color: C.pureWhite, padding: "10px 30px", borderRadius: "50px", background: "rgba(0,0,0,0.5)", border: `1px solid rgba(255,255,255,0.2)`, backdropFilter: "blur(10px)" }}>
          पौराणिक कथा • तिलोत्तमा
        </div>
      </div>
    </>
  );
};

/* ---------- Master Composition ---------- */
export const TilottamaStoryReel = () => (
  <AbsoluteFill style={{ backgroundColor: C.voidBlack }}>
    <StoryProgressBar />

    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={550}>
        <Scene1_Intro />
      </TransitionSeries.Sequence>
      
      {/* Wipe from bottom to show Darkness coming */}
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: T_FRAMES })} />
      <TransitionSeries.Sequence durationInFrames={260}>
        <Scene2_Demons />
      </TransitionSeries.Sequence>
      
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T_FRAMES })} />
      <TransitionSeries.Sequence durationInFrames={490}>
        <Scene3_Boon />
      </TransitionSeries.Sequence>
      
      {/* Magical Fade for Creation */}
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 30 })} />
      <TransitionSeries.Sequence durationInFrames={490}>
        <Scene4_Creation />
      </TransitionSeries.Sequence>
      
      {/* Wipe from left like a forest breeze */}
      <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={linearTiming({ durationInFrames: T_FRAMES })} />
      <TransitionSeries.Sequence durationInFrames={250}>
        <Scene5_Forest />
      </TransitionSeries.Sequence>
      
      {/* Hard cut / fast wipe for War */}
      <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={linearTiming({ durationInFrames: 10 })} />
      <TransitionSeries.Sequence durationInFrames={530}>
        <Scene6_War />
      </TransitionSeries.Sequence>
      
      {/* Serene fade to Mahadev */}
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 30 })} />
      <TransitionSeries.Sequence durationInFrames={260}>
        <Scene7_Outro />
      </TransitionSeries.Sequence>
    </TransitionSeries>

    <StoryCaptions />
  </AbsoluteFill>
);

export const Root = () => (
  <Composition id="TilottamaStoryReel" component={TilottamaStoryReel} durationInFrames={2800} fps={FPS} width={1080} height={1920} />
);
