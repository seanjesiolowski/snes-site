# SNES Matching Game

A Super Nintendo fan site featuring a memory matching card game, built with vanilla HTML, CSS, and JavaScript — no frameworks or build tools.

## Features

- **Memory matching game** — 5×5 grid with 12 pairs of classic SNES box art to match
- **Challenge mode** — limits players to 50 guesses (toggleable)
- **Sound effects** — click, match, and win audio with in-game mute toggle
- **Settings modal** — configure sound and difficulty before starting
- **Responsive layout** — scales from desktop to mobile
- **Accessible** — keyboard navigation, ARIA attributes, focus management

## Play

Open `index.html` in any browser, or [play it live on GitHub Pages](https://seanjesiolowski.github.io/snes-site/).

## Project Structure

```
index.html      Landing page
more.html       Additional SNES resources and links
game.html       Matching game UI
game.js         All game logic (event handling, state, matching)
game.css        Game-specific styles and settings modal
style.css       Shared styles for landing/resource pages
aud/            Sound effects (click, correct match, win)
```

## Lint

```sh
npm run lint
```

## Built With

HTML5, CSS3, vanilla JavaScript, and ESLint for code quality.
