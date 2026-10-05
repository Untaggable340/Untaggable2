# Movement Regression Checklist

These values are intentional and should not be casually changed.

| System | Baseline |
|---|---:|
| Player sprint | 7.4 |
| Tagger sprint | 7.78 |
| Full-stamina jump | 6.7 |
| Zero-stamina jump | 5.75 |
| Full sprint-jump carry | 7.65 |
| Exhausted sprint-jump carry | 6.10 |

## Manual checks
1. A player can always jump at zero stamina.
2. Full stamina produces a visibly stronger jump than zero stamina.
3. A tagger gradually gains on a player in a straight sprint.
4. Sprint-jump preserves forward carry while airborne.
5. Running directly into a Training Grounds obstacle blocks the player.
6. Holding Parkour at a low obstacle initiates a vault/climb instead of stopping.
7. Slide gives a small grounded movement boost and does not replace sprint.
8. Bots should route sideways when a direct chase line intersects an obstacle.
9. Normal Tag ends when the player is tagged.
10. Zombie Tag converts runners until no runners remain.
