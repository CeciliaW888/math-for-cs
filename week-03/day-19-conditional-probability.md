# Day 19: Conditional Probability

[← Previous: Day 18 — Probability](../week-03/day-18-probability.md) | [Course Home](../README.md) | [Next: Day 20 — Independence →](../week-03/day-20-independence.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Apply the sum, complement, inclusion-exclusion and union-bound rules
2. Compute Pr[A | B] from a tree diagram
3. Use Bayes' rule, including its odds form, to reverse an inference
4. Spot conditioning traps such as Simpson's paradox

**Difficulty:** 🟡 Intermediate
**Estimated Time:** 1.5 hours (1 reading/video + 0.5 hands-on)

---

## 📚 Core Concepts

Spam filters, medical tests and recommenders all ask: *now that I've seen this, how should my belief change?* Conditional probability is the maths of updating on evidence, and it trips up even experts.

### Rules you already know from counting

Events are sets of outcomes, so the set rules from the counting unit carry over:

- **Sum rule:** if A and B are disjoint, Pr[A ∪ B] = Pr[A] + Pr[B].
- **Complement rule:** Pr[not A] = 1 − Pr[A].
- **Difference rule:** Pr[A − B] = Pr[A] − Pr[A ∩ B].
- **Inclusion-exclusion:** Pr[A ∪ B] = Pr[A] + Pr[B] − Pr[A ∩ B].
- **Union bound:** Pr[A ∪ B] ≤ Pr[A] + Pr[B], because the subtracted overlap is never negative.
- **Monotonicity:** if A ⊆ B then Pr[A] ≤ Pr[B].

### Zooming in: the definition

The **conditional probability of A given B** is

  Pr[A | B] = Pr[A ∩ B] / Pr[B]  (when Pr[B] > 0).

Think of a spotlight on a dark stage. Once you are told B happened, only the part of the stage inside the spotlight still matters. You then ask what fraction of the lit area is also A. Dividing by Pr[B] rescales the lit region so it has total probability 1 again: B becomes your new sample space.

Rearranging gives the **product rule**: Pr[A ∩ B] = Pr[A | B] · Pr[B]. Chain it for more events: Pr[A ∩ B ∩ C] = Pr[A | B ∩ C] · Pr[B | C] · Pr[C]. This is what you were doing all along in the tree method, because every edge label after the first level is secretly a conditional probability.

**Worked example (the lecture's Pokémon series).** Ash and Gary play until someone wins two battles. The first battle is 50-50. After that, whoever won the previous battle wins the next with probability 2/3. Let A = "Ash wins the series" and B = "Ash wins battle 1". Multiplying along the tree paths:

- WW: ½ · ⅔ = 1/3
- WLW: ½ · ⅓ · ⅓ = 1/18
- WLL: ½ · ⅓ · ⅔ = 1/9

The outcomes in A ∩ B are WW and WLW, so Pr[A ∩ B] = 1/3 + 1/18 = 7/18. Since Pr[B] = ½,

  Pr[A | B] = (7/18) / (1/2) = 7/9.

By symmetry Pr[A] = ½ too, so Pr[B | A] = 7/9 as well. That second question runs backwards in time, and that's fine: conditioning is about information, not cause and effect.

### Bayes' rule: reversing the arrow

Usually Pr[B | A] ≠ Pr[A | B]. Write the product rule both ways, Pr[A | B]·Pr[B] = Pr[A ∩ B] = Pr[B | A]·Pr[A], and divide:

  Pr[B | A] = Pr[A | B] · Pr[B] / Pr[A].

Statisticians call Pr[B] the **prior**, Pr[A | B] the **likelihood**, and Pr[B | A] the **posterior**. The handy **odds form** compares two hypotheses and cancels the awkward Pr[A]:

  Pr[B | A] / Pr[C | A] = (Pr[A | B] · Pr[B]) / (Pr[A | C] · Pr[C]).

*Coins.* You pick a fair coin or a two-headed coin at random, flip it, and see heads. Odds(fair : trick) = (½ · ½) / (1 · ½) = 1/2, so Pr[fair | heads] = 1/3.

*Testing.* Suppose 10% of people are sick, the false-positive rate is 30% and the false-negative rate is 10%. Odds(sick : healthy | +) = (0.9 · 0.1) / (0.3 · 0.9) = 1/3, so Pr[sick | +] = **1/4**. The test is decent, but the prior heavily favours healthy, and the many healthy people produce more false alarms than the few sick people produce true ones.

> **Key Insight:** Never judge evidence without the prior. Bayes' rule says posterior ∝ likelihood × prior, and ignoring the prior is the most common probability mistake in the real world.

### Traps: Simpson's paradox and forgotten evidence

**Simpson's paradox.** Suppose a two-department university has 100 male and 100 female applicants. CS gets 99 women and 1 man and admits one woman. EE gets 1 woman and 99 men and admits that woman and 98 men. Each department admits women at a higher rate, yet overall 98 men are admitted and only 2 women. The overall rate is a weighted average, and the two groups chose departments with very different weights.

**Forgotten evidence.** A baker accuses a known jelly-tart thief of stealing a cake. Jelly-tart thieves are 10× likelier to steal cakes (1 in 2,500 versus 1 in 25,000), but the defence argues that 1 in 2,500 is tiny. Both sides forget that a cake *was* stolen (event X). The relevant number is Pr[C | J ∩ X], which can be large. Lawyers made this kind of mistake in the O.J. Simpson trial. When in doubt, write down exactly which events you are conditioning on.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **Conditional probability** | Pr[A ∩ B] / Pr[B] | Pr[Ash wins \| won game 1] = 7/9 |
| **Product rule** | Pr[A ∩ B] = Pr[A \| B] · Pr[B] | Multiplying along tree edges |
| **Bayes' rule** | Pr[B \| A] = Pr[A \| B] Pr[B] / Pr[A] | Test accuracy → Pr[sick \| +] |
| **Prior / posterior** | Belief before / after the evidence | 0.1 before, 0.25 after |
| **Likelihood** | Chance of the evidence if B holds | Pr[+ \| sick] = 0.9 |
| **Simpson's paradox** | A trend in every group reverses when the groups are combined | Admissions by department |

---

## 💻 Code Examples

### Example 1: Conditioning by enumerating a tree

```python
# best_of_three.py
from fractions import Fraction as F

def outcomes(history="", prob=F(1)):
    # The series stops as soon as someone has two wins
    if history.count("W") == 2 or history.count("L") == 2:
        yield history, prob
        return
    # Battle 1 is 50-50; afterwards the last winner has a 2/3 edge
    p_win = F(1, 2) if not history else F(2, 3) if history[-1] == "W" else F(1, 3)
    yield from outcomes(history + "W", prob * p_win)
    yield from outcomes(history + "L", prob * (1 - p_win))

space = dict(outcomes())
pr = lambda event: sum(p for o, p in space.items() if event(o))
A = lambda o: o.count("W") == 2      # Ash wins the series
B = lambda o: o[0] == "W"            # Ash wins battle 1
AB = lambda o: A(o) and B(o)
print(space)
print("P(A|B) =", pr(AB) / pr(B), " P(B|A) =", pr(AB) / pr(A))
```

Output:
```
{'WW': Fraction(1, 3), 'WLW': Fraction(1, 18), 'WLL': Fraction(1, 9), 'LWW': Fraction(1, 9), 'LWL': Fraction(1, 18), 'LL': Fraction(1, 3)}
P(A|B) = 7/9  P(B|A) = 7/9
```

**What's happening:** The recursion *is* the tree diagram: each leaf multiplies its edge labels, and the last line applies Pr[A ∩ B] / Pr[B] exactly.

### Example 2: Bayes vs. simulation

```python
# covid_test.py
import random
from fractions import Fraction as F

prior, p_pos_sick, p_pos_healthy = F(1, 10), F(9, 10), F(3, 10)
# Odds form: Pr[+] cancels, so we never need to compute it
odds = (p_pos_sick * prior) / (p_pos_healthy * (1 - prior))
print("P(sick | +) =", odds / (1 + odds))

random.seed(1)
positives = sick_positives = 0
for _ in range(100_000):
    sick = random.random() < 0.1
    if random.random() < (0.9 if sick else 0.3):
        # Conditioning = discarding every trial with a negative test
        positives += 1
        sick_positives += sick
print("simulated:", round(sick_positives / positives, 3))
```

Output:
```
P(sick | +) = 1/4
simulated: 0.249
```

**What's happening:** The simulation makes "zooming into B" literal: keep only the positive tests, then count the sick.

> **💡 Try it:** Try a prior of 0.5 (testing only people with symptoms). What changes?

---

## ✏️ Hands-On Exercises

### Exercise 1: Trick coin variants (⏱️ ~15 min, pencil and paper)

Redo the coin example, but pick the fair coin with probability 9/10. What is Pr[fair | heads]? What if the trick coin is double-*tails* instead?

<details>
<summary>Answer</summary>
Odds = (½ · 9/10) / (1 · 1/10) = 4.5, so the answer is 4.5/5.5 = 9/11. A double-tails coin can't show heads, so the answer becomes 1.
</details>

### Exercise 2: Build a Simpson's paradox (⏱️ ~20 min, pencil and paper)

Invent numbers for two departments where group X wins in *each* department but loses overall.

<details>
<summary>Hint</summary>
Send most of group X to a very selective department and most of group Y to an easy one.
</details>

### Exercise 3: Two positive tests (⏱️ ~25 min, coding)

Make each person in `covid_test.py` take two independent tests. Estimate Pr[sick | both positive], then check it with the odds form.

<details>
<summary>Answer</summary>
Odds = (0.9² · 0.1) / (0.3² · 0.9) = 1, so the answer is 1/2.
</details>

---

## 📖 Curated Resources

1. **Lecture 19: Conditional Probability** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=wQBSalAFFC4
   - Why: The Pokémon tree and courtroom example, worked live.
2. **Lecture 19 notes (PDF)** — MIT OpenCourseWare
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec19.pdf
   - Why: Every rule from today, stated compactly.
3. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/
   - Why: See the chapter on conditional probability.

*MIT OpenCourseWare content, CC BY-NC-SA 4.0.*

---

## 🤔 Reflection Questions

1. **Comprehension:** Why does dividing by Pr[B] turn B into a full sample space?
2. **Application:** A spam filter flags an email. What prior and likelihoods do you need?
3. **Connection:** Where was the product rule hiding in Day 18's tree method?
4. **Critical Thinking:** Why does "a cake was stolen" change the jelly-tart answer so much?
5. **Personal:** Did the last health statistic you read mention a prior?

---

## ➡️ Next Steps

**Tomorrow:** Independence, when learning B changes nothing about A, and the birthday paradox.

**Before moving on, make sure you can:**
- [ ] Compute Pr[A | B] from a tree
- [ ] Use the odds form of Bayes' rule
- [ ] Explain why Pr[sick | +] = 1/4

[← Previous: Day 18 — Probability](../week-03/day-18-probability.md) | [Course Home](../README.md) | [Next: Day 20 — Independence →](../week-03/day-20-independence.md)
