# Day 17: More Counting Techniques

[← Previous: Day 16 — Counting Techniques](../week-03/day-16-counting-techniques.md) | [Course Home](../README.md) | [Next: Day 18 — Probability →](../week-03/day-18-probability.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Count a union of overlapping sets with inclusion-exclusion
2. Use the (generalized) pigeonhole principle to prove a collision must exist
3. Prove an identity by counting one set in two ways
4. Read the binomial theorem and Pascal's triangle as counting facts

**Difficulty:** 🟡 Intermediate
**Estimated Time:** 1.5 hours (1 reading + 0.5 hands-on)

---

## 📚 Core Concepts

Yesterday you counted by building things. Today's three tools handle situations that come up constantly in CS: merging overlapping data, proving that a collision must happen (the reason every hash table needs collision handling), and discovering formulas by counting cleverly.

### Inclusion-exclusion

How many cards are hearts *or* face cards? There are 13 hearts and 12 face cards, but 13 + 12 = 25 is wrong. The jack, queen, and king of hearts were counted twice. Remove one copy of each: 25 − 3 = 22.

Here is the analogy. You merge two club mailing lists into one newsletter list. Anyone on both lists would get two emails, so you add the two list sizes and subtract the people who appear on both. In symbols:

  |A ∪ B| = |A| + |B| − |A ∩ B|

With three sets, subtracting the three pairwise overlaps goes too far. An element in all three sets is added 3 times and subtracted 3 times, so it counts 0 times. Add it back:

  |A ∪ B ∪ C| = |A| + |B| + |C| − |A∩B| − |A∩C| − |B∩C| + |A∩B∩C|

The general pattern alternates: add single sets, subtract pairwise intersections, add triple intersections, and so on. Why is every element counted exactly once? Suppose x lies in exactly m of the sets. It then appears in C(m, 1) single terms, C(m, 2) pair terms, and so on, so its total count is C(m,1) − C(m,2) + C(m,3) − … Half the subsets of an m-set have even size and half odd, which makes this sum exactly 1.

**Example: numbers coprime to n.** Let n = pqr for distinct primes. Among 1…n, n/p numbers share the factor p, n/pq share both p and q, and only n itself shares all three. Inclusion-exclusion counts the numbers sharing *some* factor; subtracting from n leaves the coprime ones:

  n − (n/p + n/q + n/r) + (n/pq + n/pr + n/qr) − 1 = (p−1)(q−1)(r−1)

For n = 30 that gives 1 · 2 · 4 = 8. This is Euler's totient φ from the number-theory days, now derived by counting.

### The pigeonhole principle

If more pigeons than holes are each assigned a hole, two pigeons share one. Formally: if |A| > |B| and f: A → B is total, f is not injective. The **generalized** version says that if |A| > k · |B|, some hole holds at least k + 1 pigeons.

The skill is choosing the pigeons, holes, and map. With 27 students and 26 letters, two first names start with the same letter (student → first letter). With n sock colors, n + 1 socks guarantee a matching pair (sock → color). Boston has about 650,000 people and nobody has more than about 200,000 hairs. Since 650,000 > 3 · 200,000, at least 4 Bostonians have exactly the same number of hairs (person → hair count). The proof tells you a collision *exists* without naming who collides.

A harder one: 33 rooks sit on an 8×8 board. Show that 5 of them share no row or column. Pigeons are rooks. The clever holes are 8 "wrap-around diagonals": diagonal i holds the squares where (column − row) mod 8 = i. Each diagonal uses every row and column once. Since 33 > 4 · 8, some diagonal holds 5 rooks, and those 5 attack nothing among themselves.

### Combinatorial proofs (double counting)

Count one set in two different ways, and the two answers must be equal.

**Worked proof: C(n, k) = C(n−1, k−1) + C(n−1, k).** Let S be the length-n binary strings with exactly k ones. Counting directly, we choose the positions of the ones: |S| = C(n, k). Counting by the last bit splits S into two disjoint groups. If the last bit is 1, we place the other k−1 ones among the first n−1 positions, which gives C(n−1, k−1) strings. If the last bit is 0, all k ones sit in the first n−1 positions, which gives C(n−1, k). Every string ends in exactly one of 0 or 1, so the sum rule gives |S| = C(n−1, k−1) + C(n−1, k). Both counts describe the same set, so they are equal. ∎

This is the rule that builds **Pascal's triangle**: each entry is the sum of the two above it. Counting all length-n binary strings directly gives 2ⁿ, and counting them grouped by the number of ones gives Σ C(n, k). So every row sums to a power of 2: 1 + 5 + 10 + 10 + 5 + 1 = 32.

The same idea proves the **binomial theorem**. Expanding (x + y)ⁿ produces 2ⁿ products, one per string of x's and y's. The term xᵏyⁿ⁻ᵏ appears once for each way to place k x's, so its coefficient is C(n, k). With more variables you get the multinomial theorem, whose coefficients are n!/(k₁! k₂! … kₘ!).

> **Key Insight:** When a direct count is messy, change the question. Correct for overlaps, argue that collisions are forced, or count the same set two ways.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **Inclusion-exclusion** | Union size = singles − pairs + triples − … | Hearts or faces: 22 |
| **Pigeonhole principle** | More items than boxes forces a shared box | 27 students, 26 letters |
| **Generalized pigeonhole** | \|A\| > k\|B\| forces k + 1 in one box | 4 Bostonians, same hairs |
| **Combinatorial proof** | Prove an identity by counting one set two ways | Σ C(n,k) = 2ⁿ |
| **Pascal's identity** | C(n,k) = C(n−1,k−1) + C(n−1,k) | 10 = 4 + 6 |
| **Binomial theorem** | (x+y)ⁿ = Σ C(n,k) xᵏ yⁿ⁻ᵏ | (x+y)² = x² + 2xy + y² |

---

## 💻 Code Examples

### Example 1: Inclusion-exclusion against brute force

```python
from math import gcd, prod
from itertools import combinations

def coprime_pie(n, primes):
    total = 0
    for size in range(len(primes) + 1):
        for subset in combinations(primes, size):
            # Odd-size intersections are subtracted, even-size ones added back
            total += (-1) ** size * (n // prod(subset))
    return total

for n, primes in [(30, [2, 3, 5]), (105, [3, 5, 7]), (60, [2, 3, 5])]:
    print(n, coprime_pie(n, primes), sum(gcd(k, n) == 1 for k in range(1, n + 1)))
```

**What's happening:** It prints `30 8 8`, `105 48 48`, `60 16 16`. The empty subset (product 1) contributes n itself, which matches the "start with everything" convention. The method still works for 60 = 2²·3·5 because only the distinct primes matter.

### Example 2: Checking identities across Pascal's triangle

```python
from math import comb

for n in range(1, 12):
    assert sum(comb(n, k) for k in range(n + 1)) == 2 ** n
    for k in range(1, n):
        assert comb(n, k) == comb(n - 1, k - 1) + comb(n - 1, k)
    assert sum(comb(n, k) ** 2 for k in range(n + 1)) == comb(2 * n, n)
print("all three identities hold for n = 1..11")
```

**What's happening:** Silence from `assert` means success. Checking small cases does not prove anything, but it catches typos before you hunt for a proof. The third identity is Exercise 2.

---

## ✏️ Hands-On Exercises

### Exercise 1: Divisible by 2, 3, or 5 (⏱️ ~15 min, pencil and paper)

How many integers from 1 to 100 are divisible by 2, 3, or 5?

<details>
<summary>Answer</summary>
50 + 33 + 20 − 16 − 10 − 6 + 3 = 74 (using ⌊100/d⌋ for each product d).
</details>

### Exercise 2: Committees (⏱️ ~25 min, pencil and paper)

Prove Σₖ C(n, k)² = C(2n, n) by double counting.

<details>
<summary>Hint</summary>
Choose n people from a room of n women and n men. Group by k, the number of women chosen, and use C(n, k) = C(n, n−k).
</details>

### Exercise 3: Rooks on diagonals (⏱️ ~25 min, coding)

Place 33 rooks at random distinct squares (`random.sample(range(64), 33)`), bucket them by `(col - row) % 8`, and print the largest bucket. Repeat 1,000 times and confirm the minimum is always at least 5.

---

## 📖 Curated Resources

1. **Lecture 17: More Counting Techniques** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=sF5_cyLyyw0
   - Why: The rook argument is easiest to follow on the board.
2. **Lecture 17 notes (PDF)** — MIT OpenCourseWare
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec17.pdf
   - Why: The formal statement of inclusion-exclusion.
3. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/
   - Why: The chapter on counting has more pigeonhole puzzles and combinatorial proofs.

*MIT OpenCourseWare materials are licensed CC BY-NC-SA 4.0.*

---

## 🤔 Reflection Questions

1. **Comprehension:** In three-set inclusion-exclusion, why must the triple intersection be added back?
2. **Application:** Why must a hash function from 1,000 keys into 999 slots have a collision?
3. **Connection:** How does the coprime count relate to Euler's totient from the RSA days?
4. **Critical Thinking:** Why can the pigeonhole principle prove existence without telling you *which* pigeons collide?
5. **Personal:** Which proof felt nicer: algebra with factorials, or the binary-string story?

---

## ➡️ Next Steps

**Tomorrow:** Probability: sample spaces, tree diagrams, and the Monty Hall problem. In uniform spaces, probability is just counting divided by counting.

**Before moving on, make sure you can:**
- [ ] Apply inclusion-exclusion to two and three sets
- [ ] Name pigeons, holes, and the map in a pigeonhole proof
- [ ] Prove Pascal's identity by double counting

[← Previous: Day 16 — Counting Techniques](../week-03/day-16-counting-techniques.md) | [Course Home](../README.md) | [Next: Day 18 — Probability →](../week-03/day-18-probability.md)
