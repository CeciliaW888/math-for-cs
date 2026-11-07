# Day 18: Probability

[← Previous: Day 17 — More Counting Techniques](../week-03/day-17-more-counting-techniques.md) | [Course Home](../README.md) | [Next: Day 19 — Conditional Probability →](../week-03/day-19-conditional-probability.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Define a probability space: outcomes plus a probability function
2. Model a random process with the tree method
3. Solve the Monty Hall problem and explain why "1/2" is wrong
4. Compute probabilities in uniform spaces by counting

**Difficulty:** 🟢 Beginner
**Estimated Time:** 1.5 hours (1 reading + 0.5 hands-on)

---

## 📚 Core Concepts

Probability runs through CS: randomized algorithms like the Miller-Rabin primality test, cryptographic keys, machine learning, load balancing. It is also where intuition fails most often, even for experts. Today's lesson is to replace gut feeling with a mechanical procedure that cannot be fooled.

### The Monty Hall problem, and Step 0

A game show has three doors: one hides a car, two hide goats. You pick a door. The host, who knows where the car is, opens a different door showing a goat and offers to let you switch. Should you? When a columnist answered "yes, switching wins 2/3 of the time" in 1990, she received piles of angry letters, some from mathematicians, insisting it was 1/2.

Before any math, **Step 0: pin down the question.** The puzzle as stated is ambiguous, so we adopt explicit assumptions:

- The car is equally likely to be behind each door.
- The contestant's first pick is equally likely to be any door.
- The host always opens a goat door that the contestant did not pick.
- If the host has two such doors, he picks one at random.

Different assumptions give different answers. A host who only offers a switch when you are already right would make switching a disaster. Assumptions are the axioms, and the conclusion holds only under them.

### Probability spaces and the tree method

A **probability space** has two parts. The **sample space** S is a nonempty, countable set of **outcomes**. The **probability function** Pr assigns each outcome a number in [0, 1], and these numbers sum to 1. An **event** is any subset E ⊆ S, and Pr[E] = Σ Pr[ω] over the outcomes ω ∈ E.

The **tree method** builds all of this systematically:

1. **Find the sample space.** Draw one tree level per random step. Each root-to-leaf path is an outcome.
2. **Assign probabilities.** Label each edge with its probability *given that you reached its parent*. The edges leaving one node sum to 1. An outcome's probability is the product of the edges along its path.
3. **Define the events** you care about as sets of leaves.
4. **Compute** by adding the leaf probabilities in each event.

Here is the analogy. Picture one litre of water poured in at the root of a river delta. At each fork it splits in the labelled proportions. However many channels there are, the total water is still one litre. A leaf's probability is the water that reaches it, which is why you *multiply* along a path.

### Worked derivation: switching wins 2/3

**Step 1.** The levels are: host hides the car (3 branches), contestant picks (3 branches), host opens a goat door (1 or 2 branches). That gives 12 leaves, which we write as triples (car, pick, opened).

**Step 2.** The first two levels have edges of 1/3. If pick = car, the host has two choices, each 1/2, so each leaf like (P, P, G) gets 1/3 · 1/3 · 1/2 = 1/18. If pick ≠ car, the host is forced (probability 1), so each leaf like (P, G, S) gets 1/3 · 1/3 · 1 = 1/9.

**Step 3.** "Switching wins" is the event pick ≠ car. That is the 6 leaves with probability 1/9 each.

**Step 4.** Pr[switch wins] = 6 · 1/9 = 2/3. The losing event is the complement (written with an overbar): the other 6 leaves, each 1/18, adding to 1/3. Since all leaf probabilities sum to 1, you could also get it as 1 − 2/3. ∎

Notice what the tree never needed: a clever argument. Each step was arithmetic on fractions you could check by hand.

The trap is seeing "6 winning leaves out of 12" and concluding 1/2. Leaves are not automatically equally likely. Here they are not.

### Uniform spaces and strange dice

A space is **uniform** when every outcome has the same probability. Then Pr[E] = |E| / |S|, and probability becomes pure counting, so Days 16-17 pay off.

Take three dice: red has faces 2, 6, 7; green 1, 5, 9; blue 3, 4, 8 (each number twice). Two dice give 9 equally likely pairs. Red beats green in 5 of them, green beats blue in 5, and blue beats red in 5. Every die loses to another with probability 5/9. "Beats" is **not transitive**, so whoever chooses second can always pick a better die.

Stranger still, roll each die *twice* and add. With 81 equally likely outcomes, red now beats green only 37 times, ties 2 times, and loses 42. The direction of every edge in the cycle flips. No intuition predicts that, but the tree (or a short program) settles it.

> **Key Insight:** Don't trust your gut with probability. Fix the assumptions, build the tree, multiply along paths, and add over the event.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **Sample space** | The set of all possible outcomes | 12 Monty Hall leaves |
| **Outcome** | One complete result of the random process | (car P, pick G, opens S) |
| **Probability function** | Pr: S → [0, 1], summing to 1 | Pr[(P,P,G)] = 1/18 |
| **Event** | A subset of the sample space | "pick ≠ car" |
| **Tree method** | Outcomes → edge probabilities → events → compute | Monty Hall |
| **Uniform space** | All outcomes equally likely, so Pr[E] = \|E\|/\|S\| | Two dice, 9 pairs |

---

## 💻 Code Examples

### Example 1: Monty Hall, exactly and by simulation

```python
from fractions import Fraction
import random

doors = "PGS"
exact = Fraction(0)
for car in doors:
    for pick in doors:
        options = [d for d in doors if d not in (car, pick)]
        for opened in options:
            # Leaf probability = product of edge probabilities on its path
            if car != pick:
                exact += Fraction(1, 3) * Fraction(1, 3) * Fraction(1, len(options))
print("exact:", exact)

wins = 0
for _ in range(100_000):
    car, pick = random.choice(doors), random.choice(doors)
    opened = random.choice([d for d in doors if d not in (car, pick)])
    # Switching takes the one door that is neither picked nor opened
    wins += next(d for d in doors if d not in (pick, opened)) == car
print("simulated:", wins / 100_000)
```

**What's happening:** The loops walk the tree and print `exact: 2/3`. The simulation plays the real game and lands near 0.667.

### Example 2: Non-transitive dice

```python
from itertools import product

dice = {"red": [2, 6, 7], "green": [1, 5, 9], "blue": [3, 4, 8]}

def duel(a, b, rolls=1):
    # Uniform space: every combination of faces is equally likely, so just count
    sa = [sum(r) for r in product(dice[a], repeat=rolls)]
    sb = [sum(r) for r in product(dice[b], repeat=rolls)]
    pairs = [(x, y) for x in sa for y in sb]
    return f"{sum(x > y for x, y in pairs)}/{len(pairs)} win, {sum(x == y for x, y in pairs)} ties"

for a, b in [("red", "green"), ("green", "blue"), ("blue", "red")]:
    print(f"{a} vs {b}: 1 roll {duel(a, b)} | 2 rolls {duel(a, b, 2)}")
```

**What's happening:** Each die beats the next 5/9 of the time with one roll. With two rolls the printout shows 37/81 (red vs green, green vs blue) and 33/81 (blue vs red): every matchup flips.

---

## ✏️ Hands-On Exercises

### Exercise 1: A rude host (⏱️ ~20 min, pencil and paper)

Change Step 0: the host offers a switch *only* when your first pick is the car. If he offers, should you switch?

<details>
<summary>Answer</summary>
No: an offer means you already hold the car, so switching always loses.
</details>

### Exercise 2: Two dice sums (⏱️ ~15 min, pencil and paper)

Roll two ordinary dice. Describe the uniform sample space and find Pr[sum = 7] and Pr[sum = 8].

<details>
<summary>Answer</summary>
36 ordered pairs. Sum 7: 6 pairs, so 1/6. Sum 8: 5 pairs, so 5/36.
</details>

### Exercise 3: Four doors (⏱️ ~25 min, coding)

Adapt Example 1 to 4 doors: the host opens one goat door you did not pick, and you switch to a random other closed door. Compute the exact answer with `Fraction`.

<details>
<summary>Answer</summary>
3/8: your first pick must be wrong (3/4), then you pick the car from 2 doors (1/2).
</details>

---

## 📖 Curated Resources

1. **Lecture 18: Probability** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=Hjvy1w4ocQU
   - Why: Includes a live Monty Hall game.
2. **Lecture 18 notes (PDF)** — MIT OpenCourseWare
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec18.pdf
   - Why: Full tree diagrams for both examples.
3. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/
   - Why: The chapter on probability spaces covers the four-step method.

*MIT OpenCourseWare materials are licensed CC BY-NC-SA 4.0.*

---

## 🤔 Reflection Questions

1. **Comprehension:** Why multiply along a path?
2. **Application:** Which Monty Hall assumption matters most?
3. **Connection:** How do uniform spaces reuse Days 16-17?
4. **Critical Thinking:** How can dice beat each other in a cycle?
5. **Personal:** When has your intuition about chance misled you?

---

## ➡️ Next Steps

**Tomorrow:** Conditional Probability: updating probabilities when you learn something new.

**Before moving on, make sure you can:**
- [ ] Draw a tree and list outcomes
- [ ] Multiply edges to get leaf probabilities
- [ ] Explain Monty Hall's 2/3

[← Previous: Day 17 — More Counting Techniques](../week-03/day-17-more-counting-techniques.md) | [Course Home](../README.md) | [Next: Day 19 — Conditional Probability →](../week-03/day-19-conditional-probability.md)
