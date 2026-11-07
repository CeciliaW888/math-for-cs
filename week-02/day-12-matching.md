# Day 12: Matching

[← Previous: Day 11 — Graphs and Coloring](../week-02/day-11-graphs-coloring.md) | [Course Home](../README.md) | [Next: Day 13 — Connectivity and Trees →](../week-02/day-13-connectivity-trees.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Distinguish maximal, maximum, and perfect matchings
2. Define a rogue pair and a stable matching
3. Run the Gale-Shapley algorithm by hand
4. Prove that Gale-Shapley ends with a stable matching
5. State who it favors: applicants or evaluators

**Difficulty:** 🟡 Intermediate
**Estimated Time:** 1.5 hours (1 hour reading + 30 min hands-on)

---

## 📚 Core Concepts

Every March, tens of thousands of new US doctors learn on the same day which hospital will train them. The assignment comes from an algorithm whose correctness you can prove today with nothing more than invariants and contradiction.

### Matchings: maximal vs maximum

A **matching** in a graph is a set of edges where no two edges share an endpoint. Equivalently, every vertex has degree ≤ 1 in the chosen edges. Matchings show up wherever things pair off: dates, or tasks assigned to servers that can each do one job at a time.

There are two kinds of "big", and the names are confusingly close:

- **Maximal** (a local idea): you can't add any single edge without causing a clash. You get one by adding edges until you're stuck.
- **Maximum** (a global idea): no matching anywhere has more edges.

In the path a–b–c–d, the single middle edge {b, c} is maximal, because both other edges touch it. But {a, b} together with {c, d} is bigger. So maximal doesn't guarantee maximum. To prove a matching is maximum, you argue that no bigger one can exist. The lecture's example did this by noting that a larger matching would need two vertices whose only neighbor is the same vertex.

A **perfect** matching covers every vertex. In a bipartite graph, that requires the two sides to have equal size. There's no perfect matching between Harvard's ~7,200 and MIT's ~4,600 undergrads. Edges can also carry **weights** (costs), and then we might want a perfect matching of minimum total weight. Good news: unlike yesterday's coloring, maximum matchings and min-weight perfect matchings both have efficient algorithms.

### Stable matchings and rogue pairs

Now take n applicants and n evaluators (doctors and hospitals). Each person ranks everyone on the other side in a strict order. Not everyone can get their first choice, so we aim for "happy enough". In a perfect matching, a pair (E, A) who are *not* matched together is a **rogue pair** if each prefers the other to their assigned partner. They'd abandon the plan and pair up. A **stable matching** is a perfect matching with no rogue pairs.

A small example: A and B both prefer C to D, and C and D both prefer A to B. Matching A–D and B–C is unstable, because A and C would leave together. Matching A–C and B–D is stable: A and C both have their top choice, so neither will defect.

Stability isn't automatic. If everyone can rank everyone (no two sides), it can fail. Let A prefer B, then C. Let B prefer C, then A. Let C prefer A, then B. All three put D last. In every pairing, whoever gets D forms a rogue pair with someone. So the two-sided structure is essential.

### The Gale-Shapley algorithm

Think of evaluators as home sellers accepting provisional offers. A seller holds the best offer so far but keeps the listing open. When a better bid arrives, the old buyer is bumped and moves on to the next house on their list.

Each day:
1. Every applicant who isn't currently held approaches their favorite evaluator who hasn't rejected them yet.
2. Each evaluator keeps their favorite among everyone currently in front of them and rejects the rest for good.

Stop when a day passes with no rejections. Gale and Shapley published this in 1962. Roth later applied it to real markets such as medical residency matching, and Shapley and Roth shared the 2012 economics Nobel.

**It terminates.** Treat it as a state machine whose state is the set of rejections so far. Every day before the last adds at least one rejection, and at most n² are possible.

**Two invariants.** Applicants are always rejected by a prefix of their list, so their prospects only get *worse*. An evaluator never trades down, so once E rejects A, E holds someone better than A forever after.

**Everyone gets a partner.** Suppose applicant A ends unmatched. Then A was rejected by all n evaluators, so by the invariant all n of them end holding someone better than A. That needs n other applicants, but only n − 1 exist. Contradiction.

**Worked proof: the result is stable.** Fix an evaluator E with final partner P, and any other applicant A. There are two cases.
- *E rejected A at some point.* By the invariant, E ends with someone better than A, so E won't defect to A.
- *A never approached E.* Applicants go down their lists in order, so A stopped at a partner A ranks above E. So A won't defect to E.

In neither case is (E, A) a rogue pair, so no rogue pair exists. ∎

**Who wins?** Call E and A **feasible partners** if some stable matching pairs them. Gale-Shapley gives every applicant their *best* feasible partner, and every evaluator their *worst*, all at the same time. The key fact is another invariant: if E ever rejects A, they are not feasible partners. That's why running it with the roles swapped usually gives a different stable matching.

> **Key Insight:** Simple local rules (propose down your list; never trade down) produce a global guarantee. And because the proposing side is favored, deciding who proposes is a choice about fairness.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **Matching** | A set of edges with no shared endpoints | {b,c} in path a–b–c–d |
| **Maximal / maximum** | Can't add an edge / no bigger matching exists | {b,c} is maximal; {a,b},{c,d} is maximum |
| **Perfect matching** | A matching that covers every vertex | Needs equal sides if bipartite |
| **Rogue pair** | An unmatched pair who prefer each other to their partners | A and C under A–D, B–C |
| **Stable matching** | A perfect matching with no rogue pairs | A–C, B–D |
| **Feasible partner** | Someone you're paired with in at least one stable matching | Gale-Shapley gives applicants their best one |

---

## 💻 Code Examples

### Example 1: Maximal is not maximum

```python
from itertools import combinations

edges = [("a", "b"), ("b", "c"), ("c", "d")]       # the path a-b-c-d

def is_matching(es):
    ends = [v for e in es for v in e]
    return len(ends) == len(set(ends))              # no vertex used twice

def greedy_maximal(order):
    m = []
    for e in order:
        if is_matching(m + [e]):                    # keep an edge only if it clashes with none
            m.append(e)
    return m

print(greedy_maximal([("b", "c"), ("a", "b"), ("c", "d")]))   # [('b', 'c')]
# Maximum needs a global search: biggest subsets first.
print(next(list(s) for k in (3, 2, 1) for s in combinations(edges, k) if is_matching(s)))
# [('a', 'b'), ('c', 'd')]
```

**What's happening:** Greedy gets stuck after one edge. Only a search over all matchings finds the size-2 one. Real algorithms avoid this brute force.

### Example 2: Gale-Shapley, both directions

```python
def gale_shapley(app_prefs, eval_prefs):
    nxt = {a: 0 for a in app_prefs}            # position each applicant has reached on its list
    held = {}
    while True:
        offers = {}
        for a in app_prefs:
            if a not in held.values():         # only unheld applicants go out
                offers.setdefault(app_prefs[a][nxt[a]], []).append(a)
        if not offers:                         # nobody rejected yesterday: done
            return held
        for e, suitors in offers.items():
            pool = suitors + ([held[e]] if e in held else [])
            held[e] = min(pool, key=eval_prefs[e].index)   # evaluators never trade down
            for a in pool:
                if a != held[e]:
                    nxt[a] += 1                # rejected forever: move down the list

apps = {"A": "XYZ", "B": "YZX", "C": "ZXY"}
evals = {"X": "BCA", "Y": "CAB", "Z": "ABC"}
print(sorted(gale_shapley(apps, evals).items()))  # [('X', 'A'), ('Y', 'B'), ('Z', 'C')]
print(sorted(gale_shapley(evals, apps).items()))  # [('A', 'Z'), ('B', 'X'), ('C', 'Y')]
```

**What's happening:** When the applicants propose, every applicant gets their first choice. Swap the roles and every evaluator gets *theirs*. Both results are stable, and each favors whichever side proposes.

> **💡 Try it:** Print `held` each day and compare the trace with the invariants above.

---

## ✏️ Hands-On Exercises

### Exercise 1: Run it by hand (⏱️ ~15 min)

**Goal:** Applicants A: X>Y>Z, B: X>Z>Y, C: Y>X>Z. Evaluators X: C>A>B, Y: A>C>B, Z: A>B>C. Run Gale-Shapley day by day.

<details>
<summary>Answer</summary>
Day 1: A and B approach X, and C approaches Y. X keeps A and rejects B. Day 2: B approaches Z, and nobody is rejected. Result: X–A, Y–C, Z–B.
</details>

### Exercise 2: No stable roommates (⏱️ ~15 min)

**Goal:** Using the A, B, C, D preferences from Core Concepts, check all three pairings and find a rogue pair in each.

<details>
<summary>Hint</summary>
For A–D and B–C, the rogue pair is A and C: A prefers C to D, and C prefers A to B. The other two pairings are the same situation with the names rotated.
</details>

### Exercise 3: All stable matchings (⏱️ ~30 min)

**Goal:** Write `is_stable(match, apps, evals)` and test all 3! matchings for Example 2's preferences.

<details>
<summary>Answer</summary>
There are three stable matchings: X–A, Y–B, Z–C (best for the applicants); X–B, Y–C, Z–A (best for the evaluators); and X–C, Y–A, Z–B, which sits in between.
</details>

---

## 📖 Curated Resources

1. **Lecture 12: Matching** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=CEd313PPKXQ
2. **Lecture 12 notes (PDF)** — MIT OpenCourseWare
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec12.pdf
3. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer: the chapter on simple graphs (its stable matching section has the full optimality proof)
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/

*MIT OpenCourseWare content, licensed CC BY-NC-SA 4.0.*

---

## 🤔 Reflection Questions

1. **Comprehension:** Why does "everyone gets a partner" need exactly n applicants and n evaluators?
2. **Application:** If you were in a residency match, would you rather be on the proposing side? Why?
3. **Connection:** Termination counted a shrinking resource (rejections left). Where have you seen that trick before?
4. **Critical Thinking:** Why does the non-bipartite example break the stability proof?
5. **Personal:** Where else could a "propose and hold" process replace a negotiation?

---

## ➡️ Next Steps

**Tomorrow:** Connectivity and Trees. We ask when you can get from one vertex to another, and meet trees, the graphs with exactly one route between any two vertices.

**Before moving on, make sure you can:**
- [ ] Tell maximal, maximum, and perfect matchings apart
- [ ] Run Gale-Shapley and spot rogue pairs
- [ ] Reproduce the termination, partner, and stability proofs

[← Previous: Day 11 — Graphs and Coloring](../week-02/day-11-graphs-coloring.md) | [Course Home](../README.md) | [Next: Day 13 — Connectivity and Trees →](../week-02/day-13-connectivity-trees.md)
