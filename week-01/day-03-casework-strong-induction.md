# Day 03: Casework and Strong Induction

[← Previous: Day 02 — Contradiction and Induction](../week-01/day-02-contradiction-induction.md) | [Course Home](../README.md) | [Next: Day 04 — State Machines →](../week-01/day-04-state-machines.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Write a proof by cases with exhaustive cases
2. Prove that 6 people include 3 mutual friends or 3 mutual strangers
3. State strong induction and explain why it is valid
4. Apply strong induction to split-into-pieces problems

**Difficulty:** 🟢 Beginner
**Estimated Time:** 1.5 hours (1 hour reading or video + 0.5 hours hands-on)

---

## 📚 Core Concepts

Merge sort and quicksort split a problem into smaller pieces of *unpredictable* size. Case analysis and strong induction are the tools for proving such algorithms correct.

### Proof by cases

For any proposition C, "C OR NOT C" is a **tautology**, meaning it is always true. So to prove P, it's enough to prove C → P *and* NOT C → P. In each case you get a free extra assumption, which often makes the job easier. The skill is choosing a good C.

Example: (A → B) OR (B → C) is always true. Split on B, which appears in both halves. If B is true, then A → B is true (anything → true is true). If B is false, then B → C is true (false → anything is true). Either way, the OR holds. ∎

With more cases C₁, …, Cₖ, you have two jobs: prove P in each case, *and* show the cases are **exhaustive** (C₁ OR ⋯ OR Cₖ is always true). Missing cases are a classic failure. Kempe's 1879 "proof" of the Four Color Theorem (any map can be colored with 4 colors so that neighbors differ) had a gap that went unnoticed for 11 years. The 1976 proof needed a computer to check over a thousand cases. In 2005, every step was machine-checked in the proof assistant Coq.

### Friends and strangers

**Theorem.** Among any 6 people, where every pair is either friends or strangers (exactly one), there are 3 mutual friends or 3 mutual strangers.

**Proof by nested cases.** Pick any person P. P has 5 relationships.
- **Case 1: P has at least 3 friends,** say Q, R, S.
  - *1A:* Some pair among Q, R, S are friends. That pair plus P makes 3 mutual friends.
  - *1B:* No pair among them are friends. Then Q, R, S are 3 mutual strangers.
- **Case 2: P has at most 2 friends.** Then P has at least 5 − 2 = 3 strangers. This is Case 1 with "friends" and "strangers" swapped, so the same argument works.

The cases are exhaustive, since a count of friends is either at least 3 or at most 2. ∎

This is the start of **Ramsey theory**. Six is the minimum (5 people can avoid it, as Example 1 shows). For 4 and 4 you need 18 people. For 5 and 5, the exact number is still unknown.

### Strong induction

Ordinary induction lets you use only P(n − 1) when proving P(n). Rewrite the step as P(n − 1) → P(n) for n ≥ 1. Then it reads like a recursive function: to solve size n, call size n − 1.

**Strong induction** lets you assume *every* earlier case:

> If, for every n, [P(0) AND P(1) AND ⋯ AND P(n − 1)] → P(n), then P(n) holds for all n ∈ ℕ.

Think of **cooking from a well-stocked fridge**. Ordinary induction lets you use only yesterday's leftovers. Strong induction lets you use any dish made so far, and every one of them really was made. In fact, strong induction is provable *from* ordinary induction. Apply ordinary induction to Q(n) = "P(k) holds for all k < n." Q(0) is vacuously true. If Q(n) holds, the strong step gives P(n), so Q(n + 1) holds too. Then P(n) follows from Q(n + 1).

At n = 0 there are no earlier cases, so P(0) gets no help. In practice, you prove a few small **base cases**, then do the general step.

> **Key Insight:** Use strong induction whenever a problem of size n breaks into smaller pieces whose sizes you can't predict. You only need each piece to be *smaller* than n.

### Two strong-induction workouts

**The unstacking game.** Start with one stack of n blocks. A move splits a stack of size s = a + b (with a, b ≥ 1) into stacks of a and b, and scores a·b points. Play until every stack has height 1. Splitting 5 blocks down the middle scores 6 + 1 + 2 + 1 = 10. Peeling off one block at a time scores 4 + 3 + 2 + 1 = 10. Surprisingly, the strategy never matters.

**Worked proof: every strategy scores n(n − 1)/2.** Use strong induction on n. If n = 1, there are no moves and the score is 0 = 1·0/2. For n ≥ 2, the first move makes stacks a and b with a + b = n, each of them at least 1 and so *smaller than n*. Those two stacks play out independently, so by strong induction they score a(a − 1)/2 and b(b − 1)/2. The total is

ab + a(a − 1)/2 + b(b − 1)/2 = (a² + 2ab + b² − a − b)/2 = (a + b)(a + b − 1)/2 = n(n − 1)/2. ∎

Ordinary induction fails here, because a could be any size from 1 to n − 1.

**Beat orderings.** In a round-robin tournament (every pair plays once, no ties), the teams can always be lined up so that each one beat the next. Pick a team T. Let W be the teams that beat T, and L the teams T beat. Both groups have fewer than n teams, so strong induction orders each. Then line up [W], T, [L]. The last team in W beat T, and T beat the first team in L.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **Tautology** | Always true | C OR NOT C |
| **Proof by cases** | Prove P under each case of an exhaustive split | B true / B false |
| **Exhaustive** | The cases cover every possibility | ≥ 3 friends or ≤ 2 friends |
| **Ramsey number R(3,3)** | Fewest people guaranteeing 3 mutual friends or strangers | 6 |
| **Strong induction** | Prove P(n) assuming P(k) for *all* k < n | Unstacking game |
| **Beat ordering** | A line-up where each team beat the next | Paper, rock, scissors |

---

## 💻 Code Examples

### Example 1: Brute-forcing friends and strangers

```python
# ramsey_check.py
from itertools import combinations, product

def has_mono_triangle(people, friends):
    for a, b, c in combinations(people, 3):
        pairs = [frozenset(p) for p in ((a, b), (b, c), (a, c))]
        status = [p in friends for p in pairs]
        if all(status) or not any(status):
            return True
    return False

def check(n):
    people = range(n)
    pairs = [frozenset(p) for p in combinations(people, 2)]
    # Every pair is friends XOR strangers, so a "world" is one True/False per pair.
    for choice in product([True, False], repeat=len(pairs)):
        friends = {p for p, f in zip(pairs, choice) if f}
        if not has_mono_triangle(people, friends):
            return friends
    return None

for n in (5, 6):
    bad = check(n)
    if bad is None:
        print(f"n={n}: every one of the 2^{n*(n-1)//2} worlds has 3 mutual friends or strangers")
    else:
        print(f"n={n}: counterexample, friends = {sorted(tuple(sorted(p)) for p in bad)}")
```

Output:
```
n=5: counterexample, friends = [(0, 1), (0, 2), (1, 3), (2, 4), (3, 4)]
n=6: every one of the 2^15 worlds has 3 mutual friends or strangers
```

**What's happening:** For 6 people, the computer checks all 32,768 patterns, a proof by exhaustion. For 5, it finds a pentagon of friends whose missing edges form a pentagon of strangers, with no triangle in either.

### Example 2: Strategy doesn't matter, and beat orderings by recursion

```python
# strong_induction_demos.py
import random

def play(n):
    # Splits stacks at random: if the theorem is right, strategy should not matter.
    stacks, score = [n], 0
    while any(s > 1 for s in stacks):
        s = random.choice([s for s in stacks if s > 1])
        stacks.remove(s)
        a = random.randint(1, s - 1)
        stacks += [a, s - a]
        score += a * (s - a)
    return score

for n in (5, 10, 30):
    scores = {play(n) for _ in range(1000)}
    print(n, scores, "formula:", n * (n - 1) // 2)

def beat_order(teams, beats):
    # Strong induction as an algorithm: pick a pivot, solve two strictly smaller problems.
    if len(teams) <= 1:
        return list(teams)
    t, rest = teams[0], teams[1:]
    winners = [s for s in rest if (s, t) in beats]
    losers = [s for s in rest if (t, s) in beats]
    return beat_order(winners, beats) + [t] + beat_order(losers, beats)

print(beat_order(["rock", "paper", "scissors"],
                 {("paper", "rock"), ("rock", "scissors"), ("scissors", "paper")}))
```

Output:
```
5 {10} formula: 10
10 {45} formula: 45
30 {435} formula: 435
['paper', 'rock', 'scissors']
```

**What's happening:** A thousand random strategies give a single score, matching n(n − 1)/2. `beat_order` is the beat-ordering proof turned into code, much like quicksort: the recursive calls work on strictly smaller lists, which is exactly what strong induction needs.

> **💡 Try it:** Generate a random 8-team tournament and check that every adjacent pair in `beat_order`'s output is a real win.

---

## ✏️ Hands-On Exercises

### Exercise 1: Choose the case split (⏱️ ~10 min)

**Goal:** Prove by cases that n² + n is even for every integer n.

<details>
<summary>Hint</summary>
Split on whether n is even or odd, and write n² + n = n(n + 1).
</details>

<details>
<summary>Answer</summary>
If n is even, then n(n + 1) has an even factor. If n is odd, then n + 1 is even. Every integer is even or odd, so the cases are exhaustive. ∎
</details>

---

### Exercise 2: Postage stamps (⏱️ ~20 min)

**Goal:** Prove by strong induction that every amount n ≥ 8 cents can be made with 3¢ and 5¢ stamps.

<details>
<summary>Hint</summary>
Prove 8, 9, and 10 as base cases. For n ≥ 11, use n − 3.
</details>

<details>
<summary>Answer sketch</summary>
8 = 3 + 5, 9 = 3 + 3 + 3, and 10 = 5 + 5. For n ≥ 11, we have 8 ≤ n − 3 < n, so n − 3 can be made by strong induction. Add one 3¢ stamp. ∎
</details>

---

### Exercise 3: Verify the tournament theorem (⏱️ ~25 min)

**Goal:** Test `beat_order` on 1,000 random tournaments of 10 teams.

**Instructions:** Flip a coin for each pair to decide the winner. Run `beat_order`, then assert that each team beat the next one and that all 10 teams appear.

**Expected Output:** No assertion errors.

---

## 📖 Curated Resources

### Must-Read (pick at least 2)

1. **Lecture 3 Notes: Casework and Strong Induction** — MIT OpenCourseWare (CC BY-NC-SA 4.0)
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec03.pdf
   - Why: Templates for case proofs and strong induction, plus the Four Color story.

2. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/ (chapter on induction, section on strong induction)
   - Why: Includes the unstacking game and more strong-induction practice.

### Video Resources

3. **Lecture 3: Casework and Strong Induction** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=GOgA8JGUiwI
   - Why: The block-stacking demo and induction "block diagrams" are very visual.

---

## 🤔 Reflection Questions

1. **Comprehension:** Why must case analysis prove that the cases are exhaustive?
2. **Application:** Why does merge sort's correctness proof need strong induction?
3. **Connection:** Where did Day 1's "false implies anything" show up today?
4. **Critical Thinking:** Why must P(0) be proved without help, even in strong induction?
5. **Personal:** Would you trust a proof with 1,000 cases checked by a computer? Why or why not?

---

## ➡️ Next Steps

**Tomorrow:** State Machines. You'll model systems as states and transitions, and use invariants (induction in disguise) to prove what a machine can never do.

**Before moving on, make sure you can:**
- [ ] Write a proof by cases with an exhaustiveness check
- [ ] Reproduce the six-people argument
- [ ] Prove the unstacking formula by strong induction

[← Previous: Day 02 — Contradiction and Induction](../week-01/day-02-contradiction-induction.md) | [Course Home](../README.md) | [Next: Day 04 — State Machines →](../week-01/day-04-state-machines.md)
