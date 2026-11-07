# Day 11: Graphs and Coloring

[← Previous: Day 10 — Cryptography](../week-02/day-10-cryptography.md) | [Course Home](../README.md) | [Next: Day 12 — Matching →](../week-02/day-12-matching.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Define a simple graph, degree, and bipartite graph
2. Use the handshake lemma to rule out impossible graphs and compare averages
3. Prove a chromatic number with an upper bound and a lower bound
4. Run greedy coloring and prove it uses at most d + 1 colors

**Difficulty:** 🟢 Beginner
**Estimated Time:** 1.5 hours (1 hour reading + 30 min hands-on)

---

## 📚 Core Concepts

Friendships, network links, neurons, and clashing exam times all have the same shape: things, plus pairs of things that are related. Graphs are simple enough to model all of them and rich enough to come with powerful theorems.

### What a graph is

A **simple graph** G = (V, E) is a nonempty set V of **vertices** (also called nodes) and a set E of **edges**, where each edge is a two-element subset {u, v} of V. "Simple" rules out two edges joining the same pair and loops from a vertex to itself. E may be empty, so five dots with no lines is a valid graph. Edges are two-way, like Facebook friendships. One-way links, like Twitter follows, come later as directed graphs.

Vertices u and v are **adjacent** if {u, v} ∈ E. An edge is **incident** to its two endpoints. The **degree** of v is the number of edges incident to v.

### The handshake lemma

Is there a graph with degrees 2, 2, 1? Both degree-2 vertices must connect to everything else, which gives the third vertex degree 2, so no. Degrees 2, 2, 2, 2, 2, 1 have too many cases to check by hand, but one fact settles it:

**Handshake lemma:** Σ_{v ∈ V} deg(v) = 2|E|.

*Proof.* Adding up the degrees counts every edge endpoint once. Each edge has exactly two endpoints, so each edge is counted twice. ∎

The degrees 2, 2, 2, 2, 2, 1 add up to 11, which is odd, so no graph has them. The lemma also gives a maximum edge count. Every degree is at most n − 1, so 2|E| ≤ n(n − 1), which means |E| ≤ n(n − 1)/2. The **complete graph** Kₙ, where every pair of vertices is joined, reaches this bound.

A graph is **bipartite** if V splits into L and R so that every edge has one end in each part. Then the left degrees add up to |E|, and so do the right degrees. Take friendships between MIT and Harvard undergrads. The average number of Harvard friends per MIT student, divided by the average number of MIT friends per Harvard student, is (|E|/|M|) ÷ (|E|/|H|) = |H|/|M|. That's about 7,200/4,600 ≈ 1.6 no matter who is friends with whom. Surveys comparing men's and women's average number of opposite-sex partners reported ratios of 1.74 or even 3.3. This argument forces the true ratio to be women ÷ men in the population, about 1.03, so the surveys were measuring something other than behaviour.

### Coloring: scheduling without conflicts

Imagine you're seating wedding guests. Some pairs are feuding and can't share a table, and you want as few tables as possible. Each table is a "color". This is **graph coloring**. A **proper k-coloring** assigns each vertex one of at most k colors so that adjacent vertices always get different colors. The **chromatic number** χ(G) is the smallest k that works.

The registrar has the same problem with exams. Vertices are classes, and an edge joins two classes that share a student. Colors are time slots. Compilers have it too (register allocation: variables that are alive at the same time can't share a register), and so do radio towers (nearby towers need different frequencies). The four-color theorem says every map drawn on paper can be colored with 4 colors.

Proving χ(G) = k takes two halves:
- **Upper bound, χ ≤ k:** show an actual proper k-coloring.
- **Lower bound, χ > k − 1:** argue that no (k − 1)-coloring exists. A triangle, for example, forces 3 different colors.

### Greedy coloring and its guarantee

Deciding whether a graph is even 3-colorable is **NP-complete**. That is believed to be harder than factoring, and an efficient algorithm would win a million-dollar prize. So we settle for good enough. **Greedy coloring** fixes an order v₁, …, vₙ and gives each vertex the smallest color not already used by its colored neighbors. It never creates a conflict, so its result is always proper. But the order matters: one order of the same graph can use 3 colors while another uses 4.

**Theorem.** If every vertex has degree ≤ d, greedy uses at most d + 1 colors, whatever the order.

*Proof by induction on the number of vertices n.* Let P(n) say: "every n-vertex graph with max degree ≤ d gets at most d + 1 colors from greedy."
- **Base case:** with one vertex there are no edges, so greedy uses 1 ≤ d + 1 colors.
- **Inductive step:** assume P(n). **Start with an arbitrary (n+1)-vertex graph G** with max degree ≤ d, in any order. (Building one up from a smaller graph risks missing some.) Greedy colors v₁, …, vₙ while ignoring vₙ₊₁, so it behaves exactly as it would on the subgraph made of those n vertices. That subgraph still has max degree ≤ d, so by P(n) it uses at most d + 1 colors. Finally, vₙ₊₁ has at most d neighbors, so at most d colors are blocked, and one of the colors 1, …, d + 1 is free. ∎

> **Key Insight:** Many questions about graphs come down to counting from two sides (the handshake lemma), and proving an optimum always needs two halves: an example that works and an argument that nothing smaller can.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **Degree** | Number of edges touching a vertex | A vertex of a triangle has degree 2 |
| **Handshake lemma** | The degrees add up to twice the number of edges | Degrees 2, 2, 2 means 3 edges |
| **Kₙ** | n vertices, all pairs joined | K₄ has 6 edges |
| **Bipartite** | The vertices split into two sides, and every edge crosses between them | MIT–Harvard friendships |
| **Chromatic number χ(G)** | The fewest colors in a proper coloring | χ(triangle) = 3 |
| **Greedy coloring** | Color in a fixed order, each vertex taking the smallest free color | Uses ≤ d + 1 colors |

---

## 💻 Code Examples

### Example 1: Checking the handshake lemma and the averages ratio

```python
import random
random.seed(1)

n = 8
edges = [(u, v) for u in range(n) for v in range(u + 1, n) if random.random() < 0.4]
deg = [0] * n
for u, v in edges:
    deg[u] += 1; deg[v] += 1     # one edge adds to BOTH ends, hence the factor 2
print(sum(deg), 2 * len(edges))  # 24 24

# Bipartite: the ratio of averages never depends on who befriends whom.
H, M = 300, 180
E = sum(random.random() < 0.02 for h in range(H) for m in range(M))
print(round((E / M) / (E / H), 3), round(H / M, 3))   # 1.667 1.667
```

**What's happening:** The friendships are random, yet the ratio is always H/M. Change 0.02 and see.

### Example 2: Greedy coloring, where the order matters

```python
from itertools import permutations
from collections import Counter

# 6-cycle 0-1-2-3-4-5-0 plus chord 0-3: max degree 3, chromatic number 2
edges = [(0, 1), (1, 2), (2, 3), (3, 4), (4, 5), (5, 0), (0, 3)]
nbrs = {v: set() for v in range(6)}
for u, v in edges:
    nbrs[u].add(v); nbrs[v].add(u)

def greedy(order):
    color = {}
    for v in order:
        taken = {color[u] for u in nbrs[v] if u in color}  # uncolored neighbors can't conflict yet
        color[v] = min(c for c in range(1, 8) if c not in taken)
    return max(color.values())

print(greedy([0, 1, 2, 3, 4, 5]), greedy([1, 4, 2, 5, 0, 3]))   # 2 4
print(Counter(greedy(p) for p in permutations(range(6))))
# Counter({2: 560, 3: 124, 4: 36})
```

**What's happening:** The graph only needs 2 colors, but a bad order forces greedy all the way up to d + 1 = 4. That's exactly the theorem's bound, and greedy never goes past it.

> **💡 Try it:** Add the edge (1, 4). Is the max degree still 3? Does greedy ever use 5 colors?

---

## ✏️ Hands-On Exercises

### Exercise 1: Even isn't enough (⏱️ ~10 min)

**Goal:** The degrees 3, 3, 3, 1 add up to an even number. Is there a graph with these degrees?

<details>
<summary>Answer</summary>
No. With 4 vertices, a degree-3 vertex is adjacent to all the others, so the last vertex would have degree 3, not 1. An even sum is necessary, but it isn't sufficient.
</details>

### Exercise 2: χ of a 5-cycle (⏱️ ~15 min)

**Goal:** Prove that χ(C₅) = 3. Give both the upper bound and the lower bound.

<details>
<summary>Hint</summary>
For the upper bound, colors 1, 2, 1, 2, 3 work. For the lower bound, two colors would have to alternate around the cycle, and that's impossible on an odd cycle.
</details>

### Exercise 3: Be the registrar (⏱️ ~25 min)

**Goal:** Students take these classes: {Math, CS}, {CS, Bio}, {Bio, Art}, {Art, Math}, {Math, Bio}. Build the conflict graph in Python, color it greedily, then try every order to find χ.

<details>
<summary>Answer</summary>
Math–CS–Bio form a triangle, so χ ≥ 3, and greedy finds a 3-coloring (for example Math 1, CS 2, Bio 3, Art 2). So χ = 3: three exam slots.
</details>

---

## 📖 Curated Resources

1. **Lecture 11: Graphs and Coloring** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=cB0UijRfOCQ
2. **Lecture 11 notes (PDF)** — MIT OpenCourseWare
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec11.pdf
3. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer: the chapter on simple graphs (degrees, coloring)
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/

*MIT OpenCourseWare content, licensed CC BY-NC-SA 4.0.*

---

## 🤔 Reflection Questions

1. **Comprehension:** Why does the induction start from an arbitrary (n+1)-vertex graph rather than build one from a smaller graph?
2. **Application:** Where in your own life do pairwise conflicts limit a schedule?
3. **Connection:** Factoring (Day 10) and 3-coloring both seem hard. Why does that hardness help RSA but hurt the registrar?
4. **Critical Thinking:** Can you find a graph where the bound d + 1 is far above χ?
5. **Personal:** Which statistic have you trusted that a two-sided count would contradict?

---

## ➡️ Next Steps

**Tomorrow:** Matching. Instead of keeping conflicting vertices apart, we pair vertices up, and we'll see the Nobel-winning algorithm that assigns doctors to hospitals.

**Before moving on, make sure you can:**
- [ ] Apply the handshake lemma, including its bipartite version
- [ ] Prove χ(G) = k with both bounds
- [ ] Run greedy coloring and reproduce the d + 1 proof

[← Previous: Day 10 — Cryptography](../week-02/day-10-cryptography.md) | [Course Home](../README.md) | [Next: Day 12 — Matching →](../week-02/day-12-matching.md)
