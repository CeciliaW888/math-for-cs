# Day 08: Divisibility

[← Previous: Day 07 — Recurrences](../week-01/day-07-recurrences.md) | [Course Home](../README.md) | [Next: Day 09 — Modular Arithmetic →](../week-02/day-09-modular-arithmetic.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Apply the definition of divisibility, including 0
2. Explain which amounts water jugs can measure
3. Run Euclid's algorithm and explain its speed
4. Write gcd(a, b) as s·a + t·b with the Pulverizer

**Difficulty:** 🟢 Beginner
**Estimated Time:** 1.5 hours (1 reading + 0.5 hands-on)

---

## 📚 Core Concepts

### Divisibility and integer linear combinations

Phone encryption and radio error correction both lean on today's ideas. We start with one definition: **a divides b**, written a | b, when b = k·a for some *integer* k. It uses multiplication, not division, so it still makes sense when a = 0. Consequences: every number divides 0 (take k = 0), so 0 is even; and −n divides n (take k = −1).

The workhorse fact: if d is a **common divisor** of a and b, then d divides every **integer linear combination** (ILC) s·a + t·b with integers s, t. Proof: write a = j·d and b = k·d; then s·a + t·b = (sj + tk)·d.

### The water-jug puzzle

In *Die Hard with a Vengeance*, the heroes must measure exactly 4 gallons with a 5-gallon jug, a 3-gallon jug, and a fountain. Model it as a **state machine** (Day 04): state (x, y) holds each jug's water, starting at (0, 0); moves fill, empty, or pour one jug into the other.

With jugs of 6 and 4, measuring 3 is hopeless: moves only add or subtract amounts you already have, so everything stays even. The general **invariant** is that *every reachable amount is an ILC of a and b.* It holds at (0, 0) = 0·a + 0·b, and each move combines existing ILCs into another ILC. Since 2 divides 6 and 4, it divides every reachable amount. For 5 and 3, the only positive common divisor is 1, and indeed 4 = 2·5 − 2·3.

So the real question is: *when is x an ILC of a and b?* By the end of today: exactly when gcd(a, b) divides x.

### The GCD and Euclid's algorithm

The **greatest common divisor** gcd(a, b) is the largest integer dividing both, with gcd(0, 0) defined as 0 (every integer divides 0, so none is largest). Equivalently, it is the non-negative common divisor that all other common divisors divide. Two facts start an algorithm: gcd(0, b) = |b|, and gcd(a, b) = gcd(a − b, b).

> **Proof that gcd(a, b) = gcd(a − b, b).** Show both pairs have the *same set* of common divisors; then their largest members match. (⊆) If d | a and d | b, then d | a − b, since a − b = 1·a + (−1)·b is an ILC. (⊇) If d | a − b and d | b, then d | a, since a = 1·(a − b) + 1·b. Containment both ways means the sets are equal. ∎

Repeated subtraction is slow: gcd(100, 1) takes 100 steps. But repeated subtraction is just division done badly. The **division theorem** says that for any integer n and positive d there are *unique* integers q (n div d) and r (n rem d) with n = q·d + r and 0 ≤ r < d. Subtracting b as often as possible leaves a rem b, so gcd(a, b) = gcd(b, a rem b).

That is **Euclid's algorithm**: the state machine (x, y) → (y, x rem y), stopping at y = 0 with answer x. The invariant gcd(x, y) = gcd(a, b) gives correctness. For speed, note x rem y < x/2: if y ≤ x/2 the remainder is below y, and otherwise one subtraction removes more than half. So the larger number at least halves every two steps, and the step count is O(log a + log b), proportional to the number of *bits*: for 100-bit numbers, hundreds of steps instead of 2¹⁰⁰.

An analogy: picture planks 21 cm and 9 cm long. A measuring stick that fits each plank a whole number of times is a common divisor; the GCD is the longest such stick. Laying planks end to end, forwards and backwards, marks out exactly the ILCs. Euclid's algorithm saws the short plank's length off the long one until nothing is left.

### Bézout and the Pulverizer

**Bézout's lemma:** gcd(a, b) is itself an ILC of a and b. By strong induction, gcd(b, a rem b) is an ILC of b and a rem b, and a rem b = a − q·b is an ILC of a and b, so the GCD is too. The **Pulverizer** (Aryabhata, about 500 CE; today the extended Euclidean algorithm) tracks, beside each number, the coefficients that build it. For 5 and 3 it reports 1 = −1·5 + 2·3, so 4 = −4·5 + 8·3: fill the 3-gallon jug eight times, pour each into the 5, and empty the 5 whenever it fills. The circle closes: x is an ILC of a and b exactly when gcd(a, b) | x.

> **Key Insight:** Everything you can build from a and b by adding and subtracting is a multiple of gcd(a, b), and Euclid's algorithm finds that GCD, with its recipe, in logarithmically many steps.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **a \| b** | b = k·a for some integer k | 3 \| 12 |
| **ILC** | s·a + t·b with integer s, t | 4 = 2·5 − 2·3 |
| **GCD** | Largest common divisor | gcd(6, 4) = 2 |
| **Division theorem** | n = q·d + r, 0 ≤ r < d, unique | 17 = 3·5 + 2 |
| **Euclid's algorithm** | gcd(a, b) = gcd(b, a rem b) | gcd(21, 9) = 3 |
| **Bézout's lemma** | gcd(a, b) is an ILC of a, b | 1 = −1·5 + 2·3 |

---

## 💻 Code Examples

### Example 1: Subtraction versus division

```python
def gcd_steps(a, b, use_division):
    steps = 0
    while b:
        # Subtracting b keeps the common divisors; one remainder does many subtractions at once.
        a, b = (b, a % b) if use_division else (max(a - b, b), min(a - b, b))
        steps += 1
    return a, steps

for a, b in [(100, 1), (606, 189), (1_000_000, 7)]:
    print((a, b), gcd_steps(a, b, False), gcd_steps(a, b, True))
```

```
(100, 1) (1, 100) (1, 1)
(606, 189) (3, 15) (3, 5)
(1000000, 7) (1, 142864) (1, 2)
```

**What's happening:** Results are (gcd, steps). Subtraction's steps grow with the numbers' *size*, Euclid's with their *digits*.

### Example 2: The Pulverizer solves jug puzzles

```python
def pulverizer(a, b):
    # Each row carries (value, s, t) with value == s*a + t*b, so the GCD arrives with its recipe.
    x, s, t, y, u, v = a, 1, 0, b, 0, 1
    while y:
        q = x // y
        x, s, t, y, u, v = y, u, v, x - q * y, s - q * u, t - q * v
    return x, s, t

for a, b, goal in [(5, 3, 4), (6, 4, 3), (9, 15, 6)]:
    g, s, t = pulverizer(a, b)
    # A goal is buildable exactly when the GCD divides it; then scale the recipe.
    print(goal, "impossible" if goal % g else f"= {s*goal//g}*{a} + {t*goal//g}*{b}")
```

```
4 = -4*5 + 8*3
3 impossible
6 = 4*9 + -2*15
```

**What's happening:** Scaling the Pulverizer's coefficients gives a pouring recipe; line one is the lecture's −4·5 + 8·3.

---

## ✏️ Hands-On Exercises

### Exercise 1: Euclid by hand (⏱️ ~10 min)

Compute gcd(252, 105), writing each step as n = q·d + r.

<details>
<summary>Answer</summary>
252 = 2·105 + 42, 105 = 2·42 + 21, 42 = 2·21 + 0, so 21.
</details>

### Exercise 2: Save Manhattan again (⏱️ ~15 min)

Jugs of 7 and 4: can you measure 6? Find s, t with 7s + 4t = 6.

<details>
<summary>Answer</summary>
Yes: 1 = −1·7 + 2·4, so 6 = −6·7 + 12·4.
</details>

### Exercise 3: Worst case for Euclid (⏱️ ~20 min)

Find the pair 100 ≥ a ≥ b ≥ 1 that makes `gcd_steps(a, b, True)` slowest.

<details>
<summary>Hint</summary>
Consecutive Fibonacci numbers, like 89 and 55 (9 steps).
</details>

---

## 📖 Curated Resources

1. **Lecture 8: Divisibility** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=XW9xERSeenI
2. **Lecture 8 notes** — MIT OpenCourseWare (CC BY-NC-SA 4.0)
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec08.pdf
3. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/ (the chapter on number theory)

---

## 🤔 Reflection Questions

1. **Comprehension:** Why define divisibility with multiplication instead of division?
2. **Application:** Which amounts can jugs of 12 and 18 measure?
3. **Connection:** Which Day 04 tools prove Euclid's algorithm correct?

---

## ➡️ Next Steps

**Tomorrow:** Day 09 — Modular Arithmetic, where the Pulverizer lets us divide.

**Before moving on, make sure you can:**
- [ ] Run Euclid's algorithm and the Pulverizer
- [ ] Explain the jug invariant

[← Previous: Day 07 — Recurrences](../week-01/day-07-recurrences.md) | [Course Home](../README.md) | [Next: Day 09 — Modular Arithmetic →](../week-02/day-09-modular-arithmetic.md)
