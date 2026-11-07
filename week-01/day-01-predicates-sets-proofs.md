# Day 01: Predicates, Sets, and Proofs

[Course Home](../README.md) | [Next: Day 02 — Contradiction and Induction →](../week-01/day-02-contradiction-induction.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Distinguish propositions from predicates and use ∀ and ∃
2. Build truth tables for NOT, AND, OR, and IMPLIES
3. Explain why an implication equals its contrapositive but not its converse
4. Use ∈, ⊆, ∪, ∩, set difference, and set-builder notation
5. Say what axioms are and why proofs need them

**Difficulty:** 🟢 Beginner
**Estimated Time:** 1.5 hours (1 hour reading or video + 0.5 hours hands-on)

---

## 📚 Core Concepts

Every `if` statement, password check, or test that a sort function really sorts relies on precise logic. Today you learn the vocabulary that turns "this is definitely true" into something you can check, rather than a feeling.

### What counts as a proof?

People decide what's true through experiments, polls, court trials, trusted authorities, or gut feeling. Mathematics uses one specific method. A **mathematical proof** checks that a proposition is true by a chain of logical steps, starting from a set of axioms. Today covers propositions and axioms. Day 2 covers the logical steps.

A **proposition** is a statement that is either true or false. "2 + 3 = 4" is a false proposition, but still a proposition. "p is prime" isn't one, because its truth depends on p. A statement like that is a **predicate**. Plug in p = 7 and it becomes a proposition.

**Quantifiers** turn predicates into propositions. "∀n ∈ ℕ, n² + n + 41 is prime" claims the predicate holds for *every* natural number. (Here ℕ = {0, 1, 2, …}, and 0 counts.) n = 0 gives 41, n = 1 gives 43, n = 2 gives 47, and every value is prime up to n = 39. Then n = 40 gives 1681 = 41 × 41. One counterexample sinks a "for all" claim. Goldbach's Conjecture ("every even number greater than 2 is a sum of two primes") has been checked for huge numbers and is still unproved. Checking examples is not proving.

### Combining propositions: truth tables

| A | B | NOT A | A AND B | A OR B | A IMPLIES B |
|---|---|---|---|---|---|
| T | T | F | T | T | T |
| T | F | F | F | T | **F** |
| F | T | T | F | T | T |
| F | F | T | F | F | T |

In math, OR is **inclusive**: "both" counts as true. English is sloppier. "Chicken or pasta?" at a wedding means exactly one (XOR). "Coffee or tea?" means one or neither, but not both (NAND, "not both"). "Cream or sugar?" means anything goes. Inside a formula, OR means the table above and nothing else.

**Implication** (A → B, "if A then B") trips people up. Think of it as a **product warranty**: "If the blender breaks within a year, we replace it." The company breaks its promise only if the blender breaks *and* they refuse to replace it, which is row 2. If the blender never breaks (A is false), the promise can't be broken. So false implies anything. A mathematical implication carries no cause and no timeline. It is just the truth table, and it means the same as (NOT A) OR B.

### Converse, inverse, contrapositive

From A → B you can form three variations:

- **Converse:** B → A
- **Inverse:** NOT A → NOT B
- **Contrapositive:** NOT B → NOT A

Only the **contrapositive** always matches the original. "If it's Wednesday, I wear pink" means the same as "If I'm not wearing pink, it isn't Wednesday." The joke "I do not think, therefore I do not am" is the *inverse* of Descartes' line, so it makes a different claim. A shoe doesn't think, but it still exists.

> **Key Insight:** An implication fails only when the "if" part is true and the "then" part is false, so to check one, you check that single row.

**Worked derivation.** We'll show A → B ≡ NOT B → NOT A, using "X → Y means NOT X OR Y."

1. NOT B → NOT A means NOT(NOT B) OR NOT A.
2. NOT(NOT B) is B, so this is B OR NOT A.
3. OR doesn't care about order, so this is NOT A OR B.
4. That is the definition of A → B. ∎

### Sets and axioms

A **set** is an unordered collection with no repeats, so {6, 1, 2, 0} = {2, 1, 6, 0}. You'll meet ℕ, ℤ, ℚ, ℝ, ℂ, and the empty set ∅ often. x ∈ S means "x is an element of S." A ⊆ B means "every element of A is in B."

Watch the nesting. If B = {2, {3, 4}, ∅}, then 3 ∉ B, because 3 sits *inside* one of B's elements. ∅ ⊆ A holds for every set A, since no element of ∅ can be missing from A. That's the same can't-be-broken logic as "false implies anything." The operations are A ∪ B (in either), A ∩ B (in both), and A − B (in A, not B). **Set-builder notation** filters with a predicate: {n ∈ ℕ | n is prime} = {2, 3, 5, 7, …}. A **tuple** (6, 1, 2, 0) is different from a set, because order and repeats matter.

**Axioms** are propositions we assume, declared up front. Euclid assumed exactly one parallel line passes through a point off a given line. Swap "exactly one" for "none" or "infinitely many" and you get spherical or hyperbolic geometry, both perfectly consistent. We want axioms that are **consistent** (nothing is provably both true and false) and ideally **complete** (every truth is provable). Gödel showed that axioms rich enough for arithmetic can't be both. In this course, standard high-school math is your axiom set. Name a fact when you use it.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **Proposition** | Statement that is true or false | "2 + 3 = 4" |
| **Predicate** | Statement whose truth depends on variables | "p is prime" |
| **Quantifier** | ∀ "for all", ∃ "there exists" | ∀n ∈ ℕ, n ≥ 0 |
| **Implication** | A → B; false only when A true, B false | Wednesday → pink |
| **Contrapositive** | NOT B → NOT A; equivalent to A → B | Not pink → not Wednesday |
| **Converse** | B → A; not equivalent in general | Pink → Wednesday |
| **Subset (⊆)** | Every element of one set is in the other | ∅ ⊆ {1, 2} |
| **Axiom** | Proposition assumed as a starting point | Parallel postulate |

---

## 💻 Code Examples

### Example 1: Hunting for counterexamples

```python
# counterexample_hunt.py
def is_prime(m):
    if m < 2:
        return False
    d = 2
    while d * d <= m:
        if m % d == 0:
            return False
        d += 1
    return True

# A "for all" claim survives any number of passing checks,
# but one failure is enough to kill it, so we hunt for the first failure.
for n in range(100):
    value = n * n + n + 41
    if not is_prime(value):
        print(f"Counterexample: n = {n}, n*n + n + 41 = {value} = 41 * {value // 41}")
        break

# Goldbach: we can check many cases, but checking is not proving.
def goldbach_pair(even):
    for p in range(2, even // 2 + 1):
        if is_prime(p) and is_prime(even - p):
            return p, even - p
    return None

print("20 =", goldbach_pair(20))
print("All even numbers 4..10000 work:",
      all(goldbach_pair(e) for e in range(4, 10001, 2)))
```

Output:
```
Counterexample: n = 40, n*n + n + 41 = 1681 = 41 * 41
20 = (3, 17)
All even numbers 4..10000 work: True
```

**What's happening:** The formula passes 40 tests and then fails, which is why examples can't prove a "for all" claim. Goldbach passes every test, but that's still only evidence. Code is great for *disproving* claims and building intuition.

### Example 2: Truth tables and nested sets

```python
# truth_tables.py
from itertools import product

def implies(a, b):
    # The only way to break "if A then B" is A true and B false.
    return (not a) or b

for a, b in product([True, False], repeat=2):
    print(a, b, "| A->B:", implies(a, b),
          " contra:", implies(not b, not a), " converse:", implies(b, a))

# frozenset lets a set be an element of another set (plain sets are unhashable).
A = {6, 1, 2, 0}
B = {2, frozenset({3, 4}), frozenset()}
print("3 in B?", 3 in B)          # False: 3 is nested one level too deep
print("A & B =", A & B)           # {2}
print("A - B =", A - B)           # {0, 1, 6}
print("empty subset of A?", set() <= A)  # True
```

**What's happening:** The "A->B" and "contra" columns match on every row, while "converse" differs on two. Python's `&`, `-`, and `<=` are ∩, set difference, and ⊆.

> **💡 Try it:** Add `xor` and `nand` columns. Which waiter question matches each one?

---

## ✏️ Hands-On Exercises

### Exercise 1: Proposition or predicate? (⏱️ ~10 min)

**Goal:** Classify statements, pencil and paper.

**Instructions:** Label each statement as a proposition or a predicate. Give the truth value of each proposition.
1. 17 is prime. 2. x > 3. 3. ∃x ∈ ℕ, x > 3. 4. ∀x ∈ ℕ, x > 3. 5. {1, 2} ⊆ {2, 1, 3}

<details>
<summary>Answers</summary>
1. Proposition, true. 2. Predicate. 3. True (x = 4). 4. False (x = 0). 5. True.
</details>

---

### Exercise 2: Flip the implication (⏱️ ~15 min)

**Goal:** Practise converse, inverse, and contrapositive.

**Instructions:** For "If a number is a multiple of 4, then it is even," write all three variations. Mark each one true or false, and give a counterexample for each false one.

<details>
<summary>Answer</summary>
Converse (even → multiple of 4): false, try 6. Inverse (not a multiple of 4 → odd): false, try 6. Contrapositive (odd → not a multiple of 4): true.
</details>

---

### Exercise 3: Code a set-builder (⏱️ ~20 min)

**Goal:** Turn predicates into sets.

**Instructions:**
1. Build {n ∈ ℕ | n < 50 and n² + n + 41 is not prime} with a set comprehension.
2. Intersect the even numbers below 30 with the multiples of 3 below 30. Describe the result.

**Expected Output:** `[40, 41, 44, 49]` (sorted), then the multiples of 6: `{0, 6, 12, 18, 24}`.

<details>
<summary>Hint</summary>
<code>{n for n in range(50) if not is_prime(n*n + n + 41)}</code>
</details>

---

## 📖 Curated Resources

### Must-Read (pick at least 2)

1. **Lecture 1 Notes: Predicates, Sets, and Proofs** — MIT OpenCourseWare (CC BY-NC-SA 4.0)
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec01.pdf
   - Why: Precise definitions and every example from today's lecture.

2. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/ (chapters on proofs, logical formulas, and sets)
   - Why: More examples and practice problems.

### Video Resources

3. **Lecture 1: Predicates, Sets, and Proofs** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=sbpCTjmw85g
   - Why: The waiter "or" stories and the Wednesday-pink rule are fun to hear told live.

---

## 🤔 Reflection Questions

1. **Comprehension:** Why can one counterexample disprove a "for all" claim when a million examples can't prove it?
2. **Application:** Rewrite a rule from your life ("If I'm late, I text") as its contrapositive.
3. **Connection:** How is a code `if` like an implication, and how is it different?
4. **Critical Thinking:** Why is ∅ ⊆ A true when ∅ has nothing to check?
5. **Personal:** Which everyday "or" that you use is secretly an XOR?

---

## ➡️ Next Steps

**Tomorrow:** Contradiction and Induction. You'll learn proof outlines for ∃, ∀, and →, prove √2 is irrational, and meet induction.

**Before moving on, make sure you can:**
- [ ] Explain proposition vs. predicate
- [ ] Write the truth table for A → B from memory
- [ ] State the contrapositive of an implication
- [ ] Compute ∪, ∩, and − for small sets

[Course Home](../README.md) | [Next: Day 02 — Contradiction and Induction →](../week-01/day-02-contradiction-induction.md)
