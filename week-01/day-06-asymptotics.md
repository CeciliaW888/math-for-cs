# Day 06: Asymptotics

[← Previous: Day 05 — Sums](../week-01/day-05-sums.md) | [Course Home](../README.md) | [Next: Day 07 — Recurrences →](../week-01/day-07-recurrences.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Show the harmonic number Hₙ is asymptotically equivalent to ln n
2. Bound n! by turning a product into a sum, and state Stirling's formula
3. Prove f ∈ O(g) from the definition, and decide it with the limit test
4. Tell apart ~, O, Ω, Θ, o and ω
5. Spot why induction "proofs" of big-O claims go wrong

**Difficulty:** 🟡 Intermediate
**Estimated Time:** 1.5 hours (1 hour reading + 30 min hands-on)

---

## 📚 Core Concepts

Is an algorithm that takes n²/2 − n/2 steps better or worse than one taking n log₂ n − n + 1? For a million items you don't want to fuss over the −n/2. Asymptotic notation is the precise way to throw away detail that doesn't matter while knowing exactly what you threw away.

### Leaning blocks and the harmonic numbers

Stack n blocks, one per layer, each sliding out as far as it can without toppling. The best overhang is ½ + ¼ + ⅙ + … + 1/(2n) = ½Hₙ, where Hₙ = 1 + ½ + ⅓ + … + 1/n is the **n-th harmonic number**. There's no closed form, but yesterday's integral method (1/x is decreasing) gives

ln n + 1/n ≤ Hₙ ≤ ln n + 1.

So the overhang grows without limit, just very slowly: an overhang of 10 block-lengths needs Hₙ = 20, which takes hundreds of millions of blocks.

To say "Hₙ is basically ln n" precisely, define **asymptotic equivalence**: f ~ g means f(n)/g(n) → 1 as n → ∞. Divide the bounds by ln n: the left side is 1 + 1/(n ln n) and the right is 1 + 1/ln n. Both tend to 1, so Hₙ/ln n is squeezed to 1, and Hₙ ~ ln n.

### Products become sums

Logs turn products into sums: ln(n!) = ln 1 + ln 2 + … + ln n. Apply the integral method to the increasing function ln x, then exponentiate:

nⁿ/eⁿ⁻¹ ≤ n! ≤ nⁿ⁺¹/eⁿ⁻¹.

These bounds differ by a factor of n, so neither side is ~ n!. The sharper fact, **Stirling's formula**, says n! ~ √(2πn)·(n/e)ⁿ. An even stronger, unproved-here bound says the ratio n!/(√(2πn)(n/e)ⁿ) lies between e^{1/(12n+1)} and e^{1/(12n)}, so it is within 1% of 1 already at n = 10.

### Big O: "at most, up to a constant"

Imagine zooming out on a map. Side streets vanish first, then towns; finally only the shape of the coastline remains. Asymptotic notation is that zoom: lower-order terms vanish, constant factors vanish, small n vanish, and the growth shape remains. Why drop constants? Count swap sort in swaps, then in machine instructions, then in clock cycles, then in seconds on a 2.4 GHz chip: each change of unit multiplies by a different constant, but the answer is always proportional to n².

**Definition.** f ∈ O(g) means ∃C > 0, ∃n₀, ∀n ≥ n₀: f(n) ≤ C·g(n). (We assume functions from ℕ to positive reals.) We don't care what C is; we only need one to exist.

**Worked proof:** n² + 3n + 7 ∈ O(n²). For n ≥ 1, 3n ≤ 3n² and 7 ≤ 7n², so n² + 3n + 7 ≤ 11n². Take C = 11, n₀ = 1. ∎ The lower-order terms just got absorbed into C.

The reverse fails: n² ∉ O(n), because n² ≤ Cn breaks for every n > C, whatever C you pick.

**Limit test.** If lim f/g exists: if it is ∞, f ∉ O(g); if it is finite, f ∈ O(g). If the limit doesn't exist, the test is silent. Examples: n²/(10⁶ n) → ∞, so n² ∉ O(10⁶ n). 1000/n² → 0, so the constant 1000 ∈ O(n²). And 3ⁿ/2ⁿ = 1.5ⁿ → ∞, so 3ⁿ ∉ O(2ⁿ): changing the base is not a constant factor.

### The whole family

| Symbol | Definition | Intuition |
|---|---|---|
| f ~ g | f/g → 1 | equal, ignoring lower-order terms |
| f ∈ O(g) | ∃C, n₀ as above | f ≤ g up to constants |
| f ∈ Ω(g) | g ∈ O(f) | f ≥ g up to constants |
| f ∈ Θ(g) | f ∈ O(g) and g ∈ O(f) | f ≈ g up to constants |
| f ∈ o(g) | f/g → 0 | f is negligible next to g |
| f ∈ ω(g) | f/g → ∞ | f dwarfs g |

Swap sort's S(n) = n²/2 − n/2 is in Θ(n²), and S ~ n²/2, but S is **not** ~ n² (the ratio tends to ½). Θ forgives constants; ~ doesn't. Also 3 + sin n ∈ Θ(1) (it stays between 2 and 4), even though (3 + sin n)/1 has no limit. And if g(n) is 1 for odd n but n² for even n, then neither n ∈ O(g) nor g ∈ O(n). Some implications hold: o implies O, and ~ implies Θ, which implies both O and Ω. "Lower-order term" now has a precise meaning: f + h ~ f exactly when h ∈ o(f). Write f ∈ O(g) or f ≤ O(g), never "f ≥ O(g)", which says nothing; use Ω instead.

**Warning.** "Proof" that 2ⁿ ∈ O(1): base case 2⁰ = 1 ∈ O(1); step 2ⁿ⁺¹ = 2ⁿ + 2ⁿ ∈ O(1) + O(1) = O(1). Every line is fine, but the induction proves that each *single number* 2ⁿ, viewed as a constant function, is O(1). Big O is about the whole function, so you can't induct one n at a time.

> **Key Insight:** Big O compares growth shapes by allowing a constant factor and ignoring small n; the limit of f/g usually settles the question fastest.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **Harmonic number Hₙ** | 1 + ½ + … + 1/n | H₄ = 25/12 |
| **Asymptotic equivalence** | f(n)/g(n) → 1 | Hₙ ~ ln n |
| **Big O** | f ≤ C·g for all n ≥ n₀ | n² + 3n + 7 ∈ O(n²) |
| **Big Θ** | O in both directions | n²/2 − n/2 ∈ Θ(n²) |
| **Little o** | f/g → 0 | n ∈ o(n²) |
| **Stirling's formula** | n! ~ √(2πn)(n/e)ⁿ | 10! = 3,628,800 vs. 3,598,696 |

---

## 💻 Code Examples

### Example 1: Harmonic numbers and the leaning tower

```python
import math

def H(n):
    return sum(1 / k for k in range(1, n + 1))

print(f"{'n':>9} {'ln n + 1/n':>11} {'H(n)':>9} {'ln n + 1':>9} {'H/ln n':>7} {'overhang':>9}")
for n in (10, 100, 10_000, 1_000_000):
    lo, hi = math.log(n) + 1 / n, math.log(n) + 1
    # Overhang with n blocks is H(n)/2 block-lengths: the greedy stack's gaps are 1/2, 1/4, 1/6, ...
    print(f"{n:>9} {lo:>11.4f} {H(n):>9.4f} {hi:>9.4f} {H(n)/math.log(n):>7.3f} {H(n)/2:>9.3f}")

# 10 lengths of overhang needs H(n) = 20; the bounds force 19 <= ln n <= 20.
print(f"blocks needed: between {math.exp(19):,.0f} and {math.exp(20):,.0f}")
```

Output:
```
        n  ln n + 1/n      H(n)  ln n + 1  H/ln n  overhang
       10      2.4026    2.9290    3.3026   1.272     1.464
      100      4.6152    5.1874    5.6052   1.126     2.594
    10000      9.2104    9.7876   10.2103   1.063     4.894
  1000000     13.8155   14.3927   14.8155   1.042     7.196
blocks needed: between 178,482,301 and 485,165,195
```

**What's happening:** H(n) always lands inside the bounds, and H/ln n creeps toward 1, slowly, which is what ~ promises and nothing more.

### Example 2: Ratios decide asymptotic questions

```python
import math

def swaps(n):        # worst-case swap sort: every pair inverted
    return n * (n - 1) // 2

def merges(n):       # merge sort bound quoted in lecture
    return n * math.log2(n) - n + 1

def stirling(n):
    return math.sqrt(2 * math.pi * n) * (n / math.e) ** n

print(f"{'n':>6} {'S/n^2':>8} {'M/S':>10} {'n!/Stirling':>12}")
for n in (10, 50, 100, 150):
    # Ratios, not differences: the limit of f/g is what decides ~, O and o.
    print(f"{n:>6} {swaps(n)/n**2:>8.4f} {merges(n)/swaps(n):>10.5f} "
          f"{math.factorial(n)/stirling(n):>12.6f}")
```

Output:
```
     n    S/n^2        M/S  n!/Stirling
    10   0.4500    0.53821     1.008365
    50   0.4900    0.19036     1.001668
   100   0.4950    0.11422     1.000834
   150   0.4967    0.08370     1.000556
```

**What's happening:** S/n² → ½, so S ∈ Θ(n²) but S is not ~ n². M/S → 0, so merge sort is in o(swap sort). n!/Stirling → 1, which is exactly what ~ means.

---

## ✏️ Hands-On Exercises

### Exercise 1: Find C and n₀ (⏱️ ~10 min)

Prove 5n³ + 100n ∈ O(n³) from the definition.

<details>
<summary>Answer</summary>
For n ≥ 1, 100n ≤ 100n³, so 5n³ + 100n ≤ 105n³. Take C = 105, n₀ = 1. (C = 6 with n₀ = 10 works too.)
</details>

### Exercise 2: Constant factor or not? (⏱️ ~15 min)

Is 2ⁿ⁺¹ ∈ O(2ⁿ)? Is 4ⁿ ∈ O(2ⁿ)? Use the limit test.

<details>
<summary>Answer</summary>
2ⁿ⁺¹/2ⁿ = 2, finite: yes. 4ⁿ/2ⁿ = 2ⁿ → ∞: no.
</details>

### Exercise 3: Where constants stop mattering (⏱️ ~25 min)

Algorithm A takes 100·n·log₂ n steps; B takes n²/2. Write a loop that finds the first n where A is faster. Does it change the Θ comparison?

<details>
<summary>Answer</summary>
n = 2224. The constant 100 delays the crossover but cannot stop it, since n log n ∈ o(n²).
</details>

---

## 📖 Curated Resources

1. **Lecture 6: Asymptotics** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=6dQQAn4L24s
   - Why: Zachary Abel stacks real blocks off a table.
2. **Lecture 6 notes (PDF)** — MIT OpenCourseWare
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec06.pdf
   - Why: Definitions and the limit theorem, written out.
3. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/
   - Why: The chapter on sums and asymptotics proves the block-stacking result.

*Course material from MIT OpenCourseWare, licensed CC BY-NC-SA 4.0.*

---

## 🤔 Reflection Questions

1. **Comprehension:** Why does Θ ignore the ½ in n²/2 while ~ does not?
2. **Application:** Two algorithms are both Θ(n log n). What extra information do you need to choose?
3. **Critical Thinking:** Can f ∈ Θ(g) hold while lim f/g doesn't exist? Give an example.

---

## ➡️ Next Steps

**Tomorrow:** Recurrences — finding the running time of merge sort and other divide-and-conquer algorithms.

**Before moving on, make sure you can:**
- [ ] Prove a big-O claim with explicit C and n₀
- [ ] Use the limit test
- [ ] Explain ~ versus Θ versus o

[← Previous: Day 05 — Sums](../week-01/day-05-sums.md) | [Course Home](../README.md) | [Next: Day 07 — Recurrences →](../week-01/day-07-recurrences.md)
