# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static SNES (Super Nintendo) fan site with a memory-matching card game. No build step or framework — plain HTML, CSS, and vanilla JavaScript served directly from files.

## Commands

- **Lint:** `npm run lint` (ESLint 9 flat config, only `game.js` has JS to lint)
- **Run locally:** Open `index.html` in a browser (no dev server configured)

## Architecture

- **`index.html`** — Landing page linking to the game and a "more" page
- **`more.html`** — Secondary page with SNES links/resources
- **`game.html` / `game.js` / `game.css`** — The matching game (all game logic lives in `game.js`)
- **`style.css`** — Shared styles for `index.html` and `more.html`
- **`aud/`** — Sound effects (click, correct match, win)

### Game (`game.js`) internals

The game is a 5×5 grid (24 clickable tiles + 1 center "Play Again" cell). Twelve SNES box-art images are each duplicated, shuffled, and assigned to tiles at load time via `assignImages()`.

All game state is encapsulated in an IIFE (no globals). Key state variables: `matchElement1/2`, `matchValue1/2`, `matchesFound`, `clickCount`, `isChallengeMode`, `isSoundEnabled`, `allowInteraction`.

Tile clicks use event delegation on `<main>` (no inline onclick). Flow: `DOMContentLoaded` → `assignImages()` → `showSettingsModal()` → user clicks Start → `hideSettingsModal()` → tile clicks go through `handleComparison(divEl)` which manages pair matching, click counting, and win/loss detection. Matched tiles have `.getsImg` removed so they stop responding to clicks.

Challenge mode (on by default) limits the player to 50 guesses. The settings modal lets users toggle sound and challenge mode before starting.

## Conventions

- Color palette sourced from `https://www.color-hex.com/color-palette/22515` (purples/grays)
- Game images are external Wikipedia URLs, not local assets
- ESLint config: `no-console` is off, `no-unused-vars` is warn-only, browser globals (`document`, `window`, `Audio`) declared in config
- No build tools, bundlers, or test framework — edit files directly
