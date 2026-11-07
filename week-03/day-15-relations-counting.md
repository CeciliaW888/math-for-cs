# Day 15: Relations and Counting

[← Previous: Day 14 — Digraphs and DAGs](../week-02/day-14-digraphs-dags.md) | [Course Home](../README.md) | [Next: Day 16 — Counting Techniques →](../week-03/day-16-counting-techniques.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Classify relations by counting arrows
2. Recognize equivalence relations and weak partial orders
3. Count with the bijection, product, sum, and generalized product rules

**Difficulty:** 🟢 Beginner
**Estimated Time:** 1.5 hours (55 min reading + 35 min hands-on)

---

## 📚 Core Concepts

Database tables, follower lists, and ≤ all record which pairs are related. Relations unify them and give us **bijections**, the key to counting, which underpins running times and probability.

### Relations, functions, and arrow counting

A **relation** R from A to B has three parts: a **domain** A, a **codomain** B, and a set of pairs R ⊆ A × B. Write a R b when (a, b) ∈ R, and draw arrows from A to B, like students → classes and classes → professors. It is a two-column database table.

Four properties come from counting arrows:

- **function**: each a has *at most one* arrow out
- **total**: each a has *at least one* arrow out
- **injective**: each b has *at most one* arrow in
- **surjective**: each b has *at least one* arrow in

A **total function** has exactly one arrow out of each a (what "function" usually means). A **partial function** may leave inputs without output. All three parts matter: f(x) = 1/x² from ℝ to ℝ is not total, because 0 has no output. With domain and codomain ℝ∖{0}, the same pairs form a total function. A relation with all four properties is a **bijection**: exactly one arrow out of every a and exactly one arrow into every b.

Arrow counts compare sizes. In a total injection each a sends ≥ 1 arrow and each b receives ≤ 1, so |A| ≤ #arrows ≤ |B|. Swapping the roles, a surjective function gives |A| ≥ |B|. A bijection gives both, so **|A| = |B|**.

### Relations on one set: sameness and order

A relation on one set A is a digraph on A: =, ≡ (mod 10), ≤, ⊆, "divides", and reachability G* (u G* v when a walk goes from u to v). Three key properties:

- **reflexive**: a R a for all a (a self-loop at every vertex)
- **symmetric**: a R b ⟹ b R a (every arrow has a return arrow)
- **transitive**: a R b and b R c ⟹ a R c (every two-step walk has a shortcut)

All three together make an **equivalence relation**, which captures *sameness*. **Theorem:** an equivalence relation partitions A into disjoint blocks, with a R b exactly when a and b share a block. For ≡ (mod 10), the blocks are the ten remainder classes, for example {…, −10, 0, 10, …}. Connected components (Day 13) are another case.

Now replace symmetry with **antisymmetry**: a R b and b R a ⟹ a = b. A relation that is reflexive, antisymmetric, and transitive is a **weak partial order**, which behaves like ≤, ⊆, or divides. This links back to Day 14: G* is a weak partial order exactly when G is a DAG. Two elements are **comparable** if a R b or b R a. For example, {1, 2} and {2, 7} are incomparable under ⊆. A **total order** has every pair comparable, like ≤ on numbers.

### Counting with correspondences

Picture a coat check: the attendant never counts coats, but one ticket per coat means the tickets handed out tell you exactly how many there are. That is the **bijection rule**: if a bijection A → B exists, then |A| = |B|. To count a hard set, match it with an easy one.

**Product rule:** |A1 × … × An| = |A1| · … · |An|. For example, there are 2ⁿ binary strings of length n. **Sum rule:** for *disjoint* sets, |A1 ∪ … ∪ An| = |A1| + … + |An|. "And" multiplies, "or" adds: 10 shirts *and* 6 trousers make 60 outfits, but a shirt *or* a pair of trousers is 16 choices.

**Worked derivation: {1, …, n} has 2ⁿ subsets.** Match each subset S with the bit string b1…bn, where bi = 1 exactly when i ∈ S. For n = 6, the string 010011 corresponds to {2, 5, 6}. Each subset gives one string, and each string decodes to one subset, so this is a bijection. The product rule counts 2ⁿ strings, so there are 2ⁿ subsets. ∎

The rules combine. Passwords of length 6–8 that start with a capital letter (26 options) and continue with letters or digits (62 options each) number 26·62⁵ + 26·62⁶ + 26·62⁷. The sum rule handles the three lengths, and the product rule handles each one.

The **generalized product rule** applies when *which* options you have can change from step to step, but *how many* you have cannot. To shuffle a deck, you have 52 choices for the first card, then 51 for the second (whichever card went first), and so on, for 52! orderings in total.

> **Key Insight:** To count a hard set, find a bijection to a set built from independent choices, then multiply for "and" and add for "or".

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **Function / total** | ≤ 1 / ≥ 1 arrow out of each input | 1/x² on ℝ |
| **Injective / surjective** | ≤ 1 / ≥ 1 arrow into each output | Class → prof |
| **Bijection** | Exactly one arrow out, one in | Subsets ↔ bits |
| **Equivalence relation** | Reflexive, symmetric, transitive | ≡ (mod 10) |
| **Weak partial order** | Reflexive, antisymmetric, transitive | ⊆, divides |

---

## 💻 Code Examples

### Example 1: Testing relation properties

```python
def properties(A, R):
    return {
        "reflexive": all((a, a) in R for a in A),
        "symmetric": all((b, a) in R for a, b in R),
        "antisymmetric": all(a == b for a, b in R if (b, a) in R),
        "transitive": all((a, d) in R for a, b in R for c, d in R if b == c),
    }

A = range(1, 13)
same3 = {(a, b) for a in A for b in A if a % 3 == b % 3}
divides = {(a, b) for a in A for b in A if b % a == 0}
for R in (same3, divides):
    print([k for k, ok in properties(A, R).items() if ok])
# sameness cuts A into blocks
print(sorted({tuple(b for b in A if (a, b) in same3) for a in A}))
# ['reflexive', 'symmetric', 'transitive']
# ['reflexive', 'antisymmetric', 'transitive']
# [(1, 4, 7, 10), (2, 5, 8, 11), (3, 6, 9, 12)]
```

**What's happening:** Each property is a ∀ check over pairs. Mod-3 sameness gives three blocks; divides is a weak partial order.

### Example 2: Brute-force counting checks

```python
from itertools import product

n = 4
bits = list(product([0, 1], repeat=n))
images = {frozenset(i + 1 for i in range(n) if b[i]) for b in bits}
print(len(bits), len(images))  # no two strings share a subset: injective

first, rest = "AB", "ABab1"  # mini passwords: length 2 or 3
brute = sum(1 for L in (2, 3) for pw in product(rest, repeat=L) if pw[0] in first)
print(brute, 2 * 5 + 2 * 5**2)  # sum over lengths, product within
# 16 16
# 60 60
```

**What's happening:** Brute force confirms both formulas.

> **💡 Try it:** Set `n = 6`; expect 64.

---

## ✏️ Hands-On Exercises

### Exercise 1: Arrow audit (⏱️ ~15 min, pencil-and-paper)

Is s(x) = x² total, injective, surjective on ℤ → ℤ? On ℕ → {0, 1, 4, 9, …}?

<details>
<summary>Answer</summary>
ℤ → ℤ: total, not injective (±2 → 4), not surjective (3 is missed). ℕ → squares: a bijection.
</details>

### Exercise 2: Name the relation (⏱️ ~15 min, coding)

Test "a < b" and "same parity" on 1–12 with `properties`. Name each.

<details>
<summary>Hint</summary>
"<" isn't reflexive; parity is an equivalence (2 blocks).
</details>

### Exercise 3: Licence plates (⏱️ ~20 min, pencil-and-paper)

Plates: 3 letters + 3 digits, or 2 letters + 4 digits. How many?

<details>
<summary>Answer</summary>
26³·10³ + 26²·10⁴ = 24,336,000: product rule per format, sum rule across.
</details>

---

## 📖 Curated Resources

1. **Lecture 15 notes** — MIT OpenCourseWare (CC BY-NC-SA 4.0)
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec15.pdf
   - Why: Definitions.
2. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/
   - Why: Relations and counting chapters.
3. **Lecture 15: Relations and Counting** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=gwOxD51n3nc
   - Why: The shepherd story.

---

## 🤔 Reflection Questions

1. **Comprehension:** How does the domain affect totality?
2. **Application:** Which rule counts a cross join's rows?
3. **Connection:** Why is DAG reachability a partial order?
4. **Critical Thinking:** Can a relation be symmetric and antisymmetric?
5. **Personal:** What would you count?

---

## ➡️ Next Steps

**Tomorrow:** Counting Techniques: permutations, choosing subsets, and the division rule.

**Before moving on, make sure you can:**
- [ ] Classify relations
- [ ] Spot equivalences vs partial orders
- [ ] Mix sum and product rules

[← Previous: Day 14 — Digraphs and DAGs](../week-02/day-14-digraphs-dags.md) | [Course Home](../README.md) | [Next: Day 16 — Counting Techniques →](../week-03/day-16-counting-techniques.md)
