# Morabaraba Digital Heritage

A production-grade, culturally authentic digital implementation of **Morabaraba**, the ancient strategy game of Southern Africa.

![Morabaraba Banner](https://picsum.photos/seed/morabaraba-banner/1200/400)

## 🌍 Cultural Significance

Morabaraba is a traditional two-player strategy board game played in South Africa, Lesotho, and Botswana. It is a "pastoral" game, where the pieces are referred to as "cows" (dikgomo). The game is deeply rooted in the history of the Sotho, Zulu, and Xhosa people and was famously played at the Kingdom of Mapungubwe.

This digital rendition aims to preserve and celebrate this heritage through:
- **Authentic Aesthetics:** Savanna-inspired color palettes and textures.
- **Storytelling:** Immersive landing page detailing the game's history.
- **Multilingual Support:** English, Zulu, and Sotho (coming soon).

## 🎮 Features

- **Full Game Engine:** Adheres strictly to the MSSA Generally Accepted Rules (GAR).
- **Three Phases:** Placing, Moving, and Flying.
- **Smart AI:** Configurable Minimax engine with 4 difficulty levels (Easy to Expert).
- **Local Multiplayer:** Hot-seat mode for playing with friends.
- **Interactive Tutorial:** Learn the rules through a guided walkthrough.
- **PWA Support:** Installable on mobile and desktop with offline play capabilities.
- **Immersive Sound:** Ambient savanna background and tactile sound effects.
- **Responsive Design:** Optimized for touch-first mobile experiences and desktop play.

## 🚀 Deployment

This application is built with **Next.js 15** and is ready for deployment on **Vercel**.

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## 🛠️ Environment Variables

The following environment variables are supported:

- `NEXT_PUBLIC_GEMINI_API_KEY`: (Optional) For future AI enhancements.
- `NEXT_PUBLIC_APP_URL`: The base URL of the deployed application.

## 📜 Rules Summary

1. **Placing Phase:** Players take turns placing 12 cows each on the 24 intersection points.
2. **Moving Phase:** Once all cows are placed, players move cows to adjacent empty points.
3. **Flying Phase:** When a player has only 3 cows left, they can "fly" to any empty point on the board.
4. **Mills:** Forming a line of 3 cows (a mill) allows you to "shoot" (remove) an opponent's cow.
5. **Winning:** A player wins if the opponent is reduced to 2 cows or has no legal moves.

## 🤝 Ubuntu

Built with the spirit of **Ubuntu** ("I am because we are"). This project is an open tribute to African strategic brilliance.

---
*Developed for the Google AI Studio Build Challenge.*
