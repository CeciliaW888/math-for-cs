# Day 20: Independence

[← Previous: Day 19 — Conditional Probability](../week-03/day-19-conditional-probability.md) | [Course Home](../README.md) | [Next: Day 21 — Random Variables →](../week-03/day-21-random-variables.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Test whether two events are independent using either definition
2. Prove that the conditional and product-rule definitions are equivalent
3. Tell pairwise independence apart from mutual independence
4. Derive the birthday estimate n ≈ 1.18√d and explain the gambler's fallacy

**Difficulty:** 🟡 Intermediate
**Estimated Time:** 1.5 hours (1 reading/video + 0.5 hands-on)

---

## 📚 Core Concepts

Nearly every probability model in CS quietly assumes *independence*: noise bits, hash outputs, the coin flips inside a randomized algorithm. Today we make that word precise, then meet the birthday paradox, which sets how long hashes and signatures must be.

### What independence means

Recall the **law of total probability**: Pr[A] = Pr[E]·Pr[A | E] + Pr[not E]·Pr[A | not E], a proof by cases on any event E.

**A is independent of B** if Pr[A | B] = Pr[A], or if Pr[B] = 0. (Pr[A | B] is undefined when Pr[B] = 0.)

Think of a bookmaker taking bets on A when news arrives that B happened. If the odds on A don't move, the news was irrelevant to A, and that is independence. If they move either way, the events are dependent.

Some quick tests:

- **Monty Hall.** The player picks door 1. Let A = "door 1 has the prize" and B = "door 2 is opened and shown empty". We know switching wins with probability 2/3, so Pr[A | B] = 1/3 = Pr[A]. The events are independent: the reveal says nothing about your door, so the other 2/3 sits on the remaining door.
- **Disjoint events are dependent** (barring probability-0 cases): if B happens, A didn't, so Pr[A | B] = 0.
- **Nested events are dependent:** if B ⊆ A then Pr[A | B] = 1 (barring Pr[A] = 1 or Pr[B] = 0).

### The product rule, and a proof

**Theorem.** A is independent of B if and only if Pr[A ∩ B] = Pr[A]·Pr[B].

*Proof by cases.*
- **Case Pr[B] = 0.** A is independent of B by definition, so we must show Pr[A ∩ B] = 0. Since A ∩ B ⊆ B, monotonicity gives 0 ≤ Pr[A ∩ B] ≤ Pr[B] = 0. Both sides of the product rule are therefore 0.
- **Case Pr[B] ≠ 0.** Independence means Pr[A ∩ B] / Pr[B] = Pr[A]. Because Pr[B] isn't zero, we may multiply both sides by it, which gives Pr[A ∩ B] = Pr[A]·Pr[B]. Each step can be reversed, so the "if and only if" holds. ∎

The product form is symmetric, so we can just say "A and B are independent."

**Coins.** Flip two fair, independent coins. Let A = "coin 1 is heads" and S = "the coins match". S depends on *both* coins, but Pr[S | A] = Pr[coin 2 is heads] = ½ = Pr[S], so they're independent. Now bias the coins to show heads with probabilities p and q. Then Pr[S] = pq + (1−p)(1−q) and Pr[S | A] = q. These are equal exactly when (2q − 1)(p − 1) = 0, so when q = ½ or p = 1. Fairness was doing the work. (Real flips are slightly biased: about 50.8% land the way they started.)

### Pairwise is not enough

Events E₁, …, Eₙ are **pairwise independent** if every pair is independent. They are **mutually independent** if every sub-collection satisfies the product rule: Pr[∩ Eⱼ] = Π Pr[Eⱼ].

Forensics needs the stronger version. If a suspect matches 9 DNA markers, each shared by 10% of people, "one in a billion" is only valid if the matches are *mutually* independent.

**Counterexample.** Flip 3 fair coins. Let A = "coins 1 and 2 match", B = "coins 2 and 3 match", and C = "coins 3 and 1 match". Each event has probability ½. A ∩ B means all three coins match, which is {HHH, TTT}, with probability ¼ = ½·½. So every pair is independent. But given A ∩ B, event C is *certain*: Pr[C | A ∩ B] = 1 ≠ ½. So the events are pairwise but not mutually independent. Hashing theory cares exactly how much independence you get.

### The birthday paradox and the gambler's fallacy

Pigeonhole says d + 1 people *guarantee* a shared birthday among d days, yet 23 people already give better-than-even odds for d = 365. With independent, uniform birthdays,

  Pr[no match] = (d/d)·((d−1)/d)···((d−n+1)/d) = Π (1 − i/d) ≤ Π e^(−i/d) = e^(−n(n−1)/(2d)),

using 1 − x ≤ e^(−x) and the triangular sum 0 + 1 + ⋯ + (n−1). Setting this to ½ gives n(n−1) ≈ 2d·ln 2, so **n ≈ √(2 ln 2)·√d ≈ 1.18√d**. For d = 365 that is about 23. Collisions appear after about √d items, so a hash or signature space must be roughly the *square* of the number of items.

> **Key Insight:** Independence turns "and" into multiplication. That makes probabilities computable, but it must be justified, and pairwise independence doesn't license multiplying three or more events.

**Gambler's fallacy.** After ten heads from a fair coin, the next flip is still heads with probability ½, because the coin has no memory. A *Bayesian* might suspect a two-headed coin instead. The law of total probability gives Pr[H | H¹⁰] = 1·Pr[cheat | H¹⁰] + ½·Pr[fair | H¹⁰], which is more than ½ once cheating is possible.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **Independent events** | Pr[A ∩ B] = Pr[A]·Pr[B] | Two separate fair coins |
| **Law of total probability** | Pr[A] = Σ Pr[Eᵢ]·Pr[A \| Eᵢ] over disjoint cases | Splitting on "fair" vs "cheat" |
| **Pairwise independent** | Every pair of events is independent | The three "coins match" events |
| **Mutually independent** | Every sub-collection obeys the product rule | 9 DNA markers → 10⁻⁹ |
| **Birthday paradox** | Collisions become likely after about √d random picks | 23 people, 365 days |
| **Gambler's fallacy** | Believing independent trials "balance out" | "Tails is due!" |

---

## 💻 Code Examples

### Example 1: Pairwise but not mutual

```python
# three_coins.py
from itertools import product, combinations
from fractions import Fraction as F

space = list(product("HT", repeat=3))
# All 8 outcomes are equally likely, so probability = count / 8
pr = lambda event: F(sum(1 for w in space if event(w)), len(space))

A = lambda w: w[0] == w[1]   # coins 1 and 2 match
B = lambda w: w[1] == w[2]   # coins 2 and 3 match
C = lambda w: w[2] == w[0]   # coins 3 and 1 match
events = {"A": A, "B": B, "C": C}

for (n1, e1), (n2, e2) in combinations(events.items(), 2):
    joint = pr(lambda w: e1(w) and e2(w))
    print(f"P({n1} and {n2}) = {joint},  P({n1})P({n2}) = {pr(e1) * pr(e2)}")

# Mutual independence also needs the three-way product rule
joint3 = pr(lambda w: A(w) and B(w) and C(w))
print("P(A and B and C) =", joint3, " but P(A)P(B)P(C) =", pr(A) * pr(B) * pr(C))
```

Output:
```
P(A and B) = 1/4,  P(A)P(B) = 1/4
P(A and C) = 1/4,  P(A)P(C) = 1/4
P(B and C) = 1/4,  P(B)P(C) = 1/4
P(A and B and C) = 1/4  but P(A)P(B)P(C) = 1/8
```

**What's happening:** Every pair passes the product rule, but the three-way check fails, because any two matches force the third.

### Example 2: Birthday odds, exact vs. estimate

```python
# birthdays.py
import math

def p_no_match(n, d=365):
    p = 1.0
    for i in range(n):
        p *= (d - i) / d     # person i must avoid the i birthdays already taken
    return p

for n in (10, 23, 30, 60, 100):
    exact = 1 - p_no_match(n)
    estimate = 1 - math.exp(-n * (n - 1) / (2 * 365))
    print(f"n={n:3d}  exact={exact:.7f}  estimate={estimate:.7f}")
```

Output:
```
n= 10  exact=0.1169482  estimate=0.1159907
n= 23  exact=0.5072972  estimate=0.5000018
n= 30  exact=0.7063162  estimate=0.6963200
n= 60  exact=0.9941227  estimate=0.9921663
n=100  exact=0.9999997  estimate=0.9999987
```

**What's happening:** The estimate always sits slightly *below* the exact value, because 1 − x ≤ e^(−x) overestimates "no match".

> **💡 Try it:** Try `d=24`: how many people give even odds of a shared birth hour?

---

## ✏️ Hands-On Exercises

### Exercise 1: Unfair coins (⏱️ ~15 min, pencil and paper)

With biased coins p and q, show S = "coins match" is independent of B = "coin 2 is heads" exactly when p = ½ or q = 1.

<details>
<summary>Hint</summary>
Pr[S | B] = p. Set pq + (1−p)(1−q) = p and factor it as (2p − 1)(q − 1) = 0.
</details>

### Exercise 2: A suspicious gambler (⏱️ ~15 min, pencil and paper)

Say a two-headed coin is used with prior 1/1000. After 10 heads, find Pr[cheat | H¹⁰] and the chance the 11th flip is heads.

<details>
<summary>Answer</summary>
Pr[cheat | H¹⁰] = 0.001 / (0.001 + 0.999/1024) ≈ 0.506, so Pr[next is H] ≈ 0.506 + ½·0.494 ≈ 0.753.
</details>

### Exercise 3: Hash collisions (⏱️ ~20 min, coding)

Adapt `p_no_match` to find the smallest n giving better-than-even collision odds for random 32-bit hashes (d = 2³²). Compare with 1.18√d.

<details>
<summary>Answer</summary>
n = 77,164, and √(2 ln 2 · 2³²) ≈ 77,163: only tens of thousands of files.
</details>

---

## 📖 Curated Resources

1. **Lecture 20: Independence** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=qYia9FXN7Po
   - Why: A live birthday experiment and the real-coin-bias research.
2. **Lecture 20 notes (PDF)** — MIT OpenCourseWare
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec20.pdf
   - Why: Formal pairwise and mutual definitions.
3. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/
   - Why: See the chapter on independence and its birthday-principle section.

*MIT OpenCourseWare content, CC BY-NC-SA 4.0.*

---

## 🤔 Reflection Questions

1. **Comprehension:** Why are two disjoint events with positive probability never independent?
2. **Application:** When is it wrong for a fraud detector to multiply "unusual" signals?
3. **Connection:** Where does the birthday computation use the generalized product rule?
4. **Critical Thinking:** Why do non-uniform birthdays make matches *more* likely?
5. **Personal:** Where have you seen the gambler's fallacy?

---

## ➡️ Next Steps

**Tomorrow:** Random variables: functions from outcomes to numbers.

**Before moving on, make sure you can:**
- [ ] Check independence with the product rule
- [ ] Give an example that is pairwise but not mutually independent
- [ ] Derive n ≈ 1.18√d for birthday collisions

[← Previous: Day 19 — Conditional Probability](../week-03/day-19-conditional-probability.md) | [Course Home](../README.md) | [Next: Day 21 — Random Variables →](../week-03/day-21-random-variables.md)
