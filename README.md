# 🎬 Remotion Reel Export

[Remotion](https://www.remotion.dev) se **Hindi data-reels (1080×1920, 30fps)** banane ka template. Google Colab me render hota hai, laptop par kuch install karne ki zarurat nahi.

Abhi ka reel: **Top 10 sabse zyada aabaadi wale desh** (`PopulationRaceReel`, 60 second).

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/YOUR_USERNAME/YOUR_REPO/blob/main/Remotion_Reel_Export.ipynb)

> `YOUR_USERNAME` / `YOUR_REPO` ko apne GitHub username aur repo ke naam se badal dein (is README me aur notebook ke cell 2 me).

## Repo me kya hai

```
.
├── Remotion_Reel_Export.ipynb   # Colab notebook: setup -> clone -> install -> render
├── package.json                 # exact (pinned) versions
├── package-lock.json            # reproducible install (isey delete mat karna)
├── .gitignore
└── src/
    ├── index.jsx                # registerRoot(Root)
    └── Root.jsx                 # reel ka poora design + data + captions
```

## Colab me chalane ka tareeka

1. Upar wala **Open In Colab** badge dabayein.
2. Cell **1 → 2 → 3** chalayein (sirf pehli baar ya runtime reset ke baad).
   - Cell 2 me `REPO_URL` apna daalein.
   - **Private repo** ho to Colab ke 🔑 **Secrets** me `GITHUB_TOKEN` rakhein (Notebook access ON).
3. Cell **5 (Render)** chalayein. `ONLY_STILL = True` karke pehle ek frame check kar sakte hain.
4. Video apne-aap download ho jaati hai.

**Naya reel banana hai?** Cell **4 (optional)** me naya `Root.jsx` paste karein, phir cell 5 chalayein. Ya repo me `src/Root.jsx` edit karke push karein.

## Laptop par chalana (optional)

```bash
npm ci
npm start        # Remotion Studio (preview)
npm run still    # ek frame -> out/check.png
npm run render   # poori video -> out/reel.mp4
```

Node 18+ chahiye (Node 22 LTS recommended).

## Data badalna

`src/Root.jsx` me `DATA` (desh + aabaadi in millions) aur `CAPTION_CUES` (Hindi captions + frame timing) badalte hain. 30 frames = 1 second.

## Abhi ki known limitations / TODO

- [ ] **Ye asli "race" nahi hai.** Saare bars apni final value tak ek saath grow karte hain, koi overtake nahi hota. Asli race ke liye multi-year data chahiye.
- [ ] **Captions visuals se sync nahi hain.** Jaise "2023 me India ne China ko peeche chhoda" us waqt aata hai jab screen par aisa kuch hota nahi.
- [ ] **Data ek hi source se verify karna baaki hai** (UN WPP 2024 / World Bank). Kuch numbers alag-alag saal ke ho sakte hain.
- [ ] Bars ~frame 850 ke baad lagbhag ruk jaate hain, video ka aakhri hissa kaafi static hai.
- [ ] Caption Reels/Shorts ke UI ke neeche dab sakta hai (safe zone).

## License note

Remotion ka apna license hai. Individuals aur chhoti teams ke liye free hai, lekin badi for-profit companies ko paid license chahiye. Pakka jaanne ke liye Remotion ki official license page dekhein: <https://www.remotion.pro/license>

Is repo ka apna license (MIT wagairah) tumhe public karte waqt chunna hoga. Abhi koi `LICENSE` file nahi hai.
