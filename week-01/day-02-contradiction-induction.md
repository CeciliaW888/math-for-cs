# Day 02: Contradiction and Induction

[← Previous: Day 01 — Predicates, Sets, and Proofs](../week-01/day-01-predicates-sets-proofs.md) | [Course Home](../README.md) | [Next: Day 03 — Casework and Strong Induction →](../week-01/day-03-casework-strong-induction.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Write proof outlines for ∃, ∀, implication, and "if and only if" claims
2. Prove an implication directly and by contrapositive
3. Follow a proof by contradiction, such as "√2 is irrational"
4. Explain why induction works and write a base case and inductive step

**Difficulty:** 🟢 Beginner
**Estimated Time:** 1.5 hours (1 hour reading or video + 0.5 hours hands-on)

---

## 📚 Core Concepts

Induction is the proof version of a loop: one argument that covers infinitely many cases. First, the last ingredient of a proof, **logical deductions**.

### Inference rules and proof outlines

An **inference rule** combines true statements into new true ones. From P and P → Q, you get Q. From P → Q and NOT Q, you get NOT P. From NOT P → false, you get P. A truth table can check each rule, but in a proof you just use them. Never write "clearly" or "obviously" in place of a reason.

The shape of a claim tells you how its proof starts:

- **∃x ∈ S, P(x):** name a specific x, show it's in S, then show P(x). *"There's a prime n ≥ 10"*: take n = 17. It's in ℕ, it's ≥ 10, and no number from 2 to 16 divides it.
- **∀x ∈ S, P(x):** "Let x be an arbitrary element of S," and assume nothing else about x. *For all real x, x² − 6x > −10*: (x − 3)² ≥ 0, so x² − 6x ≥ −9 > −10.
- **P → Q (direct):** "Assume P. … Therefore Q." *If n is a multiple of 10, then n = 10k = 2(5k), so n is even.*
- **P → Q (contrapositive):** "Assume NOT Q. … Therefore NOT P." *If n² is even, then n is even.* Prove the contrapositive instead: if n = 2k + 1 is odd, then n² = 2(2k² + 2k) + 1 is odd.
- **P ⟺ Q** ("if and only if"): prove both P → Q and Q → P.

You can write a proof's skeleton before you understand the problem. For the lecture's nonsense claim "n is *fooish* exactly when n + 1 is *barsome*": let n be any integer, then (1) assume fooish and show barsome, and (2) assume barsome and show fooish. Mark goals with **WTS** ("want to show").

### Proof by contradiction

To prove P, assume NOT P and derive something both true and false. Since our axioms are consistent, the assumption must be wrong, so P is true. It's the "NOT P → false gives P" rule turned into a proof template.

**Worked proof: √2 is irrational.**
Suppose, for contradiction, that √2 = a/b for integers a and b with b ≠ 0, in lowest terms (no common factor greater than 1).
1. Then a = √2·b, so a² = 2b². That makes a² even, so a is even by the contrapositive result above.
2. Write a = 2c. Then 4c² = 2b², so b² = 2c². That makes b² even, so b is even.
3. Now 2 divides both a and b, which contradicts "lowest terms." So √2 is not rational. ∎

### Induction, discovered rather than memorized

Let's prove 1 + 2 + ⋯ + n = n(n + 1)/2 for all n ∈ ℕ. List the claims as rows: 0 = 0·1/2, 1 = 1·2/2, 1 + 2 = 2·3/2, and so on. Going down one row, the left side gains exactly n + 1. Does the right side gain n + 1 too? (n + 1)(n + 2)/2 − n(n + 1)/2 = (n + 1)·2/2 = n + 1. Yes. Both sides start equal and change by the same amount at every step, so they stay equal forever.

Picture a **bucket brigade**. The first person is handed a full bucket. Everyone has one job: take the bucket from the person before you and pass it on. Nobody needs to see the whole line to know the water reaches the end. Induction formalizes this. Let P(n) be the predicate "1 + ⋯ + n = n(n + 1)/2."

- **Base case:** prove P(0). Here, the empty sum is 0, which equals 0·1/2.
- **Inductive step:** for an arbitrary n ≥ 0, assume P(n) (the **inductive hypothesis**) and prove P(n + 1). Here, add n + 1 to both sides and apply the algebra above.
- **Conclusion:** the **principle of induction** says that P(0) and ∀n (P(n) → P(n + 1)) together give ∀n P(n).

Nothing here is magic. "Let n ≥ 0" is the ∀ outline, and "assume P(n), show P(n + 1)" is a direct implication. You can start from another base, such as P(1), and then conclude P(n) only from that point on.

> **Key Insight:** Induction swaps one impossible job (checking infinitely many cases) for two finite ones: a starting case, plus one step that works for every n.

### Tiling a courtyard with L-shapes

Theorem: any 2ⁿ × 2ⁿ grid with one cell removed can be tiled with L-trominoes (three-square L shapes). P(1) is easy, since a 2 × 2 grid minus one cell *is* an L. For the step, assume every 2ⁿ × 2ⁿ grid missing a cell can be tiled. Split a 2ⁿ⁺¹ × 2ⁿ⁺¹ grid into four quadrants. The missing cell lies in one of them. Place a single L at the centre so it covers one corner cell from each of the *other* three quadrants. Now each quadrant is a 2ⁿ × 2ⁿ grid missing exactly one cell, and the inductive hypothesis tiles all four. The proof is also a recursive algorithm, as Example 2 shows.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **Inference rule** | A valid way to derive a new truth | P and P → Q give Q |
| **Direct proof** | Assume P, derive Q | Multiple of 10 → even |
| **Proof by contrapositive** | Prove NOT Q → NOT P instead | n odd → n² odd |
| **Proof by contradiction** | Assume NOT P and reach a contradiction | √2 is irrational |
| **Base case** | The starting instance, proved directly | P(0) |
| **Inductive step** | ∀n, P(n) → P(n + 1) | Add n + 1 to both sides |

---

## 💻 Code Examples

### Example 1: Checking the two pieces of an induction

```python
# induction_pieces.py
def formula(n):
    return n * (n + 1) // 2

# Base case: the empty sum (n = 0) really is 0.
print("P(0):", 0 == formula(0))

# Inductive step, checked numerically: going from row n to row n+1
# the right side must grow by exactly n+1, the same amount the left side grows.
print("Step holds for n < 10000:",
      all(formula(n + 1) - formula(n) == n + 1 for n in range(10000)))

# Spot check of the full claim. This is evidence, not proof:
# the proof is the base case plus the step, which covers every n at once.
running = 0
for n in range(1, 6):
    running += n
    print(n, running, formula(n))
```

Output:
```
P(0): True
Step holds for n < 10000: True
1 1 1
2 3 3
3 6 6
4 10 10
5 15 15
```

**What's happening:** The code checks the two things induction asks for, the base case and the step, rather than just the final formula. The algebra in the guide proves the step for every n. The code only confirms it on a sample.

### Example 2: The tromino proof, run as a program

```python
# tromino.py
def tile(board, top, left, size, hole_r, hole_c, counter):
    # Base case: a 1x1 square is just the hole, nothing to place.
    if size == 1:
        return
    half = size // 2
    mid_r, mid_c = top + half, left + half
    counter[0] += 1
    piece = counter[0]
    holes = []
    # For each quadrant, either it already contains the hole,
    # or we "fake" a hole at its corner cell touching the centre.
    # Those three fake holes together form one L tromino.
    for qr, qc in [(top, left), (top, mid_c), (mid_r, left), (mid_r, mid_c)]:
        if qr <= hole_r < qr + half and qc <= hole_c < qc + half:
            holes.append((qr, qc, hole_r, hole_c))
        else:
            r = mid_r - 1 if qr == top else mid_r
            c = mid_c - 1 if qc == left else mid_c
            board[r][c] = piece
            holes.append((qr, qc, r, c))
    # Inductive hypothesis in action: trust that each smaller board can be tiled.
    for qr, qc, hr, hc in holes:
        tile(board, qr, qc, half, hr, hc, counter)

size = 8
board = [[0] * size for _ in range(size)]
board[1][5] = -1
counter = [0]
tile(board, 0, 0, size, 1, 5, counter)
for row in board:
    print(" ".join(" X" if v == -1 else f"{v:2d}" for v in row))
print("L pieces used:", counter[0])
```

Output (each number labels one L piece):
```
 3  3  4  4  8  8  9  9
 3  2  2  4  8  X  7  9
 5  2  6  6 10  7  7 11
 5  5  6  1 10 10 11 11
13 13 14  1  1 18 19 19
13 12 14 14 18 18 17 19
15 12 12 16 20 17 17 21
15 15 16 16 20 20 21 21
L pieces used: 21
```

**What's happening:** Piece 1 is the centre L from the proof. The recursive calls are the inductive hypothesis, applied to each quadrant. Note that 21 × 3 = 63 = 64 − 1.

> **💡 Try it:** Move the hole to `(7, 0)` or set `size = 16`. Does it ever fail?

---

## ✏️ Hands-On Exercises

### Exercise 1: Outline first (⏱️ ~10 min)

**Goal:** Write only the skeleton of a proof.

**Instructions:** Without solving anything, write the outline for: "For every integer n, n is odd if and only if n² is odd." Mark each gap with WTS.

<details>
<summary>Answer</summary>
Let n be an integer. (→) Assume n is odd. WTS n² is odd. (←) Assume n² is odd. WTS n is odd. For (←), proving the contrapositive (n even → n² even) is easiest.
</details>

---

### Exercise 2: Your own induction (⏱️ ~20 min)

**Goal:** Prove 1 + 3 + 5 + ⋯ + (2n − 1) = n² for all n ≥ 1, on paper.

<details>
<summary>Hint</summary>
Going from n to n + 1 adds the term 2(n + 1) − 1 = 2n + 1. What is n² + 2n + 1?
</details>

<details>
<summary>Answer sketch</summary>
Base case: n = 1 gives 1 = 1². Step: assume the sum up to 2n − 1 is n². Adding 2n + 1 gives n² + 2n + 1 = (n + 1)². ∎
</details>

---

### Exercise 3: Code a contradiction hunt (⏱️ ~20 min)

**Goal:** See why no fraction squares to exactly 2.

**Instructions:** For b from 1 to 10,000, set a = round(b·√2). Find the closest a²/b² to 2, and check whether a² == 2·b² ever holds.

**Expected Output:** Values like 1.99999…, but `a*a == 2*b*b` is never True, just as the proof says.

---

## 📖 Curated Resources

### Must-Read (pick at least 2)

1. **Lecture 2 Notes: Contradiction and Induction** — MIT OpenCourseWare (CC BY-NC-SA 4.0)
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec02.pdf
   - Why: Includes the careful write-up of the tromino proof.

2. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/ (chapters on proof methods and induction)
   - Why: More induction practice, with common pitfalls.

### Video Resources

3. **Lecture 2: Contradiction and Induction** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=_NYsYuzMLs0
   - Why: The laser-cut tromino pieces make the quadrant trick easy to see.

---

## 🤔 Reflection Questions

1. **Comprehension:** Why must x be *arbitrary* in the ∀ outline?
2. **Application:** Which proof technique would you try first for "there's no largest even number"? Why?
3. **Connection:** How does the inductive step use Day 1's implication truth table?
4. **Critical Thinking:** What goes wrong if you prove the inductive step but forget the base case?
5. **Personal:** Which recursive function you've written could be justified by induction?

---

## ➡️ Next Steps

**Tomorrow:** Casework and Strong Induction. You'll split proofs into cases, and meet an induction whose step may use *every* earlier case.

**Before moving on, make sure you can:**
- [ ] Write the outline for ∃, ∀, →, and ⟺ claims
- [ ] Reproduce the √2 contradiction proof
- [ ] Write a base case and inductive step for a sum formula

[← Previous: Day 01 — Predicates, Sets, and Proofs](../week-01/day-01-predicates-sets-proofs.md) | [Course Home](../README.md) | [Next: Day 03 — Casework and Strong Induction →](../week-01/day-03-casework-strong-induction.md)
