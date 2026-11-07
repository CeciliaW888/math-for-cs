# Day 05: Sums

[← Previous: Day 04 — State Machines](../week-01/day-04-state-machines.md) | [Course Home](../README.md) | [Next: Day 06 — Asymptotics →](../week-01/day-06-asymptotics.md)

---

## 🎯 Learning Objectives

By the end of today, you will be able to:

1. Derive the geometric series formula with the perturbation method
2. Find a closed form with an educated guess (ansatz), then check it
3. Evaluate a double sum, including by swapping the order of summation
4. Bound a sum with no closed form using the integral method

**Difficulty:** 🟡 Intermediate
**Estimated Time:** 1.5 hours (1 hour reading + 30 min hands-on)

---

## 📚 Core Concepts

The running time of a loop is a sum: the cost of pass 1, plus pass 2, and so on. Today begins the course's algorithm-analysis unit, and the first skill is turning a sum with "…" or Σ into a **closed form**: an expression with a fixed number of operations you could type into a calculator.

### A lottery prize and the geometric series

Win "$1 million" in a lottery and you might get $50,000 a year for 20 years. That is worth less than $1 million today, because money now can earn interest. With interest rate p, a dollar k years from now is worth 1/(1+p)ᵏ today. Write x = 1/(1+p); the prize is worth

m(1 + x + x² + … + xⁿ⁻¹).

**Guess and check.** If someone hands you a formula, you can prove it by induction. The hard part is finding it.

**Perturbation.** Young Gauss reportedly summed 1 + 2 + … + 100 by writing the sum forwards and backwards and adding: every column totals 101, so twice the sum is 100 × 101. The general trick: change the sum slightly, then combine it with the original so most terms cancel.

Think of comparing two video frames taken a moment apart. Subtract one from the other and everything that stayed still vanishes, leaving only what moved at the edges. That's what perturbation does to a sum.

**Worked derivation.** Let S = 1 + x + x² + … + xⁿ⁻¹. Multiply by x:

- S = 1 + x + x² + … + xⁿ⁻¹
- xS = x + x² + … + xⁿ⁻¹ + xⁿ

Subtract: everything in the middle cancels, so S − xS = 1 − xⁿ, and for x ≠ 1,

S = (1 − xⁿ)/(1 − x).

Then prove it by induction to be safe. With m = $50,000, n = 20, p = 5.33%, the prize is worth about $638,000 today. And $1 a year *forever* is worth only about $20, since xⁿ → 0 leaves 1/(1 − x).

### The ansatz: guess the shape, solve for the details

What is Σ_{k=1}^{n} k²? No obvious trick, but we can guess its *shape*. All n terms are at most n², so S ≤ n³. The top half of the terms are each at least (n/2)², and there are about n/2 of them, so S is at least about n³/8. It behaves like n³ (just as ∫x² dx gives x³/3), so guess a cubic:

S(n) = an³ + bn² + cn + d.

Four unknowns need four facts: S(0) = 0, S(1) = 1, S(2) = 5, S(3) = 14. Solving gives a = 1/3, b = 1/2, c = 1/6, d = 0, so S(n) = n(n+1)(2n+1)/6. The guess is still unproven, so check it: test n = 4 (it gives 30 ✓) and then prove it by induction. If the check fails, the shape was wrong; try another.

### Double sums

Sometimes the thing you're adding is itself a sum. Work inside-out:

Σ_{i=1}^{n} Σ_{j=1}^{i} j = Σ_{i=1}^{n} i(i+1)/2 = ½(Σ i² + Σ i),

and both pieces are now known. It simplifies to n(n+1)(n+2)/6.

A second trick is to **exchange the order of summation**. In Σ_{i=1}^{n} Σ_{j=i}^{n} j, the pairs being added satisfy 1 ≤ i ≤ j ≤ n. Read that same set of pairs with j on the outside: for each j, i runs from 1 to j. The inner sum becomes j added up j times, which is j², so the whole thing is Σ j², which we just solved.

### When there's no closed form: the integral method

Σ_{i=1}^{n} √i has no known closed form. But a sum looks a lot like an integral. For a weakly increasing f, draw width-1 rectangles from 1 to n. Rectangles whose height is f at the left end of each step sit under the curve and have total area S − f(n). Rectangles using the right end sit over it, with area S − f(1). Rearranging, with I = ∫₁ⁿ f(x) dx:

I + f(1) ≤ S ≤ I + f(n)   (f increasing)
I + f(n) ≤ S ≤ I + f(1)   (f decreasing)

For √i, I = (2/3)(n^{3/2} − 1), so S sits in a window of width √n − 1 just above (2/3)n^{3/2}. Compared with a total that grows like n^{3/2}, that's very tight. A decreasing function like 1/x is handled by flipping it left-to-right, which swaps the roles of f(1) and f(n).

For the infinite sum Σ 1/i², taking limits gives 1 ≤ S ≤ 2: only within a factor of 2. The error is always one term of the sum, so add the first few terms exactly and approximate only the tail. With three terms done by hand, the error shrinks to 1/16.

> **Key Insight:** You don't need an exact answer to be useful: guess the shape, pin it down, check it, and when no formula exists, trap the sum between two integrals.

---

## 🔑 Key Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **Closed form** | Expression without "…" or Σ | n(n+1)/2 |
| **Geometric series** | Sum of powers of a fixed x | 1 + x + … + xⁿ⁻¹ |
| **Perturbation** | Shift the sum, combine, cancel | Subtract xS from S |
| **Ansatz** | Guess the form, solve for constants | Cubic for Σ k² |
| **Exchange of summation** | Swap inner and outer index | 1 ≤ i ≤ j ≤ n |
| **Integral method** | Bound a sum by I plus first or last term | Σ √i |

---

## 💻 Code Examples

### Example 1: Pricing the lottery prize

```python
def annuity_brute(m, n, p):
    # Payment k arrives k years from now, so it is worth m / (1+p)^k today.
    return sum(m / (1 + p) ** k for k in range(n))

def annuity_closed(m, n, p):
    x = 1 / (1 + p)
    # Perturbation result: 1 + x + ... + x^(n-1) = (1 - x^n) / (1 - x).
    return m * (1 - x ** n) / (1 - x)

p = 0.0533
print(f"brute : {annuity_brute(50_000, 20, p):,.0f}")
print(f"closed: {annuity_closed(50_000, 20, p):,.0f}")

# $1 a year forever: x^n vanishes, leaving m / (1 - x).
x = 1 / (1 + p)
print(f"$1 forever is worth about ${1 / (1 - x):.2f}")
```

Output:
```
brute : 638,340
closed: 638,340
$1 forever is worth about $19.76
```

**What's happening:** The term-by-term sum and the closed form agree. The closed form costs the same no matter how large n is.

### Example 2: Trapping sums with integrals

```python
import math

def integral_bounds(f, F, n, increasing):
    area = F(n) - F(1)  # exact integral of f from 1 to n, via an antiderivative F
    # The two step functions differ only by the first and last terms, hence these bounds.
    if increasing:
        return area + f(1), area + f(n)
    return area + f(n), area + f(1)

n = 10_000
S = sum(math.sqrt(i) for i in range(1, n + 1))
lo, hi = integral_bounds(math.sqrt, lambda x: 2 / 3 * x ** 1.5, n, increasing=True)
print(f"sum of sqrt(i): {lo:.1f} <= {S:.1f} <= {hi:.1f}")

# For sum 1/i^2 to infinity, the error is one term of the sum, so add the first
# three terms exactly and bound only the tail, whose first term is just 1/16.
head = 1 + 1 / 4 + 1 / 9
tail_area = 1 / 4  # integral of 1/x^2 from 4 to infinity
print(f"sum of 1/i^2: {head + tail_area:.4f} <= S <= {head + tail_area + 1 / 16:.4f}")
print(f"true value pi^2/6 = {math.pi ** 2 / 6:.4f}")
```

Output:
```
sum of sqrt(i): 666667.0 <= 666716.5 <= 666766.0
sum of 1/i^2: 1.6111 <= S <= 1.6736
true value pi^2/6 = 1.6449
```

**What's happening:** The √ bounds are about 99 apart on a total near 667,000. For Σ 1/i², stripping three terms shrinks the window from [1, 2] to about [1.61, 1.67].

> **💡 Try it:** Strip 10 terms instead of 3. How narrow does the window get?

---

## ✏️ Hands-On Exercises

### Exercise 1: Perturb a new sum (⏱️ ~15 min)

Use perturbation to find a closed form for 1 + 3 + 9 + … + 3ⁿ⁻¹. Check n = 3.

<details>
<summary>Answer</summary>
Multiply by 3 and subtract: 3S − S = 3ⁿ − 1, so S = (3ⁿ − 1)/2. For n = 3: 1 + 3 + 9 = 13 = (27 − 1)/2 ✓
</details>

### Exercise 2: Swap the order (⏱️ ~15 min)

Evaluate Σ_{i=1}^{n} Σ_{j=i}^{n} 1 by exchanging the order of summation.

<details>
<summary>Hint</summary>
Pairs satisfy 1 ≤ i ≤ j ≤ n. For fixed j there are j choices of i, so the total is Σ j = n(n+1)/2.
</details>

### Exercise 3: Code an ansatz for Σ k³ (⏱️ ~30 min)

Guess S(n) = an⁴ + bn³ + cn² + dn + e. Use `fractions.Fraction` and S(0)…S(4) to solve for the constants, then check your formula for n up to 500.

<details>
<summary>Answer</summary>
a = 1/4, b = 1/2, c = 1/4, d = e = 0, so S(n) = (n(n+1)/2)²: the square of the sum 1 + 2 + … + n.
</details>

---

## 📖 Curated Resources

1. **Lecture 5: Sums** — MIT OpenCourseWare
   - 🎥 https://www.youtube.com/watch?v=nqOPy2d6ihY
   - Why: Brynmor Chapman works through each method with the class.
2. **Lecture 5 notes (PDF)** — MIT OpenCourseWare
   - 🔗 https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec05.pdf
   - Why: The integral bound pictures, drawn carefully.
3. ***Mathematics for Computer Science*** — Lehman, Leighton, Meyer
   - 🔗 https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/resources/mit6_042js15_textbook/
   - Why: The chapter on sums and asymptotics has many more examples.

*Course material from MIT OpenCourseWare, licensed CC BY-NC-SA 4.0.*

---

## 🤔 Reflection Questions

1. **Comprehension:** Why does the ansatz still need an induction proof?
2. **Application:** A loop does i units of work on pass i, for n passes. What is the total?
3. **Connection:** Swap sort's worst case is 0 + 1 + … + (n−1) swaps. What is that in closed form?
4. **Critical Thinking:** Why can't the integral method be used directly on a function that goes up and down?

---

## ➡️ Next Steps

**Tomorrow:** Asymptotics — the harmonic sum, Stirling's formula, and the language of big O.

**Before moving on, make sure you can:**
- [ ] Derive the geometric series by perturbation
- [ ] Set up and check an ansatz
- [ ] Bound a sum with the integral method

[← Previous: Day 04 — State Machines](../week-01/day-04-state-machines.md) | [Course Home](../README.md) | [Next: Day 06 — Asymptotics →](../week-01/day-06-asymptotics.md)
