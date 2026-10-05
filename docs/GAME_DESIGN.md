# Untaggable — Development North Star

Untaggable is a mobile-first, landscape parkour tag game.

## Core modes
- Normal Tag: runner vs tagger.
- Zombie Tag: up to four players; tagged runners join the taggers.
- Offline play: bot-supported gameplay must remain available without a network connection.
- Online multiplayer: architecture should grow toward authoritative multiplayer without sacrificing offline play.

## Stable movement baseline
- Player sprint: 7.4
- Bot sprint: 7.78
- Full-stamina jump power: 6.7
- Exhausted jump power: 5.75
- Full sprint-jump carry target: 7.65
- Exhausted sprint-jump carry target: 6.10
- Stamina regenerates and is the only stat bar.
- Jump remains available at zero stamina.

## Base characters
Finn, Gwen, Trinity, and Owen.

## Arena direction
Rooftops, The Yard, and Training Grounds. Keep Training Grounds geometry clean and non-overlapping while movement is being validated.

## Current milestone
Build the playable game foundation first: movement, tagging, offline bots, modes, clean arenas, then networked multiplayer and visual/character polish.
