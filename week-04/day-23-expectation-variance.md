# Day 23: Expectation and Variance

[← Previous: Day 22 — Expectation](../week-04/day-22-expectation.md) | [Course Home](../README.md) | [Next: Day 24 — Large Deviations: Chebyshev and Chernoff Bounds, Wrap Up →](../week-04/day-24-large-deviations.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Bound the chance that at least one event happens
2. Multiply expectations safely and avoid dividing them
3. Compute variance with its definition and its shortcut formula
4. Explain why diversifying independent risks lowers variance

**Difficulty:** 🔴 Advanced
**Estimated Time:** 1.5 hours (1 hour reading + 30 min hands-on)

---

## 📚 Core Concepts

### Will anything go wrong?

A system has n parts, and part i fails (event Eᵢ) with some probability. Engineers ask two questions: how many failures should we expect, and what is the chance of *at least one*?

The first is pure Day 22. Let N count the events that happen, and write N as a sum of indicators. Linearity gives E[N] = Pr[E₁] + … + Pr[Eₙ], with no independence needed. For n coin flips with Pr[heads] = p, that is the familiar E[N] = np.

The second question has two bounds that squeeze the answer:

- **Union bound (upper):** Pr[at least one] ≤ Σ Pr[Eᵢ] = E[N]. It always holds, but it is useless once the sum passes 1.
- **"Murphy's law" (lower):** if the events are *mutually independent*, Pr[at least one] ≥ 1 − e^(−E[N]).

**Why Murphy's law holds (informal proof).** Look at the opposite event: nothing happens. Complements of independent events are independent, so

Pr[no event] = (1 − Pr[E₁]) · (1 − Pr[E₂]) ⋯ (1 − Pr[Eₙ]).

Now use the fact 1 − x ≤ e^(−x), true for every x (the line 1 − x touches the curve e^(−x) at 0 and stays below it). Each factor is at most e^(−Pr[Eᵢ]), and multiplying exponentials adds their exponents:

Pr[no event] ≤ e^(−ΣPr[Eᵢ]) = e^(−E[N]).

Subtract from 1 and the bound appears. ∎

So once you expect several failures, failure is nearly certain. The band OK Go built a Rube Goldberg machine with about 130 parts for a one-take music video. If each part worked 90% of the time, the whole run would succeed with probability 0.9^130, about one in a million. Even at 99% per part, a run fails about 73% of the time. Only at 99.9% per part does the failure chance drop to about 12%.

Independence matters here. With n phones on a Lazy Susan, each person matches with probability 1/n, so E[N] = 1 and Murphy's law would promise at least 63%. The true chance of any match is only 1/n, because the events are identical: everyone matches or nobody does.

### Multiplying works, dividing does not

For **independent** random variables, E[X · Y] = E[X] · E[Y]. It is the product rule for probabilities in disguise. Two independent dice have an expected product of 3.5² = 12.25. But a die times *itself* is not independent: E[D²] = (1 + 4 + 9 + 16 + 25 + 36)/6 = 91/6 ≈ 15.17.

Division is a trap. E[1/X] is usually not 1/E[X]. If X is +1 or −1 with equal chance, E[X] = 0, so 1/E[X] is undefined, yet E[1/X] = 0. Ratios of random variables can even "prove" opposite claims. Suppose processor A takes 1 s on workload 1 and 2 s on workload 2, while B takes 2 s and 1 s. Then E[A/B] = (0.5 + 2)/2 = 1.25, so A looks 25% slower. But E[B/A] = 1.25 too, so B looks 25% slower. Compare E[A] with E[B] (both 1.5 s) instead.

### Variance: how wide is the scatter?

Imagine two archers whose arrows both average to the bullseye. One cluster is tight; the other is sprayed across the target. Their *expectation* is identical, but you would only bet on one. **Variance** measures the spread:

Var[X] = E[(X − E[X])²]

Subtracting the mean centers X at 0. Without squaring, the average deviation is always 0, which is useless. Squaring treats overshoots and undershoots alike, and it punishes big misses more than small ones. Other powers give other summaries (the third power measures lopsidedness, or skew), and absolute value works too, but the square is smooth and easy to do algebra with. It also pairs naturally with the bell-shaped normal distribution, which is fully described by its mean and variance. The **standard deviation** σ = √Var[X] brings the units back. A bet that wins or loses $i with equal chance has mean 0 for every i, but σ = i: the bigger the stake, the bigger the risk.

Useful rules:

- Var[X + c] = Var[X]: shifting does not change spread.
- Var[cX] = c² · Var[X].
- Var[X] = E[X²] − E[X]². For an indicator with Pr = p, this gives p − p² = p(1 − p).
- If X and Y are independent, Var[X + Y] = Var[X] + Var[Y]. So n independent coin flips have Var[heads] = np(1 − p).

These explain **diversification**. Split n dollars equally among k independent stocks, each of which doubles or wipes out its share. Each share contributes (n/k)² to the variance, and there are k shares, so the total is n²/k. Spreading across 100 stocks cuts σ by a factor of 10. Real stocks tend to move together, so the benefit is smaller in practice, but the direction of the effect is the same.

> **Key Insight:** Expectation tells you where outcomes land on average; variance tells you how far they stray. Both get simpler with independence, but only variance requires it.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **Union bound** | Pr[some event] ≤ sum of probabilities | 130 parts at 0.001 each: ≤ 0.13 |
| **Murphy's law** | Independent events: Pr[some event] ≥ 1 − e^(−E[N]) | E[N] = 1 gives ≥ 0.63 |
| **Variance** | E[(X − E[X])²], the average squared deviation | Fair coin indicator: 1/4 |
| **Standard deviation** | √Var[X], spread in original units | ±$100 bet: σ = 100 |
| **Diversification** | Splitting among independent risks; variance falls as 1/k | 100 stocks: σ ÷ 10 |

---

## 💻 Code Examples

### Example 1: Squeezing "at least one failure"

```python
import math

def compare(n, p):
    union = min(1, n * p)
    murphy = 1 - math.exp(-n * p)   # valid only for mutually independent events
    exact = 1 - (1 - p) ** n
    print(f"n={n:4} p={p:<5} {murphy:.6f} <= {exact:.6f} <= {union:.6f}")

compare(1000, 0.001)  # 0.632121 <= 0.632305 <= 1.000000
compare(130, 0.1)     # 0.999998 <= 0.999999 <= 1.000000
compare(130, 0.01)    # 0.727468 <= 0.729246 <= 1.000000
compare(130, 0.001)   # 0.121905 <= 0.121962 <= 0.130000
```

**What's happening:** When E[N] = np is large, Murphy's law pins the answer near 1. When it is small, the union bound is nearly exact.

### Example 2: Diversification by simulation

```python
import random
from statistics import pvariance

def portfolio(n, k):
    # Each stock independently doubles or wipes out its share.
    return sum(n / k * random.choice([1, -1]) for _ in range(k))

random.seed(2)
for k in [1, 4, 16, 100]:
    var = pvariance([portfolio(100, k) for _ in range(20_000)])
    print(k, round(var), 100**2 / k)
# 1 9999 10000.0 | 4 2477 2500.0 | 16 622 625.0 | 100 100 100.0
```

**What's happening:** Simulated variance tracks n²/k: same expected gain, less risk.

> **💡 Try it:** Make every stock use the *same* coin flip. What happens to the variance?

---

## ✏️ Hands-On Exercises

### Exercise 1: Shortcut formula (⏱️ ~15 min, paper)

Compute Var[D] for a fair die two ways: from the definition, and as E[D²] − E[D]².

<details>
<summary>Answer</summary>
91/6 − 49/4 = 35/12 ≈ 2.92 both ways.
</details>

### Exercise 2: Rube Goldberg budget (⏱️ ~15 min, coding)

For a 130-part machine, find the per-part failure probability p that gives a 50% chance the whole run succeeds. Search numerically.

<details>
<summary>Hint</summary>
Solve (1 − p)^130 = 0.5. Expect p ≈ 0.0053.
</details>

### Exercise 3: Lying with ratios (⏱️ ~20 min, paper)

Invent run times for processors A and B on three equally likely workloads so E[A] = E[B] yet E[A/B] and E[B/A] both exceed 1.

<details>
<summary>Hint</summary>
Make each processor twice as fast as the other on some workload.
</details>

---

## 📖 Curated Resources

1. **Lecture 23: Expectation and Variance** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=047B4UrEaNw
2. **Course page: 6.1200J Spring 2024** — MIT OpenCourseWare
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/
3. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/ (the chapters on expectation and deviation from the mean)

---

## 🤔 Reflection Questions

1. **Comprehension:** Why does Murphy's law need independence but the union bound does not?
2. **Application:** 500 servers each fail today with probability 0.001. Bound the chance any fails, both ways.
3. **Connection:** How does Var[indicator] = p(1 − p) relate to Day 22's E[indicator]?
4. **Critical Thinking:** Why does squaring beat absolute value for measuring spread?

---

## ➡️ Next Steps

**Tomorrow:** Large Deviations — bounding how likely extreme outcomes are.

**Before moving on, make sure you can:**
- [ ] Compare the union bound and Murphy's law
- [ ] Compute variance two ways
- [ ] Explain diversification

[← Previous: Day 22 — Expectation](../week-04/day-22-expectation.md) | [Course Home](../README.md) | [Next: Day 24 — Large Deviations: Chebyshev and Chernoff Bounds, Wrap Up →](../week-04/day-24-large-deviations.md)
