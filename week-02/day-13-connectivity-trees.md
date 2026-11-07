# Day 13: Connectivity and Trees

[← Previous: Day 12 — Matching](../week-02/day-12-matching.md) | [Course Home](../README.md) | [Next: Day 14 — Digraphs and DAGs →](../week-02/day-14-digraphs-dags.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Distinguish walks, paths, and cycles
2. Find connected components
3. Decide from degrees whether an Euler tour or walk exists
4. Prove that an n-vertex tree has n − 1 edges

**Difficulty:** 🟡 Intermediate
**Estimated Time:** 1.5 hours (55 min reading + 35 min hands-on)

---

## 📚 Core Concepts

Map routing, internet packets, and puzzle solvers all ask one question: can I get from here to there? Today we make it precise, then ask when you can trace every edge exactly once, and what makes a tree a tree. "Graph" still means a simple undirected graph.

### Walks, paths, and connectivity

A **walk** is a sequence v0 → v1 → … → vk where each consecutive pair is an edge. Its **length** is k, the number of edges. A lone vertex counts as a walk of length 0. A **path** is a walk with no repeated vertex or edge.

Vertices u and v are **connected** if some walk joins them. Edges have no direction, so any walk can be reversed.

**Claim:** a walk from u to v exists ⟺ a path from u to v exists. A path is already a walk. Conversely, take a *shortest* walk from u to v. If it repeated a vertex (vi = vj, i < j), cutting out the loop between the visits would give a shorter walk, contradicting "shortest". So it is a path, and for connectivity you may use whichever notion is handier.

Connectedness is reflexive (use the length-0 walk), symmetric (reverse the walk), and transitive (join two walks end to end). As a result, a graph splits into **connected components**: groups of vertices that can reach each other and nothing outside the group. The 8-puzzle's state graph has two components: even and odd permutations.

### Cycles and Euler tours

A **closed walk** ends where it started. A **cycle** is a closed walk of positive length that repeats nothing except the start vertex at the end. u → v → u reuses its edge, so it is not a cycle. In a simple graph, cycles have length ≥ 3.

In 1736 Euler asked whether you could cross each of Königsberg's seven bridges exactly once. An **Euler walk** uses every edge exactly once, and an **Euler tour** is an Euler walk that is also closed. Think of a snowplow driver who must clear every street exactly once and finish back at the depot.

**Theorem:** a graph has an Euler tour ⟺ it is connected and every vertex has even degree.

*Necessary:* each time the tour passes through a vertex, it uses one edge to arrive and one to leave. So each vertex's edges are used in pairs, and the tour uses all of them.

*Sufficient (sketch):* take the longest **trail**, a walk that never repeats an edge. Suppose it ended somewhere other than its start. Then the end vertex would have an odd number of used edges, so with even degree one of its edges is still unused, and the trail could be extended. That contradicts "longest", so the trail must be closed. If some edge {u, v} were unused, connectivity gives a path from v to the trail, and u → v → path → around the trail is longer: contradiction again.

**Corollary:** a connected graph has an open Euler walk exactly when two vertices have odd degree, and the walk runs from one of them to the other. The proof is a **reduction**. Add a new vertex x adjacent to both odd vertices, so every degree becomes even. Take an Euler tour of the new graph, then delete x and its two edges. What remains is the walk. The pen-tracing "house" has two odd corners; K4 has four, so it has neither.

### Trees, leaves, and pruning

A **tree** is a connected graph with no cycles. A graph that has no cycles but isn't connected is a **forest**. A **leaf** is a vertex of degree 1.

**Leaf lemma:** every tree with at least 2 vertices has at least 2 leaves. Take a longest path. If an end vertex had a second neighbour, that neighbour would either extend the path or close a cycle. Neither is possible, so both ends are leaves.

**Pruning lemma:** removing a leaf and its edge from a tree leaves a tree. No path between other vertices passes *through* a degree-1 vertex, so nothing gets disconnected.

**Worked proof:** every n-vertex tree has n − 1 edges.

- *Base case:* n = 1. A lone vertex has 0 edges. ✓
- *Inductive step:* let T have n ≥ 2 vertices, and pick a leaf l. Then T − l is a tree with n − 1 vertices, so by induction it has n − 2 edges. Adding back l's single edge gives n − 1. ∎

Prune a *leaf*: deleting a middle vertex could leave a forest, breaking the induction.

> **Key Insight:** One move powers most of today's proofs. Pick the shortest walk, the longest trail, or the longest path, then show that any flaw would let you build a better one.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **Walk / path** | Edge-by-edge vertex sequence / one with no repeats | a→b→d→b / a→b→c |
| **Cycle** | Closed walk, positive length, no other repeats | a→b→c→a |
| **Component** | Maximal mutually reachable vertex set | 8-puzzle: two |
| **Euler tour** | Closed walk using each edge once | Needs even degrees |
| **Tree / leaf** | Connected acyclic graph / degree-1 vertex | A star's tips |

---

## 💻 Code Examples

### Example 1: Connected components

```python
def components(vertices, edges):
    nbrs = {v: set() for v in vertices}
    for u, v in edges:
        nbrs[u].add(v); nbrs[v].add(u)  # undirected: walkable both ways
    left, comps = set(vertices), []
    while left:
        stack = [left.pop()]
        comp = set(stack)
        while stack:
            for y in nbrs[stack.pop()] - comp:
                comp.add(y); stack.append(y)
        left -= comp
        comps.append(sorted(comp))
    return sorted(comps)

print(components("abcdefg", [("a","b"), ("b","c"), ("b","d"), ("f","g")]))
# [['a', 'b', 'c', 'd'], ['e'], ['f', 'g']]
```

**What's happening:** From each unvisited vertex, the search spreads until nothing new is reachable. That set is one component, thanks to transitivity.

### Example 2: The Euler degree test

```python
from collections import Counter

def euler_status(edges):
    deg = Counter(v for e in edges for v in e)
    odd = sorted(v for v in deg if deg[v] % 2 == 1)
    # assumes the graph is connected; the theorem needs that too
    if not odd:
        return "Euler tour"
    if len(odd) == 2:
        return f"Euler walk {odd[0]} to {odd[1]}"
    return f"neither ({len(odd)} odd vertices)"

house = [("a","b"),("a","c"),("b","c"),("b","d"),("c","e"),("d","e"),("b","e"),("c","d")]
k4 = [(u, v) for u in "pqrs" for v in "pqrs" if u < v]
for name, g in [("house", house), ("house+x", house + [("d","x"),("x","e")]), ("K4", k4)]:
    print(name, "->", euler_status(g))
# house -> Euler walk d to e
# house+x -> Euler tour
# K4 -> neither (4 odd vertices)
```

**What's happening:** A degree count replaces a route search. `house+x` is the reduction.

> **💡 Try it:** Delete ("b","c") from `house`. Predict first.

---

## ✏️ Hands-On Exercises

### Exercise 1: Grid tour? (⏱️ ~15 min, pencil-and-paper)

Draw a 3 × 3 grid graph (12 edges). Label degrees. Tour, walk, or neither?

<details>
<summary>Answer</summary>
Corners 2, centre 4, edge-midpoints 3. Four odd vertices, so neither.
</details>

### Exercise 2: Random trees (⏱️ ~20 min, coding)

For k = 2 … n, join k to a random earlier vertex. Verify with `components`: connected, n − 1 edges, ≥ 2 leaves.

<details>
<summary>Hint</summary>
<code>random.randint(1, k - 1)</code> picks the parent.
</details>

### Exercise 3: Prune the wrong vertex (⏱️ ~15 min, pencil-and-paper)

Delete the centre of a star with 4 leaves. Is the result a tree? Which proof step breaks?

<details>
<summary>Answer</summary>
A forest of four vertices; the hypothesis covers only trees.
</details>

---

## 📖 Curated Resources

1. **Lecture 13 notes** — MIT OpenCourseWare (CC BY-NC-SA 4.0)
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec13.pdf
   - Why: Full leaf and pruning proofs.
2. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/
   - Why: The chapter on simple graphs.
3. **Lecture 13: Connectivity and Trees** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=BVpOkj7W_xE
   - Why: The Euler-tour proof, live.

---

## 🤔 Reflection Questions

1. **Comprehension:** Why must a shortest walk be a path?
2. **Application:** A mail carrier walks every street once. What do you check first?
3. **Connection:** How do the 8-puzzle's components relate to parity?
4. **Critical Thinking:** Is the longest-trail proof an algorithm?
5. **Personal:** Where do you meet trees?

---

## ➡️ Next Steps

**Tomorrow:** Digraphs and DAGs. One-way edges break symmetry, and acyclic graphs become the maths of scheduling.

**Before moving on, make sure you can:**
- [ ] Turn a walk into a path
- [ ] Classify a graph as tour, walk, or neither
- [ ] Prove the n − 1 edges fact

[← Previous: Day 12 — Matching](../week-02/day-12-matching.md) | [Course Home](../README.md) | [Next: Day 14 — Digraphs and DAGs →](../week-02/day-14-digraphs-dags.md)
