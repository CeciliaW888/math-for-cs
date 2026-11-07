# Day 04: State Machines

[← Previous: Day 03 — Casework and Strong Induction](../week-01/day-03-casework-strong-induction.md) | [Course Home](../README.md) | [Next: Day 05 — Sums →](../week-01/day-05-sums.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Model a process as a state machine (states, start, transitions)
2. Distinguish a *preserved* predicate from an *invariant*
3. Use the Invariant Principle to prove a puzzle position unreachable
4. Prove termination with a strictly decreasing derived variable

**Difficulty:** 🟡 Intermediate
**Estimated Time:** 1.5 hours (1 hour reading + 30 min hands-on)

---

## 📚 Core Concepts

Every program is a process that changes over time: variables update, lists get rearranged. Two questions always matter: does it give the right answer, and does it ever stop? State machines turn both into things you can prove.

### States, transitions, executions

A **state machine** has three parts: a set of states Q (everything the machine could "remember"), a start state q₀ ∈ Q, and a set T of allowed transitions, written q → r. The simplest example from lecture is a counter: the states are 0, 1, 2, …, it starts at 0, and the only transitions are i → i+1.

An **execution** is a sequence q₀ → q₁ → q₂ → … where every step is a transition in T. It may stop or run forever. A state r is **reachable** if some execution ends at r. If no path of arrows leads to a state, you can never get there.

The 8-puzzle is richer. A state is any arrangement of tiles 1-8 plus a blank in a 3×3 grid (9! of them). A transition slides a neighbouring tile into the blank: at most four moves. The lecture's challenge: start from the solved grid with only 5 and 6 swapped. Can you ever reach the solved grid? You can get close forever without finishing. We want a *proof* that it's impossible.

### Preserved predicates and the Invariant Principle

A **state predicate** P(q) is a true/false statement about a state. P is **preserved** if every transition keeps it true: whenever q → r and P(q) holds, P(r) holds too. P is an **invariant** if it is true in every *reachable* state.

Think of a bishop in chess. Every bishop move keeps it on the same colour of square, so "this bishop is on a light square" is preserved. Start it on a light square and it can never reach a dark one, however clever you are. That's the whole strategy for impossibility proofs: find a property every move respects, show the start has it, and show the target does not.

The **Invariant Principle** makes this formal: if P(q₀) is true and P is preserved, then P is an invariant. It's induction in disguise. Run it on the counter machine and you get back exactly the ordinary induction axiom: P(0) is the base case, and "preserved" is the step P(n) ⇒ P(n+1). To prove it in general, induct on the *length* of executions: an execution of length n is an execution of length n−1 (which ends in a P-state, by hypothesis) followed by one transition (which keeps P true).

So if P is invariant and P(r) is false, r is unreachable.

### Worked proof: the 8-puzzle swap is impossible

Read the tiles in reading order (row by row, skipping the blank). An **inverted pair** is two tiles i < j where j comes before i. Solved has 0 inversions. The 5/6 swap has exactly 1. Let P(q) = "q has an odd number of inverted pairs."

**Claim:** P is preserved.

*Case 1, horizontal move.* Sliding a tile sideways leaves the reading order of the tiles unchanged, so the inversion count is unchanged.

*Case 2, vertical move.* Moving tile i down (or up) one row jumps it over exactly the two tiles between it and the blank in reading order. Think of that as two adjacent swaps. Swapping two neighbours in reading order flips whether that one pair is inverted and changes nothing else, so each swap changes the count by +1 or −1. Two swaps change it by −2, 0 or +2: always an even amount. Odd plus even is odd.

So P is preserved. Starting from the 5/6 swap, P(q₀) is true, so P is an invariant. The solved grid has 0 inversions, so P is false there, which makes it unreachable. ∎

> **Key Insight:** To prove something can never happen, find a property that every single step preserves, then show the start has it and the goal doesn't.

### Termination: derived variables

Invariants show nothing bad happens, not that the machine finishes. Consider **swap sort**: while some neighbouring pair aᵢ > aᵢ₊₁ exists, swap it. A **final state** has no outgoing transitions, and here the final states are exactly the sorted lists. So the machine is **partially correct**: *if* it stops, the answer is right.

To prove it stops, use a **derived variable**: a number x(q) computed from each state. If x always takes values in ℕ and is **strictly decreasing** (every transition lowers it), the machine must terminate, because a non-negative integer can drop by at least 1 only x(q₀) times. For swap sort, x = the number of inverted pairs. Every allowed swap fixes exactly one inversion and creates none, so the count drops by exactly 1. So the number of swaps equals the starting inversion count. Both conditions (integer, never negative) really matter; Exercise 2 shows why.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **Execution** | A sequence of legal transitions starting at q₀ | 0 → 1 → 2 on the counter |
| **Reachable state** | A state some execution ends at | Every n on the counter |
| **Preserved predicate** | Transitions never turn it from true to false | "Odd inversions" (8-puzzle) |
| **Invariant** | True in every reachable state | Preserved + true at start |
| **Derived variable** | A number computed from each state | Inversion count |

---

## 💻 Code Examples

### Example 1: Watching the 8-puzzle invariant

```python
from collections import deque

def inversions(s):
    t = [x for x in s if x]  # the blank (0) has no place in reading order
    return sum(t[i] > t[j] for i in range(8) for j in range(i + 1, 8))

def moves(s):
    b = s.index(0)
    for n in (b - 3, b + 3, b - 1, b + 1):
        # sideways moves must stay in one row, or the blank would wrap around the edge
        if 0 <= n < 9 and (n // 3 == b // 3 or n % 3 == b % 3):
            t = list(s)
            t[b], t[n] = t[n], t[b]
            yield tuple(t)

solved = (1, 2, 3, 4, 5, 6, 7, 8, 0)
seen, queue = {solved}, deque([solved])
while queue:  # moves are reversible, so "reachable from goal" = "can reach goal"
    for nxt in moves(queue.popleft()):
        if nxt not in seen:
            seen.add(nxt)
            queue.append(nxt)
print(len(seen), all(inversions(s) % 2 == 0 for s in seen))
print((1, 2, 3, 4, 6, 5, 7, 8, 0) in seen)
```

Output: `181440 True` then `False`.

**What's happening:** The search finds exactly half of the 9! = 362,880 arrangements, all with even parity. The 5/6 swap is not among them, as the proof predicts.

### Example 2: The derived variable in swap sort

```python
import random

def inversions(a):
    return sum(a[i] > a[j] for i in range(len(a)) for j in range(i + 1, len(a)))

def swap_sort(a):
    a, swaps = list(a), 0
    while bad := [i for i in range(len(a) - 1) if a[i] > a[i + 1]]:
        i = random.choice(bad)  # any legal transition will do; the count must not depend on it
        before = inversions(a)
        a[i], a[i + 1] = a[i + 1], a[i]
        assert inversions(a) == before - 1  # the derived variable has to strictly drop
        swaps += 1
    return a, swaps

start = [3, 6, 2, 5, 4, 1]
print(inversions(start), [swap_sort(start)[1] for _ in range(5)])
```

Output: `10 [10, 10, 10, 10, 10]`

**What's happening:** Swaps are chosen at random, yet every run takes exactly 10, the starting inversion count. The `assert` checks "strictly decreasing" on every transition.

> **💡 Try it:** Use `[6, 5, 4, 3, 2, 1]`. Predict the swap count first.

---

## ✏️ Hands-On Exercises

### Exercise 1: Count inversions by hand (⏱️ ~10 min)

List every inverted pair in the grid `8 1 3 / 4 _ 2 / 7 6 5`. Could it be solvable?

<details>
<summary>Answer</summary>
Reading order 8,1,3,4,2,7,6,5. The 8 beats all 7 later tiles, plus (3,2), (4,2), (7,6), (7,5), (6,5): 12, even. The invariant does not rule it out (and in fact it is solvable).
</details>

### Exercise 2: Break the termination theorem (⏱️ ~15 min)

Find a machine with a strictly decreasing derived variable that never stops. Try states 1, ½, ¼, … and then 0, −1, −2, ….

<details>
<summary>Hint</summary>
The first is not integer-valued; the second goes below 0.
</details>

### Exercise 3: Code an invariant checker (⏱️ ~25 min)

States are pairs (a, b), starting at (0, 0), with moves (a, b) → (a+2, b+1) or (a−1, b+1). Write Python that explores all states within 10 steps and checks "a + b is a multiple of 3". Then prove it by hand. Is (5, 5) reachable?

<details>
<summary>Answer</summary>
Each move adds 3 or 0 to a + b, so the predicate is preserved and starts true. (5, 5) has a + b = 10, so it is unreachable.
</details>

---

## 📖 Curated Resources

1. **Lecture 4: State Machines** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=gVdrFsnOo_s
   - Why: Erik Demaine solves a live 8-puzzle and animates swap sort.
2. **Lecture 4 notes (PDF)** — MIT OpenCourseWare
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec04.pdf
   - Why: Definitions and the proof template, written out.
3. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/
   - Why: The chapter on state machines has more invariant puzzles.

*Course material from MIT OpenCourseWare, licensed CC BY-NC-SA 4.0.*

---

## 🤔 Reflection Questions

1. **Comprehension:** Why does "invariant" only talk about *reachable* states?
2. **Application:** For integer x, what derived variable proves `while x > 0: x -= 2` stops?
3. **Connection:** How is the Invariant Principle the same as Day 2's induction axiom?
4. **Critical Thinking:** Build a tiny machine where a predicate is invariant but not preserved.

---

## ➡️ Next Steps

**Tomorrow:** Sums — closed forms for the totals that algorithm costs add up to.

**Before moving on, make sure you can:**
- [ ] Define states, transitions and reachability
- [ ] Prove an invariant with the preserved + start-true template
- [ ] Prove termination with a natural-number derived variable

[← Previous: Day 03 — Casework and Strong Induction](../week-01/day-03-casework-strong-induction.md) | [Course Home](../README.md) | [Next: Day 05 — Sums →](../week-01/day-05-sums.md)
