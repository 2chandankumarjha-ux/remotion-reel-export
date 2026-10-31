# 🎬 Remotion Reel Export

[Remotion](https://www.remotion.dev) se **Hindi data-reels (1080×1920, 30fps)** banane ka template. Google Colab me render hota hai, laptop par kuch install karne ki zarurat nahi.

Abhi ka reel: **Top 10 sabse zyada aabaadi wale desh** (`PopulationRaceReel`, 60 second).

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/2chandankumarjha-ux/remotion-reel-export/blob/main/Remotion_Reel_Export.ipynb)

## Repo me kya hai

```text
.
├── Remotion_Reel_Export.ipynb   # Colab notebook: setup -> clone -> install -> render
├── package.json                 # exact (pinned) versions
├── package-lock.json            # reproducible install (isey delete mat karna)
├── .gitignore
└── src/
    ├── index.jsx                # registerRoot(Root)
    └── Root.jsx                 # reel ka poora design + data + captions
