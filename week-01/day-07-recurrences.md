# Day 07: Recurrences

[← Previous: Day 06 — Asymptotics](../week-01/day-06-asymptotics.md) | [Course Home](../README.md) | [Next: Day 08 — Divisibility →](../week-02/day-08-divisibility.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Turn a recursive algorithm into a recurrence
2. Solve recurrences by guess and check or plug and chug
3. Apply the master theorem to merge sort
4. Explain why halving beats subtracting 1

**Difficulty:** 🟡 Intermediate
**Estimated Time:** 1.5 hours (1 reading + 0.5 hands-on)

---

## 📚 Core Concepts

### A recurrence is a sequence defined by induction

Why care? Every recursive function you write secretly carries an equation about its running time, and solving that equation tells you whether your code finishes in a blink or outlives you. If `solve(n)` calls `solve(n-1)` twice plus one extra step, its cost obeys T(n) = 2·T(n−1) + 1. That is a **recurrence**: a sequence where each term is built from earlier ones. Fibonacci is the classic: F(0) = 0, F(1) = 1, F(n) = F(n−1) + F(n−2).

A recurrence computes the 64th term only after the 63 before it. We want a **closed form** instead. Fibonacci has a surprising one: F(n) = (φⁿ − ψⁿ)/√5 with φ = (1+√5)/2 ≈ 1.618 and ψ = (1−√5)/2. As with sums on Day 05, *finding* a closed form is hard; *proving* a good guess is usually a routine induction.

### Towers of Hanoi: guess and check

Three pegs, n disks, largest at the bottom. Move one top disk at a time, never put a big disk on a smaller one, and move the whole stack to another peg. The key observation: at some moment the biggest disk must move, and right then the n−1 smaller disks must all sit on the third peg. So:

1. Move disks 1…n−1 from A to B (a smaller copy of the puzzle).
2. Move disk n from A to C.
3. Move disks 1…n−1 from B to C.

The big disk underneath never interferes, so the smaller puzzle really is the same puzzle. Counting moves gives T(1) = 1, T(n) = 2·T(n−1) + 1, and the terms 1, 3, 7, 15, 31, 63. Those are one less than powers of 2, so **guess** T(n) = 2ⁿ − 1 and **check**:

> **Proof.** Base case: T(1) = 1 = 2¹ − 1. Inductive step: assume T(n−1) = 2ⁿ⁻¹ − 1. Then T(n) = 2(2ⁿ⁻¹ − 1) + 1 = 2ⁿ − 1. ∎

Sixty-four disks at one move per second take 2⁶⁴ − 1 seconds, about 580 billion years. Notice the lecture's deeper point: recursion *is* induction. Trusting the recursive call on n−1 disks is exactly using the inductive hypothesis.

### Merge sort: plug and chug

**Selection sort** repeatedly scans for the smallest item, costing (n−1) + (n−2) + … + 1 = n(n−1)/2 comparisons. **Merge sort** does better. Merging two sorted lists needs at most |A| + |B| − 1 comparisons, since only the two front items are ever compared. Merge sort splits the list in half, sorts each half recursively, then merges. For n a power of 2, worst-case comparisons satisfy M(1) = 0, M(n) = 2·M(n/2) + (n − 1).

The values 0, 1, 5, 17, 49, 129 hide their pattern, so we **plug and chug**: substitute the recurrence into itself.

- M(n) = (n − 1) + 2M(n/2)
- = (n − 1) + (n − 2) + 4M(n/4)
- = (n − 1) + (n − 2) + (n − 4) + 8M(n/8)
- after t steps: (n − 1) + (n − 2) + … + (n − 2ᵗ⁻¹) + 2ᵗM(n/2ᵗ)

Set n = 2ᵏ and t = k. The tail becomes n·M(1) = 0. We have k copies of n minus the geometric sum 1 + 2 + … + 2ᵏ⁻¹ = n − 1, so M(n) = n·log₂n − n + 1. Tip: keep each level's terms separate while expanding, or the pattern hides. Then confirm the guess by induction.

### The master theorem and the recursion tree

For **divide-and-conquer** recurrences T(n) = a·T(n/b) + f(n), the **master theorem** gives a Θ answer without the algebra (and copes with floors and ceilings). Picture the **recursion tree**: the root does f(n) work, its a children do f(n/b) each, a² grandchildren do f(n/b²), down log_b n levels to n^(log_b a) leaves. It is a tug of war:

- **Case 1:** f is small, the leaves win: T(n) = Θ(n^(log_b a)).
- **Case 2:** every level does similar work: T(n) = Θ(n^(log_b a) · log n).
- **Case 3:** f is big, the root wins: T(n) = Θ(f(n)).

Merge sort has a = b = 2, so n^(log₂2) = n, and f(n) = n − 1 = Θ(n). That is case 2: M(n) = Θ(n log n), matching our exact formula. Some recurrences fall between the cases, so the theorem is not universal.

Think of a recursion tree as a phone tree spreading news. If each caller hands *half* of the remaining contact list to each of two helpers, the chain ends after log n rounds. If each caller crosses off only *one* name before handing the rest to two helpers, it runs n rounds deep and the calls explode. That is why Hanoi (2ⁿ − 1) and Fibonacci (about 1.618ⁿ) are exponential while merge sort stays at n log n.

> **Key Insight:** How fast subproblems shrink decides everything: dividing gives a shallow tree and a fast algorithm; subtracting a constant gives a deep tree and exponential cost.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **Recurrence** | Sequence defined from its earlier terms | T(n) = 2T(n−1) + 1 |
| **Closed form** | Formula for the n-th term directly | 2ⁿ − 1 |
| **Guess and check** | Spot a pattern, prove it by induction | Hanoi |
| **Plug and chug** | Expand the recurrence into itself | M(n) expansion |
| **Master theorem** | Θ bounds for aT(n/b) + f(n) | Merge sort: case 2 |

---

## 💻 Code Examples

### Example 1: Hanoi moves versus 2ⁿ − 1

```python
def hanoi(n, src, via, dst, moves):
    if n == 0:
        return
    # The big disk can move only after the n-1 smaller disks are parked on the spare peg.
    hanoi(n - 1, src, dst, via, moves)
    moves.append((n, src, dst))
    hanoi(n - 1, via, src, dst, moves)

for n in range(1, 7):
    moves = []
    hanoi(n, "A", "B", "C", moves)
    print(n, len(moves), 2**n - 1)
```

**What's happening:** The code mirrors the three-step strategy, and every printed count (1, 3, 7, …, 63) matches 2ⁿ − 1. Evidence, not proof: the induction is the proof.

### Example 2: Merge sort comparisons

```python
import random

def merge_sort(xs, count):
    if len(xs) <= 1:
        return xs
    a, b = merge_sort(xs[:len(xs)//2], count), merge_sort(xs[len(xs)//2:], count)
    out = []
    while a and b:
        count[0] += 1
        out.append((a if a[0] <= b[0] else b).pop(0))
    # When one list runs out, the other is already sorted: no more comparisons.
    return out + a + b

def M(n):
    # Worst case assumed at every merge, so this is an upper bound.
    return 0 if n == 1 else 2 * M(n // 2) + n - 1

random.seed(7)
for k in range(1, 6):
    n, count = 2**k, [0]
    merge_sort(random.sample(range(1000), n), count)
    print(n, count[0], M(n), n*k - n + 1, n*(n-1)//2)
```

```
2 1 1 1 1
4 5 5 5 6
8 17 17 17 28
16 42 49 49 120
32 120 129 129 496
```

**What's happening:** Columns: n, actual, M(n), formula, selection sort. Formula and recurrence agree; real runs land at or below; selection sort pulls away.

> **💡 Try it:** Raise the range to 11 and compare the last two columns.

---

## ✏️ Hands-On Exercises

### Exercise 1: Plug and chug by hand (⏱️ ~15 min)

Solve S(1) = 1, S(n) = S(n/2) + 1 (n a power of 2); prove it by induction.

<details>
<summary>Answer</summary>
S(n) = 1 + log₂n, the cost of binary search.
</details>

### Exercise 2: Master theorem practice (⏱️ ~15 min)

Classify T(n) = 4T(n/2) + n and T(n) = 2T(n/2) + n².

<details>
<summary>Answer</summary>
Compare f with n^(log_b a): case 1 gives Θ(n²); case 3 gives Θ(n²).
</details>

### Exercise 3: Fibonacci in code (⏱️ ~20 min)

Compare F(0)…F(30) with `round((phi**n - psi**n) / 5**0.5)`.

<details>
<summary>Hint</summary>
phi = (1 + 5**0.5) / 2, psi = (1 − 5**0.5) / 2.
</details>

---

## 📖 Curated Resources

1. **Lecture 7: Recurrences** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=PvuwfciiH2U
2. **Lecture 7 notes** — MIT OpenCourseWare (CC BY-NC-SA 4.0)
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec07.pdf
3. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/ (the chapter on recurrences)

---

## 🤔 Reflection Questions

1. **Comprehension:** How does induction remove the apparent circularity of recursion?
2. **Application:** Three subproblems of size n/3 plus linear work: what running time?
3. **Critical Thinking:** Why is M(n) only an upper bound?

---

## ➡️ Next Steps

**Tomorrow:** Day 08 — Divisibility: GCDs and Euclid's algorithm, a recursion that shrinks its input fast.

**Before moving on, make sure you can:**
- [ ] Write and solve a recurrence
- [ ] Apply the master theorem

[← Previous: Day 06 — Asymptotics](../week-01/day-06-asymptotics.md) | [Course Home](../README.md) | [Next: Day 08 — Divisibility →](../week-02/day-08-divisibility.md)
