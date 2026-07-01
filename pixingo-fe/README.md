# Pixingo

### AI-Powered Visual Reasoning Game Built on GenLayer

Pixingo is a multiplayer image puzzle game where players analyze four images and submit the word, phrase, or concept that connects them.

Unlike traditional puzzle games(e.g 4 pics, 1 word) that rely on exact answer matching, Pixingo uses GenLayer Intelligent Contracts to evaluate answers semantically. Players are rewarded for understanding the concept behind the images, not for guessing a predefined string.

If one player submits **"Fast"**, another submits **"Quick"**, and a third submits **"Speed"**, Pixingo can recognize all three as valid interpretations of the same concept through AI consensus.

This transforms image puzzles from rigid matching games into subjective reasoning challenges that can be judged fairly and transparently on-chain.

---

# The Problem

Traditional puzzle games rely on deterministic answer validation.

A puzzle creator chooses a single correct answer:

```text
Images:
🏃
🚗
⚡
💨

Correct Answer:
FAST
```

Players who enter:

* Quick
* Rapid
* Speedy
* High Velocity

are often marked wrong despite clearly understanding the puzzle.

This creates a poor player experience and makes it impossible to build trustless puzzle competitions on traditional blockchains.

Blockchains require deterministic truth.

Human reasoning is not deterministic.

Pixingo bridges that gap.

---

# Why GenLayer

Pixingo uses GenLayer's AI consensus mechanism to evaluate meaning rather than exact strings.

When a player submits an answer:

1. Multiple validators independently analyze the images.
2. Validators evaluate the submitted answer.
3. Consensus is formed through the Equivalence Principle.
4. A final score is produced.
5. Results are stored on-chain.

This allows Pixingo to answer a fundamentally subjective question:

> "Does this answer reasonably match the concept represented by these images?"

Traditional blockchains cannot solve this problem.

GenLayer can.

---

# Game Modes

## Solo Mode

Play through four rounds of image puzzles.

Each round contains:

* Four images
* One answer submission
* AI validation

At the end of the game, the player's full run is scored and submitted to the global leaderboard.

---

## Duel Mode (Coming Soon)

Two players compete head-to-head.

Flow:

```text
Player A enters match
Player B enters match
        ↓
4 rounds played
        ↓
Answers submitted
        ↓
GenLayer validates
        ↓
Winner determined
        ↓
Rewards distributed
```

The winner receives the prize pool automatically.

---

## Battle Royale (Coming soon)

Multiple players compete simultaneously across four rounds.

Players are ranked based on:

* Answer quality
* Semantic correctness
* Completion speed

After the final round:

* Results are validated
* Leaderboards are generated
* Rewards are distributed

---

# How It Works

```text
Player Starts Match
         ↓
Round 1
         ↓
Round 2
         ↓
Round 3
         ↓
Round 4
         ↓
Game Data Submitted
         ↓
GenLayer Validators Analyze Answers
         ↓
Consensus Formed
         ↓
Scores Generated
         ↓
Results Stored On-Chain
         ↓
Leaderboard Updated
```

---

# GenLayer Consensus Experience

Pixingo turns blockchain verification into part of the gameplay experience.

Instead of displaying a loading spinner, players watch the validation process unfold:

```text
Submitting match data...
Validators are reviewing answers...
Consensus votes are being collected...
Semantic analysis in progress...
Finalizing score...
Results ready.
```

Players can see AI consensus happening in real time.

---

# Architecture

```text
┌─────────────────────────────┐
│         Frontend            │
│                             │
│  Next.js + TypeScript       │
│  Multiplayer Game Engine    │
│  Round Tracking             │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│      GenLayer Contract      │
│                             │
│  Puzzle Validation          │
│  Semantic Scoring           │
│  Consensus Formation        │
│  Leaderboards               │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│      AI Validators          │
│                             │
│  Image Understanding        │
│  Semantic Reasoning         │
│  Consensus Evaluation       │
└─────────────────────────────┘
```

---

# Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Framer Motion
* TanStack Query

### Blockchain

* GenLayer Intelligent Contracts

### AI Layer

* GenLayer Validator Network
* Equivalence Principle Consensus
* Semantic Image Reasoning

---

# What Makes Pixingo Different

Most blockchain games use AI as an optional enhancement.

Pixingo makes AI consensus the core game mechanic.

Without GenLayer:

* Answers must match exact strings.
* Subjective interpretation is impossible.
* Puzzle creators are forced into deterministic rules.

With GenLayer:

* Players are rewarded for understanding concepts.
* Multiple valid interpretations can coexist.
* Subjective reasoning becomes verifiable on-chain.

Pixingo demonstrates a new category of application:

**AI-native games whose gameplay depends on consensus over meaning rather than deterministic computation.**

---

# Team

Built by <a href="https://x.com/EmmanuelNdema1">Emmanuel Ndema</a>.

Exploring how GenLayer enables entirely new categories of games and applications that traditional blockchains cannot support.
