# Day 21: Random Variables

[← Previous: Day 20 — Independence](../week-03/day-20-independence.md) | [Course Home](../README.md) | [Next: Day 22 — Expectation →](../week-04/day-22-expectation.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Describe a random variable as a function, and link events to indicators
2. Test two random variables for independence
3. Compute PMFs and CDFs for Bernoulli, uniform and binomial distributions
4. Analyse a simple randomized strategy that beats 50-50

**Difficulty:** 🟡 Intermediate
**Estimated Time:** 1.5 hours (1 reading/video + 0.5 hands-on)

---

## 📚 Core Concepts

Programs rarely care about the raw outcome of a random process. They care about a *number* computed from it: packets lost, search time, hash collisions. Random variables are how we talk about those numbers, and they power the rest of the course.

### A random variable is just a function

The name is famously bad: a **random variable** (RV) is neither random nor a variable. It is a **function R : S → ℝ** that assigns a real number to every outcome in the sample space.

Think of a supermarket barcode scanner. It deterministically reads a price (a number) off whatever basket (outcome) you bring. The randomness lives in *which basket you end up with*, not in the scanner.

Flip three fair, independent coins, so S = {H, T}³. Three RVs:

- **f(ω)** = the number of heads in ω, so f(HTH) = 2
- **g(ω)** = 1 if the first flip is heads, else 0
- **h(ω)** = 1 if all three flips match, else 0

An RV with only the values 0 and 1, like g and h, is an **indicator**. Indicators and events are two views of the same thing: event A gives the indicator 𝟙_A (1 on A, 0 elsewhere), and any RV f defines events like [f = x] = {ω : f(ω) = x}, [f ≥ x] or [f ∈ T]. So the last two days' tools all apply. For example, Pr[f = 2 | h = 1] = 0, because three matching coins can't contain exactly two heads.

### Independence of random variables

RVs R₁ and R₂ are **independent** if for *all* values x and y,

  Pr[R₁ = x and R₂ = y] = Pr[R₁ = x] · Pr[R₂ = y].

The "for all" is new: every pair of events the RVs generate must be independent.

- f and g are **dependent**. If g = 0, then f can't be 3.
- f and h are **dependent**, because h is a function of f (h = 1 exactly when f is 0 or 3).
- g and h are **independent**. Whatever the first coin shows, the other two match it with probability ¼, and that is also Pr[h = 1]. For instance, Pr[g = 1, h = 1] = Pr[HHH] = 1/8 = ½ · ¼.

### Distributions: forgetting the sample space

Often we only care how likely each value is, which is the **distribution**:

- **PMF** (probability mass function): PMF_R(x) = Pr[R = x]. (The textbook says PDF, which is the same thing for discrete RVs.)
- **CDF** (cumulative distribution function): CDF_R(x) = Pr[R ≤ x], a running total of the PMF.

The common shapes:

- **Bernoulli(p):** an indicator with Pr[1] = p, Pr[0] = 1 − p.
- **Uniform on {1, …, n}:** PMF = 1/n each, so the CDF climbs 1/n per integer.
- **Binomial(n, p):** the number of heads in n mutually independent coins that each show heads with probability p (or failed parts in a machine).

**Deriving the binomial PMF.** A specific sequence with exactly k heads has probability p^k (1 − p)^(n−k). That follows from the product rule, using mutual independence. There are C(n, k) such sequences and they are disjoint, so

  Pr[R = k] = C(n, k) · p^k · (1 − p)^(n−k).

The CDF Σ_{i ≤ k} Pr[R = i] is awkward, so we approximate. Applying Stirling's formula with α = k/n gives

  Pr[R = αn] ≈ 2^(n·(α log₂(p/α) + (1−α) log₂((1−p)/(1−α)))) / √(2π α(1−α) n).

The exponent is 0 at α = p and negative elsewhere, so the PMF peaks at α = p and shrinks *exponentially* away from it. For 100 fair flips, Pr[50 heads] ≈ 0.08, while Pr[25 heads] ≈ 1.9 × 10⁻⁷. And Pr[at most 24 heads] is even *smaller* than Pr[exactly 25]. Far out in the tail, each step down loses about two-thirds of the probability, so the whole tail below 25 adds up to less than the single value at 25.

> **Key Insight:** A random variable is a deterministic function on a random outcome. Once you see it that way, events, indicators, independence and distributions all follow from rules you already know.

### A randomized algorithm: the candy boxes

I put two *different* numbers of candies (0 to 10) into two boxes. You open one at random, look, then keep it or switch. You win if you end up with the box that has more. Can you beat ½ without knowing anything about how I chose?

Yes. **Pick a random threshold t ∈ {1, …, 10}, then keep the box if it has at least t candies and switch otherwise.** At least one t lies in (smaller, larger]. With such a t you win for certain. A t that is too low makes you always keep, and one too high makes you always switch, so you win with probability ½. By the law of total probability,

  Pr[win] ≥ 1·(1/10) + ½·(9/10) = 0.55.

Randomness beat every deterministic strategy, which is the seed of randomized algorithms.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **Random variable** | A function from outcomes to real numbers | f = the number of heads |
| **Indicator** | An RV that takes only the values 0 and 1 | 𝟙[first flip is H] |
| **Independent RVs** | Pr[R₁ = x, R₂ = y] = Pr[R₁ = x]·Pr[R₂ = y] for all x, y | g and h above |
| **PMF** | x ↦ Pr[R = x] | 1/8, 3/8, 3/8, 1/8 |
| **CDF** | x ↦ Pr[R ≤ x] | Staircase for a die |
| **Binomial(n, p)** | Number of heads in n independent p-coins | 100 fair flips |

---

## 💻 Code Examples

### Example 1: RVs are functions, and independence is checked for every value

```python
# coin_rvs.py
from itertools import product
from fractions import Fraction as F
from collections import Counter

space = list(product("HT", repeat=3))          # 8 equally likely outcomes
f = lambda w: w.count("H")                      # number of heads
g = lambda w: 1 if w[0] == "H" else 0           # indicator: first flip is heads
h = lambda w: 1 if len(set(w)) == 1 else 0      # indicator: all three match

# The PMF forgets which outcome produced each value and keeps only the totals
pmf_f = {x: F(c, 8) for x, c in sorted(Counter(map(f, space)).items())}
print("PMF of f:", {x: str(p) for x, p in pmf_f.items()})

def independent(X, Y):
    # Must check every pair of values, not just one
    for x in set(map(X, space)):
        for y in set(map(Y, space)):
            joint = F(sum(1 for w in space if X(w) == x and Y(w) == y), 8)
            px = F(sum(1 for w in space if X(w) == x), 8)
            py = F(sum(1 for w in space if Y(w) == y), 8)
            if joint != px * py:
                return False
    return True

print("f, g independent?", independent(f, g))
print("f, h independent?", independent(f, h))
print("g, h independent?", independent(g, h))
```

Output:
```
PMF of f: {0: '1/8', 1: '3/8', 2: '3/8', 3: '1/8'}
f, g independent? False
f, h independent? False
g, h independent? True
```

**What's happening:** f, g and h are ordinary functions on outcomes, and the test checks the product rule for every value pair.

### Example 2: Binomial tails, exact vs. Stirling

```python
# binomial_tails.py
from math import comb, sqrt, pi, log2

n, p = 100, 0.5
pmf = lambda k: comb(n, k) * p**k * (1 - p)**(n - k)
cdf = lambda k: sum(pmf(i) for i in range(k + 1))   # CDF is a running sum of the PMF

def estimate(k):
    a = k / n
    # The exponent is 0 only when a == p, so the PMF peaks there and decays exponentially
    exponent = n * (a * log2(p / a) + (1 - a) * log2((1 - p) / (1 - a)))
    return 2**exponent / sqrt(2 * pi * a * (1 - a) * n)

print(f"P(X = 50)  = {pmf(50):.4f}   estimate {estimate(50):.4f}")
print(f"P(X < 50)  = {cdf(49):.4f}")
print(f"P(X = 25)  = {pmf(25):.2e}   estimate {estimate(25):.2e}")
print(f"P(X <= 24) = {cdf(24):.2e}")
```

Output:
```
P(X = 50)  = 0.0796   estimate 0.0798
P(X < 50)  = 0.4602
P(X = 25)  = 1.91e-07   estimate 1.92e-07
P(X <= 24) = 9.05e-08
```

**What's happening:** Stirling is accurate to about 1%. Near the centre, "fewer than 50" (46%) beats "exactly 50" (8%), but deep in the tail "at most 24" loses to "exactly 25".

> **💡 Try it:** Change p to 0.25. Where does the PMF peak now?

---

## ✏️ Hands-On Exercises

### Exercise 1: Check g and h by hand (⏱️ ~15 min, pencil and paper)

Verify the product rule for all four value pairs (g, h) ∈ {0,1}².

<details>
<summary>Answer</summary>
Pr[g=1,h=1] = 1/8 = ½·¼ and Pr[g=1,h=0] = 3/8 = ½·¾. The g = 0 cases match by symmetry.
</details>

### Exercise 2: A die's CDF (⏱️ ~10 min, pencil and paper)

Let R be a fair six-sided die roll. Sketch its PMF and CDF. What is CDF_R(3.5)?

<details>
<summary>Answer</summary>
The PMF is 1/6 at each of 1–6. The CDF is a staircase rising by 1/6 at each integer, so CDF_R(3.5) = 3/6 = ½.
</details>

### Exercise 3: Simulate the candy game (⏱️ ~25 min, coding)

Simulate the threshold strategy for boxes (3, 4), (0, 10) and (6, 8). Explain each win rate.

<details>
<summary>Answer</summary>
You should get about 0.55, 1.00 and 0.60. The number of good thresholds is big − small, so Pr[win] = ½ + (big − small)/20.
</details>

---

## 📖 Curated Resources

1. **Lecture 21: Random Variables** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=WXIOdgaLCNM
   - Why: The candy-box game, played live.
2. **Lecture 21 notes (PDF)** — MIT OpenCourseWare
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec21.pdf
   - Why: Formal definitions and plots.
3. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/
   - Why: See the chapter on random variables and its binomial section.

*MIT OpenCourseWare content, CC BY-NC-SA 4.0.*

---

## 🤔 Reflection Questions

1. **Comprehension:** Why is "random variable" a misleading name?
2. **Application:** Which RV would you define to measure a hash table's collisions?
3. **Connection:** How does the binomial PMF combine counting and independence?
4. **Critical Thinking:** Why can no deterministic candy strategy guarantee more than ½?
5. **Personal:** Where could randomness help one of your programs?

---

## ➡️ Next Steps

**Tomorrow:** Expectation, the average value of a random variable.

**Before moving on, make sure you can:**
- [ ] Define an RV and an indicator on a sample space
- [ ] Check two RVs for independence
- [ ] Write the binomial PMF and explain each factor

[← Previous: Day 20 — Independence](../week-03/day-20-independence.md) | [Course Home](../README.md) | [Next: Day 22 — Expectation →](../week-04/day-22-expectation.md)
