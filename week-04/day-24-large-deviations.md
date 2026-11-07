# Day 24: Large Deviations: Chebyshev and Chernoff Bounds, Wrap Up

[← Previous: Day 23 — Expectation and Variance](../week-04/day-23-expectation-variance.md) | [Course Home](../README.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Apply Markov's inequality, with shifts and flips
2. Derive Chebyshev from Markov
3. Explain when Chernoff applies
4. Match a bound to what you know

**Difficulty:** 🔴 Advanced
**Estimated Time:** 1.5 hours (1 hour reading + 30 min hands-on)

---

## 📚 Core Concepts

### Markov: averages limit extremes

A load balancer knows the *average* request takes 8 ms. How often can a request take 16 ms or more? Questions like this, about how likely a random variable is to land far from its mean, are about **tail bounds**. They let you promise "this rarely goes badly" without knowing the full distribution.

Think about the average height in a room. If it is 170 cm, the room cannot be half full of 340 cm giants, because they alone would push the average to 170 before anyone else is counted. That is **Markov's inequality**: if R ≥ 0, then for any x > 0,

Pr[R ≥ x] ≤ E[R] / x, or equivalently Pr[R ≥ c · E[R]] ≤ 1/c.

In the lecture's version, a random student's row number has mean 8, so at most half the class can sit in row 16 or beyond, without anyone seeing the room.

**Proof.** Split the expectation by whether R ≥ x:

E[R] = E[R | R ≥ x] · Pr[R ≥ x] + E[R | R < x] · Pr[R < x].

The first conditional expectation is at least x. The second is at least 0, *because R is never negative*. So E[R] ≥ x · Pr[R ≥ x]; divide by x. ∎ In words: large values use up a lot of the average, so there cannot be many of them.

The non-negativity is essential. If R is +1 or −1 with equal chance, E[R] = 0, and Markov would claim Pr[R ≥ 1/2] ≤ 0, which is false.

Two tricks stretch Markov further. Say exam scores R lie between 30 and 100 with mean 75.

- **Shift.** Directly, Pr[R ≥ 90] ≤ 75/90 ≈ 83%. But R − 30 is also non-negative with mean 45, so Pr[R ≥ 90] = Pr[R − 30 ≥ 60] ≤ 45/60 = 75%. A tighter lower bound gives a stronger result. If scores could go as low as −30, you *must* shift by +30 first; applying Markov to a variable that can be negative gives an invalid bound.
- **Flip.** To bound *low* scores, use S = 100 − R ≥ 0, with mean 25: Pr[R ≤ 65] = Pr[S ≥ 35] ≤ 25/35 = 5/7.

Is Markov the best possible? Sometimes. With n phones on a Lazy Susan, the number R of people who get their own phone has E[R] = 1, so Pr[R = n] ≤ 1/n, and the true value is exactly 1/n. With a random shuffle the bound is the same 1/n, but the truth is 1/n!. Markov only knows the mean, so it cannot tell these two apart.

### Chebyshev: variance buys a square

Knowing the variance helps. **Chebyshev's inequality** works for *any* random variable:

Pr[|R − E[R]| ≥ x] ≤ Var[R] / x².

**Derivation.** Let R′ = (R − E[R])². It is non-negative and E[R′] = Var[R]. The event |R − E[R]| ≥ x is the same as R′ ≥ x². Apply Markov to R′. ∎

Back to the exam with variance 25: Pr[R ≤ 65] ≤ Pr[|R − 75| ≥ 10] ≤ 25/100 = 1/4, much better than 5/7. Stated with σ = √Var: Pr[at least kσ from the mean] ≤ 1/k². Two standard deviations: at most 25%. The bound covers both tails at once, so a one-sided question gets it for free. (A normal bell curve gives about 5%, but only because we would then know far more than the variance.)

Variance additivity needs less than you might think: **pairwise** independence is enough. That matters when you compute Var[R] for a sum.

### Chernoff: independence buys an exponential

If R = T₁ + … + Tₙ, with the Tᵢ **mutually independent** and each between 0 and 1, then for c ≥ 1:

Pr[R ≥ c · E[R]] ≤ e^(−β(c) · E[R]), where β(c) = c ln c − c + 1.

The [0, 1] requirement keeps any single piece from dominating the sum. When c is close to 1, β(c) is small, so modest deviations get weaker guarantees.

The proof idea: exponentiate. Apply Markov to c^R instead of R. Independence lets E[c^R] split into a product, one small factor per piece, and n factors compound into a bound that shrinks exponentially as E[R] grows. Chebyshev only looks at pairs of pieces, so it cannot see this compounding.

Compare the three on n fair coin flips, asking for at least 3n/4 heads (E[R] = n/2, Var[R] = n/4):

- Markov: (n/2)/(3n/4) = 2/3, no matter how large n is.
- Chebyshev: (n/4)/(n/4)² = 4/n.
- Chernoff: β(3/2) ≈ 0.108, so about e^(−0.054n).

For 20 coins, Chebyshev's 0.2 actually beats Chernoff's 0.34 (see Example 1): constants matter for small inputs. For large n the exponential wins by a mile. Each extra piece of information (mean, then variance, then full independence) upgrades the bound from constant to polynomial to exponential. This is why randomized algorithms, hashing, and sampling can promise "fails with probability at most 2^(−100)."

> **Key Insight:** A tail bound is only as strong as what you know. The mean gives Markov, the variance gives Chebyshev, and independent bounded pieces give Chernoff's exponential guarantee.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **Tail bound** | Upper limit on the chance of landing far from the mean | Pr[R ≥ 16] ≤ 1/2 |
| **Markov's inequality** | R ≥ 0: Pr[R ≥ x] ≤ E[R]/x | Mean 75: Pr[≥ 90] ≤ 83% |
| **Chebyshev's inequality** | Pr[\|R − E[R]\| ≥ x] ≤ Var[R]/x² | 2σ away: ≤ 1/4 |
| **Chernoff bound** | Independent [0, 1] pieces: exponentially small tail | Coins: ≈ e^(−0.054n) |
| **Tight bound** | A bound some case actually meets | Lazy Susan, Markov |

---

## 💻 Code Examples

### Example 1: Three bounds versus the truth

```python
import math

def exact_tail(n):
    k = math.ceil(3 * n / 4)
    return sum(math.comb(n, h) for h in range(k, n + 1)) / 2**n

beta = 1.5 * math.log(1.5) - 1.5 + 1      # Chernoff constant for c = 3/2

for n in [20, 100, 400]:
    markov = (n / 2) / (3 * n / 4)        # E[R] / threshold
    chebyshev = (n / 4) / (n / 4) ** 2    # Var[R] / distance²
    chernoff = math.exp(-beta * n / 2)    # e^(-beta E[R])
    print(f"{n:3}  {markov:.3f}  {chebyshev:.3f}  {chernoff:.1e}  {exact_tail(n):.1e}")
#  20  0.667  0.200  3.4e-01  2.1e-02
# 100  0.667  0.040  4.5e-03  2.8e-07
# 400  0.667  0.010  4.0e-10  1.3e-24
```

**What's happening:** Columns are Markov, Chebyshev, Chernoff, exact. Markov never improves; Chebyshev shrinks like 1/n; Chernoff exponentially.

### Example 2: When is Markov tight?

```python
from itertools import permutations

n = 5
# Rotating the table by s returns every phone only when s == 0.
rotations = [[(i + s) % n for i in range(n)] for s in range(n)]
shuffles = list(permutations(range(n)))

def all_home(p):
    return all(p[i] == i for i in range(n))

print("Markov bound:", 1 / n)                                       # 0.2
print("Lazy Susan:  ", sum(map(all_home, rotations)) / n)           # 0.2
print("Shuffle:     ", sum(map(all_home, shuffles)) / len(shuffles))  # 0.00833
```

**What's happening:** Same mean, same Markov bound: exact for the Lazy Susan, 24 times too big for the shuffle.

> **💡 Try it:** Compute the variance of each setup. Which one would Chebyshev handle better?

---

## ✏️ Hands-On Exercises

### Exercise 1: Shift or fail (⏱️ ~15 min, paper)

Response times R ≥ 20 ms have mean 50 ms. Bound Pr[R ≥ 100] directly, then after shifting.

<details>
<summary>Answer</summary>
Direct: 50/100 = 1/2. Shifted: Pr[R − 20 ≥ 80] ≤ 30/80 = 3/8.
</details>

### Exercise 2: Chebyshev in practice (⏱️ ~15 min, paper)

Flip 10,000 fair coins. Bound the chance heads is at least 200 away from 5,000.

<details>
<summary>Answer</summary>
Var = 10,000 × 1/4 = 2,500, so the bound is 2,500/200² = 1/16.
</details>

### Exercise 3: Check Chernoff (⏱️ ~25 min, coding)

Simulate 100 fair flips many times to estimate Pr[heads ≥ 60]. Compare with Chernoff (c = 1.2, E[R] = 50).

<details>
<summary>Hint</summary>
β(1.2) ≈ 0.0188, bound ≈ e^(−0.94) ≈ 0.39. Truth ≈ 0.028.
</details>

---

## 📖 Curated Resources

1. **Lecture 24: Large Deviations: Chebyshev and Chernov Bound, Wrap Up** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=7FOFBqw1gMs
2. **Lecture 24 notes** — MIT OpenCourseWare
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec24.pdf
3. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/ (the chapter on deviation from the mean)

---

## 🤔 Reflection Questions

1. **Comprehension:** Why does Markov fail for variables that can be negative?
2. **Application:** Each of a million requests independently costs 0 to 1 ms. Which bound suits the total?
3. **Connection:** Chebyshev is Markov on a squared variable. Where else did you reduce to a solved problem?
4. **Personal:** Which idea from this course will you use first?

---

## ➡️ Next Steps

**You finished the course.** From proofs and induction, through sums, number theory, graphs, and counting, to probability: each unit gave you a tool for reasoning precisely about programs.

**Where to go next:**
- An algorithms course (MIT's follow-on is 6.1210), which uses all of these daily
- Randomized algorithms, built on linearity and Chernoff
- A probability and statistics course

**Before moving on, make sure you can:**
- [ ] Apply Markov with shifts and flips
- [ ] Derive Chebyshev from Markov
- [ ] Say why Chernoff needs independence

[← Previous: Day 23 — Expectation and Variance](../week-04/day-23-expectation-variance.md) | [Course Home](../README.md)
