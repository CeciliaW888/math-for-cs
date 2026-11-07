# Day 16: Counting Techniques

[← Previous: Day 15 — Relations and Counting](../week-03/day-15-relations-counting.md) | [Course Home](../README.md) | [Next: Day 17 — More Counting Techniques →](../week-03/day-17-more-counting-techniques.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Apply the generalized product rule when options shrink as you choose
2. Use the division rule (k-to-1 maps) to count arrangements up to symmetry
3. Derive the formula for n choose k
4. Build a counting recipe and check that it builds every object exactly once

**Difficulty:** 🟡 Intermediate
**Estimated Time:** 1.5 hours (1 reading + 0.5 hands-on)

---

## 📚 Core Concepts

Counting sounds like kindergarten, but in CS it is everywhere: how many passwords an attacker must try, how many inputs a test suite misses, how likely a hash collision is. The probability unit starting on Day 18 is mostly counting in disguise. Today gives you three tools, each built on the one before.

### The generalized product rule

If you build something through a sequence of choices, and step i always offers exactly nᵢ options (no matter what you picked earlier), then the total is n₁ · n₂ · … · nₖ.

Take dollar-bill serial numbers: 8 digits. Digits can repeat, so every slot has 10 options: 10⁸ serials (not 8¹⁰; ask "how many options per slot?" and the right one is obvious). Now demand all-distinct digits. The first slot has 10 options, the second 9, then 8, down to 3. *Which* digits remain depends on your earlier picks, but *how many* remain does not. That is the whole point of the "generalized" version. So there are 10 · 9 · … · 3 = 1,814,400 such serials, only about 1.8% of all bills. The same reasoning gives 52! orderings of a deck of cards.

### The division rule

A bijection pairs things one-to-one, so two sets have the same size. Relax that: if every element of A maps to one element of B, and every element of B is hit by *exactly k* elements of A, then |B| = |A| / k. This is a **k-to-1 map**.

Here is the analogy. Imagine photographing a merry-go-round of n painted horses from a fixed spot. Each time it turns one notch, you get a "different" photo, but it is the same carousel. To count carousels, count photos and divide by n. The knights of the round table work exactly this way. Seat n knights by listing a permutation (n! ways) and placing it clockwise. Each circular seating comes from exactly n permutations, one per choice of starting knight. So there are n!/n = (n − 1)! distinct seatings.

### Deriving n choose k

How many 3-digit serials have strictly increasing digits, like 0-1-3 or 2-4-9? Once the digits must increase, only *which* three you picked matters. So we are really counting 3-element subsets of {0,…,9}.

**Derivation.** Map each permutation of the 10 digits to the set of its first three entries. Which permutations land on {3, 6, 7}? Exactly those starting with 3, 6, 7 in some order (3! ways) followed by the other seven digits in some order (7! ways). Nothing about {3, 6, 7} was special, so every subset has 3! · 7! preimages. The map is k-to-1 with k = 3! · 7!, giving 10! / (3! · 7!) = 120. The same argument for any n and k gives

  C(n, k) = n! / (k! · (n − k)!), read "n choose k."

These are called **binomial coefficients**. Choosing 3 of 15 pizza toppings: C(15, 3) = 455. Picking 4 volunteers from 200: C(200, 4). Flipping a coin 100 times and getting exactly 50 heads means choosing which 50 flips are heads: C(100, 50) outcomes. That is only about 8% of all 2¹⁰⁰ sequences. The most likely result is still surprisingly unlikely.

### Counting with recipes

The most flexible technique: describe a step-by-step recipe that builds your objects, count recipe runs with the product rule, and check two things:

1. **Is everything the recipe builds really in the set?**
2. **Is every object in the set built in exactly one way?**

Four-of-a-kind poker hands: choose the rank (13 ways), then any fifth card (48 ways). Every output is a four-of-a-kind, and each such hand determines its rank and its odd card, so the recipe is a bijection: 13 · 48 = 624 hands.

Hands with all four suits: "pick a club, a heart, a spade, a diamond, then any fifth card" gives 13⁴ · 48 runs. But it builds each hand *twice*, because the fifth card can swap with the card sharing its suit. It is a 2-to-1 map, so divide: 13⁴ · 48 / 2 = 685,464. A cleaner recipe picks the doubled suit first, giving 4 · C(13, 2) · 13³, the same number.

Now a recipe that fails. For "at least one pair," try "pick a rank, pick two cards of it, pick any three others." A hand with two pairs is built 2 ways, three aces 3 ways, four aces 6 ways. The map is not k-to-1 for any single k, so no division can rescue it. Usually question 2 is the one that breaks, so test it on awkward example hands.

> **Key Insight:** Count something easy, then fix the relationship: a bijection keeps the count, a k-to-1 map divides it by k, and anything irregular means you need a new recipe.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **Generalized product rule** | Step i always has nᵢ options, so total = n₁ · … · nₖ | 10 · 9 · … · 3 |
| **k-to-1 map** | Every target is hit by exactly k sources | Permutation → round table |
| **Division rule** | k-to-1 map from A to B means \|B\| = \|A\| / k | (n − 1)! seatings |
| **C(n, k)** | Number of k-element subsets of an n-set | C(15, 3) = 455 |
| **Binomial coefficient** | Another name for C(n, k) | C(100, 50) |
| **Counting recipe** | A sequence of choices that builds each object | Rank, then fifth card |

---

## 💻 Code Examples

### Example 1: Checking the division rule by brute force

```python
from itertools import permutations
from math import factorial

def canonical(seating):
    # Rotations are the same table, so one fixed rotation stands for all of them
    return min(seating[i:] + seating[:i] for i in range(len(seating)))

for n in range(3, 7):
    tables = {canonical(p) for p in permutations(range(1, n + 1))}
    print(n, len(tables), factorial(n - 1))
```

**What's happening:** We squash rotations together and count what is left. The output `3 2 2`, `4 6 6`, `5 24 24`, `6 120 120` matches (n − 1)! every time.

### Example 2: Testing poker recipes against reality

```python
from itertools import combinations
from math import comb

deck = [(r, s) for r in range(13) for s in "CDHS"]
four_kind = all_suits = 0
for hand in combinations(deck, 5):  # all 2,598,960 hands, ~15 seconds
    ranks = [c[0] for c in hand]
    if any(ranks.count(r) == 4 for r in set(ranks)):
        four_kind += 1
    if len({c[1] for c in hand}) == 4:
        all_suits += 1

print(four_kind, 13 * 48)
print(all_suits, 13**4 * 48 // 2, 4 * comb(13, 2) * 13**3)
```

**What's happening:** It prints `624 624` and `685464 685464 685464`. Brute force agrees with both recipes, including the 2-to-1 one after dividing by 2.

> **💡 Try it:** Count hands with at least one pair and compare with the broken recipe 13 · C(4, 2) · C(50, 3). Which is bigger?

---

## ✏️ Hands-On Exercises

### Exercise 1: Round table, two symmetries (⏱️ ~15 min, pencil and paper)

Count seatings of 6 people at a round table if rotations count as the same. Then also treat mirror images as the same.

<details>
<summary>Answer</summary>
6!/6 = 120. A seating and its mirror always differ (n ≥ 3), so that map is 2-to-1: 60.
</details>

### Exercise 2: Full house (⏱️ ~20 min, pencil and paper)

A full house is three cards of one rank plus two of another. Write a recipe, check both recipe questions, and count.

<details>
<summary>Answer</summary>
Triple rank, its 3 suits, a different pair rank, its 2 suits: 13 · C(4, 3) · 12 · C(4, 2) = 3,744.
</details>

### Exercise 3: How rare is exactly half? (⏱️ ~25 min, coding)

Print C(2m, m) / 2²ᵐ for 2m = 10, 100, 1000 with `math.comb`. Then simulate 20,000 runs of 100 flips and count exact 50-50 splits.

<details>
<summary>Expected output</summary>
About 0.246, 0.0796, 0.0252, and a simulated rate near 0.08.
</details>

---

## 📖 Curated Resources

1. **Lecture 16: Counting Techniques** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=9X6HtUsxnDc
   - Why: Watch the recipe checks done live.
2. **Lecture 16 notes (PDF)** — MIT OpenCourseWare
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec16.pdf
   - Why: The poker examples written out carefully.
3. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/
   - Why: The chapter on counting covers the division rule and counting with sequences.

*MIT OpenCourseWare materials are licensed CC BY-NC-SA 4.0.*

---

## 🤔 Reflection Questions

1. **Comprehension:** Why does the product rule care only about *how many* options remain?
2. **Application:** How would you count 6-letter passwords with no repeated letters?
3. **Connection:** How does the division rule generalize Day 15's bijection rule?
4. **Critical Thinking:** Why is the four-suits recipe exactly 2-to-1, never 3-to-1?
5. **Personal:** When have you double-counted something in real life?

---

## ➡️ Next Steps

**Tomorrow:** More Counting Techniques: inclusion-exclusion, pigeonholes, and counting one set two ways.

**Before moving on, make sure you can:**
- [ ] Count distinct-digit serials
- [ ] Derive (n − 1)! with a k-to-1 map
- [ ] Explain where n!/(k!(n − k)!) comes from
- [ ] Spot a recipe that builds objects twice

[← Previous: Day 15 — Relations and Counting](../week-03/day-15-relations-counting.md) | [Course Home](../README.md) | [Next: Day 17 — More Counting Techniques →](../week-03/day-17-more-counting-techniques.md)
