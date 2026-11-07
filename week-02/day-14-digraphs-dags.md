# Day 14: Digraphs and DAGs

[← Previous: Day 13 — Connectivity and Trees](../week-02/day-13-connectivity-trees.md) | [Course Home](../README.md) | [Next: Day 15 — Relations and Counting →](../week-03/day-15-relations-counting.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Find SCCs and the condensation graph of a digraph
2. Build a topological order and prove one exists
3. Find the fastest parallel schedule

**Difficulty:** 🟡 Intermediate
**Estimated Time:** 1.5 hours (55 min reading + 35 min hands-on)

---

## 📚 Core Concepts

One-way streets, follows, and "A must finish before B" only go one direction. Build systems, spreadsheets, and course prerequisites are graphs of one-way dependencies, and today's maths tells you the right order.

### Directed graphs

A **digraph** has edges that are *ordered* pairs (u, v), drawn as arrows. Loops (v, v) and opposite pairs u → v, v → u are allowed. Degree splits into **in-degree** (arrows in) and **out-degree** (arrows out). Each arrow has one tail and one head, so Σ in-deg = Σ out-deg = |E|.

Walks must follow the arrows, exactly like state-machine executions (Day 4). A loop is now a 1-cycle, and u → v → u a 2-cycle.

We say u **reaches** v when there is a walk from u to v. A walk exists exactly when a path does (cut out loops, as before). Reachability is reflexive and transitive but **not symmetric**: a one-way dead end traps you. Vertices that reach each other are **strongly connected**. Grouping them gives **strongly connected components** (SCCs). Each vertex lies in one SCC, but arrows can run *between* SCCs.

Shrink each SCC to a dot and keep the arrows between them: that is the **condensation graph**. It has no cycles, since a cycle through several SCCs would merge them into one. The Euler theorem also carries over: a digraph has an Euler tour exactly when it is strongly connected and every vertex has in-degree = out-degree: whatever comes in must go out.

### DAGs and topological order

A **DAG** (directed acyclic graph) is a digraph with no cycles. DAGs model **precedence constraints**. The lecture's example is getting dressed: socks before shoes, pants before shoes and belt, shirt before jacket, jacket before scarf and hat, scarf and belt before coat. A cycle of constraints could never be satisfied.

A **topological order** lists every vertex before everything it can reach. A **source** has in-degree 0: nothing needs to happen before it. A **sink** has out-degree 0.

**Lemma:** every DAG has a source and a sink. Take a longest path v0 → … → vk. An arrow u → v0 would create either a cycle (u on the path) or a longer path (u off it), so v0 is a source. Symmetrically, vk is a sink.

**Theorem:** every DAG has a topological order. Induct on |V|; one vertex is trivial. Otherwise remove a source s. What's left is still a DAG (removing a vertex can't create a cycle), so by induction it has an order v1, …, vn−1. Then s, v1, …, vn−1 works. Nothing reaches s, and nothing inside the rest can get back out to s. As an algorithm: do any source, cross it off, repeat.

### Parallel scheduling, chains and antichains

Picture a holiday dinner with plenty of cooks. Dishes whose prerequisites are done can cook at once, but the gravy still waits for the roast, which waits for the oven. A **schedule** assigns each task a time step t(v) such that whenever u ≠ v and u reaches v, t(u) < t(v). Its **span** is the number of distinct time steps used.

**Theorem:** the minimum span equals the number of *vertices* in a longest path. A longest path has to be done one step at a time, so no schedule can beat its vertex count. To see that this many steps is enough, let **depth(v)** be the length of the longest path ending at v, and schedule v at time depth(v).

**Worked proof that depth is a valid schedule.** Suppose u reaches v with u ≠ v. Take a path P from u to v. P has length ≥ 1 because u ≠ v. Also take a longest path Q ending at u, which has length depth(u). Glue Q then P: a walk ending at v, and in a DAG every walk is a path. Its length is depth(u) + len(P) > depth(u). Since depth(v) is the *longest* such length, depth(v) > depth(u). ∎ The depths run from 0 up to the longest path's length, so the span is (longest length) + 1, which is its vertex count. For getting dressed, shirt → jacket → scarf → coat has 4 vertices, so 4 rounds suffice.

Vertices are **comparable** if one reaches the other. A **chain** is a set of mutually comparable vertices (like a sub-path); an **antichain** is a set of mutually incomparable ones (like the sources). Each time step of a schedule is an antichain, so:

**Corollary:** the fewest antichains needed to cover a DAG equals the size of its largest chain. Calendar apps use the mirror fact: columns needed = the largest set of mutually overlapping events.

> **Key Insight:** In a DAG, the longest chain of dependencies, not the total amount of work, sets the limit on how fast parallel workers can finish.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **In/out-degree** | Arrows entering / leaving a vertex | Coat: in 2, out 0 |
| **SCC / condensation** | Mutually reachable block / DAG of blocks | {a,b,c} → {d} |
| **DAG** | Digraph with no cycles | Getting dressed |
| **Source / sink** | In-degree 0 / out-degree 0 | Shirt / hat |
| **Chain / antichain** | All comparable / none comparable | Shirt, jacket / all socks |

---

## 💻 Code Examples

### Example 1: Topological order by peeling sources

```python
edges = [("left sock","left shoe"), ("right sock","right shoe"), ("pants","left shoe"),
         ("pants","right shoe"), ("pants","belt"), ("shirt","belt"), ("shirt","jacket"),
         ("belt","coat"), ("jacket","scarf"), ("jacket","hat"), ("scarf","coat")]
tasks = sorted({x for e in edges for x in e})

indeg = {t: sum(v == t for _, v in edges) for t in tasks}
order, sources = [], [t for t in tasks if indeg[t] == 0]
while sources:
    s = sources.pop()          # any source is safe: nothing must precede it
    order.append(s)
    for u, v in edges:
        if u == s:
            indeg[v] -= 1      # crossing s off may free its successors
            if indeg[v] == 0: sources.append(v)
print(order if len(order) == len(tasks) else "cycle!")
# ['shirt', 'jacket', 'hat', ..., 'left sock', 'left shoe']
```

**What's happening:** The induction proof as a loop. Vertices on a cycle never reach in-degree 0, so the order comes up short.

### Example 2: Depth gives the optimal parallel schedule

```python
# Run this after Example 1: it reuses that example's `edges` and `tasks`.
preds = {t: [u for u, v in edges if v == t] for t in tasks}
depth = {}
def get_depth(v):
    # longest path ending at v; sources get 0
    if v not in depth:
        depth[v] = max((get_depth(u) + 1 for u in preds[v]), default=0)
    return depth[v]

rounds = {}
for t in tasks:
    rounds.setdefault(get_depth(t), []).append(t)
for r in sorted(rounds):
    print(f"time {r}: {rounds[r]}")
# time 0: ['left sock', 'pants', 'right sock', 'shirt']
# time 1: ['belt', 'jacket', 'left shoe', 'right shoe']
# time 2: ['hat', 'scarf']
# time 3: ['coat']
```

**What's happening:** Each round is an antichain; 4 rounds = the 4-vertex longest path.

> **💡 Try it:** Add ("hat","coat"). Does the span change?

---

## ✏️ Hands-On Exercises

### Exercise 1: SCCs by hand (⏱️ ~15 min, pencil-and-paper)

Arrows a→b, b→c, c→a, c→d, d→e, e→d. Find SCCs and the condensation.

<details>
<summary>Answer</summary>
{a, b, c} and {d, e}, with one arrow {a,b,c} → {d,e}.
</details>

### Exercise 2: Detect a cycle (⏱️ ~15 min, coding)

Add ("coat","shirt") to Example 1. Explain the output.

<details>
<summary>Answer</summary>
"cycle!": shirt → jacket → scarf → coat → shirt never yields a source.
</details>

### Exercise 3: Chain or antichain (⏱️ ~20 min, pencil-and-paper)

Why must a 12-task DAG with no chain longer than 3 have 4 tasks that can run together?

<details>
<summary>Hint</summary>
At most 3 antichains cover all 12 tasks, so one holds ≥ 4.
</details>

---

## 📖 Curated Resources

1. **Lecture 14 notes** — MIT OpenCourseWare (CC BY-NC-SA 4.0)
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec14.pdf
   - Why: Full proofs.
2. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/
   - Why: The chapter on directed graphs.
3. **Lecture 14: Digraphs and DAGs** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=E33i67e_X9Q
   - Why: The dressing example.

---

## 🤔 Reflection Questions

1. **Comprehension:** Why is condensation acyclic?
2. **Application:** How should a build tool order work?
3. **Connection:** How is a DAG's source like a tree's leaf?
4. **Critical Thinking:** With 2 cooks, does longest path still decide?
5. **Personal:** What precedence graph hides in your week?

---

## ➡️ Next Steps

**Tomorrow:** Relations and Counting. DAGs return as partial orders, and bijections launch counting.

**Before moving on, make sure you can:**
- [ ] Find SCCs
- [ ] Produce a topological order
- [ ] Explain the span

[← Previous: Day 13 — Connectivity and Trees](../week-02/day-13-connectivity-trees.md) | [Course Home](../README.md) | [Next: Day 15 — Relations and Counting →](../week-03/day-15-relations-counting.md)
